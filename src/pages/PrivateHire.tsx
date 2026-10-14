import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Enquiry } from '../components/hire/Enquiry'
import { Pinned } from '../components/Marks'
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
    ['When', 'Tuesday to Sunday · brunch, lunch or dinner'],
    ['Menus', 'Feasting menus from £45pp, or brunch'],
  ],
  exclusive: [
    ['Where', 'The whole building, both floors'],
    ['Guests', '35 seated or 100 standing'],
    ['When', 'Day hire Tuesday to Friday · evening hire Tuesday to Sunday'],
    ['Included', 'DJ setup, sound system and the snug breakout bar'],
  ],
}

export function PrivateHire() {
  const [preset, setPreset] = useState<{ id: SpaceId; n: number } | null>(null)
  const wall = useRef<HTMLDivElement>(null)
  const enquire = (id?: SpaceId) => {
    if (id) setPreset((p) => ({ id, n: (p?.n ?? 0) + 1 }))
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="hire page">
      <section className="hire-hero g-wall" aria-labelledby="hire-title">
        <div className="hire-hero__inner">
          <motion.div className="hire-hero__text" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
            <p className="label">Private hire &amp; events</p>
            <h1 id="hire-title" className="display d-xl">
              Parties at Archie’s
            </h1>
            <p className="lede">Birthdays, weddings and work dos, in the mural room upstairs or across the whole building, with feasting menus from £45pp.</p>
            <dl className="hire-facts">
              <div>
                <dt>Private Dining Room</dt>
                <dd>Up to 20 seated</dd>
              </div>
              <div>
                <dt>The whole building</dt>
                <dd>35 seated · 100 standing</dd>
              </div>
            </dl>
            <div className="actions">
              <button type="button" className="btn" onClick={() => enquire()}>
                Make an enquiry
              </button>
              <a className="link" href={`mailto:${site.hireEmail}`}>
                {site.hireEmail}
              </a>
            </div>
            <motion.span
              className="neon hire-hero__neon"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.2, 1, 0.5, 1] }}
              transition={{ duration: 1.4, delay: 0.8, times: [0, 0.1, 0.18, 0.3, 0.38, 1] }}
            >
              party
            </motion.span>
          </motion.div>

          <div className="hire-hero__wall" ref={wall}>
            <Pinned wall={wall} name="party-table-dahlias" caption="Set for a party" r={-3} x="2%" y="5%" w="50%" ar="6 / 5" z={2} sizes="(max-width: 900px) 70vw, 30vw" />
            <Pinned wall={wall} name="private-dining-room-mural" caption="Upstairs, up to 20" r={5} x="57%" y="0%" w="36%" z={3} delay={0.08} />
            <Pinned wall={wall} name="arched-roof-dining-room" caption="Downstairs, under the arched roof" r={-2} x="9%" y="58%" w="35%" ar="4 / 3.4" z={4} delay={0.16} />
            <Pinned wall={wall} name="sharing-plates-spread" caption="Feasting, £45pp and £55pp" r={4} x="51%" y="56%" w="42%" ar="4 / 3" z={5} delay={0.24} />
          </div>
        </div>
      </section>

      <section className="spaces g-cream" aria-labelledby="spaces-title">
        <div className="wrap">
          <div className="spaces__head">
            <p className="label">Two spaces</p>
            <h2 id="spaces-title" className="display d-l">
              Upstairs, or the whole building
            </h2>
          </div>
          <div className="spaces__grid">
            {SPACES.map((s, i) => (
              <motion.article
                key={s.id}
                id={s.id}
                className="space"
                aria-labelledby={`${s.id}-title`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, delay: i * 0.12, ease }}
              >
                <div className="space__window arch">
                  <Photo name={s.photo} shape="none" sizes="(max-width: 900px) 92vw, 46vw" />
                </div>
                <p className="label space__where">{s.where}</p>
                <h3 id={`${s.id}-title`} className="print space__name">
                  {s.name}
                </h3>
                <p className="space__blurb">{s.blurb}</p>
                <dl className="space__specs">
                  {SPECS[s.id].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <button type="button" className="btn" onClick={() => enquire(s.id)}>
                  Enquire about this space
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="hire-feasts g-feast" aria-labelledby="feast-menus-title">
        <div className="wrap">
          <div className="feasts__head">
            <p className="label">For the whole table</p>
            <h2 id="feast-menus-title" className="print feasts__title">
              Feasting menus
            </h2>
            <p>Sharing plates to start, then the big plates from the grill, all served with sides. Both menus work upstairs or across the whole building.</p>
          </div>
          <div className="feasts__cards hire-feasts__cards">
            {FEASTS.map((f) => (
              <FeastCard key={f.id} f={f} />
            ))}
          </div>
        </div>
      </section>

      <section className="enquire g-board" id="enquire" aria-labelledby="enquire-title">
        <div className="wrap enquire__inner">
          <div className="enquire__head">
            <p className="label">Enquire</p>
            <h2 id="enquire-title" className="display d-l">
              Tell us about your party
            </h2>
            <p className="enquire__intro">Seven short questions, and Emma will come back to you about menus, timings and the details.</p>
            <a className="link" href={`mailto:${site.hireEmail}`}>
              {site.hireEmail}
            </a>
          </div>
          <Enquiry preset={preset} />
        </div>
      </section>
    </div>
  )
}
