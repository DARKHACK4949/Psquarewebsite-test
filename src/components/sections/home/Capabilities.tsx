import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import type { HomeContent } from "@/content/home";
import styles from "./Capabilities.module.css";

/**
 * What we do, light chapter: one statement, then the four capabilities as
 * large type rows, each with its line. Type carries it: no cards and no
 * stand-in media. Not a sequence, so no numbers.
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

        <ul className={styles.rows}>
          {what.cards.map((c) => (
            <li key={c.title} className={styles.row}>
              <h3 className={styles.name}>{c.title}</h3>
              <p className={styles.line}>
                {c.lead} <span className={styles.more}>{c.body}</span>
              </p>
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
