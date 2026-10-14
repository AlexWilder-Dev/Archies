import { Link } from 'react-router-dom'
import { HOURS_ROWS } from '../data/hours'
import { site } from '../data/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <Logo className="footer__logo" />
        <div className="footer__cols">
          <div>
            <p className="label">Visit</p>
            <address>
              319–321 Railton Road
              <br />
              Herne Hill, London SE24 0JN
            </address>
            <a className="link" href={site.maps} target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
          <div>
            <p className="label">Hours</p>
            {HOURS_ROWS.map((r) => (
              <p key={r.short} className="footer__row">
                <span>{r.days}</span>
                <span>{r.hours}</span>
              </p>
            ))}
            <p className="footer__soft">Lunch from 12pm · dinner from 5:30pm</p>
          </div>
          <div>
            <p className="label">Contact</p>
            <p>
              <a className="text-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p className="footer__soft">Private hire</p>
            <p>
              <a className="text-link" href={`mailto:${site.hireEmail}`}>
                {site.hireEmail}
              </a>
            </p>
          </div>
          <div>
            <p className="label">Elsewhere</p>
            <ul className="footer__links">
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href={site.giftCards} target="_blank" rel="noreferrer">
                  Gift cards
                </a>
              </li>
              <li>
                <a href={site.sister.url} target="_blank" rel="noreferrer">
                  {site.sister.name}
                </a>
              </li>
              <li>
                <Link to="/private-hire">Private hire</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  )
}
