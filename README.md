# PSQUARE COMPANY website

Two regional editions, like apple.com and apple.com/ca:

| Edition | Homepage | Contact               | `lang`  | Primary CTA     |
| ------- | -------- | --------------------- | ------- | --------------- |
| Global  | `/`      | `/start-a-project`    | `en`    | Start a project |
| Canada  | `/ca`    | `/ca/start-a-project` | `en-CA` | Book a demo     |

Each edition is a route group with its own root layout (`src/app/(global)`, `src/app/(canada)/ca`), so moving
between them is a full page load. Pages are shared components (`src/components/pages/*`) that take a `region`;
copy that differs lives in `src/content/home/{global,ca}.ts` (shared copy in `shared.ts`), region settings in
`src/lib/region.ts`. Every page carries hreflang alternates (Global doubles as `x-default`), the sitemap lists both
editions, and the footer has a Global / Canada switcher that keeps you on the same page. Unmatched URLs use
`src/app/global-not-found.tsx`.

Phase 1: the homepage and Start a Project contact page in both editions, plus the shared nav and footer. Built from the design handoff in [`design/`](design/) (`HANDOFF.md` is the spec, `CLAUDE.md` the design rules, `*.dc.html` the visual reference).

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

1. Build the page as a component in `src/components/pages/` taking `region`, with `metadata` from the design file's
   `<helmet>` and `alternates(region, path)` from `src/lib/seo.ts`.
2. Compose `SiteNav region current="…"`, `InnerHero`, your sections, `SiteFooter region path`, and `<PageReveal />`
   (`data-split` + `<Words>` on headings, `data-reveal` on blocks). Build links with `routesFor(region)`.
3. Add a thin `page.tsx` in both `src/app/(global)/<page>/` and `src/app/(canada)/ca/<page>/`.
4. Register both paths in `BUILT` in `src/lib/site.ts` (turns on link prefetching) and the path in `src/app/sitemap.ts`.

## Motion notes

- Hero and inner-hero entrances are CSS keyframes (word stagger .07s, .65s, design easing) so the server-rendered
  headline paints on first frame; everything scroll-linked is GSAP/ScrollTrigger.
- "The change we build" scrubs fragments into the "One view of the work" panel as the stage crosses the viewport
  (as the prototype does; it is not pinned). Selected Work is pinned on desktop (100vh + 87.5vh per extra project) and a stacked list below 1024px.
- Homepage brand intro plays once per browser session (`sessionStorage["psq-intro"]`, `["psq-intro-ca"]` on Canada); click or Escape skips it.
- `prefers-reduced-motion`: no Lenis, no pinning/scrubbing/marquee/reveals/blob loops; final states shown.
- "How we work" (Global): hovering, focusing or tapping a step moves the mock screen through its four stages; on
  phones the steps are a swipe row that drives it.
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
