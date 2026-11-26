"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkItem } from "@/content/home/types";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./CapabilityIndex.module.css";

/** A capability film: a tilted wall of the project's real screens with the camera gliding across it. */
const film = (work: string) => ({
  webm: `/media/home/caps/cap-${work}.webm`,
  mp4: `/media/home/caps/cap-${work}.mp4`,
  poster: `/media/home/caps/cap-${work}-poster.jpg`,
});

function Film({
  work,
  on,
  stage = false,
  refFn,
}: {
  work: string;
  on: boolean;
  stage?: boolean;
  refFn: (el: HTMLVideoElement | null) => void;
}) {
  const f = film(work);
  return (
    <video
      ref={refFn}
      className={stage ? styles.film : styles.filmStill}
      data-on={on || undefined}
      poster={f.poster}
      muted
      loop
      playsInline
      preload="none"
    >
      <source src={f.webm} type="video/webm" />
      <source src={f.mp4} type="video/mp4" />
    </video>
  );
}

/**
 * What we do, after the statement: on night, a sticky film on the left and the
 * capabilities on the right. The capability crossing the middle of the screen
 * lights up and the film changes to its project's wall; the others recede.
 * Phones and reduced motion: each capability stacks with its own film.
 */
export function CapabilityIndex({ what, work }: { what: typeof whatWeDo; work: WorkItem[] }) {
  // A region that shows fewer projects shows only the capabilities it can prove.
  const rows = what.capabilities.flatMap((c) => {
    const item = work.find((w) => w.key === c.work);
    return item ? [{ ...c, item }] : [];
  });
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const stage = useRef<(HTMLVideoElement | null)[]>([]);
  const inline = useRef<(HTMLVideoElement | null)[]>([]);

  // The capability crossing the middle of the viewport is the active one.
  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-i]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  // Wide screens: only the active film in the sticky frame plays.
  useEffect(() => {
    stage.current.forEach((v, i) => {
      if (!v || !v.offsetParent) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  // Phones: each capability's own film plays while it is on screen.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.3 },
    );
    inline.current.forEach((v) => v && v.offsetParent && io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section
      data-screen-label="05 What we do"
      data-noband=""
      data-nav-dark=""
      aria-label={what.statement}
      className={styles.section}
    >
      <div className={styles.grid}>
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.frame}>
            {rows.map((r, i) => (
              <Film
                key={r.name}
                work={r.work}
                on={active === i}
                stage
                refFn={(el) => {
                  stage.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        <ol ref={list} className={styles.list}>
          {rows.map((r, i) => (
            <li key={r.name} data-i={i} className={styles.cap} data-on={active === i || undefined}>
              <div className={styles.still} aria-hidden="true">
                <Film
                  work={r.work}
                  on
                  refFn={(el) => {
                    inline.current[i] = el;
                  }}
                />
              </div>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.name}>{r.name}</h3>
              <ul className={styles.items}>
                {r.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href={r.item.href} className={styles.proj}>
                {r.item.name}
                <span aria-hidden="true" className={styles.arrow}>
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
