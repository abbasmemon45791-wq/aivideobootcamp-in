import { NextRequest, NextResponse } from 'next/server'
import { hashEmailForMeta, hashPhoneForMeta, hashData } from '@/lib/tracking'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventName, eventId, eventSourceUrl, customData, userData } = body

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'Missing eventName or eventId' }, { status: 400 })
    }

    const PIXEL_1 = {
      id: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID || '2170349516868440',
      token: process.env.META_ACCESS_TOKEN || '',
    }

    const PIXEL_2 = {
      id: process.env.NEXT_PUBLIC_FB_PIXEL_ID_2 || process.env.NEXT_PUBLIC_META_BACKUP_PIXEL_ID || '',
      token: process.env.META_ACCESS_TOKEN_2 || process.env.META_BACKUP_ACCESS_TOKEN || '',
    }

    const targets = [PIXEL_1, PIXEL_2].filter(t => t.id && t.token)

    if (targets.length === 0) {
      return NextResponse.json({ ok: true, note: 'No Meta Pixels/Tokens configured' })
    }

    // Extract networking signals
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
               req.headers.get('x-real-ip')?.trim() ??
               '127.0.0.1'
    const userAgent = req.headers.get('user-agent') ?? 'unknown'

    // Extract Meta click (_fbc) and browser (_fbp) cookies
    const cookieHeader = req.headers.get('cookie') ?? ''
    const fbc = cookieHeader.match(/_fbc=([^;]+)/)?.[1]
    const fbp = cookieHeader.match(/_fbp=([^;]+)/)?.[1]

    const user_data: Record<string, any> = {
      client_ip_address: ip,
      client_user_agent: userAgent,
      ...(fbc && { fbc }),
      ...(fbp && { fbp }),
    }

    if (userData?.email && typeof userData.email === 'string' && userData.email.trim()) {
      const hashed = hashEmailForMeta(userData.email)
      if (hashed) user_data.em = [hashed]
    }

    if (userData?.phone) {
      const hashedPhone = hashPhoneForMeta(userData.phone)
      if (hashedPhone) user_data.ph = [hashedPhone]
    }

    if (userData?.name) {
      const parts = userData.name.trim().split(/\s+/)
      if (parts[0]) user_data.fn = [hashData(parts[0].toLowerCase())]
      if (parts.length > 1) user_data.ln = [hashData(parts.slice(1).join(' ').toLowerCase())]
    }

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl || req.headers.get('referer') || `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aivideobootcamp-in.vercel.app').replace(/\/+$/, '')}/enroll`,
      action_source: 'website',
      user_data,
      custom_data: {
        currency: 'INR',
        ...(customData || {}),
      },
    }

    const sendPromises = targets.map(target =>
      fetch(`https://graph.facebook.com/v19.0/${target.id}/events?access_token=${target.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [eventPayload] }),
      }).then(async r => {
        const json = await r.json()
        return { pixelId: target.id, ok: r.ok, status: r.status, data: json }
      }).catch(err => ({ pixelId: target.id, ok: false, error: err.message }))
    )

    const results = await Promise.allSettled(sendPromises)
    return NextResponse.json({ success: true, eventId, results })
  } catch (err: any) {
    console.error('[Meta CAPI Route Exception]', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
