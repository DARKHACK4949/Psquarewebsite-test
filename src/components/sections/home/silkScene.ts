import * as THREE from "three";

/**
 * The hero silk: a real 3D cloth, lit like fabric. One large sheet enters from
 * the top-right with its lower edge rolling toward the camera (the bright
 * crest, and in places its darker underside); a second cloth hangs low on the
 * left in soft folds whose tops fade out of focus. The sheet swings slowly
 * forward and back (about 26 s) while its folds drift, and the pointer pushes
 * the cloth gently where it passes. Loaded on demand by HeroSilk.
 */

export type SilkColors = {
  bg: string;
  silk: string;
  sheen: string;
  key: string;
  rim: string;
  shade: string;
};

export type SilkScene = {
  /** Draw the frame for time t (seconds). */
  render(t: number): void;
  resize(width: number, height: number): void;
  /** The pointer in CSS pixels relative to the canvas, or null when it leaves. */
  pointer(x: number, y: number): void;
  dispose(): void;
};

export function createSilk(canvas: HTMLCanvasElement, colors: SilkColors): SilkScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors.bg);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const small = Math.min(window.innerWidth, window.innerHeight) < 700;

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors.silk),
    roughness: 0.42,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.35,
    sheenColor: new THREE.Color(colors.sheen),
    side: THREE.DoubleSide,
  });

  // The main sheet, its outline curved in-plane so the edge reads as an arc.
  const W = 10;
  const H = 6.5;
  const geo = new THREE.PlaneGeometry(W, H, small ? 140 : 220, small ? 90 : 140);
  {
    const a = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) a[i + 1] += 0.07 * a[i] * a[i] - 0.9;
  }
  const base = (geo.attributes.position.array as Float32Array).slice();
  const sheet = new THREE.Mesh(geo, mat);
  scene.add(sheet);

  // The hanging cloth: rounded tops that rise and fall with its folds.
  const geo2 = new THREE.PlaneGeometry(9, 4, small ? 120 : 200, small ? 50 : 90);
  {
    const a = geo2.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) {
      const k = 0.45 + 0.55 * Math.sqrt(Math.max(0, Math.cos(a[i] * 2.2)));
      a[i + 1] = -2 + (a[i + 1] + 2) * k;
    }
  }
  const base2 = (geo2.attributes.position.array as Float32Array).slice();
  const mat2 = mat.clone();
  // Soft, out-of-focus tops: the folds fade out toward their upper edge.
  const fade = document.createElement("canvas");
  fade.width = 1;
  fade.height = 256;
  const g = fade.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#000");
  grad.addColorStop(0.18, "#888");
  grad.addColorStop(0.35, "#fff");
  grad.addColorStop(1, "#fff");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1, 256);
  const fadeTex = new THREE.CanvasTexture(fade);
  mat2.alphaMap = fadeTex;
  mat2.transparent = true;
  mat2.depthWrite = false;
  const back = new THREE.Mesh(geo2, mat2);
  scene.add(back);

  // Light: a dim shadow fill, a soft key from the top-left, a violet rim from behind.
  scene.add(new THREE.AmbientLight(new THREE.Color(colors.shade), 0.6));
  const key = new THREE.DirectionalLight(new THREE.Color(colors.key), 1.5);
  key.position.set(-4, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(colors.rim), 1.3);
  rim.position.set(3, -2, -5);
  scene.add(rim);

  // Pointer, eased: where it is on the sheet (local x, y) and how strongly it pushes.
  const target = { x: 0, y: 0, push: 0 };
  const cur = { x: 0, y: 0, push: 0 };
  let portrait = false;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();
  const normal = new THREE.Vector3();

  function bend(t: number) {
    const p = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < p.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      // Long folds running diagonally, drifting.
      const u = x * 0.55 + y * 0.8;
      let z =
        0.5 * Math.sin(u * 1.1 - t * 0.35) +
        0.26 * Math.sin(u * 2.3 + 1.3 - t * 0.5) +
        0.18 * Math.sin(x * 0.7 - y * 0.4 + t * 0.25);
      // The lower edge rolls toward the camera: the crest.
      const e = (y + H / 2 + 0.9) / H;
      z += 1.6 * Math.exp(-Math.max(e, 0) * 7);
      // The pointer presses a soft dent into the cloth.
      if (cur.push > 0.001) {
        const dx = x - cur.x;
        const dy = y - cur.y;
        z -= 0.45 * cur.push * Math.exp(-(dx * dx + dy * dy) / 1.6);
      }
      p[i + 2] = z;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    const q = geo2.attributes.position.array as Float32Array;
    for (let i = 0; i < q.length; i += 3) {
      const x = base2[i];
      const y = base2[i + 1];
      q[i + 2] =
        0.42 * Math.cos(x * 2.2 + 0.25 * Math.sin(y * 0.6 + t * 0.3)) +
        0.15 * Math.sin(x * 4.7 + t * 0.2);
    }
    geo2.attributes.position.needsUpdate = true;
    geo2.computeVertexNormals();
  }

  function place(t: number) {
    const ph = 0.5 - 0.5 * Math.cos(t * 0.24);
    sheet.rotation.z = -0.45 - 0.35 * ph;
    sheet.rotation.x = -0.3;
    if (portrait) {
      // Tall screens: the sheet sweeps across the top-right corner, the folds sit low behind the actions.
      sheet.position.set(3.4 - 0.7 * ph, 4.1 - 0.4 * ph, 0);
      back.position.set(-0.6, -5.4 - 0.5 * ph, -2);
    } else {
      sheet.position.set(3.4 - 1.2 * ph, 2.6 - 0.5 * ph, 0);
      back.position.set(-2.2, -2.7 - 0.9 * ph, -2);
    }
  }

  return {
    render(t) {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      cur.push += (target.push - cur.push) * 0.04;
      target.push *= 0.985;
      place(t);
      bend(t);
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
      fadeTex.dispose();
      renderer.dispose();
    },
  };
}
