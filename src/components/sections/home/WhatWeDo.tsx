"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Code, PenNib, Sparkle, Target } from "@phosphor-icons/react";
import { AccentLink } from "@/components/ui/Button";
import { capabilityArt } from "@/content/capability-art";
import { what } from "@/content/home";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import styles from "./WhatWeDo.module.css";

const ICONS = { target: Target, "pen-nib": PenNib, code: Code, sparkle: Sparkle } as const;

/**
 * "What we do": four capability cards. On wide layouts the active card grows
 * (flex 2.4) and plays its illustration; hover, focus, click or arrow keys pick.
 * Below 820px of list width the cards stack with every illustration shown.
 */
export function WhatWeDo() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1400);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);
  const hoverT = useRef(0);
  const wide = W >= 820;

  useEffect(() => {
    const el = list.current!;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Active card grows; the others share the rest.
  useEffect(() => {
    const items = Array.from(list.current!.querySelectorAll<HTMLElement>("[role=listitem]"));
    const instant = prefersReducedMotion();
    items.forEach((el, i) => {
      if (!wide) {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "flexGrow" });
        return;
      }
      gsap.to(el, {
        flexGrow: i === active ? 2.4 : 1,
        duration: instant ? 0 : 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    });
  }, [active, wide]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (s: string) => root.current!.querySelectorAll(`[data-g=${s}]`);
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 35%", scrub: 1 },
          })
          .from(q("line"), { yPercent: 105, ease: "power3.out", duration: 1, stagger: 0.18 }, 0.1)
          .from(q("lede"), { y: 28, opacity: 0, ease: "power2.out", duration: 0.8 }, 0.45);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = useCallback(
    (i: number) => {
      clearTimeout(hoverT.current);
      if (wide) setActive(i);
    },
    [wide],
  );

  const onKey = (e: React.KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d || !wide) return;
    e.preventDefault();
    const n = (active + d + 4) % 4;
    setActive(n);
    list.current?.querySelectorAll<HTMLElement>("[role=listitem]")[n]?.focus();
  };

  const ew = wide ? ((W - 48 - 200) * 2.4) / 5.4 : W - 50;
  const s = Math.max(0.35, Math.min(1, ew / 540, wide ? 270 / 300 : 1));

  return (
    <section ref={root} id="what" data-screen-label="03 What we do" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.h2} aria-label={what.lines.join(" ")}>
          {what.lines.map((l) => (
            <span key={l} className={styles.lineClip} aria-hidden="true">
              <span data-g="line">{l}</span>
            </span>
          ))}
        </h2>
        <p data-g="lede" className={styles.lead}>
          {what.lead}
        </p>
      </div>

      <div
        ref={list}
        role="list"
        data-sc=""
        aria-label="Capabilities"
        onKeyDown={onKey}
        onMouseLeave={() => {
          clearTimeout(hoverT.current);
          setHover(-1);
        }}
        className={wide ? `${styles.list} ${styles.wide}` : styles.list}
        style={{ "--s": s.toFixed(3), "--ew": `${Math.round(ew)}px` } as CSSProperties}
      >
        {what.cards.map((c, i) => {
          const on = wide ? i === active : true;
          const Icon = ICONS[c.icon];
          return (
            <div
              key={c.title}
              role="listitem"
              tabIndex={0}
              aria-label={c.title}
              className={styles.card}
              style={{ "--on": on ? 1 : 0 } as CSSProperties}
              onMouseEnter={() => {
                if (!wide) return;
                setHover(i);
                clearTimeout(hoverT.current);
                hoverT.current = window.setTimeout(() => pick(i), 30);
              }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              onFocus={() => pick(i)}
              onClick={() => pick(i)}
            >
              <span
                aria-hidden="true"
                className={styles.spot}
                style={{ opacity: wide && on && hover === i ? 1 : 0 }}
              />
              <div
                aria-hidden="true"
                className={styles.panel}
                style={wide ? undefined : { flex: "none", height: Math.round(290 * s + 24) }}
              >
                <div
                  className={styles.art}
                  dangerouslySetInnerHTML={{ __html: capabilityArt[i] }}
                />
              </div>
              <div className={styles.body}>
                <span aria-hidden="true" className={styles.icon}>
                  <Icon size={20} />
                </span>
                <h3 className={styles.title}>{c.title}</h3>
                <div className={styles.more}>
                  <p>
                    <span>{c.lead}</span> {c.body}
                  </p>
                </div>
              </div>
              <span aria-hidden="true" className={styles.num}>
                {String(i + 1).padStart(2, "0")}.
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.foot}>
        <AccentLink href={what.all.href}>{what.all.label}</AccentLink>
      </div>
    </section>
  );
}
