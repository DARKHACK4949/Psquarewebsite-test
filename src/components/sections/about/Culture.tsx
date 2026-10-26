"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Words } from "@/components/ui/Words";
import { culture, type CultureLayout, type CultureMedia } from "@/content/about";
import { LoopVideo } from "./LoopVideo";
import styles from "./Culture.module.css";

type Tab = (typeof culture.tabs)[number];

/**
 * Turns a layout into flex weights so every row has one height and every tile
 * keeps its aspect ratio: within a row tiles grow by their width/height
 * ratio, rows grow by 1/(row ratio), and a stacked column counts as one tile.
 * Returns the rows and the mosaic's overall height/width factor.
 */
function plan(tab: Tab) {
  const r = (m: CultureMedia) => m.w / m.h;
  const rows = (tab.layout as CultureLayout).map((row) => {
    const items = row.map((it) => {
      if (!Array.isArray(it)) return { kind: "one" as const, i: it, r: r(tab.media[it]) };
      const kids = it.map((i) => ({ i, r: r(tab.media[i]) }));
      const stackR = 1 / kids.reduce((t, k) => t + 1 / k.r, 0);
      return { kind: "stack" as const, kids, r: stackR };
    });
    const sum = items.reduce((t, x) => t + x.r, 0);
    return { items, k: 1 / sum };
  });
  return { rows, k: rows.reduce((t, row) => t + row.k, 0) };
}

const PLANS = culture.tabs.map(plan);
/** Desktop mosaics share one height: that of the flattest tab. */
const K_MIN = Math.min(...PLANS.map((p) => p.k));

function Tile({ m, grow, d, on }: { m: CultureMedia; grow: number; d: number; on: boolean }) {
  return (
    <div
      className={styles.tile}
      style={{ flexGrow: grow, "--d": `${0.06 + d * 0.07}s` } as CSSProperties}
      data-on={on || undefined}
    >
      <div className={styles.zoom}>
        {m.video ? (
          <LoopVideo
            src={m.video}
            label={m.alt}
            className={styles.media}
            style={{ objectPosition: m.pos ?? "50% 50%" }}
          />
        ) : (
          <Image
            src={m.src}
            alt={m.alt}
            fill
            sizes="(min-width: 900px) 40vw, 100vw"
            className={styles.media}
            style={{ objectPosition: m.pos ?? "50% 50%" }}
          />
        )}
        <span aria-hidden="true" className={styles.tint} />
      </div>
    </div>
  );
}

/** "Inside PSQUARE": tabs over an intro card and a photo/video mosaic per theme. */
export function Culture() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = culture.tabs.length;

  const onKey = (e: KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    const i = (active + d + n) % n;
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section data-screen-label="06 Culture" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={culture.title.join(" ")}>
            <Words text={culture.title[0]} />{" "}
            <span className={styles.accent}>
              <Words text={culture.title[1]} />
            </span>
          </h2>
          <p className={styles.lead} data-reveal="">
            {culture.lead}
          </p>
        </div>

        <div className={styles.body}>
          <div role="tablist" aria-label="Inside PSQUARE" onKeyDown={onKey} className={styles.tabs}>
            {culture.tabs.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`cul-tab-${t.key}`}
                aria-selected={active === i}
                aria-controls={`cul-panel-${t.key}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={styles.tab}
              >
                {t.label}
                <span className={styles.tabNum}>0{i + 1}</span>
                <span aria-hidden="true" className={styles.tabBar} />
              </button>
            ))}
          </div>

          <div className={styles.panels} data-reveal="">
            {culture.tabs.map((t, ti) => {
              const on = active === ti;
              const p = PLANS[ti];
              let d = 1;
              return (
                <div
                  key={t.key}
                  role="tabpanel"
                  id={`cul-panel-${t.key}`}
                  aria-labelledby={`cul-tab-${t.key}`}
                  aria-hidden={!on}
                  inert={!on}
                  className={on ? `${styles.panel} ${styles.panelOn}` : styles.panel}
                  style={{ "--k": p.k.toFixed(4), "--kmin": K_MIN.toFixed(4) } as CSSProperties}
                >
                  <div
                    className={styles.intro}
                    data-on={on || undefined}
                    style={{ "--d": "0.06s" } as CSSProperties}
                  >
                    <span aria-hidden="true" className={styles.glowA} />
                    <span aria-hidden="true" className={styles.glowB} />
                    <div className={styles.introBody}>
                      <div className={styles.introTop}>
                        <span className={styles.eyebrow}>
                          <span aria-hidden="true" />
                          {t.label}
                        </span>
                        <p className={styles.introTitle}>{t.title}</p>
                      </div>
                      <div className={styles.introFoot}>
                        <div className={styles.lines}>
                          {t.lines.map((l) => (
                            <span key={l}>{l}</span>
                          ))}
                        </div>
                        <Image
                          src="/images/psquare-mark.svg"
                          alt=""
                          width={22}
                          height={22}
                          className={styles.introMark}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.mosaic} style={{ aspectRatio: (1 / p.k).toFixed(4) }}>
                    {p.rows.map((row, ri) => (
                      <div key={ri} className={styles.row} style={{ flexGrow: row.k }}>
                        {row.items.map((it, ii) =>
                          it.kind === "one" ? (
                            <Tile key={ii} m={t.media[it.i]} grow={it.r} d={d++} on={on} />
                          ) : (
                            <div key={ii} className={styles.stack} style={{ flexGrow: it.r }}>
                              {it.kids.map((k) => (
                                <Tile key={k.i} m={t.media[k.i]} grow={1 / k.r} d={d++} on={on} />
                              ))}
                            </div>
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
