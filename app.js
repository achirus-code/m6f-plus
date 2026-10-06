(() => {
  "use strict";
  const D = window.M6F_DATA;
  const N = D.days.length;
  const STEP = D.step || 1; // days between two values (weekly)
  const L = window.I18N, t = L.t;
  const eur = { format: (v) => new Intl.NumberFormat(L.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) };
  const num = (v, d = 1) => new Intl.NumberFormat(L.locale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const pct = (v, d = 0) => (v > 0 ? "+" : v < 0 ? "−" : "") + num(Math.abs(v), d) + " %";
  const mult = (v) => num(v, v < 10 ? 2 : 1) + "x";
  const dateDe = (s) => { const [y, m, d] = s.split("-"); return L.lang === "de" ? `${d}.${m}.${y}` : `${d}/${m}/${y}`; };
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const state = { market: "eth", start: 0, amount: 10000, log: false, horizon: 365 };

  // ---------- data -------------------------------------------------------------------------------------------
  /** Value of 1 € invested at day s, for every day t ≥ s – per strategy ("bot" | "hold"). */
  function growth(kind, s) {
    const out = new Float64Array(N - s);
    if (state.market === "mix") {
      const e = D["eth_" + kind], b = D["btc_" + kind];
      for (let t = s; t < N; t++) out[t - s] = 0.6 * e[t] / e[s] + 0.4 * b[t] / b[s];
    } else {
      const a = D[state.market + "_" + kind];
      for (let t = s; t < N; t++) out[t - s] = a[t] / a[s];
    }
    return out;
  }
  function ratioAt(kind, s, t) {
    if (state.market === "mix") {
      const e = D["eth_" + kind], b = D["btc_" + kind];
      return 0.6 * e[t] / e[s] + 0.4 * b[t] / b[s];
    }
    const a = D[state.market + "_" + kind];
    return a[t] / a[s];
  }
  function drawdowns(v) {
    let peak = -Infinity; const out = new Float64Array(v.length);
    for (let i = 0; i < v.length; i++) { peak = Math.max(peak, v[i]); out[i] = (v[i] / peak - 1) * 100; }
    return out;
  }
  const minOf = (a) => a.reduce((m, x) => Math.min(m, x), Infinity);

  // ---------- chart ------------------------------------------------------------------------------------------
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  };
  function niceStep(range, count) {
    const raw = range / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }
  function yTicks(lo, hi, log) {
    if (log) {
      const t = [];
      for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++)
        for (const m of [1, 2, 5]) { const v = m * Math.pow(10, e); if (v >= lo && v <= hi) t.push(v); }
      return t.length >= 2 ? t : [lo, hi];
    }
    const step = niceStep(hi - lo || 1, 5), t = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) t.push(Math.abs(v) < 1e-9 ? 0 : v);
    return t;
  }
  function xTicks(days, narrow) {
    const span = days.length;
    const out = [];
    const spanDays = span * STEP;
    days.forEach((d, i) => {
      const [y, m] = d.split("-"), prev = i ? days[i - 1] : null;
      const newMonth = prev && prev.slice(0, 7) !== d.slice(0, 7);
      if (!newMonth) return;
      if (spanDays > 540 ? m === "01" : spanDays > 200 ? ["01", "04", "07", "10"].includes(m) : true)
        out.push([i, spanDays > 540 ? (narrow ? "’" + y.slice(2) : y) : `${m}/${y.slice(2)}`]);
    });
    return out;
  }

  /** Line chart: series [{name, color, values}], days, fmt (value → text), options {log, zero, area}. */
  function lineChart(host, days, series, fmt, opts = {}) {
    host.innerHTML = "";
    const W = host.clientWidth, H = host.clientHeight;
    if (W < 80) return;
    const m = { l: W < 480 ? 46 : 64, r: 8, t: 10, b: 24 };
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opts.label || "" }, host);
    let lo = Infinity, hi = -Infinity;
    for (const s of series) for (const v of s.values) { if (v < lo) lo = v; if (v > hi) hi = v; }
    if (opts.zero) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    if (opts.log) { lo = Math.max(lo, 1e-9); }
    const pad = opts.log ? 1.08 : (hi - lo) * 0.06 || 1;
    if (opts.log) { lo /= pad; hi *= pad; } else { hi += pad; if (!opts.zero || lo < 0) lo -= opts.zero && lo === 0 ? 0 : pad; }
    const x = (i) => m.l + (W - m.l - m.r) * (days.length > 1 ? i / (days.length - 1) : 0);
    const y = opts.log
      ? (v) => m.t + (H - m.t - m.b) * (1 - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)))
      : (v) => m.t + (H - m.t - m.b) * (1 - (v - lo) / (hi - lo));
    const axis = el("g", { class: "axis" }, svg);
    for (const t of yTicks(lo, hi, opts.log)) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: t === 0 && opts.zero ? "zero" : "gridline" }, axis);
      el("text", { x: m.l - 8, y: y(t) + 4, "text-anchor": "end" }, axis).textContent = (opts.tick || fmt)(t);
    }
    for (const [i, label] of xTicks(days, W < 480)) {
      el("text", { x: x(i), y: H - 6, "text-anchor": "middle" }, axis).textContent = label;
    }
    for (const s of series) {
      let d = "";
      s.values.forEach((v, i) => { d += (i ? "L" : "M") + x(i).toFixed(1) + "," + y(opts.log ? Math.max(v, lo) : v).toFixed(1); });
      el("path", { d, fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
    }
    // hover layer
    const cross = el("line", { class: "crosshair", y1: m.t, y2: H - m.b, visibility: "hidden" }, svg);
    const dots = series.map((s) => el("circle", { r: 4.5, fill: s.color, stroke: css("--surface"), "stroke-width": 2, visibility: "hidden" }, svg));
    const hit = el("rect", { x: m.l, y: 0, width: W - m.l - m.r, height: H, fill: "transparent" }, svg);
    const tip = document.getElementById("tip");
    const move = (ev) => {
      const r = svg.getBoundingClientRect();
      const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const i = Math.max(0, Math.min(days.length - 1, Math.round(((px - m.l) / (W - m.l - m.r)) * (days.length - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("visibility", "visible");
      series.forEach((s, k) => { dots[k].setAttribute("cx", x(i)); dots[k].setAttribute("cy", y(opts.log ? Math.max(s.values[i], lo) : s.values[i])); dots[k].setAttribute("visibility", "visible"); });
      tip.innerHTML = `<div class="t-date">${opts.dateLabel ? opts.dateLabel(i) : dateDe(days[i])}</div>` +
        series.map((s) => `<div class="row"><span><span class="sw" style="background:${s.color}"></span>${s.name}</span><b>${fmt(s.values[i])}</b></div>`).join("") +
        (opts.extra ? opts.extra(i) : "");
      tip.hidden = false;
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX, cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      tip.style.left = Math.min(window.innerWidth - tw - 8, cx + 14) + "px";
      tip.style.top = Math.max(8, cy - th - 12) + "px";
    };
    const leave = () => { tip.hidden = true; cross.setAttribute("visibility", "hidden"); dots.forEach((d) => d.setAttribute("visibility", "hidden")); };
    hit.addEventListener("mousemove", move); hit.addEventListener("touchmove", move, { passive: true });
    hit.addEventListener("touchstart", move, { passive: true });
    hit.addEventListener("mouseleave", leave); hit.addEventListener("touchend", leave);
  }

  /** Grouped bars per label: groups [{label, values:[a, b]}], colors [c1, c2], names. */
  function barChart(host, groups, colors, names, fmt) {
    host.innerHTML = "";
    const W = host.clientWidth, H = host.clientHeight;
    if (W < 80) return;
    const m = { l: W < 480 ? 44 : 56, r: 4, t: 10, b: 24 };
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("aria.years") }, host);
    let lo = 0, hi = 0;
    for (const g of groups) for (const v of g.values) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    const span = hi - lo || 1; hi += span * 0.06; lo -= lo < 0 ? span * 0.06 : 0;
    const y = (v) => m.t + (H - m.t - m.b) * (1 - (v - lo) / (hi - lo));
    const axis = el("g", { class: "axis" }, svg);
    for (const t of yTicks(lo, hi, false)) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), class: t === 0 ? "zero" : "gridline" }, axis);
      el("text", { x: m.l - 8, y: y(t) + 4, "text-anchor": "end" }, axis).textContent = pct(t);
    }
    const slot = (W - m.l - m.r) / groups.length;
    const bw = Math.min(28, (slot - 14) / 2);
    const tip = document.getElementById("tip");
    groups.forEach((g, gi) => {
      const cx = m.l + slot * (gi + 0.5);
      el("text", { x: cx, y: H - 6, "text-anchor": "middle" }, axis).textContent = slot < 46 ? "’" + g.label.slice(2) : g.label;
      g.values.forEach((v, k) => {
        const x0 = cx - bw - 1 + k * (bw + 2), y0 = y(Math.max(v, 0)), y1 = y(Math.min(v, 0));
        const h = Math.max(1, y1 - y0), r = Math.min(4, h / 2, bw / 2);
        // rounded at the data end, square at the baseline
        const d = v >= 0
          ? `M${x0},${y1}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${y1}Z`
          : `M${x0},${y0}V${y1 - r}Q${x0},${y1} ${x0 + r},${y1}H${x0 + bw - r}Q${x0 + bw},${y1} ${x0 + bw},${y1 - r}V${y0}Z`;
        el("path", { d, fill: colors[k] }, svg);
      });
      const hit = el("rect", { x: cx - slot / 2, y: 0, width: slot, height: H, fill: "transparent" }, svg);
      hit.addEventListener("mousemove", (ev) => {
        tip.innerHTML = `<div class="t-date">${g.full || g.label}</div>` + g.values.map((v, k) =>
          `<div class="row"><span><span class="sw" style="background:${colors[k]}"></span>${names[k]}</span><b>${fmt(v)}</b></div>`).join("");
        tip.hidden = false;
        tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 8, ev.clientX + 14) + "px";
        tip.style.top = Math.max(8, ev.clientY - tip.offsetHeight - 12) + "px";
      });
      hit.addEventListener("mouseleave", () => { tip.hidden = true; });
    });
  }

  // ---------- views ------------------------------------------------------------------------------------------
  function tile(label, big, sub, color) {
    return `<div class="tile"><div class="label">${color ? `<span class="dot" style="background:${color}"></span>` : ""}${label}</div>` +
      `<div class="big">${big}</div><div class="sub">${sub}</div></div>`;
  }

  function render() {
    const s = state.start, days = D.days.slice(s);
    const bot = growth("bot", s), hold = growth("hold", s);
    const a = state.amount, c1 = css("--s1"), c2 = css("--s2");
    const years = (days.length - 1) * STEP / 365.25;
    const cagr = (g) => years > 0.5 ? pct((Math.pow(g, 1 / years) - 1) * 100, 1) + " " + t("perYear") : "";
    const ddB = drawdowns(bot), ddH = drawdowns(hold);
    const endB = bot[bot.length - 1], endH = hold[hold.length - 1];
    document.getElementById("tiles").innerHTML =
      tile(t("tile.bot"), eur.format(a * endB), `${pct((endB - 1) * 100)} · ${mult(endB)} ${cagr(endB) ? "· " + cagr(endB) : ""}`, c1) +
      tile(t("tile.hold"), eur.format(a * endH), `${pct((endH - 1) * 100)} · ${mult(endH)} ${cagr(endH) ? "· " + cagr(endH) : ""}`, c2) +
      tile(t("tile.diff"), (endB >= endH ? "+" : "−") + eur.format(Math.abs(a * (endB - endH))).replace("-", ""),
        t("tile.diffSub", { date: dateDe(days[0]) })) +
      tile(t("tile.dd"), `${pct(minOf(ddB))}`, t("tile.ddSub", { v: pct(minOf(ddH)) }), c1);

    lineChart(document.getElementById("equity"), days,
      [{ name: "M6F+", color: c1, values: Array.from(bot, (v) => v * a) }, { name: t("hold"), color: c2, values: Array.from(hold, (v) => v * a) }],
      (v) => eur.format(v), {
        log: state.log, label: t("aria.equity"),
        tick: (v) => v >= 1e6 ? num(v / 1e6, 1) + " " + t("million") : v >= 1e4 ? num(v / 1e3, 0) + " " + t("thousand") : eur.format(v),
        extra: (i) => `<div class="row"><span>${t("diff")}</span><b>${(bot[i] >= hold[i] ? "+" : "−") + eur.format(Math.abs(a * (bot[i] - hold[i])))}</b></div>`,
      });
    lineChart(document.getElementById("drawdown"), days,
      [{ name: "M6F+", color: c1, values: Array.from(ddB) }, { name: t("hold"), color: c2, values: Array.from(ddH) }],
      (v) => pct(v), { zero: true, label: t("aria.dd") });

    // calendar years within the range
    const groups = [], rows = [];
    let i0 = 0;
    for (let i = 1; i <= days.length; i++) {
      if (i === days.length || days[i].slice(0, 4) !== days[i0].slice(0, 4)) {
        const y = days[i0].slice(0, 4), i1 = i - 1;
        // a full year starts in its first week and ends in its last one (weekly values)
        const partial = days[i0].slice(5) > "01-07" || days[i1].slice(5) < "12-25";
        const base0 = i0 === 0 ? 1 : bot[i0 - 1], baseH = i0 === 0 ? 1 : hold[i0 - 1];
        const rb = (bot[i1] / base0 - 1) * 100, rh = (hold[i1] / baseH - 1) * 100;
        const label = y + (partial ? "*" : "");
        groups.push({ label, full: partial ? `${dateDe(days[i0])} – ${dateDe(days[i1])}` : y, values: [rb, rh] });
        rows.push(`<tr><td>${label}</td><td class="${rb >= 0 ? "pos" : "neg"}">${pct(rb)}</td><td class="${rh >= 0 ? "pos" : "neg"}">${pct(rh)}</td></tr>`);
        i0 = i;
      }
    }
    barChart(document.getElementById("years"), groups, [c1, c2], ["M6F+", t("hold")], (v) => pct(v));
    document.getElementById("years-table").innerHTML =
      `<table><thead><tr><th>${t("year")}</th><th>M6F+</th><th>${t("hold")}</th></tr></thead><tbody>${rows.join("")}</tbody></table>` +
      `<p class="note">${t("partial")}</p>`;
    renderStarts();
  }

  function renderStarts() {
    const H = Math.round(state.horizon / STEP), c1 = css("--s1"), c2 = css("--s2");
    const n = N - H;
    const rb = new Float64Array(n), rh = new Float64Array(n);
    for (let s = 0; s < n; s++) { rb[s] = (ratioAt("bot", s, s + H) - 1) * 100; rh[s] = (ratioAt("hold", s, s + H) - 1) * 100; }
    const sorted = (a) => Array.from(a).sort((x, y) => x - y);
    const q = (arr, p) => arr[Math.min(arr.length - 1, Math.floor(p * (arr.length - 1)))];
    const sb = sorted(rb), sh = sorted(rh);
    const share = (a) => Array.from(a).filter((v) => v > 0).length / a.length * 100;
    let better = 0; for (let s = 0; s < n; s++) if (rb[s] > rh[s]) better++;
    const label = t("after" + state.horizon);
    document.getElementById("starts-note").textContent =
      t("starts.note", { n: num(n, 0), date: dateDe(D.days[0]), after: label });
    const box = (name, color, s, arr) => tile(name, t("inPlus", { v: num(share(arr), 0) }),
      t("startsSub", { med: pct(q(s, 0.5)), p10: pct(q(s, 0.1)), worst: pct(s[0]), best: pct(s[s.length - 1]) }), color);
    document.getElementById("starts").innerHTML = box("M6F+", c1, sb, rb) + box(t("hold"), c2, sh, rh) +
      tile(t("better"), `${num(better / n * 100, 0)} %`, t("ofStarts"), null);
    lineChart(document.getElementById("dist"), D.days.slice(0, n),
      [{ name: "M6F+", color: c1, values: Array.from(rb) }, { name: t("hold"), color: c2, values: Array.from(rh) }],
      (v) => pct(v), { zero: true, label: t("aria.starts"), dateLabel: (i) => t("startTo", { a: dateDe(D.days[i]), b: dateDe(D.days[i + H]) }) });
  }


  // ---------- the duel: the headline comparisons as big bars, since a chosen year ---------------------------------
  const sinceYears = ["2020", "2021", "2022", "2023", "2024", "2025"];
  let since = "2020";
  function maxDD(arr, s0) {
    let peak = -Infinity, m = 0;
    for (let i = s0; i < N; i++) { peak = Math.max(peak, arr[i]); m = Math.min(m, arr[i] / peak - 1); }
    return -m * 100;
  }
  function renderDuel() {
    const s0 = Math.max(0, D.days.findIndex((d) => d >= since + "-01-01"));
    const loc = (v, d) => num(v, d);
    const x = (k) => D[k][N - 1] / D[k][s0];
    const yr = Math.round(365 / STEP);
    let plusB = 0, plusH = 0, n = 0;
    for (let i = s0; i + yr < N; i++, n++) { if (D.eth_bot[i + yr] > D.eth_bot[i]) plusB++; if (D.eth_hold[i + yr] > D.eth_hold[i]) plusH++; }
    const mult = (a, b) => a >= b ? t("duel.more", { x: loc(a / b, 1) }) : t("duel.behind");
    const lessDD = (a, b) => a <= b ? t("duel.less", { x: loc((1 - a / b) * 100, 0) }) : t("duel.behind");
    const rows = [
      { k: "duel.ethx", a: x("eth_bot"), b: x("eth_hold"), fmt: (v) => loc(v, v < 10 ? 2 : 1) + "x", adv: mult(x("eth_bot"), x("eth_hold")) },
      { k: "duel.btcx", a: x("btc_bot"), b: x("btc_hold"), fmt: (v) => loc(v, v < 10 ? 2 : 1) + "x", adv: mult(x("btc_bot"), x("btc_hold")) },
      { k: "duel.ddeth", a: maxDD(D.eth_bot, s0), b: maxDD(D.eth_hold, s0), fmt: (v) => "−" + loc(v, 0) + " %", loss: true },
      { k: "duel.ddbtc", a: maxDD(D.btc_bot, s0), b: maxDD(D.btc_hold, s0), fmt: (v) => "−" + loc(v, 0) + " %", loss: true },
    ];
    rows[2].adv = lessDD(rows[2].a, rows[2].b); rows[3].adv = lessDD(rows[3].a, rows[3].b);
    if (n >= 4) {
      const pb = plusB / n * 100, ph = plusH / n * 100;
      rows.push({ k: "duel.plus1", a: pb, b: ph, fmt: (v) => loc(v, 0) + " %", adv: pb >= ph ? t("duel.often", { x: loc(pb - ph, 0) }) : t("duel.behind") });
    }
    document.getElementById("duel").innerHTML = rows.map((r) => {
      const max = Math.max(r.a, r.b) || 1;
      const win = r.loss ? r.a <= r.b : r.a >= r.b;
      // drawdowns: what is left of the peak, the better side filled, the gap shown as loss
      const wa = r.loss ? 100 : (r.a / max) * 100;
      const wb = r.loss ? Math.max(4, (100 - r.b) / Math.max(100 - r.a, 1) * 100) : (r.b / max) * 100;
      return `<div class="duel-row">
        <div class="duel-label">${t(r.k)} <span class="since">${t("since", { y: since })}</span><span class="adv${win ? "" : " lag"}">${r.adv}</span></div>
        <div class="duel-bars">
          <div class="bar a" style="--w:${wa}%"><span>M6F+</span><b>${r.fmt(r.a)}</b></div>
          <div class="bar b${r.loss ? " loss" : ""}" style="--w:${wb}%"><span>${t("hold")}</span><b>${r.fmt(r.b)}</b></div>
        </div>
      </div>`;
    }).join("");
    // the custom select
    const box = document.getElementById("since");
    box.querySelector(".cselect-val").textContent = t("since", { y: since });
    box.querySelector(".cselect-list").innerHTML = sinceYears.map((y) =>
      `<li role="option" tabindex="-1" data-v="${y}" aria-selected="${y === since}">${t("since", { y })}</li>`).join("");
  }
  (function cselect() {
    const box = document.getElementById("since"), btn = box.querySelector(".cselect-btn"), list = box.querySelector(".cselect-list");
    const open = (on) => { list.hidden = !on; btn.setAttribute("aria-expanded", String(on)); if (on) list.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true }); };
    btn.addEventListener("click", () => open(list.hidden));
    list.addEventListener("click", (ev) => { const li = ev.target.closest("li"); if (!li) return; since = li.dataset.v; open(false); btn.focus(); renderDuel(); });
    list.addEventListener("keydown", (ev) => {
      const items = [...list.children], i = items.indexOf(document.activeElement);
      if (ev.key === "ArrowDown") { ev.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus({ preventScroll: true }); }
      if (ev.key === "ArrowUp") { ev.preventDefault(); items[Math.max(0, i - 1)].focus({ preventScroll: true }); }
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); document.activeElement.click(); }
      if (ev.key === "Escape") { open(false); btn.focus(); }
    });
    document.addEventListener("click", (ev) => { if (!box.contains(ev.target)) open(false); });
  })();

  // ---------- controls ---------------------------------------------------------------------------------------
  function seg(id, onPick) {
    const g = document.getElementById(id);
    g.addEventListener("click", (ev) => {
      const b = ev.target.closest("button"); if (!b) return;
      g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      onPick(b.dataset.v);
    });
  }
  seg("market", (v) => { state.market = v; render(); });
  seg("lang", (v) => { L.set(v); renderDuel(); render(); });
  seg("scale", (v) => { state.log = v === "log"; render(); });
  seg("horizon", (v) => { state.horizon = +v; renderStarts(); });
  const start = document.getElementById("start");
  start.min = D.days[0]; start.max = D.days[N - 5]; start.value = D.days[0];
  start.addEventListener("change", () => {
    let i = D.days.indexOf(start.value);
    if (i < 0) i = D.days.findIndex((d) => d >= start.value);
    state.start = Math.max(0, Math.min(N - 5, i < 0 ? 0 : i));
    start.value = D.days[state.start];
    render();
  });
  const amount = document.getElementById("amount");
  amount.addEventListener("input", () => { const v = +amount.value; if (v >= 1) { state.amount = v; render(); } });
  // charts are drawn for their width: again whenever it changes (also when the page becomes visible)
  let timer, lastW = 0;
  new ResizeObserver(() => {
    const w = document.getElementById("equity").clientWidth;
    if (w > 0 && w !== lastW) { lastW = w; clearTimeout(timer); timer = setTimeout(render, 80); }
  }).observe(document.querySelector("main"));
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
  L.apply();
  renderDuel();
  render();
})();
