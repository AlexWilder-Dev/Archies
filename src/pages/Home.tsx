import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Newsletter } from '../components/home/Extras'
import { WalkMap } from '../components/home/WalkMap'
import { OpenPill } from '../components/OpenPill'
import { Photo } from '../components/Photo'
import { SPACES } from '../data/hire'
import type { PhotoName } from '../data/media'
import { FEASTS, findItem, type FeastMenu, type MenuItem } from '../data/menu'
import { site } from '../data/site'
import { useMode } from '../lib/mode'

const ease = [0.22, 1, 0.36, 1] as const

/* A photograph that uncovers itself as it scrolls into view. */
function Frame({ name, className = '', sizes, caption, eager, position }: { name: PhotoName; className?: string; sizes: string; caption?: string; eager?: boolean; position?: string }) {
  return (
    <motion.figure
      className={`frame ${className}`}
      initial={eager ? false : { clipPath: 'inset(10% 0% 0% 0%)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.2, ease }}
    >
      <Photo name={name} shape="none" sizes={sizes} eager={eager} position={position} />
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </motion.figure>
  )
}

function Rise({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.div>
  )
}

const pick = (ids: string[]) => ids.map((id) => findItem(id)).filter(Boolean) as MenuItem[]

function price(i: MenuItem) {
  if (i.price) return i.price
  return (i.prices ?? []).filter((p) => p.price).map((p) => (p.label ? `${p.label} – ${p.price}` : p.price)).join(' | ')
}

/* Menu lines set the way Archie's prints them */
function Dishes({ items, short = false }: { items: MenuItem[]; short?: boolean }) {
  return (
    <ul className={`dishes ${short ? 'dishes--short' : ''}`}>
      {items.map((i) => (
        <li key={i.id}>
          <p className="dishes__name">
            {i.name} <span className="dishes__price">{price(i)}</span>
          </p>
          {!short && i.desc && (
            <p className="dishes__desc">
              {i.desc}
              {i.diet?.length ? ` (${i.diet.join(', ')})` : ''}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */

export function Home() {
  const { mode } = useMode()
  const evening = mode === 'evening'
  return (
    <div className="home">
      <Hero />
      <Services />
      {evening ? <Evenings lead /> : <Brunch lead />}
      <Gallery />
      {evening ? <Brunch /> : <Evenings />}
      <Feasting />
      <Hire />
      <FindUs />
      <Closing />
    </div>
  )
}

/* ---- hero ------------------------------------------------------------ */

const HERO = {
  day: {
    photo: 'brunch-eggs-bloody-mary' as PhotoName,
    position: '50% 62%',
    second: 'fascia-awning' as PhotoName,
    lede: 'Brunch and coffee from 9am, seven days a week. Lunch from midday, and dinner with cocktails until 11pm, Wednesday to Saturday.',
  },
  evening: {
    photo: 'shopfront-railton-road' as PhotoName,
    position: '50% 46%',
    second: 'banquette-candlelight' as PhotoName,
    lede: 'Dinner from 5:30pm and cocktails until 11pm, Wednesday to Saturday, with feasting menus for the whole table.',
  },
}

function Hero() {
  const { mode } = useMode()
  const h = HERO[mode]
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__photo">
        <AnimatePresence initial={false}>
          <motion.div key={h.photo} className="hero__photo-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <Photo name={h.photo} shape="none" eager sizes="(max-width: 900px) 100vw, 58vw" position={h.position} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero__text">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.1 }}>
          <p className="label">Herne Hill, London SE24</p>
          <h1 id="hero-title" className="t-xl hero__title">
            All-day Latin American dining on Railton Road
          </h1>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={mode} className="lede hero__lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {h.lede}
            </motion.p>
          </AnimatePresence>
          <OpenPill className="hero__status" />
          <div className="hero__actions">
            <Link to={mode === 'evening' ? '/book?service=dinner&time=1140' : '/book'} className="btn">
              Book a table
            </Link>
            <Link to={mode === 'evening' ? '/menu?tab=lunch-dinner' : '/menu?tab=brunch'} className="link">
              Menus
            </Link>
          </div>
        </motion.div>
        <div className="hero__aside">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={h.second} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Photo name={h.second} shape="none" sizes="(max-width: 900px) 40vw, 14vw" />
            </motion.div>
          </AnimatePresence>
          <p className="hero__where">A minute from Herne Hill station, overlooking Brockwell Park.</p>
        </div>
      </div>
    </section>
  )
}

/* ---- the day, in one line ------------------------------------------- */

function Services() {
  const rows = [
    ['Brunch', 'From 9am, every day'],
    ['Lunch', 'From 12pm, every day'],
    ['Dinner', 'From 5:30pm, Wednesday to Saturday'],
    ['Walk-ins', 'Lounge and outside tables, first come, first served'],
  ]
  return (
    <section className="wrap services" aria-label="Service times">
      {rows.map(([k, v], i) => (
        <Rise key={k} className="services__item" delay={i * 0.06}>
          <p className="label">{k}</p>
          <p>{v}</p>
        </Rise>
      ))}
    </section>
  )
}

/* ---- brunch ----------------------------------------------------------- */

function Brunch({ lead = false }: { lead?: boolean }) {
  const food = pick(['huevos-rancheros', 'breakfast-burrito', 'avocado-toast', 'breakfast-bun'])
  const drinks = pick(['bloody-mary', 'michelada', 'mimosa', 'flat-white'])
  return (
    <section className={`spread ${lead ? 'spread--lead' : 'spread--band spread--light'}`} aria-labelledby="brunch-title">
      <div className="wrap spread__grid">
        <div className="spread__text">
          <Rise>
            <p className="label">Every day from 9am</p>
            <h2 id="brunch-title" className="t-l">
              Brunch
            </h2>
          </Rise>
          <Rise className="spread__menu">
            <Dishes items={food} />
            <p className="label spread__sub">To drink</p>
            <Dishes items={drinks} short />
          </Rise>
          <Rise className="spread__actions">
            <Link to="/book?service=brunch&time=630" className="btn">
              Book brunch
            </Link>
            <Link to="/menu?tab=brunch" className="link">
              The full brunch menu
            </Link>
          </Rise>
          <Rise className="quote">
            <p className="quote__text">
              <span className="quote__mark">“</span>For brunch: Archie’s<span className="quote__mark">”</span>
            </p>
            <p className="quote__source">{site.press.source}, in its local guide to Herne Hill</p>
          </Rise>
        </div>
        <Frame name={lead ? 'eggs-green-red-salsa' : 'brunch-eggs-bloody-mary'} className="spread__photo" sizes="(max-width: 900px) 100vw, 52vw" caption={lead ? 'Eggs in green and red salsa, black beans, crumbled cheese' : 'Eggs over salsa in the pan, and a Bloody Mary'} />
      </div>
    </section>
  )
}

/* ---- evenings ------------------------------------------------------- */

function Evenings({ lead = false }: { lead?: boolean }) {
  const mains = pick(['pollo-a-la-brasa', 'grilled-picanha', 'feijoada', 'swordfish'])
  const bar = pick(['tommys-margarita', 'picante', 'mezcalero', 'paloma'])
  return (
    <section className={`spread spread--flip ${lead ? 'spread--lead' : 'spread--band spread--dark'}`} aria-labelledby="evening-title">
      <div className="wrap spread__grid">
        <div className="spread__text">
          <Rise>
            <p className="label">Wednesday to Saturday, from 5:30pm</p>
            <h2 id="evening-title" className="t-l">
              Dinner &amp; cocktails
            </h2>
            <p className="spread__intro">Soft lighting, the open kitchen and the bar under the arched roof, until 11pm.</p>
          </Rise>
          <Rise className="spread__menu">
            <Dishes items={mains} />
            <p className="label spread__sub">From the bar</p>
            <Dishes items={bar} short />
          </Rise>
          <Rise className="spread__actions">
            <Link to="/book?service=dinner&time=1140" className="btn">
              Book dinner
            </Link>
            <Link to="/menu?tab=lunch-dinner" className="link">
              Lunch &amp; dinner menu
            </Link>
            <Link to="/menu?tab=drinks" className="link link--quiet">
              Drinks
            </Link>
          </Rise>
        </div>
        <Frame name={lead ? 'steak-over-flames' : 'banquette-candlelight'} className="spread__photo" sizes="(max-width: 900px) 100vw, 52vw" caption={lead ? 'On the grill' : 'Downstairs, in the evening'} />
      </div>
    </section>
  )
}

/* ---- three from the kitchen and bar --------------------------------- */

function Gallery() {
  return (
    <section className="wrap gallery" aria-label="From the kitchen and the bar">
      <Frame name="choclitos-corn-ribs" className="gallery__a" sizes="(max-width: 900px) 60vw, 36vw" caption="Choclitos: fried corn ribs, lime, tajín" />
      <Frame name="tacos-pickled-onion" className="gallery__b" sizes="(max-width: 900px) 50vw, 26vw" caption="Tacos, from the lunch and dinner menu" />
      <Frame name="cocktail-tajin-pineapple" className="gallery__c" sizes="(max-width: 900px) 50vw, 26vw" caption="From the bar" />
    </section>
  )
}

/* ---- feasting ------------------------------------------------------- */

function FeastArch({ f }: { f: FeastMenu }) {
  const dishes = [...f.starters, ...f.mains, ...(f.dessert ?? [])]
  return (
    <Link to="/menu?tab=feasting" className="arch-card" aria-label={`${f.title}, ${f.price}`}>
      <span className="arch-card__inner">
        <svg className="arch-card__a" width="18" height="30" viewBox="0 0 31 50" aria-hidden="true">
          <path d="M3 48 V17 a12.5 12.5 0 0 1 25 0 V48 M3 30 H28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span className="arch-card__title">{f.title}</span>
        <span className="arch-card__price">{f.price}</span>
        <span className="arch-card__rule" />
        {dishes.map((d) => (
          <span key={d.id} className="arch-card__dish">
            {d.name}
          </span>
        ))}
        <span className="arch-card__sides">with {f.sides.join(', ').toLowerCase()}</span>
      </span>
    </Link>
  )
}

function Feasting() {
  return (
    <section className="feasting" aria-labelledby="feast-title">
      <Frame name="sharing-plates-spread" className="feasting__photo" sizes="100vw" position="50% 55%" />
      <div className="wrap feasting__grid">
        <Rise className="feasting__text">
          <p className="label">For the whole table</p>
          <h2 id="feast-title" className="t-l">
            Feasting
          </h2>
          <p className="spread__intro">Two sharing menus, £45pp and £55pp, each brought to the middle of the table with cassava chips, broccoli and a trio of house salsas.</p>
          <div className="spread__actions">
            <Link to="/menu?tab=feasting" className="link">
              Both menus in full
            </Link>
            <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="link link--quiet">
              Feasting for a party
            </Link>
          </div>
        </Rise>
        <div className="feasting__cards">
          {FEASTS.map((f, i) => (
            <Rise key={f.id} delay={i * 0.1}>
              <FeastArch f={f} />
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---- private hire ------------------------------------------------- */

const SPECS: Record<string, [string, string][]> = {
  pdr: [
    ['Where', 'First floor'],
    ['Guests', 'Up to 20 seated'],
    ['When', 'Tuesday to Sunday, for brunch, lunch or dinner'],
    ['The room', 'Colourful mural, fabric blinds, views over Brockwell Park'],
  ],
  exclusive: [
    ['Where', 'Both floors'],
    ['Guests', '35 seated or 100 standing'],
    ['When', 'Day hire Tuesday to Friday, evening hire Tuesday to Sunday'],
    ['Included', 'DJ setup, sound system and the snug breakout bar'],
  ],
}

function Hire() {
  return (
    <section className="hire-home" aria-labelledby="hire-title">
      <div className="wrap">
        <Rise className="hire-home__head">
          <p className="label">Private hire</p>
          <h2 id="hire-title" className="t-l">
            Upstairs, or the whole building
          </h2>
          <p className="spread__intro">Birthdays, weddings and work dos. One inbox for every enquiry: <a className="text-link" href={`mailto:${site.hireEmail}`}>{site.hireEmail}</a></p>
        </Rise>
        <div className="hire-home__spaces">
          {SPACES.map((s, i) => (
            <article key={s.id} className={`space-sum ${i ? 'space-sum--b' : ''}`}>
              <Link to="/private-hire" state={{ scrollTo: s.id }} className="space-sum__photo">
                <Frame name={s.photo} sizes="(max-width: 900px) 100vw, 40vw" />
              </Link>
              <Rise>
                <h3 className="t-m">{s.name}</h3>
                <dl className="specs">
                  {SPECS[s.id].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </article>
          ))}
        </div>
        <Rise className="spread__actions hire-home__actions">
          <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn">
            Make an enquiry
          </Link>
          <Link to="/private-hire" className="link">
            Private hire in detail
          </Link>
        </Rise>
      </div>
    </section>
  )
}

/* ---- find us ------------------------------------------------------- */

function FindUs() {
  const { now } = useMode()
  const sunday = now.weekday === 0
  return (
    <section className="wrap findus" id="find-us" aria-labelledby="find-title">
      <Rise className="findus__text">
        <p className="label">Find us</p>
        <h2 id="find-title" className="t-l">
          319–321 Railton Road
        </h2>
        <p className="findus__addr">Herne Hill, London SE24 0JN</p>
        <p>A minute’s walk from Herne Hill station. The dining room upstairs looks out over Brockwell Park.</p>
        <p className={sunday ? 'findus__today' : ''}>
          {sunday ? 'Today' : 'On Sundays'}, {site.market.name} runs along Railton Road from 10am to 4pm.
        </p>
        <table className="hours">
          <tbody>
            <tr>
              <th scope="row">Wednesday to Saturday</th>
              <td>9am – 11pm</td>
            </tr>
            <tr>
              <th scope="row">Sunday, Monday, Tuesday</th>
              <td>9am – 5pm</td>
            </tr>
          </tbody>
        </table>
        <p className="small muted">Dogs and families welcome. Booking recommended at weekends.</p>
        <div className="spread__actions">
          <a className="link" href={site.maps} target="_blank" rel="noreferrer">
            Directions
          </a>
          <a className="link link--quiet" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </Rise>
      <Rise className="findus__map" delay={0.1}>
        <WalkMap sunday={sunday} />
      </Rise>
    </section>
  )
}

/* ---- gift cards, newsletter, Archway ------------------------------ */

function Closing() {
  return (
    <section className="wrap closing" aria-label="Gift cards, newsletter and Archie’s Archway">
      <div className="closing__item">
        <p className="label">Gift cards</p>
        <p>Bought online, spent on brunch, dinner or drinks.</p>
        <a className="link" href={site.giftCards} target="_blank" rel="noreferrer">
          Buy a gift card
        </a>
      </div>
      <div className="closing__item">
        <Newsletter />
      </div>
      <div className="closing__item">
        <p className="label">Our sister site</p>
        <p>Archie’s Archway, in north London.</p>
        <a className="link" href={site.sister.url} target="_blank" rel="noreferrer">
          archieslondon.co.uk
        </a>
      </div>
    </section>
  )
}
