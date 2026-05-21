# CornerTable — context map

## What this is

Mobile-first restaurant SPA. **No framework, no build step.** Vanilla HTML/CSS/JS. PWA + Netlify deploy.

## Entry points

| File | What |
|---|---|
| `index.html` | Single page — sections via `<section data-route>` |
| `app.js` | Router + state + handlers |
| `style.css` | Tailwind-like utility classes (hand-written) |
| `sw.js` | Service worker for offline + install |
| `netlify.toml` | Deploy config + headers |

## Run

```bash
npx serve .       # preview at http://localhost:3000
```

No `npm install`, no Vite, no Webpack. That's the point.

## Conventions

- **Single file per concern.** No splitting `app.js` until it's > 1000 lines.
- **Inline SVG** for icons. No icon library.
- **CSS variables** for theme; no preprocessor.
- **All copy** is editable in `index.html` — no JSON or i18n layer.

## Memory pointers

- Project memory: `~/.claude/projects/F--/memory/cornertable.md`
