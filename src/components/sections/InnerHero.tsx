import type { CSSProperties, ReactNode } from "react";
import styles from "./InnerHero.module.css";

/**
 * Inner-page hero (every page except the homepage): plum aurora glow, eyebrow,
 * headline revealed word by word on the left, lead on the right aligned to the
 * bottom. `title` parts after the first render in plum. The entrance is CSS-only,
 * so the server-rendered headline paints without waiting for JS.
 */
export function InnerHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: readonly string[];
  lead: string;
  children?: ReactNode;
}) {
  let i = 0;
  return (
    <section data-screen-label="01 Hero" className={styles.hero}>
      <div aria-hidden="true" className={styles.aurora}>
        <div className={styles.glow} />
      </div>
      <div className={styles.grid}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.h1} aria-label={title.join(" ")}>
            {title.map((part, p) => (
              <span key={part} aria-hidden="true" className={p > 0 ? styles.accent : undefined}>
                {part.split(" ").map((w, j, arr) => (
                  <span key={j}>
                    <span className={styles.word} style={{ "--i": i++ } as CSSProperties}>
                      {w}
                    </span>
                    {j < arr.length - 1 ? " " : null}
                  </span>
                ))}
                {p < title.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.right}>
          <p className={styles.lead}>{lead}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
