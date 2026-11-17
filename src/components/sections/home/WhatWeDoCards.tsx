import Image from "next/image";
import { Words } from "@/components/ui/Words";
import type { whatWeDo } from "@/content/home/preview";
import styles from "./WhatWeDoCards.module.css";

/** What we do: heading with its line beside it, then three tall image cards. */
export function WhatWeDoCards({ what }: { what: typeof whatWeDo }) {
  const title = what.title.join(" ");
  return (
    <section data-screen-label="05 What we do" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.titleCol}>
          <span className={styles.eyebrow}>{what.eyebrow}</span>
          <h2 className={styles.h2} data-split="" aria-label={title}>
            <Words text={what.title[0]} /> <br />
            <Words text={what.title[1]} />
          </h2>
        </div>
        <p className={styles.lead} data-reveal="">
          {what.lead}
        </p>
      </div>
      <ul className={styles.cards}>
        {what.cards.map((c) => (
          <li key={c.title} className={styles.card} data-reveal="">
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(min-width: 900px) 33vw, 80vw"
              className={styles.img}
            />
            <div className={styles.text}>
              <h3 className={styles.name}>{c.title}</h3>
              <p className={styles.line}>{c.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
