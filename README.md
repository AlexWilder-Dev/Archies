# Archie's Herne Hill — website concept

A speculative demo site for **Archie's Herne Hill**, the all-day Latin American restaurant and cocktail bar at 319–321 Railton Road, London SE24 0JN.

It is a front-end demo: full visual design and interactions on static data. There is no CMS, database, payment or booking provider behind it, and the booking, private-hire enquiry and newsletter forms only show their success states.

## What's in it

- **Day and evening states.** The site follows the room through the day. It reads London time against the opening hours (evening from 5:30pm, Wednesday to Saturday) and leads with brunch and coffee by day, dinner, cocktails and feasting by night. The switch in the header overrides it for the visit.
- **Home** — hero with an open-now pill, the press line, brunch or dinner highlights, the feasting menus, an interactive drawing of the building (upstairs, downstairs, outside), private hire, a walk from Herne Hill station with the Sunday market, gift cards, newsletter and the Archway sister site.
- **Menus** (`#/menu`) — Brunch, Lunch & Dinner, Feasting and Drinks, transcribed from the restaurant's PDFs into `src/data/menu.ts`, with v / vg / gf filters (gf includes gf* options), serving times and the 12.5% service note.
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
| Palette (sampled from the logo and photos) | `src/styles/base.css` |

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the build
```

The site is built for GitHub Pages under `/archies-herne-hill/` (see `vite.config.ts`) and uses hash routing, so deep links work on static hosting. `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

### Media

Photos were renamed by what they show and resized to WebP at 720px and 1440px wide by `scripts/process-media.mjs`, which also traces the wordmark to SVG and makes the favicon, touch icon and `public/og.jpg` (1200×630). Originals are kept out of the repo in `intake/`.

```bash
npm run media
```

Site by AlexWilder-Dev
