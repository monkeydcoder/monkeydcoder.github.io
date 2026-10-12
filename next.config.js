const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: `next build` writes the whole site to out/,
  // which GitHub Actions publishes to GitHub Pages.
  output: 'export',
  reactStrictMode: true,
  // GitHub Pages has no image-optimisation server; images are pre-sized in public/.
  images: { unoptimized: true },
  // Pin the project root (a stray lockfile in the home folder otherwise confuses detection).
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
