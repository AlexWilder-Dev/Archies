import { Link, useLocation } from 'react-router-dom'

/** Thumb-reach booking bar on phones, on every page but the booking page itself. */
export function MobileBar() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/book')) return null
  const onHire = pathname.startsWith('/private-hire')
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <Link to="/menu" className="mobile-bar__item">
        <MenuIcon />
        Menus
      </Link>
      {onHire ? (
        <button
          type="button"
          className="mobile-bar__primary"
          onClick={() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          Start an enquiry
        </button>
      ) : (
        <Link to="/book" className="mobile-bar__primary">
          Book a table
        </Link>
      )}
      <Link to={onHire ? '/book' : '/private-hire'} className="mobile-bar__item">
        {onHire ? <TableIcon /> : <PartyIcon />}
        {onHire ? 'Book' : 'Hire'}
      </Link>
    </nav>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 21V9a6 6 0 0 1 12 0v12Z" />
      <path d="M9.5 12h5M9.5 15.5h5" />
    </svg>
  )
}
function PartyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10l-5 7Z" />
      <path d="M12 10v8M8.5 21h7" />
    </svg>
  )
}
function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </svg>
  )
}
