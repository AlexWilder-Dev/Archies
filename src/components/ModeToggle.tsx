import { useMode } from '../lib/mode'

/** Day / evening. Set by London time; a tap overrides it for the visit. */
export function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, toggle, auto, manual } = useMode()
  const hint = `It’s ${auto === 'evening' ? 'evening' : 'daytime'} at Archie’s${manual ? '' : ' right now'}`
  return (
    <button type="button" className={`mode sign ${className}`} onClick={toggle} aria-label={`Showing ${mode}. Switch to ${mode === 'day' ? 'evening' : 'day'}`} title={hint}>
      <span className={mode === 'day' ? 'is-on' : ''}>Day</span>
      <span className="mode__sep" aria-hidden="true" />
      <span className={mode === 'evening' ? 'is-on' : ''}>Evening</span>
    </button>
  )
}
