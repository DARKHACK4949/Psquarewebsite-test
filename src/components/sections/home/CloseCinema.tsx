import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./CloseCinema.module.css";

const glass = {
  webm: "/media/home/close-glass.webm",
  mp4: "/media/home/close-glass.mp4",
  poster: "/media/home/close-glass-poster.jpg",
  // Phones and portrait tablets: the 9:16 cut of the same film.
  phone: {
    webm: "/media/home/close-glass-m.webm",
    mp4: "/media/home/close-glass-m.mp4",
  },
};

/**
 * The dark close: the glass film assembling the PSQUARE mark behind the last
 * line and the one call to action. The footer follows inside the same dark.
 */
export function CloseCinema({ nextStep }: { nextStep: HomeContent["nextStep"] }) {
  const title = nextStep.title.join(" ");
  return (
    <section
      data-screen-label="09 Next step"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div aria-hidden="true" className={styles.film}>
        <LoopVideo
          src={glass}
          phoneQuery="(max-width: 899px) and (orientation: portrait)"
          className={styles.video}
        />
      </div>
      <div className={styles.inner}>
        <h2 className={styles.h2} data-split="" aria-label={title}>
          <Words text={title} />
        </h2>
        <p className={styles.lead}>{nextStep.lead}</p>
        <div className={styles.actions}>
          <ButtonLink href={nextStep.cta.href} tone="light" data-track="cta_book_demo_click">
            {nextStep.cta.label}
          </ButtonLink>
          <TextLink href={`mailto:${CONTACT_EMAIL}`} arrow={false} className={styles.link}>
            {CONTACT_EMAIL}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
