export const SITE_URL = 'https://alexwilder-dev.github.io/archies-herne-hill/'

export const site = {
  name: "Archie's Herne Hill",
  short: "Archie's",
  tagline: 'All-day Latin American dining',
  address: {
    line1: '319–321 Railton Road',
    town: 'London',
    postcode: 'SE24 0JN',
    oneLine: '319–321 Railton Road, London SE24 0JN',
  },
  email: 'hello@archieslondon.co.uk',
  hireEmail: 'emma@archieslondon.co.uk',
  instagram: 'https://instagram.com/archies_hernehill',
  instagramHandle: '@archies_hernehill',
  facebook: 'https://facebook.com/profile.php?id=61570097670322',
  giftCards: 'https://app.squareup.com/gift/MLYENFKC28F78/order',
  sister: { name: "Archie's Archway", url: 'https://archieslondon.co.uk' },
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent("Archie's 319-321 Railton Road London SE24 0JN"),
  press: {
    quote: 'For brunch: Archie’s',
    source: 'Country & Town House',
    context: 'Local guide to Herne Hill',
  },
  market: { name: 'Herne Hill Market', where: 'Railton Road', when: 'Sundays, 10am–4pm' },
} as const
