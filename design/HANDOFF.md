# Handoff: PSQUARE COMPANY Canada — Homepage + Contact

## Overview
Two pages for the Canadian site launch:
1. **Homepage (Canada)**: the marketing landing page.
2. **Start a Project (Canada)**: the contact and lead form. Every "Book a demo" / contact CTA on the homepage links here.

Build only these two pages, plus the shared nav and footer they use.

**This is Phase 1 of a multi-page site.** More pages follow one at a time (About/Company next, then Work, Capabilities, Case Study and 404). Build the shell, tokens and components so new pages slot in without rework.

## Setup: do this first
1. Unzip this package. It is code plus images.
2. Unzip the two video packages (`canada-videos-1`, `canada-videos-2`). Copy all 8 files into `design/assets/` so the prototype previews fully.
3. In the Next.js app, put production media in `public/media/` and images in `public/images/`.
4. Preview the design: `npx serve design`, then open both `.dc.html` files. Every image and video should load. This preview is the visual spec; match it.

## About the design files
The files in `design/` are **HTML design references**, not production code. They show the intended look, copy and behavior. Recreate them in the target codebase using its own patterns. If there is no codebase yet, use **Next.js (App Router) + React + TypeScript**, with CSS Modules or Tailwind mapped to the tokens below.

Each `.dc.html` file contains:
- an HTML template with `{{ }}` holes
- a `class Component extends DCLogic` block, which is a React class component; `renderVals()` is its render data
- all styling as inline styles

`support.js` is only the prototype runtime. **Do not ship it.** To preview, serve the `design/` folder (`npx serve design`) and open the files.

## Production stack (required)
- **Framework:** Next.js (App Router) + React + TypeScript.
- **Animation:** **GSAP** with **`@gsap/react`**. Use the `useGSAP()` hook so animations are scoped and cleaned up automatically. Register **ScrollTrigger** for scroll-linked work.
  - Hero headline word reveal: `gsap.from(words, { yPercent: 35, opacity: 0, stagger: .07, duration: .65, ease: 'expo.out' })`.
  - "The change we build": scattered cards collapse into "One view of the work". Use a pinned ScrollTrigger timeline with `scrub: true`.
  - Section reveals (fade plus 14px rise, .65s): `ScrollTrigger.batch()` on `[data-reveal]`, so each element animates once.
  - Logo marquee: a `gsap.to` loop with `xPercent:-50` and `repeat:-1` on a duplicated track. Use `gsap.ticker`, not CSS animation, so it can pause on hover.
  - Tab and knob slides, accordions and the product-card ticks are UI state changes. Use CSS transitions or `gsap.to` at the design durations; ScrollTrigger isn't needed for these.
- **Smooth scrolling:** **Lenis** (the prototype already includes its styles), synced to GSAP. Call `lenis.on('scroll', ScrollTrigger.update)`, then `gsap.ticker.add(t => lenis.raf(t * 1000))` and `gsap.ticker.lagSmoothing(0)`.
- **Easing mapping:** the design token `cubic-bezier(.16,1,.3,1)` maps to GSAP `'expo.out'`. You can also make an exact match with `CustomEase.create('psq', '.16,1,.3,1')`. Use this one easing everywhere.
- **Reduced motion:** wrap all of this in `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)`. In that branch, skip pinning, scrubbing, the marquee and the reveals, and show the final states instantly.
- **Performance:** animate only `transform` and `opacity`. Lazy-load videos below the fold (`preload="none"` plus an IntersectionObserver). Serve WebM with an MP4 fallback. Use `next/image` for logos. Load fonts with `next/font`.
- **Rendering:** mark animated sections `'use client'`. Keep the page shell, copy and SEO metadata server-rendered.
- **Form:** use React Hook Form with a Zod schema that mirrors the validation rules below. Post through a Next.js route handler to the CRM or email service.

## Fidelity
**High-fidelity.** Final colors, type, spacing, copy and motion. Match them exactly. `design/CLAUDE.md` holds the design rules, and `PSquare Design System.dc.html` is the token source of truth. Use no colors, fonts, radii or easings beyond these.

## Design tokens
**Colors**
- Plum `#330152`: accent, primary button, accent words, focus ring, error text
- Ink `#0f0e13`
- Body `#4b4a52`
- Muted `#6a6870`
- Paper `#fafaf8`: page background
- Surface `#fff`
- Chip `#efedf2`
- Plum tint `oklch(0.95 0.02 318)`
- Line `rgba(15,14,19,.1)`
- Border `rgba(15,14,19,.14)`

**Type**
- Fonts: Funnel Display (headings, weight 400) and Funnel Sans (UI and body), both from Google Fonts.
- H1: `clamp(40px,4.6vw,80px)`, line-height 1.04, letter-spacing -.045em
- H2: `clamp(36px,4vw,64px)`, line-height 1.05, letter-spacing -.045em
- H3: `clamp(26px,2.2vw,32px)`, letter-spacing -.025em
- Lead: `clamp(18px,1.4vw,21px)`, line-height 1.46, color `#4b4a52`
- Body: 16px, line-height 1.6
- Small: 14px
- Caption: 12px
- Eyebrow: 12px, weight 600, letter-spacing .16em, uppercase, plum

**Layout**
- Container max-width: 1680px
- Gutter: `clamp(20px,3.2vw,56px)`
- Section spacing: `clamp(120px,14vw,208px)`
- Hero top padding: `calc(80px + clamp(48px,7vw,112px))`

**Shape**
- Pill: 999px
- Card: 20px
- Media: 16px
- Item: 12px

**Motion**
- Easing: `cubic-bezier(.16,1,.3,1)`
- Durations: .25s (color), .5s (movement), .65s (reveal)
- Hover lift: `translateY(-1px)` plus shadow `0 12px 28px rgba(51,1,82,.24)`
- Press: `scale(.97–.98)`
- Respect `prefers-reduced-motion`: disable the background blob animations and the loops inside the service-capability illustrations.

**Focus**
- `outline: 2px solid #330152; outline-offset: 3px` on `:focus-visible`

## Shared components
- **Nav**: fixed. It hides on scroll down and shows on scroll up. It turns solid after the hero.
  - Desktop has mega-menu dropdowns for Solutions, Industries and Capabilities, plus a "Book a demo" pill (40px).
  - Mobile has a full-screen menu with accordions.
  - The homepage has its own inline copy of the nav, with the Canada CTA links. Build **one** `SiteNav` component that serves both pages.
- **Footer**: `SiteFooter.dc.html`.
- **Primary button**: plum pill, 52px tall (40px in the nav). White label at 16px/500, followed by an arrow that moves 3px right on hover.
- **Text link**: underline that grows on hover, with the arrow moving right.

## Screen 1 — Homepage (Canada) · `PSquare Homepage Canada.dc.html`
Sections in order (`data-screen-label` in the file):
1. **01 Hero**
   - Headline: "Software built around the way your business works."
   - Lead: "Focused platforms and custom systems that simplify field service, architecture, and real estate operations."
   - Buttons: "Book a demo →" (primary) and "Explore solutions →".
   - Background: hero reel video (muted, autoplay, loop, playsinline) plus a cursor-reactive plum fog (`fog.js`, canvas). The fog appears only here.
   - Headline animates in word by word.
2. **02 The change we build**: "Less chasing. More moving forward."
   - Scattered work cards (chat, spreadsheet, email thread, missed call) resolve into "One view of the work", a list of status rows.
   - The transition is driven by scroll.
   - Three outcomes: Make work visible / Reduce repeated effort / Create room to grow.
3. **03 What we do**: "From problem to production."
   - Tabbed capability stage with animated product illustrations: workspace UI, code to API to database, and an AI request pipeline.
   - Link: "All capabilities →".
4. **04 Selected work**: "Built for real work."
   - Product tabs: Sline Sales, ArcGrow, Sline Services. Each tab has a looping muted product video, an eyebrow such as "Sline Sales / Elevator sales", a headline, a short description and an "Explore … →" link.
   - Mobile version is a stacked list.
   - Link: "See our work →".
5. **06 Industries**: "Every business has its own moving parts."
   - Pill tabs: Field service management, Architecture, Realtors & real estate, Custom software. Each shows a 4-step flow (number, title, line of copy).
   - Footer line: "Working in another sector? …" plus "All industries →".
6. **07 Trusted by**: "Trusted by 50+ businesses across 20+ industries."
   - Infinite marquee of client logos. Logos are grayscale at .62 opacity, and turn full color at full opacity on hover.
   - Link: "About PSQUARE COMPANY →".
7. **08 Questions**: "Questions, answered."
   - 4-item accordion with one item open at a time. The copy is in the file.
8. **09 Next step**: "Let's make work work better."
   - Lead copy, "Book a demo →" and an email link.

Every CTA labelled "Book a demo" or "Start a project" goes to the contact page.

## Screen 2 — Start a Project (Canada) · `Start a Project Canada.dc.html`
**Hero**
- Plum aurora glow, eyebrow "Get in touch", H1 "Tell us how your **business works.**" (the second half in plum).
- Lead text on the right.
- Two-column grid: `minmax(0,1fr) clamp(320px,30vw,440px)`, `align-items:end`. It stacks below 900px.

**Body**
- Left: form card (white, 20px radius, padding `clamp(28px,3.6vw,64px)`).
- Right: aside, sticky at 120px from the top on desktop. It contains "What happens next" (copy changes with the enquiry type) and "Prefer email?" with info@psquarecompany.com.

**Form, top to bottom**
1. **"I'm interested in"**: segmented radiogroup with a sliding ink knob (.5s ease).
   - Options: Bespoke development · Our products · Software consultancy.
   - Short labels (Bespoke / Products / Consultancy) appear whenever the form's inner width is under 500px.
   - Arrow keys move the selection. Only the selected item is in the tab order.
   - A hint line underneath changes with the choice.
2. **Bespoke only: "Your industry (optional)"**: single-select pills (40px). Clicking the selected pill clears it.
   - Options: Field service management · Architecture · Realtors & real estate · Something else.
3. **Products only: "Which product?" (pick one or more)**: checkbox cards, 3 across when the form is at least 560px wide, otherwise one column.
   - Card contents: eyebrow label plus a 22px tick circle on the same row, then the name (Funnel Display 22px), then a one-line description.
   - Unselected card: white with a 1px Border ring.
   - Selected card: plum-tint background, 1.5px plum ring, plum eyebrow and plum tick.
   - Products:
     - Sline Sales — Sales — "Leads, quotes and orders for elevator companies."
     - ArcGrow — Studios — "Projects, teams and deadlines for design studios."
     - Sline Services — Service — "Breakdowns, dispatch and visits for elevator service."
   - Then **"Team size (optional)"** pills: 1-10 · 11-50 · 51-200 · 200+.
4. **Contact fields** (underline inputs: 52px tall, 18px text, Border underline, plum underline on focus):
   - Full name (required)
   - Work email (required)
   - Company (optional)
   - Phone (optional), with a country-code select defaulting to **+1** and placeholder "416 555 0142"
5. **Message**: the label, placeholder and required state change with the type:
   - Bespoke: "What do you need built?", required
   - Products: "Anything we should know before the demo?", optional
   - Consultancy: "What should we help you think through?", required
6. **Attachment**: Bespoke and Consultancy only. "+ Add a brief" dashed pill. Accepts PDF/doc/deck/images up to 10 MB. Selected files show as a removable chip.
7. **Footer row**: privacy note with a link, and a submit button whose label changes:
   - Bespoke: "Send enquiry"
   - Products: "Book a demo"
   - Consultancy: "Request a consultation"

**Validation** (errors appear on submit, not while typing)
- Name: required.
- Email: must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- Message: at least 8 characters when required.
- Products: at least one product ticked.
- Error styling: plum underline plus 14px plum text below the field, `role="alert"`, `aria-invalid`.
- Hidden honeypot field `company_website`. If it is filled, silently drop the submission.

**States**
- Idle.
- Sending: label "Sending…" at .7 opacity.
- Success: replaces the form with a check icon, "Thanks, {first name}. We've got it.", "We'll reply to {email} {type-specific next step}", a "Back to home" button and "Send another".

**Deep links**: the URL hash pre-selects the form.
- `#products`, `#consulting` and `#bespoke` select the type.
- `#sline-sales`, `#arcgrow` and `#sline-services` select Products with that product ticked.
- Changing the type updates the hash with `history.replaceState`.

**Submission payload** (not wired up in the prototype):
```
{ type: 'bespoke'|'products'|'consulting', industry?, products: string[], size?, name, email, company?, dial, phone?, message?, file? }
```
Send it to the form or CRM endpoint.

## Assets
- `design/assets/psquare-mark.svg`: logo mark.
- `design/assets/logo-*-trim.png`: client logos (ink on transparent).
- **Videos** (in the two video packages, 8 files, about 53 MB). Every video is muted, autoplays, loops and plays inline. Use WebM first with an MP4 fallback:
  - `hero-reel.webm` / `hero-reel.mp4`: hero background
  - `work-sline-sales.webm` / `work-sline-v5.mp4`: Selected work, Sline Sales tab
  - `work-arcgrow.webm` / `work-arcgrow-v2.mp4`: Selected work, ArcGrow tab
  - `work-sline-service.webm` / `work-sline-service.mp4`: Selected work, Sline Services tab
- Before shipping, re-encode the videos: H.264 MP4 plus VP9 or AV1 WebM, 1080p maximum, about 2–4 Mbps, faststart. Generate a poster JPG/AVIF from the first frame of each. Convert the logos to SVG or trimmed AVIF/WebP at 2× display size.

## Production requirements (Canada launch)
- **Hosting:** Vercel. Use Edge or Node as needed. Set up preview deployments per branch.
- **Locale:** `en-CA`, `<html lang="en-CA">`. Use Canadian spelling in any new copy. Phone defaults to +1.
- **SEO:** use the Next.js `metadata` API with title and description per page (copy them from each file's `<helmet>`). Add Open Graph and Twitter images, a canonical URL, `sitemap.ts`, `robots.ts`, and JSON-LD `Organization` on the homepage.
- **Performance targets:** Lighthouse 90+ on mobile across all four categories. LCP under 2.5s, CLS under 0.1, INP under 200ms. Render the hero headline as server-rendered text, not something waiting on JS. The hero video loads after the first paint, with the poster shown first.
- **Accessibility:** WCAG 2.2 AA. Keyboard paths for the nav, mega menus, tabs, accordion and form. Visible focus rings. `aria-*` exactly as in the prototype. Honour reduced motion.
- **Form backend:** a Next.js route handler that validates with Zod on the server, uses a honeypot plus rate limiting, and sends to email (e.g. Resend) and/or the CRM. Store uploads in object storage (S3 or R2), never in the database. Show success only after a 200 response.
- **Analytics:** wire events for `cta_book_demo_click`, `contact_type_change`, `contact_submit_success` and `contact_submit_error`. Use whatever provider the client confirms, behind cookie consent.
- **Code quality:** strict TypeScript, ESLint and Prettier. Organise code as reusable components (`components/ui`, `components/sections`), with no page-level copy-paste. Put tokens in one theme file. Add Playwright smoke tests: both pages render, the nav works, and form validation and submission behave correctly.

## Acceptance checklist
- [ ] Both pages match the design preview at 1440, 1024, 768 and 390 px wide.
- [ ] Every CTA routes to the contact page, and the deep links (`#products`, `#sline-sales`, and the others) pre-select the form.
- [ ] All 8 videos play muted and looping on iOS Safari, Android Chrome and desktop.
- [ ] Animations use GSAP with `@gsap/react` and Lenis, with no layout shift and no jank at 60fps.
- [ ] Reduced motion shows the final states with no animation.
- [ ] Lighthouse targets are met on the production URL.

## Files
- `design/PSquare Homepage Canada.dc.html`: homepage
- `design/Start a Project Canada.dc.html`: contact page
- `design/SiteNav.dc.html` and `design/SiteFooter.dc.html`: shared shell
- `design/PSquare Design System.dc.html`: tokens and components reference
- `design/CLAUDE.md`: design rules
- `design/fog.js`: hero cursor fog (canvas); port it as-is
- `design/image-slot.js` and `design/support.js`: prototype-only, do not ship
