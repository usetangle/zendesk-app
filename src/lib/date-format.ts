import { DateTime } from 'luxon'

export function formatDate(date: string, format: 'relative-within-day' | 'relative' | 'absolute' = 'absolute') {
  const dateTime = DateTime.fromISO(date)

  if (format === 'absolute') {
    return dateTime.toFormat('ccc, d MMM yyyy HH:mm')
  }
  // prevent future relative dates
  const dateTimeUpToNow = DateTime.fromMillis(Math.min(dateTime.toMillis(), DateTime.now().toMillis() - 1))
  return format === 'relative-within-day'
    ? DateTime.now().diff(dateTimeUpToNow, 'days').days < 1
      ? dateTimeUpToNow.toRelative()
      : dateTimeUpToNow.toFormat('ccc, d MMM yyyy HH:mm')
    : dateTimeUpToNow.toRelative()
}
