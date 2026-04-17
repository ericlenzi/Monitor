import type { Tendencia, Structure } from '@/lib/strategy'

interface Props {
  iv9d?: number | null
  iv3m?: number | null
  tendencia?: Tendencia | null
  structure?: Structure | null
  callWall?: number | null
  putWall?: number | null
  isLoading?: boolean
  isError?: boolean
}

function Skel() {
  return <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-14 h-3.5 align-middle" />
}

function Err() {
  return <span className="text-gray-400 dark:text-gray-600">—</span>
}

function Sep() {
  return <span className="text-gray-300 dark:text-gray-700 mx-2">·</span>
}

export function DetailLine({ iv9d, iv3m, tendencia, structure, callWall, putWall, isLoading, isError }: Props) {
  const contango = iv9d != null && iv3m != null ? iv9d < iv3m : null
  const showSkel = (v: unknown) => !isError && (isLoading || v == null)

  const tendenciaColor = tendencia === 'Alcista'
    ? 'text-green-600 dark:text-green-400'
    : tendencia === 'Bajista'
    ? 'text-red-500'
    : 'text-gray-500 dark:text-gray-400'

  const structureColor = structure === 'IC'
    ? 'text-blue-600 dark:text-blue-400'
    : structure === 'PCS'
    ? 'text-green-600 dark:text-green-400'
    : structure === 'CCS'
    ? 'text-orange-500'
    : 'text-gray-500'

  return (
    <div className="flex items-center flex-wrap text-sm text-gray-500 dark:text-gray-400 mt-3">

      <span>VIX9D/3M</span>
      <span className="mx-1.5">
        {showSkel(iv9d) || showSkel(iv3m)
          ? <Skel />
          : (isError || iv9d == null || iv3m == null)
          ? <Err />
          : <span className={`font-medium ${contango ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              {(iv9d * 100).toFixed(1)}/{(iv3m * 100).toFixed(1)}
            </span>
        }
      </span>

      <Sep />
      <span>Persistencia 3d</span>
      <Sep />

      <span>Tendencia</span>
      <span className="mx-1.5 text-gray-300 dark:text-gray-600">→</span>
      {showSkel(tendencia) ? <Skel /> : (isError || tendencia == null) ? <Err /> :
        <span className={`font-medium ${tendenciaColor}`}>{tendencia}</span>
      }
      <span className="mx-1.5 text-gray-300 dark:text-gray-600">→</span>
      {showSkel(structure) ? <Skel /> : (isError || structure == null) ? <Err /> :
        <span className={`font-bold ${structureColor}`}>{structure}</span>
      }

      <Sep />

      <span>Call Wall</span>
      <span className="ml-1.5 font-bold text-blue-600 dark:text-blue-400">
        {showSkel(callWall) ? <Skel /> : (isError || callWall == null) ? <Err /> : callWall.toFixed(0)}
      </span>

      <Sep />

      <span>Put Wall</span>
      <span className="ml-1.5 font-bold text-orange-500">
        {showSkel(putWall) ? <Skel /> : (isError || putWall == null) ? <Err /> : putWall.toFixed(0)}
      </span>
    </div>
  )
}
