"use client";

import { useId, useState } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import styles from "./WorkShowcase.module.css";

/**
 * Selected work, light chapter. Client names on the left choose the project;
 * one large film on the right, with its line and link below. Natural scroll on
 * every screen; on phones the names become a swipeable row above the film.
 * Only the active film is mounted, so one clip decodes at a time.
 */
export function WorkShowcase({ work }: { work: HomeContent["work"] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const it = work.items[active];

  return (
    <section
      id="work"
      data-screen-label="04 Selected work"
      data-noband=""
      className={styles.section}
    >
      <div className={styles.inner}>
        <h2 className={styles.h2} data-split="" aria-label={work.title}>
          <Words text={work.title} />
        </h2>

        <div className={styles.grid}>
          <div role="tablist" aria-label="Projects" className={styles.names}>
            {work.items.map((p, i) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={styles.name}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (
                    e.key !== "ArrowDown" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "ArrowUp" &&
                    e.key !== "ArrowLeft"
                  )
                    return;
                  e.preventDefault();
                  const next =
                    (i +
                      (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) +
                      work.items.length) %
                    work.items.length;
                  setActive(next);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${active}`}
            className={styles.panel}
          >
            {/* Keyed so the new project fades in on every switch. */}
            <div key={it.key} className={styles.swap}>
              <a
                href={it.href}
                tabIndex={-1}
                aria-hidden="true"
                className={styles.media}
                style={{ background: it.bg }}
              >
                <LoopVideo key={it.key} src={it.video} eager className={styles.video} />
              </a>
              <div className={styles.caption}>
                <p className={styles.title}>{it.title.join(" ")}</p>
                <div className={styles.meta}>
                  <span className={styles.sector}>
                    {it.name}, {it.sector.toLowerCase()}
                  </span>
                  <AccentLink href={it.href} size="sm">
                    Read the story
                  </AccentLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.foot}>
          <AccentLink href={work.all.href}>{work.all.label}</AccentLink>
        </div>
      </div>
    </section>
  );
}
