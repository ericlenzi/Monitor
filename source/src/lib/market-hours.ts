export function isMarketOpen(): boolean {
  try {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
      hour12: false,
    }).formatToParts(now)

    const weekday = parts.find(p => p.type === 'weekday')?.value ?? ''
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0')
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0')

    if (weekday === 'Sat' || weekday === 'Sun') return false

    const minutes = hour * 60 + minute
    return minutes >= 9 * 60 + 30 && minutes < 16 * 60
  } catch {
    return false
  }
}
