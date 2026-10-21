// Cursor fog: minimal WebGL2 Navier-Stokes dye sim for the hero. window.PsqFog.mount(section) -> destroy()
(function () {
  const TINT = [0.80, 0.72, 0.89];           // plum #330152 mixed toward white
  const MAX_ALPHA = 0.22;                     // ~22% tint over white at full density

  function mount(section) {
    const canvas = section.querySelector('[data-fog-canvas]');
    const fallback = section.querySelector('[data-fog-fallback]');
    const showFallback = () => { if (fallback) fallback.style.opacity = '1'; if (canvas) canvas.style.display = 'none'; return () => {}; };
    if (!canvas) return () => {};
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return showFallback();

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return showFallback();
    gl.getExtension('OES_texture_float_linear');

    const fixed = canvas.hasAttribute('data-fog-fixed');
    const W = () => fixed ? window.innerWidth : section.clientWidth, Hh = () => fixed ? window.innerHeight : section.clientHeight;
    const mobile = () => W() < 768;
    const cfg = () => mobile() ? { sim: 64, dye: 512 } : { sim: 112, dye: 896 };
    const C = { DENS: 0.978, VEL: 0.98, PRESSURE: 0.8, ITER: 20, CURL: 7, FORCE: 3000, RADIUS: 0.016 };

    const VS = `#version 300 es
precision highp float; in vec2 aPos; uniform vec2 texelSize; out vec2 vUv,vL,vR,vT,vB;
void main(){ vUv=aPos*.5+.5; vL=vUv-vec2(texelSize.x,0.); vR=vUv+vec2(texelSize.x,0.); vT=vUv+vec2(0.,texelSize.y); vB=vUv-vec2(0.,texelSize.y); gl_Position=vec4(aPos,0.,1.); }`;
    const H = `#version 300 es
precision highp float; precision highp sampler2D; in vec2 vUv,vL,vR,vT,vB; out vec4 o;`;
    const FS = {
      splat: H + `uniform sampler2D uTarget; uniform float aspect,radius; uniform vec3 color; uniform vec2 point;
void main(){ vec2 p=vUv-point; p.x*=aspect; o=vec4(texture(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.); }`,
      advect: H + `uniform sampler2D uVelocity,uSource; uniform vec2 texelSize; uniform float dt,dissipation;
void main(){ vec2 c=vUv-dt*texture(uVelocity,vUv).xy*texelSize; o=texture(uSource,c)*dissipation; }`,
      divergence: H + `uniform sampler2D uVelocity;
void main(){ float L=texture(uVelocity,vL).x,R=texture(uVelocity,vR).x,T=texture(uVelocity,vT).y,B=texture(uVelocity,vB).y; vec2 C=texture(uVelocity,vUv).xy;
if(vL.x<0.)L=-C.x; if(vR.x>1.)R=-C.x; if(vT.y>1.)T=-C.y; if(vB.y<0.)B=-C.y; o=vec4(.5*(R-L+T-B),0.,0.,1.); }`,
      curl: H + `uniform sampler2D uVelocity;
void main(){ float L=texture(uVelocity,vL).y,R=texture(uVelocity,vR).y,T=texture(uVelocity,vT).x,B=texture(uVelocity,vB).x; o=vec4(.5*(R-L-T+B),0.,0.,1.); }`,
      vorticity: H + `uniform sampler2D uVelocity,uCurl; uniform float curl,dt;
void main(){ float L=texture(uCurl,vL).x,R=texture(uCurl,vR).x,T=texture(uCurl,vT).x,B=texture(uCurl,vB).x,C=texture(uCurl,vUv).x;
vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); f/=length(f)+.0001; f*=curl*C; f.y*=-1.; o=vec4(clamp(texture(uVelocity,vUv).xy+f*dt,-1000.,1000.),0.,1.); }`,
      pressure: H + `uniform sampler2D uPressure,uDivergence;
void main(){ float L=texture(uPressure,vL).x,R=texture(uPressure,vR).x,T=texture(uPressure,vT).x,B=texture(uPressure,vB).x; o=vec4((L+R+B+T-texture(uDivergence,vUv).x)*.25,0.,0.,1.); }`,
      gradient: H + `uniform sampler2D uPressure,uVelocity;
void main(){ float L=texture(uPressure,vL).x,R=texture(uPressure,vR).x,T=texture(uPressure,vT).x,B=texture(uPressure,vB).x; o=vec4(texture(uVelocity,vUv).xy-vec2(R-L,T-B),0.,1.); }`,
      clear: H + `uniform sampler2D uTexture; uniform float value; void main(){ o=value*texture(uTexture,vUv); }`,
      display: H + `uniform sampler2D uTexture; uniform vec3 tint; uniform float maxA;
void main(){ float d=texture(uTexture,vUv).r*.4+(texture(uTexture,vL).r+texture(uTexture,vR).r+texture(uTexture,vT).r+texture(uTexture,vB).r)*.15;
float a=(1.-exp(-max(d,0.)*1.6))*maxA; o=vec4(tint,a); }`
    };

    function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; }
    const vs = sh(gl.VERTEX_SHADER, VS), P = {};
    try {
      for (const k in FS) {
        const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS[k])); gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw gl.getProgramInfoLog(p);
        const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); }
        P[k] = { p, u };
      }
    } catch (e) { return showFallback(); }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
    const blit = (t) => { if (t) { gl.viewport(0, 0, t.w, t.h); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); } else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); } gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); };
    const use = (k) => { gl.useProgram(P[k].p); return P[k].u; };

    function fbo(w, h) {
      const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw 'fbo';
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb, w, h, tx: 1 / w, ty: 1 / h, bind(i) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex); return i; } };
    }
    const dbl = (w, h) => { let a = fbo(w, h), b = fbo(w, h); return { w, h, tx: 1 / w, ty: 1 / h, get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; } }; };
    const res = (r) => { const asp = gl.drawingBufferWidth / gl.drawingBufferHeight, mn = Math.round(r), mx = Math.round(r * (asp > 1 ? asp : 1 / asp)); return asp > 1 ? [mx, mn] : [mn, mx]; };

    let dye, vel, div, curl, pres;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = Math.max(1, Math.round(W() * dpr)), h = Math.max(1, Math.round(Hh() * dpr));
      if (canvas.width === w && canvas.height === h && dye) return;
      canvas.width = w; canvas.height = h;
      const c = cfg(), [sw, sh2] = res(c.sim), [dw, dh] = res(c.dye);
      dye = dbl(dw, dh); vel = dbl(sw, sh2); div = fbo(sw, sh2); curl = fbo(sw, sh2); pres = dbl(sw, sh2);
    }
    try { size(); } catch (e) { return showFallback(); }

    function splat(x, y, dx, dy, amt) {
      const asp = canvas.width / canvas.height;
      let u = use('splat');
      gl.uniform1i(u.uTarget, vel.read.bind(0)); gl.uniform1f(u.aspect, asp); gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, dx, dy, 0); gl.uniform1f(u.radius, C.RADIUS * (asp > 1 ? asp : 1));
      blit(vel.write); vel.swap();
      gl.uniform1i(u.uTarget, dye.read.bind(0)); gl.uniform3f(u.color, amt, 0, 0);
      blit(dye.write); dye.swap();
    }

    function step(dt) {
      gl.disable(gl.BLEND);
      let u = use('curl'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1i(u.uVelocity, vel.read.bind(0)); blit(curl);
      u = use('vorticity'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1i(u.uVelocity, vel.read.bind(0)); gl.uniform1i(u.uCurl, curl.bind(1)); gl.uniform1f(u.curl, C.CURL); gl.uniform1f(u.dt, dt); blit(vel.write); vel.swap();
      u = use('divergence'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1i(u.uVelocity, vel.read.bind(0)); blit(div);
      u = use('clear'); gl.uniform1i(u.uTexture, pres.read.bind(0)); gl.uniform1f(u.value, C.PRESSURE); blit(pres.write); pres.swap();
      u = use('pressure'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1i(u.uDivergence, div.bind(0));
      for (let i = 0; i < C.ITER; i++) { gl.uniform1i(u.uPressure, pres.read.bind(1)); blit(pres.write); pres.swap(); }
      u = use('gradient'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1i(u.uPressure, pres.read.bind(0)); gl.uniform1i(u.uVelocity, vel.read.bind(1)); blit(vel.write); vel.swap();
      const k = dt * 60;
      u = use('advect'); gl.uniform2f(u.texelSize, vel.tx, vel.ty); gl.uniform1f(u.dt, dt);
      gl.uniform1i(u.uVelocity, vel.read.bind(0)); gl.uniform1i(u.uSource, vel.read.bind(0)); gl.uniform1f(u.dissipation, Math.pow(C.VEL, k)); blit(vel.write); vel.swap();
      gl.uniform1i(u.uVelocity, vel.read.bind(0)); gl.uniform1i(u.uSource, dye.read.bind(1)); gl.uniform1f(u.dissipation, Math.pow(C.DENS, k)); blit(dye.write); dye.swap();
    }
    function draw() {
      const u = use('display'); gl.uniform2f(u.texelSize, dye.tx * 2, dye.ty * 2); gl.uniform1i(u.uTexture, dye.read.bind(0));
      gl.uniform3f(u.tint, TINT[0], TINT[1], TINT[2]); gl.uniform1f(u.maxA, MAX_ALPHA);
      gl.clearColor(0, 0, 0, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clear(gl.COLOR_BUFFER_BIT); blit(null);
    }

    // input — scoped to section, mouse/pen only
    let last = null;
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (last) {
        const dx = x - last.x, dy = y - last.y, sp = Math.hypot(dx * r.width, dy * r.height);
        if (sp > 0.5) splat(x, y, dx * C.FORCE, dy * C.FORCE, Math.min(0.16, 0.03 + sp * 0.0035));
      }
      last = { x, y };
    };
    const onLeave = () => { last = null; };
    const evT = fixed ? window : section;
    evT.addEventListener('pointermove', onMove, { passive: true });
    (fixed ? document.documentElement : section).addEventListener('pointerleave', onLeave);

    // idle ambience + mobile drift
    let nextIdle = performance.now() + 1200, t0 = performance.now();
    const drifters = [0, 1, 2].map(i => ({ ph: i * 2.1, sp: 0.07 + i * 0.025, px: null, py: null }));
    function ambient(now) {
      if (mobile()) {
        const t = (now - t0) / 1000;
        drifters.forEach((d, i) => {
          const x = 0.5 + 0.38 * Math.sin(t * d.sp * 2.3 + d.ph), y = 0.4 + 0.3 * Math.sin(t * d.sp * 1.7 + d.ph * 1.3);
          if (d.px !== null && ((Math.floor(now / 16) + i) % 6 === 0)) splat(x, y, (x - d.px) * 1200, (y - d.py) * 1200, 0.018);
          d.px = x; d.py = y;
        });
      } else if (now > nextIdle) {
        nextIdle = now + 4000 + Math.random() * 2000;
        const a = Math.random() * Math.PI * 2;
        splat(0.2 + Math.random() * 0.6, 0.15 + Math.random() * 0.45, Math.cos(a) * 60, Math.sin(a) * 60, 0.05);
      }
    }

    // loop with visibility gating
    let raf = 0, inView = true, prev = performance.now();
    const loop = (now) => {
      raf = 0;
      if (!inView || document.hidden) return;
      const dt = Math.min((now - prev) / 1000, 1 / 30); prev = now;
      try { size(); ambient(now); step(dt); draw(); } catch (e) { stop(); showFallback(); return; }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && inView && !document.hidden) { prev = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver((en) => { inView = en[0].isIntersecting; inView ? start() : stop(); });
    io.observe(section);
    const onVis = () => document.hidden ? stop() : start();
    document.addEventListener('visibilitychange', onVis);
    canvas.style.opacity = '1';
    start();

    return () => {
      stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      evT.removeEventListener('pointermove', onMove); (fixed ? document.documentElement : section).removeEventListener('pointerleave', onLeave);
      const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    };
  }
  window.PsqFog = { mount };
})();
