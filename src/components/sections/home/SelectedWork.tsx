"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import type { HomeContent, WorkItem } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { WorkCarousel } from "./WorkCarousel";
import styles from "./SelectedWork.module.css";

const WIDE_MQ = "(min-width: 1024px) and (min-height: 640px)";
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

function Copy({ item }: { item: WorkItem }) {
  return (
    <div className={styles.copy}>
      <span className={styles.kicker}>
        {item.name} <span>/</span> {item.sector}
      </span>
      <h3 className={styles.h3}>
        {item.title[0]}
        <br />
        {item.title[1]}
        <br />
        <span className={styles.accent}>{item.title[2]}</span>
      </h3>
      <p className={styles.text}>{item.copy}</p>
      <AccentLink href={item.href} size="sm">
        Explore {item.name}
      </AccentLink>
    </div>
  );
}

function Video({ item, ...rest }: { item: WorkItem } & React.ComponentProps<"video">) {
  return (
    <video
      muted
      loop
      playsInline
      preload="none"
      poster={item.video.poster}
      aria-hidden="true"
      {...rest}
    >
      <source src={item.video.webm} type="video/webm" />
      <source src={item.video.mp4} type="video/mp4" />
    </video>
  );
}

/**
 * "Selected work". Desktop: a pinned stage where scrolling moves through the
 * three products (tabs jump to each). Tablets: a stacked list whose videos play
 * while in view. Phones: brand chips over a swipeable card carousel.
 */
export function SelectedWork({ work }: { work: HomeContent["work"] }) {
  const N = work.items.length;
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const visible = useRef(false);
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();

  const syncVideos = (act: number) => {
    const wide = window.matchMedia(WIDE_MQ).matches;
    root.current?.querySelectorAll<HTMLVideoElement>("[data-w=slide] video").forEach((v, i) => {
      if (Math.abs(i - act) <= 1 && v.preload !== "auto") v.preload = "auto";
      const on = wide && visible.current && i === act && !prefersReducedMotion();
      if (on && v.paused) v.play().catch(() => {});
      else if (!on && !v.paused) v.pause();
    });
  };

  // Desktop: scroll progress through the pinned stage drives the slides.
  useGSAP(
    () => {
      const el = root.current!;
      const reduced = prefersReducedMotion();
      const wp = { p: 0 };
      const track = el.querySelector<HTMLElement>("[data-w=track]")!;
      const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-w=slide]"));
      const mids = Array.from(el.querySelectorAll<HTMLElement>("[data-w=mid]"));

      const apply = () => {
        const t = wp.p * (N - 1),
          i0 = Math.min(N - 2, Math.floor(t)),
          u = t - i0;
        const f = i0 + (reduced ? (u > 0.5 ? 1 : 0) : smooth((u - 0.25) / 0.5));
        track.style.transform = `translate3d(0,${(-f * 100).toFixed(3)}%,0)`;
        slides.forEach((sl, i) => {
          const d = f - i;
          const sc = sl.querySelector<HTMLElement>("[data-w=screen]");
          if (sc)
            sc.style.transform = `translate3d(0,${(d * 10).toFixed(2)}%,0) scale(${(1 - Math.min(1, Math.abs(d)) * 0.04).toFixed(4)})`;
        });
        mids.forEach((m, i) => {
          const d = i - f,
            o = clamp(1 - Math.abs(d) * 1.6);
          m.style.opacity = o.toFixed(3);
          m.style.transform = `translate3d(0,${(d * 24).toFixed(1)}px,0)`;
          m.style.visibility = o < 0.01 ? "hidden" : "visible";
          m.style.pointerEvents = o > 0.5 ? "auto" : "none";
        });
        const act = Math.round(f);
        if (act !== idxRef.current) {
          idxRef.current = act;
          setIdx(act);
          syncVideos(act);
        }
      };

      const mm = gsap.matchMedia();
      mm.add(WIDE_MQ, () => {
        const to = gsap.quickTo(wp, "p", {
          duration: reduced ? 0.01 : 0.7,
          ease: "power3.out",
          onUpdate: apply,
        });
        ScrollTrigger.create({
          trigger: pin.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (s) => to(s.progress),
          onRefresh: (s) => {
            wp.p = s.progress;
            apply();
          },
          onToggle: (s) => {
            visible.current = s.isActive;
            syncVideos(idxRef.current);
          },
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => {
            visible.current = s.isActive;
            syncVideos(idxRef.current);
          },
        });
        apply();
      });
      // Stacked layout: each media card scales up as it enters, its screen drifts (parallax).
      mm.add("(min-width: 640px) and ((max-width: 1023px) or (max-height: 639px))", () => {
        if (reduced) return;
        el.querySelectorAll<HTMLElement>("[data-w=mcard]").forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.9, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 45%", scrub: 0.6 },
            },
          );
          gsap.fromTo(
            card.querySelector("[data-w=mdevice]"),
            { y: 28 },
            {
              y: -28,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Mobile list: play each video while it is mostly in view.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !window.matchMedia(WIDE_MQ).matches) {
            v.preload = "auto";
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.4 },
    );
    root.current?.querySelectorAll("[data-w=mvid]").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const p = pin.current;
    if (!p) return;
    const top = window.scrollY + p.getBoundingClientRect().top;
    scrollTo(top + (i / (N - 1)) * (p.offsetHeight - window.innerHeight));
  };

  return (
    <section ref={root} id="work" data-screen-label="04 Selected work" className={styles.section}>
      <div className={styles.wideOnly}>
        <div className={styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={work.title}>
            <Words text={work.title} />
          </h2>
          <p className={styles.lead} data-reveal="">
            {work.lead}
          </p>
        </div>
        <div ref={pin} className={styles.pin} style={{ height: `${100 + 87.5 * (N - 1)}vh` }}>
          <div className={styles.sticky}>
            <div className={styles.stageGrid}>
              <div className={styles.side}>
                <div role="group" aria-label="Projects" className={styles.tabs}>
                  {work.items.map((it, i) => (
                    <button
                      key={it.key}
                      type="button"
                      aria-current={idx === i}
                      onClick={() => goTo(i)}
                      className={styles.tab}
                    >
                      <span>{it.name}</span>
                      <span aria-hidden="true" className={styles.tabBar} />
                    </button>
                  ))}
                </div>
                <div className={styles.mids}>
                  {work.items.map((it, i) => (
                    <div
                      key={it.key}
                      data-w="mid"
                      className={styles.mid}
                      style={i ? { opacity: 0, visibility: "hidden" } : undefined}
                    >
                      <Copy item={it} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.stage} onClick={() => router.push(work.items[idx].href)}>
                <div data-w="track" className={styles.track}>
                  {work.items.map((it, i) => (
                    <div
                      key={it.key}
                      data-w="slide"
                      className={styles.slide}
                      style={{ top: `${i * 100}%`, background: it.bg }}
                    >
                      <div data-w="screen" className={styles.screen}>
                        <div className={styles.screenSize}>
                          <div className={styles.device}>
                            <Video item={it} className={styles.video} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.narrowOnly}>
        <div className={styles.narrowInner}>
          <h2 className={styles.h2} data-split="" aria-label={work.title}>
            <Words text={work.title} />
          </h2>
          {work.items.map((it) => (
            <article key={it.key} className={styles.article}>
              <div data-w="mcard" className={styles.mediaCard} style={{ background: it.bg }}>
                <div
                  data-w="mdevice"
                  className={styles.mediaDevice}
                  style={{ aspectRatio: it.ratio }}
                >
                  <Video item={it} data-w="mvid" className={styles.video} />
                </div>
              </div>
              <div data-reveal="">
                <Copy item={it} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.phoneOnly}>
        <WorkCarousel work={work} />
      </div>

      <div className={styles.foot}>
        <AccentLink href={work.all.href}>{work.all.label}</AccentLink>
      </div>
    </section>
  );
}
