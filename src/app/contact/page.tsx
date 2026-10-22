import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Clock, MapPin, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Contact Us — AI Bootcamp India',
  description: 'Get in touch with the AI Video Bootcamp India student support team via email or WhatsApp.',
}

export default function ContactPage() {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917415562532'
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
            <ShieldCheck className="h-4 w-4" /> Support & Inquiries
          </div>
          <h1 className="mt-3 font-['Sora'] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Contact Student Support
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Have questions about the bootcamp, Razorpay payment, or LMS course access? Our Indian support desk is available 7 days a week.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-['Sora'] font-bold text-slate-900 text-base">Email Support</h3>
            <p className="mt-1 text-xs text-slate-500">For general queries, billing, and refund requests.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-3 inline-block font-medium text-sm text-blue-600 hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-['Sora'] font-bold text-slate-900 text-base">WhatsApp Support</h3>
            <p className="mt-1 text-xs text-slate-500">For urgent enrollment help and payment verification.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-medium text-sm text-emerald-600 hover:underline"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-['Sora'] font-bold text-slate-900 text-base">Operating Hours</h3>
          <div className="grid gap-4 sm:grid-cols-2 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">Support Availability</div>
                <div className="text-slate-500 mt-0.5">Monday – Sunday: 10:00 AM – 10:00 PM IST</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">Headquarters</div>
                <div className="text-slate-500 mt-0.5">Bengaluru, Karnataka, India</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
