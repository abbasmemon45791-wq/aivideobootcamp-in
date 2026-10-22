import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { hashEmailForMeta, hashPhoneForMeta, hashData } from '@/lib/tracking'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

    // ── 1. Cryptographic Webhook Signature Verification ──
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        console.error('[Razorpay Webhook] Invalid signature mismatch')
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event

    // We listen for successful payments
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity || event.payload?.order?.entity
      if (!paymentEntity) {
        return NextResponse.json({ received: true })
      }

      const transactionId = paymentEntity.id
      const amount = (paymentEntity.amount ? paymentEntity.amount / 100 : 499)
      const leadId = paymentEntity.notes?.leadId
      const email = paymentEntity.email || paymentEntity.notes?.email
      const contact = paymentEntity.contact || paymentEntity.notes?.whatsapp

      console.log(`[Razorpay Webhook] Processing successful payment ${transactionId} for lead ${leadId || email}`)

      // ── 2. Check if already recorded/approved to prevent duplicates ──
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id, admin_approved')
        .eq('transaction_id', transactionId)
        .maybeSingle()

      if (existingPayment?.admin_approved) {
        return NextResponse.json({ status: 'already_processed' })
      }

      // ── 3. Find lead if leadId wasn't passed directly ──
      let resolvedLeadId = leadId
      if (!resolvedLeadId && email) {
        const { data: matchedLead } = await supabaseAdmin
          .from('leads')
          .select('id')
          .eq('email', email.toLowerCase().trim())
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (matchedLead) resolvedLeadId = matchedLead.id
      }

      // ── 4. Upsert payment record ──
      if (existingPayment) {
        await supabaseAdmin
          .from('payments')
          .update({
            admin_approved: true,
            approved_at: new Date().toISOString(),
            approved_by: 'razorpay_webhook',
            ai_verified: true,
          })
          .eq('id', existingPayment.id)
      } else {
        await supabaseAdmin
          .from('payments')
          .insert({
            lead_id: resolvedLeadId || null,
            transaction_id: transactionId,
            amount: amount,
            admin_approved: true,
            approved_at: new Date().toISOString(),
            approved_by: 'razorpay_webhook',
            ai_verified: true,
            submitted_at: new Date().toISOString(),
          })
      }

      // ── 5. Mark lead as approved ──
      if (resolvedLeadId) {
        await supabaseAdmin
          .from('leads')
          .update({ status: 'approved' })
          .eq('id', resolvedLeadId)
      }

      // ── 6. Fire Server-Side Meta CAPI Purchase ──
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

        if (targets.length > 0 && email) {
          const hashedEmail = hashEmailForMeta(email)
          const hashedPhone = contact ? hashPhoneForMeta(contact) : undefined

          const purchasePayload = {
            data: [
              {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                event_id: transactionId, // Deduplication key
                action_source: 'website',
                event_source_url: `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aivideobootcamp-in.vercel.app').replace(/\/+$/, '')}/enroll`,
                user_data: {
                  em: [hashedEmail],
                  ...(hashedPhone && { ph: [hashedPhone] }),
                },
                custom_data: {
                  currency: 'INR',
                  value: amount,
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
              })
            )
          )
        }
      } catch (capiErr) {
        console.warn('[Razorpay Webhook] Meta CAPI warning:', capiErr)
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error)
    return NextResponse.json({ error: error?.message || 'Webhook processing failed' }, { status: 500 })
  }
}
