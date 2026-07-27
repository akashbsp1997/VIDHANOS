import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, 'icon-source.svg');
const outDir = path.join(__dirname, '..', 'public', 'icons');

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of targets) {
  await sharp(src, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, name));
  console.log(`wrote ${name} (${size}x${size})`);
}
