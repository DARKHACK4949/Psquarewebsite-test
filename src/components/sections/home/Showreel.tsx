"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Showreel.module.css";

export type ReelBox = { L: number; T: number; w: number; h: number; from: string };

/** Centred 16:9 frame plus the clip-path that matches the hero card's current rect. */
export function reelBoxFrom(card: HTMLElement): ReelBox {
  const r = card.getBoundingClientRect();
  const vw = window.innerWidth,
    vh = window.innerHeight;
  const w = Math.min(vw * 0.9, (vh * 0.82 * 16) / 9),
    h = (w * 9) / 16;
  const L = (vw - w) / 2,
    T = (vh - h) / 2;
  const c = (x: number) => Math.max(0, x).toFixed(1);
  return {
    L,
    T,
    w,
    h,
    from: `inset(${c(r.top - T)}px ${c(L + w - r.right)}px ${c(T + h - r.bottom)}px ${c(r.left - L)}px round 24px)`,
  };
}

/**
 * Full showreel lightbox. Mounted when opened: expands a clip-path from the
 * hero card's rect to a centred 16:9 frame and plays with sound and controls.
 */
export function Showreel({
  box,
  src,
  onClose,
}: {
  box: ReelBox;
  src: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const { lock } = useSmoothScroll();

  useEffect(() => {
    lock(true);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setOpen(true);
        closeBtn.current?.focus({ preventScroll: true });
        const v = video.current;
        if (v) {
          v.muted = false;
          v.volume = 1;
          v.play().catch(() => {
            v.muted = true;
            v.play().catch(() => {});
          });
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      lock(false);
    };
  }, [lock]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
    video.current?.pause();
    setTimeout(onClose, prefersReducedMotion() ? 50 : 750);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        // Keep focus inside the dialog (close button + video controls).
        const items = [closeBtn.current, video.current].filter(Boolean) as HTMLElement[];
        const i = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return createPortal(
    <div className={styles.scrim} data-open={open || undefined} onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="PSQUARE COMPANY showreel"
        className={styles.frame}
        onClick={(e) => e.stopPropagation()}
        style={{
          left: box.L,
          top: box.T,
          width: box.w,
          height: box.h,
          clipPath: open ? "inset(0px 0px 0px 0px round 20px)" : box.from,
        }}
      >
        <video ref={video} src={src} controls playsInline className={styles.video} />
      </div>
      <button
        ref={closeBtn}
        type="button"
        aria-label="Close showreel"
        onClick={close}
        className={styles.close}
      >
        Close
      </button>
    </div>,
    document.body,
  );
}
