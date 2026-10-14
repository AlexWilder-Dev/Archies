import { Link } from 'react-router-dom'
import { HOURS_ROWS } from '../data/hours'
import { site } from '../data/site'
import { Newsletter } from './home/Extras'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer g-night">
      <div className="wrap">
        <div className="footer__band">
          <div className="footer__news">
            <Newsletter />
          </div>
          <div className="footer__gift">
            <p className="label">Gift cards</p>
            <p>Brunch, dinner or a round of margaritas, bought online.</p>
            <a className="btn btn--sm" href={site.giftCards} target="_blank" rel="noreferrer">
              Buy a gift card
            </a>
          </div>
          <div className="footer__sister">
            <p className="label">Our sister site</p>
            <p>Archie’s Archway, in north London.</p>
            <a className="link" href={site.sister.url} target="_blank" rel="noreferrer">
              archieslondon.co.uk
            </a>
          </div>
        </div>

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
            <p className="label">Get in touch</p>
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
            <p className="label">Follow</p>
            <ul className="footer__links">
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  Instagram {site.instagramHandle}
                </a>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <Link to="/private-hire">Private hire</Link>
              </li>
              <li>
                <Link to="/book">Book a table</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__mark" aria-hidden="true">
        <Logo className="footer__logo" title="" />
      </div>

      <div className="wrap footer__base">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Site by AlexWilder-Dev</span>
      </div>
    </footer>
  )
}
