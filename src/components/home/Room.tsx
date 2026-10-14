import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PhotoName } from '../../data/media'
import { useMode } from '../../lib/mode'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'
import { Building, type Zone } from './Building'

interface ZoneCopy {
  tab: string
  title: string
  body: string
  points: string[]
  photo: { day: PhotoName; evening: PhotoName }
  cta: { to: string; label: string; state?: { scrollTo: string } }
}

const ZONES: Record<Zone, ZoneCopy> = {
  downstairs: {
    tab: 'Downstairs',
    title: 'Under the arch',
    body: 'An open kitchen and a lively bar under an arched roof, in an eclectic mash-up of artwork, neon signs and indoor plants. No booking? Grab a seat in the lounge.',
    points: ['Open kitchen', 'Bar & lounge', 'Walk-ins welcome'],
    photo: { day: 'arched-roof-dining-room', evening: 'banquette-candlelight' },
    cta: { to: '/book', label: 'Book a table' },
  },
  upstairs: {
    tab: 'Upstairs',
    title: 'The mural room',
    body: 'A first-floor dining room with a colourful mural, fabric blinds and views over Brockwell Park. Daylight for brunch and soft lighting in the evening, and yours to hire for up to 20.',
    points: ['Brockwell Park views', 'Seats up to 20', 'Private hire Tue–Sun'],
    photo: { day: 'private-dining-room-mural', evening: 'private-dining-room-mural' },
    cta: { to: '/private-hire', label: 'Private dining' },
  },
  outside: {
    tab: 'Outside',
    title: 'Tables on the corner',
    body: 'Outside tables on the corner of Railton Road, first come, first served. Bring the dog. Herne Hill station is a minute away, and on Sundays the market sets up along the street.',
    points: ['First come, first served', 'Dogs welcome', 'Families welcome'],
    photo: { day: 'shopfront-railton-road', evening: 'shopfront-railton-road' },
    cta: { to: '/', label: 'How to find us', state: { scrollTo: 'find-us' } },
  },
}

const ORDER: Zone[] = ['downstairs', 'upstairs', 'outside']

export function Room() {
  const { mode } = useMode()
  const [zone, setZone] = useState<Zone>('downstairs')
  const z = ZONES[zone]
  const photo = z.photo[mode]

  return (
    <section className="section room" id="the-room" aria-labelledby="room-title">
      <div className="wrap">
        <Reveal className="section__head">
          <p className="eyebrow">The room</p>
          <h2 id="room-title" className="h2 neonable">
            Two floors on the corner.
          </h2>
          <p>Artwork, neon signs and plants everywhere. The room shifts through the day: bright for brunch, soft and low when the evening comes in.</p>
        </Reveal>

        <div className="room__grid">
          <Reveal className="room__building">
            <div className="room__tabs" role="tablist" aria-label="Parts of the building">
              {ORDER.map((id) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={zone === id}
                  className={`room__tab ${zone === id ? 'is-active' : ''}`}
                  onClick={() => setZone(id)}
                >
                  {zone === id && <motion.span layoutId="room-tab" className="room__tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span>{ZONES[id].tab}</span>
                </button>
              ))}
            </div>
            <Building active={zone} onPick={setZone} evening={mode === 'evening'} />
            <p className="room__hint small muted">Tap a floor to look inside.</p>
          </Reveal>

          <div className="room__panel" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={zone + mode}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="room__card"
              >
                <Photo name={photo} shape="arch" className="room__photo" sizes="(max-width: 900px) 90vw, 40vw" />
                <div className="room__copy">
                  <p className="eyebrow">{z.tab}</p>
                  <h3 className="h3">{z.title}</h3>
                  <p>{z.body}</p>
                  <ul className="room__points">
                    {z.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Link to={z.cta.to} state={z.cta.state} className="text-link">
                    {z.cta.label} →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
