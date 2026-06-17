

import { readFileSync, writeFileSync } from 'fs';

const R2_BASE = 'https://pub-2b91df05320148438318902a8dc7795b.r2.dev/team-photos';

function slugify(name) {
  return name.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const filePath = 'src/data/teamData.ts';
let content = readFileSync(filePath, 'utf-8');


let replaced = 0;
let skipped = 0;

// Replace image URLs: find each object entry and update image field
const result = content.replace(
  /(\bname:\s*["']([^"']+)["'][^}]*?\bimage:\s*["'])(https?:\/\/images\.prismic\.io\/[^"']+)(["'])/gs,
  (match, prefix, name, _oldUrl, quote) => {
    const slug = slugify(name);
    const newUrl = `${R2_BASE}/${slug}.avif`;
    replaced++;
    return `${prefix}${newUrl}${quote}`;
  }
);

writeFileSync(filePath, result, 'utf-8');
console.log(`Done. Replaced ${replaced} Prismic image URLs with R2 URLs.`);
if (skipped > 0) console.log(`Skipped ${skipped} (no Prismic URL).`);
