import { useState } from 'react'
import { Enquiry } from '../components/hire/Enquiry'
import { Mural, RoofRibs, Vine } from '../components/Decor'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { SPACES, type SpaceId } from '../data/hire'
import { FEASTS } from '../data/menu'
import { site } from '../data/site'
import { FeastCard } from './Menu'

export function PrivateHire() {
  const [preset, setPreset] = useState<{ id: SpaceId; n: number } | null>(null)
  const enquire = (id?: SpaceId) => {
    if (id) setPreset((p) => ({ id, n: (p?.n ?? 0) + 1 }))
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="hire">
      <section className="hire-hero">
        <div className="hire-hero__mural" aria-hidden="true">
          <Mural />
        </div>
        <div className="wrap hire-hero__inner">
          <div className="hire-hero__text">
            <p className="eyebrow">Private hire &amp; events</p>
            <h1 className="display">Bring everyone. We’ll feed them.</h1>
            <p className="lede">The mural room upstairs for up to 20, or the whole building for up to 100. Feasting menus from £45 a head, a DJ setup and a snug bar for later.</p>
            <div className="hero__ctas">
              <button type="button" className="btn btn--primary" onClick={() => enquire()}>
                Start an enquiry <span className="btn__arrow">→</span>
              </button>
              <a className="btn btn--ghost" href={`mailto:${site.hireEmail}`}>
                {site.hireEmail}
              </a>
            </div>
            <dl className="hire-hero__facts">
              <div>
                <dt>Private Dining Room</dt>
                <dd>up to 20 seated</dd>
              </div>
              <div>
                <dt>Exclusive hire</dt>
                <dd>35 seated · 100 standing</dd>
              </div>
              <div>
                <dt>Feasting</dt>
                <dd>£45pp · £55pp</dd>
              </div>
            </dl>
          </div>
          <div className="hire-hero__visual">
            <Photo name="private-dining-room-mural" shape="arch" eager className="hire-hero__main" sizes="(max-width: 900px) 70vw, 34vw" />
            <Photo name="party-table-dahlias" shape="round" className="hire-hero__small" sizes="(max-width: 900px) 40vw, 16vw" />
            <Vine className="hire-hero__vine" length={0.7} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="spaces-title">
        <div className="wrap">
          <Reveal className="section__head">
            <p className="eyebrow">The spaces</p>
            <h2 id="spaces-title" className="h2 neonable">
              Upstairs, or the whole lot.
            </h2>
          </Reveal>
          <div className="spaces">
            {SPACES.map((s, i) => (
              <Reveal key={s.id} className={`space ${i % 2 ? 'space--flip' : ''}`} id={s.id}>
                <div className="space__media">
                  <Photo name={s.photo} shape="arch" sizes="(max-width: 900px) 90vw, 46vw" />
                  {s.id === 'exclusive' && (
                    <div className="space__ribs" aria-hidden="true">
                      <RoofRibs count={6} />
                    </div>
                  )}
                </div>
                <div className="space__copy">
                  <p className="eyebrow">{s.where}</p>
                  <h3 className="h2">{s.name}</h3>
                  <p className="space__cap">{s.capacity}</p>
                  <p className="space__blurb">{s.blurb}</p>
                  <ul className="space__list">
                    {s.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <p className="space__avail">
                    <strong>Available:</strong> {s.availability}
                  </p>
                  <button type="button" className="btn btn--primary" onClick={() => enquire(s.id)}>
                    Enquire about this space <span className="btn__arrow">→</span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="feast-menus-title">
        <div className="wrap">
          <Reveal className="section__head">
            <p className="eyebrow">Feasting menus</p>
            <h2 id="feast-menus-title" className="h2 neonable">
              Two ways to feast.
            </h2>
            <p>Sharing plates for the middle of the table, followed by the big plates from the grill, all served with sides.</p>
          </Reveal>
          <div className="hire-feasts">
            {FEASTS.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.1}>
                <FeastCard f={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section enquire" id="enquire" aria-labelledby="enquire-title">
        <div className="wrap enquire__inner">
          <div className="enquire__head">
            <p className="eyebrow">Enquire</p>
            <h2 id="enquire-title" className="h2 neonable">
              Tell us about your party.
            </h2>
            <p className="muted">Seven quick questions. Everything goes to one place: {site.hireEmail}.</p>
          </div>
          <Enquiry preset={preset} />
        </div>
      </section>
    </div>
  )
}
