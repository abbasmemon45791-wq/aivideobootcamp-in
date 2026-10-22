import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { leadId, name, email } = body

    // ── SECURITY: Hardcode official course price on server to prevent price tampering ──
    const COURSE_PRICE_INR = 10
    const amountInPaise = COURSE_PRICE_INR * 100 // 1000 paise (₹10)

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    // If Razorpay keys are configured, generate real Razorpay order
    if (key_id && key_secret) {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      })

      const receipt = `rcpt_${(leadId || 'ord').slice(0, 14)}_${Date.now().toString().slice(-4)}`
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          leadId: leadId || '',
          name: name ? String(name).slice(0, 50) : '',
          email: email ? String(email).slice(0, 80) : '',
          course: 'AI Video Bootcamp India',
        },
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
      })
    }

    // Sandbox / Test fallback mode when keys are not yet added in environment
    const testOrderId = `order_test_${Date.now()}`
    return NextResponse.json({
      success: true,
      orderId: testOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: key_id || 'rzp_test_placeholder',
      isDemo: true,
      message: 'Razorpay test mode active. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local for live payments.'
    })
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create Razorpay order' }, { status: 500 })
  }
}
