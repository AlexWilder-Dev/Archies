import { openStatus } from '../lib/london'
import { useMode } from '../lib/mode'

export function OpenPill({ className = '' }: { className?: string }) {
  const { now } = useMode()
  const s = openStatus(now)
  return (
    <span className={`pill ${s.open ? 'pill--open' : 'pill--closed'} ${className}`} role="status">
      <span className="pill__dot" aria-hidden="true" />
      <span>
        <strong>{s.label}</strong> · {s.detail}
      </span>
    </span>
  )
}
