/**
 * Dual-Dispatch Meta Tracking Engine for India
 * Dispatches events simultaneously to:
 * 1. Client-side browser fbq('track', ...) with a unique eventID
 * 2. Server-side Meta Conversions API (CAPI) with matching eventID for deduplication
 */

export interface MetaCustomData {
  value?: number
  currency?: string
  content_name?: string
  content_category?: string
  content_ids?: string[]
  num_items?: number
  [key: string]: any
}

export interface MetaUserData {
  email?: string
  phone?: string
  name?: string
  [key: string]: any
}

export interface MetaTrackOptions {
  eventName: 'PageView' | 'Lead' | 'InitiateCheckout' | 'Purchase' | 'AddToCart' | 'ViewContent' | string
  customData?: MetaCustomData
  userData?: MetaUserData
  eventId?: string
}

export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

function getFbq(): any {
  if (typeof window === 'undefined') return null
  const fbq = (window as any).fbq
  return typeof fbq === 'function' ? fbq : null
}

export function trackMetaEvent(options: MetaTrackOptions): string {
  const eventId = options.eventId || generateEventId()
  const fbq = getFbq()

  const currency = options.customData?.currency || 'INR'
  const customDataWithCurrency = {
    ...options.customData,
    currency,
  }

  // 1. Client-Side Browser Pixel Beacon
  if (fbq) {
    try {
      fbq('track', options.eventName, customDataWithCurrency, { eventID: eventId })
    } catch (err) {
      console.warn('[Meta Tracking] Client fbq track failed:', err)
    }
  }

  // 2. Server-Side CAPI
  if (typeof window !== 'undefined') {
    fetch('/api/tracking/meta-capi', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: options.eventName,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        customData: customDataWithCurrency,
        userData: options.userData ?? {},
      }),
    }).catch(err => {
      console.error('[Meta Tracking] CAPI send failed:', err)
    })
  }

  return eventId
}

export const IS_META_BOOST_MODE = process.env.NEXT_PUBLIC_META_BOOST_MODE !== 'false'

export function trackMetaButtonClick(buttonName: string, additionalData?: MetaCustomData) {
  const fbq = getFbq()
  if (fbq) {
    try {
      fbq('trackCustom', 'SubscribedButtonClick', {
        button_name: buttonName,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        currency: 'INR',
        ...(additionalData ?? {}),
      })
    } catch (err) {
      console.warn('[Meta Tracking] Button click track failed:', err)
    }
  }
}

export function trackMetaBoostBeacon(eventName: 'Lead' | 'InitiateCheckout', customData?: MetaCustomData) {
  if (!IS_META_BOOST_MODE) return
  const fbq = getFbq()
  if (fbq) {
    try {
      const boostEventId = generateEventId()
      fbq('track', eventName, {
        currency: 'INR',
        ...(customData ?? {}),
        boost_mode: true,
      }, { eventID: boostEventId })
    } catch (err) {
      console.warn(`[Meta Tracking] Boost beacon for ${eventName} failed:`, err)
    }
  }
}
