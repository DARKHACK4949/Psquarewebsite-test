"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play, X } from "@phosphor-icons/react";
import { team } from "@/content/about";
import { companyPreview } from "@/content/company-preview";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import { BlurWords, resolveWords } from "./BlurText";
import styles from "./Founders.module.css";

/**
 * The founders. A tall portrait on the left moves slowly between the two of
 * them (clean frames from their film); the quote resolves word by word beside
 * it as the page scrolls. "Watch the founders" plays the whole film, with
 * sound, in place.
 */
export function Founders() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const f = team.founders;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const quote = el.querySelector<HTMLElement>("[data-f=quote]")!;
        const card = el.querySelector<HTMLElement>("[data-f=card]")!;
        gsap.set(quote.querySelectorAll("[data-w=sharp]"), { opacity: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 65%", end: "center 45%", scrub: 0.6 },
        });
        tl.fromTo(card, { scale: 0.92, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6 }, 0);
        resolveWords(tl, quote, 0.1, 0.035, 0.2);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const play = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.preload = "auto";
    v.controls = true;
    v.play().catch(() => {});
    setPlaying(true);
  };
  const stop = () => {
    const v = video.current;
    if (!v) return;
    v.pause();
    v.controls = false;
    setPlaying(false);
  };

  return (
    <section
      ref={root}
      id="team"
      data-screen-label="05 Founders"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.inner}>
        <div data-f="card" className={styles.card} data-playing={playing || undefined}>
          {companyPreview.founders.stills.map((st, i) => (
            <div key={st.src} className={styles.still} data-i={i}>
              <Image src={st.src} alt={st.alt} fill sizes="(min-width: 900px) 34vw, 90vw" className={styles.stillImg} />
            </div>
          ))}
          <video
            ref={video}
            className={styles.video}
            playsInline
            preload="none"
            aria-label="Founders introduction film"
            onEnded={stop}
          >
            <source src={f.video.webm} type="video/webm" />
            <source src={f.video.mp4} type="video/mp4" />
          </video>
          <div aria-hidden="true" className={styles.shade} />
          {playing ? (
            <button type="button" className={styles.close} onClick={stop}>
              <X size={18} weight="bold" aria-hidden="true" />
              <span className={styles.sr}>{companyPreview.founders.close}</span>
            </button>
          ) : (
            <button type="button" className={styles.play} onClick={play}>
              <span className={styles.playIcon}>
                <Play size={16} weight="fill" aria-hidden="true" />
              </span>
              {companyPreview.founders.play}
            </button>
          )}
        </div>

        <div className={styles.text}>
          <h2 className={styles.h2}>
            {f.title.map((t) => (
              <span key={t} className={styles.line}>
                {t}
              </span>
            ))}
          </h2>
          <blockquote className={styles.quote}>
            <p data-f="quote" aria-label={f.quote}>
              <BlurWords text={`“${f.quote}”`} />
            </p>
          </blockquote>
          <ul className={styles.people}>
            {f.people.map((p) => (
              <li key={p.name} className={styles.person}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.role}>{p.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
