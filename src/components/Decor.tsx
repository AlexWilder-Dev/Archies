import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

/* Shapes lifted from the first-floor mural: long blades, a crescent, soft
   pebbles, in the mural's own teal, mustard, pink, maroon and sage. */
export function Mural({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={`mural ${className}`} style={style} viewBox="0 0 600 700" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="600" height="700" fill="var(--mural-bg, #9aa4a0)" opacity="0.0" />
      <path d="M-20 120 C 120 60, 260 120, 300 330 C 200 300, 60 260, -20 300Z" fill="var(--slate)" />
      <path d="M90 700 C 120 470, 230 260, 420 70 C 380 300, 300 520, 250 700Z" fill="var(--teal)" />
      <path d="M300 700 C 320 520, 400 360, 610 240 L 610 470 C 500 520, 420 600, 400 700Z" fill="var(--maroon)" />
      <path d="M330 40 C 420 120, 470 240, 450 420 C 400 300, 330 200, 250 130 C 270 90, 300 60, 330 40Z" fill="var(--mustard)" />
      <path d="M440 0 C 520 60, 580 130, 610 210 L 610 0Z" fill="var(--sage)" />
      <ellipse cx="150" cy="520" rx="78" ry="54" fill="var(--pink)" transform="rotate(-18 150 520)" />
      <path d="M470 560 a 90 90 0 1 0 120 -100 a 70 70 0 1 1 -120 100Z" fill="var(--orange)" />
      <path d="M40 360 C 100 340, 170 380, 190 440 C 130 450, 70 420, 40 360Z" fill="var(--sage)" />
      <circle cx="520" cy="320" r="26" fill="var(--pink)" />
    </svg>
  )
}

/* A trailing pothos, like the ones spilling off the shelves. Sways gently. */
export function Vine({ className = '', flip = false, length = 1 }: { className?: string; flip?: boolean; length?: number }) {
  const leaves = [
    [58, 40, -30],
    [40, 86, 24],
    [66, 128, -18],
    [44, 176, 30],
    [70, 222, -26],
    [48, 268, 22],
    [64, 312, -20],
    [50, 356, 28],
  ].slice(0, Math.round(8 * length))
  const h = 60 + leaves.length * 46
  return (
    <motion.svg
      className={`vine ${className}`}
      viewBox={`0 0 120 ${h}`}
      aria-hidden="true"
      style={{ transformOrigin: 'top center', scaleX: flip ? -1 : 1 }}
      animate={{ rotate: [-1.6, 1.6, -1.6] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d={`M60 0 C 50 60, 70 120, 55 180 S 62 300, 56 ${h - 10}`}
        fill="none"
        stroke="var(--vine-stem, #4c5a34)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0 C 10 -14, 30 -14, 30 2 C 30 16, 14 24, 0 32 C -14 24, -30 16, -30 2 C -30 -14, -10 -14, 0 0Z"
          transform={`translate(${x} ${y}) rotate(${r}) scale(0.62)`}
          fill={i % 3 === 0 ? 'var(--leaf-a, #5d7a3a)' : i % 3 === 1 ? 'var(--leaf-b, #46602f)' : 'var(--leaf-c, #7b9550)'}
        />
      ))}
    </motion.svg>
  )
}

/* The corrugated arched roof over the ground floor, as concentric ribs. */
export function RoofRibs({ className = '', count = 7 }: { className?: string; count?: number }) {
  const ribs = Array.from({ length: count }, (_, i) => i)
  return (
    <svg className={`ribs ${className}`} viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true">
      {ribs.map((i) => {
        const inset = i * 14
        const w = 400 - inset * 2
        const r = w / 2
        return (
          <path
            key={i}
            d={`M${inset} 520 L${inset} ${r + inset} A ${r} ${r} 0 0 1 ${400 - inset} ${r + inset} L${400 - inset} 520`}
            fill="none"
            stroke="var(--rib)"
            strokeWidth={i === 0 ? 2.5 : 1.4}
            opacity={1 - i * 0.11}
          />
        )
      })}
    </svg>
  )
}

/* A neon sign. Unlit tubes by day, humming orange at night. */
export function Neon({ text, lit, className = '' }: { text: string; lit: boolean; className?: string }) {
  return (
    <span className={`neon ${lit ? 'is-lit' : ''} ${className}`} aria-hidden="true">
      <span key={String(lit) + text} className="neon__text">
        {text}
      </span>
    </span>
  )
}

/* Little arch “A”, from the wordmark — used as a bullet/stamp. */
export function ArchA({ className = '', size = 22 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size * 0.62} height={size} viewBox="0 0 31 50" aria-hidden="true">
      <path d="M3 48 V17 a12.5 12.5 0 0 1 25 0 V48 M3 30 H28" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/* Awning valance edge: the scallop shadow under the orange awnings. */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 6 Q 7.5 0 15 6 T 30 6 T 45 6 T 60 6 T 75 6 T 90 6 T 105 6 T 120 6" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  )
}
