'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles, CheckCircle, ArrowRight, ArrowDown,
  ChevronDown, Shield, Clock, Users, Star, Zap,
  TrendingUp, Lock, Infinity, RefreshCw, MonitorSmartphone,
  HeadphonesIcon, CalendarDays, Wallet, CirclePlay,
  Briefcase, DollarSign, GraduationCap, Rocket, Mic, Check
} from 'lucide-react'
import { trackMetaButtonClick } from '@/lib/meta-tracking'

// ─── Config ─────────────────────────────────────────────────────────────────
const ENROLLED = 1248
const PRICE = 499
const ORIGINAL_PRICE = 2999
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210'
const SUPPORT_EMAIL = 'support@aivideobootcamp.in'

const MODULES = [
  {
    num: '01',
    title: 'Welcome to the Future & AI Creative Stack',
    desc: 'Complete overview of the AI creative ecosystem. Tools installation, interface walkthroughs, setting up your creative workstation, and how modern AI agencies produce work without large crews.'
  },
  {
    num: '02',
    title: 'AI Foundations & Understanding Prompt Logic',
    desc: 'How Generative AI models think and process information: prompt syntax, context windows, latent space, token parameters, and avoiding common output hallucinations.'
  },
  {
    num: '03',
    title: 'Advanced Prompt Engineering Formulas',
    desc: 'The exact structural prompt frameworks used by top creators to generate consistent, photorealistic 8K imagery on Midjourney v6 and Flux every single time.'
  },
  {
    num: '04',
    title: 'AI Product Photography & E-commerce Stills',
    desc: 'Produce studio-grade product photoshoots for Amazon, Flipkart, Shopify, and Indian D2C brands without renting cameras, studio spaces, or lighting equipment.'
  },
  {
    num: '05',
    title: 'Studio AI Voiceovers & Audio Engineering',
    desc: 'ElevenLabs voice cloning, high-converting Hindi/English accents, emotion modulation, and generating background music with Suno AI at zero studio cost.'
  },
  {
    num: '06',
    title: 'AI Video Generation & Cinematic Motion',
    desc: 'Kling AI, Runway Gen-3, Luma Dream Machine, and Pika. Turn still images and text prompts into fluid, hyper-realistic video commercials and reel clips.'
  },
  {
    num: '07',
    title: 'CapCut Pro Editing & Viral Ad Assembly',
    desc: 'Fast desktop & mobile editing workflows, kinetic auto-captions, sound design, hook structuring, and exporting high-bitrate 9:16 vertical reels for Instagram & YouTube.'
  },
  {
    num: '08',
    title: 'Faceless AI Channels & Audience Monetization',
    desc: 'Launch automated faceless YouTube Shorts and Instagram theme pages without ever showing your face. Step-by-step organic growth strategies to reach 50k+ followers.'
  },
  {
    num: '09',
    title: 'Freelancing & Client Acquisition in India & Globally',
    desc: 'Cold outreach scripts for Indian D2C brands and international clients on Upwork, Fiverr & LinkedIn. Pricing your AI video packages, proposal templates, and retainer contracts.'
  },
  {
    num: '10',
    title: 'Reverse-Engineering Viral Ad Campaigns',
    desc: 'How to deconstruct high-converting viral video ads from top global brands, break down their prompts, and recreate high-performing variations in under an hour.'
  },
]

const REVIEWS = [
  {
    name: 'Rahul Sharma',
    city: 'Bengaluru',
    tag: 'Client Work',
    text: 'Delivered my first AI brand commercial for a Bangalore D2C wellness brand within 10 days of completing the course! Client was blown away by the 4K visuals.'
  },
  {
    name: 'Priya Patel',
    city: 'Mumbai',
    tag: 'Content Creator',
    text: 'Product photography and faceless Instagram reels used to take me days. Now I produce a full month of content in a single afternoon. Workflow is 10x faster!'
  },
  {
    name: 'Amit Verma',
    city: 'Delhi NCR',
    tag: 'Viral Reach',
    text: 'Crossed 3.4 million views on an AI historical narrative reel on Instagram! The audio cloning and Kling video modules are pure gold.'
  },
  {
    name: 'Sneha Nair',
    city: 'Kochi',
    tag: 'Freelancing',
    text: 'Closed my first international client on Upwork for $350 doing AI product visuals. Module 9 alone gave me back 50x the course fee.'
  },
  {
    name: 'Rohan Gupta',
    city: 'Pune',
    tag: 'Faceless Page',
    text: 'Scaled my AI theme page from zero to 48k followers in just 5 weeks. No expensive cameras or studio needed — just laptop and internet.'
  },
  {
    name: 'Ananya Iyer',
    city: 'Chennai',
    tag: 'High-Demand Skill',
    text: 'The prompt engineering formulas and free-tool hacks are incredible. The practical clarity in this bootcamp is unmatched by any other course in India.'
  },
]

const FAQS = [
  {
    q: 'How will I receive access to the course after payment?',
    a: 'Instant access! Immediately upon completing your payment via Razorpay (UPI, GPay, PhonePe, Cards, NetBanking), you receive LMS login credentials on your screen, via WhatsApp, and by email. You can start watching right away.'
  },
  {
    q: 'Can I pay via UPI (Google Pay, PhonePe, Paytm)?',
    a: 'Yes, absolutely! Our checkout is powered by Razorpay and supports all Indian UPI apps (Google Pay, PhonePe, Paytm, CRED, BHIM), all Debit/Credit Cards, and NetBanking across all Indian banks.'
  },
  {
    q: 'Is this course suitable for complete beginners?',
    a: '100% yes. You do not need any coding, video editing, or graphic design background. We begin from absolute scratch and guide you click-by-click through every tool.'
  },
  {
    q: 'Do I need an expensive PC or Mac to do this?',
    a: 'No. All modern AI tools run in cloud browsers or mobile apps. Any basic laptop, desktop, or even a smartphone with an internet connection is sufficient.'
  },
  {
    q: 'Do I have to buy expensive subscriptions for AI tools?',
    a: 'No. We teach you free alternatives and include an exclusive bonus module showing proven legal workflows to access premium AI tools (Midjourney, ElevenLabs, Runway) for free.'
  },
  {
    q: 'What is the refund policy?',
    a: 'We offer a 100% hassle-free 7-day money-back guarantee. If you watch the first 4 modules and do not find immense practical value, simply reach out to us for a full refund.'
  },
  {
    q: 'Is this live or self-paced recording?',
    a: 'It is fully self-paced recorded video training with lifetime access. Watch anytime, replay as many times as you want, and receive all future course updates automatically at zero extra cost.'
  },
]

const OUTCOMES = [
  { icon: '📸', title: 'AI Product Photography', tag: 'High Demand', desc: 'Studio-quality product shots for Amazon, Flipkart & D2C brands.' },
  { icon: '🎬', title: 'UGC Talking Video Ads', tag: 'In-Demand Skill', desc: 'Hyper-realistic AI avatars that sell on Instagram & YouTube Ads.' },
  { icon: '✨', title: 'Faceless Personas', tag: 'High Growth', desc: 'Build viral niche theme pages without showing your face on camera.' },
  { icon: '📦', title: 'D2C Creative Kits', tag: 'Recurring Work', desc: 'Monthly bundles of 20-30 ad assets for e-commerce brands.' },
  { icon: '🎙️', title: 'Studio Audio & Voiceovers', tag: 'Global Reach', desc: 'ElevenLabs voice cloning in Hindi, Indian English, and global accents.' },
  { icon: '💎', title: 'Brand Style Systems', tag: 'Agency Level', desc: 'Establish consistent brand aesthetics and visuals for client campaigns.' },
  { icon: '⚡', title: 'High-Retention Reels', tag: 'Fast Turnaround', desc: 'Viral hooks, sound effects, dynamic captions, and fast rendering.' },
  { icon: '🚀', title: 'Performance Ad Creatives', tag: 'High ROI', desc: 'Generate multi-angle creative variations to test in ad campaigns.' },
]

const INCOMES = [
  { icon: <MonitorSmartphone className="h-5 w-5 text-white" />, title: 'AI Product Photography', tag: 'High Demand', desc: 'Produce commercial-grade product shoots for local & D2C brands.' },
  { icon: <Mic className="h-5 w-5 text-white" />, title: 'UGC Talking Video Ads', tag: 'Trending', desc: 'Realistic AI avatars narrating ad scripts for Meta & Instagram campaigns.' },
  { icon: <TrendingUp className="h-5 w-5 text-white" />, title: 'Monthly Brand Retainers', tag: 'Recurring', desc: 'Deliver recurring monthly packs (10 to 30 creative assets per brand).' },
  { icon: <Star className="h-5 w-5 text-white" />, title: 'Faceless AI Channels', tag: 'Scalable Asset', desc: 'Monetize high-engagement YouTube Shorts and Reels with brand deals.' },
]

// ─── Module Accordion ───────────────────────────────────────────────────────
function ModuleAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-2.5">
      {MODULES.map((mod, i) => (
        <div key={i} className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${open === i ? 'border-blue-400 shadow-glow-sm ring-1 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 font-['Sora'] text-xs font-bold text-blue-600">
                Module {mod.num}
              </span>
              <span className="font-['Sora'] text-sm font-bold text-slate-800 sm:text-base">{mod.title}</span>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open === i ? 'rotate-180 text-blue-600' : ''}`} />
          </button>
          {open === i && (
            <div className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600 bg-slate-50/40">
              {mod.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── FAQ Accordion ──────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2.5">
      {FAQS.map((faq, i) => (
        <div key={i} className={`overflow-hidden rounded-xl border transition-colors duration-200 ${open === i ? 'border-blue-200 bg-blue-50/30 shadow-sm' : 'border-slate-200/80 bg-white'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors ${open === i ? 'text-blue-700' : 'text-slate-800'}`}
          >
            {faq.q}
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
          </button>
          {open === i && (
            <div className="border-t border-slate-200/50 px-5 py-3.5 text-sm leading-relaxed text-slate-600 bg-white/70">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── WhatsApp Chat Mockups ──────────────────────────────────────────────────
function WhatsAppChat({ name, avatarInitial, messages }: { name: string, avatarInitial: string, messages: any[] }) {
  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border-8 border-slate-900 bg-[#0B141A] shadow-2xl">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-medium text-white">
        <span>4:16 PM</span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-white/80" />
          <div className="h-2 w-3 rounded-[2px] bg-white/80" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 bg-[#202C33] px-3 py-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 font-bold text-white text-xs">
          {avatarInitial}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm leading-tight">{name}</div>
          <div className="text-[10px] text-white/70">online</div>
        </div>
        <div className="flex gap-3 pr-2 text-white/80">
          <MonitorSmartphone className="h-4 w-4" />
          <HeadphonesIcon className="h-4 w-4" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex h-[440px] flex-col gap-2 overflow-y-auto bg-[#0B141A] p-3 pb-6 relative">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] rounded-lg p-2 text-xs ${msg.isMe ? 'bg-[#005C4B] text-white' : 'bg-[#202C33] text-white'}`}>
              {msg.image && (
                <div className="mb-1.5 overflow-hidden rounded border border-white/10 bg-slate-800 text-center">
                  {msg.image}
                </div>
              )}
              {msg.text && (
                <div className="leading-snug">
                  {msg.text}
                </div>
              )}
              <div className="flex items-center justify-end gap-1 pt-1 text-[9px] text-white/60">
                <span>{msg.time}</span>
                {msg.isMe && <CheckCircle className="h-3 w-3 text-sky-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-[#202C33] p-2">
        <div className="flex-1 rounded-full bg-[#2A3942] px-3.5 py-1.5 text-xs text-white/50">Type a message...</div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#00A884]">
          <Mic className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}

function WhatsAppTestimonials() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:justify-center items-center">
      <WhatsAppChat
        name="Arjun (Batch 1 • Bangalore)"
        avatarInitial="A"
        messages={[
          {
            isMe: false,
            time: '3:45 PM',
            image: (
              <div className="flex h-44 w-full flex-col justify-between bg-slate-900 text-white p-3">
                <div className="text-[10px] font-semibold text-emerald-400">✓ Delivered to Client</div>
                <div>
                  <div className="text-sm font-bold text-slate-100">D2C Beverage Commercial</div>
                  <div className="text-[10px] text-slate-400">4K Render • Studio Lighting</div>
                </div>
                <div className="flex justify-between text-[10px] bg-slate-800/90 rounded p-1.5">
                  <span>Payment</span>
                  <span className="font-bold text-emerald-400">₹18,500 Received</span>
                </div>
              </div>
            ),
            text: 'Bhai pehla client project complete! Bangalore ki D2C brand thi, visuals dekh kar instant payment release kar di! 🔥'
          },
          { isMe: false, time: '3:46 PM', text: 'Module 4 ke lighting prompts exact magazine cover jaisa output de rahe hain.' },
          { isMe: true, time: '3:48 PM', text: 'Amazing work Arjun! Keep scaling it up! 🚀' }
        ]}
      />

      <WhatsAppChat
        name="Neha (Batch 1 • Mumbai)"
        avatarInitial="N"
        messages={[
          { isMe: true, time: '9:12 AM', text: 'Hey Neha! How is your faceless page performing?' },
          {
            isMe: false,
            time: '9:14 AM',
            image: (
              <div className="flex h-44 w-full flex-col justify-between bg-slate-900 text-white p-3">
                <div className="text-[10px] font-semibold text-cyan-400">Instagram Insights</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/90 rounded p-1.5">
                    <div className="text-[9px] text-slate-400">Views</div>
                    <div className="font-bold text-xs text-white">2,840,110</div>
                  </div>
                  <div className="bg-slate-800/90 rounded p-1.5">
                    <div className="text-[9px] text-slate-400">Followers</div>
                    <div className="font-bold text-xs text-white">+14,200</div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold bg-slate-800/80 rounded p-1">
                  1 Reel Went Completely Viral!
                </div>
              </div>
            ),
            text: 'Sir ek reel viral ho gayi! Already 14k followers ho gaye and got my first brand collaboration inquiry!'
          },
          { isMe: false, time: '9:15 AM', text: 'ElevenLabs + Kling motion combo worked like magic.' },
          { isMe: true, time: '9:17 AM', text: 'Proud of your consistency! Next step: launch affiliate links.' }
        ]}
      />
    </div>
  )
}

// ─── Bonuses Component ──────────────────────────────────────────────────────
function BonusesBar() {
  return (
    <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl bg-[#0F172A] p-7 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          5 Exclusive Bonuses Included Free
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          '200+ Production-Ready AI Prompts (Midjourney & Flux)',
          'Legal Workflows to Access Paid AI Tools for Free',
          'Indian Freelancer Invoicing & Payment Setup Guide (Razorpay, Stripe, Wise)',
          'High-Converting Brand Cold Outreach Email Templates',
          'Private Creator Community Access & Lifetime Video Updates'
        ].map((bonus, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="text-slate-200 leading-snug">{bonus}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Landing Page Component ────────────────────────────────────────────
export default function HomePage() {
  const [headerScrolled, setHeaderScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const trackAddToCart = () => {
    trackMetaButtonClick('Enroll Now Click', { value: PRICE, currency: 'INR' })
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800">
      {/* ── Top Announcement Banner ── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 px-4 py-2 text-center text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Special India Launch Offer: Flat 83% OFF — Only ₹{PRICE} Today</span>
          <span className="hidden sm:inline">(Instant Razorpay / UPI Access)</span>
        </span>
      </div>

      {/* ── Sticky Header ── */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${headerScrolled ? 'shadow-sm' : ''} border-b border-slate-200/60 bg-white/90 backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white font-bold text-sm shadow-glow-sm">AI</div>
            <div className="leading-tight">
              <div className="font-['Sora'] text-sm font-bold tracking-tight sm:text-base">AI Bootcamp</div>
              <div className="-mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">India 🇮🇳</div>
            </div>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 md:flex">
            <GraduationCap className="h-3.5 w-3.5" />
            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
            {ENROLLED}+ Indian Creators Enrolled
          </div>

          <Link
            href="/enroll"
            onClick={trackAddToCart}
            className="btn-premium inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white sm:text-sm"
          >
            Enroll Now ₹{PRICE} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section id="top" className="hero-bg relative overflow-hidden dot-grid">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-12 sm:pt-14 md:pt-16">
          
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Practical AI Video & Content Creation Course • 10 Modules
          </span>

          <h1 className="mx-auto mt-4 max-w-4xl text-balance font-['Sora'] text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Master <span className="text-gradient">AI Content Creation</span> — From Scratch to Paid Projects
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-slate-600 sm:text-lg">
            A comprehensive, step-by-step masterclass teaching you to create photorealistic AI product shots, cinematic videos, viral vertical reels, and land high-paying clients. No camera, prior tech skills, or coding required.
          </p>

          {/* Pricing & CTA */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/enroll"
              onClick={trackAddToCart}
              className="btn-premium inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"
            >
              Enroll Now — ₹{PRICE} <span className="text-xs font-normal opacity-80 line-through">₹{ORIGINAL_PRICE}</span> <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#curriculum"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              View Curriculum <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 sm:text-sm">
            {['100% Money-back guarantee', 'Lifetime access & updates', 'Instant UPI / Razorpay Checkout'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> {t}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
            {[
              { val: '10', label: 'Actionable Modules' },
              { val: 'Self-Paced', label: 'Learn on Laptop or Mobile' },
              { val: `₹${PRICE}`, label: 'Special Launch Price' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white px-3 py-4 text-center">
                <div className="text-gradient font-['Sora'] text-base font-bold leading-tight sm:text-2xl">{s.val}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Outcomes Grid ── */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Skills You Will Master
          </div>
          <h2 className="mt-3 font-['Sora'] text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Build High-Ticket AI Creative Work
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Practical skills in high demand right now across Indian marketing agencies, D2C brands, and global freelancing platforms.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OUTCOMES.map((o, i) => (
              <div key={i} className="flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-xs card-premium-hover">
                <div className="text-3xl">{o.icon}</div>
                <h3 className="mt-3 font-['Sora'] font-bold text-slate-900 text-base">{o.title}</h3>
                <div className="mt-0.5 text-xs font-bold text-blue-600">{o.tag}</div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Income Potential & Roadmap ── */}
      <section className="bg-slate-50/80 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Income Opportunities
            </div>
            <h2 className="mt-3 font-['Sora'] text-2xl font-bold text-slate-900 sm:text-4xl">
              Monetize Your AI Skills in India
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
              How students are generating side income and full-time freelance careers using these exact workflows.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCOMES.map((inc, i) => (
              <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs card-premium-hover">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600">
                  {inc.icon}
                </div>
                <h3 className="mt-3 font-['Sora'] text-sm font-bold text-slate-900 leading-tight">{inc.title}</h3>
                <div className="mt-0.5 text-xs font-bold text-blue-600">{inc.tag}</div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{inc.desc}</p>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Your 4-Phase Roadmap
            </div>
            <h3 className="mt-2 font-['Sora'] text-xl font-bold text-slate-900 sm:text-3xl">
              From Beginner to Paid AI Creator
            </h3>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { phase: 'PHASE 1', step: '01', title: 'Foundations', desc: 'Master the prompt logic, cloud tools, and core workflows.' },
              { phase: 'PHASE 2', step: '02', title: 'First 4K Asset', desc: 'Generate your first commercial-grade visuals and build a portfolio.' },
              { phase: 'PHASE 3', step: '03', title: 'First Paid Client', desc: 'Use our cold outreach scripts and proposal templates to close clients.' },
              { phase: 'PHASE 4', step: '04', title: 'Scale & Retainers', desc: 'Manage monthly creative subscriptions (₹25k - ₹80k/mo).' },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs relative pt-9 card-premium-hover">
                <div className="absolute -top-3 left-5 rounded-full bg-[#1A233A] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-widest">
                  {r.phase}
                </div>
                <div className="font-['Sora'] text-3xl font-extrabold text-blue-600">{r.step}</div>
                <h4 className="mt-1 font-['Sora'] text-base font-bold text-slate-900">{r.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum (10 Modules) ── */}
      <section id="curriculum" className="px-4 py-12 sm:px-6 sm:py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Full Curriculum
            </div>
            <h2 className="mt-3 font-['Sora'] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              10 Actionable Modules. Zero Fluff.
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Every lesson is structured around building portfolio-ready commercial assets that clients pay for.
            </p>
          </div>

          <div className="mt-8">
            <ModuleAccordion />
          </div>

          {/* Bonus Card */}
          <div className="mt-6 overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">✨ Bonus Included</div>
                <h4 className="mt-1 font-['Sora'] text-lg font-bold text-slate-900">Secret Methods to Access Paid AI Tools for Free</h4>
                <p className="mt-1 text-xs text-slate-600">Legal, proven methods to access premium image & video tools at zero cost.</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium text-slate-400 line-through">₹2,500 value</div>
                <div className="text-gradient font-['Sora'] text-xl font-bold">FREE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Student Results & WhatsApp Showcase ── */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Real Student Conversations
            </div>
            <h2 className="mt-3 font-['Sora'] text-2xl font-bold text-slate-900 sm:text-4xl">
              Inside Our Student WhatsApp Community
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
              See actual wins, viral view milestones, and client payments from our Indian batch students.
            </p>
          </div>

          <WhatsAppTestimonials />
        </div>
      </section>

      {/* ── Student Testimonial Cards ── */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Student Reviews
            </div>
            <h2 className="mt-3 font-['Sora'] text-2xl font-bold text-slate-900 sm:text-4xl">
              What Indian Creators Say
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-['Sora'] text-sm font-bold text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-400">{r.city}, India</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">{r.tag}</span>
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">&ldquo;{r.text}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enrollment Pricing Card ── */}
      <section id="enroll" className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-white p-6 shadow-glow sm:p-10">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                <GraduationCap className="h-3.5 w-3.5" /> Full Course Enrollment • India Batch
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <div className="font-['Sora'] text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                  ₹{PRICE}
                </div>
                <div className="text-sm font-semibold text-slate-400 line-through">
                  ₹{ORIGINAL_PRICE}
                </div>
                <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  83% OFF TODAY
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                One-time payment • No recurring charges • Lifetime access • Free future updates
              </p>

              <Link
                href="/enroll"
                onClick={trackAddToCart}
                className="btn-premium mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-md transition hover:scale-[1.01]"
              >
                Enroll Now — ₹{PRICE} <ArrowRight className="h-5 w-5" />
              </Link>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5 text-emerald-600" /> Secure 256-Bit Razorpay Checkout (UPI, Cards, NetBanking)
              </p>

              {/* Course Features Grid */}
              <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { icon: <Wallet className="h-4 w-4 text-blue-600" />, label: 'Fee', val: `₹${PRICE}` },
                  { icon: <Clock className="h-4 w-4 text-blue-600" />, label: 'Duration', val: '10+ Hours' },
                  { icon: <Infinity className="h-4 w-4 text-blue-600" />, label: 'Access', val: 'Lifetime' },
                  { icon: <RefreshCw className="h-4 w-4 text-blue-600" />, label: 'Updates', val: 'Free Forever' },
                  { icon: <MonitorSmartphone className="h-4 w-4 text-blue-600" />, label: 'Format', val: 'Phone & PC' },
                  { icon: <CirclePlay className="h-4 w-4 text-blue-600" />, label: 'Pace', val: 'Self-Paced' },
                  { icon: <HeadphonesIcon className="h-4 w-4 text-blue-600" />, label: 'Support', val: 'WhatsApp' },
                  { icon: <CalendarDays className="h-4 w-4 text-blue-600" />, label: 'Year', val: '2026 Edition' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center">
                    {item.icon}
                    <div className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">{item.label}</div>
                    <div className="mt-0.5 font-['Sora'] text-xs font-bold text-slate-800">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <BonusesBar />
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Frequently Asked Questions
            </div>
            <h2 className="mt-3 font-['Sora'] text-2xl font-bold text-slate-900 sm:text-4xl">
              Everything You Need to Know
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="bg-[#0F172A] px-4 py-14 text-white sm:px-6 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <Clock className="mx-auto h-8 w-8 text-cyan-400 mb-4" />
          <h2 className="font-['Sora'] text-3xl font-extrabold sm:text-5xl">
            Start Building Practical <span className="text-cyan-400">AI Skills</span> Today.
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-md mx-auto sm:text-base">
            Join 1,200+ Indian creators who have transformed their creative workflows and started getting paid clients.
          </p>
          <Link
            href="/enroll"
            onClick={trackAddToCart}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-9 py-4 text-base font-bold text-white shadow-xl transition-transform hover:scale-105"
          >
            Enroll Now — ₹{PRICE} <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-3 text-xs text-slate-400">
            Backed by 7-Day 100% Money-Back Guarantee
          </div>
        </div>
      </section>

      {/* ── Legal & Educational Disclaimer ── */}
      <div className="bg-slate-100 border-t border-slate-200 px-4 py-6 sm:px-6 space-y-2">
        <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-slate-500">
          <strong>Educational Disclaimer:</strong> AI Video Bootcamp India is a digital educational training program. Results depend entirely on individual practice, dedication, skill execution, and client market conditions. We make no guarantees of specific income, earnings, or financial results. See our <Link href="/terms" className="underline hover:text-slate-700">Terms of Service</Link>, <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>, and <Link href="/refund" className="underline hover:text-slate-700">Refund Policy</Link>.
        </p>
        <p className="mx-auto max-w-4xl text-center text-[10px] leading-relaxed text-slate-400">
          <strong>Trademark Notice:</strong> All product names, logos, and brands (including Midjourney, ElevenLabs, Runway, Kling, Suno, CapCut, Razorpay) are property of their respective owners. AI Video Bootcamp India is an independent educational course and is not affiliated with or endorsed by these platforms.
        </p>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-10 text-white/70 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white font-bold text-sm">AI</div>
            <div>
              <div className="font-['Sora'] text-sm font-bold text-white">AI Video Bootcamp India 🇮🇳</div>
              <div className="text-[11px] text-white/50">
                Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-400 hover:underline">{SUPPORT_EMAIL}</a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-white/60 hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact Us</Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">WhatsApp Support</a>
          </div>
          <div className="text-xs text-white/40">© 2026 AI Video Bootcamp India. All rights reserved.</div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I have a question about AI Video Bootcamp India.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.834h-.004c-1.271-.05-2.521-.349-3.67-.877l-.263-.119-2.727.716.73-2.66-.172-.273a7.53 7.53 0 0 1-1.16-4.03c0-4.188 3.406-7.592 7.594-7.592 4.188 0 7.592 3.404 7.592 7.592 0 4.188-3.404 7.593-7.592 7.593m6.743-13.831c-1.807-1.808-4.209-2.804-6.765-2.804-5.27 0-9.56 4.29-9.56 9.56 0 1.683.439 3.321 1.271 4.762l-1.351 4.94 5.051-1.324a9.55 9.55 0 0 0 4.589 1.173c5.27 0 9.56-4.29 9.56-9.56 0-2.556-.996-4.958-2.795-6.767" />
        </svg>
      </a>
    </div>
  )
}
