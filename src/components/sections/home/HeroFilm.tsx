"use client";

import { useEffect, useRef } from "react";
import type { VideoSrc } from "@/content/about";
import { prefersReducedMotion } from "@/lib/motion";

type Film = VideoSrc & { phone?: { webm: string; mp4: string } };

/** Portrait screens get the 9:16 cut. */
const PORTRAIT = "(max-width: 899px) and (orientation: portrait)";

const VERT = `
attribute vec2 p;
varying vec2 vPos;
void main() { vPos = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uVid;
uniform vec2 uRes;
uniform vec2 uVidSize;
uniform vec2 uFocus;    // where the frame is anchored when cropped (0..1)
uniform vec2 uMouse;    // 0..1, y up
uniform float uStir;
uniform vec2 uVel;
uniform float uTime;
uniform vec3 uBg;
varying vec2 vPos;

void main() {
  // Cover-fit the film, cropping around uFocus.
  float s = max(uRes.x / uVidSize.x, uRes.y / uVidSize.y);
  vec2 shown = uRes / (uVidSize * s);
  vec2 uv = mix(uFocus - shown * uFocus, uFocus + shown * (1.0 - uFocus), vPos);

  // The pointer moves through the cloth like a hand through fabric: a soft,
  // wide push along its path and a faint ripple that settles.
  vec2 d = (vPos - uMouse) * vec2(uRes.x / uRes.y, 1.0);
  float fall = exp(-dot(d, d) * 6.0) * uStir;
  uv -= uVel * fall * 0.035 * shown;
  uv += normalize(d + 1e-4) * sin(length(d) * 28.0 - uTime * 3.0) * 0.0025 * fall * shown;

  vec3 col = texture2D(uVid, clamp(uv, 0.001, 0.999)).rgb;
  // The film's black becomes the page's dark (the brighter of the two wins).
  gl_FragColor = vec4(max(col, uBg), 1.0);
}
`;

/** A theme colour as 0..1 RGB, resolved by the browser. */
function tokenRgb(el: Element, name: string): [number, number, number] {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = value || "#000";
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/**
 * The hero's film background, made to feel alive rather than played: the
 * aura film (a seamless loop) runs slowed down and is drawn through a small
 * WebGL pass that melts its black into the page's dark and lets the pointer
 * move through the cloth (a soft push and a ripple that settles). Without
 * WebGL the film itself shows; under reduced motion only its still poster.
 */
export function HeroFilm({
  film,
  videoClassName,
  canvasClassName,
}: {
  film: Film;
  videoClassName?: string;
  canvasClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || prefersReducedMotion()) return;

    // Slower than recorded: calm, and less like footage.
    video.playbackRate = 0.75;
    video.play().catch(() => {});

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // The film itself stays visible.
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uVidSize = u("uVidSize");
    const uFocus = u("uFocus");
    const uMouse = u("uMouse");
    const uStir = u("uStir");
    const uVel = u("uVel");
    const uTime = u("uTime");
    gl.uniform3fv(u("uBg"), tokenRgb(canvas, "--night"));
    const portrait = window.matchMedia(PORTRAIT);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
      // Crop from the left, never from the fold (as the close film does).
      gl.uniform2f(uFocus, portrait.matches ? 0.45 : 0.8, 0.5);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0.7, y: 0.6, stir: 0, vx: 0, vy: 0 };
    const cur = { ...target };
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      if (y < -0.1 || y > 1.1) return;
      if (last) {
        target.vx = Math.max(-0.3, Math.min(0.3, target.vx + (x - last.x) * 2));
        target.vy = Math.max(-0.3, Math.min(0.3, target.vy + (y - last.y) * 2));
      }
      last = { x, y };
      target.x = x;
      target.y = y;
      target.stir = 1;
    };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let shown = false;
    let visible = true;
    const t0 = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (video.readyState < 2) return;
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      cur.stir += (target.stir - cur.stir) * 0.04;
      cur.vx += (target.vx - cur.vx) * 0.05;
      cur.vy += (target.vy - cur.vy) * 0.05;
      target.stir *= 0.985;
      target.vx *= 0.94;
      target.vy *= 0.94;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.uniform2f(uVidSize, video.videoWidth || 1920, video.videoHeight || 1080);
      gl.uniform2f(uMouse, cur.x, cur.y);
      gl.uniform1f(uStir, cur.stir);
      gl.uniform2f(uVel, cur.vx, cur.vy);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.dataset.ready = "";
      }
    };
    const run = () => {
      if (!raf && visible && !document.hidden) {
        video.play().catch(() => {});
        raf = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      video.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);
    run();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={film.poster}
        aria-hidden="true"
        className={videoClassName}
      >
        {film.phone && (
          <>
            <source src={film.phone.webm} type="video/webm" media={PORTRAIT} />
            <source src={film.phone.mp4} type="video/mp4" media={PORTRAIT} />
          </>
        )}
        <source src={film.webm} type="video/webm" />
        <source src={film.mp4} type="video/mp4" />
      </video>
      <canvas ref={canvasRef} aria-hidden="true" className={canvasClassName} />
    </>
  );
}
