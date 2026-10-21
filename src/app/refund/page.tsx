import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Mail, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Refund Policy — AI Bootcamp India',
  description: 'Our 100% money-back guarantee and refund policy. Simple, transparent, and hassle-free.',
}

export default function RefundPage() {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210'
  const SUPPORT_EMAIL = 'support@aivideobootcamp.in'

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl font-bold text-sm text-white gradient-brand">AI</div>
            <div className="leading-tight">
              <div className="font-['Sora'] text-sm font-bold tracking-tight sm:text-base">AI Bootcamp</div>
              <div className="-mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">India 🇮🇳</div>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <ShieldCheck className="h-4 w-4" /> Transparency & Protection
          </div>
          <h1 className="mt-3 font-['Sora'] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: 2026 • AI Video Bootcamp India
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 mb-8 text-sm leading-relaxed text-slate-700">
          <h3 className="font-['Sora'] font-bold text-slate-900 text-base mb-2">Our 100% Risk-Free Guarantee</h3>
          <p>
            We stand behind the practical quality of our training. If you enroll in AI Video Bootcamp India, watch the initial curriculum, and feel the course does not deliver practical value, we offer a straightforward, no-hassle refund under the terms below.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">1. Refund Eligibility Window</h2>
            <p>
              You are eligible for a 100% full refund within <strong>7 days of enrollment</strong> provided you have evaluated the initial modules (up to Module 4). This gives you sufficient time to assess the teaching quality and hands-on exercises completely risk-free.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">2. Razorpay & UPI Processing</h2>
            <p>
              Once your refund request is approved, the refund is initiated directly via Razorpay back to the original payment source (UPI ID, bank account, or card) within <strong>3 to 5 business days</strong> per standard banking processing cycles in India.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">3. How to Request a Refund</h2>
            <p>
              Simply email our student desk at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 underline">{SUPPORT_EMAIL}</a> or message us on WhatsApp with your registered email and payment transaction ID. No complex paperwork or interrogation.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
