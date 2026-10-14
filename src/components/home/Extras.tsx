import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'

export function Newsletter() {
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
        <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
          <p className="label">Newsletter</p>
          <p>Thank you. New menus and events will go to {email}.</p>
          <p className="small muted">Demo: nothing has been sent.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="news">
          <label htmlFor="news-email" className="label">
            Newsletter
          </label>
          <p>New menus and events, now and then.</p>
          <div className="news__row">
            <input
              id="news-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'news-error' : undefined}
              className="field__input"
            />
            <button type="submit" className="btn btn--line">
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
