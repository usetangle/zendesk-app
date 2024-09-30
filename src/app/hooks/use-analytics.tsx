import { AnalyticsBrowser } from '@segment/analytics-next'

if (!import.meta.env.VITE_SEGMENT_WRITE_KEY) {
  throw new Error('VITE_SEGMENT_WRITE_KEY is not set')
}

const analytics = AnalyticsBrowser.load({
  writeKey: import.meta.env.VITE_SEGMENT_WRITE_KEY,
  cdnURL: 'https://tcdn.usetangle.com'
})

export function useAnalytics() {
  return analytics
}
