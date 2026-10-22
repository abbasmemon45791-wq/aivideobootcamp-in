import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { hashEmailForMeta, hashPhoneForMeta, hashData } from '@/lib/tracking'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      leadId,
      amount,
      userData,
      isDemo
    } = body

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET

    // ── SECURITY: When Razorpay secret is configured or in production, enforce HMAC signature strictly ──
    if (key_secret || process.env.NODE_ENV === 'production') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing signature verification tokens' }, { status: 400 })
      }

      const generatedSignature = crypto
        .createHmac('sha256', key_secret || '')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generatedSignature !== razorpay_signature) {
        console.error('[Razorpay Verify] Signature mismatch:', {
          received: razorpay_signature,
          generated: generatedSignature,
        })
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    } else if (!isDemo) {
      return NextResponse.json({ error: 'Payment keys not configured' }, { status: 400 })
    }

    const finalAmount = 499 // Fixed official price (₹499)
    const transactionId = razorpay_payment_id || `pay_demo_${Date.now()}`

    // ── DEDUPLICATION: Check if this payment or lead is already approved ──
    const { data: alreadyApproved } = await supabaseAdmin
      .from('payments')
      .select('id, admin_approved, transaction_id')
      .or(`transaction_id.eq.${transactionId},lead_id.eq.${leadId}`)
      .eq('admin_approved', true)
      .maybeSingle()

    if (alreadyApproved) {
      // Already verified and approved! Return success idempotently to prevent duplicate DB writes or CAPI tracking
      return NextResponse.json({
        success: true,
        transactionId: alreadyApproved.transaction_id || transactionId,
        accessLink: process.env.COURSE_ACCESS_LINK || 'https://skool.com/ai-bootcamp-india',
        alreadyApproved: true,
      })
    }

    // 1. Fetch Lead details
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle()

    // 2. Insert or update payments record
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('lead_id', leadId)
      .maybeSingle()

    if (existingPayment) {
      await supabaseAdmin
        .from('payments')
        .update({
          transaction_id: transactionId,
          amount: finalAmount,
          admin_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: 'razorpay_instant',
          ai_verified: true,
        })
        .eq('id', existingPayment.id)
    } else {
      await supabaseAdmin
        .from('payments')
        .insert({
          lead_id: leadId,
          transaction_id: transactionId,
          amount: finalAmount,
          admin_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: 'razorpay_instant',
          ai_verified: true,
          submitted_at: new Date().toISOString(),
        })
    }

    // 3. Mark lead as approved
    await supabaseAdmin
      .from('leads')
      .update({ status: 'approved' })
      .eq('id', leadId)

    // 4. Fire Server-Side Meta CAPI Purchase event
    try {
      const PIXEL_1 = {
        id: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID || '2170349516868440',
        token: process.env.META_ACCESS_TOKEN || '',
      }
      const PIXEL_2 = {
        id: process.env.NEXT_PUBLIC_FB_PIXEL_ID_2 || process.env.NEXT_PUBLIC_META_BACKUP_PIXEL_ID || '',
        token: process.env.META_ACCESS_TOKEN_2 || process.env.META_BACKUP_ACCESS_TOKEN || '',
      }
      const targets = [PIXEL_1, PIXEL_2].filter(t => t.id && t.token)

      const email = lead?.email || userData?.email
      const phone = lead?.whatsapp || userData?.phone
      const name = lead?.name || userData?.name

      if (targets.length > 0 && email) {
        const hashedEmail = hashEmailForMeta(email)
        const hashedPhone = hashPhoneForMeta(phone)
        const nameParts = name ? name.trim().split(/\s+/) : []
        const fn = nameParts[0] ? hashData(nameParts[0].toLowerCase()) : undefined
        const ln = nameParts.length > 1 ? hashData(nameParts.slice(1).join(' ').toLowerCase()) : undefined

        const purchasePayload = {
          data: [
            {
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              event_id: transactionId,
              action_source: 'website',
              event_source_url: `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aivideobootcamp-in.vercel.app').replace(/\/+$/, '')}/enroll`,
              user_data: {
                em: [hashedEmail],
                ...(hashedPhone && { ph: [hashedPhone] }),
                ...(fn && { fn: [fn] }),
                ...(ln && { ln: [ln] }),
              },
              custom_data: {
                currency: 'INR',
                value: finalAmount,
                content_name: 'AI Video Bootcamp India',
                transaction_id: transactionId,
              },
            }
          ]
        }

        await Promise.allSettled(
          targets.map(target =>
            fetch(`https://graph.facebook.com/v19.0/${target.id}/events?access_token=${target.token}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(purchasePayload),
            }).catch(err => console.error('[Razorpay Verify] Meta CAPI error:', err))
          )
        )
      }
    } catch (capiErr) {
      console.warn('[Razorpay Verify] Meta CAPI dispatch warning:', capiErr)
    }

    return NextResponse.json({
      success: true,
      transactionId,
      accessLink: process.env.COURSE_ACCESS_LINK || 'https://skool.com/ai-bootcamp-india',
    })
  } catch (error: any) {
    console.error('[Razorpay Verify Error]:', error)
    return NextResponse.json({ error: error?.message || 'Payment verification failed' }, { status: 500 })
  }
}
