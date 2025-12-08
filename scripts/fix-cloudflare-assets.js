#!/usr/bin/env node

/**
 * Post-build script to fix Cloudflare Pages static asset serving
 *
 * Problem: Cloudflare Pages uses .open-next/ as web root, but assets are in
 * .open-next/assets/_next/. Next.js references /_next/... so assets 404.
 *
 * Solution:
 * 1. Rename worker.js to _worker.js (Cloudflare Pages convention)
 * 2. Copy assets from .open-next/assets/* to .open-next/ root
 * 3. Generate _routes.json to serve static assets from CDN (not Worker)
 */

const fs = require('fs');
const path = require('path');

const OPEN_NEXT_DIR = path.join(process.cwd(), '.open-next');
const ASSETS_DIR = path.join(OPEN_NEXT_DIR, 'assets');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  console.log('🔧 Fixing Cloudflare Pages static assets...\n');

  // 1. Rename worker.js to _worker.js
  const workerSrc = path.join(OPEN_NEXT_DIR, 'worker.js');
  const workerDest = path.join(OPEN_NEXT_DIR, '_worker.js');

  if (fs.existsSync(workerSrc)) {
    fs.renameSync(workerSrc, workerDest);
    console.log('✓ Renamed worker.js → _worker.js');
  }

  // 2. Copy assets to root
  if (fs.existsSync(ASSETS_DIR)) {
    const assetFiles = fs.readdirSync(ASSETS_DIR);
    for (const file of assetFiles) {
      const src = path.join(ASSETS_DIR, file);
      const dest = path.join(OPEN_NEXT_DIR, file);
      copyRecursive(src, dest);
    }
    console.log('✓ Copied assets to .open-next/ root');
  }

  // 3. Generate _routes.json
  const routesConfig = {
    version: 1,
    include: ['/*'],
    exclude: [
      '/_next/static/*',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/*.svg',
      '/*.png',
      '/*.ico',
      '/*.csv'
    ]
  };

  fs.writeFileSync(
    path.join(OPEN_NEXT_DIR, '_routes.json'),
    JSON.stringify(routesConfig, null, 2)
  );
  console.log('✓ Generated _routes.json');

  console.log('\n✅ Cloudflare Pages assets fix complete!');
}

main();
