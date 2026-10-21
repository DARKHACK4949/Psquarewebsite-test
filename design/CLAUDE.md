# PSQUARE COMPANY website — design rules

Source of truth: `PSquare Design System.dc.html`. Use ONLY these tokens/components. No new colors, fonts, radii, easings or component styles.

## Page shell (every page)
- `<dc-import name="SiteNav" current="work|sol|ind|cap|co" hint-size="100%,0px">` at top; `<dc-import name="SiteFooter" hint-size="100%,480px">` at bottom. Never inline nav/footer.
- Helmet body reset: bg #fafaf8, ink #0f0e13, Funnel Sans body, a:hover #330152, focus ring 2px #330152.
- Container: max-width 1680px; gutter `clamp(20px,3.2vw,56px)`; section spacing `clamp(120px,14vw,208px)`.
- Cursor fog (`fog.js`) is ONLY on the homepage hero and the 404 page. Never elsewhere.
- Inner-page hero: plum aurora glow, eyebrow, headline word-reveal, lead, top padding `calc(80px + clamp(48px,7vw,112px))`.
- Hero layout (all pages): 2-col grid — eyebrow + H1 left, lead (+ link/CTA) right, `align-items:end`, cols `minmax(0,1fr) clamp(320px,30vw,440px)`, column-gap `clamp(32px,7.5vw,128px)`. Stacks below 900px. Never stack lead under H1 on desktop.

## Color
Plum #330152 (accent, primary button, accent words) · Ink #0f0e13 · Body #4b4a52 · Muted #6a6870 · Paper #fafaf8 · Surface #fff · Chip #efedf2 · Plum tint oklch(0.95 0.02 318) · Line rgba(15,14,19,.1) · Border rgba(15,14,19,.14).

## Type
Funnel Display (headings, weight 400) / Funnel Sans (UI + body).
- Display H1 clamp(40px,4.6vw,80px)/1.04, -.045em
- Section H2 clamp(36px,4vw,64px)/1.05, -.045em
- H3 clamp(26px,2.2vw,32px), -.025em
- Lead clamp(18px,1.4vw,21px)/1.46 #4b4a52
- Body 16px/1.6 · Small 14px · Caption 12px
- Eyebrow 12px/600, .16em, uppercase, #330152

## Shape & motion
Radius: pill 999px · card 20px · media 16px · item 12px. Ease `cubic-bezier(.16,1,.3,1)`; durations .25s (color) / .5s (move) / .65s (reveal). Hover lift: translateY(-1px) + shadow 0 12px 28px rgba(51,1,82,.24). Active scale(.97–.98).

## Components
Primary button (plum pill, 52px / 40px nav) · Text link (underline grows on hover, arrow nudges) · Filter pill 56px · Segmented toggle (ink knob) · Icon button 48px circle · Tag chip 28px · Project card (white, 20px radius, 24px padding) · Form field (14px/500 label above, underline input 52px / 18px text, Border line, plum focus line, plum error text below).
