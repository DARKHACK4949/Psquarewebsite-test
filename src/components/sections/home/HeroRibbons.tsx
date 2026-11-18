"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Soft plum ribbons drifting sideways across the dark hero, drawn by a small
 * WebGL shader: domain-warped noise bent into long horizontal bands. The
 * pointer disturbs the flow where it moves (soft local turbulence, like fog, that eases in and settles
 * back). Colours come from the theme tokens. It renders at a fraction of the
 * screen's resolution (the image is soft anyway), pauses off screen and in
 * background tabs, and under reduced motion draws a single still frame.
 * Without WebGL the canvas never shows and the CSS bands beneath stay.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const HEAD = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uStir;
uniform vec2 uVel;
uniform vec3 uBg;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = r * p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}
`;

/** "ribbons": soft plum bands drifting sideways. */
const RIBBONS = `
// One ribbon family: soft bands along a warped vertical coordinate,
// broken into long segments that slide sideways.
// stir (0..1) adds a gentle, flowing turbulence: the ribbons ripple and
// drift locally, like fog a hand has passed through.
float ribbons(vec2 p, float t, float freq, float seed, float stir) {
  vec2 w = vec2(fbm(p * vec2(0.55, 1.6) + vec2(t * 0.9, seed)),
                fbm(p * vec2(0.55, 1.6) + vec2(-t * 0.6, seed + 4.1)));
  float eddy = fbm(p * 2.2 + vec2(t * 5.0, -t * 3.0) + seed) - 0.5;
  float y = p.y + 0.55 * (w.x - 0.5) + 0.08 * sin(p.x * 1.7 + t * 3.0 + seed)
          + eddy * stir * 0.22;
  float band = 0.5 + 0.5 * sin(y * freq + w.y * 4.0);
  band = pow(band, 4.0);
  float seg = smoothstep(0.26, 0.7, fbm(vec2(p.x * 0.75 - t * 2.2 + seed, y * 2.4)));
  return band * seg;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // The pointer disturbs the flow softly, like fog: a wide, gentle falloff,
  // a slight drift along the way it moves, and local turbulence (no swirl,
  // so nothing stretches).
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  vec2 d = p - m;
  float fall = exp(-dot(d, d) * 2.5) * uStir;
  p -= uVel * fall * 0.12;

  float t = uTime * 0.035;
  float r1 = ribbons(p * 1.0, t, 7.0, 1.3, fall);
  float r2 = ribbons(p * 1.35 + vec2(3.1, 0.7), t * 1.3, 9.0, 7.9, fall);
  // The fog thins a little where the pointer passes.
  r1 *= 1.0 - 0.25 * fall;
  r2 *= 1.0 - 0.25 * fall;

  vec3 col = uBg;
  col += uB * r1 * 1.1;
  col += mix(uA, uC, smoothstep(0.2, 0.8, uv.x)) * r2 * 0.95;

  // Calm the bottom-left, where the headline sits, and the very top under the nav.
  float calm = smoothstep(0.0, 0.55, uv.y) * 0.55 + 0.45;
  calm *= 1.0 - 0.35 * smoothstep(0.85, 1.0, uv.y);
  col = mix(uBg, col, calm);

  // Grain against banding.
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * "aura": a minimal sheen. One fine, softly lit edge sweeps from the top-left
 * to the bottom-right with a faint violet haze just inside it, slowly breathing.
 */
const AURA = `
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // The pointer disturbs the fold softly, like fog (as in the ribbons).
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  vec2 d = p - m;
  float fall = exp(-dot(d, d) * 2.5) * uStir;
  p -= uVel * fall * 0.12;

  float t = uTime * 0.05;
  float x = p.x / aspect;

  // The fold's edge: a slow-breathing arc with an organic wobble.
  float bend = 0.62 + 0.1 * sin(t * 1.3);
  float tilt = 1.45 + 0.12 * sin(t * 0.9 + 1.0);
  float edge = 1.1 - tilt * x + bend * x * x;
  edge += 0.07 * (fbm(vec2(x * 1.4 - t * 0.7, t * 0.4)) - 0.5);
  float eddy = fbm(p * 2.4 + vec2(t * 4.0, -t * 3.0)) - 0.5;
  // Distance past the edge (> 0 inside the fold).
  float f = p.y - edge + eddy * fall * 0.12;

  // Minimal: no glowing body, just a quiet sheen. A faint violet haze sits
  // only right inside the edge, softly shaded so it never reads as a flat fill.
  float shade = 0.6 + 0.8 * fbm(p * vec2(1.4, 2.0) + vec2(t * 0.6, -t * 0.4));
  float inside = smoothstep(-0.01, 0.05, f);
  float haze = inside * exp(-max(f, 0.0) * 4.5) * shade;
  haze *= 1.0 - 0.3 * fall;

  // The edge: a fine, soft-white line, as if light caught the rim of a dark
  // sheet; it brightens and fades along its length.
  float along = smoothstep(0.25, 0.8, fbm(vec2(x * 2.0 - t * 0.9, 1.7)));
  float rim = exp(-abs(f) * 220.0) * (0.08 + 0.55 * along) + exp(-abs(f) * 30.0) * 0.05;

  vec3 col = uBg;
  col += uB * haze * 0.3;
  col += mix(uC, vec3(1.0), 0.55) * rim * 0.6;

  // Keep the headline's corner (bottom-left) entirely quiet.
  float corner = smoothstep(0.8, 0.0, length(vec2(uv.x * 1.2, uv.y * 1.7)));
  col = mix(col, uBg, corner * 0.8);

  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}
`;

const FRAG = { ribbons: HEAD + RIBBONS, aura: HEAD + AURA };

/** A theme colour as 0..1 RGB, resolved by the browser (works for oklch too). */
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

export function HeroRibbons({
  className,
  look = "ribbons",
}: {
  className?: string;
  /** Which field to draw: drifting ribbons, or one large aura fold. */
  look?: "ribbons" | "aura";
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG[look]));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uStir = u("uStir");
    const uVel = u("uVel");
    gl.uniform3fv(u("uBg"), tokenRgb(canvas, "--night"));
    gl.uniform3fv(u("uA"), tokenRgb(canvas, "--aurora-a"));
    gl.uniform3fv(u("uB"), tokenRgb(canvas, "--aurora-b"));
    gl.uniform3fv(u("uC"), tokenRgb(canvas, "--aurora-c"));

    // Soft image: half the CSS resolution is plenty.
    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    resize();

    // Pointer state, in 0..1 with y up; eased each frame.
    const target = { x: 0.7, y: 0.6, stir: 0, vx: 0, vy: 0 };
    const cur = { x: 0.7, y: 0.6, stir: 0, vx: 0, vy: 0 };
    const start = performance.now();
    // Start part-way into the flow so the first frame is already full.
    const offset = 40;

    const draw = (now: number) => {
      // Slow, heavy easing: the fog follows the pointer lazily.
      cur.x += (target.x - cur.x) * 0.035;
      cur.y += (target.y - cur.y) * 0.035;
      cur.stir += (target.stir - cur.stir) * 0.025;
      cur.vx += (target.vx - cur.vx) * 0.04;
      cur.vy += (target.vy - cur.vy) * 0.04;
      // The disturbance settles back when the pointer rests.
      target.stir *= 0.992;
      target.vx *= 0.95;
      target.vy *= 0.95;
      gl.uniform1f(uTime, offset + (now - start) / 1000);
      gl.uniform2f(uMouse, cur.x, cur.y);
      gl.uniform1f(uStir, cur.stir);
      gl.uniform2f(uVel, cur.vx, cur.vy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduced = prefersReducedMotion();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(start);
    });
    ro.observe(canvas);

    if (reduced) {
      draw(start);
      canvas.dataset.ready = "";
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      if (y < -0.1 || y > 1.1) return;
      target.x = x;
      target.y = y;
      if (last) {
        target.vx = Math.max(-0.25, Math.min(0.25, target.vx + (x - last.x) * 1.5));
        target.vy = Math.max(-0.25, Math.min(0.25, target.vy + (y - last.y) * 1.5));
      }
      last = { x, y };
      target.stir = 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    draw(start);
    canvas.dataset.ready = "";
    run();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [look]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
