# SEO — Configureout Landing Page

## What was added (Phase 1)

### Meta & head
- `<meta name="description">` expanded to 140+ chars, action-oriented
- `<link rel="canonical">` added to both EN and SR pages
- `hreflang` alternates changed to absolute URLs (`https://configureout.com/…`)
- `og:url` and `og:site_name` added
- `og:image` and `twitter:image` changed to absolute URLs
- `<link rel="manifest" href="/site.webmanifest">` added
- Commented-out placeholders for Google and Bing site verification tokens

### Structured data (JSON-LD)
Three `<script type="application/ld+json">` blocks in `<head>` on both pages:

| Schema | Purpose |
|--------|---------|
| `Organization` | Brand entity, contact point, social links (empty array — fill when accounts exist) |
| `SoftwareApplication` | Product info + all 4 pricing tiers (Free/Starter/Growth/Scale) |
| `FAQPage` | 5 FAQ items — keep in sync with the FAQ section in `index.html` |

### New files
| File | Purpose |
|------|---------|
| `sitemap.xml` | Lists EN + SR URLs; update when new pages are added |
| `robots.txt` | Allows all crawlers; blocks /admin, /app, /api |
| `site.webmanifest` | PWA manifest; uses SVG icon (works in all modern browsers) |
| `vercel.json` | Updated with correct `Content-Type` headers for the above 3 files |

---

## What you need to do manually

### 1. Google Search Console
1. Go to search.google.com/search-console
2. Add property → URL prefix → `https://configureout.com`
3. Verify domain (HTML tag method: copy token into the commented placeholder in `index.html`)
4. Submit sitemap: `https://configureout.com/sitemap.xml`

### 2. Bing Webmaster Tools
1. Go to bing.com/webmasters
2. Add site → `https://configureout.com`
3. Verify (meta tag method: copy token into `index.html`)
4. Submit sitemap

### 3. Analytics
Recommendation: **Plausible Analytics** (privacy-first, no cookie banner needed, GDPR compliant)
- Sign up at plausible.io, add your domain
- Add `<script defer data-domain="configureout.com" src="https://plausible.io/js/script.js"></script>` before `</body>`

Alternative: Google Analytics 4 — heavier, requires cookie consent banner in EU.

### 4. Replace placeholder assets
| Asset | Current | Replace with |
|-------|---------|-------------|
| `og:image` | `configureout-og.svg` (SVG — some platforms don't support SVG) | Export a 1200×630 PNG from the OG design |
| Web manifest icons | SVG only | Add `icon-192.png` (192×192) and `icon-512.png` (512×512) PNG exports |
| `apple-touch-icon` | SVG | Add `apple-touch-icon.png` (180×180 PNG) |

### 5. Update `sameAs` in Organization schema
When social profiles are created, add their URLs to the `sameAs` array in the JSON-LD block in both `index.html` and `sr/index.html`:
```json
"sameAs": [
  "https://twitter.com/configureout",
  "https://linkedin.com/company/configureout"
]
```

### 6. Keep sitemap current
Update `sitemap.xml` whenever a new page is published. See the TODO comment at the top of the file for what to add and when.

### 7. Keep FAQPage schema in sync
The `FAQPage` JSON-LD block is manually maintained. If you add, remove, or edit FAQ items in `index.html`, update the corresponding entries in the JSON-LD block in both `index.html` and `sr/index.html`.

---

## Phase 2 checklist (not implemented)

- [ ] `/pricing` dedicated page with full tier comparison table
- [ ] `/demo` page with embedded live configurator
- [ ] Vertical landing pages (`/for/manufacturers`, `/for/custom-shops`, etc.)
- [ ] Blog with keyword-targeted articles
- [ ] Internal linking strategy between vertical pages and blog
- [ ] Backlink outreach (industry directories, partner sites)
- [ ] Core Web Vitals monitoring (set up in Google Search Console after verification)
- [ ] Replace SVG OG image with PNG for full social platform compatibility
