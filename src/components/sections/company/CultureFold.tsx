"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { culture, type CultureMedia } from "@/content/about";
import { companyPreview } from "@/content/company-preview";
import styles from "./CultureFold.module.css";

function Media({ m, sizes, eager }: { m: CultureMedia; sizes: string; eager?: boolean }) {
  const pos = { objectPosition: m.pos ?? "50% 50%" };
  return m.video ? (
    <LoopVideo src={m.video} label={m.alt} className={styles.media} style={pos} />
  ) : (
    <Image src={m.src} alt={m.alt} fill sizes={sizes} className={styles.media} style={pos} priority={eager} />
  );
}

/**
 * Inside PSQUARE, on one screen. Five themes as tabs (an underline slides to
 * the one you pick); each theme is the same arrangement every time: a plum
 * card with its words, one large photo or film, and two more stacked beside
 * it. Themes cross-fade into each other.
 */
export function CultureFold() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const n = culture.tabs.length;

  // The underline follows the active tab (transform only).
  useLayoutEffect(() => {
    const place = () => {
      const t = tabs.current[active];
      const b = bar.current;
      if (!t || !b) return;
      b.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth / 100})`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = (active + d + n) % n;
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section data-screen-label="07 Culture" data-noband="" data-nav-dark="" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.h2}>{culture.title.join(" ")}</h2>
          <p className={styles.lead}>{culture.lead}</p>
        </div>

        <div role="tablist" aria-label={culture.title.join(" ")} onKeyDown={onKey} className={styles.tabs}>
          {culture.tabs.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`fold-tab-${t.key}`}
              aria-selected={active === i}
              aria-controls={`fold-panel-${t.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={styles.tab}
            >
              {t.label}
            </button>
          ))}
          <span ref={bar} aria-hidden="true" className={styles.bar} />
        </div>

        <div className={styles.stage}>
          {culture.tabs.map((t, ti) => {
            const on = ti === active;
            const [big, a, b] = companyPreview.cultureFold[t.key];
            return (
              <div
                key={t.key}
                role="tabpanel"
                id={`fold-panel-${t.key}`}
                aria-labelledby={`fold-tab-${t.key}`}
                aria-hidden={!on}
                inert={!on}
                data-on={on || undefined}
                className={styles.panel}
              >
                <div className={styles.card} style={{ "--d": "0ms" } as CSSProperties}>
                  <span className={styles.count}>
                    0{ti + 1} / 0{n}
                  </span>
                  <div className={styles.cardText}>
                    <h3 className={styles.h3}>{t.title}</h3>
                    <ul className={styles.lines}>
                      {t.lines.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={`${styles.tile} ${styles.big}`} style={{ "--d": "50ms" } as CSSProperties}>
                  <Media m={t.media[big]} sizes="(min-width: 900px) 45vw, 100vw" eager={ti === 0} />
                </div>
                <div className={`${styles.tile} ${styles.a}`} style={{ "--d": "100ms" } as CSSProperties}>
                  <Media m={t.media[a]} sizes="(min-width: 900px) 25vw, 50vw" />
                </div>
                <div className={`${styles.tile} ${styles.b}`} style={{ "--d": "150ms" } as CSSProperties}>
                  <Media m={t.media[b]} sizes="(min-width: 900px) 25vw, 50vw" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
