import type { CSSProperties } from 'react'
import { ALT, media, src, srcSet, type PhotoName } from '../data/media'

interface Props {
  name: PhotoName
  sizes?: string
  className?: string
  shape?: 'arch' | 'round' | 'none'
  eager?: boolean
  alt?: string
  position?: string
  style?: CSSProperties
}

export function Photo({ name, sizes = '(max-width: 760px) 100vw, 50vw', className = '', shape = 'round', eager, alt, position, style }: Props) {
  const m = media[name]
  return (
    <div
      className={`photo ${shape !== 'none' ? `photo--${shape}` : ''} ${className}`}
      style={{ '--tone': m.tone, ...style } as CSSProperties}
    >
      <img
        src={src(name, 1440)}
        srcSet={srcSet(name)}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={alt ?? ALT[name]}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  )
}
