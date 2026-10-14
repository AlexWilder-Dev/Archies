import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HOURS_ROWS } from '../data/hours'
import { site } from '../data/site'
import { openStatus } from '../lib/london'
import { useMode } from '../lib/mode'
import { Logo } from './Logo'
import { ModeToggle } from './ModeToggle'

const NAV = [
  { to: '/menu', label: 'Menus' },
  { to: '/private-hire', label: 'Private hire' },
  { to: '/', label: 'Find us', scrollTo: 'find-us' },
]

/* The header is the shopfront: olive fascia with the sign, orange awning below. */
export function Header() {
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { now } = useMode()
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
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <div className="fascia">
        <div className="wrap fascia__inner">
          <Link to="/" className="fascia__brand" aria-label="Archie's Herne Hill, home">
            <Logo className="fascia__logo" />
          </Link>
          <nav className="fascia__nav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                state={n.scrollTo ? { scrollTo: n.scrollTo } : undefined}
                end={n.to === '/'}
                className={({ isActive }) => `fascia__link ${isActive && !n.scrollTo ? 'is-active' : ''}`}
              >
                {n.label}
              </NavLink>
            ))}
            <a className="fascia__link" href={site.giftCards} target="_blank" rel="noreferrer">
              Gift cards
            </a>
          </nav>
          <div className="fascia__actions">
            <ModeToggle className="fascia__mode" />
            <Link to="/book" className="btn btn--sm fascia__book">
              Book a table
            </Link>
            <button type="button" className={`burger ${open ? 'is-open' : ''}`} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="awning" aria-hidden={compact}>
        <div className="wrap awning__inner">
          <span>319 – 321 Railton Rd</span>
          <span className="awning__status">
            {status.label} · {status.detail}
          </span>
          <span className="awning__right">All day dining &amp; drinks</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="sheet__nav" aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...NAV, { to: '/book', label: 'Book a table' }].map((n, i) => (
                <motion.div key={n.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  <Link to={n.to} state={'scrollTo' in n && n.scrollTo ? { scrollTo: n.scrollTo } : undefined} className="sheet__link" onClick={() => setOpen(false)}>
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <a className="sheet__link" href={site.giftCards} target="_blank" rel="noreferrer">
                Gift cards
              </a>
            </nav>
            <div className="sheet__info">
              {HOURS_ROWS.map((r) => (
                <p key={r.short}>
                  {r.days} · {r.hours}
                </p>
              ))}
              <p>{site.address.oneLine}</p>
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
