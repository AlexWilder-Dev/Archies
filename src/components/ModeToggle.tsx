import { motion } from 'framer-motion'
import { useMode } from '../lib/mode'

/** Day / evening switch. Defaults to London time; a tap overrides it for the visit. */
export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, toggle, manual, auto, reset } = useMode()
  const evening = mode === 'evening'
  const hint = manual
    ? `Showing ${mode}. It’s ${auto === 'evening' ? 'evening' : 'daytime'} at Archie’s right now.`
    : `Set by London time: it’s ${auto === 'evening' ? 'evening' : 'daytime'} at Archie’s.`
  return (
    <div className={`mode-toggle ${compact ? 'mode-toggle--compact' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={evening}
        aria-label="Evening mode"
        title={hint}
        className="mode-toggle__btn"
        onClick={toggle}
      >
        <span className="mode-toggle__track" aria-hidden="true">
          <motion.span
            className="mode-toggle__thumb"
            layout
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
            style={{ marginLeft: evening ? 'auto' : 0 }}
          >
            {evening ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        </span>
        {!compact && <span className="mode-toggle__label">{evening ? 'Evening' : 'Daytime'}</span>}
      </button>
      {manual && !compact && (
        <button type="button" className="mode-toggle__reset" onClick={reset}>
          now
        </button>
      )}
    </div>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="12"
          y1="2.6"
          x2="12"
          y2="5.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M15.5 3.2a8.6 8.6 0 1 0 5.3 13.6A7.4 7.4 0 0 1 15.5 3.2Z" fill="currentColor" />
    </svg>
  )
}
