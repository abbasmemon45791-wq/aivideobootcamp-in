'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackMetaEvent } from '@/lib/meta-tracking'

function TrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackMetaEvent({ eventName: 'PageView' })
  }, [pathname, searchParams])

  return null
}

export default function MetaRouteTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
