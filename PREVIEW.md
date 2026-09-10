# Preview site — `/previewsite`

The redesigned seven-page marketing site is staged at
**`https://brandxcommerce.com/previewsite/`**, alongside the current one-page
site, which is unchanged and still serves at `/`.

Nothing outside `public/previewsite/` was touched, so the preview can be shown,
revised or thrown away without any risk to the live site.

## What's in it

| Page | File |
| --- | --- |
| Home | `index.html` |
| Growth Marketing | `growth-marketing.html` |
| Shopify Support | `shopify-support.html` |
| CRM | `crm.html` |
| Our Tools | `tools.html` |
| Case Studies | `case-studies.html` |
| Who We Are | `about.html` |
| Free Audit | `free-audit.html` |

```
public/previewsite/
├── *.html                    the eight pages
├── css/tokens.css            design-system tokens, vendored verbatim
├── css/site.css              component CSS extracted from the DS bundle, plus overrides
├── js/site.js                sticky-header state + the Formspree lead form
└── assets/
    ├── brandx-logo.png       wordmark (and -inverse for the navy footer)
    ├── clients/              client marks for the home-page marquee
    └── illustrations/        service-card plates (see below)
```

The site is plain static HTML/CSS/JS — no build step, no framework, no new
dependencies — matching how the current site is built. `server.js` needed no
changes: `express.static` already serves the folder and its `index.html`.

## Promoting it to the full site

Internal links and asset paths are all **relative**, so the folder works
unchanged at the root. To promote:

1. Delete the staging `noindex` line near the top of each page's `<head>`:
   ```
   <!-- PREVIEW STAGING ONLY — delete this line when promoting to the live root. -->
   <meta name="robots" content="noindex, nofollow" />
   ```
2. Move the contents of `public/previewsite/` up into `public/`, replacing the
   current `index.html`, `style.css` and `script.js`.
3. Optionally add extensionless routes in `server.js` (e.g. `/growth-marketing`
   → `growth-marketing.html`) and 301s from the old anchors (`/#services`,
   `/#proprietary`) to the new pages.

Until then the preview is excluded from search indexing by the `noindex` meta
tag on every page.

## Lead form

`free-audit.html` posts to the **same Formspree endpoint as the live site**
(`https://formspree.io/f/mzdoypjj`) with the same field names — `name`, `email`,
`phone`, `website`, `message` — plus the same `_subject` line and `_gotcha`
honeypot, so submissions land in the existing inbox and look identical to
today's. The form has a native `action`/`method` as well, so it still submits
without JavaScript.

## Service-card illustrations

The design handoff shipped the nine service cards on the three pillar pages with
empty plates ("illustration pending — source asset not vendored"). These are
filled from the existing image library (`public/images/svc-*.svg`), recolored
from the old palette to the new design tokens (navy `#0B1B2B`, signal green
`#3C7724`, warm paper) and copied to `assets/illustrations/`. The originals in
`public/images/` are untouched.

| Card | Illustration | Fit |
| --- | --- | --- |
| Paid acquisition | `svc-growth.svg` | exact |
| Measurement & planning | `svc-cro.svg` | exact |
| AI discovery readiness | `svc-ai.svg` | exact |
| Development & replatforms | `svc-web.svg` | exact |
| Infrastructure & integrations | `svc-strategy.svg` | **approximate** |
| CRO & business intelligence | `svc-cro.svg` | exact |
| Email & SMS production | `svc-strategy.svg` | **approximate** |
| Lifecycle & segmentation | `svc-cro.svg` | **approximate** |
| Loyalty & retention planning | `svc-loyalty.svg` | exact |

The library has six illustrations for nine cards. Six map exactly; the three
marked approximate reuse the nearest available plate and are the obvious
candidates for purpose-drawn replacements.

## Unused assets

`assets/clients/` also holds `little-tuxedos.webp` and the white-on-transparent
originals of the Blacktie and Museum of Graffiti marks. They aren't referenced
yet — they're kept so the client marquee can be extended without re-sourcing.
