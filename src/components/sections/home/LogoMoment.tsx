"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Logo } from "@/content/home/types";
import styles from "./LogoMoment.module.css";

/**
 * Proof as one moment instead of a grid: client marks, white on night, take the
 * stage one at a time in a slow cross-fade. The full list stays readable to
 * assistive tech; reduced motion shows them all at once in a quiet row.
 */
export function LogoMoment({ logos }: { logos: Logo[] }) {
  const [on, setOn] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setOn((i) => (i + 1) % logos.length), 1800);
    return () => window.clearInterval(t);
  }, [logos.length]);

  return (
    <div className={styles.stage}>
      <ul className={styles.logos} aria-label="Clients">
        {logos.map((l, i) => (
          <li key={l.src} className={styles.logo} data-on={on === i || undefined}>
            <Image
              src={l.src}
              alt={l.alt}
              width={l.w}
              height={l.h}
              className={styles.img}
              style={{ height: `calc(${l.size} * 1.6)` }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
