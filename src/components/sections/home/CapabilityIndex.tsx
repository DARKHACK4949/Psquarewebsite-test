"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { Link, WorkItem } from "@/content/home/types";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./CapabilityIndex.module.css";

/**
 * What we do, after the statement: on night, a sticky film on the left and the
 * capabilities on the right. The capability crossing the middle of the screen
 * lights up and the film changes to the project it powered; the others recede.
 * Phones and reduced motion: each capability stacks with its own still.
 */
export function CapabilityIndex({
  what,
  work,
  all,
}: {
  what: typeof whatWeDo;
  work: WorkItem[];
  all: Link;
}) {
  // A region that shows fewer projects shows only the capabilities it can prove.
  const rows = what.capabilities.flatMap((c) => {
    const item = work.find((w) => w.key === c.work);
    return item ? [{ ...c, item }] : [];
  });
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

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

  // Only the shown film plays.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

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
              <video
                key={r.name}
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={styles.film}
                data-on={active === i || undefined}
                poster={r.item.video.poster}
                muted
                loop
                playsInline
                preload="none"
              >
                <source src={r.item.video.webm} type="video/webm" />
                <source src={r.item.video.mp4} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>

        <ol ref={list} className={styles.list}>
          {rows.map((r, i) => (
            <li key={r.name} data-i={i} className={styles.cap} data-on={active === i || undefined}>
              <div className={styles.still} aria-hidden="true">
                <Image src={r.item.video.poster} alt="" fill sizes="(min-width: 900px) 1px, 90vw" />
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

      <div className={styles.foot}>
        <ButtonLink href={all.href} tone="light">
          {what.all}
        </ButtonLink>
      </div>
    </section>
  );
}
