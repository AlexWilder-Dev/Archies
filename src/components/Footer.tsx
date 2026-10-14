import { Link } from 'react-router-dom'
import { HOURS_ROWS, SERVICE_ROWS } from '../data/hours'
import { site } from '../data/site'
import { Logo } from './Logo'
import { Mural } from './Decor'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__mural" aria-hidden="true">
        <Mural />
      </div>
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Logo className="footer__logo" />
          <p className="sign footer__place">Herne Hill · SE24</p>
          <p className="footer__tag">All-day Latin American dining. Brunch, lunch, dinner and cocktails on Railton Road.</p>
        </div>

        <div className="footer__cols">
          <div>
            <h2 className="footer__h">Visit</h2>
            <address>
              319–321 Railton Road
              <br />
              London SE24 0JN
            </address>
            <p className="small muted">A minute from Herne Hill station, overlooking Brockwell Park.</p>
            <a className="text-link" href={site.maps} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          </div>
          <div>
            <h2 className="footer__h">Hours</h2>
            {HOURS_ROWS.map((r) => (
              <p key={r.short} className="footer__row">
                <span>{r.short}</span>
                <span>{r.hours}</span>
              </p>
            ))}
            {SERVICE_ROWS.map((r) => (
              <p key={r.label} className="footer__row footer__row--soft">
                <span>{r.label}</span>
                <span>{r.from}</span>
              </p>
            ))}
          </div>
          <div>
            <h2 className="footer__h">Say hello</h2>
            <p>
              <a className="text-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p className="small muted">Private hire and events</p>
            <p>
              <a className="text-link" href={`mailto:${site.hireEmail}`}>
                {site.hireEmail}
              </a>
            </p>
            <p className="footer__social">
              <a href={site.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </p>
          </div>
          <div>
            <h2 className="footer__h">Explore</h2>
            <ul className="footer__links">
              <li>
                <Link to="/book">Book a table</Link>
              </li>
              <li>
                <Link to="/menu">Menus</Link>
              </li>
              <li>
                <Link to="/private-hire">Private hire</Link>
              </li>
              <li>
                <a href={site.giftCards} target="_blank" rel="noreferrer">
                  Gift cards
                </a>
              </li>
              <li>
                <a href={site.sister.url} target="_blank" rel="noreferrer">
                  {site.sister.name} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>
            © {year} {site.name}
          </span>
          <span>Walk-ins welcome · Dogs &amp; families welcome</span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  )
}
