"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";
import type { VideoSrc } from "@/content/about";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Muted, looping background video: loads lazily, plays only while on screen
 * and stays on its poster under reduced motion.
 */
export const LoopVideo = forwardRef<
  HTMLVideoElement,
  { src: VideoSrc; className?: string; style?: CSSProperties; label?: string; eager?: boolean }
>(function LoopVideo({ src, className, style, label, eager }, ref) {
  const el = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => el.current!);

  useEffect(() => {
    const v = el.current;
    if (!v || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={el}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      poster={src.poster}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={style}
    >
      <source src={src.webm} type="video/webm" />
      <source src={src.mp4} type="video/mp4" />
    </video>
  );
});
