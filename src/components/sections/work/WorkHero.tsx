import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { Words } from "@/components/ui/Words";
import type { workHero } from "@/content/work";
import styles from "./WorkHero.module.css";

/**
 * The Work page opens on the showreel filling the screen, the page's one word
 * set very large at the bottom left and a single line beside it. The film sinks
 * into the night at the bottom so the first project chapter follows on.
 */
export function WorkHero({ hero }: { hero: typeof workHero }) {
  return (
    <section
      data-screen-label="01 Work hero"
      data-noband=""
      data-nav-dark=""
      className={styles.hero}
    >
      <div aria-hidden="true" className={styles.film}>
        <LoopVideo src={hero.film} className={styles.video} eager />
      </div>
      <div className={styles.inner}>
        <h1 className={styles.title} data-split="" aria-label={hero.title}>
          <Words text={hero.title} />
        </h1>
        <p className={styles.lead} data-reveal="">
          {hero.lead}
        </p>
      </div>
    </section>
  );
}
