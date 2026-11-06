/*
 * A small real-time fluid simulation (Stable Fluids, on the GPU with WebGL2) for the hero's mouse trail.
 * Velocity lives on a coarse grid and colour on a finer one. Moving the mouse pushes the fluid and
 * drops dye into it; the dye drifts, swirls and fades. The loop stops once the trail has faded, so an
 * idle page costs nothing. Loaded on demand by FluidTrail.tsx.
 */

const SIM_SIZE = 128; // velocity grid, short side
const DYE_SIZE = 384; // colour grid, short side
const PRESSURE_STEPS = 16;
const SPLAT_RADIUS = 0.0008;
const SPLAT_FORCE = 2000;
const SPLAT_SPACING = 0.02; // a full dose of dye per this much mouse travel, so slow moves can't pile it up
const MAX_SPLATS_PER_MOVE = 6;
const DYE_AMOUNT = 0.3;
const VELOCITY_FADE = 0.6;
const DYE_FADE = 0.2;
const SWIRL = 12;
const STOP_AFTER_MS = 4000;
const FINAL_FADE_MS = 1000; // whatever dye is left clears over this last stretch, so the trail never pops off
const FINAL_FADE = 3;

/* VIBGYOR: the trail blends from one colour to the next at a steady rhythm. */
const PALETTE = [
  [0.56, 0.0, 1.0],
  [0.29, 0.0, 0.85],
  [0.0, 0.45, 1.0],
  [0.0, 0.75, 0.35],
  [1.0, 0.82, 0.0],
  [1.0, 0.5, 0.0],
  [1.0, 0.1, 0.15],
];
const MS_PER_COLOUR = 250;

const VERTEX = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragment = (body: string) => `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 texel;
${body}`;

const NEIGHBOURS = `
  vec2 l = vUv - vec2(texel.x, 0.0);
  vec2 r = vUv + vec2(texel.x, 0.0);
  vec2 t = vUv + vec2(0.0, texel.y);
  vec2 b = vUv - vec2(0.0, texel.y);`;

const SHADERS = {
  advect: fragment(`
uniform sampler2D velocity;
uniform sampler2D source;
uniform float dt;
uniform float fade;
void main() {
  vec2 from = vUv - dt * texture(velocity, vUv).xy * texel;
  outColor = texture(source, from) / (1.0 + fade * dt);
}`),
  splat: fragment(`
uniform sampler2D target;
uniform vec2 point;
uniform vec3 value;
uniform float radius;
uniform float aspect;
void main() {
  vec2 p = vUv - point;
  p.x *= aspect;
  outColor = vec4(texture(target, vUv).xyz + exp(-dot(p, p) / radius) * value, 1.0);
}`),
  curl: fragment(`
uniform sampler2D velocity;
void main() {${NEIGHBOURS}
  float c = texture(velocity, r).y - texture(velocity, l).y - texture(velocity, t).x + texture(velocity, b).x;
  outColor = vec4(0.5 * c, 0.0, 0.0, 1.0);
}`),
  swirl: fragment(`
uniform sampler2D velocity;
uniform sampler2D curl;
uniform float strength;
uniform float dt;
void main() {${NEIGHBOURS}
  vec2 force = 0.5 * vec2(abs(texture(curl, t).x) - abs(texture(curl, b).x), abs(texture(curl, r).x) - abs(texture(curl, l).x));
  force /= length(force) + 0.0001;
  force *= strength * texture(curl, vUv).x * vec2(1.0, -1.0);
  outColor = vec4(texture(velocity, vUv).xy + force * dt, 0.0, 1.0);
}`),
  divergence: fragment(`
uniform sampler2D velocity;
void main() {${NEIGHBOURS}
  float d = texture(velocity, r).x - texture(velocity, l).x + texture(velocity, t).y - texture(velocity, b).y;
  outColor = vec4(0.5 * d, 0.0, 0.0, 1.0);
}`),
  pressure: fragment(`
uniform sampler2D pressure;
uniform sampler2D divergence;
void main() {${NEIGHBOURS}
  float sum = texture(pressure, l).x + texture(pressure, r).x + texture(pressure, t).x + texture(pressure, b).x;
  outColor = vec4(0.25 * (sum - texture(divergence, vUv).x), 0.0, 0.0, 1.0);
}`),
  gradient: fragment(`
uniform sampler2D pressure;
uniform sampler2D velocity;
void main() {${NEIGHBOURS}
  vec2 g = 0.5 * vec2(texture(pressure, r).x - texture(pressure, l).x, texture(pressure, t).x - texture(pressure, b).x);
  outColor = vec4(texture(velocity, vUv).xy - g, 0.0, 1.0);
}`),
  scale: fragment(`
uniform sampler2D source;
uniform float amount;
void main() {
  outColor = texture(source, vUv) * amount;
}`),
  display: fragment(`
uniform sampler2D dye;
void main() {
  // soft ceiling, so dense patches stay gentle instead of turning into hot spots
  vec3 d = texture(dye, vUv).rgb;
  vec3 c = d / (1.0 + 1.6 * max(d.r, max(d.g, d.b)));
  outColor = vec4(c, max(c.r, max(c.g, c.b)));
}`),
};

type Program = { use: () => void; set: (name: string, ...values: number[]) => void; bind: (name: string, unit: number, texture: WebGLTexture) => void };
type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer; width: number; height: number };
type Swap = { read: Target; write: Target; swap: () => void };

export function createFluid(canvas: HTMLCanvasElement): { destroy: () => void } | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return null;
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const program = (source: string): Program | null => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vertex);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, source));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;

    const locations = new Map<string, WebGLUniformLocation | null>();
    const at = (name: string) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(p, name));
      return locations.get(name) ?? null;
    };
    return {
      use: () => gl.useProgram(p),
      set: (name, ...v) => {
        if (v.length === 1) gl.uniform1f(at(name), v[0]);
        else if (v.length === 2) gl.uniform2f(at(name), v[0], v[1]);
        else gl.uniform3f(at(name), v[0], v[1], v[2]);
      },
      bind: (name, unit, texture) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(at(name), unit);
      },
    };
  };

  const entries = Object.entries(SHADERS).map(([name, source]) => [name, program(source)] as const);
  if (entries.some(([, p]) => !p)) return null;
  const programs = Object.fromEntries(entries) as Record<keyof typeof SHADERS, Program>;

  const target = (width: number, height: number, internal: number, format: number): Target | null => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, gl.HALF_FLOAT, null);
    const framebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, framebuffer, width, height };
  };

  const swap = (width: number, height: number, internal: number, format: number): Swap | null => {
    const a = target(width, height, internal, format);
    const b = target(width, height, internal, format);
    if (!a || !b) return null;
    const pair: Swap = {
      read: a,
      write: b,
      swap: () => {
        [pair.read, pair.write] = [pair.write, pair.read];
      },
    };
    return pair;
  };

  const drawTo = (t: Target | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.framebuffer : null);
    gl.viewport(0, 0, t ? t.width : gl.drawingBufferWidth, t ? t.height : gl.drawingBufferHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const release = (t: Target) => {
    gl.deleteTexture(t.texture);
    gl.deleteFramebuffer(t.framebuffer);
  };

  let velocity: Swap;
  let dye: Swap;
  let pressure: Swap;
  let divergence: Target;
  let curl: Target;
  let texel: [number, number];
  let ready = false;

  const grid = (size: number, aspect: number) =>
    aspect >= 1 ? [Math.round(size * aspect), size] : [size, Math.round(size / aspect)];

  /* Sizes everything to the canvas. Any trail in progress is dropped, which only happens on resize. */
  const build = () => {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    canvas.width = width;
    canvas.height = height;

    if (ready) {
      for (const s of [velocity, dye, pressure]) {
        release(s.read);
        release(s.write);
      }
      release(divergence);
      release(curl);
    }

    const [sw, sh] = grid(SIM_SIZE, width / height);
    const [dw, dh] = grid(DYE_SIZE, width / height);
    const v = swap(sw, sh, gl.RG16F, gl.RG);
    const d = swap(dw, dh, gl.RGBA16F, gl.RGBA);
    const p = swap(sw, sh, gl.R16F, gl.RED);
    const div = target(sw, sh, gl.R16F, gl.RED);
    const c = target(sw, sh, gl.R16F, gl.RED);
    if (!v || !d || !p || !div || !c) return false;
    velocity = v;
    dye = d;
    pressure = p;
    divergence = div;
    curl = c;
    texel = [1 / sw, 1 / sh];
    ready = true;
    return true;
  };

  if (!build()) return null;

  const splat = (x: number, y: number, dx: number, dy: number, dose: number, colour: number[]) => {
    const s = programs.splat;
    s.use();
    s.set("point", x, y);
    s.set("radius", SPLAT_RADIUS);
    s.set("aspect", canvas.width / canvas.height);

    s.bind("target", 0, velocity.read.texture);
    s.set("value", dx, dy, 0);
    drawTo(velocity.write);
    velocity.swap();

    s.bind("target", 0, dye.read.texture);
    s.set("value", colour[0] * dose, colour[1] * dose, colour[2] * dose);
    drawTo(dye.write);
    dye.swap();
  };

  const colourAt = (now: number) => {
    const t = (now / MS_PER_COLOUR) % PALETTE.length;
    const from = PALETTE[Math.floor(t)];
    const to = PALETTE[(Math.floor(t) + 1) % PALETTE.length];
    return from.map((c, i) => (c + (to[i] - c) * (t % 1)) * DYE_AMOUNT);
  };

  const step = (dt: number, dyeFade: number) => {
    programs.curl.use();
    programs.curl.set("texel", ...texel);
    programs.curl.bind("velocity", 0, velocity.read.texture);
    drawTo(curl);

    programs.swirl.use();
    programs.swirl.set("texel", ...texel);
    programs.swirl.set("strength", SWIRL);
    programs.swirl.set("dt", dt);
    programs.swirl.bind("velocity", 0, velocity.read.texture);
    programs.swirl.bind("curl", 1, curl.texture);
    drawTo(velocity.write);
    velocity.swap();

    programs.divergence.use();
    programs.divergence.set("texel", ...texel);
    programs.divergence.bind("velocity", 0, velocity.read.texture);
    drawTo(divergence);

    // start from most of last frame's pressure so fewer steps are needed
    programs.scale.use();
    programs.scale.set("amount", 0.8);
    programs.scale.bind("source", 0, pressure.read.texture);
    drawTo(pressure.write);
    pressure.swap();

    programs.pressure.use();
    programs.pressure.set("texel", ...texel);
    programs.pressure.bind("divergence", 1, divergence.texture);
    for (let i = 0; i < PRESSURE_STEPS; i++) {
      programs.pressure.bind("pressure", 0, pressure.read.texture);
      drawTo(pressure.write);
      pressure.swap();
    }

    programs.gradient.use();
    programs.gradient.set("texel", ...texel);
    programs.gradient.bind("pressure", 0, pressure.read.texture);
    programs.gradient.bind("velocity", 1, velocity.read.texture);
    drawTo(velocity.write);
    velocity.swap();

    programs.advect.use();
    programs.advect.set("texel", ...texel);
    programs.advect.set("dt", dt);
    programs.advect.set("fade", VELOCITY_FADE);
    programs.advect.bind("velocity", 0, velocity.read.texture);
    programs.advect.bind("source", 1, velocity.read.texture);
    drawTo(velocity.write);
    velocity.swap();

    programs.advect.set("fade", dyeFade);
    programs.advect.bind("velocity", 0, velocity.read.texture);
    programs.advect.bind("source", 1, dye.read.texture);
    drawTo(dye.write);
    dye.swap();
  };

  const present = () => {
    programs.display.use();
    programs.display.bind("dye", 0, dye.read.texture);
    drawTo(null);
  };

  const wipe = () => {
    gl.clearColor(0, 0, 0, 0);
    for (const t of [velocity.read, velocity.write, dye.read, dye.write, pressure.read, pressure.write]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.framebuffer);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  let raf = 0;
  let running = false;
  let lastFrame = 0;
  let lastInput = 0;
  let inView = true;
  let previous: { x: number; y: number } | null = null;
  let pending: { x: number; y: number; dx: number; dy: number; dose: number }[] = [];

  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;

    const colour = colourAt(now);
    for (const s of pending) splat(s.x, s.y, s.dx, s.dy, s.dose, colour);
    pending = [];

    if (dt > 0) step(dt, now - lastInput > STOP_AFTER_MS - FINAL_FADE_MS ? DYE_FADE + FINAL_FADE : DYE_FADE);
    present();

    if (now - lastInput > STOP_AFTER_MS) {
      wipe();
      running = false;
      previous = null;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !inView) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      previous = null;
      return;
    }

    if (previous) {
      const dx = x - previous.x;
      const dy = y - previous.y;
      // space splats along the path so a fast flick leaves a line, not dots
      const distance = Math.hypot(dx * (rect.width / rect.height), dy);
      const count = Math.min(MAX_SPLATS_PER_MOVE, Math.ceil(distance / SPLAT_SPACING));
      const dose = Math.min(1, distance / count / SPLAT_SPACING);
      for (let i = 1; i <= count; i++) {
        pending.push({
          x: previous.x + (dx * i) / count,
          y: previous.y + (dy * i) / count,
          dx: (dx * SPLAT_FORCE) / count,
          dy: (dy * SPLAT_FORCE) / count,
          dose,
        });
      }
    }
    previous = { x, y };
    lastInput = performance.now();

    if (!running) {
      running = true;
      lastFrame = lastInput;
      raf = requestAnimationFrame(frame);
    }
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    running = false;
    pending = [];
    previous = null;
  };

  const onResize = () => {
    if (canvas.clientWidth === canvas.width && canvas.clientHeight === canvas.height) return;
    stop();
    build();
  };

  const onContextLost = () => stop();

  const resize = new ResizeObserver(onResize);
  resize.observe(canvas);

  const view = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    previous = null;
  });
  view.observe(canvas);

  window.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    destroy: () => {
      stop();
      resize.disconnect();
      view.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
