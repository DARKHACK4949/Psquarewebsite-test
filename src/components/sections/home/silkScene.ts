import * as THREE from "three";

/**
 * The hero silk: a real 3D cloth, after the reference film. Measured from
 * that film, and kept here:
 * - Colour: matte fabric, no shine. Faces turned toward the light reach the
 *   silk violet and stop there (nothing brighter); faces turned away fall
 *   through navy into the page's dark. More than half the frame stays dark.
 * - Motion: one slow, steady glide. The cloth drifts up and to the right at a
 *   constant speed while its edge sweeps across, its folds riding along with
 *   it (they barely change shape). It eases only where the glide turns back,
 *   about every 12 s.
 * - Edge: the sheet's lower edge rolls toward the camera, so a crisp lit
 *   crest sits on a band of shadow.
 * A second cloth hangs low on the left in soft folds whose tops fade out.
 * The pointer presses a soft dent into the sheet. The cloth bends on the GPU
 * (displacement and normals in the vertex shader), so it stays smooth on
 * phones. Loaded on demand by HeroSilk.
 */

export type SilkColors = {
  /** The page behind the cloth. */
  bg: string;
  /** The deepest shadow on the cloth. */
  shade: string;
  /** The midtone the shading passes through. */
  mid: string;
  /** The lit fabric: the brightest the cloth gets. */
  silk: string;
};

export type SilkScene = {
  /** Draw the frame for time t (seconds). */
  render(t: number): void;
  resize(width: number, height: number): void;
  /** The pointer in CSS pixels relative to the canvas. */
  pointer(x: number, y: number): void;
  dispose(): void;
};

const VERT = /* glsl */ `
uniform float uTime;
uniform int uKind;      // 0 = the main sheet, 1 = the hanging cloth
uniform vec3 uDent;     // x, y (local), strength
varying vec3 vNormal;
varying vec2 vUv;
varying float vTop;
varying float vX;
varying float vEdge;

// Height of the cloth at local (x, y) and its slope, computed together.
vec3 sheetHeight(vec2 p) {
  float x = p.x, y = p.y;
  float t = uTime;
  // Long folds running diagonally; they live with the cloth and change only slowly.
  float u = x * 0.55 + y * 0.8;
  float a1 = u * 1.1 - t * 0.06, a2 = u * 2.3 + 1.3 - t * 0.09, a3 = x * 0.7 - y * 0.4 + t * 0.05;
  float z = 0.5 * sin(a1) + 0.26 * sin(a2) + 0.18 * sin(a3);
  float dx = 0.5 * cos(a1) * 1.1 * 0.55 + 0.26 * cos(a2) * 2.3 * 0.55 + 0.18 * cos(a3) * 0.7;
  float dy = 0.5 * cos(a1) * 1.1 * 0.8 + 0.26 * cos(a2) * 2.3 * 0.8 - 0.18 * cos(a3) * 0.4;
  // The lower edge rolls toward the camera: the crest.
  float e = max((y + 4.15) / 6.5, 0.0);
  float roll = 1.6 * exp(-e * 7.0);
  z += roll;
  dy += roll * (-7.0 / 6.5);
  // The pointer's dent.
  vec2 d = p - uDent.xy;
  float dent = 0.3 * uDent.z * exp(-dot(d, d) / 1.6);
  z -= dent;
  dx += dent * (2.0 * d.x / 1.6);
  dy += dent * (2.0 * d.y / 1.6);
  return vec3(z, dx, dy);
}

vec3 hangHeight(vec2 p) {
  float x = p.x, y = p.y, t = uTime;
  float a = x * 1.6 + 0.25 * sin(y * 0.6 + t * 0.08);
  float z = 0.42 * cos(a) + 0.12 * sin(x * 4.7 + t * 0.06);
  float dx = -0.42 * sin(a) * 1.6 + 0.12 * cos(x * 4.7 + t * 0.06) * 4.7;
  float dy = -0.42 * sin(a) * 0.25 * cos(y * 0.6 + t * 0.08) * 0.6;
  return vec3(z, dx, dy);
}

void main() {
  vec3 h = uKind == 0 ? sheetHeight(position.xy) : hangHeight(position.xy);
  vec3 pos = vec3(position.xy, h.x);
  vNormal = normalize(normalMatrix * normalize(vec3(-h.y, -h.z, 1.0)));
  vUv = uv;
  // Distance below the hanging cloth's top edge, in scene units.
  float k = 0.35 + 0.65 * pow(max(0.0, 0.5 + 0.5 * cos(position.x * 1.6)), 0.8);
  vTop = (1.0 - uv.y) * 4.0 * k;
  vX = position.x;
  // Distance in from the sheet's rolled edge, in scene units.
  vEdge = position.y + 4.15;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uShade;
uniform vec3 uMid;
uniform vec3 uSilk;
uniform vec3 uLight;    // light direction, view space
uniform int uKind;
varying vec3 vNormal;
varying vec2 vUv;
varying float vTop;
varying float vX;
varying float vEdge;

void main() {
  vec3 n = normalize(vNormal);
  // The underside of the cloth (seen where it rolls over) sits in shadow.
  float under = gl_FrontFacing ? 1.0 : 0.45;
  if (!gl_FrontFacing) n = -n;
  // Soft, wrapped diffuse light: no specular, nothing shinier than the fabric.
  float l = clamp(dot(n, uLight) * 0.85 + 0.15, 0.0, 1.0) * under;
  // Shade -> mid -> silk, capped at the silk violet.
  // Calm: most of the cloth rests in navy shadow; only the ridges reach the violet.
  // The sheet also sinks into shadow away from its lit edge, and the hanging
  // cloth sits dimmer, further back.
  float depth = uKind == 0 ? mix(1.0, 0.6, smoothstep(1.4, 5.0, vEdge)) : 0.72;
  l *= depth;
  vec3 c = mix(uShade, uMid, smoothstep(0.15, 0.6, l));
  c = mix(c, uSilk, smoothstep(0.56, 0.9, l));
  float alpha = 1.0;
  // The hanging cloth's tops fade out, as if out of focus.
  // ...and its two ends fade too, so no straight cut shows.
  if (uKind == 1) alpha = smoothstep(0.0, 1.1, vTop) * smoothstep(4.5, 3.0, abs(vX));
  gl_FragColor = vec4(c, alpha);
}
`;

/** The hanging cloth's height profile across x (its rounded tops), 0.35..1. */
function topK(x: number) {
  return 0.35 + 0.65 * Math.pow(Math.max(0, 0.5 + 0.5 * Math.cos(x * 1.6)), 0.8);
}

export function createSilk(canvas: HTMLCanvasElement, colors: SilkColors): SilkScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  // Colours are written as given: the tokens are the final colours.
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const hex = (c: string) => new THREE.Color().setStyle(c, THREE.LinearSRGBColorSpace);
  scene.background = hex(colors.bg);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  // Low and from the top-left, so the folds fall into navy shadow.
  const light = new THREE.Vector3(-0.62, 0.55, 0.42).normalize();
  const dent = new THREE.Vector3(0, 0, 0);

  const make = (kind: number) =>
    new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
      transparent: kind === 1,
      depthWrite: kind === 0,
      uniforms: {
        uTime: { value: 0 },
        uKind: { value: kind },
        uDent: { value: dent },
        uShade: { value: hex(colors.shade) },
        uMid: { value: hex(colors.mid) },
        uSilk: { value: hex(colors.silk) },
        uLight: { value: light },
      },
    });

  // The main sheet, its outline curved in-plane so the edge reads as an arc.
  const geo = new THREE.PlaneGeometry(10, 6.5, small ? 140 : 220, small ? 90 : 140);
  {
    const a = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) a[i + 1] += 0.07 * a[i] * a[i] - 0.9;
  }
  const mat = make(0);
  const sheet = new THREE.Mesh(geo, mat);
  sheet.frustumCulled = false;
  scene.add(sheet);

  // The hanging cloth: rounded tops that rise and fall with its folds.
  const geo2 = new THREE.PlaneGeometry(9, 4, small ? 120 : 200, small ? 50 : 90);
  {
    const a = geo2.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) {
      const k = topK(a[i]);
      a[i + 1] = -2 + (a[i + 1] + 2) * k;
    }
  }
  const mat2 = make(1);
  const back = new THREE.Mesh(geo2, mat2);
  back.frustumCulled = false;
  scene.add(back);

  // Pointer, eased: where it is on the sheet (local x, y) and how strongly it presses.
  const target = { x: 0, y: 0, push: 0 };
  let portrait = false;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();
  const normal = new THREE.Vector3();

  /**
   * The glide: 0..1 and back, at constant speed, easing only near the turns
   * (a triangle wave with rounded corners), about 12 s each way.
   */
  function glide(t: number) {
    const half = 12;
    const k = (t / half) % 2;
    const tri = k < 1 ? k : 2 - k;
    // Round only the last 12% at each end.
    const r = 0.12;
    if (tri < r) return (tri * tri) / (2 * r) / (1 - r);
    if (tri > 1 - r) return 1 - ((1 - tri) * (1 - tri)) / (2 * r) / (1 - r);
    return (tri - r / 2) / (1 - r);
  }

  function place(t: number) {
    const g = glide(t);
    // The sheet turns a little as it drifts, so its edge sweeps across.
    sheet.rotation.set(-0.3, 0, -0.3 - 0.62 * g);
    if (portrait) {
      // Tall screens: the sheet sweeps across the top-right corner, the folds sit low.
      sheet.position.set(3.8 - 1.3 * g, 4.1 - 0.4 * g, 0);
      back.position.set(-0.9 + 0.8 * g, -5.6 + 0.3 * g, -2);
    } else {
      sheet.position.set(4.1 - 2.2 * g, 2.6 - 0.6 * g, 0);
      back.position.set(-3.0 + 1.4 * g, -3.1 + 0.5 * g, -2);
    }
  }

  return {
    render(t) {
      dent.x += (target.x - dent.x) * 0.06;
      dent.y += (target.y - dent.y) * 0.06;
      dent.z += (target.push - dent.z) * 0.04;
      target.push *= 0.985;
      mat.uniforms.uTime.value = t;
      mat2.uniforms.uTime.value = t;
      place(t);
      renderer.render(scene, camera);
    },
    resize(width, height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      portrait = camera.aspect < 0.9;
      // Pull back on tall screens so the cloth keeps its scale.
      camera.position.z = portrait ? 13 : 9;
      camera.updateProjectionMatrix();
    },
    pointer(x, y) {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      ndc.set((x / w) * 2 - 1, -(y / h) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      // Intersect the sheet's resting plane, then express the hit in its local space.
      sheet.updateMatrixWorld();
      normal.set(0, 0, 1).transformDirection(sheet.matrixWorld);
      plane.setFromNormalAndCoplanarPoint(normal, sheet.position);
      if (!ray.ray.intersectPlane(plane, hit)) return;
      sheet.worldToLocal(hit);
      target.x = hit.x;
      target.y = hit.y;
      target.push = 1;
    },
    dispose() {
      geo.dispose();
      geo2.dispose();
      mat.dispose();
      mat2.dispose();
      renderer.dispose();
    },
  };
}
