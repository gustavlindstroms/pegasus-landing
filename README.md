# Pegasus Group AB — landing page

A static, single-page site. Deliberately minimal, dark-monochrome, investor-relations
in tone: it says little, but says it with confidence. No frameworks, no build step.

```
index.html    structure + content (both EN and SV strings live here)
styles.css    the whole design system
main.js       language toggle, scroll reveal, hero entrance (progressive enhancement)
```

The page is two blocks: a full-screen **hero** (the PEGASUS wordmark + one line) and a
**footer** carrying the IR contact and company details. That is the whole site, on purpose.

## Run it

Just open `index.html` in a browser. To serve it locally over HTTP (recommended, so the
fonts and `mailto:` behave exactly as in production):

```bash
cd ~/pegasus
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

It's three static files — host them anywhere: drag the folder into **Netlify** /
**Vercel** / **Cloudflare Pages**, push to a repo and enable **GitHub Pages**, or copy the
files to any web server / bucket. No environment, no secrets, no server code.

---

## ⚠️ Before you publish — check these

| What | Current value | Status |
|------|---------------|--------|
| **Contact email** | `ir@pegasusgroup.se` | Set — make sure the mailbox + domain are live |
| **Org. number** | `559XXX‑XXXX` | **Placeholder — replace** (footer legal block) |
| **Registered seat** | `Lund, Sweden` | Set |
| **Copyright year** | `2026` | Set (EN + SV) |

The org. number is the one real placeholder left. It appears once in `index.html`
(footer legal block). Everything else is final unless you want to change it.

---

## Design system (so future edits stay consistent)

- **Theme:** one locked dark theme. Background `#0A0A0B`, text `#EDEDED`. Never pure black/white.
- **Accent:** one cool teal `#3FA6A0`, used in a handful of places only (active language
  tick, email hover, focus rings). Do **not** introduce a second accent colour.
- **Type:** `Space Grotesk` (display) + `JetBrains Mono` (technical labels), loaded from
  Google Fonts with a system fallback. Weights 400 / 500 only.
- **Structure:** two blocks — Hero and Footer (contact). Resist adding About / Team /
  Products / "trusted by" sections; the restraint is the brand.
- **Lines, not boxes:** structure comes from 1px hairlines and whitespace — no cards, no
  shadows, no gradients, no rounded boxes.
- **Motion:** restrained and purposeful. The hero fades up on load, the rule under PEGASUS
  draws itself in, and the footer reveals once on scroll. Everything collapses to a static
  final state under `prefers-reduced-motion`, and the page is fully readable with
  JavaScript disabled.

## Language

English is the default; a discreet **EN / SV** toggle (top-right) swaps every string,
updates `<html lang>`, and remembers the choice in `localStorage`. Swedish visitors are
detected from their browser language on first visit. All translatable text lives in
`data-en` / `data-sv` attributes in `index.html` — edit both when you change copy.

## Accessibility

WCAG 2.1 AA contrast throughout, semantic landmarks (`header` / `main` / `footer`),
keyboard focus rings on every control, a skip link, 44px touch targets, and full
reduced-motion support.
