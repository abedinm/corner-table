# Corner Table — Restaurant Website

A complete, mobile-first single-page site for a local restaurant. No frameworks, no build step — open `index.html` in any modern browser and it works.

---

## File structure

```
CornerTable/
├── index.html      Markup + JSON-LD Restaurant schema + OG tags
├── styles.css      All styles (mobile-first, single accent, print stylesheet)
├── script.js       Vanilla JS: nav, reveal-on-scroll, form, back-to-top, SW
├── sw.js           Service worker — caches the shell for offline use
├── manifest.json   PWA manifest
├── favicon.svg     "CT" monogram icon
├── 404.html        Branded not-found page (shares styles.css)
├── netlify.toml    Security headers, cache policy, 404 fallback
├── robots.txt      Crawl rules
├── sitemap.xml     Single-page sitemap
├── .gitignore      OS / editor / Netlify-state ignores
└── README.md       This file
```

### What each deployment file does

- **`netlify.toml`** — sets strict security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), cache rules per file type, and a `/*` → `/404.html` (status 404) fallback. The `sw.js` is explicitly marked no-cache so old service workers can't lock users out of new releases.
- **`404.html`** — branded not-found page using the same fonts and tokens as the main site. Linked automatically via `netlify.toml`.
- **`robots.txt`** + **`sitemap.xml`** — basic SEO hygiene. Update the `cornertable.example` domain to your real one before launch.
- **`.gitignore`** — keeps OS junk, editor configs, and `.netlify/` state out of git if you deploy from a repo.

---

## Run locally

The simplest way: **double-click `index.html`**. Everything works except the service worker — service workers don't run from `file://` URLs.

To test the offline behavior, serve the folder over a local HTTP server:

```bash
# Python 3
python -m http.server 8080

# Or Node
npx serve .
```

Then open `http://localhost:8080`. After the first load, you can go offline and reload — the site still works.

---

## Deploy free on Netlify

### Option A — Drag & drop (fastest)

1. Go to <https://app.netlify.com/drop>
2. Drag the whole `CornerTable` folder onto the page
3. You'll get a public URL like `https://corner-table-xyz.netlify.app`

That's it. No build command, no environment variables.

### Option B — Connect a Git repo

1. Push this folder to GitHub
2. In Netlify → **Add new site → Import from Git**
3. Pick the repo
4. **Build command:** leave empty
5. **Publish directory:** `.` (or the subfolder if you put the files inside one)
6. Click **Deploy**

Vercel works the same way — it'll auto-detect a static site and deploy with no config.

---

## What to swap before going live

Search the codebase for these and replace:

| Item                | Where                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| Phone               | `(555) 014-2030` / `tel:+15550142030`                                      |
| Email               | `hello@cornertable.example`                                                |
| Address             | `412 Linden Street`, `Riverview, OR 97214`                                 |
| Hours               | `<table class="hours-table">` in `index.html`                              |
| Menu                | `<section id="menu">` in `index.html`                                      |
| Images              | Currently Unsplash CDN URLs — drop your own photos into `/images/` and update the `src` attrs (use `width` ≈ 1600 for hero, 800 for gallery) |
| Social links        | `<div class="footer-social">` — replace `href="#"` with real URLs          |
| Map placeholder     | `<div class="map-placeholder">` — paste a Google Maps embed iframe         |
| Structured data     | `<script type="application/ld+json">` in `<head>` — keep in sync with real info; this is what shows up in Google's rich results |

---

## Wiring up the contact form

The form currently validates client-side and shows a fake success message. Three easy backend-free options:

1. **Netlify Forms** (free, 100 submissions/month):
   add `data-netlify="true"` to the `<form>` tag and a hidden `<input type="hidden" name="form-name" value="contact" />`. Done — submissions appear in Netlify's dashboard.
2. **Formspree / Web3Forms / Basin:** point the `action` attribute at the service's endpoint, change `method="POST"`, and remove the `e.preventDefault()` line in `script.js`.
3. **Your own API:** replace the `form.addEventListener('submit', …)` block in `script.js` with a `fetch()` call.

---

## Design notes

- **Accent color** lives in one CSS variable: `--accent: #B7472A` in `styles.css`. Change in one place to re-skin the whole site.
- **Type pairing:** Fraunces (display serif) + Inter (body sans-serif), both via Google Fonts.
- **Breakpoints:** 500px, 600px, 900px. Mobile-first throughout.
- **Accessibility:** semantic HTML, `aria-label`s, skip link, visible focus rings, respects `prefers-reduced-motion`.
- **Performance:** hero image preloaded, all other images lazy-loaded, fonts use `display=swap`, service worker caches everything for repeat visits.

---

## License

The code in this folder is yours to use freely.

The placeholder photos are from [Unsplash](https://unsplash.com) and free for commercial use under the [Unsplash License](https://unsplash.com/license). Replace them with your own photos before launch for best performance and a unique look.
