@AGENTS.md

# Project rules

- Design rules: `design/CLAUDE.md`. Tokens live only in `src/styles/theme.css`; use no colours, fonts, radii or easings outside it.
- Copy lives in `src/content/*`; components read from there. No page-level copy-paste of sections.
- Every page: `SiteNav` + `SiteFooter`; inner pages use `InnerHero`. Cursor fog only on the homepage hero (and the future 404).
- Animate only `transform`/`opacity`; wrap GSAP in `useGSAP` + `gsap.matchMedia()` and honour reduced motion.
- Before committing: `npm run lint && npm run typecheck && npm run build && npm run test:e2e`.
