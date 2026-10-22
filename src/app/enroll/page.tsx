'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, User, Wallet, Check,
  Lock, LoaderCircle, Copy, Shield,
  AlertCircle, Star, Sparkles, CheckCircle2, QrCode, CreditCard, ChevronRight
} from 'lucide-react'
import { trackMetaEvent, trackMetaButtonClick, trackMetaBoostBeacon, IS_META_BOOST_MODE } from '@/lib/meta-tracking'

declare global {
  interface Window {
    Razorpay: any
    fbq?: any
    gtag?: any
  }
}

const BASE_PRICE = 10

const WHATSAPP_SUPPORT = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT ?? '917415562532'

const INDIAN_CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Surat', 'Indore', 'Kochi', 'Noida', 'Gurugram', 'Other'
]

function fireGA4Event(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {[1, 2].map((s) => {
        const done = s < step
        const active = s === step
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all
              ${done ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white' :
                active ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md ring-2 ring-blue-300' :
                'bg-slate-100 text-slate-400'}`}>
              {done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s}
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 0{s}</div>
              <div className={`text-xs font-bold leading-none ${active ? 'text-blue-600' : 'text-slate-700'}`}>
                {s === 1 ? 'Your Details' : 'Payment'}
              </div>
            </div>
            {s === 1 && <div className="h-0.5 w-6 bg-slate-200" />}
          </div>
        )
      })}
    </div>
  )
}

export default function EnrollPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [leadId, setLeadId] = useState<string>('')
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: 'Bengaluru',
    totalAmount: BASE_PRICE,
  })
  const [successPayment, setSuccessPayment] = useState<{ transactionId: string; accessLink: string } | null>(null)

  // ── Session persistence: if customer refreshes after paying, keep their access card visible ──
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ai_bootcamp_in_verified')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.transactionId && parsed.accessLink) {
          setSuccessPayment({ transactionId: parsed.transactionId, accessLink: parsed.accessLink })
          if (parsed.userData) setUserData(parsed.userData)
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    trackMetaEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Enrollment Form India',
        value: BASE_PRICE,
        currency: 'INR',
      }
    })
    fireGA4Event('view_item', { value: BASE_PRICE, currency: 'INR' })
  }, [])

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white font-bold text-xs">AI</div>
            <div className="font-['Sora'] text-sm font-bold tracking-tight text-slate-900">AI Video Bootcamp India 🇮🇳</div>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <Lock className="h-3 w-3" /> 256-Bit SSL Secure
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-xl px-4 py-6 sm:py-10">
        {successPayment ? (
          <SuccessView
            transactionId={successPayment.transactionId}
            accessLink={successPayment.accessLink}
            userData={userData}
          />
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <StepBar step={step} />

            {step === 1 ? (
              <Step1Form
                onComplete={(id, data) => {
                  setLeadId(id)
                  setUserData(data)
                  setStep(2)
                }}
              />
            ) : (
              <Step2Payment
                leadId={leadId}
                userData={userData}
                onBack={() => setStep(1)}
                onSuccess={(txId, link) => {
                  try {
                    sessionStorage.setItem('ai_bootcamp_in_verified', JSON.stringify({
                      transactionId: txId,
                      accessLink: link,
                      userData,
                    }))
                  } catch (e) {}
                  setSuccessPayment({ transactionId: txId, accessLink: link })
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Step 1: User Details Form ───────────────────────────────────────────────
function Step1Form({
  onComplete,
}: {
  onComplete: (leadId: string, data: any) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('Bengaluru')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

  const totalAmount = BASE_PRICE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)

    // ── Prevent double click rapid spam ──
    if (isSubmittingRef.current) return

    if (!name.trim()) { setErr('Please enter your full name.'); return }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setErr('Please enter a valid email address.'); return }
    
    // ── STRICT INDIAN MOBILE NUMBER VALIDATION (10 digits starting with 6,7,8,9) ──
    const digitsOnly = whatsapp.replace(/\D/g, '')
    const cleanPhone = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErr('Please enter a valid 10-digit Indian WhatsApp number (e.g. 9876543210).')
      return
    }

    isSubmittingRef.current = true
    setLoading(true)
    try {
      trackMetaButtonClick('Continue to Payment', { value: totalAmount, currency: 'INR' })

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: cleanPhone,
          city,
          total_amount: totalAmount,
          selected_upsells: [],
          source: 'direct',
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save details.')
      }

      onComplete(data.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: cleanPhone,
        city,
        totalAmount,
      })
    } catch (e: any) {
      setErr(e.message || 'Something went wrong.')
    } finally {
      isSubmittingRef.current = false
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="font-['Sora'] text-xl font-bold text-slate-900 sm:text-2xl">
          Complete Your Enrollment
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Enter your details below to receive instant LMS course access.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. rahul@gmail.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-[11px] text-slate-400">Course login credentials will be emailed here.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-xs font-bold text-slate-600">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="9876543210"
              className="w-full rounded-r-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Valid 10-digit Indian mobile number</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Your City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {INDIAN_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-premium flex w-full items-center justify-between rounded-full p-2 pr-5 text-white shadow-md transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        <div className="rounded-full bg-white/20 px-3.5 py-2 text-xs font-black backdrop-blur-md">
          Total: ₹{totalAmount}
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          {loading ? (
            <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving Details...</>
          ) : (
            <>Continue to Payment <ArrowRight className="h-4 w-4" /></>
          )}
        </div>
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
        <Lock className="h-3 w-3 text-emerald-600" />
        <span>Instant WhatsApp & Email Access • 100% Refund Guarantee</span>
      </div>
    </form>
  )
}

// ─── Step 2: Payment (Razorpay) ──────────────────────────────────────────────
function Step2Payment({
  leadId,
  userData,
  onBack,
  onSuccess,
}: {
  leadId: string
  userData: { name: string; email: string; whatsapp: string; totalAmount: number }
  onBack: () => void
  onSuccess: (txId: string, link: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const isPayingRef = useRef(false)
  const cachedOrderRef = useRef<any>(null)

  useEffect(() => {
    trackMetaEvent({
      eventName: 'InitiateCheckout',
      customData: {
        value: userData.totalAmount,
        currency: 'INR',
        content_name: 'AI Video Bootcamp India',
      },
      userData: {
        email: userData.email,
        phone: userData.whatsapp,
        name: userData.name,
      }
    })
    fireGA4Event('begin_checkout', { value: userData.totalAmount, currency: 'INR' })

    if (IS_META_BOOST_MODE) {
      trackMetaBoostBeacon('InitiateCheckout', {
        value: userData.totalAmount,
        currency: 'INR',
        content_name: 'AI Video Bootcamp India',
      })
    }
  }, [userData])

  // Handle Razorpay Checkout
  const handleRazorpayPayment = async () => {
    // ── Prevent double click / multi-touch order spam ──
    if (isPayingRef.current) return
    isPayingRef.current = true

    setLoading(true)
    setErr(null)

    try {
      trackMetaButtonClick('Razorpay Pay Click', { value: userData.totalAmount, currency: 'INR' })

      // 1. Create or retrieve cached order to avoid orphan duplicate orders
      let orderData = cachedOrderRef.current
      if (!orderData) {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            name: userData.name,
            email: userData.email,
          })
        })

        orderData = await orderRes.json()
        if (!orderRes.ok) {
          throw new Error(orderData.error || 'Failed to initialize Razorpay')
        }
        cachedOrderRef.current = orderData
      }

      // If test demo mode or Razorpay window object is not yet loaded
      if (orderData.isDemo || typeof window.Razorpay === 'undefined') {
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            amount: userData.totalAmount,
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            userData,
            isDemo: true,
          })
        })
        const verifyData = await verifyRes.json()
        
        // Client-side Purchase Tracking
        trackMetaEvent({
          eventName: 'Purchase',
          eventId: verifyData.transactionId,
          customData: {
            value: userData.totalAmount,
            currency: 'INR',
            content_name: 'AI Video Bootcamp India',
          },
          userData: {
            email: userData.email,
            phone: userData.whatsapp,
            name: userData.name,
          }
        })
        fireGA4Event('purchase', {
          transaction_id: verifyData.transactionId,
          value: userData.totalAmount,
          currency: 'INR',
        })

        onSuccess(verifyData.transactionId, verifyData.accessLink)
        return
      }

      // Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AI Video Bootcamp India',
        description: 'Course Enrollment & Lifetime Access',
        order_id: orderData.orderId,
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.whatsapp,
        },
        theme: {
          color: '#2563eb',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                leadId,
                amount: userData.totalAmount,
                userData,
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              // Client-Side Purchase Tracking with 1:1 eventId deduplication
              trackMetaEvent({
                eventName: 'Purchase',
                eventId: response.razorpay_payment_id,
                customData: {
                  value: userData.totalAmount,
                  currency: 'INR',
                  content_name: 'AI Video Bootcamp India',
                },
                userData: {
                  email: userData.email,
                  phone: userData.whatsapp,
                  name: userData.name,
                }
              })
              fireGA4Event('purchase', {
                transaction_id: response.razorpay_payment_id,
                value: userData.totalAmount,
                currency: 'INR',
              })

              onSuccess(verifyData.transactionId, verifyData.accessLink)
            } else {
              setErr(verifyData.error || 'Payment verification failed.')
            }
          } catch (e: any) {
            setErr(e.message || 'Error verifying payment.')
          } finally {
            isPayingRef.current = false
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            isPayingRef.current = false
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setErr(response.error?.description || 'Payment was declined. Please try another UPI app or card.')
        isPayingRef.current = false
        setLoading(false)
      })
      rzp.open()
    } catch (e: any) {
      setErr(e.message || 'Payment initiation failed.')
      isPayingRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Sora'] text-xl font-bold text-slate-900">
            Payment & Activation
          </h2>
          <p className="text-xs text-slate-500">Fast, instant activation via UPI or Cards.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" /> Edit Details
        </button>
      </div>

      {/* Summary Box */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-800">{userData.name}</div>
            <div className="text-xs text-slate-500">{userData.email} • +91 {userData.whatsapp}</div>
            <div className="mt-1 text-[11px] font-semibold text-blue-700">Course: AI Video Bootcamp India (Lifetime Access)</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Payable</div>
            <div className="font-['Sora'] text-2xl font-black text-blue-700">₹{userData.totalAmount}</div>
          </div>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Razorpay Showcase & Pay Button */}
      <div className="space-y-4 pt-1">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Accepted Payment Methods:</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
              Powered by Razorpay
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 font-medium shadow-2xs">
              <span className="text-base">📱</span>
              <div>
                <div className="font-bold text-[11px] text-slate-900">UPI / QR</div>
                <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm, CRED</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 font-medium shadow-2xs">
              <span className="text-base">💳</span>
              <div>
                <div className="font-bold text-[11px] text-slate-900">Cards</div>
                <div className="text-[10px] text-slate-500">RuPay, Visa, MasterCard</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 font-medium shadow-2xs">
              <span className="text-base">🏦</span>
              <div>
                <div className="font-bold text-[11px] text-slate-900">NetBanking</div>
                <div className="text-[10px] text-slate-500">All 50+ Indian Banks</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 font-medium shadow-2xs">
              <span className="text-base">⚡</span>
              <div>
                <div className="font-bold text-[11px] text-slate-900">Wallets & More</div>
                <div className="text-[10px] text-slate-500">Mobikwik, Amazon Pay, etc.</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRazorpayPayment}
          disabled={loading}
          className="btn-premium flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <><LoaderCircle className="h-5 w-5 animate-spin" /> Launching Razorpay Gateway...</>
          ) : (
            <>Pay ₹{userData.totalAmount} via Razorpay <ArrowRight className="h-5 w-5" /></>
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-400">
        Need assistance with payment? <a href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Hi!%20Need%20help%20with%20payment%20enrollment.`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Chat on WhatsApp</a>
      </p>
    </div>
  )
}

// ─── Step 3: Success Screen ──────────────────────────────────────────────────
function SuccessView({
  transactionId,
  accessLink,
  userData,
}: {
  transactionId: string
  accessLink: string
  userData: { name: string; email: string; whatsapp: string; totalAmount: number }
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-10 text-center shadow-lg space-y-5">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm animate-bounce">
        <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
      </div>

      <div>
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          Payment Verified Successfully
        </span>
        <h1 className="mt-2 font-['Sora'] text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Welcome to the Bootcamp, {userData.name.split(' ')[0]}! 🎉
        </h1>
        <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
          Your enrollment for <span className="font-semibold text-slate-800">AI Video Bootcamp India</span> has been confirmed.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2">
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono font-bold text-slate-800">{transactionId}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">Amount Paid</span>
          <span className="font-bold text-emerald-600">₹{userData.totalAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Registered Email</span>
          <span className="font-semibold text-slate-800">{userData.email}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <a
          href={accessLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-extrabold text-white shadow-lg transition hover:scale-[1.01]"
        >
          Access LMS Course Area <ChevronRight className="h-4 w-4" />
        </a>

        <a
          href={`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(`Hi! I just enrolled in AI Video Bootcamp India. Transaction: ${transactionId}. Name: ${userData.name}. Please add me to the private student group!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
        >
          <span>Join Private Student WhatsApp Group</span>
        </a>
      </div>
    </div>
  )
}
