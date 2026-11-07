/**
 * Responsive: a laptop open on its deck, a phone standing beside it and a
 * potted plant. The laptop's screen holds a browser window; the pointer's
 * place across the screen sets the window's edges, centred on the screen, so its width, on a
 * spring. Below 768px the page reflows: the image card drops under the
 * headline and the buttons stack, each on a 700ms tween staggered outwards
 * from the item nearest the pointer. At the narrow end the laptop's page is
 * the phone's. The slider is the narrowest width the pointer can reach, in px.
 *
 * The pattern: a continuous width (a spring) that triggers a discrete reflow
 * (tweens, a stagger by distance). The hit test solves the pointer onto the
 * screen's resting plane, which never moves, never onto the window.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad, ringAt, rings, rrect, run, seg,
  spring, stepS, tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const F = 3, TK = 1.2, STEP = 45, BP = 768, FULL = 1440, REST_PX = 1280;
const UC = 50, VT = 60.5, VB = 9.5, WMAX = 85, CT = VT - 4.5; // the window: centre, top, bottom, widest; the page's top
const S0 = [5.5, 7.5, 94.5, 62.5]; // the screen, inside the bezel
const PX = 114, PW = 26, PH = 54, FP = 30, PTK = 2.2; // the phone
const POT = [-14, 52], PHT = 17;
const LEAVES = [[-50, 25, 0.6], [-24, 32, -0.6], [-4, 37, -1.6], [18, 31, -0.4], [42, 24, 0.9]]; // lean, length, depth
const px = (w) => Math.round((w / WMAX) * FULL), wOf = (p) => (p / FULL) * WMAX;

/** The page at width ww, each item blended from side by side (0) to stacked (1): [u0, d0, u1, d1], d down from the top. */
function layout(ww, ms) {
  const pad = clamp(ww * 0.07, 2, 4.5), cw = ww - 2 * pad, tw = cw * 0.56, kw = cw * 0.38, bw = Math.min(tw * 0.44, 15);
  const ch = Math.min(kw * 1.12, 30), c2 = Math.min(cw * 0.62, 12);
  const wide = [[pad, 3, pad + tw * 0.95, 6.8], [pad, 8.4, pad + tw * 0.68, 12.2], [pad, 14.2, pad + tw * 0.8, 15.4], [pad, 17, pad + tw * 0.55, 18.2],
    [pad, 21.5, pad + bw, 25.5], [pad + bw + 1.6, 21.5, pad + 2 * bw + 1.6, 25.5], [pad + cw - kw, 3, pad + cw, 3 + ch]];
  const stack = [[pad, 3, pad + cw * 0.95, 6.8], [pad, 8.4, pad + cw * 0.7, 12.2], [pad, 14.2, pad + cw * 0.85, 15.4], [pad, 17, pad + cw * 0.6, 18.2],
    [pad, 23.5 + c2, pad + cw, 27.5 + c2], [pad, 29 + c2, pad + cw, 33 + c2], [pad, 21, pad + cw, 21 + c2]];
  return wide.map((r, i) => r.map((x, k) => lerp(x, stack[i][k], ms[i])));
}

/** The page's paths on a plane `at`, its left edge at u0 and its top at v = top: six items, the button labels, the card's sun and hill. */
function page(at, u0, top, R) {
  const box = (u, v, U, V, r) => poly(rrect(u, v, U, V, r, 3).map((q) => at(q.u, q.v)));
  const item = (a) => box(u0 + a[0], top - a[3], u0 + a[2], top - a[1], Math.min(1.8, (a[3] - a[1]) / 2));
  const label = (a) => { const c = u0 + (a[0] + a[2]) / 2, h = Math.min(5, (a[2] - a[0]) * 0.36), m = top - (a[1] + a[3]) / 2; return box(c - h, m - 0.5, c + h, m + 0.5, 0.5); };
  const k = R[6], w = k[2] - k[0], h = k[3] - k[1], s = Math.min(w, h) * 0.12, sx = u0 + k[2] - w * 0.27, sy = top - k[1] - h * 0.3;
  const hill = [];
  for (let t = 0; t <= 1.001; t += 0.1) hill.push(at(u0 + k[0] + t * w, top - k[3] + h * (0.05 + 0.3 * Math.sin(Math.PI * Math.min(1, t * 1.3)))));
  return { items: R.map(item), labels: label(R[4]) + label(R[5]), art: poly(circ(s, 14).map((q) => at(sx + q.u, sy + q.v))) + open(hill) };
}

/** Leaf i's outline in world points: a lens in the plane that faces the viewer, leaning `a` degrees from upright. */
function leaf([a, L, dep]) {
  const s = Math.sin(rad(a)), c = Math.cos(rad(a)), e = Math.SQRT1_2;
  const bx = POT[0] + dep * e, by = POT[1] + dep * e, side = [], back = [];
  for (let t = 0; t <= 1.001; t += 0.1) {
    const w = L * 0.16 * Math.pow(Math.sin(Math.PI * t), 0.8), x = bx + s * e * L * t, y = by - s * e * L * t, z = PHT - 1.5 + c * L * t;
    side.push([x + c * e * w, y - c * e * w, z - s * w]); back.unshift([x - c * e * w, y + c * e * w, z + s * w]);
  }
  return { pts: side.concat(back), rib: [[bx, by, PHT - 1.5], [bx + s * e * L * 0.8, by - s * e * L * 0.8, PHT - 1.5 + c * L * 0.8]], dep };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wmin = wOf(value), lastU = null, mode = 0, from = 6;

  const leaves = LEAVES.map(leaf).sort((a, b) => a.dep - b.dep);
  const C = Cam(45, 0.5, 2);
  fit(C, [[0, -1, 0], [100, 56, 0], [0, 56, 0], [100, -1, 0], [2, F, 66], [98, F, 66], [PX, FP, 0], [PX + PW, FP, PH], [PX + PW, FP, 0]]
    .concat(...leaves.map((l) => l.pts)), 200, 166);
  const P = proj(C), front = facing(C);
  const Bw = (u, v, d = 0) => P(u, F + d, v), Ph = (u, v, d = 0) => P(u, FP + d, v);
  const g = mk("g", {}, svg);
  const flat = (ring, at, cls, d) => mk("path", { d: poly(ring.map((q) => at(q.u, q.v, d))), class: cls }, g);
  // print hints: a dithered print of this figure reads data-tone; the line drawing ignores it
  const tone = (el, k) => (el.setAttribute("data-tone", k), el);

  // ground shadows, fill only in the plate colour: invisible here, a dot field in print
  const shadow = (ring, dx) => tone(mk("path", { d: poly(ring.map((q) => P(q.u + dx, q.v + dx, 0))), class: "fo" }, g), "shadow");
  shadow(rrect(0, -1, 100, 56, 5, 4), 5); shadow(rrect(PX - 2, FP - 3, PX + PW + 2, FP + 4, 3, 4), 4);

  // the plant: a pot that widens to its rim, then the leaves, back to front
  const ring = (r) => rrect(POT[0] - r, POT[1] - r, POT[0] + r, POT[1] + r, r, 4);
  shadow(ring(10), 4);
  const pot = solid(g);
  put(pot, { sil: poly(hull(ringAt(P, ring(7.5), 0).concat(ringAt(P, ring(10), PHT)))), crease: poly(ringAt(P, ring(8.6), PHT)) });
  tone(pot.sil, "pot");
  mk("path", { d: open(ringAt(P, run(ring(9.6), front), PHT - 3.5)), class: "nf lo" }, g);
  for (const l of leaves) {
    tone(mk("path", { d: poly(l.pts.map((p) => P(...p))), class: "sil" }, g), "leaf");
    mk("path", { d: seg(P(...l.rib[0]), P(...l.rib[1])), class: "nf lo" }, g);
  }

  // the laptop: the deck with its keys and trackpad, then the lid standing at its back edge
  const [dr, di] = rings(0, -1, 100, 56, 5, 1.6);
  put(solid(g), prism(P, front, dr, di, 0, 3.5));
  for (let r = 0; r < 3; r++) for (let c = 0; c < 12; c++) place(flatDot(g, C, 0.7, "dot off"), P(21.4 + c * 5.2, 11 + r * 5, 3.5));
  tone(mk("path", { d: poly(rrect(40, 32, 60, 47, 2.5, 4).map((q) => P(q.u, q.v, 3.5))), class: "nf lo" }, g), "pad");
  const lid = rrect(2, 4, 98, 66, 4, 5);
  flat(lid, Bw, "lo", -TK); tone(flat(lid, Bw, "sil", 0), "bezel"); tone(flat(rrect(...S0, 2, 4), Bw, "nf lo", 0), "glass");

  // the browser window: its plate, title bar and dots, a drag grip on each edge, then the page
  const win = tone(mk("path", { class: "sil" }, g), "paper"), bar = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "nf lo" }, g);
  const dots = [0, 1, 2].map(() => mk("circle", { r: 0.8, class: "dot off" }, g));
  const CLS = ["nf", "nf", "nf lo", "nf lo", "nf hi", "nf lo", ""], TONE = ["ink", "ink", "soft", "soft", "accent", "", "card"];
  const items = (cls) => cls.map((c, i) => (TONE[i] ? tone(mk("path", { class: c }, g), TONE[i]) : mk("path", { class: c }, g)));
  const els = items(CLS), labels = tone(mk("path", { class: "nf lo" }, g), "paper"), art = tone(mk("path", { class: "nf lo" }, g), "art");
  els[6].after(art); els[5].after(labels);

  // the phone, standing to the right, already showing the stacked page
  const pr = rrect(PX, 0, PX + PW, PH, 4, 5);
  flat(pr, Ph, "lo", -PTK); tone(flat(pr, Ph, "sil", 0), "bezel"); tone(flat(rrect(PX + 1.8, 1.8, PX + PW - 1.8, PH - 1.8, 2.5, 4), Ph, "nf lo", 0), "paper");
  flat(rrect(PX + PW / 2 - 3, PH - 3.6, PX + PW / 2 + 3, PH - 2.6, 0.5, 3), Ph, "nf lo", 0);
  const ph = page(Ph, PX + 1.8, PH - 5, layout(PW - 3.6, CLS.map(() => 1)));
  items(CLS.map((c) => (c === "nf hi" ? "nf" : c))).forEach((el, i) => el.setAttribute("d", ph.items[i]));
  tone(mk("path", { d: ph.labels, class: "nf lo" }, g), "paper"); tone(mk("path", { d: ph.art, class: "nf lo" }, g), "art");

  const ws = spring(wOf(REST_PX)), tws = CLS.map(() => tween(0));
  let drawn = "";
  function draw(now) {
    const ww = ws.x, ms = tws.map((t) => tval(t, now)), key = ww.toFixed(3) + ms.join();
    if (key === drawn) return;
    drawn = key;
    const L = UC - ww / 2, R = UC + ww / 2, m = (VT + VB) / 2, on = (r) => poly(r.map((q) => Bw(q.u, q.v)));
    win.setAttribute("d", on(rrect(L, VB, R, VT, 2.5, 4)));
    bar.setAttribute("d", seg(Bw(L, VT - 4), Bw(R, VT - 4)));
    dots.forEach((el, k) => place(el, Bw(L + 2.4 + k * 2.4, VT - 2)));
    grip.setAttribute("d", on(rrect(R + 0.7, m - 4, R + 1.7, m + 4, 0.5, 3)) + on(rrect(L - 1.7, m - 4, L - 0.7, m + 4, 0.5, 3)));
    const pg = page(Bw, L, CT, layout(ww, ms));
    els.forEach((el, i) => el.setAttribute("d", pg.items[i]));
    labels.setAttribute("d", pg.labels); art.setAttribute("d", pg.art);
  }

  const B = register(stage, (dt, now) => {
    let moving = stepS(ws, dt);
    for (const t of tws) if (!tdone(t, now)) moving = true;
    draw(now);
    return moving;
  });
  bag.add(B.unregister);

  // the hit plane: the laptop's screen at rest. It never moves, and nothing draws it.
  const o = Bw(0, 0), a = Bw(1, 0), b = Bw(0, 1), A = [a[0] - o[0], a[1] - o[1]], Bv = [b[0] - o[0], b[1] - o[1]], det = A[0] * Bv[1] - A[1] * Bv[0];
  const onScreen = ([x, y]) => { const qx = x - o[0], qy = y - o[1]; return [(qx * Bv[1] - qy * Bv[0]) / det, (A[0] * qy - A[1] * qx) / det]; };

  /** Sets the window's target width from the pointer's u on the screen (null at rest); reflows when it crosses 768px. */
  function aim(u, v) {
    const now = performance.now(), on = u !== null;
    ws.t = on ? clamp(2 * Math.abs(u - UC), wmin, WMAX) : wOf(REST_PX);
    const want = px(ws.t) < BP ? 1 : 0;
    if (want !== mode) {
      if (on) {
        // the item nearest the pointer, in the layout it is leaving: the reflow spreads out from it
        const D = layout(ws.t, tws.map((t) => t.to)).map((r) => Math.hypot((r[0] + r[2]) / 2 - (u - UC + ws.t / 2), (r[1] + r[3]) / 2 - (CT - v)));
        from = D.indexOf(Math.min(...D));
      }
      mode = want;
      tws.forEach((t, i) => tset(t, mode, now, Math.abs(i - from) * STEP));
    }
    win.classList.toggle("hi", on); grip.classList.toggle("hi", on); els[4].classList.toggle("hi", !on);
    read.textContent = on ? String(px(ws.t)) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [u, v] = onScreen(p);
      if (u > S0[0] && u < S0[2] + 3 && v > S0[1] && v < S0[3]) { lastU = [u, v]; aim(u, v); } else { lastU = null; aim(null, 0); }
    },
    leave: () => { lastU = null; aim(null, 0); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { wmin = wOf(v); if (lastU) aim(...lastU); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "responsive",
  means: "A laptop beside a phone: move across the screen to resize the browser, and below 768px its page reflows into the phone's.",
  rules: [1, 2, 5, 8],
  range: [600, 390, 320],
  tour: [[312, 162], [219, 115], [255, 133], null],
  mount,
});
