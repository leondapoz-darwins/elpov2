#!/usr/bin/env node
// Replace the template's stock-photo .webp references with ELPO photos
// served from the elpo-vvv.webflow.io CDN. Structural SVGs are left alone.

const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '..', 'content', 'protected.html');
let html = fs.readFileSync(file, 'utf8');

// ELPO content imagery from elpo-vvv.webflow.io CDN.
const HERO       = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/69157fe28d28152e48fd81b2_Bild_-15.jpg';
const IND_1      = 'https://cdn.prod.website-files.com/68c1d79efc7ec6abeec4b24b/68c1e0218405a9fa3229e079_Bild-21.jpg';
const IND_2      = 'https://cdn.prod.website-files.com/68c1d79efc7ec6abeec4b24b/68c1e02e635892b937e8b1a5_Bild-85.jpg';
const IND_3      = 'https://cdn.prod.website-files.com/68c1d79efc7ec6abeec4b24b/68c1e02d24314d377a427262_Bild-24.jpg';
const PLAN_1     = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/6902fb2d5c1d3f42ed156a85_Bild-83.jpg';
const EXEC_1     = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/6902fb30c638b2057e35dc45_Bild-38.jpg';
const COMM_1     = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/6902fb280f8169b7e34cd324_Bild-64.jpg';
const PROJECT    = 'https://cdn.prod.website-files.com/6902d9cf7243ea075dddcaad/6929867998213c3a0c159fcf_GE%20Ivoclar%20Rendering%20Retusche%202024%2002%2012a%20Composing.jpg';
const HERITAGE_1 = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/6927bd24405056a932775080_1997%20Elpo%2050%20Jahre%20Mannschaft.JPG';
const HERITAGE_2 = 'https://cdn.prod.website-files.com/6902d9cd7243ea075dddc9ff/6927bd28128cffc18c1e2cfc_2024%20Familie%20Pohlin.jpg';
const BLOG_1     = 'https://cdn.prod.website-files.com/6902d9cf7243ea075dddcaad/6931428459b82f48a08b524c_20250418%20Elpo%20Neubau%20(2).jpg';
const BLOG_2     = 'https://cdn.prod.website-files.com/6902d9cf7243ea075dddcaad/6925b04c9ef169a249f1730c_6902fb09cf23f914200c4635_Bild-1.jpg';

// Each entry: filename pattern in `assets/images/` → replacement URL.
// We match every responsive variant (-p-500, -p-800, -p-1080) by stem prefix.
const SWAPS = [
  // Hero / banner
  ['Home-three-banner-image_1',                        HERO],
  ['Feanzo-navbar-image-one',                          IND_3],
  // "Why choose" / heritage feeling
  ['Home-three-choose-image_1',                        IND_1],
  ['Home-three-choose-image_2',                        IND_2],
  ['Home-three-choose-grapg_1',                        HERITAGE_1],
  // Delivering / about
  ['Delivering-left_1',                                IND_3],
  // Consultation
  ['Consultation_1Consultation',                       PLAN_1],
  ['Consultation-two_1Consultation-two',               EXEC_1],
  ['Consultation_1',                                   PLAN_1],
  ['Consultation-two_1',                               EXEC_1],
  // Process section
  ['Home-three-process_1',                             COMM_1],
  // Project section
  ['Home-three-project-1_1',                           PROJECT],
  ['Home-three-project-2_1',                           IND_2],
  ['Home-three-project-3_1',                           HERITAGE_2],
  // Strategy / services background
  ['Home-three-strategies-1_1',                        IND_1],
  ['Home-three-strategies-2_1',                        IND_2],
  ['Home-three-strategies-3_1',                        IND_3],
  // Authors (used as testimonial portraits) → use heritage photos instead
  ['Author-1',                                         HERITAGE_2],
  ['Author-2_1',                                       HERITAGE_2],
  ['Author-3_1',                                       HERITAGE_1],
  ['Author-4_1',                                       HERITAGE_1],
  // Blog
  ['Blog-image_1Blog-image',                           BLOG_1],
  ['Blog-image_2',                                     BLOG_2],
  ['Blog-image_3',                                     PROJECT],
];

let swapped = 0;
let untouched = [];
for (const [stem, repl] of SWAPS) {
  // Match every `assets/images/<stem>...<.ext>` path (covers -p-500, -p-800 etc.)
  const re = new RegExp('assets/images/' + stem.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '[A-Za-z0-9._%-]*\\.(?:webp|png|jpg)', 'g');
  const before = html;
  html = html.replace(re, repl);
  const matches = (before.match(re) || []).length;
  if (matches > 0) swapped += matches;
  else untouched.push(stem);
}
fs.writeFileSync(file, html);
console.log('image references swapped:', swapped);
if (untouched.length) console.log('no-op (not in body):', untouched);

// Show what local images are still referenced (these are the structural ones we keep)
const remaining = (html.match(/assets\/images\/[A-Za-z0-9._%-]+\.(?:svg|png|jpg|webp)/g) || []);
const uniq = [...new Set(remaining)];
console.log('local image refs remaining:', uniq.length);
const stillWebp = uniq.filter(s => /\.webp$/.test(s));
if (stillWebp.length) {
  console.log('still-local webp (review):');
  stillWebp.forEach(s => console.log('  ' + s));
}
