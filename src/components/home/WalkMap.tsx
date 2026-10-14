import { motion } from 'framer-motion'

/* Schematic (not to scale): out of Herne Hill station, a few steps up
   Railton Road to the corner, Brockwell Park over the road. */
export function WalkMap({ evening, sunday }: { evening: boolean; sunday: boolean }) {
  const walk = 'M468 318 C 452 312, 440 300, 432 286 L 418 236 C 414 222, 406 214, 392 212'
  const c = evening
    ? { bg: '#22170d', park: '#24331d', tree: '#31452a', road: '#3a2b1d', roadEdge: '#4a3826', rail: '#6b5a48', ink: '#f6e7d4', soft: '#bfa584', bld: '#33241a' }
    : { bg: '#efe2d4', park: '#b9c39b', tree: '#8e9c6c', road: '#fbf5ee', roadEdge: '#d8c8b6', rail: '#6f6455', ink: '#232014', soft: '#6b604c', bld: '#e1cfbd' }

  return (
    <svg className="walkmap" viewBox="0 0 600 440" role="img" aria-labelledby="walkmap-title walkmap-desc">
      <title id="walkmap-title">Walking from Herne Hill station to Archie’s</title>
      <desc id="walkmap-desc">
        Leave Herne Hill station and walk a minute up Railton Road to Archie’s at number 319 to 321, on the corner, overlooking Brockwell Park.
        {sunday ? ' Today the Herne Hill Market is on Railton Road, 10am to 4pm.' : ''}
      </desc>
      <rect width="600" height="440" fill={c.bg} rx="24" />

      {/* blocks */}
      {[
        [300, 30, 80, 70],
        [300, 110, 80, 70],
        [440, 40, 50, 120],
        [140, 40, 120, 130],
        [510, 330, 70, 90],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={c.bld} />
      ))}

      {/* Brockwell Park */}
      <path d="M0 262 C 80 250, 200 246, 330 258 C 360 262, 372 280, 368 310 L 352 440 H 0Z" fill={c.park} />
      {[
        [40, 300, 16],
        [80, 330, 22],
        [140, 296, 14],
        [190, 340, 20],
        [250, 300, 15],
        [300, 350, 18],
        [110, 390, 18],
        [220, 400, 22],
        [320, 300, 12],
        [40, 400, 14],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c.tree} />
      ))}
      <text x="150" y="372" className="walkmap__label walkmap__label--park" fill={evening ? '#9fb58a' : '#4b5a33'}>
        Brockwell Park
      </text>

      {/* roads */}
      <path d="M0 226 C 120 218, 260 214, 400 210" stroke={c.roadEdge} strokeWidth="30" fill="none" />
      <path d="M0 226 C 120 218, 260 214, 400 210" stroke={c.road} strokeWidth="26" fill="none" />
      <path d="M420 0 L 420 236 C 424 270, 440 300, 470 318 L 600 360" stroke={c.roadEdge} strokeWidth="34" fill="none" />
      <path d="M420 0 L 420 236 C 424 270, 440 300, 470 318 L 600 360" stroke={c.road} strokeWidth="30" fill="none" />
      <path d="M455 312 L 420 440" stroke={c.roadEdge} strokeWidth="30" fill="none" />
      <path d="M455 312 L 420 440" stroke={c.road} strokeWidth="26" fill="none" />
      <text x="0" y="0" className="walkmap__label walkmap__label--road" fill={c.soft} transform="translate(412 150) rotate(-90)">
        RAILTON ROAD
      </text>

      {/* railway */}
      <path d="M560 0 C 540 120, 520 220, 500 290" stroke={c.rail} strokeWidth="3" fill="none" />
      <path d="M576 0 C 556 120, 536 220, 516 290" stroke={c.rail} strokeWidth="3" fill="none" />
      {Array.from({ length: 14 }, (_, i) => {
        const t = i / 13
        const y = t * 290
        const x = 560 - 60 * t
        return <line key={i} x1={x - 2} y1={y} x2={x + 20} y2={y} stroke={c.rail} strokeWidth="2" opacity="0.6" />
      })}

      {/* station */}
      <g transform="translate(470 270)">
        <rect x="-4" y="0" width="74" height="44" rx="6" fill={evening ? '#4b3a2a' : '#c9b49b'} />
        <path d="M-8 2 L 33 -18 L 74 2Z" fill={evening ? '#5c4734' : '#a8927a'} />
        <rect x="24" y="18" width="18" height="26" rx="9" fill={evening ? '#f2b45f' : '#6f6455'} />
      </g>
      <text x="476" y="342" className="walkmap__label" fill={c.ink}>
        Herne Hill
      </text>
      <text x="476" y="360" className="walkmap__label walkmap__label--small" fill={c.soft}>
        station
      </text>

      {/* Sunday market */}
      <g className={`walkmap__market ${sunday ? 'is-on' : ''}`}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${436 - i * 2} ${244 + i * 16}) rotate(-12)`}>
            <rect x="0" y="0" width="22" height="10" fill={i % 2 ? '#ffa443' : '#395856'} />
            <path d="M0 10 q 2.75 4 5.5 0 t 5.5 0 t 5.5 0 t 5.5 0" fill={i % 2 ? '#ffa443' : '#395856'} />
          </g>
        ))}
      </g>
      <text x="372" y="242" textAnchor="end" className="walkmap__label walkmap__label--small" fill={c.soft}>
        {sunday ? 'Market today' : 'Sunday market'}
      </text>

      {/* Archie's */}
      <g transform="translate(344 176)">
        <rect x="0" y="0" width="64" height="32" rx="6" fill="#3b4229" />
        <path d="M0 22 H64 L60 32 H4Z" fill="#ffa443" />
        <circle cx="32" cy="-14" r="16" fill="#ffa443" className={evening ? 'walkmap__pin--glow' : ''} />
        <path d="M24 -6 V-18 a8 8 0 0 1 16 0 V-6 M24 -12 H40" fill="none" stroke="#232014" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <text x="334" y="202" textAnchor="end" className="walkmap__label walkmap__label--big" fill={c.ink}>
        Archie’s
      </text>
      <text x="334" y="176" textAnchor="end" className="walkmap__label walkmap__label--small" fill={c.soft}>
        319–321 Railton Rd
      </text>

      {/* the walk */}
      <motion.path
        d={walk}
        fill="none"
        stroke={evening ? '#ffcf98' : '#7a1c08'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0.1 10"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
      />
      <circle r="7" fill={evening ? '#ffa443' : '#7a1c08'} stroke={c.bg} strokeWidth="3">
        <animateMotion dur="4.5s" repeatCount="indefinite" path={walk} keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="linear" />
      </circle>
      <g transform="translate(468 214)">
        <rect x="0" y="0" width="92" height="30" rx="15" fill={evening ? '#ffa443' : '#232014'} />
        <text x="46" y="20" textAnchor="middle" className="walkmap__label walkmap__label--chip" fill={evening ? '#1b130b' : '#f6ebe2'}>
          1 min walk
        </text>
      </g>

      {/* compass */}
      <g transform="translate(560 410)" fill={c.soft}>
        <path d="M0 -16 L6 0 L0 -4 L-6 0Z" />
        <text x="0" y="14" textAnchor="middle" className="walkmap__label walkmap__label--small">
          N
        </text>
      </g>
      <text x="24" y="420" className="walkmap__label walkmap__label--small" fill={c.soft} opacity="0.8">
        Not to scale
      </text>
    </svg>
  )
}
