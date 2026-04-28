# LandingPage

Landing Page Configurator — a single static `index.html` ready to deploy on Vercel.

## Deploy on Vercel

This repo is a zero-build static site. Vercel will serve `index.html` directly.

### Option A — Vercel Dashboard
1. Go to https://vercel.com/new and import this repository.
2. Framework Preset: **Other** (no build step needed).
3. Build Command: leave empty.
4. Output Directory: leave empty (defaults to repo root).
5. Click **Deploy**.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## Local preview
Any static server works, e.g.:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Configuration
- `vercel.json` — sets clean URLs, security headers, and long-lived caching for static assets.
