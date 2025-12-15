# Clickon Metronome

A clean, drummer-focused PWA metronome built with Vue 3 + TypeScript + Vite. It runs offline, keeps data in localStorage, and uses the Web Audio API scheduler for accurate timing.

## Features

- Accurate metronome engine with Web Audio scheduling, tap tempo, BPM slider, and +/- controls.
- Time signatures (4/4, 3/4, 6/8), subdivisions, swing feel, and separate sound selections for beat/accent.
- Preset management with create/edit/delete/duplicate and quick load list.
- Song library with search, notes, preset reference, and one-tap metronome start.
- Setlists with drag & drop ordering, add/remove songs, and dedicated Start Set mode showing current/next tunes.
- Three click sounds (Beep synth, Wood click, Snare click) generated procedurally for zero licensing risk.
- Local-only storage with JSON export/import, offline-ready via PWA service worker, and optional haptic tick feedback.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

> This repository was scaffolded without installing dependencies here. Run `npm install` locally to pull required packages before building.

## GitHub Pages deployment

The workflow in `.github/workflows/gh-pages.yml` builds the app on pushes to `main` or `release` and publishes the `dist` folder to GitHub Pages. To turn it on in your fork:

1. In the repository settings, open **Pages** and set the source to **GitHub Actions**.
2. Make sure the repository name matches the configured Vite base (`/clickon/`). If you rename the repo, update `base` and `start_url` in `vite.config.ts` to match `/your-repo-name/` and commit that change.
3. Push to `main` or `release` (or manually run the workflow). The action will upload the build and create the `github-pages` deployment.

If you want to deploy from a branch other than `main`, adjust the `branches` list in the workflow trigger.
