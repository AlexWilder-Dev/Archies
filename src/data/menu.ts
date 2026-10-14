// Transcribed from the restaurant's own menu PDFs (brunch, lunch & dinner,
// feasting, drinks). Names, descriptions and prices are kept as printed.

export type Diet = 'v' | 'vg' | 'gf' | 'gf*' | 'v*'

export interface Price {
  label?: string
  price: string
}

export interface MenuItem {
  id: string
  name: string
  price?: string
  prices?: Price[]
  desc?: string
  descItalic?: boolean
  diet?: Diet[]
  extras?: string[] // printed in italics below the description
}

export interface MenuSection {
  id: string
  title?: string
  note?: string
  columns?: string[] // e.g. 125ml / Bottle
  items: MenuItem[]
  footer?: string[]
}

export interface Menu {
  id: 'brunch' | 'lunch-dinner' | 'feasting' | 'drinks'
  title: string
  tab: string
  served: string
  intro?: string
  sections: MenuSection[]
  footnote?: string
  food: boolean
}

export const SERVICE_NOTE =
  'Please note a discretionary 12.5% service charge will be added to your bill. Please make the team aware of any dietary requirements or restrictions you may have.'

export const DIET_KEY: Record<Diet, string> = {
  v: 'vegetarian',
  vg: 'vegan',
  gf: 'gluten free',
  'gf*': 'gluten free option available',
  'v*': 'vegetarian option available',
}

export const brunch: Menu = {
  id: 'brunch',
  title: 'Brunch',
  tab: 'Brunch',
  served: 'From 9am, every day',
  food: true,
  sections: [
    {
      id: 'brunch-plates',
      title: 'Brunch',
      items: [
        {
          id: 'breakfast-bun',
          name: 'Breakfast Bun',
          price: '10',
          desc: 'Streaky bacon, house hash brown, fried St Ewe egg, melted cheddar, spinach, chipotle ketchup, toasted brioche bun',
          diet: ['v*'],
        },
        {
          id: 'avocado-toast',
          name: 'Avocado toast',
          price: '11',
          desc: 'Smashed avocado, radish, roasted cherry tomato, toasted pumpkin seeds, sourdough toast',
          diet: ['vg', 'gf*'],
          extras: ['+ poached St Ewe eggs 3', '+ grilled halloumi 4', '+ streaky bacon 4'],
        },
        {
          id: 'breakfast-burrito',
          name: 'Breakfast Burrito',
          price: '14',
          desc: 'Scrambled St Ewe eggs, house hash brown, grated cheddar, spinach, guacamole, chipotle sauce, Mexican crema, tortilla wrap',
        },
        {
          id: 'huevos-rancheros',
          name: 'Huevos Rancheros',
          price: '13',
          desc: 'Fried egg, refried beans, corn ribs, smashed avocado, pico de gallo, corn tortillas, charred lime, Mexican crema, spring onions',
          diet: ['gf'],
          extras: ['+ grilled Iberian chorizo 4'],
        },
      ],
    },
    {
      id: 'brunch-drinks',
      title: 'Cocktails | Juice',
      items: [
        {
          id: 'bloody-mary',
          name: 'Bloody Mary | Bloody Maria',
          price: '12',
          desc: 'Ketel One Vodka or El Tequileno Blanco, tomato juice, Tajin, horseradish, hot sauce, Worcestershire sauce, olive brine, pickled chilli',
        },
        {
          id: 'michelada',
          name: 'Michelada',
          price: '8',
          desc: 'Sol lager, tomato, juice Tajin, horseradish, Tapatio, Worcestershire sauce, olive brine, pickled guindilla chilli',
        },
        { id: 'mimosa', name: 'Mimosa', price: '8', desc: 'Cremant de Bourgogne, fresh orange juice' },
        { id: 'green-juice', name: 'Green Juice', price: '6', desc: 'Apple, spinach, kale, ginger, lemon' },
        { id: 'orange-juice', name: 'Orange Juice', price: '4.5', desc: 'Freshly squeezed orange juice' },
      ],
    },
    {
      id: 'brunch-sides',
      title: 'Sides',
      items: [
        { id: 'side-eggs', name: 'St Ewe Free Range Eggs', price: '3' },
        { id: 'side-toast', name: 'Rockstar sourdough/seeded gluten free toast', price: '3' },
        { id: 'side-chorizo', name: 'Grilled Iberian chorizo', price: '4' },
        { id: 'side-avocado', name: 'Smashed avocado', price: '4' },
        { id: 'side-bacon', name: 'streaky bacon', price: '4' },
        { id: 'side-halloumi', name: 'Grilled halloumi', price: '4' },
        { id: 'side-hash', name: 'house hash browns', price: '4' },
      ],
    },
  ],
}

export const lunchDinner: Menu = {
  id: 'lunch-dinner',
  title: 'Lunch & Dinner',
  tab: 'Lunch & Dinner',
  served: 'Served from 12pm & 5:30pm',
  food: true,
  sections: [
    {
      id: 'ld-small',
      title: 'To start & share',
      items: [
        { id: 'choclitos', name: 'Choclitos', price: '5', desc: 'Fried corn ribs, lime, tajin', diet: ['vg', 'gf'] },
        { id: 'tortilla-chips', name: 'Tortilla chips', price: '6', desc: '& guacamole', diet: ['vg', 'gf'] },
        {
          id: 'pork-belly-tacos',
          name: 'Pork Belly Tacos (x3)',
          price: '12',
          desc: 'Pork belly, pickled pineapple, refried beans, cabbage slaw, crispy skin, white onion, coriander, chipotle mayo',
          diet: ['gf'],
        },
        {
          id: 'oaxaca-ceviche',
          name: 'Oaxaca Ceviche',
          price: '11',
          desc: 'Citrus marinated raw seabass, mezcal, red onion, ginger, chilli',
          diet: ['gf'],
        },
        {
          id: 'chupe-de-jaibe',
          name: 'Chupe de Jaibe',
          price: '13',
          desc: 'Baked Chilean crab gratin, toasted Rockstar sourdough shards',
        },
      ],
    },
    {
      id: 'ld-mains',
      title: 'Mains',
      items: [
        {
          id: 'california-burrito',
          name: 'California Burrito',
          price: '13',
          desc: 'Mexican rice, fresh slaw, refried black beans, pico de gallo salsa, grated cheddar, chipotle sauce, sour cream, flour tortilla wrap',
          diet: ['v', 'gf*'],
          extras: ['+ chicken al pastor 3.5', 'grilled chorizo 3.0'],
        },
        {
          id: 'squash-quinoa',
          name: 'Roasted Squash & Quinoa Salad',
          price: '14',
          desc: 'Piloncillo roasted kabocha squash, quinoa, charred corn, crispy kale, lime cashew crema',
          diet: ['gf', 'vg'],
        },
        {
          id: 'swordfish',
          name: 'Grilled Swordfish',
          price: '22',
          desc: 'crushed baby new potatoes, chimichurri butter',
          diet: ['gf'],
        },
        {
          id: 'feijoada',
          name: 'Feijoada',
          price: '19',
          desc: 'Brazilian stew (pork shoulder, chorizo, black beans) farofa, grapefruit, green rice',
          diet: ['gf'],
        },
        {
          id: 'pollo-a-la-brasa',
          name: 'Pollo a la Brasa',
          price: '19 | 35',
          desc: 'Spiced half or whole roasted chicken & charred lemon served with house salsas',
          diet: ['gf'],
        },
        {
          id: 'grilled-picanha',
          name: 'Grilled Picanha',
          prices: [
            { label: '200g', price: '19' },
            { label: '300g', price: '28' },
            { label: '600g', price: '49' },
          ],
          desc: 'Served pink with French fries, chimichurri & aji amarillo mayo',
          diet: ['gf'],
        },
      ],
    },
    {
      id: 'ld-sides',
      title: 'Sides & salsas',
      items: [
        { id: 'french-fries', name: 'French Fries', price: '4', desc: 'Salted skin on French fries', diet: ['gf', 'vg'] },
        { id: 'spring-greens', name: 'Spring Greens', price: '4', desc: 'Garlic & lemon oil', diet: ['gf', 'vg'] },
        {
          id: 'house-green-salad',
          name: 'House Green Salad',
          price: '4',
          desc: 'Butter lettuce, radish, chives, lemon dressing',
          diet: ['gf', 'vg'],
        },
        { id: 'cassava-chips', name: 'Cassava Chips', price: '6', desc: 'Fried cassava chips, aji amarillo mayo', diet: ['gf', 'v'] },
        {
          id: 'salsas',
          name: 'Salsas',
          price: '2 each (all salsas 5)',
          desc: 'chimichurri | aji amarillo mayo | rocoto',
          diet: ['gf', 'v'],
        },
      ],
    },
  ],
}

export interface FeastMenu {
  id: 'feast-1' | 'feast-2'
  title: string
  price: string
  pp: number
  starters: MenuItem[]
  mains: MenuItem[]
  sidesLead: string
  sides: string[]
  dessert?: MenuItem[]
}

export const feast1: FeastMenu = {
  id: 'feast-1',
  title: 'Feasting Menu 1',
  price: '£45pp',
  pp: 45,
  starters: [
    { id: 'f1-totopos', name: 'Corn Totopos', desc: 'fresh house guacamole', diet: ['vg', 'gf'] },
    { id: 'f1-choclitos', name: 'Choclitos', desc: 'fried corn ribs, lime, tajin', diet: ['vg', 'gf'] },
    {
      id: 'f1-ceviche',
      name: 'Oaxaca Ceviche',
      desc: 'Marinated seabass, mezcal, red onion, ginger, chilli, citrus',
      diet: ['gf'],
    },
  ],
  mains: [
    { id: 'f1-pollo', name: 'Pollo a la Brasa', desc: '24 hour-marinated spiced whole roast chicken', diet: ['gf'] },
    { id: 'f1-picanha', name: 'Picanha steak (600g)', desc: 'grilled Aberdeen Angus rump cap,', diet: ['gf'] },
    {
      id: 'f1-squash',
      name: 'Roast squash & quinoa salad',
      desc: 'Piloncillo roasted acorn squash, quinoa, charred corn, crispy kale, lime cashew crema',
      diet: ['vg', 'gf'],
    },
  ],
  sidesLead: 'All served with a selection of sides:',
  sides: ['Cassava chips', 'Chargrilled broccoli', 'Trio of house salsas'],
}

export const feast2: FeastMenu = {
  id: 'feast-2',
  title: 'Feasting Menu 2',
  price: '£55pp',
  pp: 55,
  starters: [
    { id: 'f2-totopos', name: 'Corn Totopos', desc: 'fresh house guacamole', diet: ['vg', 'gf'] },
    { id: 'f2-choclitos', name: 'Choclitos', desc: 'Fried corn ribs, lime, tajin', diet: ['vg', 'gf'] },
    {
      id: 'f2-ceviche',
      name: 'Oaxaca Ceviche',
      desc: 'Marinated seabass, mezcal, red onion, ginger, chilli, citrus',
      diet: ['gf'],
    },
    { id: 'f2-chupe', name: 'Chupe de jaibe', desc: 'Baked crab gratin, Rockstar crusty bread' },
  ],
  mains: [
    { id: 'f2-picanha', name: 'Picanha steak (600g)', desc: 'grilled Aberdeen Angus rump cap' },
    { id: 'f2-bream', name: 'Whole grilled sea bream', desc: 'stuffed with herbs and lemon' },
    { id: 'f2-pollo', name: 'Pollo a la Brasa', desc: '24 hour-marinated spiced whole roast chicken' },
  ],
  sidesLead: 'All served with a selection of sides:',
  sides: ['cassava chips', 'grilled broccali', 'trio of house salsas'],
  dessert: [
    {
      id: 'f2-tres-leches',
      name: 'Tres Leches Cake',
      desc: 'Fluffy sponge cake, three milk sauce, toasted meringue, Armagnac cherry',
      diet: ['v', 'gf'],
    },
  ],
}

export const FEASTS = [feast1, feast2]

function feastSections(f: FeastMenu): MenuSection[] {
  const s: MenuSection[] = [
    { id: `${f.id}-start`, title: `${f.title} · ${f.price}`, note: 'To start', items: f.starters },
    { id: `${f.id}-mains`, note: 'To follow', items: f.mains, footer: [f.sidesLead, f.sides.join(' | ')] },
  ]
  if (f.dessert) s.push({ id: `${f.id}-dessert`, note: 'To finish', items: f.dessert })
  return s
}

export const feasting: Menu = {
  id: 'feasting',
  title: 'Feasting',
  tab: 'Feasting',
  served: 'Two sharing menus · £45pp and £55pp',
  intro: 'Big plates for the middle of the table. Ideal for groups and private hire.',
  food: true,
  sections: [...feastSections(feast1), ...feastSections(feast2)],
}

export const drinks: Menu = {
  id: 'drinks',
  title: 'Drinks',
  tab: 'Drinks',
  served: 'Cocktails, wine, beer and coffee, all day',
  food: false,
  sections: [
    {
      id: 'cocktails',
      title: 'Cocktails',
      items: [
        {
          id: 'el-comienzo',
          name: 'El Comienzo',
          price: '6.5',
          desc: 'The perfect way to start your experience, a half-sized version of our Tommy’s Margarita.',
          descItalic: true,
        },
        {
          id: 'picante',
          name: 'Picante',
          price: '12',
          desc: 'House jalapeno and coriander infused tequila, Briottet triple sec, agave syrup, Tajin, lime.',
          descItalic: true,
        },
        {
          id: 'tommys-margarita',
          name: 'Tommy’s Margarita',
          price: '12',
          desc: 'El Tequileno Reposado, lavender, agave, lime.',
          descItalic: true,
        },
        {
          id: 'mezcalero',
          name: 'Mezcalero',
          price: '13',
          desc: 'Quiquiriquí mezcal, Briottet triple sec, grapefruit, ginger, lime.',
          descItalic: true,
        },
        {
          id: 'pisco-sour',
          name: 'Pisco Sour',
          price: '13',
          desc: 'Gobernador, Angostura, agave, lime, egg white.',
          descItalic: true,
        },
        {
          id: 'mai-tai',
          name: 'Mai Tai',
          price: '13',
          desc: 'Planteray Pineapple, Appleton estate 8, Briottet triple sec, orgeat, lime',
          descItalic: true,
        },
        { id: 'negroni', name: 'Negroni', price: '12', desc: 'Agnes Arber Gin, Campari, Antica Formula.', descItalic: true },
        {
          id: 'old-fashioned',
          name: 'Old Fashioned',
          price: '12',
          desc: 'Maker’s Mark, Woodford Reserve, Angostura bitters.',
          descItalic: true,
        },
        {
          id: 'espresso-martini',
          name: 'Espresso Martini',
          price: '12',
          desc: 'Black Cow Vodka, Mr Black’s, fresh espresso',
          descItalic: true,
        },
        {
          id: 'paloma',
          name: 'Paloma',
          price: '13',
          desc: 'El tequileno Blanco, Ancho Reyes, Grapefruit, Jarritos Grapefruit, lime, agave, salt.',
          descItalic: true,
        },
      ],
    },
    {
      id: 'sparkling',
      title: 'Sparkling',
      columns: ['125ml', 'Bottle'],
      items: [
        wine('valento-prosecco', 'Valento Prosecco', 'Extra dry, Italy', '7', '36'),
        wine('cremant', 'Crémant de Bourgogne', 'Dufouleur Pere et Fils, France', '8', '44'),
        wine('nyetimber', 'Nyetimber Classic Cuvee', 'Brut, West Sussex, Uk', '15', '85'),
      ],
    },
    {
      id: 'white',
      title: 'White wine',
      columns: ['175ml', 'Bottle'],
      items: [
        wine('les-genets', 'Les Genets Colombard Blend', '2023, Cotes de Gascogne, France', '7.5', '30'),
        wine('reinosa-blanco', 'Marques de Reinosa, Rioja blanco', '2023, La Rioja, Spain', '8', '32'),
        wine('trajarinho', 'Trajarinho Vinho Verde', '2023, Portugal', undefined, '36'),
        wine('domaine-de-marce', 'Domaine de Marce, Sauvignon Blanc', '2023, Touraine, Loire, France', '9', '38'),
        wine('fram', 'FRAM Chardonnay', '2023, Robertson, South Africa', '9.5', '42'),
        wine('la-poda', 'La Poda Albarino', '2023, Rias Baixas, Spain', '11', '45'),
        wine('bieville', 'Domaine de Bieville, Chablis', '2023, France', undefined, '60'),
      ],
    },
    {
      id: 'red',
      title: 'Red',
      columns: ['175ml', 'Bottle'],
      items: [
        wine('de-chansac', 'De Chansac, Carignan', '2023, Pays d’Herault, France', '7.5', '30'),
        wine('reinsoa-crianza', 'Marques de Reinsoa, Rioja Crianza', '2020, Spain', '8.5', '34'),
        wine('raza-malbec', 'Raza Malbec Reserva', '2022, Famatina Valley, Argentina', '9', '36'),
        wine('brouilly', 'Brouilly, Domaine de Sermezy', '2023, Beaujolais, France', undefined, '44'),
        wine('montepulciano', 'Montepulciano d’Abruzzo', '2021, Piandimare, Italy', '11.5', '46'),
        wine('pavette', 'Pavette Pinot Noir', '2020, Central Coast, California', '13', '48'),
        wine('archaval-ferrer', 'Archaval-Ferrer Cabernet Sauvignon', '2020, Mendoza, Argentina', undefined, '56'),
        wine('valravn', 'Valravn Old Vine Zinfandel', '2022 Sonoma County, California', undefined, '65'),
      ],
    },
    {
      id: 'rose',
      title: 'Rose',
      columns: ['175ml', 'Bottle'],
      items: [
        wine('indesio', 'Indesio Pinot Grigio Rose', '2023, Veneto, Italy', '7.5', '30'),
        wine('recital', 'Recital Rose, Domaine Gavoty', '2023, Cotes de Provence, France', '9.5', '42'),
      ],
    },
    {
      id: 'draught',
      title: 'Beers and Ciders',
      note: 'Draught',
      columns: ['Half', 'Pint'],
      items: [
        { id: 'camden-hells', name: 'Camden Hells', prices: [{ label: 'Half', price: '3.5' }, { label: 'Pint', price: '6.9' }] },
        { id: 'camden-ipa', name: 'Camden Easy IPA', prices: [{ label: 'Half', price: '3.5' }, { label: 'Pint', price: '6.9' }] },
        { id: 'guest-tap', name: 'Guest Tap', desc: 'Please ask the team for details', descItalic: true },
      ],
    },
    {
      id: 'bottled',
      note: 'Bottled',
      items: [
        { id: 'modelo', name: 'Modelo Especial', price: '5.5' },
        { id: 'pacifico', name: 'Pacifico Clara', price: '5.5' },
        { id: 'daura', name: 'Daura Damm Gluten Free', price: '5.5' },
        { id: 'aspall', name: 'Aspall Draught Cyder', price: '5.5' },
        { id: 'brooklyn-na', name: 'Brooklyn Special Effects N.A.', price: '4.5' },
        { id: 'lazer-crush', name: 'Beavertown Lazer Crush N.A.', price: '4.5' },
      ],
    },
    {
      id: 'soft',
      title: 'Soft Drinks',
      items: [
        { id: 'coca-cola', name: 'Coca Cola', price: '4.2' },
        { id: 'diet-coke', name: 'Diet Coke', price: '4' },
        { id: 'coke-zero', name: 'Coke Zero', price: '4' },
        { id: 'jarritos-pineapple', name: 'Jarritos pineapple', price: '4.9' },
        { id: 'jarritos-grapefruit', name: 'Jarritos grapefruit', price: '4.9' },
        { id: 'jarritos-mango', name: 'Jarritos mango', price: '4.9' },
        { id: 'fs-tonic', name: 'Franklin and Sons tonic water', price: '3' },
        { id: 'fs-light-tonic', name: 'Franklin and Sons light tonic water', price: '3' },
        { id: 'fs-lemonade', name: 'Franklin and Sons lemonade', price: '3' },
        { id: 'karma-gingerella', name: 'Karma drinks Gingerella', price: '4.5' },
        { id: 'karma-razza', name: 'Karma drinks Razza lemonade', price: '4.5' },
        { id: 'belu-sparkling', name: 'Belu sparkling mineral water', price: '3 / 4.5' },
        { id: 'belu-still', name: 'Belu still mineral water', price: '3 / 4.5' },
        { id: 'house-green-juice', name: 'House green juice', price: '5.5', desc: 'Apple, lemon, spinach, kale, ginger', descItalic: true },
        { id: 'fresh-oj', name: 'Fresh squeezed orange juice', price: '4' },
        { id: 'apple-juice', name: 'Apple juice', price: '4' },
        { id: 'pineapple-juice', name: 'Pineapple juice', price: '4' },
        { id: 'pink-grapefruit', name: 'Pink Grapefruit juice', price: '4' },
        { id: 'tomato-juice', name: 'Tomato juice', price: '4' },
      ],
    },
    {
      id: 'hot',
      title: 'Hot Drinks',
      items: [
        { id: 'espresso', name: 'Espresso', price: '2.6' },
        { id: 'macchiato', name: 'Macchiato', price: '2.8' },
        { id: 'double-espresso', name: 'Double Espresso', price: '3' },
        { id: 'double-macchiato', name: 'Double Macchiato', price: '3.4' },
        { id: 'latte', name: 'Latte', price: '3.8' },
        { id: 'mocha', name: 'Mocha', price: '4.2' },
        { id: 'cappuccino', name: 'Cappuccino', price: '3.7' },
        { id: 'flat-white', name: 'Flat white', price: '3.6' },
        { id: 'americano', name: 'Americano / Long black', price: '3.0' },
        {
          id: 'canton-teas',
          name: 'Canton Teas',
          price: '3.5',
          desc: 'English breakfast, Earl Grey, Green Tea, Peppermint, Berry and Hibiscus',
          descItalic: true,
        },
        { id: 'kokoa', name: 'Kokoa 58% single origin Hot chocolate', price: '3.8' },
        { id: 'matcha-latte', name: 'Matcha Latte', price: '4' },
        { id: 'chai-latte', name: 'Chai Latte', price: '4' },
        { id: 'dirty-chai', name: 'Dirty Chai', price: '4.5' },
        {
          id: 'syrup',
          name: 'Add a flavoured syrup to your drink',
          price: '+ 0.3',
          desc: 'Caramel, Vanilla, Sugar free hazelnut',
          descItalic: true,
        },
        { id: 'alt-milk', name: 'Alternative milks available', price: '+ 0.4', desc: 'Oat, Almond', descItalic: true },
      ],
      footer: ['Most of our coffees come as a two shot standard, please let us know if you would like one shot instead'],
    },
  ],
}

function wine(id: string, name: string, desc: string, glass: string | undefined, bottle: string): MenuItem {
  return { id, name, desc, descItalic: true, prices: glass ? [{ price: glass }, { price: bottle }] : [{ price: '' }, { price: bottle }] }
}

export const MENUS: Menu[] = [brunch, lunchDinner, feasting, drinks]

export function findItem(id: string): MenuItem | undefined {
  for (const m of MENUS) for (const s of m.sections) for (const i of s.items) if (i.id === id) return i
  return undefined
}

export function itemPrice(i: MenuItem): string {
  if (i.price) return i.price
  if (i.prices) return i.prices.filter((p) => p.price).map((p) => (p.label ? `${p.label} ${p.price}` : p.price)).join(' | ')
  return ''
}
