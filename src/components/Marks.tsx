import { motion } from 'framer-motion'
import { useEffect, useState, type CSSProperties, type RefObject } from 'react'
import type { PhotoName } from '../data/media'
import { Photo } from './Photo'

/** The single A that heads each of their printed menus. */
export function AMono({ className = 'amono' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="35" viewBox="0 0 31 50" aria-hidden="true" focusable="false">
      <path d="M3 48 V17 a12.5 12.5 0 0 1 25 0 V48 M3 30 H28" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const on = () => setFine(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return fine
}

let top = 10

interface PinnedProps {
  name: PhotoName
  caption?: string
  /** rotation in degrees */
  r?: number
  /** aspect ratio of the photo inside the print */
  ar?: string
  /** desktop placement on the wall, as percentages of the wall */
  x?: string
  y?: string
  w?: string
  z?: number
  sizes?: string
  position?: string
  delay?: number
  className?: string
  /** the wall the print can be dragged around on */
  wall?: RefObject<HTMLElement>
}

/** A photograph printed with a white border and pinned to the wall. On a desktop it can be moved around. */
export function Pinned({ name, caption, r = 0, ar = '4 / 5', x, y, w, z = 1, sizes = '(max-width: 900px) 50vw, 24vw', position, delay = 0, className = '', wall }: PinnedProps) {
  const fine = useFinePointer()
  const [zi, setZi] = useState(z)
  return (
    <motion.figure
      className={`print-photo pin ${caption ? 'print-photo--captioned' : ''} ${fine && wall ? 'is-draggable' : ''} ${className}`}
      style={{ '--x': x, '--y': y, '--w': w, '--ar': ar, zIndex: zi } as CSSProperties}
      initial={{ opacity: 0, y: -28, rotate: r - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate: r }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 15, delay }}
      drag={fine && !!wall}
      dragConstraints={wall}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setZi(++top)}
      whileDrag={{ scale: 1.04, rotate: r * 0.4 }}
    >
      <Photo name={name} shape="none" sizes={sizes} position={position} />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  )
}
