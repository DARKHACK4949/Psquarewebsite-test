"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./CapabilityIndex.module.css";

/**
 * What we do, after the statement: three disciplines on night. Wide screens: a
 * large still holds on the left while the disciplines scroll past on the right;
 * the one crossing the middle of the screen comes forward, its still takes the
 * frame and slowly pushes in, and the others recede. Phones and reduced motion:
 * each discipline stacks under its own still.
 */
export function CapabilityIndex({ what }: { what: typeof whatWeDo }) {
  const caps = what.capabilities;
  const [active, setActive] = useState(0);
  // One point open at a time, keyed "capability-point".
  const [open, setOpen] = useState<string | null>(null);
  const list = useRef<HTMLOListElement>(null);

  // The discipline crossing the middle of the viewport is the active one.
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
            {caps.map((c, i) => (
              <div key={c.name} className={styles.shot} data-on={active === i || undefined}>
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 55vw, 1px"
                  className={styles.img}
                />
              </div>
            ))}
          </div>
        </div>

        <ol ref={list} className={styles.list}>
          {caps.map((c, i) => (
            <li key={c.name} data-i={i} className={styles.cap} data-on={active === i || undefined}>
              <div className={styles.still} aria-hidden="true">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 1px, 92vw"
                  className={styles.img}
                />
              </div>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.name}>{c.name}</h3>
              <ul className={styles.items}>
                {c.items.map((it, j) => {
                  const key = `${i}-${j}`;
                  const on = open === key;
                  return (
                    <li key={it.t} className={styles.item} data-open={on || undefined}>
                      <button
                        type="button"
                        className={styles.toggle}
                        aria-expanded={on}
                        aria-controls={`cap-${key}`}
                        onClick={() => setOpen(on ? null : key)}
                      >
                        <span aria-hidden="true" className={styles.marker} />
                        {it.t}
                      </button>
                      <div id={`cap-${key}`} role="region" className={styles.more} inert={!on}>
                        <div>
                          <p>{it.d}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
