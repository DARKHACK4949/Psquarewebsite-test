"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { megaMenus, NAV_MODE, type MenuKey, type NavCurrent } from "@/content/nav";
import { usePathname } from "next/navigation";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { PRIVACY_URL, routesFor, social } from "@/lib/site";
import { REGIONS, regionPath, regions, type Region } from "@/lib/region";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import styles from "./SiteNav.module.css";

const WIDE = 1100;
const SOCIAL_ICONS = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  facebook: FacebookLogo,
} as const;
const FULL_NAV = NAV_MODE === "full";

function cx(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/**
 * Shared site navigation: fixed, hides on scroll down and returns on scroll up,
 * turns translucent-solid once the page scrolls. Desktop mega menus for
 * Solutions / Industries / Capabilities; full-screen accordion menu on mobile.
 */
export function SiteNav({ region, current = "none" }: { region: Region; current?: NavCurrent }) {
  const routes = routesFor(region);
  const menus = FULL_NAV ? megaMenus(region) : [];
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mx, setMx] = useState<MenuKey | null>(null);
  const [ddH, setDdH] = useState(0);
  const panels = useRef<Record<MenuKey, HTMLDivElement | null>>({
    sol: null,
    ind: null,
    cap: null,
  });
  const triggers = useRef<Record<MenuKey, HTMLButtonElement | null>>({
    sol: null,
    ind: null,
    cap: null,
  });
  const headerRef = useRef<HTMLElement>(null);
  const openedAt = useRef(0);
  const { lock } = useSmoothScroll();

  const close = useCallback(() => setOpen(null), []);

  // Scroll: solid after 8px, hide on scroll down past 120px, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      setSolid(y > 8);
      setHidden((h) => (y < 120 ? false : dy > 6 ? true : dy < -6 ? false : h));
      if (Math.abs(y - openedAt.current) > 24) setOpen(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Wheel/touch outside the header closes an open mega menu.
  useEffect(() => {
    if (!open) return;
    const onWheel = (e: Event) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      setOpen(null);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [open]);

  // Escape closes menus and returns focus to the trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) {
        triggers.current[open]?.focus({ preventScroll: true });
        setOpen(null);
      }
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Mobile menu closes when the viewport widens to desktop.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${WIDE}px)`);
    const on = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    lock(true);
    return () => lock(false);
  }, [menuOpen, lock]);

  useLayoutEffect(() => {
    setDdH(open ? (panels.current[open]?.offsetHeight ?? 360) : 0);
  }, [open]);

  const toggle = (k: MenuKey, viaKeyboard: boolean) => {
    openedAt.current = window.scrollY;
    const next = open === k ? null : k;
    setOpen(next);
    if (next && viaKeyboard) {
      setTimeout(
        () => panels.current[next]?.querySelector("a")?.focus({ preventScroll: true }),
        50,
      );
    }
  };

  const showSolid = (solid || !!open) && !menuOpen;
  // Region-neutral path of this page, so the menu's region switch lands on its twin.
  const pathname = usePathname() ?? "/";
  const neutralPath = pathname.replace(/^\/ca(?=\/|$)/, "") || "/";

  return (
    <>
      <header
        ref={headerRef}
        data-nav=""
        className={cx(
          styles.header,
          showSolid && styles.solid,
          menuOpen && styles.onMenu,
          !!open && styles.ddOpen,
          hidden && !menuOpen && !open && styles.hidden,
        )}
      >
        <nav aria-label="Primary" className={styles.bar}>
          <Link href={routes.home} aria-label="PSQUARE COMPANY home" className={styles.brand}>
            <Image src="/images/psquare-mark.svg" alt="" width={34} height={34} priority />
            <span>PSQUARE COMPANY</span>
          </Link>
          <span className={styles.spacer} />
          <div className={styles.links}>
            {FULL_NAV ? (
              <NavLink href={routes.work} on={current === "work"}>
                Work
              </NavLink>
            ) : (
              <NavLink href={routes.home} on={current === "home"}>
                Home
              </NavLink>
            )}
            {menus.map((m) => (
              <button
                key={m.key}
                ref={(el) => {
                  triggers.current[m.key] = el;
                }}
                type="button"
                aria-expanded={open === m.key}
                aria-controls={`mega-${m.key}`}
                onClick={(e) => toggle(m.key, e.detail === 0)}
                className={cx(
                  styles.link,
                  styles.trigger,
                  (open === m.key || current === m.key) && styles.on,
                )}
              >
                {m.label}
                <span aria-hidden="true" className={styles.plus}>
                  <span />
                  <span />
                </span>
                <span aria-hidden="true" className={styles.underline} />
              </button>
            ))}
            <NavLink href={routes.about} on={current === "co"}>
              Company
            </NavLink>
          </div>
          <Link href={routes.contact} className={styles.cta} data-track="cta_book_demo_click">
            {regions[region].cta}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            className={cx(styles.burger, menuOpen && styles.burgerOpen)}
          >
            <span />
            <span />
          </button>
        </nav>

        <div className={styles.dd} style={{ height: ddH }}>
          <div className={styles.ddInner}>
            {menus.map((m) => {
              const on = open === m.key;
              return (
                <div
                  key={m.key}
                  id={`mega-${m.key}`}
                  ref={(el) => {
                    panels.current[m.key] = el;
                  }}
                  role="region"
                  aria-label={m.label}
                  aria-hidden={!on}
                  inert={!on}
                  className={cx(styles.panel, on && styles.panelOn)}
                >
                  <div className={styles.panelGrid}>
                    <div className={styles.panelMain}>
                      <div className={styles.items}>
                        {m.items.map((it, i) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={close}
                            className={styles.item}
                            style={{ "--d": `${40 + i * 35}ms` } as CSSProperties}
                          >
                            <span className={styles.itemNum}>{String(i + 1).padStart(2, "0")}</span>
                            <span className={styles.itemText}>
                              <span className={styles.itemLabel}>{it.label}</span>
                              <span className={styles.itemDesc}>{it.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={m.all.href}
                        onClick={close}
                        className={styles.all}
                        style={{ "--d": "260ms" } as CSSProperties}
                      >
                        {m.all.label} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                    <div className={styles.aside} style={{ "--d": "120ms" } as CSSProperties}>
                      <span className={styles.asideTitle}>{m.asideTitle}</span>
                      {m.aside.map((a) => (
                        <Link
                          key={a.label}
                          href={a.href}
                          onClick={close}
                          className={styles.asideLink}
                        >
                          <span className={styles.asideLabel}>
                            {a.label} <span aria-hidden="true">→</span>
                          </span>
                          <span className={styles.asideDesc}>{a.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        onClick={close}
        className={cx(styles.scrim, !!open && styles.scrimOn)}
      />

      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cx(styles.menu, menuOpen && styles.menuOn)}
      >
        <nav aria-label="Menu" className={styles.mNav}>
          <Link
            href={FULL_NAV ? routes.work : routes.home}
            onClick={() => setMenuOpen(false)}
            className={styles.mItem}
            style={{ "--d": ".1s" } as CSSProperties}
          >
            {FULL_NAV ? "Work" : "Home"}
          </Link>
          {menus.map((m, i) => {
            const on = mx === m.key;
            return (
              <div
                key={m.key}
                className={styles.mGroup}
                style={{ "--d": `${0.05 + i * 0.03}s` } as CSSProperties}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`m-${m.key}`}
                  onClick={() => setMx(on ? null : m.key)}
                  className={cx(styles.mItem, styles.mTrigger, on && styles.mOn)}
                >
                  {m.label}
                  <span aria-hidden="true">+</span>
                </button>
                <div id={`m-${m.key}`} className={cx(styles.mPanel, on && styles.mPanelOn)}>
                  <div inert={!on}>
                    {m.items.map((it) => (
                      <Link key={it.href} href={it.href} onClick={() => setMenuOpen(false)}>
                        {it.label}
                      </Link>
                    ))}
                    <Link
                      href={m.all.href}
                      onClick={() => setMenuOpen(false)}
                      className={styles.mAll}
                    >
                      {m.all.label} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          <Link
            href={routes.about}
            onClick={() => setMenuOpen(false)}
            className={styles.mItem}
            style={{ "--d": ".16s" } as CSSProperties}
          >
            Company
          </Link>
        </nav>
        <div className={styles.mFoot} style={{ "--d": ".24s" } as CSSProperties}>
          <div className={styles.mSocials}>
            {social.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon];
              return (
                <a
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" size={22} />
                </a>
              );
            })}
          </div>
          <div className={styles.mRegions} aria-label="Region" role="group">
            {REGIONS.map((r) =>
              r === region ? (
                <span key={r} aria-current="true">
                  {regions[r].name}
                </span>
              ) : (
                <a key={r} href={regionPath(r, neutralPath)} hrefLang={regions[r].lang}>
                  {regions[r].name}
                </a>
              ),
            )}
          </div>
          <div className={styles.mLegal}>
            <a href={PRIVACY_URL}>Privacy</a>
            <Link href={routes.terms} onClick={() => setMenuOpen(false)}>
              Terms
            </Link>
            <a href={routes.sitemap}>Sitemap</a>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, on, children }: { href: string; on: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cx(styles.link, on && styles.on)}
    >
      {children}
      <span aria-hidden="true" className={styles.underline} />
    </Link>
  );
}
