"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { mindset } from "@/content/about";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/motion";
import styles from "./Mindset.module.css";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const STEPS = mindset.steps.length;

/**
 * "Built from the inside out." A pinned, tilted stack: Values at the core,
 * then the Mission and Vision plates rise out of it as the page scrolls; the
 * copy on the left follows. The stack leans toward the pointer on desktop.
 * Reduced motion: no pin; the step buttons switch the stack directly.
 */
export function Mindset() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const paintRef = useRef<((p: number) => void) | null>(null);
  const [step, setStep] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const el = root.current!;
      const $ = (s: string) => el.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) => Array.from(el.querySelectorAll<HTMLElement>(s));
      const stage = $("[data-mstage]"),
        vis = $("[data-mvis]"),
        glow = $("[data-mglow]"),
        pm = $("[data-mpm]"),
        pv = $("[data-mpv]"),
        gm = $("[data-mgm]"),
        gv = $("[data-mgv]"),
        sm = $("[data-msm]"),
        sv = $("[data-msv]"),
        ba = $("[data-mba]"),
        bb = $("[data-mbb]"),
        pc = $("[data-mpc]"),
        labels = $$("[data-mplt]"),
        fills = $$("[data-mfill]"),
        texts = $$("[data-mtx]");
      let px = 0,
        py = 0,
        tt = 0;

      const tilt = () => {
        stage.style.transform = `rotateX(${(57 - py * 4).toFixed(3)}deg) rotateZ(${(-38 + px * 6 + tt * 3).toFixed(3)}deg)`;
      };
      const plate = (
        p: HTMLElement,
        guide: HTMLElement,
        shadow: HTMLElement,
        k: number,
        z: number,
      ) => {
        const sc = lerp(0.42, 1, k).toFixed(4);
        p.style.opacity = clamp(k * 1.4, 0, 1).toFixed(3);
        p.style.transform = `translate(-50%,-50%) translateZ(${lerp(18, z, k).toFixed(2)}px) scale(${sc})`;
        guide.style.opacity = ((1 - k) * 0.9).toFixed(3);
        shadow.style.opacity = k.toFixed(3);
        shadow.style.transform = `translate(-50%,-50%) scale(${sc})`;
      };
      const paint = (pr: number) => {
        // Narrow screens: the plates lift less, so the stack stays inside its own box.
        const lift = window.innerWidth < 900 ? 0.4 : 1;
        const t = clamp(pr * 3 - 0.5, 0, 2),
          m = inOut(clamp(t, 0, 1)),
          v = inOut(clamp(t - 1, 0, 1));
        tt = t;
        texts.forEach((x, i) => {
          const d = t - i;
          x.style.opacity = clamp(1 - Math.abs(d) * 2.4, 0, 1).toFixed(3);
          x.style.transform = `translateY(${(-d * 36).toFixed(1)}px)`;
        });
        plate(pm, gm, sm, m, 90 * lift);
        plate(pv, gv, sv, v, 170 * lift);
        pc.style.opacity = (1 - 0.4 * v).toFixed(3);
        labels.forEach((x) => (x.style.opacity = (1 - 0.4 * m).toFixed(3)));
        const beam = lerp(0.35, 1, t / 2).toFixed(4);
        ba.style.transform = `translateX(-50%) rotateX(-90deg) scaleY(${beam})`;
        bb.style.transform = `translateX(-50%) rotateZ(90deg) rotateX(-90deg) scaleY(${beam})`;
        glow.style.transform = `translateY(-50%) scale(${(0.8 + 0.12 * t).toFixed(4)})`;
        tilt();
        fills.forEach(
          (f, i) => (f.style.transform = `scaleX(${clamp(pr * 3 - i, 0, 1).toFixed(4)})`),
        );
        const idx = t < 0.5 ? 0 : t < 1.5 ? 1 : 2;
        setStep((cur) => (cur === idx ? cur : idx));
      };
      paintRef.current = paint;
      paint(prefersReducedMotion() ? 0.5 / 3 : 0);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let cur = 0,
          tgt = 0,
          tpx = 0,
          tpy = 0,
          idle = true;
        const tick = () => {
          const dc = tgt - cur,
            dx = tpx - px,
            dy = tpy - py;
          if (Math.abs(dc) < 0.0002 && Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
            if (!idle) {
              cur = tgt;
              px = tpx;
              py = tpy;
              paint(cur);
              idle = true;
            }
            return;
          }
          idle = false;
          cur += dc * 0.14;
          px += dx * 0.08;
          py += dy * 0.08;
          paint(cur);
        };
        gsap.ticker.add(tick);
        const pinEl = $("[data-mpin]");
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = vis.getBoundingClientRect();
          tpx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 2;
          tpy = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 2;
        };
        const onLeave = () => {
          tpx = 0;
          tpy = 0;
        };
        pinEl.addEventListener("pointermove", onMove);
        pinEl.addEventListener("pointerleave", onLeave);
        st.current = ScrollTrigger.create({
          trigger: pinEl,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 0.6 * STEPS),
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            tgt = self.progress;
          },
          onRefresh: (self) => {
            tgt = cur = self.progress;
            paint(cur);
          },
        });
        return () => {
          gsap.ticker.remove(tick);
          pinEl.removeEventListener("pointermove", onMove);
          pinEl.removeEventListener("pointerleave", onLeave);
          st.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = (i: number) => {
    const t = st.current;
    if (t) scrollTo(t.start + ((i + 0.5) / STEPS) * (t.end - t.start), { duration: 1.4 });
    else paintRef.current?.((i + 0.5) / STEPS);
  };

  const m = mindset;
  return (
    <section ref={root} data-screen-label="04 Mindset" className={styles.section}>
      <div data-mpin="" className={styles.pin}>
        <div aria-hidden="true" data-mglow="" className={styles.glow} />
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.head}>
              <span className={styles.eyebrow}>{m.eyebrow}</span>
              <h2 className={styles.h2}>{m.title}</h2>
              <p className={styles.lead}>{m.lead}</p>
            </div>
            <div className={styles.controls}>
              <div aria-live="polite" className={styles.texts}>
                {m.steps.map((s, i) => (
                  <div key={s.title} aria-hidden={step !== i} className={styles.textCell}>
                    <div data-mtx="" className={styles.text}>
                      <span className={styles.textLabel}>
                        <span>{s.n}</span>
                        {s.title}
                      </span>
                      <p className={styles.textBody}>{s.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div role="group" aria-label="Mindset steps" className={styles.steps}>
                {m.steps.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-current={step === i}
                    onClick={() => pick(i)}
                    className={styles.stepBtn}
                  >
                    <span className={styles.track}>
                      <span data-mfill="" className={styles.fill} />
                    </span>
                    <span className={styles.stepLabel}>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.visCell}>
            <div data-mvis="" aria-hidden="true" className={styles.vis}>
              <div data-mstage="" className={styles.stage}>
                <div className={styles.dots} />
                <div data-mgm="" className={`${styles.guide} ${styles.gMission}`} />
                <div data-mgv="" className={`${styles.guide} ${styles.gVision}`} />
                <div data-msm="" className={`${styles.shadow} ${styles.sMission}`} />
                <div data-msv="" className={`${styles.shadow} ${styles.sVision}`} />
                <div className={styles.base}>
                  <span data-mplt="" className={`${styles.baseLabel} ${styles.top}`}>
                    {m.values[0]}
                  </span>
                  <span data-mplt="" className={`${styles.baseLabel} ${styles.right}`}>
                    {m.values[1]}
                  </span>
                  <span data-mplt="" className={`${styles.baseLabel} ${styles.bottom}`}>
                    {m.values[2]}
                  </span>
                  <span data-mplt="" className={`${styles.baseLabel} ${styles.leftL}`}>
                    Values
                  </span>
                </div>
                <div className={styles.coreGlow} />
                <div className={styles.layers}>
                  {Array.from({ length: 9 }, (_, i) => (
                    <div
                      key={i}
                      className={styles.layer}
                      data-tone={i === 8 ? "top" : i % 2 ? "b" : "a"}
                      style={{ transform: `translate(-50%,-50%) translateZ(${i * 3}px)` }}
                    />
                  ))}
                </div>
                <div className={styles.core}>
                  <Image
                    src="/images/psquare-mark.svg"
                    alt=""
                    width={48}
                    height={48}
                    className={styles.coreMark}
                  />
                </div>
                <div className={styles.halo} />
                <div data-mba="" className={styles.beam} />
                <div data-mbb="" className={styles.beam} />
                <div data-mpm="" className={`${styles.plate} ${styles.pMission}`}>
                  <div className={styles.sheen} />
                  <div data-mpc="" className={styles.missionBody}>
                    <div className={styles.missionTop}>
                      <span className={styles.plateTitle}>Mission</span>
                      <div className={styles.products}>
                        {m.products.map((p) => (
                          <span key={p}>{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.caps}>
                      {m.capabilities.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div data-mpv="" className={`${styles.plate} ${styles.pVision}`}>
                  <div className={styles.sheen} />
                  <div className={styles.visionTop}>
                    <span className={styles.plateTitle}>Vision</span>
                    <span className={styles.plateSub}>{m.vision.reach}</span>
                  </div>
                  <div className={styles.visionWho}>
                    <span className={styles.plateName}>{m.vision.who}</span>
                    <span className={styles.plateSub}>{m.vision.what}</span>
                  </div>
                  <div className={styles.visionArms}>
                    {m.vision.arms.map((a) => (
                      <span key={a.name}>
                        <span className={styles.plateName}>{a.name}</span>
                        <span className={styles.plateSub}>{a.role}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
