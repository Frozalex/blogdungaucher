import fs from 'node:fs';

const svgUri = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const logo = fs.readFileSync(new URL('../../../public/images/logo-transparent.svg', import.meta.url), 'utf8');
const whiteLogo = fs.readFileSync(new URL('../../../public/images/logo-transparent-white.svg', import.meta.url), 'utf8');

// Original vector diagrams: no font-dependent chess characters or emoji.
// Knights use the site's existing SVG logo, in its two original colours.
const shapes = {
  p: '<circle cx="50" cy="25" r="12"/><path d="M42 39h16l-4 12 10 23H36l10-23z"/><path d="M32 77h36v10H32z"/>',
  r: '<path d="M29 14h11v12h10V14h10v12h11V14h7v24l-14 9 3 27H33l3-27-14-9V14z"/><path d="M28 77h44v10H28z"/>',
  b: '<path d="M50 12C22 32 27 48 44 53L34 74h32L56 53C73 48 78 32 50 12z"/><path d="M50 23v19M28 79h44v8H28z"/>',
  q: '<path d="M25 30l11 32h28l11-32-16 14-9-24-9 24zM36 65h28l5 10H31zM27 79h46v8H27z"/><circle cx="24" cy="25" r="5"/><circle cx="50" cy="15" r="5"/><circle cx="76" cy="25" r="5"/>',
  k: '<path d="M50 10v21M40 20h20" fill="none"/><path d="M50 34c-21-20-33 4-17 17l6 23h22l6-23c16-13 4-37-17-17zM29 78h42v9H29z"/>',
};
const pieces = {};
for (const white of [false, true]) {
  for (const [piece, shape] of Object.entries(shapes)) {
    const key = white ? piece.toUpperCase() : piece;
    pieces[key] = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${white ? '#fffef7' : '#171c1c'}" stroke="${white ? '#171c1c' : '#f6f5f1'}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${shape}</g></svg>`);
  }
}
pieces.n = svgUri(logo);
pieces.N = svgUri(whiteLogo);

// Embedding the SVG bytes also makes the render hash track every logo change.
export function brandAnimation(source) {
  return source.replaceAll('__BRAND_LOGO__', svgUri(logo))
    .replace('__BOARD_PIECES__', JSON.stringify(pieces));
}
