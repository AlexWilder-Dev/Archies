import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { site } from '../../data/site'
import { ArchA } from '../Decor'
import { Logo } from '../Logo'
import { Reveal } from '../Reveal'

export function Press() {
  return (
    <section className="press" aria-label="Press">
      <div className="wrap press__inner">
        <ArchA className="press__mark" size={34} />
        <blockquote className="press__quote">
          <p>“{site.press.quote}”</p>
        </blockquote>
        <p className="press__source">
          <strong>{site.press.source}</strong>
          <span>{site.press.context}</span>
        </p>
      </div>
    </section>
  )
}

export function Extras() {
  return (
    <section className="section extras" aria-label="Gift cards, newsletter and our sister site">
      <div className="wrap extras__grid">
        <Reveal className="extra extra--gift">
          <GiftCard />
          <h2 className="h3">Gift cards</h2>
          <p className="muted">Brunch, dinner or a round of margaritas, for someone who lives nearby.</p>
          <a className="btn btn--primary" href={site.giftCards} target="_blank" rel="noreferrer">
            Buy a gift card ↗
          </a>
        </Reveal>
        <Reveal className="extra extra--news" delay={0.08}>
          <Newsletter />
        </Reveal>
        <Reveal className="extra extra--sister" delay={0.16}>
          <p className="eyebrow">Our sister site</p>
          <a className="extra__sister-logo" href={site.sister.url} target="_blank" rel="noreferrer" aria-label={`${site.sister.name}, opens in a new tab`}>
            <Logo />
            <span className="sign">Archway</span>
          </a>
          <p className="muted">North London has an Archie’s too, at Archway.</p>
          <a className="text-link" href={site.sister.url} target="_blank" rel="noreferrer">
            Visit {site.sister.name} ↗
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('That email doesn’t look quite right.')
      return
    }
    setError('')
    setDone(true)
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="news__done" role="status">
          <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="var(--orange)" />
            <motion.path
              d="M14 25 l7 7 l13 -15"
              fill="none"
              stroke="#232014"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
          </svg>
          <h2 className="h3">You’re on the list.</h2>
          <p className="muted">We’ll send news of new menus and events at Archie’s to {email}.</p>
          <p className="small muted">(Demo: nothing has been sent.)</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="news">
          <p className="eyebrow">Newsletter</p>
          <h2 className="h3">New menus, first.</h2>
          <p className="muted">Seasonal menus, events and the odd party, straight to your inbox.</p>
          <label htmlFor="news-email" className="sr-only">
            Email address
          </label>
          <div className="news__row">
            <input
              id="news-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'news-error' : undefined}
              className="field__input"
            />
            <button type="submit" className="btn btn--dark">
              Sign up
            </button>
          </div>
          {error && (
            <p id="news-error" className="field__error" role="alert">
              {error}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}

function GiftCard() {
  return (
    <motion.div className="giftcard" whileHover={{ rotate: -3, y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} aria-hidden="true">
      <div className="giftcard__arch" />
      <Logo className="giftcard__logo" />
      <span className="giftcard__label">Gift card</span>
    </motion.div>
  )
}
