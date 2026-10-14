import manifest from './media-manifest.json'

export type PhotoName = keyof typeof manifest

export const ALT: Record<PhotoName, string> = {
  'shopfront-railton-road': 'Archie’s on Railton Road at dusk: olive-green shopfront, orange awnings and warm light in the windows',
  'brunch-eggs-bloody-mary': 'Fried eggs over salsa and tortilla chips in a cast-iron pan, with a Bloody Mary behind',
  'banquette-candlelight': 'Candlelit tables against an olive-green banquette, with plants on the shelves above',
  'fried-calamari-charred-lemon': 'Crisp fried seafood with a charred lemon half, spring onion and chilli',
  'cocktail-tajin-pineapple': 'A Tajín-rimmed tequila cocktail with grilled pineapple and coriander',
  'choclitos-corn-ribs': 'Choclitos: fried corn ribs dusted with Tajín',
  'tacos-pickled-onion': 'Two tacos piled with slow-cooked meat, salsa and pickled red onion',
  'sharing-plates-spread': 'A table of sharing plates: corn ribs, tacos, fish and crisp fried bites',
  'steak-over-flames': 'A steak on the grill with flames rising through the bars',
  'eggs-green-red-salsa': 'Eggs in green and red salsa with black beans and crumbled cheese, on a woven mat',
  'party-table-dahlias': 'A long party table set with dahlias in glass bottles and wine glasses',
  'private-dining-room-mural': 'The first-floor private dining room: a colourful mural, fabric blinds and long tables laid for a party',
  'arched-roof-dining-room': 'The ground-floor room under the arched terracotta roof, with wicker lamps and the open kitchen',
  'fascia-awning': 'The Archie’s sign above the orange awning reading 319–321 Railton Rd',
}

export const media = manifest as Record<PhotoName, { w: number; h: number; tone: string }>

const BASE = import.meta.env.BASE_URL

export function src(name: PhotoName, w: 720 | 1440 = 1440) {
  return `${BASE}media/${name}-${w}.webp`
}

export function srcSet(name: PhotoName) {
  const m = media[name]
  const small = Math.min(720, m.w)
  const big = Math.min(1440, m.w)
  return `${src(name, 720)} ${small}w, ${src(name, 1440)} ${big}w`
}
