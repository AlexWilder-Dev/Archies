import { Link } from 'react-router-dom'
import { SPACES } from '../../data/hire'
import { site } from '../../data/site'
import { Mural, RoofRibs } from '../Decor'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'

export function HireTeaser() {
  return (
    <section className="section hire-teaser" aria-labelledby="hire-title">
      <div className="hire-teaser__mural" aria-hidden="true">
        <Mural />
      </div>
      <div className="wrap">
        <Reveal className="section__head hire-teaser__head">
          <p className="eyebrow">Private hire &amp; parties</p>
          <h2 id="hire-title" className="h2 neonable">
            Two floors for your party.
          </h2>
          <p>Birthdays, weddings and work dos. Take the mural room upstairs for up to 20, or the whole building for up to 100.</p>
        </Reveal>

        <div className="hire-teaser__cards">
          {SPACES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1} className="space-card">
              <Link to="/private-hire" state={{ scrollTo: s.id }} className="space-card__link">
                <div className="space-card__media">
                  <Photo name={s.photo} shape="arch" sizes="(max-width: 900px) 90vw, 40vw" />
                  {s.id === 'exclusive' && (
                    <div className="space-card__ribs" aria-hidden="true">
                      <RoofRibs count={4} />
                    </div>
                  )}
                </div>
                <div className="space-card__body">
                  <p className="eyebrow">{s.where}</p>
                  <h3 className="h3">{s.name}</h3>
                  <p className="space-card__cap">{s.capacity}</p>
                  <ul className="space-card__features">
                    {s.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <span className="text-link">See the space →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="hire-teaser__foot">
          <p>
            <strong>Feasting menus from £45pp.</strong> One enquiry, one inbox:{' '}
            <a className="text-link" href={`mailto:${site.hireEmail}`}>
              {site.hireEmail}
            </a>
          </p>
          <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn btn--primary">
            Start an enquiry <span className="btn__arrow">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
