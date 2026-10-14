import type { KeyboardEvent } from 'react'
import logo from '../../assets/logo-path.json'

export type Zone = 'upstairs' | 'downstairs' | 'outside'

interface Props {
  active: Zone
  onPick: (z: Zone) => void
  evening: boolean
}

/* An elevation of 319–321 Railton Road, drawn from the shopfront photo:
   London stock brick, white sashes, olive fascia, orange awning, and the
   terracotta arched roof glimpsed through the ground-floor glass. */
export function Building({ active, onPick, evening }: Props) {
  const glass = evening ? '#f2b45f' : '#3d4335'
  const glassUp = evening ? '#e7a456' : '#556158'
  const scale = 150 / logo.w
  const zoneProps = (z: Zone, label: string) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    'aria-pressed': active === z,
    className: `bld__zone ${active === z ? 'is-active' : ''}`,
    onClick: () => onPick(z),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPick(z)
      }
    },
  })

  return (
    <svg className={`bld ${evening ? 'bld--evening' : ''}`} viewBox="0 0 560 460" aria-label="The building at 319–321 Railton Road">
      <defs>
        <pattern id="brick" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill={evening ? '#4a4237' : '#9a8d78'} />
          <path d="M0 11.5H24M12 0V6M0 6H24M0 6V12M24 6V12" stroke={evening ? '#3a332a' : '#867a66'} strokeWidth="1" />
        </pattern>
        <linearGradient id="glow-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={evening ? '#ffcf86' : '#a88a63'} />
          <stop offset="1" stopColor={evening ? '#d98a3a' : '#5b4a35'} />
        </linearGradient>
        <clipPath id="shopglass">
          <rect x="70" y="258" width="150" height="112" />
          <rect x="300" y="258" width="190" height="112" />
        </clipPath>
      </defs>

      {/* sky / night */}
      <rect x="0" y="0" width="560" height="460" fill="transparent" />

      {/* ---------- upstairs ---------- */}
      <g {...zoneProps('upstairs', 'Upstairs: the private dining room')}>
        <rect x="30" y="18" width="500" height="186" fill="url(#brick)" />
        <rect x="24" y="12" width="512" height="10" fill={evening ? '#2c2a24' : '#5f5a50'} />
        {[62, 152, 242, 332, 422].map((x, i) => (
          <g key={x}>
            <rect x={x} y="44" width="70" height="128" rx="3" fill="#f3efe6" />
            <rect x={x + 6} y="50" width="58" height="56" fill={i === 2 ? '#e7a6ad' : glassUp} />
            <rect x={x + 6} y="110" width="58" height="56" fill={glassUp} />
            {/* fabric blinds */}
            <rect x={x + 6} y="50" width="58" height="20" fill={evening ? '#c08a5b' : '#d8c2a4'} />
            <path d={`M${x + 6} 70 q 7 5 14.5 0 t 14.5 0 t 14.5 0 t 14.5 0`} fill="none" stroke={evening ? '#8f633e' : '#b39a7a'} strokeWidth="2" />
            {i % 2 === 0 && (
              <g transform={`translate(${x + 18} ${150})`}>
                <path d="M0 0 c -6 -10 -4 -18 4 -20 c 2 8 0 14 -4 20Z M8 0 c 2 -12 8 -16 14 -14 c -2 8 -6 12 -14 14Z M4 0 c 0 -14 4 -22 8 -24 c 2 10 -2 18 -8 24Z" fill={evening ? '#3f4f2a' : '#5d7a3a'} />
                <rect x="-2" y="0" width="26" height="12" rx="2" fill={evening ? '#7b3a1c' : '#b45a2c'} />
              </g>
            )}
            <rect x={x - 4} y="172" width="78" height="6" fill="#efe9de" />
          </g>
        ))}
        <rect x="30" y="18" width="500" height="186" className="bld__hit" />
      </g>

      {/* ---------- downstairs ---------- */}
      <g {...zoneProps('downstairs', 'Downstairs: the open kitchen and bar under the arched roof')}>
        {/* cornice + fascia */}
        <rect x="22" y="204" width="516" height="8" fill={evening ? '#2c2a24' : '#5f5a50'} />
        <rect x="40" y="212" width="236" height="40" fill={evening ? '#2a2e1f' : '#747045'} />
        <rect x="290" y="212" width="230" height="40" fill={evening ? '#2a2e1f' : '#747045'} />
        <g transform={`translate(${82} ${220}) scale(${scale})`}>
          <path d={logo.d} fill={evening ? '#ffcf98' : '#f6efe2'} fillRule="evenodd" className={evening ? 'bld__neon' : ''} />
        </g>
        {/* shopfront */}
        <rect x="40" y="252" width="236" height="126" fill={evening ? '#2a2e1f' : '#4d5a36'} />
        <rect x="290" y="252" width="230" height="126" fill={evening ? '#2a2e1f' : '#4d5a36'} />
        <rect x="70" y="258" width="150" height="112" fill="url(#glow-in)" />
        <rect x="300" y="258" width="190" height="112" fill="url(#glow-in)" />
        {/* the arched roof seen through the glass */}
        <g clipPath="url(#shopglass)">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${40 + i * 10} 380 V${330 - i * 4} A ${240 - i * 10} ${120 - i * 6} 0 0 1 ${520 - i * 10} ${330 - i * 4} V380`}
              fill="none"
              stroke={evening ? '#9b2f0f' : '#7a1c08'}
              strokeWidth={i === 0 ? 7 : 3}
              opacity={evening ? 0.9 - i * 0.12 : 0.55 - i * 0.08}
            />
          ))}
          {[120, 175, 350, 420].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i % 2 ? 286 : 280})`}>
              <line x1="0" y1="-30" x2="0" y2="0" stroke="#2a2a20" strokeWidth="1" />
              <path d="M-12 0 a 12 14 0 0 0 24 0Z" fill={evening ? '#ffe2a8' : '#c9a777'} />
              {evening && <circle cx="0" cy="6" r="16" fill="#ffd28a" opacity="0.35" />}
            </g>
          ))}
        </g>
        {/* doors */}
        <rect x="224" y="262" width="44" height="116" fill={evening ? '#2a2e1f' : '#4d5a36'} stroke={evening ? '#4b4f36' : '#3b4229'} strokeWidth="3" />
        <rect x="230" y="270" width="32" height="70" fill={glass} opacity="0.9" />
        <rect x="494" y="262" width="22" height="116" fill={evening ? '#2a2e1f' : '#4d5a36'} />
        {/* pilaster */}
        <rect x="276" y="200" width="14" height="180" fill="#f1ede4" />
        <rect x="272" y="196" width="22" height="10" fill="#f1ede4" />
        <rect x="40" y="252" width="480" height="126" className="bld__hit" />
      </g>

      {/* awnings (decorative, on top) */}
      <g pointerEvents="none">
        <path d="M36 252 H280 L292 284 H24Z" fill={evening ? '#e98c2f' : '#ffa443'} />
        <path d="M24 284 H292 V290 H24Z" fill={evening ? '#b8661c' : '#e58a2b'} />
        <text x="158" y="279" textAnchor="middle" className="bld__awning-text" fill="#3b4229">
          319 – 321 RAILTON RD
        </text>
        <path d="M286 252 H524 L536 284 H274Z" fill={evening ? '#e98c2f' : '#ffa443'} />
        <path d="M274 284 H536 V290 H274Z" fill={evening ? '#b8661c' : '#e58a2b'} />
        <text x="405" y="279" textAnchor="middle" className="bld__awning-text" fill="#3b4229">
          ALL DAY DINING &amp; DRINKS
        </text>
      </g>

      {/* ---------- outside ---------- */}
      <g {...zoneProps('outside', 'Outside: tables on the corner')}>
        <rect x="0" y="378" width="560" height="82" fill={evening ? '#2a241d' : '#d2cdc5'} />
        <path d="M0 400 H560" stroke={evening ? '#3a3229' : '#bdb6ab'} strokeWidth="1" />
        <path d="M0 430 H560" stroke={evening ? '#3a3229' : '#bdb6ab'} strokeWidth="1" />
        {/* two tables on the corner */}
        {[96, 176].map((x) => (
          <g key={x} transform={`translate(${x} 404)`}>
            <ellipse cx="0" cy="0" rx="22" ry="5" fill={evening ? '#d9c6a8' : '#f4efe7'} />
            <line x1="0" y1="2" x2="0" y2="32" stroke="#2b2b22" strokeWidth="3" />
            <line x1="-10" y1="32" x2="10" y2="32" stroke="#2b2b22" strokeWidth="3" />
            <path d="M-36 4 v28 M-36 16 h-10 v16 M36 4 v28 M36 16 h10 v16" stroke="#2b2b22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            {evening && <circle cx="0" cy="-4" r="3" fill="#ffd28a" />}
          </g>
        ))}
        {/* a dog, because dogs are welcome */}
        <g transform="translate(232 420)" fill={evening ? '#8e6a48' : '#7b4a26'}>
          <ellipse cx="0" cy="0" rx="17" ry="8" />
          <circle cx="17" cy="-8" r="7" />
          <path d="M20 -14 l6 -6 l1 9Z" />
          <rect x="-13" y="4" width="4" height="12" rx="2" />
          <rect x="9" y="4" width="4" height="12" rx="2" />
          <path d="M-16 -2 q -10 -8 -8 -16" stroke={evening ? '#8e6a48' : '#7b4a26'} strokeWidth="3.5" fill="none" strokeLinecap="round" className="bld__tail" />
        </g>
        {/* potted plant */}
        <g transform="translate(470 410)">
          <path d="M0 0 c -14 -20 -10 -40 2 -48 c 6 16 4 32 -2 48Z M6 0 c 4 -24 18 -34 30 -30 c -4 16 -14 26 -30 30Z M-4 0 c -10 -14 -26 -18 -34 -12 c 8 10 20 14 34 12Z" fill={evening ? '#3f4f2a' : '#5d7a3a'} />
          <path d="M-14 0 h34 l-4 26 h-26Z" fill={evening ? '#7b3a1c' : '#b45a2c'} />
        </g>
        <rect x="0" y="378" width="560" height="82" className="bld__hit" />
      </g>
    </svg>
  )
}
