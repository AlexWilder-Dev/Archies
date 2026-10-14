import type { PhotoName } from './media'
import type { Weekday } from './hours'

export type SpaceId = 'pdr' | 'exclusive'
export type Sitting = 'brunch' | 'lunch' | 'dinner' | 'day' | 'evening'

export interface Space {
  id: SpaceId
  name: string
  where: string
  capacity: string
  capacityShort: string
  blurb: string
  features: string[]
  availability: string
  photo: PhotoName
  sittings: { id: Sitting; label: string; days: Weekday[]; daysLabel: string }[]
  limits: { seated: number; standing?: number }
}

const TUE_SUN: Weekday[] = [2, 3, 4, 5, 6, 0]
const TUE_FRI: Weekday[] = [2, 3, 4, 5]

export const SPACES: Space[] = [
  {
    id: 'pdr',
    name: 'The Private Dining Room',
    where: 'First floor',
    capacity: 'Seats up to 20',
    capacityShort: 'Up to 20 seated',
    blurb:
      'Our first-floor dining room, with its colourful mural, fabric blinds and views over Brockwell Park. Daylight for brunch, soft lighting in the evening.',
    features: ['Colourful mural', 'Brockwell Park views', 'Brunch, lunch or dinner', 'Tuesday to Sunday'],
    availability: 'Tuesday – Sunday, for brunch, lunch or dinner',
    photo: 'private-dining-room-mural',
    sittings: [
      { id: 'brunch', label: 'Brunch', days: TUE_SUN, daysLabel: 'Tue–Sun' },
      { id: 'lunch', label: 'Lunch', days: TUE_SUN, daysLabel: 'Tue–Sun' },
      { id: 'dinner', label: 'Dinner', days: TUE_SUN, daysLabel: 'Tue–Sun' },
    ],
    limits: { seated: 20 },
  },
  {
    id: 'exclusive',
    name: 'Exclusive Venue Hire',
    where: 'The whole building',
    capacity: '35 seated · 100 standing',
    capacityShort: '35 seated or 100 standing',
    blurb:
      'Both floors, all yours: the open kitchen and bar under the arched roof, the mural room upstairs, the DJ setup and sound system, and the snug breakout bar.',
    features: ['DJ setup & sound system', 'Snug breakout bar', 'Day hire Tue–Fri', 'Evening hire Tue–Sun'],
    availability: 'Day hire Tuesday – Friday · evening hire Tuesday – Sunday',
    photo: 'arched-roof-dining-room',
    sittings: [
      { id: 'day', label: 'Day hire', days: TUE_FRI, daysLabel: 'Tue–Fri' },
      { id: 'evening', label: 'Evening hire', days: TUE_SUN, daysLabel: 'Tue–Sun' },
    ],
    limits: { seated: 35, standing: 100 },
  },
]

export const OCCASIONS = [
  'Birthday',
  'Wedding or engagement',
  'Work do',
  'Christening or naming day',
  'Leaving or retirement',
  'Get-together',
  'Something else',
] as const

export const MENU_INTEREST = [
  { id: 'feast-1', label: 'Feasting Menu 1', detail: '£45pp', pp: 45 },
  { id: 'feast-2', label: 'Feasting Menu 2', detail: '£55pp · with dessert', pp: 55 },
  { id: 'brunch', label: 'Brunch', detail: 'From the brunch menu', pp: 0 },
  { id: 'drinks', label: 'Drinks & a party', detail: 'Standing, cocktails, DJ', pp: 0 },
  { id: 'unsure', label: 'Not sure yet', detail: 'Talk me through it', pp: 0 },
] as const
