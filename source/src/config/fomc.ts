// FOMC meeting dates 2026 (confirmed schedule)
export const FOMC_DATES_2026: string[] = [
  '2026-01-28',
  '2026-03-18',
  '2026-05-06',
  '2026-06-17',
  '2026-07-29',
  '2026-09-16',
  '2026-10-28',
  '2026-12-16',
]

export function nextFomcDays(): number | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const date of FOMC_DATES_2026) {
    const fomc = new Date(date)
    const diff = Math.ceil((fomc.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff >= 0) return diff
  }
  return null
}
