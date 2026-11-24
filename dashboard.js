/* dam-isp1-dashboard: page logic. Shows numbers computed in Python (data/*.json); it computes no rules. */
(() => {
'use strict';

// ---------- state ----------
const TABS = ['glance', 'reshuffle', 'thermal', 'borders', 'history'];
const VIEW = { glance: 'viewGlance', reshuffle: 'viewReshuffle', thermal: 'viewThermal', borders: 'viewBorders', history: 'viewHistory' };
const TABBTN = { glance: 'tabBtnGlance', reshuffle: 'tabBtnReshuffle', thermal: 'tabBtnThermal', borders: 'tabBtnBorders', history: 'tabBtnHistory' };
// data colours: technologies as in the live dashboard; exports red, imports yellow (hub rule)
const COL = { lignite: '#b06a4b', gas: '#d18b57', hydro: '#5b9bd5', res: '#70ad47', surplus: '#fdba74', exp: '#f43f5e', imp: '#facc15' };
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const LD = REDUCE ? { min: 120, pause: 200, fill: 200, ready: 200 } : { min: 650, pause: 350, fill: 350, ready: 650 };

let lang = 'en';
try { lang = localStorage.getItem('kp_lang') === 'el' ? 'el' : 'en'; } catch (e) { /* private mode */ }
const st = { open: {}, manifest: null, meta: null, months: {}, date: null, tab: 'glance', day: null, lastRefresh: 0, ready: false };
let modalMode = 'short', modalReturnFocus = null, modalOpen = false;

const T = () => I18N[lang];
const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- formatting ----------
const nfCache = {};
function nf(d) { const k = lang + d; return nfCache[k] || (nfCache[k] = new Intl.NumberFormat(T().locale, { minimumFractionDigits: d, maximumFractionDigits: d })); }
function fmt(x, d = 0) { return x == null || !isFinite(x) ? '–' : nf(d).format(x).replace('-', '−'); }
function fmtS(x, d = 0) { if (x == null || !isFinite(x)) return '–'; const s = fmt(Math.abs(x), d); return (x > 0 && s !== fmt(0, d) ? '+' : x < 0 && s !== fmt(0, d) ? '−' : '') + s; }
function fmtPrice(x) { if (x == null) return '–'; const r = Math.round(x * 10) / 10; if (r === 0) return '0'; return Math.abs(r) < 10 ? fmt(r, 1).replace(/[.,]0$/, '') : fmt(r, 0); }
function pctChange(a, b) { return a == null || b == null || a === 0 ? null : (b - a) / a * 100; }
function fill(tpl, o) { return tpl.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m)); }
const b = (s) => `<strong class="text-slate-100">${s}</strong>`;
function todayAthens() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date()); }
function addDays(iso, n) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function fmtDay(iso) { return new Intl.DateTimeFormat(T().locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')); }
function fmtStamp(iso) {
    if (!iso) return '–';
    return new Intl.DateTimeFormat(T().locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Athens' }).format(new Date(iso));
}
function hourRange(label) { const h = parseInt(label, 10); return `${String(h).padStart(2, '0')}–${String((h + 1) % 24).padStart(2, '0')}`; }
function timeOf(s) { const m = /(\d{2}:\d{2})/.exec(s || ''); return m ? m[1] : null; }

// ---------- data ----------
async function getJSON(url) {
    const r = await fetch(url, { cache: 'no-cache' });          // asks the server if the file changed (ETag), no re-download otherwise
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return r.json();
}
async function loadMonth(ym) {
    if (!st.months[ym]) st.months[ym] = (await getJSON(`data/${ym}.json`)).days;
    return st.months[ym];
}
function defaultDate() { return Object.keys(st.manifest.days).sort().pop(); }
async function selectDate(iso) {
    const month = await loadMonth(iso.slice(0, 7));
    st.date = iso;
    st.day = month[iso] || null;
}

// ---------- loading screen ----------
const loadRow = (i) => document.querySelector(`.load-row[data-step="${i}"]`);
function loadActivate(i) { const r = loadRow(i); r.classList.remove('opacity-50'); r.classList.add('opacity-100'); }
function loadSet(i, p) { loadRow(i).querySelector('[data-load-bar]').style.width = p + '%'; }
function loadDone(i) { loadRow(i).querySelector('[data-load-ck]').classList.remove('opacity-0'); }
function loadFail() {
    $('mainSpinner').classList.remove('animate-spin');
    $('loadError').textContent = T().load.error;
    $('loadError').classList.remove('hidden');
    document.querySelectorAll('[data-load-bar]').forEach((el) => { el.classList.remove('bg-blue-500'); el.classList.add('bg-slate-600'); });
}
function setLoadLabels() {
    const t = T();
    $('loadTitle').textContent = t.load.title; $('loadGroup1').textContent = t.load.g1; $('loadGroup2').textContent = t.load.g2;
    $('loadReady').textContent = t.load.ready;
    loadRow(1).querySelector('[data-load-label]').textContent = t.load.s1;
    TABS.forEach((k, i) => { loadRow(i + 2).querySelector('[data-load-label]').textContent = t.tabs[k]; });
}

// ---------- static text, tabs, header ----------
const TAB_COMMON = 'tab-btn h-12 md:h-auto md:py-3 px-2 md:px-4 rounded-lg md:rounded-none text-sm font-semibold leading-tight text-center transition flex items-center justify-center border';
const TAB_OFF = 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white md:bg-transparent md:border-0 md:border-b-2 md:border-transparent md:hover:border-slate-600';
const TAB_ON = 'bg-acc-400 border-acc-400 text-slate-900 shadow md:bg-transparent md:text-acc-400 md:border-0 md:border-b-2 md:border-acc-400';
function paintTabs() {
    TABS.forEach((k, i) => {
        const el = $(TABBTN[k]);
        el.className = `${TAB_COMMON} ${k === st.tab ? TAB_ON : TAB_OFF} ${i < 3 ? 'col-span-2' : 'col-span-3'} md:col-span-1`;
        el.setAttribute('aria-selected', k === st.tab ? 'true' : 'false');
        el.textContent = T().tabs[k];
    });
}
function paintLangButtons() {
    const on = 'bg-acc-400 text-slate-900', off = 'text-slate-400 hover:text-white';
    $('btnGr').className = `flex items-center justify-center px-4 rounded transition ${lang === 'el' ? on : off}`;
    $('btnEn').className = `flex items-center justify-center px-4 rounded transition ${lang === 'en' ? on : off}`;
}
const PILL = {
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300'
};
function pillFor(iso) {
    const m = st.manifest && st.manifest.days[iso], t = T().pill;
    if (!m) return null;
    if (m.quality === 'complete') return { tone: PILL.green, full: t.complete, short: t.completeShort };
    if (m.stages.dam && !m.stages.isp1 && iso >= todayAthens()) return { tone: PILL.orange, full: t.awaiting, short: t.awaitingShort };
    if (m.quality === 'check') return { tone: PILL.orange, full: t.check, short: t.checkShort };
    return { tone: PILL.orange, full: t.incomplete, short: t.incompleteShort };
}
function paintPill() {
    const p = pillFor(st.date), base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap';
    const d = $('statusPill'), m = $('statusPillBox');
    if (!p) { d.className = 'hidden'; m.className = 'hidden'; return; }
    d.className = `hidden md:inline-flex ${base} ${p.tone}`; d.textContent = p.full;
    m.className = `md:hidden shrink-0 ${base} ${p.tone}`; m.textContent = p.short;
}
function paintHeaderTimes() {
    $('lastUpdateVal').textContent = fmtStamp(st.meta && st.meta.last_update);
    $('nextUpdateVal').textContent = fmtStamp(st.meta && st.meta.next_update);
}
function paintDateSelect() {
    const sel = $('dateSelect'), today = todayAthens(), t = T();
    const days = Object.keys(st.manifest.days).sort().reverse();
    sel.innerHTML = days.map((d) => {
        const tag = d === today ? ` (${t.today})` : d === addDays(today, 1) ? ` (${t.tomorrow})` : '';
        return `<option value="${d}"${d === st.date ? ' selected' : ''}>${fmtDay(d)}${tag}</option>`;
    }).join('');
}
function applyStatic() {
    const t = T();
    document.documentElement.lang = t.htmlLang; document.title = t.title;
    $('mainTitle').textContent = t.title; $('hubText').textContent = t.hub;
    $('lastUpdateLabel').textContent = t.lastUpdate; $('lastUpdateLabelMobile').textContent = t.lastUpdateMobile;
    $('nextUpdateLabel').textContent = t.nextUpdate; $('nextUpdateLabelMobile').textContent = t.nextUpdateMobile;
    $('pickerLabel').textContent = t.dateLabel;
    $('btnMethodology').textContent = t.btnMethodology; $('btnMethodologyShort').textContent = t.btnMethodologyShort;
    $('toTopBtn').setAttribute('aria-label', t.toTop); $('toTopBtn').title = t.toTop;
    $('methLinkGlance').textContent = t.methodLink;
    $('modalTitle').textContent = t.modalTitle; $('modalCloseBtn').textContent = t.close; $('modalXBtn').setAttribute('aria-label', t.close);
    $('modalModeShortBtn').textContent = t.modalShort; $('modalModeDetailedBtn').textContent = t.modalDetailed;
    setLoadLabels(); paintTabs(); paintLangButtons();
    if (st.manifest) { paintDateSelect(); paintPill(); paintHeaderTimes(); }
    paintModeButtons();
}

// ---------- charts ----------
const charts = {};
function killChart(id) { if (charts[id]) { try { charts[id].destroy(); } catch (e) { /* already gone */ } delete charts[id]; } }
function mkChart(id, cfg) { killChart(id); const el = $(id); if (!el || typeof Chart === 'undefined') return null; charts[id] = new Chart(el, cfg); return charts[id]; }
const GRID = 'rgba(51,65,85,.4)';
function xAxis(title, labelFn) {
    return { grid: { color: GRID }, ticks: Object.assign({ color: '#94a3b8', maxTicksLimit: 8, autoSkip: true, maxRotation: 0 }, labelFn ? { callback: labelFn } : {}), title: { display: !!title, text: title, color: '#94a3b8', font: { size: 11 } } };
}
function yAxis(title, extra) {
    return Object.assign({ beginAtZero: true, grid: { color: GRID }, ticks: { color: '#94a3b8', callback: (v) => fmt(v, 0) }, title: { display: !!title, text: title, color: '#94a3b8', font: { size: 11 } } }, extra || {});
}
function baseOpts(model, scales, plugins) {
    return { responsive: true, maintainAspectRatio: false, animation: REDUCE ? false : { duration: 400 }, interaction: { mode: 'index', intersect: false },
        plugins: Object.assign({ legend: { display: false }, tooltip: { enabled: false, external: externalFor(model) } }, plugins || {}), scales };
}
const lineDs = (label, data, color, dashed, extra) => Object.assign({ type: 'line', label, data, borderColor: color, backgroundColor: color, borderWidth: dashed ? 2 : 2.6, borderDash: dashed ? [6, 4] : [], pointRadius: 0, pointHoverRadius: 4, tension: 0.25, spanGaps: false }, extra || {});
const tv = (x) => (x == null || Math.abs(x) < 0.5 ? '–' : fmt(x, 0));

// one tooltip for every chart: hour (or time) in the accent colour, values right-aligned, dashed rule before totals
function tipEl(canvas) {
    const id = 'tip_' + canvas.id; let el = $(id);
    if (!el) {
        el = document.createElement('div'); el.id = id;
        el.className = 'pointer-events-none absolute z-20 hidden rounded-lg border border-slate-600 bg-slate-900/95 px-3 py-2 text-xs shadow-xl shadow-black/40';
        el.style.minWidth = '190px'; canvas.parentElement.appendChild(el);
    }
    return el;
}
function externalFor(getModel) {
    return (ctx) => {
        const tip = ctx.tooltip, el = tipEl(ctx.chart.canvas);
        if (!st.day || tip.opacity === 0) { el.classList.add('hidden'); return; }
        const m = getModel(tip.dataPoints[0].dataIndex), cols = m.head.length;
        const cell = (v, c) => `<div class="text-right tabular-nums ${c || ''}">${v}</div>`;
        let html = `<div class="text-acc-300 font-semibold mb-1.5">${m.title}</div><div class="grid items-center gap-x-3 gap-y-1" style="grid-template-columns:auto ${'1fr '.repeat(cols)}"><div></div>${m.head.map((h) => cell(h, 'text-slate-400')).join('')}`;
        m.rows.forEach((r) => {
            if (r.sep) { html += '<div class="border-t border-dashed border-slate-600 my-0.5" style="grid-column:1/-1"></div>'; return; }
            html += `<div class="flex items-center gap-1.5 ${r.bold ? 'font-semibold text-slate-100' : 'text-slate-300'}"><span class="inline-block w-2 h-2 rounded-full" style="background:${r.c}"></span>${r.n}</div>` +
                r.v.map((v, i) => cell(v, r.bold && i === r.v.length - 1 ? 'text-acc-300' : '')).join('');
        });
        el.innerHTML = html + '</div>'; el.classList.remove('hidden');
        const wrap = el.parentElement.getBoundingClientRect(), w = el.offsetWidth;
        let x = tip.caretX + 14; if (x + w > wrap.width - 4) x = tip.caretX - w - 14; if (x < 4) x = 4;
        el.style.left = x + 'px'; el.style.top = '8px';
    };
}
const diffTxt = (d, s) => (d == null || s == null || Math.abs(s - d) < 0.5 ? '–' : fmtS(s - d, 0));

// ---------- tab 1: day at a glance ----------
function sectionBox(id, title, sub, bodyHtml) {
    const open = !!st.open[id], t = T();
    return `<div class="bg-slate-800/50 border border-slate-700 border-l-4 border-l-acc-400 rounded-xl p-4 md:p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-x-2"><h3 class="text-sm font-bold text-acc-300">${title}</h3>${sub ? `<span class="text-[11px] text-slate-400">${sub}</span>` : ''}</div>
        <p class="mt-2 text-sm leading-relaxed text-slate-300 ${open ? '' : 'line-clamp-3'} md:line-clamp-none">${bodyHtml}</p>
        <button type="button" data-more="${id}" aria-expanded="${open}" class="md:hidden mt-2 text-xs font-semibold text-acc-300 hover:text-acc-200">${open ? t.less : t.more}</button></div>`;
}
function stage1Html(day) {
    const t = T().s1, s = day.summary, p = s.price, out = [];
    out.push(fill(t.price, { avg: b(fmtPrice(p.avg)), min: b(fmtPrice(p.min)), minAt: p.min_at, max: b(fmtPrice(p.max)), maxAt: p.max_at }));
    if (s.res_share_of_demand != null && s.categories.res.dam != null && s.demand_gwh != null)
        out.push(fill(t.res, { share: b(fmt(s.res_share_of_demand * 100, 0)), res: b(fmt(s.categories.res.dam, 0)), demand: b(fmt(s.demand_gwh, 0)) }));
    if (s.thermal_level_mw && s.windows)
        out.push(fill(t.thermal, { a: s.windows.midday[0], b: s.windows.midday[1], mw: b(fmt(s.thermal_level_mw.midday.dam, 0)) }));
    const z = day.signals.find((x) => x.id === 'zero_price_imports');
    if (z) out.push(fill(t.zero, { n: b(z.intervals), from: z.span.from, to: z.span.to, mw: b(fmt(z.dam_imports_avg, 0)) }));
    return out.join(' ');
}
function stage2Html(day) {
    const t = T().s2, s = day.summary, C = s.categories, out = [], ch = s.thermal_change_mw;
    if (ch && s.windows) {
        const lig = ch.midday.lignite, gas = ch.midday.gas, ev = (ch.evening.lignite || 0) + (ch.evening.gas || 0);
        out.push(fill(t.thermal, { a: s.windows.midday[0], b: s.windows.midday[1], lig: b(fmtS(lig, 0)), gas: b(fmtS(gas, 0)), ev: b(fmtS(ev, 0)), eh: s.windows.evening }));
    }
    if (C.hydro.dam != null && C.hydro.isp1 != null) {
        const p = pctChange(C.hydro.dam, C.hydro.isp1);
        out.push(fill(t.hydro, { dam: b(fmt(C.hydro.dam, 1)), isp: b(fmt(C.hydro.isp1, 1)), pct: p == null ? '–' : fmtS(p, 0) + '%' }));
    }
    if (C.res.dam != null && C.res.isp1 != null) {
        const p = pctChange(C.res.dam, C.res.isp1);
        out.push(fill(t.res, { pct: b(p == null ? '–' : fmtS(p, 1) + '%'), isp: fmt(C.res.isp1, 1), dam: fmt(C.res.dam, 1) }));
    }
    if (s.surplus && s.surplus.gwh > 0) out.push(fill(t.surplus, { gwh: b(fmt(s.surplus.gwh, 1)), n: b(s.surplus.intervals), peak: b(fmt(s.surplus.peak_mw, 0)), at: s.surplus.peak_at }));
    else out.push(t.noSurplus);
    const c = day.signals.find((x) => x.id === 'possible_congestion');
    if (c) out.push(fill(t.cong, { n: b(c.intervals), from: c.span.from, to: c.span.to, imp: b(fmt(c.isp_imports_avg_mw, 0)), sur: b(fmt(c.surplus_avg_mw, 0)) }));
    const bs = s.borders.steps_gwh;
    if (bs) out.push(fill(t.borders, { dam: b(fmt(bs.dam, 1)), auc: b(fmt(bs.after_auctions, 1)), xb: b(fmt(bs.after_xbid, 1)) }));
    return out.join(' ');
}
function renderStages() {
    const day = st.day, t = T();
    if (!day) { $('stageBoxes').innerHTML = `<p class="text-sm text-slate-400">${t.failed}</p>`; return; }
    const pubD = timeOf(day.published.dam), pubI = timeOf(day.published.isp1);
    const box1 = sectionBox('s1', t.stage1, pubD ? fill(t.pub, { t: pubD }) : '', stage1Html(day));
    const box2 = sectionBox('s2', t.stage2, pubI ? fill(t.pub, { t: pubI }) : '', day.stages.isp1 ? stage2Html(day) : t.isp1Pending);
    $('stageBoxes').innerHTML = box1 + box2;
}
function renderSignals() {
    const day = st.day, t = T().sig; if (!day) { $('signalPills').innerHTML = ''; return; }
    const items = [], s = day.summary;
    const z = day.signals.find((x) => x.id === 'zero_price_imports'), c = day.signals.find((x) => x.id === 'possible_congestion');
    if (c) items.push(['#fdba74', fill(t.cong, { from: c.span.from, to: c.span.to })]);
    else if (z) items.push(['#fdba74', fill(t.zero, { from: z.span.from, to: z.span.to })]);
    if (s.units) {
        const fuel = (day.hourly.isp1 && day.hourly.isp1.unit_fuel) || {};
        const names = s.units.on.filter((u) => fuel[u] === 'lignite').map((u) => T().units[u] || u);
        items.push([COL.lignite, names.length ? fill(t.lignite, { names: names.join(', ') }) : t.noLignite]);
    }
    const cr = s.crete.isp1_net != null ? s.crete.isp1_net : s.crete.dam.net;
    if (cr != null) items.push(['#2dd4bf', fill(t.crete, { gwh: fmt(cr, 1) })]);
    $('signalPills').innerHTML = items.map(([col, tx]) => `<span class="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"><span class="w-2 h-2 rounded-full shrink-0" style="background:${col}"></span>${tx}</span>`).join('');
}
function kpiCard(title, dam, isp, d, color, ispOnly) {
    const t = T().kpi, a = (v) => (v == null ? '–' : fmt(v, d));
    let delta = '';
    if (ispOnly) delta = t.ispOnly;
    else if (isp == null) delta = t.pending;
    else if (dam != null) { const p = pctChange(dam, isp); delta = `${fmtS(isp - dam, 1)} ${t.unit}${p == null ? '' : ' (' + fmtS(p, 0) + '%)'}`; }
    const colD = typeof color === 'function' ? color(dam) : color, colI = typeof color === 'function' ? color(isp) : color;
    const rows = ispOnly
        ? `<div class="py-3 text-center text-2xl font-bold" style="color:${colI}">${a(isp)} <span class="text-xs font-normal text-slate-400">${t.unit}</span></div>`
        : `<div class="flex items-baseline justify-between"><span class="text-[11px] text-slate-400">${t.dam}</span><span class="text-xl font-bold tabular-nums" style="color:${colD};opacity:.62">${a(dam)}</span></div>
           <div class="flex items-baseline justify-between"><span class="text-[11px] text-slate-400">${t.isp}</span><span class="text-xl font-bold tabular-nums" style="color:${colI}">${a(isp)}</span></div>`;
    return `<div class="bg-slate-800/50 border border-slate-700 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
        <div class="text-xs text-slate-400 text-center">${title} (${t.unit})</div>${rows}<div class="text-[11px] text-slate-400 text-center mt-0.5">${delta}</div></div>`;
}
function renderKpis() {
    const day = st.day, t = T().kpi; if (!day) { $('kpiGrid').innerHTML = ''; return; }
    const C = day.summary.categories, resD = C.res.dam != null && C.res.dam >= 100 ? 0 : 1;
    const flow = (v) => (v == null ? '#94a3b8' : v >= 0 ? COL.exp : COL.imp);   // exports red, imports yellow
    $('kpiGrid').innerHTML =
        kpiCard(t.lignite, C.lignite.dam, C.lignite.isp1, 1, COL.lignite) +
        kpiCard(t.gas, C.gas.dam, C.gas.isp1, 1, COL.gas) +
        kpiCard(t.hydro, C.hydro.dam, C.hydro.isp1, 1, COL.hydro) +
        kpiCard(t.res, C.res.dam, C.res.isp1, resD, COL.res) +
        kpiCard(t.exports, C.border_net.dam, C.border_net.isp1, 1, flow) +
        kpiCard(t.surplus, null, day.summary.surplus ? day.summary.surplus.gwh : null, 1, COL.surplus, true);
}
function thermalLegendHtml(withCons, hasIsp) {
    const t = T(), dot = (c, tx) => `<span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full" style="background:${c}"></span>${tx}</span>`;
    return dot(COL.lignite, t.hero.lignite) + dot(COL.gas, t.hero.gas) + (withCons ? dot('#94a3b8', t.t3.cons) : '') +
        `<span class="text-slate-400">${hasIsp ? t.solidIsp + ' · ' + t.dashedDam : t.onlyDam}</span>`;
}
function thermalModel(withCons) {
    return (i) => {
        const h = st.day.hourly, t = T().hero, hasIsp = !!h.isp1, L = (a) => (a ? a[i] : null);
        const o = (key) => ({ dam: L(h.dam[key]), isp: hasIsp ? L(h.isp1[key]) : null });
        const row = (n, c, v, bold) => ({ n, c, bold, v: hasIsp ? [tv(v.dam), tv(v.isp), diffTxt(v.dam, v.isp)] : [tv(v.dam)] });
        const lg = o('lignite'), gs = o('gas');
        const rows = [row(t.lignite, COL.lignite, lg), row(t.gas, COL.gas, gs), { sep: true }, row(t.total, '#e2e8f0', { dam: (lg.dam || 0) + (gs.dam || 0), isp: hasIsp ? (lg.isp || 0) + (gs.isp || 0) : null }, true)];
        if (withCons && hasIsp && h.isp1.constraints_mw) rows.push({ sep: true }, { n: T().t3.cons, c: '#94a3b8', v: ['–', tv(h.isp1.constraints_mw[i]), '–'] });
        return { title: hourRange(h.label[i]), head: hasIsp ? [t.dam, t.isp, t.diff] : [t.dam], rows };
    };
}
function renderThermal(canvasId, legendId, withCons) {
    const t = T(), day = st.day; killChart(canvasId);
    if (!day) { $(legendId).innerHTML = ''; return; }
    const h = day.hourly, hasIsp = !!h.isp1, hasCons = withCons && hasIsp && !!h.isp1.constraints_mw;
    $(legendId).innerHTML = thermalLegendHtml(hasCons, hasIsp);
    const ds = [lineDs(t.hero.lignite + ' ' + t.hero.dam, h.dam.lignite, COL.lignite, hasIsp), lineDs(t.hero.gas + ' ' + t.hero.dam, h.dam.gas, COL.gas, hasIsp)];
    if (hasIsp) { ds.push(lineDs(t.hero.lignite + ' ' + t.hero.isp, h.isp1.lignite, COL.lignite, false)); ds.push(lineDs(t.hero.gas + ' ' + t.hero.isp, h.isp1.gas, COL.gas, false)); }
    if (hasCons) ds.push(lineDs(t.t3.cons, h.isp1.constraints_mw, '#94a3b8', true, { stepped: true, borderWidth: 1.5, borderDash: [2, 3], tension: 0 }));
    mkChart(canvasId, { type: 'line', data: { labels: h.label, datasets: ds }, options: baseOpts(thermalModel(hasCons), { x: xAxis(t.axisHour), y: yAxis('MW') }) });
}
function renderGlance() { renderStages(); renderSignals(); renderKpis(); $('heroTitle').textContent = T().hero.title; $('heroSub').textContent = T().hero.sub; renderThermal('heroChart', 'heroLegend', false); }
function renderPlaceholder(tab) {
    const t = T().soon;
    $(VIEW[tab]).innerHTML = `<div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6 text-center"><h2 class="text-lg font-semibold text-slate-200">${t.title}</h2><p class="mt-2 text-sm text-slate-400">${t.text}</p></div>`;
}
const card = 'bg-slate-800/40 border border-slate-700 rounded-xl p-4 md:p-5';
const methBtn = (id) => `<div class="flex justify-end -mb-2"><button type="button" onclick="openMethodology('${id}')" class="hidden md:inline-block text-xs text-slate-400 hover:text-acc-300 transition">${T().methodLink}</button></div>`;
const plantName = (k) => T().units[k] || k.replace(/_/g, ' ');

// ----- tab 2: ADMIE reshuffle -----
function pairModel(key, color, name) {
    return (i) => {
        const h = st.day.hourly, t = T().hero, hasIsp = !!h.isp1, d = h.dam[key][i], s = hasIsp ? h.isp1[key][i] : null;
        return { title: hourRange(h.label[i]), head: hasIsp ? [t.dam, t.isp, t.diff] : [t.dam], rows: [{ n: name, c: color, v: hasIsp ? [tv(d), tv(s), diffTxt(d, s)] : [tv(d)] }] };
    };
}
function renderPair(id, key, color, name) {
    const h = st.day.hourly, t = T(), hasIsp = !!h.isp1;
    const ds = [lineDs(t.hero.dam, h.dam[key], color, hasIsp)];
    if (hasIsp) ds.push(lineDs(t.hero.isp, h.isp1[key], color, false));
    mkChart(id, { type: 'line', data: { labels: h.label, datasets: ds }, options: baseOpts(pairModel(key, color, name), { x: xAxis(t.axisHour), y: yAxis('MW') }) });
}
function congBands(day) {
    const sig = day.signals.find((x) => x.id === 'possible_congestion') || day.signals.find((x) => x.id === 'zero_price_imports');
    if (!sig) return [];
    return sig.windows.map((w) => { const a = day.clock.indexOf(w.from); let e = day.clock.indexOf(w.to, a + 1); if (e < 0) e = day.clock.length; return [a, e]; }).filter((x) => x[0] >= 0);
}
const bandPlugin = {
    id: 'bands',
    afterDatasetsDraw(chart) {
        const list = (chart.options.plugins.bands && chart.options.plugins.bands.list) || [];
        if (!list.length) return;
        const { ctx, chartArea, scales } = chart, x = scales.x, half = (x.getPixelForValue(1) - x.getPixelForValue(0)) / 2;
        ctx.save(); ctx.fillStyle = 'rgba(247,143,179,0.18)';
        list.forEach(([a, e]) => { const l = x.getPixelForValue(a) - half, r = x.getPixelForValue(e - 1) + half; ctx.fillRect(l, chartArea.top, r - l, chartArea.bottom - chartArea.top); });
        ctx.restore();
    }
};
function surplusModel(i) {
    const d = st.day, q = d.q, t = T().t2, col = '#e2e8f0';
    const rows = [{ n: t.price, c: col, v: [fmtPrice(q.mcp[i])] }];
    if (q.surplus) rows.push({ n: t.surplus, c: COL.surplus, v: [tv(q.surplus[i])] });
    if (q.dam_imports) rows.push({ n: t.imports, c: COL.imp, v: [tv(q.dam_imports[i])] });
    if (q.isp_imports) rows.push({ n: t.ispImports, c: COL.imp, v: [tv(q.isp_imports[i])] });
    return { title: d.clock[i], head: [''], rows };
}
function renderSurplusChart() {
    const day = st.day, t = T(), q = day.q, hourOf = function (v) { return String(this.getLabelForValue(v)).slice(0, 2); };
    const ds = [];
    if (q.surplus) ds.push({ type: 'bar', label: t.t2.surplus, data: q.surplus, backgroundColor: COL.surplus, borderWidth: 0, barPercentage: 1, categoryPercentage: 1, yAxisID: 'y', order: 2 });
    ds.push(lineDs(t.t2.price, q.mcp, '#e2e8f0', false, { yAxisID: 'y2', order: 1, tension: 0, borderWidth: 2 }));
    const opts = baseOpts(surplusModel, { x: xAxis(t.axisHour, hourOf), y: yAxis('MW'), y2: yAxis('€/MWh', { position: 'right', grid: { drawOnChartArea: false } }) }, { bands: { list: congBands(day) } });
    mkChart('surChart', { type: 'bar', data: { labels: day.clock, datasets: ds }, options: opts, plugins: [bandPlugin] });
}
function tableRows(day) {
    const C = day.summary.categories, t = T().t2.rows, S = day.summary.surplus;
    return [['lignite', C.lignite], ['gas', C.gas], ['hydro', C.hydro], ['res', C.res], ['storage', C.storage_net], ['pump', C.pump], ['exports', C.border_net], ['crete', C.crete_net]]
        .map(([k, c]) => ({ n: t[k], dam: c.dam, isp: c.isp1 })).concat([{ n: t.surplus, dam: null, isp: S ? S.gwh : null, only: true }]);
}
function renderReshuffle() {
    ['hydroChart', 'resChart', 'surChart'].forEach(killChart);
    const day = st.day, t = T(), t2 = t.t2, el = $(VIEW.reshuffle);
    if (!day) { el.innerHTML = `<p class="text-sm text-slate-400">${t.failed}</p>`; return; }
    const grid = 'grid grid-cols-[minmax(0,1fr)_3.6rem_3.6rem_4.6rem] md:grid-cols-[minmax(0,1fr)_5rem_5rem_6rem] gap-x-2 items-baseline';
    const rows = tableRows(day).map((r) => {
        const dl = r.only || r.dam == null || r.isp == null ? null : r.isp - r.dam, big = dl != null && Math.abs(dl) >= 1.5;
        return `<div class="${grid} py-2 border-t border-slate-700/60 text-sm"><div class="text-slate-200">${r.n}</div>
            <div class="text-right tabular-nums text-slate-400">${r.dam == null ? '–' : fmt(r.dam, 1)}</div>
            <div class="text-right tabular-nums text-slate-100 font-semibold">${r.isp == null ? '–' : fmt(r.isp, 1)}</div>
            <div class="text-right tabular-nums ${big ? 'text-acc-300 font-semibold' : 'text-slate-400'}">${r.only ? t2.onlyIsp : dl == null ? '–' : fmtS(dl, 1)}</div></div>`;
    }).join('');
    el.innerHTML = methBtn('m-reshuffle') + `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div class="${card}"><h2 class="text-base font-semibold text-slate-200">${t2.tableTitle}</h2><p class="text-xs text-slate-400 mt-1">${t2.tableSub}</p>
          <div class="mt-3"><div class="${grid} pb-1 text-[11px] text-slate-400"><div>${t2.cols.cat}</div><div class="text-right">${t2.cols.dam}</div><div class="text-right">${t2.cols.isp}</div><div class="text-right">${t2.cols.chg}</div></div>${rows}</div></div>
        <div class="grid grid-cols-1 gap-3 md:gap-4">
          <div class="${card}"><h2 class="text-base font-semibold text-slate-200">${t2.hydroTitle}</h2><p class="text-xs text-slate-400 mt-1">${t2.pairSub}</p><div class="relative h-[170px] md:h-[150px] mt-2"><canvas id="hydroChart"></canvas></div></div>
          <div class="${card}"><h2 class="text-base font-semibold text-slate-200">${t2.resTitle}</h2><p class="text-xs text-slate-400 mt-1">${t2.pairSub}</p><div class="relative h-[170px] md:h-[150px] mt-2"><canvas id="resChart"></canvas></div></div>
        </div></div>
      <div class="${card}"><h2 class="text-base font-semibold text-slate-200">${t2.surTitle}</h2><p class="text-xs text-slate-400 mt-1">${t2.surSub}</p><div class="relative h-[240px] md:h-[300px] mt-3"><canvas id="surChart"></canvas></div></div>`;
    renderPair('hydroChart', 'hydro', COL.hydro, t.kpi.hydro);
    renderPair('resChart', 'res', COL.res, t.kpi.res);
    renderSurplusChart();
}

// ----- tab 3: thermal & constraints -----
function heatHtml(day) {
    const t3 = T().t3, h = day.hourly.isp1;
    if (!h) return `<p class="text-sm text-slate-400">${t3.noIsp}</p>`;
    const names = Object.keys(h.units).sort((a, b) => ((h.unit_fuel[a] === 'lignite' ? 0 : 1) - (h.unit_fuel[b] === 'lignite' ? 0 : 1)) || a.localeCompare(b));
    if (!names.length) return `<p class="text-sm text-slate-400">${t3.heatNone}</p>`;
    const labels = day.hourly.label, axis = labels.map((l, i) => `<div class="flex-1 min-w-0 text-[10px] text-slate-500 text-center">${i % 3 === 0 ? l : ''}</div>`).join('');
    const rows = names.map((u) => {
        const v = h.units[u], mx = Math.max(...v, 1), col = h.unit_fuel[u] === 'lignite' ? COL.lignite : COL.gas;
        const cells = v.map((x, i) => `<div class="flex-1 min-w-0 h-5 rounded-[2px]" style="background:${col};opacity:${(0.07 + 0.93 * x / mx).toFixed(2)}" title="${plantName(u)} · ${hourRange(labels[i])}: ${fmt(x, 0)} MW"></div>`).join('');
        return `<div class="flex items-center gap-px mb-px"><div class="w-24 md:w-36 shrink-0 pr-2 text-[11px] md:text-xs text-slate-300 truncate">${plantName(u)}</div>${cells}</div>`;
    }).join('');
    return `${rows}<div class="flex items-center gap-px mt-1"><div class="w-24 md:w-36 shrink-0"></div>${axis}</div>`;
}
function consHtml(day) {
    const t3 = T().t3, cs = day.constraints;
    if (cs === undefined) return `<p class="text-sm text-slate-400">${t3.noData}</p>`;
    if (cs === null || !day.stages.isp1) return `<p class="text-sm text-slate-400">${t3.noIsp}</p>`;
    if (!cs.length) return `<p class="text-sm text-slate-400">${t3.none}</p>`;
    const by = {};
    cs.forEach((c) => { const k = c.plants[0]; (by[k] = by[k] || { k, fuel: c.fuel, max: 0, wins: [] }); by[k].max = Math.max(by[k].max, c.limit_mw); by[k].wins.push(c); });
    const list = Object.values(by).sort((a, b) => b.max - a.max), mx = list[0].max;
    return list.map((p) => {
        const w = p.wins[0], hrs = w.from === w.to ? t3.allDay : `${w.from}–${w.to}`, more = p.wins.length > 1 ? ' · ' + fill(t3.moreWin, { n: p.wins.length - 1 }) : '';
        return `<div class="py-2 border-t border-slate-700/60 first:border-t-0"><div class="flex items-baseline justify-between gap-3"><span class="text-sm text-slate-200">${plantName(p.k)}</span><span class="text-sm font-semibold tabular-nums text-slate-100">${fmt(p.max, 0)} MW</span></div>
            <div class="mt-1 h-2 rounded bg-slate-900/70 overflow-hidden"><div class="h-full rounded" style="width:${(p.max / mx * 100).toFixed(1)}%;background:${p.fuel === 'lignite' ? COL.lignite : COL.gas}"></div></div>
            <div class="mt-1 text-[11px] text-slate-400">${hrs}${more}</div></div>`;
    }).join('');
}
function renderThermalTab() {
    killChart('thermChart');
    const day = st.day, t = T(), t3 = t.t3, el = $(VIEW.thermal);
    if (!day) { el.innerHTML = `<p class="text-sm text-slate-400">${t.failed}</p>`; return; }
    const s = day.summary, ch = s.thermal_change_mw, cs = day.constraints;
    let lead = '';
    if (cs && cs.length && ch && s.windows) {
        lead = `<div class="${card}"><p class="text-sm leading-relaxed text-slate-300">${fill(t3.lead, { n: b(new Set(cs.map((c) => c.plants[0])).size), peak: b(fmt(s.constraints_peak_mw, 0)), a: s.windows.midday[0], b: s.windows.midday[1], add: b(fmtS((ch.midday.lignite || 0) + (ch.midday.gas || 0), 0)) })}</p></div>`;
    }
    el.innerHTML = methBtn('m-thermal') + lead + `
      <div class="${card}"><h2 class="text-base font-semibold text-slate-200">${t3.thermTitle}</h2><p class="text-xs text-slate-400 mt-1">${t3.thermSub}</p><div id="thermLegend" class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-3"></div><div class="relative h-[260px] md:h-[340px] mt-3"><canvas id="thermChart"></canvas></div></div>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        <div class="${card} md:col-span-3"><h2 class="text-base font-semibold text-slate-200">${t3.heatTitle}</h2><p class="text-xs text-slate-400 mt-1">${t3.heatSub}</p><div class="mt-3">${heatHtml(day)}</div><p class="text-[11px] text-slate-500 mt-3">${t3.retired}</p></div>
        <div class="${card} md:col-span-2"><h2 class="text-base font-semibold text-slate-200">${t3.consTitle}</h2><p class="text-xs text-slate-400 mt-1">${t3.consSub}</p><div class="mt-3">${consHtml(day)}</div></div>
      </div>`;
    renderThermal('thermChart', 'thermLegend', true);
}
function renderTab(tab) {
    if (tab === 'glance') renderGlance(); else if (tab === 'reshuffle') renderReshuffle(); else if (tab === 'thermal') renderThermalTab(); else renderPlaceholder(tab);
}
function renderAll() { TABS.forEach(renderTab); paintPill(); }

// ---------- tabs, scroll ----------
function switchTab(tab) {
    st.tab = tab;
    TABS.forEach((k) => $(VIEW[k]).classList.toggle('hidden', k !== tab));
    $(VIEW[tab]).classList.toggle('block', true);
    paintTabs();
    Object.values(charts).forEach((c) => { try { c.resize(); } catch (e) { /* hidden */ } });
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }); }
function updateToTop() {
    const btn = $('toTopBtn'), r = document.querySelector('[role="tablist"]').getBoundingClientRect();
    const show = r.bottom < 0 && window.matchMedia('(max-width: 767px)').matches;
    btn.classList.toggle('opacity-0', !show); btn.classList.toggle('pointer-events-none', !show);
    btn.setAttribute('aria-hidden', show ? 'false' : 'true'); btn.tabIndex = show ? 0 : -1;
}

// ---------- methodology modal ----------
function paintModeButtons() {
    const on = 'bg-acc-400 text-slate-900', off = 'text-slate-300 hover:text-white';
    $('modalModeShortBtn').className = `flex-1 py-1.5 rounded-md text-sm font-semibold transition ${modalMode === 'short' ? on : off}`;
    $('modalModeDetailedBtn').className = `flex-1 py-1.5 rounded-md text-sm font-semibold transition ${modalMode === 'detailed' ? on : off}`;
}
function renderMethodology(scrollTo) {
    const body = $('modalBody');
    body.innerHTML = METHOD[lang].map((s) => `<section id="${s.id}" class="${s.id === 'm-glance' ? '' : 'mt-6'}"><h4 class="text-sm font-bold text-acc-300 mb-2">${s.title}</h4>` +
        (modalMode === 'short' ? `<ul class="list-disc pl-5 space-y-1.5">${s.short.map((x) => `<li>${x}</li>`).join('')}</ul>` : s.detailed.map((x) => `<p class="mb-3">${x}</p>`).join('')) + '</section>').join('');
    if (scrollTo && $(scrollTo)) body.scrollTop = $(scrollTo).offsetTop - 8; else body.scrollTop = 0;
}
function toggleModal(open) {
    const m = $('methodologyModal'), c = $('modalContent');
    if (open) {
        modalReturnFocus = document.activeElement; modalOpen = true;
        m.classList.remove('hidden'); m.classList.add('flex'); document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => { m.classList.remove('opacity-0'); c.classList.remove('scale-95'); $('modalXBtn').focus(); });
    } else {
        modalOpen = false; m.classList.add('opacity-0'); c.classList.add('scale-95');
        setTimeout(() => { if (!modalOpen) { m.classList.add('hidden'); m.classList.remove('flex'); } }, REDUCE ? 0 : 250);
        document.body.style.overflow = '';
        if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
    }
}
function openMethodology(id) { modalMode = 'short'; paintModeButtons(); renderMethodology(id || 'm-' + st.tab); toggleModal(true); }
function setMethodologyMode(m) {
    const cur = METHOD[lang].find((s) => { const el = $(s.id); return el && el.offsetTop - $('modalBody').scrollTop > -40; });
    modalMode = m; paintModeButtons(); renderMethodology(cur ? cur.id : 'm-' + st.tab);
}

// ---------- language, day, refresh ----------
function setLang(l) {
    lang = l === 'el' ? 'el' : 'en';
    try { localStorage.setItem('kp_lang', lang); } catch (e) { /* ignore */ }
    nfCache.x = 0; Object.keys(nfCache).forEach((k) => delete nfCache[k]);
    applyStatic(); renderAll();
    if (modalOpen) renderMethodology();
}
async function onDateChange(iso) {
    try { await selectDate(iso); } catch (e) { st.day = null; st.date = iso; }
    paintPill(); renderAll();
}
async function refreshIfStale() {
    if (!st.ready || !st.meta) return;
    const nx = Date.parse(st.meta.next_update);
    if (!isFinite(nx) || Date.now() < nx || Date.now() - st.lastRefresh < 300000) return;
    st.lastRefresh = Date.now();
    try {
        const [man, meta] = await Promise.all([getJSON('data/manifest.json'), getJSON('data/meta.json')]);
        st.manifest = man; st.meta = meta; st.months = {};
        if (!man.days[st.date]) st.date = defaultDate();
        await selectDate(st.date);
        paintDateSelect(); paintHeaderTimes(); renderAll();
    } catch (e) { /* keep what is on screen */ }
}

// ---------- start ----------
async function boot() {
    applyStatic();
    loadActivate(1); loadSet(1, 6);
    const t0 = Date.now();
    try {
        const [man, meta] = await Promise.all([getJSON('data/manifest.json'), getJSON('data/meta.json')]);
        st.manifest = man; st.meta = meta; loadSet(1, 45);
        await selectDate(defaultDate()); loadSet(1, 100);
    } catch (e) { console.error(e); loadFail(); return; }
    await wait(Math.max(0, LD.min - (Date.now() - t0))); loadDone(1); await wait(LD.pause);
    paintDateSelect(); paintPill(); paintHeaderTimes();
    for (let i = 0; i < TABS.length; i++) {
        loadActivate(i + 2); await wait(20);
        try { renderTab(TABS[i]); } catch (e) { console.error(e); }
        loadSet(i + 2, 100); await wait(LD.fill); loadDone(i + 2); await wait(i === TABS.length - 1 ? 0 : 120);
    }
    switchTab('glance');
    await wait(LD.ready);
    const f = $('loadRowFinal'); f.classList.remove('opacity-0', 'translate-y-2'); f.classList.add('opacity-100');
    $('mainSpinner').classList.remove('animate-spin'); $('mainSpinner').classList.add('border-emerald-500');
    await wait(LD.ready);
    const ov = $('loading-overlay'); ov.classList.add('opacity-0'); await wait(REDUCE ? 0 : 500); ov.classList.add('hidden');
    st.ready = true; st.lastRefresh = Date.now();
}

Object.assign(window, { switchTab, scrollToTop, setLang, openMethodology, toggleModal, setMethodologyMode });
document.addEventListener('DOMContentLoaded', () => {
    $('stageBoxes').addEventListener('click', (e) => { const btn = e.target.closest('[data-more]'); if (!btn) return; const k = btn.dataset.more; st.open[k] = !st.open[k]; renderStages(); });
    $('dateSelect').addEventListener('change', (e) => onDateChange(e.target.value));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOpen) toggleModal(false); });
    $('methodologyModal').addEventListener('click', (e) => { if (e.target === $('methodologyModal')) toggleModal(false); });
    window.addEventListener('scroll', updateToTop, { passive: true }); window.addEventListener('resize', updateToTop);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshIfStale(); });
    boot();
});
})();
