# PSQUARE COMPANY Canada website

Phase 1 of the Canadian site: the **homepage** (`/`) and **Start a Project** contact page (`/start-a-project`), plus the shared nav and footer. Built from the design handoff in [`design/`](design/) (`HANDOFF.md` is the spec, `CLAUDE.md` the design rules, `*.dc.html` the visual reference).

## Stack

- Next.js 16 (App Router) · React 19 · strict TypeScript · CSS Modules
- GSAP + `@gsap/react` (`useGSAP`, ScrollTrigger, CustomEase `psq` = `cubic-bezier(.16,1,.3,1)`)
- Lenis smooth scrolling, synced to the GSAP ticker
- React Hook Form + Zod (one schema shared by the form and the API route)
- Playwright smoke tests · ESLint · Prettier

## Run it

```bash
npm install
cp .env.example .env.local   # optional in dev
npm run dev                  # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`, `npm run test:e2e`
(the e2e suite builds and starts the app itself; set `PW_CHROMIUM_PATH` to use a system Chromium).

## Layout

```
src/
  app/                    routes, metadata, sitemap.ts, robots.ts, OG/Twitter images, api/contact
  styles/theme.css        all design tokens (colour, type, layout, shape, motion)
  content/                page copy and data (home, contact, nav, capability illustrations)
  components/ui           Button / TextLink / AccentLink, AppLink, Words (split headings)
  components/layout       SiteNav, SiteFooter
  components/sections     InnerHero (every inner page), home/*, contact/*
  components/providers    SmoothScroll (Lenis), PageReveal (scroll reveals), Analytics (consent)
  lib/                    site config + routes, motion, intro, analytics, contact schema, fog.js, server/*
public/media              videos (WebM first, MP4 fallback) + posters
public/images             mark and client logos (WebP, 2x display size)
```

### Adding a Phase 2+ page

1. Add the route under `src/app/<page>/page.tsx` with `metadata` copied from the design file's `<helmet>`.
2. Compose `SiteNav current="…"`, `InnerHero`, your sections, `SiteFooter`, and `<PageReveal />` for scroll reveals
   (`data-split` + `<Words>` on headings, `data-reveal` on blocks).
3. Register the path in `BUILT` in `src/lib/site.ts` (turns on link prefetching) and in `src/app/sitemap.ts`.

## Motion notes

- Hero and inner-hero entrances are CSS keyframes (word stagger .07s, .65s, design easing) so the server-rendered
  headline paints on first frame; everything scroll-linked is GSAP/ScrollTrigger.
- "The change we build" scrubs fragments into the "One view of the work" panel as the stage crosses the viewport
  (as the prototype does; it is not pinned). Selected Work is pinned (275vh) on desktop and a stacked list below 1024px.
- Homepage brand intro plays once per browser session (`sessionStorage["psq-intro-ca"]`); click or Escape skips it.
- `prefers-reduced-motion`: no Lenis, no pinning/scrubbing/marquee/reveals/blob loops; final states shown.
- The cursor fog (`src/lib/fog.js`, ported as-is) runs only in the homepage hero.

## Contact form backend

`POST /api/contact` (multipart: `payload` JSON + optional `file`) validates with the shared Zod schema, drops honeypot
(`company_website`) submissions silently, rate-limits per IP (5 / 10 min, in-memory: swap for Redis/KV when running
multiple instances), uploads briefs to S3/R2 when configured, then delivers via Resend and/or a CRM webhook. It only
returns 200 once delivery succeeded; in production it returns 503 if no delivery channel is configured.
See `.env.example` for the variables.

## Analytics

Events `cta_book_demo_click` (any `[data-track]` link), `contact_type_change`, `contact_submit_success`,
`contact_submit_error` go to `window.dataLayer` only after the visitor accepts the cookie prompt. Point GTM (or swap
`track()` in `src/lib/analytics.ts`) at the provider the client confirms.

## Deploying (Vercel)

Import the repo, set the env vars from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL` and `RESEND_API_KEY` or
`CONTACT_WEBHOOK_URL`). Preview deployments per branch are on by default.
