"use client";

import { useEffect, useRef, useState } from "react";
import { TextLink } from "@/components/ui/Button";
import type { LegalBlock, LegalDoc as Doc } from "@/content/legal";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL, type Routes } from "@/lib/site";
import styles from "./LegalDoc.module.css";

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Privacy / Terms body: a sticky section index (1100px and up) beside the
 * article column. Scroll-spy: the active item is the last section whose top
 * has passed 35% of the viewport; at the page bottom the last item wins.
 * A click activates its item at once and holds it while the page scrolls there.
 */
export function LegalDoc({ doc, routes }: { doc: Doc; routes: Pick<Routes, "privacy" | "terms"> }) {
  const [cur, setCur] = useState(0);
  const lockUntil = useRef(0);
  const spyRef = useRef<() => void>(() => {});

  useEffect(() => {
    let raf = 0;
    const spy = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (Date.now() < lockUntil.current) return;
        const els = document.querySelectorAll<HTMLElement>("[data-sec]");
        if (!els.length) return;
        const line = window.innerHeight * 0.35;
        let i = 0;
        els.forEach((el, k) => {
          if (el.getBoundingClientRect().top <= line) i = k;
        });
        const root = document.documentElement;
        if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) i = els.length - 1;
        setCur(i);
      });
    };
    spyRef.current = spy;
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, []);

  return (
    <section data-screen-label="02 Document" className={styles.doc}>
      <nav aria-label="Sections" className={styles.index}>
        {doc.sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={cur === i ? "true" : undefined}
            className={styles.item}
            onClick={() => {
              lockUntil.current = Date.now() + 900;
              setCur(i);
              // Re-read the position once the hold ends, in case the scroll moved on.
              setTimeout(() => spyRef.current(), 950);
              track("legal_index_click", { section: s.id });
            }}
          >
            <span aria-hidden="true" className={styles.bar} />
            <span className={styles.itemN}>{num(i)}</span>
            <span className={styles.itemT}>{s.title}</span>
          </a>
        ))}
      </nav>

      <div className={styles.column}>
        {doc.intro && (
          <div className={styles.intro}>
            <p className={styles.introLead}>{doc.intro.lead}</p>
            <p className={styles.p}>{doc.intro.body}</p>
          </div>
        )}
        {doc.sections.map((s, i) => (
          <article key={s.id} id={s.id} data-sec="" className={styles.sec}>
            <span className={styles.n}>{num(i)}</span>
            <h2 className={styles.h2}>{s.title}</h2>
            {s.blocks.map((b, k) => (
              <Block key={k} b={b} routes={routes} />
            ))}
          </article>
        ))}
        <div className={styles.card} data-reveal="">
          <h2 className={styles.h2}>{doc.contact.title}</h2>
          <p className={styles.p}>{doc.contact.lead}</p>
          <div className={styles.cardLinks}>
            <TextLink href={`mailto:${CONTACT_EMAIL}`} arrow={false}>
              {CONTACT_EMAIL}
            </TextLink>
            {doc.contact.phone && (
              <TextLink href={doc.contact.phone.href} arrow={false}>
                {doc.contact.phone.label}
              </TextLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({ b, routes }: { b: LegalBlock; routes: Pick<Routes, "privacy" | "terms"> }) {
  if ("h" in b) return <h3 className={styles.h3}>{b.h}</h3>;
  if ("p" in b) return <p className={styles.p}>{b.p}</p>;
  if ("l" in b)
    return (
      <ul className={styles.list}>
        {b.l.map((it) => (
          <li key={it}>
            <span aria-hidden="true" className={styles.dot} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    );
  if ("kv" in b)
    return (
      <dl className={styles.kv}>
        {b.kv.map((it) => (
          <div key={it.k}>
            <dt>{it.k}</dt>
            <dd>{it.v}</dd>
          </div>
        ))}
      </dl>
    );
  return <TextLink href={routes[b.link.route]}>{b.link.label}</TextLink>;
}
