import { openStatus } from '../lib/london'
import { useMode } from '../lib/mode'

export function OpenPill({ className = '' }: { className?: string }) {
  const { now } = useMode()
  const s = openStatus(now)
  return (
    <p className={`status ${s.open ? 'status--open' : ''} ${className}`} role="status">
      <span className="status__dot" aria-hidden="true" />
      <span>
        <strong>{s.label}</strong> · {s.detail}
      </span>
    </p>
  )
}
