# Satyam Sharma · Portfolio

Source for **https://monkeydcoder.github.io/**: my research and projects in reinforcement learning, as a
master's student at the Institute of Science Tokyo.

Built with Next.js 15 (static export), React 19, Tailwind CSS 3 and TypeScript. No backend, no tracking.

## Updating the site

All text, links and project data live in one file: [`src/data/site.ts`](src/data/site.ts).

1. Edit `src/data/site.ts` (or replace files in `public/`, e.g. the résumé PDF).
2. Commit and push to `main`.
3. GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds the site and publishes it
   to GitHub Pages. It is live about two minutes later; progress shows in the repository's **Actions** tab.

## Running locally

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, live reload
npm run build      # static site written to out/
npm run preview    # serve out/ at http://localhost:4173
```

## Layout

```
src/
  app/            layout (fonts, metadata), page, 404, icon, robots, sitemap
  components/     one file per section, plus GridWorld (hero animation) and ProjectMedia
  data/site.ts    every piece of content on the site
  styles/         global CSS and design tokens
public/
  images/         profile photo and project stills (pre-sized; the export has no image optimiser)
  videos/         Earth Docker demo
  Satyam_Sharma_Resume.pdf
```

## Notes

- Images are served as-is, so resize them before adding (the profile photo is 640 px wide, about 115 KB).
- `npm audit` reports advisories in build-time tooling (PostCSS inside Next.js, Tailwind's file watcher). None of
  that code ships to visitors. Clearing them fully needs Next.js 16, which requires Node 20+.
- The hero animation is a scripted illustration of the MiniGrid DoorKey task, not a trained agent.
