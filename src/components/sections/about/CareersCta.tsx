import { ButtonLink } from "@/components/ui/Button";
import { careersCta } from "@/content/about";
import { LoopVideo } from "./LoopVideo";
import styles from "./CareersCta.module.css";

/** Closing card: the team at work beside the hiring line and "See open roles". */
export function CareersCta({ href }: { href: string }) {
  return (
    <section data-screen-label="07 Careers" className={styles.section}>
      <div className={styles.card} data-reveal="">
        <div className={styles.media}>
          <LoopVideo
            src={careersCta.video}
            label="The PSQUARE team at work"
            className={styles.video}
          />
        </div>
        <div className={styles.copy}>
          <h2 className={styles.h2}>
            {careersCta.title[0]} <span className={styles.accent}>{careersCta.title[1]}</span>
          </h2>
          <p className={styles.lead}>{careersCta.lead}</p>
          <ButtonLink href={href} className={styles.cta}>
            {careersCta.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
