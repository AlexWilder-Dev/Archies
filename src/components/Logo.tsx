import logo from '../assets/logo-path.json'

interface Props {
  className?: string
  title?: string
}

/** The Archie's wordmark, traced from their logo file. Inherits text colour. */
export function Logo({ className, title = "Archie's" }: Props) {
  return (
    <svg className={className} viewBox={`0 0 ${logo.w} ${logo.h}`} role="img" aria-label={title} focusable="false">
      <path fill="currentColor" fillRule="evenodd" d={logo.d} />
    </svg>
  )
}
