import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function getAdminToken(req: NextRequest) {
  return req.headers.get('x-admin-token') ??
         req.cookies.get('admin_token')?.value
}

async function verifyAdmin(req: NextRequest) {
  const token = getAdminToken(req)
  if (!token) return false
  const { data } = await supabaseAdmin
    .from('admin_sessions')
    .select('token')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  return !!data
}

// ── GET: all leads ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const status    = url.searchParams.get('status')
  const source    = url.searchParams.get('source')
  const site      = url.searchParams.get('site') || process.env.NEXT_PUBLIC_SITE_NAME || 'techpulse-in'
  const search    = url.searchParams.get('search')
  const startDate = url.searchParams.get('startDate')
  const endDate   = url.searchParams.get('endDate')
  const page      = parseInt(url.searchParams.get('page') ?? '1')
  const limit     = 50
  const offset    = (page - 1) * limit

  let query = supabaseAdmin
    .from('leads')
    .select(`
      *,
      payments (
        id, screenshot_url, transaction_id, amount, recipient_number,
        sender_name, direction, ai_verified, ai_result,
        submitted_at, admin_approved, admin_note, approved_at
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (source && source !== 'all') query = query.eq('source', source)
  if (site && site !== 'all') {
    query = query.or(`site.eq.${site},utm_content.ilike.%[site:${site}]%`)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,whatsapp.ilike.%${search}%`)
  }

  if (startDate) query = query.gte('created_at', startDate)

  if (endDate) {
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)
    query = query.lt('created_at', end.toISOString())
  }

  const { data, error, count } = await query
  if (error) {
    console.error('[GET /api/admin/leads]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    leads: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}

// ── PATCH: approve or reject lead / payment ────────────────────────────────
export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { leadId, paymentId, action, note } = body

  if (!leadId || !action) {
    return NextResponse.json({ error: 'Missing leadId or action.' }, { status: 400 })
  }

  const newLeadStatus = action === 'approve' ? 'approved' : 'rejected'

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .maybeSingle()

  await supabaseAdmin
    .from('leads')
    .update({ status: newLeadStatus })
    .eq('id', leadId)

  let currentPaymentId = paymentId
  if (!currentPaymentId) {
    const { data: latestPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('lead_id', leadId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (latestPayment) {
      currentPaymentId = latestPayment.id
    }
  }

  let coursePrice = 499

  if (currentPaymentId) {
    await supabaseAdmin
      .from('payments')
      .update({
        admin_approved: action === 'approve',
        admin_note: note,
        approved_at: new Date().toISOString(),
        approved_by: 'admin',
      })
      .eq('id', currentPaymentId)
  } else if (action === 'approve') {
    const match = lead?.utm_content?.match(/\[amount:(\d+)\]/)
    coursePrice = match ? Number(match[1]) : (Number(process.env.COURSE_PRICE) || 499)
    await supabaseAdmin
      .from('payments')
      .insert({
        lead_id: leadId,
        amount: coursePrice,
        admin_approved: true,
        admin_note: note,
        approved_at: new Date().toISOString(),
        approved_by: 'admin',
        ai_verified: false,
      })
  }

  return NextResponse.json({ success: true, status: newLeadStatus })
}
