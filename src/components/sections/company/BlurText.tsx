import type { gsap as GSAP } from "gsap";
import styles from "./BlurText.module.css";

/**
 * Words as a sharp copy over a pre-blurred one. The parent carries the
 * readable text (aria-label); these spans are decorative.
 */
export function BlurWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i} aria-hidden="true">
      <span className={styles.word}>
        <span data-w="sharp">{w}</span>
        <span data-w="soft" className={styles.soft}>
          {w}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}

type Timeline = ReturnType<typeof GSAP.timeline>;

function parts(scope: Element) {
  return {
    sharp: Array.from(scope.querySelectorAll<HTMLElement>("[data-w=sharp]")),
    soft: Array.from(scope.querySelectorAll<HTMLElement>("[data-w=soft]")),
  };
}

/** Words resolve from a blur in reading order, starting at `at`; `step` apart. */
export function resolveWords(tl: Timeline, scope: Element, at = 0, step = 0.08, len = 0.22) {
  const { sharp, soft } = parts(scope);
  sharp.forEach((s, i) => {
    const t = at + i * step;
    tl.fromTo(soft[i], { opacity: 0 }, { opacity: 1, duration: len * 0.6 }, t)
      .to(soft[i], { opacity: 0, duration: len * 0.9 }, t + len * 0.6)
      .fromTo(s, { opacity: 0 }, { opacity: 1, duration: len }, t + len * 0.45);
  });
  return at + (sharp.length - 1) * step + len * 1.5;
}

/** The reverse: sharp words melt back into a blur and fade, in reading order. */
export function dissolveWords(tl: Timeline, scope: Element, at = 0, step = 0.08, len = 0.22) {
  const { sharp, soft } = parts(scope);
  sharp.forEach((s, i) => {
    const t = at + i * step;
    tl.to(s, { opacity: 0, duration: len }, t)
      .fromTo(soft[i], { opacity: 0 }, { opacity: 1, duration: len * 0.5, immediateRender: false }, t)
      .to(soft[i], { opacity: 0, duration: len * 0.9 }, t + len * 0.5);
  });
  return at + (sharp.length - 1) * step + len * 1.4;
}
