import { Extras, Press } from '../components/home/Extras'
import { FindUs } from '../components/home/FindUs'
import { Hero } from '../components/home/Hero'
import { Highlights } from '../components/home/Highlights'
import { HireTeaser } from '../components/home/HireTeaser'
import { Room } from '../components/home/Room'

export function Home() {
  return (
    <>
      <Hero />
      <Press />
      <Highlights />
      <Room />
      <HireTeaser />
      <FindUs />
      <Extras />
    </>
  )
}
