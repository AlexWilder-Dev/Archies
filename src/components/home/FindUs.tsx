import { Link } from 'react-router-dom'
import { HOURS, HOURS_ROWS, SERVICE_ROWS } from '../../data/hours'
import { site } from '../../data/site'
import { useMode } from '../../lib/mode'
import { OpenPill } from '../OpenPill'
import { Reveal } from '../Reveal'
import { WalkMap } from './WalkMap'

export function FindUs() {
  const { mode, now } = useMode()
  const sunday = now.weekday === 0
  const today = HOURS[now.weekday]
  return (
    <section className="section section--alt findus" id="find-us" aria-labelledby="find-title">
      <div className="wrap">
        <Reveal className="section__head">
          <p className="eyebrow">Find us</p>
          <h2 id="find-title" className="h2 neonable">
            A minute from the station.
          </h2>
        </Reveal>
      </div>
      <div className="wrap findus__grid">
        <Reveal className="findus__map">
          <WalkMap evening={mode === 'evening'} sunday={sunday} />
        </Reveal>

        <div className="findus__info">
          <Reveal>
            <address className="findus__address">
              <strong>Archie’s Herne Hill</strong>
              <br />
              {site.address.line1}
              <br />
              {site.address.town} {site.address.postcode}
            </address>
            <ul className="findus__facts">
              <li>
                <TrainIcon />
                <span>
                  <strong>Herne Hill station</strong>: a minute’s walk
                </span>
              </li>
              <li>
                <TreeIcon />
                <span>
                  <strong>Brockwell Park</strong>: upstairs looks out over it
                </span>
              </li>
              <li className={sunday ? 'is-today' : ''}>
                <StallIcon />
                <span>
                  <strong>{site.market.name}</strong> sets up on {site.market.where}, {site.market.when}
                  {sunday && <em className="findus__today"> · on today</em>}
                </span>
              </li>
            </ul>

            <div className="findus__hours">
              <div className="findus__hours-head">
                <h3 className="sign">Opening hours</h3>
                <OpenPill />
              </div>
              <table>
                <tbody>
                  {HOURS_ROWS.map((r) => (
                    <tr key={r.short} className={r.late === today.late ? 'is-today' : ''}>
                      <th scope="row">{r.days}</th>
                      <td>{r.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="findus__service small muted">
                {SERVICE_ROWS.map((r) => `${r.label} ${r.from}`).join(' · ')}
              </p>
              <p className="findus__walkin">
                <strong>Walk-ins welcome</strong> in the lounge and at the outside tables, first come, first served. Booking is recommended at weekends.
              </p>
            </div>

            <div className="highlights__ctas">
              <Link to="/book" className="btn btn--primary">
                Book a table
              </Link>
              <a className="btn btn--ghost" href={site.maps} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function TrainIcon() {
  return (
    <svg className="findus__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 11h14M9 21l1.5-4M15 21l-1.5-4" />
      <circle cx="9" cy="14" r="0.8" fill="currentColor" />
      <circle cx="15" cy="14" r="0.8" fill="currentColor" />
    </svg>
  )
}
function TreeIcon() {
  return (
    <svg className="findus__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-6" />
      <path d="M12 3a6 6 0 0 0-5.6 8.2A4 4 0 0 0 8 19h8a4 4 0 0 0 1.6-7.8A6 6 0 0 0 12 3Z" />
    </svg>
  )
}
function StallIcon() {
  return (
    <svg className="findus__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18l-2-5H5Z" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12v9M19 12v9M5 17h14" />
    </svg>
  )
}
