import { cn } from '@/lib/utils'

export type SignalStatus = 'ok' | 'no' | 'loading' | 'error'

interface Props {
  status: SignalStatus
  size?: number
}

export function SignalBadge({ status, size = 36 }: Props) {
  if (status === 'ok') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#22c55e" strokeWidth="2" fill="#052e16" />
        <path d="M11 18l5 5 9-9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (status === 'no') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#ef4444" strokeWidth="2" fill="#450a0a" />
        <path d="M12 12l12 12M24 12l-12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (status === 'error') {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="#6b7280" strokeWidth="2" fill="transparent" strokeDasharray="4 3" />
        <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6b7280">!</text>
      </svg>
    )
  }

  // loading — spinning arc
  return (
    <svg
      width={size} height={size} viewBox="0 0 36 36" fill="none"
      className={cn('animate-spin')}
      style={{ animationDuration: '1.2s' }}
    >
      <circle cx="18" cy="18" r="17" stroke="#374151" strokeWidth="2" />
      <path
        d="M18 1 A17 17 0 0 1 35 18"
        stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
  )
}
