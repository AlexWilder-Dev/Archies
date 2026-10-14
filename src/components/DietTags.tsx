import { DIET_KEY, type Diet } from '../data/menu'

const LABEL: Record<Diet, string> = { v: 'v', vg: 'vg', gf: 'gf', 'gf*': 'gf*', 'v*': 'v*' }

export function DietTags({ diet }: { diet?: Diet[] }) {
  if (!diet?.length) return null
  return (
    <span className="diet">
      {diet.map((d) => (
        <abbr key={d} className={`tag tag--${d.replace('*', '')}`} title={DIET_KEY[d]}>
          {LABEL[d]}
        </abbr>
      ))}
    </span>
  )
}
