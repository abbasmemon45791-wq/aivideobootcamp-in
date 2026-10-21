import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — AI Bootcamp India',
  description: 'How we collect, use, and protect your personal information at AI Video Bootcamp India.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800">
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

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <ShieldCheck className="h-4 w-4" /> Data Protection
          </div>
          <h1 className="mt-3 font-['Sora'] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: 2026 • AI Video Bootcamp India
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">1. Information We Collect</h2>
            <p>
              When you enroll, we collect your name, email address, WhatsApp number, and payment transaction references. We do not store or process your credit/debit card numbers or bank credentials directly; all payments are processed through RBI-authorized payment aggregators (Razorpay).
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">2. How We Use Your Data</h2>
            <p>
              Your data is solely used to deliver course access credentials, send important curriculum updates via email/WhatsApp, and provide student support. We never sell, rent, or trade your personal data with third-party marketers.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">3. Security & Compliance</h2>
            <p>
              We implement industry-standard 256-bit encryption and adhere to applicable Indian digital data protection standards to keep your information secure.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
