import { motion } from 'framer-motion'
import { useState } from 'react'
import { Enquiry } from '../components/hire/Enquiry'
import { Photo } from '../components/Photo'
import { SPACES, type SpaceId } from '../data/hire'
import { FEASTS } from '../data/menu'
import { site } from '../data/site'
import { FeastCard } from './Menu'

const ease = [0.22, 1, 0.36, 1] as const

const SPECS: Record<SpaceId, [string, string][]> = {
  pdr: [
    ['Where', 'First floor'],
    ['Guests', 'Up to 20 seated'],
    ['When', 'Tuesday to Sunday, for brunch, lunch or dinner'],
    ['The room', 'A colourful mural, fabric blinds and views over Brockwell Park. Daylight for brunch, soft lighting in the evening.'],
  ],
  exclusive: [
    ['Where', 'The whole building, both floors'],
    ['Guests', '35 seated or 100 standing'],
    ['When', 'Day hire Tuesday to Friday, evening hire Tuesday to Sunday'],
    ['Included', 'The DJ setup and sound system, and the snug breakout bar'],
  ],
}

export function PrivateHire() {
  const [preset, setPreset] = useState<{ id: SpaceId; n: number } | null>(null)
  const enquire = (id?: SpaceId) => {
    if (id) setPreset((p) => ({ id, n: (p?.n ?? 0) + 1 }))
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="hire">
      <section className="hero hire__hero" aria-labelledby="hire-title">
        <div className="hero__photo">
          <div className="hero__photo-layer">
            <Photo name="party-table-dahlias" shape="none" eager sizes="(max-width: 900px) 100vw, 58vw" position="50% 50%" />
          </div>
        </div>
        <div className="hero__text">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
            <p className="label">Private hire &amp; events</p>
            <h1 id="hire-title" className="t-xl hero__title">
              Parties at Archie’s
            </h1>
            <p className="lede hero__lede">Birthdays, weddings and work dos, in the dining room upstairs or across the whole building, with feasting menus from £45pp.</p>
            <dl className="hire__facts">
              <div>
                <dt>Private Dining Room</dt>
                <dd>Up to 20 seated</dd>
              </div>
              <div>
                <dt>Exclusive hire</dt>
                <dd>35 seated · 100 standing</dd>
              </div>
            </dl>
            <div className="hero__actions">
              <button type="button" className="btn" onClick={() => enquire()}>
                Make an enquiry
              </button>
              <a className="link" href={`mailto:${site.hireEmail}`}>
                {site.hireEmail}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {SPACES.map((s, i) => (
        <section key={s.id} id={s.id} className={`spread space ${i % 2 ? 'spread--flip' : ''}`} aria-labelledby={`${s.id}-title`}>
          <div className="wrap spread__grid">
            <motion.div
              className="spread__text"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease }}
            >
              <p className="label">{s.where}</p>
              <h2 id={`${s.id}-title`} className="t-l">
                {s.name}
              </h2>
              <dl className="specs space__specs">
                {SPECS[s.id].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="spread__actions">
                <button type="button" className="btn" onClick={() => enquire(s.id)}>
                  Enquire about this space
                </button>
              </div>
            </motion.div>
            <motion.figure
              className="frame spread__photo"
              initial={{ clipPath: 'inset(10% 0% 0% 0%)', opacity: 0 }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.2, ease }}
            >
              <Photo name={s.photo} shape="none" sizes="(max-width: 900px) 100vw, 50vw" />
              <figcaption className="caption">{s.id === 'pdr' ? 'The Private Dining Room, first floor' : 'Downstairs, under the arched roof'}</figcaption>
            </motion.figure>
          </div>
        </section>
      ))}

      <section className="wrap hire__feasts" aria-labelledby="feast-menus-title">
        <div className="hire__feasts-head">
          <p className="label">For the whole table</p>
          <h2 id="feast-menus-title" className="t-l">
            Feasting menus
          </h2>
          <p className="spread__intro">Sharing plates to start, then the big plates from the grill, all served with sides. Both menus work upstairs or across the whole building.</p>
        </div>
        <div className="hire__feasts-cards">
          {FEASTS.map((f) => (
            <FeastCard key={f.id} f={f} />
          ))}
        </div>
      </section>

      <section className="enquire" id="enquire" aria-labelledby="enquire-title">
        <div className="wrap enquire__inner">
          <div className="enquire__head">
            <p className="label">Enquire</p>
            <h2 id="enquire-title" className="t-l">
              Tell us about your party
            </h2>
            <p className="spread__intro">Seven short questions. Every enquiry goes to one inbox: {site.hireEmail}</p>
          </div>
          <Enquiry preset={preset} />
        </div>
      </section>
    </div>
  )
}
