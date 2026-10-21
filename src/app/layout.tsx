import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Sora, Plus_Jakarta_Sans } from 'next/font/google'
import MetaRouteTracker from '@/components/MetaRouteTracker'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '700', '800'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['500', '600', '700'] })

export const metadata: Metadata = {
  title: 'AI Video Bootcamp India — Master AI Content & Video Creation',
  description: 'India\'s premier practical AI video & content creation course. Master Midjourney, Kling, Runway, ElevenLabs & CapCut. Create viral ads, product shoots & land freelance clients. Just ₹499.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aivideobootcamp-in.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'AI Video Bootcamp India — Master Practical AI Content Creation',
    description: 'Learn practical AI video generation, prompt engineering, and client acquisition. ₹499 one-time payment. Lifetime access.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || 'G-ZGRD9GQF40'

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jakarta.variable}`}>
      <body className="font-['Plus_Jakarta_Sans',Inter,sans-serif] antialiased bg-[#fafafa] text-slate-900">
        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Meta Pixel (Dual-Pixel: Primary & Secondary / Backup) */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            ${process.env.NEXT_PUBLIC_FB_PIXEL_ID ? `fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');` : ''}
            ${process.env.NEXT_PUBLIC_FB_PIXEL_ID_2 ? `fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID_2}');` : ''}
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Analytics 4 (GA4) */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}

        <MetaRouteTracker />
        {children}
      </body>
    </html>
  )
}
