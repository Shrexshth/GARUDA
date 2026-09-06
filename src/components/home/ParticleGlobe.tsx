import { useEffect, useRef } from "react";

const DUR = 12;
const TAU = Math.PI * 2;

function hash(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}
function smooth(a: number) {
  return a * a * (3 - 2 * a);
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  let v = 0;
  for (let dx = 0; dx < 2; dx++)
    for (let dy = 0; dy < 2; dy++)
      for (let dz = 0; dz < 2; dz++) {
        const w = (dx ? smooth(xf) : 1 - smooth(xf)) *
                  (dy ? smooth(yf) : 1 - smooth(yf)) *
                  (dz ? smooth(zf) : 1 - smooth(zf));
        v += w * hash(xi + dx, yi + dy, zi + dz);
      }
  return v;
}
function fbm(x: number, y: number, z: number) {
  return noise3(x, y, z) * .55 + noise3(x * 2.1, y * 2.1, z * 2.1) * .3 + noise3(x * 4.3, y * 4.3, z * 4.3) * .15;
}

const DOT_FLOOR = .3;
const ALL_DOTS = (() => {
  const out = [];
  const latStep = 3; // OPTIMIZATION: Increased latStep from 2 to 3 to reduce total dots by 33%
  for (let lat = -84; lat <= 84; lat += latStep) {
    const latR = lat * Math.PI / 180;
    const circ = Math.cos(latR);
    const n = Math.max(6, Math.round(150 * circ)); // OPTIMIZATION: Reduced from 190 to 150
    for (let i = 0; i < n; i++) {
      const lon = i / n * TAU + lat * .13;
      const x = Math.cos(latR) * Math.cos(lon);
      const y = Math.sin(latR);
      const z = Math.cos(latR) * Math.sin(lon);
      const d = fbm(x * 2.2 + 7.3, y * 2.2 + 3.1, z * 2.2 + 11.8);
      if (d > DOT_FLOOR) out.push({ x, y, z, s: .35 + hash(i, lat, 1) * .75, tw: hash(i, lat, 2) * TAU, d });
    }
  }
  return out;
})();

function ll(lat: number, lon: number) {
  const a = lat * Math.PI / 180, o = lon * Math.PI / 180;
  return { x: Math.cos(a) * Math.cos(o), y: Math.sin(a), z: Math.cos(a) * Math.sin(o) };
}

const ICO = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(v => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  });
  let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  function subdivide(faces: any[]) {
    const cache: any = {};
    const mid = (a: number, b: number) => {
      const k = a < b ? a + "_" + b : b + "_" + a;
      if (cache[k] !== undefined) return cache[k];
      const m = [(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2];
      const l = Math.hypot(m[0], m[1], m[2]);
      V.push([m[0] / l, m[1] / l, m[2] / l]);
      return cache[k] = V.length - 1;
    };
    const out = [];
    for (const [a, b, c] of faces) {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      out.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    return out;
  }
  const F2 = subdivide(subdivide(F));
  const eset = new Set(), E: any[] = [];
  for (const [a, b, c] of F2) {
    for (const [p, q] of [[a, b], [b, c], [c, a]]) {
      const k = p < q ? p + "_" + q : q + "_" + p;
      if (!eset.has(k)) { eset.add(k); E.push([p, q]); }
    }
  }
  return { V, E };
})();

const STARS = Array.from({ length: 160 }, (_, i) => ({ x: hash(i, 1, 0), y: hash(i, 2, 0), s: hash(i, 3, 0), p: hash(i, 4, 0) * TAU }));

function hexToRGB(hex: string, fallback: number[]) {
  if (hex.startsWith("#")) {
    const h = hex.replace("#", "");
    if (h.length === 6) {
      return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
    }
  }
  return fallback;
}

const mix = (a: number[], b: number[], p: number) => [
  Math.round(a[0] + (b[0] - a[0]) * p), 
  Math.round(a[1] + (b[1] - a[1]) * p), 
  Math.round(a[2] + (b[2] - a[2]) * p)
];

const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${(a * (c.length > 3 ? c[3] : 1)).toFixed(3)})`;

const HOTSPOTS = [{ c: ll(18, 40), r: .55, ph: 0, pulse: 0 }, { c: ll(-14, -60), r: .45, ph: 2.4, pulse: 0 }];

function rot(p: any, ay: number, ax: number) {
  const cy = Math.cos(ay), sy = Math.sin(ay);
  const x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy, y = p.y;
  const cx = Math.cos(ax), sx = Math.sin(ax);
  return { x, y: y * cx - z * sx, z: y * sx + z * cx };
}

function draw(ctx: CanvasRenderingContext2D, time: number, cfg: any, itx: any, W: number, H: number, DPR: number) {
  const { mouse, drag } = itx;
  if (cfg.enableParallax && mouse.tx > -1e5) {
    if (mouse.x < -1e5) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    mouse.x += (mouse.tx - mouse.x) * .15;
    mouse.y += (mouse.ty - mouse.y) * .15;
  } else { mouse.x = -1e6; mouse.y = -1e6; }
  const tTiltY = cfg.enableParallax && mouse.tx > -1e5 ? (mouse.tx / W - .5) * .22 : 0;
  const tTiltX = cfg.enableParallax && mouse.ty > -1e5 ? (mouse.ty / H - .5) * .18 : 0;
  mouse.tiltY += (tTiltY - mouse.tiltY) * .06;
  mouse.tiltX += (tTiltX - mouse.tiltX) * .06;

  if (!drag.on) {
    drag.offY += drag.velY;
    drag.offX = Math.max(-1, Math.min(1, drag.offX + drag.velX));
    drag.velY *= .955;
    drag.velX *= .955;
    if (Math.abs(drag.velY) < 1e-5) drag.velY = 0;
    if (Math.abs(drag.velX) < 1e-5) drag.velX = 0;
  }
  const ay = time / DUR * TAU + mouse.tiltY + drag.offY;
  const ax = -.25 + mouse.tiltX + drag.offX;
  for (const hs of HOTSPOTS) hs.pulse = .72 + .28 * Math.sin(time / DUR * TAU * 3 + hs.ph);

  function hotHeat(p: any) {
    if (!cfg.showHotspots) return 0;
    let h = 0;
    for (const hs of HOTSPOTS) {
      const dot = p.x * hs.c.x + p.y * hs.c.y + p.z * hs.c.z;
      const ang = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (ang < hs.r) h = Math.max(h, Math.pow(1 - ang / hs.r, 1.6) * hs.pulse);
    }
    return h;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, W, H);
  
  if (cfg.showStars) {
    for (const s of STARS) {
      const a = .12 + .14 * Math.sin(time / DUR * TAU * 2 + s.p);
      ctx.fillStyle = `rgba(200,210,255,${a.toFixed(3)})`;
      const r = (.5 + s.s) * DPR;
      ctx.fillRect(s.x * W, s.y * H, r, r);
    }
  }
  const R = Math.min(W, H) * .4;
  const cx = W / 2, cy = H / 2;
  const persp = (z: number) => 1 / (1 - z * .28);
  ctx.globalCompositeOperation = "lighter";

  for (const d of ALL_DOTS) {
    if (d.d <= cfg.threshold) continue;
    const p = rot(d, ay, ax);
    if (p.z >= 0) continue;
    const k = persp(p.z);
    const b = .7 + (d.d - cfg.threshold) * 2.2;
    const heat = hotHeat(d);
    const a = b * .1;
    ctx.fillStyle = heat > .15 ? rgba(mix(cfg.hotColor, [255, 255, 255], Math.max(0, .35 - heat * .3)), +(a * (.6 + heat)).toFixed(3)) : rgba(cfg.dotColor, +a.toFixed(3));
    ctx.beginPath();
    ctx.arc(cx + p.x * R * k, cy - p.y * R * k, d.s * cfg.dotScale * DPR * .8 * k, 0, 7);
    ctx.fill();
  }

  if (cfg.showWireframe) {
    const WR = R * 1.06;
    const pv = ICO.V.map(v => rot({ x: v[0], y: v[1], z: v[2] }, ay * .32, ax));
    for (const [a, b] of ICO.E) {
      const p1 = pv[a], p2 = pv[b];
      const zm = (p1.z + p2.z) / 2;
      const alpha = .05 + Math.max(0, zm) * .55;
      const k1 = persp(p1.z), k2 = persp(p2.z);
      ctx.strokeStyle = rgba(cfg.wireColor, +alpha.toFixed(3));
      ctx.lineWidth = (zm > 0 ? 1.1 : .6) * DPR;
      ctx.beginPath();
      ctx.moveTo(cx + p1.x * WR * k1, cy - p1.y * WR * k1);
      ctx.lineTo(cx + p2.x * WR * k2, cy - p2.y * WR * k2);
      ctx.stroke();
    }
    for (let i = 0; i < pv.length; i++) {
      const p = pv[i];
      if (p.z < .1 || hash(i, 9, 3) > .22) continue;
      const k = persp(p.z);
      const X = cx + p.x * WR * k, Y = cy - p.y * WR * k;
      const flick = .5 + .5 * Math.sin(time / DUR * TAU * 4 + i * 1.7);
      const s = (2.5 + 5 * flick * p.z) * DPR;
      const gg = ctx.createRadialGradient(X, Y, 0, X, Y, s * 3);
      gg.addColorStop(0, `rgba(255,255,255,${(.5 * p.z).toFixed(3)})`);
      gg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gg;
      ctx.fillRect(X - s * 3, Y - s * 3, s * 6, s * 6);
      ctx.strokeStyle = `rgba(255,255,255,${(.35 * p.z * flick).toFixed(3)})`;
      ctx.lineWidth = DPR * .8;
      ctx.beginPath();
      ctx.moveTo(X - s * 2.2, Y); ctx.lineTo(X + s * 2.2, Y);
      ctx.moveTo(X, Y - s * 2.2); ctx.lineTo(X, Y + s * 2.2);
      ctx.stroke();
    }
  }

  if (cfg.showMarkers) {
    ctx.globalCompositeOperation = "source-over";
    for (const m of cfg.markers) {
      const p = rot(m.p, ay, ax);
      if (p.z < .12) continue;
      const k = persp(p.z);
      const X = cx + p.x * R * k, Y = cy - p.y * R * k;
      const vis = Math.min(1, (p.z - .12) / .3);
      let mh = 0;
      if (mouse.x > -1e5) {
        const dist = Math.hypot(X - mouse.x, Y - mouse.y);
        if (dist < 60 * DPR) mh = 1 - dist / (60 * DPR);
      }
      const pulse = .5 + .5 * Math.sin(time / DUR * TAU * 4 + m.p.x * 9);
      const col = m.accent ? cfg.accentColor : cfg.markerColor;
      ctx.strokeStyle = rgba(col, +(vis * (.35 + .35 * pulse + mh * .3)).toFixed(3));
      ctx.lineWidth = DPR;
      ctx.beginPath();
      ctx.arc(X, Y, (5 + 3 * pulse + mh * 4) * DPR, 0, 7);
      ctx.stroke();
      ctx.fillStyle = rgba(col, +(vis * (.85 + mh * .15)).toFixed(3));
      ctx.beginPath();
      ctx.arc(X, Y, 2.2 * DPR, 0, 7);
      ctx.fill();
      const lx = X + 16 * DPR, ly = Y - 16 * DPR;
      ctx.strokeStyle = `rgba(255,255,255,${(vis * .4).toFixed(3)})`;
      ctx.lineWidth = DPR * .8;
      ctx.beginPath();
      ctx.moveTo(X + 4 * DPR, Y - 4 * DPR); ctx.lineTo(lx, ly); ctx.lineTo(lx + 10 * DPR, ly);
      ctx.stroke();
      ctx.textBaseline = "bottom"; ctx.textAlign = "left";
      ctx.font = `600 ${11 * DPR}px Helvetica, Arial, sans-serif`;
      ctx.fillStyle = `rgba(240,246,255,${(vis * (.8 + mh * .2)).toFixed(3)})`;
      ctx.fillText(m.name, lx + 14 * DPR, ly + 4 * DPR);
      if (m.sub) {
        ctx.font = `400 ${9 * DPR}px Helvetica, Arial, sans-serif`;
        ctx.fillStyle = `rgba(170,185,220,${(vis * .7).toFixed(3)})`;
        ctx.fillText(m.sub, lx + 14 * DPR, ly + 15 * DPR);
      }
    }
    ctx.globalCompositeOperation = "lighter";
  }

  for (const d of ALL_DOTS) {
    if (d.d <= cfg.threshold) continue;
    const p = rot(d, ay, ax);
    if (p.z < 0) continue;
    const k = persp(p.z);
    const X = cx + p.x * R * k, Y = cy - p.y * R * k;
    const b = .7 + (d.d - cfg.threshold) * 2.2;
    const tw = .75 + .25 * Math.sin(time / DUR * TAU * 6 + d.tw);
    const heat = hotHeat(d);
    let hov = 0;
    if (mouse.x > -1e5) {
      const dist = Math.hypot(X - mouse.x, Y - mouse.y), rad = R * .22;
      if (dist < rad) hov = Math.pow(1 - dist / rad, 1.8);
    }
    const a = Math.min(1, b * (.35 + .65 * p.z) * tw * (1 + hov * 1.6));
    const sz = d.s * cfg.dotScale * DPR * (.9 + p.z * .6) * k * (1 + hov * 1.4);
    if (heat > .1) {
      const hb = Math.min(1, a * (.9 + heat * 1.5));
      const gs = sz * (3 + heat * 4);
      const inner = mix(cfg.hotColor, [255, 255, 255], Math.min(1, .6 + heat * .35));
      const midC = mix(cfg.hotColor, [255, 255, 255], .12);
      const gg = ctx.createRadialGradient(X, Y, 0, X, Y, gs);
      gg.addColorStop(0, rgba(inner, +hb.toFixed(3)));
      gg.addColorStop(.3, rgba(midC, +(hb * .8).toFixed(3)));
      gg.addColorStop(1, rgba(cfg.hotColor, 0));
      ctx.fillStyle = gg;
      ctx.fillRect(X - gs, Y - gs, gs * 2, gs * 2);
      ctx.fillStyle = rgba(mix(cfg.hotColor, [255, 255, 255], .9), +hb.toFixed(3));
      ctx.beginPath(); ctx.arc(X, Y, sz * (1 + heat * .8), 0, 7); ctx.fill();
    } else {
      ctx.fillStyle = rgba(cfg.dotColor, +(a * .35).toFixed(3));
      ctx.beginPath(); ctx.arc(X, Y, sz * 2.2, 0, 7); ctx.fill();
      ctx.fillStyle = rgba(cfg.dotCore, +a.toFixed(3));
      ctx.beginPath(); ctx.arc(X, Y, sz, 0, 7); ctx.fill();
      if (hov > .35) {
        const hs2 = sz * 3.5;
        const gg = ctx.createRadialGradient(X, Y, 0, X, Y, hs2);
        gg.addColorStop(0, rgba(cfg.accentColor, +(hov * .5).toFixed(3)));
        gg.addColorStop(1, rgba(cfg.accentColor, 0));
        ctx.fillStyle = gg;
        ctx.fillRect(X - hs2, Y - hs2, hs2 * 2, hs2 * 2);
      }
    }
  }

  if (mouse.x > -1e5) {
    const lr = R * .22;
    const gg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, lr);
    gg.addColorStop(0, rgba(cfg.accentColor, .05));
    gg.addColorStop(1, rgba(cfg.accentColor, 0));
    ctx.fillStyle = gg;
    ctx.fillRect(mouse.x - lr, mouse.y - lr, lr * 2, lr * 2);
  }
}

const DEFAULT_MARKERS = [
  { name: "SAN FRANCISCO", latitude: 37.7, longitude: -122.4, accent: false },
  { name: "LONDON", latitude: 51.5, longitude: -.1, accent: false },
  { name: "TOKYO", latitude: 35.7, longitude: 139.7, accent: false },
  { name: "SÃO PAULO", latitude: -23.5, longitude: -46.6, accent: false },
  { name: "NAIROBI", latitude: -1.3, longitude: 36.8, accent: false }
];

function fmtLL(lat: number, lon: number) {
  return `${Math.abs(lat).toFixed(1)}°${lat < 0 ? "S" : "N"} ${Math.abs(lon).toFixed(1)}°${lon < 0 ? "W" : "E"}`;
}

export default function ParticleGlobe(props: any) {
  const { style, motion = {}, layers = {}, interaction = {}, appearance = {}, markers = DEFAULT_MARKERS } = props;
  const { speed = 0.75, autoPlay = true, density = 35, particleSize = 1.2 } = motion; // SPEED IN BETWEEN 1 and 0.5
  const { showWireframe = true, showStars = false, showHotspots = true, showMarkers = true } = layers; // OPTIMIZATION: Disabled stars for better background performance
  const { enableDrag = false, enableParallax = false } = interaction; // OPTIMIZATION: Disabled interactions for background element
  
  // Custom colors matching brand (greens) but darkened to blend better
  const {
    dotColor = "#1F6148",
    wireColor = "#287A5B",
    markerColor = "#D7EBE1",
    accentColor = "#399572",
    hotColor = "#103625",
    cornerRadius = "0px"
  } = appearance;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cfgRef = useRef<any>(null);
  const itxRef = useRef({
    mouse: { x: -1e6, y: -1e6, tx: -1e6, ty: -1e6, tiltX: 0, tiltY: 0 },
    drag: { on: false, lastX: 0, lastY: 0, offY: 0, offX: 0, velY: 0, velX: 0 }
  });
  const timeRef = useRef(0);

  const dotRGB = hexToRGB(dotColor, [52, 211, 153]);
  cfgRef.current = {
    speed, autoPlay,
    threshold: .62 - (Math.max(20, Math.min(100, density)) - 20) / 80 * .32,
    dotScale: particleSize,
    showWireframe, showStars, showHotspots, showMarkers,
    enableDrag, enableParallax,
    dotColor: dotRGB,
    dotCore: mix(dotRGB, [255, 255, 255], .6),
    wireColor: hexToRGB(wireColor, [40, 122, 91]),
    markerColor: hexToRGB(markerColor, [215, 235, 225]),
    accentColor: hexToRGB(accentColor, [57, 149, 114]),
    hotColor: hexToRGB(hotColor, [16, 54, 37]),
    markers: (markers && markers.length ? markers : DEFAULT_MARKERS).map((m: any) => ({
      name: (m.name || "").toUpperCase(),
      sub: fmtLL(m.latitude ?? 0, m.longitude ?? 0),
      p: ll(m.latitude ?? 0, m.longitude ?? 0),
      accent: !!m.accent
    }))
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // OPTIMIZATION: Capped DPR to 1.25 max for significant fill-rate improvement
    const DPRof = () => Math.min(window.devicePixelRatio || 1, 1.25);
    const itx = itxRef.current;
    
    const onMove = (e: PointerEvent) => {
      if (!cfgRef.current?.enableParallax) return;
      const rect = canvas.getBoundingClientRect();
      const DPR = DPRof();
      itx.mouse.tx = (e.clientX - rect.left) * DPR;
      itx.mouse.ty = (e.clientY - rect.top) * DPR;
    };
    const onLeave = () => { itx.mouse.tx = -1e6; itx.mouse.ty = -1e6; };
    const onDown = (e: PointerEvent) => {
      if (!cfgRef.current?.enableDrag) return;
      itx.drag.on = true;
      itx.drag.lastX = e.clientX;
      itx.drag.lastY = e.clientY;
      itx.drag.velY = 0;
      itx.drag.velX = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onDrag = (e: PointerEvent) => {
      const d = itx.drag;
      if (!d.on) return;
      const dx = e.clientX - d.lastX, dy = e.clientY - d.lastY;
      d.lastX = e.clientX; d.lastY = e.clientY;
      const s = 1 / (Math.min(canvas.clientWidth, canvas.clientHeight) * .4);
      d.offY += dx * s * 2.2;
      d.offX = Math.max(-1, Math.min(1, d.offX - dy * s * 2.2));
      d.velY = dx * s * 2.2;
      d.velX = -dy * s * 2.2;
    };
    const endDrag = () => { itx.drag.on = false; };
    
    canvas.addEventListener("pointermove", onMove as any);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown as any);
    canvas.addEventListener("pointermove", onDrag as any);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    
    return () => {
      canvas.removeEventListener("pointermove", onMove as any);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown as any);
      canvas.removeEventListener("pointermove", onDrag as any);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const syncSize = () => {
      // OPTIMIZATION: Capped DPR to 1.25 max for significant fill-rate improvement
      const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(1, Math.round(wrap.clientWidth * DPR));
      const h = Math.max(1, Math.round(wrap.clientHeight * DPR));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      return DPR;
    };

    let raf = 0;
    let running = false;
    let last: number | null = null;
    
    const frame = (now: number) => {
      const cfg = cfgRef.current;
      const DPR = syncSize();
      if (last == null) last = now;
      if (cfg.autoPlay) timeRef.current = (timeRef.current + (now - last) / 1e3 * cfg.speed) % DUR;
      last = now;
      draw(ctx, timeRef.current, cfg, itxRef.current, canvas.width, canvas.height, DPR);
      raf = requestAnimationFrame(frame);
    };
    
    const start = () => {
      if (running) return;
      running = true;
      last = null;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      itxRef.current.drag.velX = 0;
      itxRef.current.drag.velY = 0;
    };

    const seed = requestAnimationFrame(() => {
      if (running) return;
      const DPR = syncSize();
      draw(ctx, timeRef.current, cfgRef.current, itxRef.current, canvas.width, canvas.height, DPR);
    });

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) start();
        else stop();
      });
      io.observe(wrap);
    } else {
      start();
    }
    
    return () => {
      cancelAnimationFrame(seed);
      stop();
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "absolute", top: 0, left: 0, overflow: "hidden", borderRadius: cornerRadius, width: "100%", height: "100%", ...style }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", cursor: enableDrag ? "grab" : "default" }} />
    </div>
  );
}
