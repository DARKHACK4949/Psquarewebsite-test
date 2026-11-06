import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import styles from "./Capabilities.module.css";

/**
 * What we do, light chapter: one statement, then a row of tall film cards,
 * one per capability, each with its name and one line. Not a sequence, so no
 * numbers. Phones swipe through the cards.
 */
export function Capabilities({ what }: { what: HomeContent["what"] }) {
  const title = what.lines.join(" ");
  return (
    <section data-screen-label="03 What we do" data-noband="" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={title}>
            <Words text={title} />
          </h2>
          <p className={styles.lead} data-reveal="">
            {what.lead}
          </p>
        </div>

        <ul className={styles.row}>
          {what.cards.map((c) => (
            <li key={c.title} className={styles.card}>
              <div className={c.cover ? `${styles.media} ${styles.cover}` : styles.media}>
                {c.media && <LoopVideo src={c.media} className={styles.video} />}
              </div>
              <h3 className={styles.name}>{c.title}</h3>
              <p className={styles.line}>{c.lead}</p>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <AccentLink href={what.all.href}>{what.all.label}</AccentLink>
        </div>
      </div>
    </section>
  );
}
