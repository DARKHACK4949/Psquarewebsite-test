import Image from "next/image";
import type { CaseImage } from "@/content/case-studies";
import styles from "./CaseStudy.module.css";

/** A real product screen: desktop views as a rounded plate, phone views as a slim phone-shaped plate. */
export function CaseShot({ img, sizes }: { img: CaseImage; sizes: string }) {
  return (
    <div className={img.kind === "phone" ? styles.phone : styles.screen}>
      <Image
        src={img.src}
        alt={img.alt}
        width={img.w}
        height={img.h}
        sizes={sizes}
        className={styles.img}
      />
    </div>
  );
}
