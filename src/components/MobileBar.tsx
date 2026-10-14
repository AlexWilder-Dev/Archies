import { Link, useLocation } from 'react-router-dom'

/** Booking within thumb's reach on phones, on every page but the booking page. */
export function MobileBar() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/book')) return null
  const onHire = pathname.startsWith('/private-hire')
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <Link to={onHire ? '/book' : '/menu'} className="mobile-bar__item">
        {onHire ? 'Book a table' : 'Menus'}
      </Link>
      {onHire ? (
        <button type="button" className="mobile-bar__primary" onClick={() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          Enquire
        </button>
      ) : (
        <Link to="/book" className="mobile-bar__primary">
          Book a table
        </Link>
      )}
    </nav>
  )
}
