// One-off media pipeline: renames the downloaded photos by what they show,
// resizes them for the web, traces the logo to SVG, and builds the icons and
// the social preview image. Originals live in intake/originals (gitignored).
//
//   npm run media

import sharp from 'sharp'
import potrace from 'potrace'
import { promisify } from 'node:util'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import opentype from 'opentype.js'

const SRC = 'intake/originals'
const OUT = 'public/media'
const PUB = 'public'
await mkdir(OUT, { recursive: true })

const ORANGE = '#FFA443' // sampled from logo.png
const FASCIA = '#3B4229' // shopfront paintwork, darkened for contrast

// source file → descriptive name, optional crop (in original pixels)
const photos = [
  ['p01.jpg', 'shopfront-railton-road'],
  ['p02.jpg', 'brunch-eggs-bloody-mary'],
  ['p03.jpg', 'banquette-candlelight'],
  ['p04.jpg', 'fried-calamari-charred-lemon'],
  ['p05.jpg', 'cocktail-tajin-pineapple'],
  ['p06.jpg', 'choclitos-corn-ribs'],
  ['p07.jpg', 'tacos-pickled-onion'],
  ['p08.jpg', 'sharing-plates-spread'],
  ['p09.jpg', 'steak-over-flames'],
  ['p10.jpg', 'eggs-green-red-salsa'],
  // crop to the flowers and glassware; the printed menu card carries guests' names
  ['hire1.jpg', 'party-table-dahlias', { left: 0, top: 0, width: 960, height: 800 }],
  ['hire2.jpg', 'private-dining-room-mural'],
  ['hire3.jpg', 'arched-roof-dining-room'],
  ['ot.jpg', 'fascia-awning'],
]

const WIDTHS = [720, 1440]
const manifest = {}

for (const [file, name, crop] of photos) {
  const src = path.join(SRC, file)
  let base = sharp(src).rotate()
  if (crop) base = base.extract(crop)
  const buf = await base.toBuffer()
  const meta = await sharp(buf).metadata()
  manifest[name] = { w: meta.width, h: meta.height }
  for (const w of WIDTHS) {
    const width = Math.min(w, meta.width)
    await sharp(buf)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(path.join(OUT, `${name}-${w}.webp`))
  }
  // small blurred placeholder colour
  const { dominant } = await sharp(buf).stats()
  manifest[name].tone = `rgb(${dominant.r},${dominant.g},${dominant.b})`
  console.log('photo', name, meta.width, 'x', meta.height)
}
await writeFile('src/data/media-manifest.json', JSON.stringify(manifest, null, 2) + '\n')

// ---- logo → SVG path -------------------------------------------------------
const logoFlat = await sharp(path.join(SRC, 'logo.png'))
  .flatten({ background: '#ffffff' })
  .png()
  .toBuffer()
const trace = promisify(potrace.trace)
const svgRaw = await trace(logoFlat, { threshold: 200, turdSize: 20, optTolerance: 0.4 })
const d = svgRaw.match(/ d="([^"]+)"/)[1]
const logoMeta = await sharp(path.join(SRC, 'logo.png')).metadata()
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logoMeta.width} ${logoMeta.height}"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`
await writeFile('src/assets/logo-path.json', JSON.stringify({ w: logoMeta.width, h: logoMeta.height, d }) + '\n')
await writeFile(path.join(OUT, 'archies-logo.svg'), logoSvg.replace('currentColor', ORANGE))
console.log('logo traced, path length', d.length)

// ---- icons from the arched "A" of the wordmark ------------------------------
const aGlyph = await sharp(path.join(SRC, 'logo.png'))
  .extract({ left: 0, top: 0, width: 164, height: 285 })
  .toBuffer()
async function icon(size, radius, out) {
  const glyphH = Math.round(size * 0.62)
  const g = await sharp(aGlyph).resize({ height: glyphH }).png().toBuffer()
  const gm = await sharp(g).metadata()
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${FASCIA}"/></svg>`,
  )
  await sharp(bg)
    .composite([{ input: g, left: Math.round((size - gm.width) / 2), top: Math.round((size - gm.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUB, out))
  console.log('icon', out)
}
await icon(32, 7, 'favicon-32.png')
await icon(192, 40, 'icon-192.png')
await icon(512, 104, 'icon-512.png')
await icon(180, 0, 'apple-touch-icon.png') // iOS rounds its own corners

// ---- og.jpg: 1200×630 from the sharing-plates spread -----------------------
const fontPath = 'node_modules/@fontsource/comfortaa/files/comfortaa-latin-700-normal.woff'
const fontPath2 = 'node_modules/@fontsource/alegreya-sans/files/alegreya-sans-latin-500-normal.woff'
const fonts = {}
for (const f of [fontPath, fontPath2]) {
  if (!existsSync(f)) throw new Error('missing font ' + f)
  const b = await readFile(f)
  fonts[f] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}
function textPath(fontFile, text, x, y, size, spacing = 0, fill = '#fff') {
  const font = fonts[fontFile]
  let cx = x
  let out = ''
  for (const ch of text) {
    const glyph = font.charToGlyph(ch)
    out += glyph.getPath(cx, y, size).toPathData(2)
    cx += (glyph.advanceWidth / font.unitsPerEm) * size + spacing
  }
  return `<path fill="${fill}" d="${out}"/>`
}

const ogPhoto = await sharp(path.join(SRC, 'p08.jpg'))
  .resize({ width: 1200 })
  .extract({ left: 0, top: 150, width: 1200, height: 630 })
  .toBuffer()

const logoW = 560
const scale = logoW / logoMeta.width
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${FASCIA}" stop-opacity="0.97"/>
      <stop offset="0.52" stop-color="${FASCIA}" stop-opacity="0.86"/>
      <stop offset="0.78" stop-color="${FASCIA}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(72 214) scale(${scale})"><path fill="${ORANGE}" fill-rule="evenodd" d="${d}"/></g>
  ${textPath(fontPath, 'HERNE HILL', 76, 186, 30, 9, '#F4E6D6')}
  ${textPath(fontPath2, 'All-day Latin American dining', 74, 352, 40, 0, '#F4E6D6')}
  ${textPath(fontPath2, 'Brunch · lunch · dinner · cocktails', 74, 404, 30, 0, '#E7C9A6')}
  <rect x="74" y="470" width="300" height="54" rx="27" fill="${ORANGE}"/>
  ${textPath(fontPath, '319–321 RAILTON RD', 98, 505, 19, 2.4, FASCIA)}
</svg>`
await sharp(ogPhoto)
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(PUB, 'og.jpg'))
const ogMeta = await sharp(path.join(PUB, 'og.jpg')).metadata()
console.log('og.jpg', ogMeta.width, 'x', ogMeta.height, ogMeta.size ?? '')
