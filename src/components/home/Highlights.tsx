import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FEASTS, findItem, itemPrice, type MenuItem } from '../../data/menu'
import { useMode } from '../../lib/mode'
import { DietTags } from '../DietTags'
import { Neon } from '../Decor'
import { Photo } from '../Photo'
import { Reveal } from '../Reveal'

function items(ids: string[]): MenuItem[] {
  return ids.map((id) => {
    const i = findItem(id)
    if (!i) throw new Error('missing menu item ' + id)
    return i
  })
}

const BRUNCH = items(['huevos-rancheros', 'breakfast-burrito', 'avocado-toast', 'breakfast-bun'])
const BRUNCH_DRINKS = items(['flat-white', 'cappuccino', 'green-juice', 'bloody-mary'])
const DINNER = items(['choclitos', 'pork-belly-tacos', 'oaxaca-ceviche', 'pollo-a-la-brasa', 'grilled-picanha'])
const COCKTAILS = items(['picante', 'tommys-margarita', 'mezcalero', 'paloma'])

function Dish({ item, short = false }: { item: MenuItem; short?: boolean }) {
  return (
    <li className="dish">
      <div className="dish__top">
        <span className="dish__name">{item.name}</span>
        <span className="dish__dots" aria-hidden="true" />
        <span className="dish__price">{itemPrice(item)}</span>
      </div>
      {!short && item.desc && (
        <p className="dish__desc">
          {item.desc} <DietTags diet={item.diet} />
        </p>
      )}
    </li>
  )
}

export function Highlights() {
  const { mode } = useMode()
  return (
    <>
      {mode === 'day' ? <BrunchBlock /> : <DinnerBlock />}
      <FlipSide />
      <Feasting />
    </>
  )
}

function BrunchBlock() {
  return (
    <section className="section highlights" aria-labelledby="hl-title">
      <div className="wrap highlights__grid">
        <Reveal className="highlights__media">
          <Photo name="eggs-green-red-salsa" shape="arch" sizes="(max-width: 900px) 90vw, 42vw" />
          <Photo name="choclitos-corn-ribs" shape="round" className="highlights__small" sizes="240px" />
        </Reveal>
        <div>
          <Reveal className="section__head">
            <p className="eyebrow">Brunch · from 9am, every day</p>
            <h2 id="hl-title" className="h2">
              Eggs, beans, salsa and a proper coffee.
            </h2>
            <p>St Ewe eggs, Rockstar sourdough and plenty of chipotle. Add a Bloody Maria if the morning calls for it.</p>
          </Reveal>
          <Reveal>
            <ul className="dishes">
              {BRUNCH.map((i) => (
                <Dish key={i.id} item={i} />
              ))}
            </ul>
            <div className="coffee-board">
              <p className="sign coffee-board__title">At the counter</p>
              <ul className="dishes dishes--short">
                {BRUNCH_DRINKS.map((i) => (
                  <Dish key={i.id} item={i} short />
                ))}
              </ul>
            </div>
            <div className="highlights__ctas">
              <Link className="btn btn--primary" to="/book?service=brunch">
                Book brunch <span className="btn__arrow">→</span>
              </Link>
              <Link className="btn btn--ghost" to="/menu?tab=brunch">
                Full brunch menu
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function DinnerBlock() {
  return (
    <section className="section highlights highlights--evening" aria-labelledby="hl-title">
      <div className="wrap highlights__grid">
        <Reveal className="highlights__media highlights__media--mosaic">
          <Photo name="choclitos-corn-ribs" shape="arch" sizes="(max-width: 900px) 60vw, 26vw" />
          <Photo name="tacos-pickled-onion" shape="round" sizes="(max-width: 900px) 40vw, 18vw" />
          <Photo name="cocktail-tajin-pineapple" shape="round" sizes="(max-width: 900px) 40vw, 18vw" />
        </Reveal>
        <div>
          <Reveal className="section__head">
            <p className="eyebrow">Dinner · from 5:30pm, Wed–Sat</p>
            <h2 id="hl-title" className="h2 neonable">
              Small plates, the grill, and cocktails till 11.
            </h2>
            <p>Order a few things for the table, then something from the grill. The bar pours mezcal and tequila cocktails until 11pm.</p>
          </Reveal>
          <Reveal>
            <ul className="dishes">
              {DINNER.map((i) => (
                <Dish key={i.id} item={i} />
              ))}
            </ul>
            <div className="coffee-board coffee-board--bar">
              <p className="sign coffee-board__title">From the bar</p>
              <ul className="dishes dishes--short">
                {COCKTAILS.map((i) => (
                  <Dish key={i.id} item={i} short />
                ))}
              </ul>
            </div>
            <div className="highlights__ctas">
              <Link className="btn btn--primary" to="/book?service=dinner">
                Book dinner <span className="btn__arrow">→</span>
              </Link>
              <Link className="btn btn--ghost" to="/menu?tab=lunch-dinner">
                Lunch &amp; dinner menu
              </Link>
              <Link className="text-link" to="/menu?tab=drinks">
                Cocktails &amp; wine
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* The other half of the day, so a brunch visitor learns about dinner and vice versa */
function FlipSide() {
  const { mode, toggle } = useMode()
  const day = mode === 'day'
  return (
    <section className={`flip ${day ? 'flip--to-evening' : 'flip--to-day'}`} aria-label={day ? 'Evenings at Archie’s' : 'Daytime at Archie’s'}>
      <div className="wrap flip__inner">
        <motion.div
          className="flip__photo"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Photo name={day ? 'banquette-candlelight' : 'brunch-eggs-bloody-mary'} shape="arch" sizes="(max-width: 900px) 50vw, 300px" />
        </motion.div>
        <div className="flip__copy">
          {day ? (
            <>
              <Neon text="open till 11" lit className="flip__neon" />
              <h2 className="h3">Wednesday to Saturday, the lights go down at 5:30pm.</h2>
              <p>Candles on the tables, cocktails at the bar and dinner from the open kitchen. We’re open until 11pm.</p>
            </>
          ) : (
            <>
              <p className="sign flip__morning">Tomorrow morning</p>
              <h2 className="h3">Brunch from 9am, every day of the week.</h2>
              <p>Huevos rancheros, breakfast burritos and avocado toast, upstairs in the daylight or out on the corner.</p>
            </>
          )}
          <div className="flip__ctas">
            <button type="button" className="btn btn--sm btn--ghost flip__toggle" onClick={toggle}>
              {day ? 'See the evening' : 'See the daytime'}
            </button>
            <Link className="btn btn--sm btn--primary" to={day ? '/book?service=dinner' : '/book?service=brunch'}>
              {day ? 'Book dinner' : 'Book brunch'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feasting() {
  const { mode } = useMode()
  return (
    <section className={`section feast-band ${mode === 'evening' ? 'feast-band--evening' : ''}`} aria-labelledby="feast-title">
      <div className="wrap feast-band__grid">
        <Reveal className="feast-band__head">
          <p className="eyebrow">Feasting menus</p>
          <h2 id="feast-title" className="h2 neonable">
            Feed the whole table.
          </h2>
          <p className="muted">
            Two sharing menus for the middle of the table, served with cassava chips, broccoli and a trio of house salsas. Made for birthdays, big groups and private hire.
          </p>
          <div className="highlights__ctas">
            <Link className="btn btn--primary" to="/menu?tab=feasting">
              See the feasting menus
            </Link>
            <Link className="btn btn--ghost" to="/private-hire" state={{ scrollTo: 'enquire' }}>
              Plan a party
            </Link>
          </div>
        </Reveal>
        <div className="feast-band__cards">
          {FEASTS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.12} className="feast-mini">
              <Link to="/menu?tab=feasting" className="feast-mini__link">
                <span className="feast-mini__title">{f.title.replace('Feasting ', '')}</span>
                <span className="feast-mini__price">{f.price}</span>
                <span className="feast-mini__list">{[...f.starters, ...f.mains].map((x) => x.name).join(' · ')}</span>
                {f.dessert && <span className="feast-mini__extra">+ {f.dessert[0].name}</span>}
              </Link>
            </Reveal>
          ))}
          <Reveal className="feast-band__photo" delay={0.2}>
            <Photo name="sharing-plates-spread" shape="round" sizes="(max-width: 900px) 90vw, 520px" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
