import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — AI Bootcamp India',
  description: 'Terms and conditions governing the enrollment and use of AI Video Bootcamp India digital training.',
}

export default function TermsPage() {
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
            <ShieldCheck className="h-4 w-4" /> Legal Agreement
          </div>
          <h1 className="mt-3 font-['Sora'] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: 2026 • AI Video Bootcamp India
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">1. Overview</h2>
            <p>
              By enrolling in AI Video Bootcamp India, you agree to comply with and be bound by these Terms of Service. This course is an educational resource designed to impart practical skills in generative AI video and creative media production.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">2. Intellectual Property & Access</h2>
            <p>
              Enrollment grants you a personal, non-transferable, lifetime license to access the training modules, prompt packs, and video tutorials. Redistribution, re-selling, or unauthorized public broadcasting of the course material is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">3. Earnings & Educational Disclaimer</h2>
            <p>
              Any income examples, client case studies, or testimonial figures shared are illustrative of what dedicated individuals have accomplished. We do not guarantee specific income or business outcomes. Your success depends on your dedication, portfolio quality, and client negotiations.
            </p>
          </div>

          <div>
            <h2 className="font-['Sora'] text-lg font-bold text-slate-900 mb-1.5">4. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, India.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
