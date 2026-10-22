"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import type { HomeContent } from "@/content/home";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./HowWeWork.module.css";

type Content = NonNullable<HomeContent["howWeWork"]>;

const TAGS = ["Field notes", "Wireframe", "Build 1.4", "Live"];
const BARS = [
  [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  [0.92, 0.78, 0.86, 0.7, 0.8, 0.64, 0.72],
  [0.62, 0.5, 0.44, 0.36, 0.3, 0.24, 0.18],
];

/**
 * One block of the mock screen in three states: a sketched question (step 1),
 * a grey wireframe box (step 2) and the built UI (steps 3 and 4).
 */
function Cell({
  k,
  q,
  delay = 0,
  bare,
  className,
  children,
}: {
  k: number;
  q: string;
  delay?: number;
  bare?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.cell} ${className ?? ""}`}>
      <span className={styles.wf} style={{ opacity: k === 1 ? 1 : 0 }} />
      <span className={styles.sk} style={{ opacity: k === 0 ? 1 : 0 }}>
        {q}
      </span>
      <div
        className={bare ? `${styles.ui} ${styles.bare}` : styles.ui}
        style={{ opacity: k >= 2 ? 1 : 0, transitionDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

/** The product screen that grows from field notes to a live system as the steps advance. */
function Mock({ k }: { k: number }) {
  const live = k === 3;
  return (
    <div className={styles.panel} aria-hidden="true">
      <div
        className={styles.screen}
        style={{ background: k === 0 ? "var(--paper)" : "var(--surface)" }}
      >
        <div className={styles.chrome}>
          <span />
          <span />
          <span />
          <span className={styles.tag}>
            <i style={{ opacity: live ? 1 : 0 }} />
            {TAGS[k]}
          </span>
        </div>
        <div className={styles.grid}>
          <Cell k={k} q="Who uses it?">
            <div className={styles.side}>
              {["Overview", "Requests", "Sites", "Stock", "Reports"].map((l) => (
                <span key={l} data-on={l === "Requests" || undefined}>
                  {l}
                </span>
              ))}
            </div>
          </Cell>
          <div className={styles.main}>
            <Cell k={k} q="What needs action first?" delay={0.05} bare className={styles.bar}>
              <div className={styles.titleRow}>
                <span>Requests</span>
                <span className={styles.newBtn}>New request</span>
              </div>
            </Cell>
            <div className={styles.kpis}>
              {[
                ["Open?", "Open", live ? "18" : "31"],
                ["Late?", "Overdue", live ? "2" : "9"],
                ["Done?", "Closed", live ? "57" : "22"],
              ].map(([q, l, v], i) => (
                <Cell key={l} k={k} q={q} delay={0.1 + i * 0.05} className={styles.kpi}>
                  <div className={styles.kpiBody}>
                    <span>{l}</span>
                    <strong>{v}</strong>
                  </div>
                </Cell>
              ))}
            </div>
            <Cell k={k} q="Where does it slow down?" delay={0.25}>
              <div className={styles.chart}>
                <span className={styles.chartHead}>
                  <span>Approval time</span>
                  <strong>{live ? "0.8 days" : "3.6 days"}</strong>
                </span>
                <div className={styles.bars}>
                  {BARS[k].map((b, j) => (
                    <span
                      key={j}
                      style={
                        {
                          transform: `scaleY(${b})`,
                          transitionDelay: `${0.15 + j * 0.05}s`,
                          opacity: j === 6 ? 1 : 0.78,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </Cell>
            <Cell k={k} q="Approvals pile up here" delay={0.3} className={styles.approvals}>
              <div className={styles.rows}>
                <div>
                  <span>
                    Site 14 <span>· Cement, 40 bags</span>
                  </span>
                  <span className={styles.ok}>Approved</span>
                </div>
                <div>
                  <span>
                    Site 09 <span>· Scaffold rental</span>
                  </span>
                  <span className={live ? styles.ok : styles.wait}>
                    {live ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
            </Cell>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "How we work". Desktop and tablets: four steps beside (or under) a mock
 * screen; hovering, focusing or tapping a step moves the screen to that stage.
 * Phones: the steps become a swipeable row under the screen, and swiping
 * drives it.
 */
export function HowWeWork({ how }: { how: Content }) {
  const [k, setK] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  // Phones: the card nearest the start edge is the active step.
  useEffect(() => {
    const t = track.current!;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (t.scrollWidth <= t.clientWidth) return;
        const w = t.firstElementChild?.getBoundingClientRect().width ?? t.clientWidth;
        const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
        const i = Math.max(0, Math.min(how.steps.length - 1, Math.round(t.scrollLeft / (w + gap))));
        setK((cur) => (cur === i ? cur : i));
      });
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      t.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [how.steps.length]);

  const goTo = (i: number) => {
    setK(i);
    const t = track.current;
    const card = t?.children[i] as HTMLElement | undefined;
    if (t && card && t.scrollWidth > t.clientWidth)
      t.scrollTo({
        left: card.offsetLeft - t.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
  };

  return (
    <section data-screen-label="05 How we work" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.h2} data-split="" aria-label={how.title}>
          <Words text={how.title} />
        </h2>
        <p className={styles.lead} data-reveal="">
          {how.lead}
        </p>
      </div>
      <div className={styles.body}>
        <div data-reveal="">
          <Mock k={k} />
        </div>
        <div ref={track} role="list" className={styles.steps} data-reveal="">
          {how.steps.map((st, i) => {
            const on = k === i;
            return (
              <div role="listitem" key={st.title} className={styles.step} data-on={on || undefined}>
                <span aria-hidden="true" className={styles.rule} />
                <button
                  type="button"
                  aria-current={on}
                  onClick={() => goTo(i)}
                  onMouseEnter={() => setK(i)}
                  onFocus={() => setK(i)}
                  className={styles.stepBtn}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.stepTitle}>{st.title}</span>
                </button>
                <p className={styles.desc}>{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.foot}>
        <div className={styles.dots} aria-hidden="true">
          {how.steps.map((st, i) => (
            <span key={st.title} data-on={k === i || undefined} />
          ))}
        </div>
        <AccentLink href={how.link.href}>{how.link.label}</AccentLink>
      </div>
    </section>
  );
}
