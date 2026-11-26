"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Words } from "@/components/ui/Words";
import type { WorkItem } from "@/content/home/types";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./CapabilityIndex.module.css";

const FOLLOW = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * "What we do" as a capability index: one large row per capability, each tied to
 * the project it powered. With a fine pointer, a clip of that project follows the
 * cursor on a critically damped spring and tilts with its velocity; elsewhere each
 * row carries a still of the work instead.
 */
export function CapabilityIndex({ what, work }: { what: typeof whatWeDo; work: WorkItem[] }) {
  // A region that shows fewer projects shows only the capabilities it can prove.
  const rows = what.capabilities.flatMap((c) => {
    const item = work.find((w) => w.key === c.work);
    return item ? [{ ...c, item }] : [];
  });
  const title = what.title.join(" ");
  const [active, setActive] = useState(-1);
  const index = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const live = useRef({ x: 0, y: 0, r: 0, on: false });

  // The preview chases the pointer; transform only, one rAF loop while it is shown.
  useEffect(() => {
    const mq = window.matchMedia(FOLLOW);
    if (!mq.matches || active < 0) return;
    let raf = 0;
    const tick = () => {
      const p = live.current;
      const t = target.current;
      const dx = t.x - p.x;
      p.x += dx * 0.16;
      p.y += (t.y - p.y) * 0.16;
      p.r += (Math.max(-6, Math.min(6, dx * 0.035)) - p.r) * 0.12;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.r}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Only the shown clip plays.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const move = (e: React.PointerEvent) => {
    const box = index.current?.getBoundingClientRect();
    if (!box) return;
    // Keep the clip inside the index, so it never pushes past the page edge.
    // Keep it left of the description column too, so the active line stays readable.
    const w = (preview.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    const meta = index.current?.querySelector(`.${styles.meta}`)?.getBoundingClientRect();
    const stop = meta ? meta.left - box.left - 24 : box.width;
    target.current = {
      x: Math.min(e.clientX - box.left, stop - w - 40),
      y: e.clientY - box.top,
    };
    // First frame: appear under the pointer instead of flying in from a corner.
    if (!live.current.on) {
      live.current = { ...live.current, ...target.current, on: true };
    }
  };
  const leave = () => {
    live.current.on = false;
    setActive(-1);
  };

  return (
    <section data-screen-label="05 What we do" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.titleCol}>
          <span className={styles.eyebrow}>{what.eyebrow}</span>
          <h2 className={styles.h2} data-split="" aria-label={title}>
            <Words text={what.title[0]} /> <br />
            <Words text={what.title[1]} />
          </h2>
        </div>
        <p className={styles.lead} data-reveal="">
          {what.lead}
        </p>
      </div>

      <div ref={index} className={styles.index} onPointerMove={move} onPointerLeave={leave}>
        <ol className={styles.rows} data-dim={active >= 0 || undefined}>
          {rows.map((r, i) => (
            <li key={r.name} className={styles.row} data-on={active === i || undefined} data-reveal="">
              <a
                href={r.item.href}
                className={styles.link}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.meta}>
                  <span className={styles.line}>{r.line}</span>
                  <span className={styles.proj}>
                    {r.item.name}
                    <span aria-hidden="true" className={styles.arrow}>
                      →
                    </span>
                  </span>
                </span>
                <span className={styles.thumb} aria-hidden="true">
                  <Image src={r.item.video.poster} alt="" fill sizes="120px" />
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div ref={preview} className={styles.preview} aria-hidden="true">
          <div className={styles.frame} data-show={active >= 0 || undefined}>
            {rows.map((r, i) => (
              <video
                key={r.name}
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={styles.clip}
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
      </div>
    </section>
  );
}
