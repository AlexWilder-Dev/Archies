import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { HOURS_ROWS } from '../data/hours'
import { openStatus } from '../lib/london'
import { useMode } from '../lib/mode'
import { Logo } from './Logo'
import { ModeToggle } from './ModeToggle'

const NAV = [
  { to: '/menu', label: 'Menus' },
  { to: '/private-hire', label: 'Private hire' },
  { to: '/', label: 'Find us', scrollTo: 'find-us' },
]

export function Header() {
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { now, mode } = useMode()
  const status = openStatus(now)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    if (y < 40) setCompact(false)
    else if (y > prev + 4) setCompact(true)
    else if (y < prev - 8) setCompact(false)
  })

  useEffect(() => {
    document.documentElement.dataset.compact = String(compact)
  }, [compact])
  useEffect(() => setOpen(false), [loc.pathname, loc.key])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`shopfront ${compact ? 'is-compact' : ''}`}>
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      <div className="fascia">
        <div className="wrap fascia__inner">
          <Link to="/" className="fascia__brand" aria-label="Archie's Herne Hill, home">
            <Logo className="fascia__logo" />
            <span className="fascia__place">Herne Hill</span>
          </Link>

          <nav className="fascia__nav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                state={n.scrollTo ? { scrollTo: n.scrollTo } : undefined}
                className={({ isActive }) => `fascia__link ${isActive && !n.scrollTo ? 'is-active' : ''}`}
                end={n.to === '/'}
              >
                {n.label}
              </NavLink>
            ))}
            <a className="fascia__link" href={site.giftCards} target="_blank" rel="noreferrer">
              Gift cards
            </a>
          </nav>

          <div className="fascia__actions">
            <ModeToggle />
            <Link to="/book" className="btn btn--primary btn--sm fascia__book">
              Book a table
            </Link>
            <button
              type="button"
              className={`burger ${open ? 'is-open' : ''}`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="awning" aria-hidden={compact}>
        <div className="wrap awning__inner">
          <span className="awning__text">319 – 321 Railton Rd</span>
          <span className="awning__status">
            <span className={`awning__dot ${status.open ? 'is-open' : ''}`} />
            {status.label} · {status.detail}
          </span>
          <span className="awning__text awning__text--right">All day dining &amp; drinks</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="sheet"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="sheet__nav" aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...NAV, { to: '/book', label: 'Book a table' }].map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05 }}
                >
                  <Link
                    to={n.to}
                    state={'scrollTo' in n && n.scrollTo ? { scrollTo: n.scrollTo } : undefined}
                    className="sheet__link"
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sheet__link sheet__link--small"
                href={site.giftCards}
                target="_blank"
                rel="noreferrer"
              >
                Gift cards ↗
              </motion.a>
            </nav>
            <div className="sheet__info">
              <div>
                {HOURS_ROWS.map((r) => (
                  <p key={r.short}>
                    <strong>{r.short}</strong> {r.hours}
                  </p>
                ))}
              </div>
              <p>{site.address.oneLine}</p>
              <p>
                <a className="text-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
              <div className="sheet__mode">
                <span className="muted small">{mode === 'evening' ? 'Evening' : 'Daytime'} view</span>
                <ModeToggle compact />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
