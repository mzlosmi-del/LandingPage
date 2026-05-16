<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/configureout-lockup-reverse.svg">
    <img src="brand/configureout-lockup-primary.svg" alt="Configureout" width="320">
  </picture>
</p>
<p align="center">
  <em>Commerce · Configurators</em>
</p>

---

# Configureout — Landing Page

Static landing page for **Configureout**, the embeddable product configurator. Single `index.html` (English) + `sr/index.html` (Serbian), zero build step, deployed on Cloudflare Pages.

## Brand assets
SVGs live in [`brand/`](./brand/) — primary lockup, reverse lockup, bare mark, favicon, OG card.

## Deploy on Cloudflare Pages

### Option A — Cloudflare Pages Dashboard
1. Go to https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git and import this repository.
2. Framework Preset: **None** (no build step needed).
3. Build Command: leave empty.
4. Output Directory: leave empty (defaults to repo root).
5. Click **Save and Deploy**.

### Option B — Wrangler CLI
```bash
npm i -g wrangler
wrangler pages deploy .        # production deploy from current directory
```

Environment variables (`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_LIST_ID`, etc.) are configured in Cloudflare Pages → Settings → Environment variables, not in the repo.

## Local preview
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Configuration
- `_headers` — Cloudflare Pages security headers and long-lived asset caching.
- `index.html` — English landing page.
- `sr/index.html` — Serbian (Latin) landing page.
- `brand/` — logo, lockups, favicon, OG image.
