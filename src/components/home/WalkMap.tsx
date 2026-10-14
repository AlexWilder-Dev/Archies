import { motion } from 'framer-motion'

/* A plain line map, not to scale: out of Herne Hill station and a minute up
   Railton Road to the corner, with Brockwell Park over the road. */
export function WalkMap({ sunday }: { sunday: boolean }) {
  const walk = 'M466 328 C 450 320, 436 304, 430 286 L 424 240 C 421 226, 404 217, 390 214'
  return (
    <svg className="map" viewBox="0 0 600 460" role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">From Herne Hill station to Archie’s</title>
      <desc id="map-desc">
        Leave Herne Hill station and walk a minute up Railton Road to Archie’s at 319 to 321, on the corner, overlooking Brockwell Park.
        {sunday ? ' Today Herne Hill Market is on Railton Road, 10am to 4pm.' : ''}
      </desc>

      <defs>
        <clipPath id="park-clip">
          <path d="M0 262 C 90 250, 210 246, 330 258 C 362 262, 374 284, 370 314 L 354 460 H 0Z" />
        </clipPath>
      </defs>
      {/* Brockwell Park */}
      <path className="map__park" d="M0 262 C 90 250, 210 246, 330 258 C 362 262, 374 284, 370 314 L 354 460 H 0Z" />
      <g className="map__hatch" clipPath="url(#park-clip)">
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={-40 + i * 20} y1="460" x2={40 + i * 20} y2="250" />
        ))}
      </g>
      <text x="40" y="330" className="map__label map__label--park">
        Brockwell Park
      </text>

      {/* streets: drawn as pairs of kerb lines */}
      <g className="map__street">
        <path d="M0 214 C 120 206, 260 202, 404 198" />
        <path d="M0 240 C 120 232, 260 228, 400 224" />
        <path d="M406 0 V 230 C 410 266, 428 300, 458 322 L 600 368" />
        <path d="M434 0 V 226 C 438 256, 452 284, 474 302 L 600 340" />
        <path d="M444 326 L 408 460" />
        <path d="M472 336 L 436 460" />
      </g>
      <text className="map__label map__label--street" transform="translate(426 150) rotate(-90)">
        Railton Road
      </text>

      {/* railway */}
      <g className="map__rail">
        <path d="M560 0 C 540 120, 522 220, 502 300" />
        <path d="M576 0 C 556 120, 538 220, 518 300" />
        {Array.from({ length: 15 }, (_, i) => {
          const t = i / 14
          return <line key={i} x1={556 - 58 * t} y1={t * 296} x2={580 - 58 * t} y2={t * 296} />
        })}
      </g>

      {/* station */}
      <rect className="map__station" x="478" y="296" width="64" height="38" />
      <text x="510" y="356" textAnchor="middle" className="map__label">
        Herne Hill
      </text>
      <text x="510" y="372" textAnchor="middle" className="map__label map__label--small">
        station
      </text>

      {/* market stalls along Railton Road on Sundays */}
      <g className={`map__market ${sunday ? 'is-on' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={409 + i * 1.6} y={246 + i * 14} width="8" height="9" />
        ))}
      </g>
      <text x="400" y="276" textAnchor="end" className="map__label map__label--small">
        {sunday ? 'Market today' : 'Sunday market'}
      </text>

      {/* the walk */}
      <motion.path
        className="map__walk"
        d={walk}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Archie's */}
      <circle className="map__pin-ring" cx="384" cy="214" r="15" />
      <circle className="map__pin" cx="384" cy="214" r="7" />
      <text x="360" y="186" textAnchor="end" className="map__label map__label--place">
        Archie’s
      </text>
      <text x="360" y="203" textAnchor="end" className="map__label map__label--small">
        319–321 Railton Road
      </text>
      <text x="442" y="262" className="map__label map__label--small map__label--walk">
        1 min
      </text>

      <g className="map__north" transform="translate(30 40)">
        <path d="M0 -12 L5 4 L0 0 L-5 4Z" />
        <text x="0" y="20" textAnchor="middle" className="map__label map__label--small">
          N
        </text>
      </g>
      <text x="30" y="444" className="map__label map__label--small">
        Not to scale
      </text>
    </svg>
  )
}
