import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMode } from '../../lib/mode'
import { Mural, Neon, RoofRibs, Vine } from '../Decor'
import { OpenPill } from '../OpenPill'
import { Photo } from '../Photo'
import type { PhotoName } from '../../data/media'

const COPY = {
  day: {
    eyebrow: 'Herne Hill · Railton Road',
    title: 'Brunch on the corner, from 9am.',
    lede: 'Latin American brunch, good coffee and fresh juice, every day of the week. A minute from Herne Hill station, overlooking Brockwell Park.',
    primary: { to: '/book?service=brunch', label: 'Book brunch' },
    secondary: { to: '/menu?tab=brunch', label: 'Brunch menu' },
    photo: 'brunch-eggs-bloody-mary' as PhotoName,
    inset: 'eggs-green-red-salsa' as PhotoName,
    position: '50% 70%',
  },
  evening: {
    eyebrow: 'Wednesday – Saturday · till 11pm',
    title: 'Dinner, cocktails & feasting till 11.',
    lede: 'From 5:30pm the open kitchen turns to the grill: corn ribs, pork belly tacos, picanha and pollo a la brasa, with a Tommy’s Margarita at the bar.',
    primary: { to: '/book?service=dinner', label: 'Book dinner' },
    secondary: { to: '/menu?tab=lunch-dinner', label: 'Tonight’s menu' },
    photo: 'steak-over-flames' as PhotoName,
    inset: 'cocktail-tajin-pineapple' as PhotoName,
    position: '50% 50%',
  },
}

export function Hero() {
  const { mode } = useMode()
  const c = COPY[mode]
  const evening = mode === 'evening'
  return (
    <section className={`hero hero--${mode}`} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__inner">
        <div className="hero__text">
          <OpenPill className="hero__pill" />
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">{c.eyebrow}</p>
              <h1 id="hero-title" className={`display ${evening ? 'is-neon' : ''}`}>
                {c.title}
              </h1>
              <p className="lede">{c.lede}</p>
              <div className="hero__ctas">
                <Link to={c.primary.to} className="btn btn--primary">
                  {c.primary.label} <span className="btn__arrow">→</span>
                </Link>
                <Link to={c.secondary.to} className="btn btn--ghost">
                  {c.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <ul className="hero__facts">
            <li>Walk-ins welcome in the lounge &amp; outside</li>
            <li>Dogs &amp; families welcome</li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__backdrop" aria-hidden="true">
            <AnimatePresence initial={false}>
              {evening ? (
                <motion.div key="ribs" className="hero__ribs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                  <RoofRibs count={8} />
                </motion.div>
              ) : (
                <motion.div key="mural" className="hero__mural" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                  <Mural />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="hero__arch"
            initial={{ clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0 round 999px 999px 0 0)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={c.photo}
                className="hero__photo"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Photo name={c.photo} shape="none" eager sizes="(max-width: 900px) 92vw, 46vw" position={c.position} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence initial={false}>
            <motion.div
              key={c.inset}
              className="hero__inset"
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Photo name={c.inset} shape="none" sizes="220px" />
            </motion.div>
          </AnimatePresence>

          <div className="hero__sign">
            <Neon text="cocktails" lit={evening} />
            <span className="hero__sign-note">{evening ? 'Lit till 11pm' : 'Lights on Wed–Sat, 5:30pm'}</span>
          </div>

          <Vine className="hero__vine" length={0.9} />
        </div>
      </div>
    </section>
  )
}
