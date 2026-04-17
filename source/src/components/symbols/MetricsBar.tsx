import React from 'react'
import { nextFomcDays } from '@/config/fomc'
import type { ReactNode } from 'react'

interface Props {
  ivAtm?: number | null
  ivRank?: number | null
  gexDisplay?: string | null
  zgl?: number | null
  isLoading?: boolean
  isError?: boolean
}

function Skel() {
  return <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-14 h-5" />
}

function Err() {
  return <span className="text-gray-400 dark:text-gray-600 text-sm">—</span>
}

function MetricCol({ label, value, valueClass = 'text-gray-900 dark:text-gray-100' }: {
  label: string; value: ReactNode; valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      <span className={`text-base font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  )
}

export function MetricsBar({ ivAtm, ivRank, gexDisplay, zgl, isLoading, isError }: Props) {
  const fomcDays = nextFomcDays()

  const ivRankColor = ivRank !== null && ivRank !== undefined
    ? (ivRank >= 25 && ivRank <= 65
        ? 'text-green-600 dark:text-green-400'
        : 'text-orange-500')
    : 'text-gray-900 dark:text-gray-100'

  const val = (loading: boolean, v: unknown, render: () => React.ReactNode) => {
    if (loading) return <Skel />
    if (isError || v == null) return <Err />
    return render()
  }

  return (
    <div className="flex items-center gap-10">
      <MetricCol
        label="IV ATM"
        value={val(!!isLoading, ivAtm, () => `${((ivAtm as number) * 100).toFixed(1)}%`)}
      />
      <MetricCol
        label="IV Rank"
        value={val(!!isLoading, ivRank, () => Math.round(ivRank as number))}
        valueClass={ivRankColor}
      />
      <MetricCol
        label="GEX"
        value={val(!!isLoading, gexDisplay, () => gexDisplay)}
        valueClass="text-teal-600 dark:text-teal-400"
      />
      <MetricCol
        label="ZGL"
        value={val(!!isLoading, zgl, () => (zgl as number).toFixed(0))}
      />
      <MetricCol
        label="FOMC"
        value={fomcDays !== null ? `${fomcDays}d` : '—'}
        valueClass="text-blue-600 dark:text-blue-400"
      />
    </div>
  )
}
