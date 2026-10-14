# Archie's Herne Hill — website concept

A speculative demo site for **Archie's Herne Hill**, the all-day Latin American restaurant and cocktail bar at 319–321 Railton Road, London SE24 0JN.

It is a front-end demo: full visual design and interactions on static data. There is no CMS, database, payment or booking provider behind it, and the booking, private-hire enquiry and newsletter forms only show their success states.

## What's in it

- **Three looks, taken from the restaurant itself.** A full-bleed photograph with the wordmark across it and a dark price board (the evening), the arch from their printed feasting menus on the feast yellow (menus, feasting, private hire), and photographs pinned to the plaster wall with neon (the room).
- **Day and evening states.** The site reads London time against the opening hours (evening from 5:30pm, Wednesday to Saturday). By day it leads with brunch on the shopfront green; in the evening it switches to the grill photograph, the night board and dinner, cocktails and feasting, and the lights go down on the wall. The Day / Evening switch in the header overrides it for the visit.
- **Home** — the hero with the open-now line, the price board (hover a dish to swap the photograph), the room as a wall of prints you can move around on a desktop, feasting and private hire in the arch, find us (station, Brockwell Park, the Sunday market), and in the footer gift cards, the newsletter and the Archway sister site.
- **Menus** (`#/menu`) — Brunch, Lunch & Dinner, Feasting and Drinks, transcribed from the restaurant's PDFs into `src/data/menu.ts` and set inside the arch the way they print them, with v / vg / gf filters (gf includes gf* options), serving times and the 12.5% service note.
- **Private hire** (`#/private-hire`) — the Private Dining Room and Exclusive Venue Hire, both feasting menus, and a seven-step enquiry: space → date → guests → occasion → menu → contact → summary → success.
- **Book** (`#/book`) — party size, date and time slots built from the opening hours, details, confirmation and an add-to-calendar file.

## Where things live

| | |
|---|---|
| Opening hours, service times, booking rules | `src/data/hours.ts` |
| Menus | `src/data/menu.ts` |
| Private hire spaces and options | `src/data/hire.ts` |
| Address, emails, links | `src/data/site.ts` |
| Photo alt text | `src/data/media.ts` |
| Palette and grounds (sampled from the logo, menus and photos) | `src/styles/base.css` |

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the build
```

The build uses relative asset paths and hash routing, so it works on GitHub Pages under any repository name and deep links work on static hosting. The link-preview tags in `index.html` point at `https://alexwilder-dev.github.io/archies-herne-hill/`. `.github/workflows/deploy.yml` builds and publishes on every push; in the repository's Pages settings, Source must be set to **GitHub Actions**.

### Media

Photos were renamed by what they show and resized to WebP at 720px and 1440px wide by `scripts/process-media.mjs`, which also traces the wordmark to SVG and makes the favicon, touch icon and `public/og.jpg` (1200×630). Originals are kept out of the repo in `intake/`.

```bash
npm run media
```

Site by AlexWilder-Dev
