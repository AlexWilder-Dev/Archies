import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { WalkMap } from '../components/home/WalkMap'
import { Logo } from '../components/Logo'
import { AMono, Pinned } from '../components/Marks'
import { Photo } from '../components/Photo'
import { HOURS_ROWS } from '../data/hours'
import type { PhotoName } from '../data/media'
import { findItem } from '../data/menu'
import { site } from '../data/site'
import { openStatus } from '../lib/london'
import { useMode, type Mode } from '../lib/mode'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  return (
    <div className="home">
      <Hero />
      <Board />
      <Wall />
      <FeastHire />
      <FindUs />
    </div>
  )
}

/* ---- the photograph, and the sign across it ------------------------- */

const HERO: Record<Mode, { photo: PhotoName; position: string; line: string }> = {
  day: { photo: 'brunch-eggs-bloody-mary', position: '50% 58%', line: 'Brunch, lunch and coffee, every day' },
  evening: { photo: 'steak-over-flames', position: '50% 40%', line: 'Dinner from the grill, cocktails at the bar' },
}

function Hero() {
  const { mode, now } = useMode()
  const h = HERO[mode]
  const status = openStatus(now)
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <AnimatePresence initial={false}>
          <motion.div
            key={h.photo}
            className="hero__layer"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1 }, scale: { duration: 2.6, ease } }}
          >
            <Photo name={h.photo} shape="none" eager sizes="100vw" position={h.position} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__bottom">
        <motion.div className="hero__row" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease }}>
          <p className="hero__status" role="status">
            <span className={`dot ${status.open ? 'is-open' : ''}`} aria-hidden="true" />
            <span>
              {status.label}
              {/^(until|at) /.test(status.detail) ? ' ' : ' · '}
              {status.detail}
              <AnimatePresence mode="wait" initial={false}>
                {status.open && (
                  <motion.span key={mode} className="hero__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    {' · '}
                    {h.line}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </p>
          <p className="hero__where sign">319–321 Railton Road · Herne Hill SE24</p>
        </motion.div>
        <h1 id="hero-title" className="hero__mark">
          <span className="sr-only">Archie’s Herne Hill: all-day Latin American dining</span>
          <motion.span className="hero__mark-in" initial={{ y: '104%' }} animate={{ y: '0%' }} transition={{ duration: 1.3, delay: 0.15, ease }}>
            <Logo className="hero__logo" title="" />
          </motion.span>
        </h1>
      </div>
    </section>
  )
}

/* ---- the price board ------------------------------------------------- */

interface Row {
  id: string
  name: string
  price: string
  photo?: PhotoName
  caption?: string
}

const BOARD: Record<Mode, { label: string; photo: PhotoName; caption: string; rows: Row[]; book: string; bookLabel: string; menu: string; menuLabel: string; note: string }> = {
  evening: {
    label: 'Tonight · from 5:30pm',
    photo: 'cocktail-tajin-pineapple',
    caption: 'From the bar',
    rows: [
      { id: 'choclitos', name: 'Choclitos', price: '5', photo: 'choclitos-corn-ribs', caption: 'Choclitos: fried corn ribs, lime, tajín' },
      { id: 'pork-belly-tacos', name: 'Pork belly tacos', price: '12', photo: 'tacos-pickled-onion', caption: 'Tacos, from the lunch and dinner menu' },
      { id: 'oaxaca-ceviche', name: 'Oaxaca ceviche', price: '11' },
      { id: 'pollo-a-la-brasa', name: 'Pollo a la brasa', price: '19 | 35' },
      { id: 'grilled-picanha', name: 'Picanha, 600g', price: '49', photo: 'steak-over-flames', caption: 'From the grill' },
      { id: 'picante', name: 'Picante', price: '12', photo: 'cocktail-tajin-pineapple', caption: 'From the bar' },
    ],
    book: '/book?service=dinner&time=1140',
    bookLabel: 'Book dinner',
    menu: '/menu?tab=lunch-dinner',
    menuLabel: 'Full menu',
    note: 'Wednesday to Saturday, until 11pm',
  },
  day: {
    label: 'Brunch · from 9am, every day',
    photo: 'eggs-green-red-salsa',
    caption: 'Eggs in green and red salsa, black beans, crumbled cheese',
    rows: [
      { id: 'huevos-rancheros', name: 'Huevos rancheros', price: '13', photo: 'eggs-green-red-salsa', caption: 'Eggs in green and red salsa, black beans, crumbled cheese' },
      { id: 'breakfast-burrito', name: 'Breakfast burrito', price: '14' },
      { id: 'avocado-toast', name: 'Avocado toast', price: '11' },
      { id: 'breakfast-bun', name: 'Breakfast bun', price: '10' },
      { id: 'bloody-mary', name: 'Bloody Maria', price: '12', photo: 'brunch-eggs-bloody-mary', caption: 'Eggs in the pan, and a Bloody Maria' },
      { id: 'flat-white', name: 'Flat white', price: '3.6' },
    ],
    book: '/book?service=brunch&time=630',
    bookLabel: 'Book brunch',
    menu: '/menu?tab=brunch',
    menuLabel: 'Brunch menu',
    note: 'Lunch from 12pm · dinner from 5:30pm, Wednesday to Saturday',
  },
}

function Board() {
  const { mode } = useMode()
  const b = BOARD[mode]
  const [hover, setHover] = useState<Row | null>(null)
  const shown = hover?.photo ? { photo: hover.photo, caption: hover.caption ?? '' } : { photo: b.photo, caption: b.caption }
  return (
    <section className="board g-board" aria-labelledby="board-title">
      <div className="board__photo">
        <AnimatePresence initial={false}>
          <motion.div key={shown.photo} className="board__layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Photo name={shown.photo} shape="none" sizes="(max-width: 900px) 100vw, 50vw" />
            <p className="board__caption hand">{shown.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="board__panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} className="board__inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <h2 id="board-title" className="label board__label">
              {b.label}
            </h2>
            <ul className="board__rows" onMouseLeave={() => setHover(null)}>
              {b.rows.map((r, i) => {
                const item = findItem(r.id)
                return (
                  <motion.li key={r.id} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.7, delay: i * 0.06, ease }}>
                    <Link to={`${b.menu}`} className={`board__row ${hover?.id === r.id ? 'is-on' : ''}`} onMouseEnter={() => setHover(r)} onFocus={() => setHover(r)} onBlur={() => setHover(null)}>
                      <span className="board__name display">{r.name}</span>
                      <span className="board__price">{r.price}</span>
                      {item?.desc && <span className="board__desc">{item.desc}</span>}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
            <p className="board__note">{b.note}</p>
            <div className="actions">
              <Link to={b.book} className="btn">
                {b.bookLabel}
              </Link>
              <Link to={b.menu} className="link">
                {b.menuLabel}
              </Link>
              <Link to="/menu?tab=drinks" className="link board__drinks">
                Drinks
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ---- the room: photographs on the plaster ---------------------------- */

function Wall() {
  const { mode } = useMode()
  const wall = useRef<HTMLDivElement>(null)
  return (
    <section className="wall g-wall" aria-labelledby="wall-title" id="the-room">
      <div className="wall__inner">
        <div className="wall__text">
          <p className="label">319–321 Railton Road · Herne Hill</p>
          <h2 id="wall-title" className="display d-l">
            Artwork, neon, plants and Latin American food, all day
          </h2>
          <p className="lede">Two floors on the corner of Railton Road: the open kitchen and bar under the arched roof downstairs, and the mural room upstairs, looking over Brockwell Park.</p>
          <p className="wall__walkin">
            <strong>Walk-ins welcome</strong> in the lounge and at the outside tables. Booking is recommended at weekends. Dogs and families welcome.
          </p>
          <div className="actions">
            <Link to="/book" className="btn">
              Book a table
            </Link>
            <Link to="/menu" className="link">
              The menus
            </Link>
          </div>
        </div>

        <div className="wall__board" ref={wall}>
          <Pinned wall={wall} name="private-dining-room-mural" caption="Upstairs, the mural room" r={-4} x="14%" y="0%" w="37%" z={2} />
          <Pinned wall={wall} name="banquette-candlelight" caption="The banquette, after dark" r={4} x="55%" y="3%" w="30%" z={3} delay={0.08} />
          <Pinned wall={wall} name="choclitos-corn-ribs" caption="Choclitos 5" r={-6} x="73%" y="49%" w="26%" z={5} ar="1 / 1.05" delay={0.16} />
          <Pinned wall={wall} name="arched-roof-dining-room" caption="Downstairs, under the arched roof" r={2.5} x="37%" y="55%" w="33%" z={4} ar="4 / 4" delay={0.24} />
          <Pinned wall={wall} name="fascia-awning" r={-2} x="1%" y="60%" w="33%" z={3} ar="16 / 10" position="50% 40%" delay={0.3} />
          <motion.figure
            className="clipping"
            initial={{ opacity: 0, rotate: 9, y: -20 }}
            whileInView={{ opacity: 1, rotate: 5, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 110, damping: 15, delay: 0.36 }}
          >
            <blockquote>
              <p>“For brunch: Archie’s”</p>
            </blockquote>
            <figcaption>
              {site.press.source}, in its local guide to Herne Hill
            </figcaption>
          </motion.figure>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mode}
              className="neon wall__neon"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 0.9, 0.2, 1, 0.5, 1] }}
              exit={{ opacity: 0 }}
              viewport={{ once: false, margin: '-20% 0px' }}
              transition={{ duration: 1.4, times: [0, 0.1, 0.18, 0.3, 0.38, 1] }}
            >
              {mode === 'evening' ? 'cocktails' : 'all day'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---- feasting and private hire, in the arch ------------------------- */

const WINDOWS = [
  { photo: 'private-dining-room-mural' as PhotoName, title: 'Private Dining Room', meta: 'Up to 20 seated · Tuesday to Sunday', to: '/private-hire', scrollTo: 'pdr' },
  { photo: 'sharing-plates-spread' as PhotoName, title: 'Feasting menus', meta: '£45pp and £55pp, for the middle of the table', to: '/menu?tab=feasting', tall: true },
  { photo: 'arched-roof-dining-room' as PhotoName, title: 'The whole building', meta: '35 seated or 100 standing, with DJ and sound system', to: '/private-hire', scrollTo: 'exclusive' },
]

function FeastHire() {
  return (
    <section className="feasthire g-feast" aria-labelledby="feasthire-title">
      <motion.div className="arch feasthire__arch g-paper" initial={{ y: 80, opacity: 0.6 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: '0px 0px -5% 0px' }} transition={{ duration: 1.1, ease }}>
        <AMono />
        <p className="label feasthire__kicker">For the whole table, or the whole building</p>
        <h2 id="feasthire-title" className="print feasthire__title">
          Feasting &amp; private hire
        </h2>
        <p className="feasthire__intro">Two sharing menus, brought to the middle of the table. Take the private dining room upstairs for up to 20, or the whole building for 35 seated and 100 standing.</p>
        <div className="windows">
          {WINDOWS.map((w, i) => (
            <motion.div key={w.title} className={`window ${w.tall ? 'window--tall' : ''}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease }}>
              <Link to={w.to} state={w.scrollTo ? { scrollTo: w.scrollTo } : undefined} className="window__link">
                <span className="window__frame arch">
                  <Photo name={w.photo} shape="none" sizes="(max-width: 900px) 80vw, 300px" />
                </span>
                <span className="window__title">{w.title}</span>
                <span className="window__meta">{w.meta}</span>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="actions feasthire__actions">
          <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn btn--ink">
            Plan a party
          </Link>
          <Link to="/menu?tab=feasting" className="link">
            Both feasting menus
          </Link>
        </div>
        <p className="feasthire__email">
          Every enquiry goes to Emma: <a className="text-link" href={`mailto:${site.hireEmail}`}>{site.hireEmail}</a>
        </p>
      </motion.div>
    </section>
  )
}

/* ---- find us ------------------------------------------------------- */

function FindUs() {
  const { now } = useMode()
  const sunday = now.weekday === 0
  const rows: [string, string][] = [
    ['Herne Hill station', 'a minute’s walk'],
    ['Brockwell Park', 'across the road'],
    [site.market.name, sunday ? 'on today, 10am–4pm' : 'Sundays, 10am–4pm'],
  ]
  return (
    <section className="findus g-cream" id="find-us" aria-labelledby="find-title">
      <div className="wrap findus__grid">
        <div className="findus__text">
          <p className="label">Find us</p>
          <h2 id="find-title" className="display d-l">
            319–321 Railton Road
          </h2>
          <p className="findus__addr">Herne Hill, London SE24 0JN</p>
          <ul className="findus__rows">
            {rows.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <span className={k === site.market.name && sunday ? 'is-today' : ''}>{v}</span>
              </li>
            ))}
          </ul>
          <p className="label findus__hours-label">Opening hours</p>
          <ul className="findus__rows findus__rows--hours">
            {HOURS_ROWS.map((r) => (
              <li key={r.short}>
                <span>{r.days}</span>
                <span>{r.hours}</span>
              </li>
            ))}
          </ul>
          <p className="small muted">Brunch from 9am, lunch from 12pm, dinner from 5:30pm Wednesday to Saturday.</p>
          <div className="actions">
            <a className="btn btn--ink" href={site.maps} target="_blank" rel="noreferrer">
              Directions
            </a>
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
        <div className="findus__map">
          <div className="arch findus__arch g-paper">
            <AMono />
            <p className="label findus__dome">A minute from the station</p>
            <WalkMap sunday={sunday} />
          </div>
          <Pinned name="shopfront-railton-road" caption="On the corner, at dusk" r={5} className="findus__pin" ar="4 / 5" sizes="(max-width: 900px) 40vw, 220px" />
        </div>
      </div>
    </section>
  )
}
