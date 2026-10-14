import logo from '../assets/logo-path.json'

interface Props {
  className?: string
  title?: string
}

/** The Archie's wordmark, traced from their logo file. Inherits text colour. Pass an empty title when it is decoration. */
export function Logo({ className, title = "Archie's" }: Props) {
  const label = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
  return (
    <svg className={className} viewBox={`0 0 ${logo.w} ${logo.h}`} focusable="false" {...label}>
      <path fill="currentColor" fillRule="evenodd" d={logo.d} />
    </svg>
  )
}
