#!/usr/bin/env node
// Generates the animated profile SVGs in dark + light variants from one template.
// Usage: node scripts/build-svgs.mjs   (writes assets/<name>-{dark,light}.svg)
//
// Rules every SVG follows (GitHub renders them through <img>, so no JS, no
// external fonts/images, no clickable links inside):
//   - animation is CSS @keyframes only (no SMIL), so prefers-reduced-motion can
//     switch it all off and leave a readable final frame;
//   - base styles describe the *final* frame; keyframes provide the motion.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

const THEMES = {
  dark: {
    bg1: '#0b1020', bg2: '#151f35', border: '#283653', card: '#111b31', cardStroke: '#314160',
    text: '#f3f7ff', muted: '#8fa2c4', faint: '#4d5e7f', teal: '#48dbc0', violet: '#9586fa',
    lilac: '#b38df8', pink: '#f08bc4', term: '#0d1424', termBar: '#151f35', red: '#ff6b7a',
    amber: '#ffc861', green: '#5be08f', ball: '#f3f7ff', ballInk: '#0b1020', haloOp: '.24',
  },
  light: {
    bg1: '#f7faff', bg2: '#e9f1ff', border: '#c3d4ea', card: '#ffffff', cardStroke: '#b8cae4',
    text: '#14243c', muted: '#506684', faint: '#9aaccb', teal: '#0c9c84', violet: '#6b58ea',
    lilac: '#8f5ee8', pink: '#d1438f', term: '#fbfcff', termBar: '#eef3fb', red: '#e5485c',
    amber: '#e0a21c', green: '#22a95a', ball: '#ffffff', ballInk: '#14243c', haloOp: '.16',
  },
};

// The current chapter: shown in the terminal `whoami` and as the last timeline stop.
// Keep it generic and true; it closes the story as wider scope, not as a rank.
const NOW = {
  whoami: 'AI Engineer',
  year: '2026',
  head: 'What’s next',
  role: 'AI ENGINEER',
  d: ['A new chapter starts soon.', 'More on that shortly.'],
};

const SANS = "Inter,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'JetBrains Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pct = (t, T) => `${Math.min(100, Math.max(0, (t / T) * 100)).toFixed(2)}%`;

const REDUCED = (extra = '') =>
  `@media (prefers-reduced-motion: reduce){*{animation:none!important}${extra}}`;

function svg({ w, h, title, desc, css, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<style>${css}</style>
${body}
</svg>
`;
}

// Keyframes that keep an element hidden until `t0`, visible until `t1`, then hidden.
function showBetween(name, t0, t1, T, prop = 'opacity') {
  const a = pct(t0, T), b = pct(t0 + 0.01, T), c = pct(t1, T), d = pct(t1 + 0.3, T);
  return `@keyframes ${name}{0%,${a}{${prop}:0}${b},${c}{${prop}:1}${d},100%{${prop}:0}}`;
}

/* ------------------------------------------------------------------ hero */
function hero(c) {
  const T = 10; // seconds per loop
  const words = [
    { w: 'listens.', color: c.teal, at: 0.5 },
    { w: 'reasons.', color: c.violet, at: 1.7 },
    { w: 'acts.', color: c.pink, at: 2.9 },
  ];
  const wordCss = words
    .map((x, i) => `.w${i}{animation:w${i} ${T}s infinite}` +
      `@keyframes w${i}{0%,${pct(x.at, T)}{fill-opacity:0}${pct(x.at + 0.45, T)},${pct(8.6, T)}{fill-opacity:1}${pct(9.2, T)},100%{fill-opacity:0}}`)
    .join('');
  // node glow synced with each word: voice ↔ listens, agent ↔ reasons, tools ↔ acts
  const glowCss = words
    .map((x, i) => `.g${i}{animation:g${i} ${T}s infinite}` +
      `@keyframes g${i}{0%,${pct(x.at, T)}{opacity:0}${pct(x.at + 0.4, T)}{opacity:1}${pct(x.at + 2.2, T)},100%{opacity:0}}`)
    .join('');

  const edges = [
    'M790 90 C790 130 850 140 880 150',
    'M1020 150 C1050 140 1090 128 1090 90',
    'M790 260 C790 220 850 210 880 200',
    'M1020 200 C1050 210 1090 222 1090 260',
  ];
  const nodes = [
    { x: 790, y: 70, label: 'VOICE · STT/TTS', dot: c.teal, glow: 0 },
    { x: 1090, y: 70, label: 'TOOLS · MCP', dot: c.pink, glow: 2 },
    { x: 790, y: 280, label: 'DOCS · RAG', dot: c.violet },
    { x: 1090, y: 280, label: 'CLOUD · AWS', dot: c.teal },
  ];
  const bars = Array.from({ length: 9 }, (_, i) => {
    const h = [10, 18, 26, 14, 30, 20, 12, 24, 16][i];
    return `<rect class="bar" style="animation-delay:-${(i * 0.13).toFixed(2)}s" x="${958 + i * 7}" y="${175 - h / 2}" width="4" height="${h}" rx="2"/>`;
  }).join('');

  const css = `
text{font-family:${SANS}}
.mono{font-family:${MONO}}
${wordCss}${glowCss}
.flow{stroke-dasharray:3 97;animation:flow 2.6s linear infinite}
.flow.b{animation-delay:-1.3s}
@keyframes flow{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.bar{fill:url(#accent);transform-box:fill-box;transform-origin:center;animation:bar 1.1s ease-in-out infinite}
@keyframes bar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.4s ease-out infinite}
@keyframes ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.9);opacity:0}}
.cursor{animation:blink 1.06s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
${REDUCED('.flow,.g0,.g1,.g2{display:none}')}`;

  const body = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>
<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${c.violet}"/><stop offset=".55" stop-color="${c.lilac}"/><stop offset="1" stop-color="${c.teal}"/></linearGradient>
<radialGradient id="halo"><stop stop-color="${c.violet}" stop-opacity="${c.haloOp}"/><stop offset="1" stop-color="${c.violet}" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${c.border}"/></pattern>
<clipPath id="clip"><rect width="1200" height="340" rx="19"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="1200" height="340" fill="url(#bg)"/>
<rect x="680" width="520" height="340" fill="url(#dots)" opacity=".7"/>
<circle cx="950" cy="175" r="230" fill="url(#halo)"/>
<rect x="1" y="1" width="1198" height="338" rx="18" stroke="${c.border}" stroke-width="2" fill="none"/>
<path d="M31 71V31H74M1125 308h43v-39" stroke="${c.border}" stroke-width="2" fill="none"/>

<text x="64" y="62" fill="${c.teal}" font-size="15" font-weight="800" letter-spacing="2.2">JUAN DIEGO LONDOÑO · JUANDY</text>
<text x="62" y="134" fill="${c.text}" font-size="50" font-weight="800" letter-spacing="-1.8">I build AI that</text>
<text x="62" y="194" font-size="50" font-weight="800" letter-spacing="-1.8">${words.map((x, i) => `<tspan class="w${i}" fill="${x.color}">${x.w}</tspan>`).join(' ')}</text>
<text x="64" y="236" fill="${c.muted}" font-size="23" font-weight="600">— inside real software, not just demos.</text>
<path d="M66 266H640" stroke="${c.border}" stroke-width="2"/>
<text x="66" y="300" fill="${c.muted}" font-size="12.5" font-weight="800" letter-spacing="2">AI ENGINEER · AGENTS · REALTIME VOICE · DOCUMENT AI · AWS</text>

<g fill="none" stroke-width="2" stroke-linecap="round">
${edges.map((d) => `<path d="${d}" stroke="${c.cardStroke}"/>`).join('\n')}
${edges.map((d, i) => `<path class="flow${i % 2 ? ' b' : ''}" d="${d}" pathLength="100" stroke="${i % 2 ? c.teal : c.violet}" stroke-width="6"/>`).join('\n')}
</g>
${nodes.map((n) => `<g>
<rect x="${n.x - 75}" y="${n.y - 20}" width="150" height="40" rx="10" fill="${c.card}" stroke="${c.cardStroke}"/>
${n.glow !== undefined ? `<rect class="g${n.glow}" x="${n.x - 75}" y="${n.y - 20}" width="150" height="40" rx="10" fill="none" stroke="${n.dot}" stroke-width="2"/>` : ''}
<circle cx="${n.x - 57}" cy="${n.y}" r="5" fill="${n.dot}"/>
<text x="${n.x - 44}" y="${n.y + 4.5}" fill="${c.text}" font-size="12" font-weight="700" letter-spacing="1">${esc(n.label)}</text>
</g>`).join('\n')}
<g>
<circle class="ring" cx="950" cy="175" r="44" fill="none" stroke="${c.violet}" stroke-width="1.5"/>
<rect x="865" y="143" width="170" height="64" rx="14" fill="${c.card}" stroke="${c.violet}" stroke-width="1.5"/>
<rect class="g1" x="865" y="143" width="170" height="64" rx="14" fill="none" stroke="${c.lilac}" stroke-width="3"/>
<text x="884" y="172" fill="${c.text}" font-size="14" font-weight="800" letter-spacing="1.5">AGENT</text>
<text x="884" y="190" fill="${c.muted}" font-size="10.5" font-weight="700" letter-spacing="1" class="mono">claude</text>
<text x="937" y="190" fill="${c.teal}" font-size="10.5" font-weight="700" class="cursor mono">▍</text>
${bars}
</g>
<text x="1160" y="44" fill="${c.faint}" font-size="11" text-anchor="end" class="mono">6.24°N 75.58°W</text>
</g>`;

  return svg({
    w: 1200, h: 340,
    title: 'Juan Diego Londoño (Juandy) — I build AI that listens, reasons and acts',
    desc: 'Animated banner: the tagline appears word by word while data flows between an AI agent and its voice, tools, retrieval and cloud nodes.',
    css, body,
  });
}

/* -------------------------------------------------------------- terminal */
function terminal(c) {
  const CPS = 0.05; // seconds per typed character
  const items = [
    { k: 'cmd', t: 'whoami' },
    { k: 'out', t: [['juandy', c.text], [` — ${NOW.whoami} · Medellín, Colombia · `, c.muted], ['6.24°N 75.58°W', c.teal]] },
    { k: 'cmd', t: 'cat principles.txt' },
    { k: 'out', t: [['→ ', c.violet], ['architecture before implementation', c.muted]] },
    { k: 'out', t: [['→ ', c.violet], ['every AI feature ships with a latency, cost & failure budget', c.muted]] },
    { k: 'out', t: [['→ ', c.violet], ['production-grade from the first commit', c.muted]] },
    { k: 'cmd', t: 'claude "review this agent before it ships"', note: '  # every PR still gets human eyes' },
    { k: 'out', t: [['✓ ', c.green], ['3 suggestions · 0 surprises in prod ', c.muted], ['(that’s the goal, anyway)', c.faint]] },
    { k: 'cmd', t: 'uptime --off-the-clock' },
    { k: 'out', t: [['linux tinkerer', c.teal], [' · ', c.muted], ['automation experiments', c.amber], [' · ', c.muted], ['ES / EN', c.violet]] },
  ];
  const X = 44, Y0 = 96, LH = 33, FS = 20, CW = FS * 0.62;
  let t = 0.6;
  const timed = items.map((it) => {
    const start = t;
    const dur = it.k === 'cmd' ? it.t.length * CPS : 0;
    t += dur + (it.k === 'cmd' ? 0.45 : 0.3);
    return { ...it, start, end: start + dur };
  });
  const finalAt = t;
  const T = Math.ceil(finalAt + 5); // hold the full screen ~5s, then loop
  const css = [
    `text{font-family:${MONO};font-size:${FS}px}`,
    `.screen{animation:screen ${T}s infinite}`,
    `@keyframes screen{0%,${pct(T - 0.8, T)}{opacity:1}${pct(T - 0.2, T)},100%{opacity:0}}`,
    `.blink{animation:blink 1.06s steps(1) infinite}@keyframes blink{50%{opacity:0}}`,
  ];
  const lines = timed.map((it, i) => {
    const y = Y0 + i * LH;
    css.push(`.l${i}{animation:l${i} ${T}s infinite}` +
      `@keyframes l${i}{0%,${pct(it.start, T)}{opacity:0}${pct(it.start + 0.01, T)},100%{opacity:1}}`);
    if (it.k === 'out') {
      return `<text class="l${i}" x="${X}" y="${y}" xml:space="preserve">${it.t.map(([s, col]) => `<tspan fill="${col}">${esc(s)}</tspan>`).join('')}</text>`;
    }
    const cmdX = X + 2 * CW;
    const typedW = it.t.length * CW;
    const n = it.t.length;
    css.push(`.c${i}{animation:c${i} ${T}s infinite}` +
      `@keyframes c${i}{0%,${pct(it.start, T)}{transform:translateX(0);animation-timing-function:steps(${n},end)}` +
      `${pct(it.end, T)},100%{transform:translateX(${typedW.toFixed(1)}px)}}`);
    // the note (comment) appears once the command is typed
    css.push(`.n${i}{animation:n${i} ${T}s infinite}` +
      `@keyframes n${i}{0%,${pct(it.end, T)}{opacity:0}${pct(it.end + 0.01, T)},100%{opacity:1}}`);
    // the cover's background is dropped once typing ends so it never hides the comment
    css.push(`.e${i}{animation:e${i} ${T}s infinite}` +
      `@keyframes e${i}{0%,${pct(it.end, T)}{opacity:1}${pct(it.end + 0.01, T)},100%{opacity:0}}`);
    // a typing caret that rides on the cover's left edge, hidden once the next line starts
    const next = timed[i + 1] ? timed[i + 1].start : finalAt;
    css.push(`.k${i}{animation:k${i} ${T}s infinite}` +
      `@keyframes k${i}{0%,${pct(it.start, T)}{opacity:0}${pct(it.start + 0.01, T)},${pct(next, T)}{opacity:1}${pct(next + 0.01, T)},100%{opacity:0}}`);
    return `<g class="l${i}">
<text x="${X}" y="${y}" xml:space="preserve"><tspan fill="${c.violet}">$ </tspan><tspan fill="${c.text}">${esc(it.t)}</tspan>${it.note ? `<tspan class="n${i}" fill="${c.faint}">${esc(it.note)}</tspan>` : ''}</text>
<g class="c${i} cover"><rect x="${cmdX}" y="${y - FS + 1}" width="${(typedW + CW).toFixed(1)}" class="e${i}" height="${LH - 4}" fill="${c.term}"/><rect class="k${i} caret" x="${cmdX}" y="${y - FS + 3}" width="${(CW * 0.55).toFixed(1)}" height="${FS + 2}" fill="${c.teal}"/></g>
</g>`;
  });
  const yEnd = Y0 + timed.length * LH;
  css.push(`.lf{animation:lf ${T}s infinite}@keyframes lf{0%,${pct(finalAt, T)}{opacity:0}${pct(finalAt + 0.01, T)},100%{opacity:1}}`);
  css.push(REDUCED('.cover{display:none}'));
  const H = yEnd + 34;
  const body = `<defs><clipPath id="clip"><rect width="1200" height="${H}" rx="16"/></clipPath></defs>
<g clip-path="url(#clip)">
<rect width="1200" height="${H}" fill="${c.term}"/>
<rect width="1200" height="44" fill="${c.termBar}"/>
<path d="M0 44H1200" stroke="${c.border}"/>
<circle cx="28" cy="22" r="7" fill="${c.red}"/><circle cx="52" cy="22" r="7" fill="${c.amber}"/><circle cx="76" cy="22" r="7" fill="${c.green}"/>
<text x="600" y="27.5" fill="${c.muted}" font-size="14" text-anchor="middle">juandy@medellin: ~</text>
<g class="screen">
${lines.join('\n')}
<g class="lf"><text x="${X}" y="${yEnd}"><tspan fill="${c.violet}">$ </tspan></text><rect class="blink" x="${X + 2 * CW}" y="${yEnd - FS + 3}" width="${(CW * 0.55).toFixed(1)}" height="${FS + 2}" fill="${c.teal}"/></g>
</g>
<rect x=".75" y=".75" width="1198.5" height="${H - 1.5}" rx="15.5" fill="none" stroke="${c.border}" stroke-width="1.5"/>
</g>`;
  return svg({
    w: 1200, h: H,
    title: 'whoami — an animated terminal',
    desc: 'A terminal types out who Juandy is: an AI Engineer in Medellín, his engineering principles, Claude Code as his main tool, and that off the clock he is a Linux tinkerer who runs automation experiments.',
    css: css.join('\n'), body,
  });
}

/* ------------------------------------------------------------- lab cards */
function cardShell(c, { kicker, pill, pillColor, title, sub, cta, inner, css, aria }) {
  const W = 600, H = 340;
  const body = `<defs>
<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${c.violet}"/><stop offset=".55" stop-color="${c.lilac}"/><stop offset="1" stop-color="${c.teal}"/></linearGradient>
<clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="${c.card}"/>
<rect width="${W}" height="4" fill="url(#accent)"/>
<text x="36" y="52" fill="${c.teal}" font-size="13" font-weight="800" letter-spacing="2">${kicker}</text>
<g><rect x="${W - 36 - (pill.length * 10.6 + 36)}" y="33" width="${pill.length * 10.6 + 36}" height="26" rx="13" fill="none" stroke="${c.cardStroke}"/>
<circle class="live" cx="${W - 36 - (pill.length * 10.6 + 36) + 16}" cy="46" r="4.5" fill="${pillColor}"/>
<text x="${W - 36 - (pill.length * 10.6 + 36) + 27}" y="50.5" fill="${c.muted}" font-size="12" font-weight="800" letter-spacing="1.5">${pill}</text></g>
<text x="34" y="102" fill="${c.text}" font-size="36" font-weight="800" letter-spacing="-1">${esc(title)}</text>
${sub.map((s, i) => `<text x="36" y="${136 + i * 25}" fill="${c.muted}" font-size="18">${esc(s)}</text>`).join('\n')}
${inner}
<g><rect x="36" y="290" width="${cta.length * 9.6 + 56}" height="32" rx="16" fill="${c.violet}"/>
<path d="M54 299.5l9 6.5-9 6.5z" fill="${c.card}"/>
<text x="72" y="311" fill="${c.card}" font-size="15" font-weight="800" class="mono">${esc(cta)}</text></g>
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="17.5" fill="none" stroke="${c.cardStroke}" stroke-width="1.5"/>
</g>`;
  const allCss = `text{font-family:${SANS}}.mono{font-family:${MONO}}
.live{transform-box:fill-box;transform-origin:center;animation:live 1.6s ease-in-out infinite}
@keyframes live{50%{opacity:.25;transform:scale(.7)}}
${css}
${REDUCED('.cover{display:none}')}`;
  return svg({ w: W, h: H, title: aria[0], desc: aria[1], css: allCss, body });
}

function labVoice(c) {
  const T = 8;
  const N = 34;
  const bars = Array.from({ length: N }, (_, i) => {
    const env = Math.sin((i / (N - 1)) * Math.PI);
    const h = 10 + Math.round(env * (34 + ((i * 37) % 23)));
    return `<rect class="vb" style="animation-delay:-${((i % 7) * 0.17 + i * 0.03).toFixed(2)}s" x="${38 + i * 15.6}" y="${222 - h / 2}" width="8" height="${h}" rx="4"/>`;
  }).join('');
  const caption = '“So, what did Juandy build for drive-thrus?”';
  const CW = 15 * 0.6;
  const typeStart = 0.6, typeEnd = typeStart + caption.length * 0.055;
  const css = `.vb{fill:url(#accent);transform-box:fill-box;transform-origin:center;animation:vb 1.2s ease-in-out infinite}
@keyframes vb{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
.cap{animation:cap ${T}s infinite}
@keyframes cap{0%,${pct(typeStart, T)}{transform:translateX(0);animation-timing-function:steps(${caption.length},end)}${pct(typeEnd, T)},${pct(T - 0.6, T)}{transform:translateX(${(caption.length * CW + 4).toFixed(1)}px)}${pct(T - 0.59, T)},100%{transform:translateX(0)}}`;
  const inner = `${bars}
<text x="38" y="275" fill="${c.text}" font-size="15" class="mono">${esc(caption)}</text>
<rect class="cap cover" x="38" y="260" width="${(caption.length * CW + 30).toFixed(0)}" height="22" fill="${c.card}"/>`;
  return cardShell(c, {
    kicker: 'VOICE LAB', pill: 'LIVE', pillColor: c.red, title: 'Talk to Sophie',
    sub: ['A realtime voice agent that knows my work.', 'Interrupt her mid-sentence — she’ll stop.'],
    cta: 'juandlch.dev/lab/voice', inner, css,
    aria: ['Voice Lab — talk to Sophie', 'Card linking to a live realtime voice agent demo; an animated waveform and a typed caption.'],
  });
}

function labChat(c) {
  const T = 7;
  const steps = [
    { a: 'read', b: 'invoice.pdf → OCR', ms: '0.8s', t0: 0.4 },
    { a: 'call', b: 'search_docs("refund policy")', ms: '1.2s', t0: 1.6 },
    { a: 'draft', b: 'answer + cite 2 sources', ms: '0.6s', t0: 2.8 },
  ];
  const css = [];
  const rows = steps.map((s, i) => {
    const y = 210 + i * 26;
    const done = s.t0 + 1.0;
    css.push(`.sp${i}{transform-box:view-box;transform-origin:46px ${y - 5}px;animation:spin .8s linear infinite,sp${i} ${T}s infinite}`);
    css.push(`@keyframes sp${i}{0%,${pct(s.t0, T)}{opacity:0}${pct(s.t0 + 0.01, T)},${pct(done, T)}{opacity:1}${pct(done + 0.01, T)},100%{opacity:0}}`);
    css.push(`.ok${i}{animation:ok${i} ${T}s infinite}@keyframes ok${i}{0%,${pct(done, T)}{opacity:0}${pct(done + 0.15, T)},${pct(T - 0.5, T)}{opacity:1}${pct(T - 0.2, T)},100%{opacity:0}}`);
    css.push(`.row${i}{animation:row${i} ${T}s infinite}@keyframes row${i}{0%,${pct(s.t0, T)}{opacity:.25}${pct(s.t0 + 0.2, T)},${pct(T - 0.5, T)}{opacity:1}${pct(T - 0.2, T)},100%{opacity:.25}}`);
    return `<g>
<circle cx="46" cy="${y - 5}" r="8" fill="none" stroke="${c.cardStroke}" stroke-width="2"/>
<path class="sp${i}" d="M46 ${y - 13}a8 8 0 0 1 8 8" fill="none" stroke="${c.violet}" stroke-width="2.5" stroke-linecap="round"/>
<g class="ok${i}"><circle cx="46" cy="${y - 5}" r="9" fill="${c.teal}"/><path d="M42 ${y - 5}l3 3 5.5-6" fill="none" stroke="${c.card}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>
<text class="row${i} mono" x="66" y="${y}" font-size="15" xml:space="preserve"><tspan fill="${c.violet}" font-weight="700">${s.a.padEnd(6)}</tspan><tspan fill="${c.text}">${esc(s.b)}</tspan></text>
<text class="ok${i} mono" x="564" y="${y}" font-size="13" fill="${c.faint}" text-anchor="end">${s.ms}</text>
</g>`;
  });
  css.push('@keyframes spin{to{transform:rotate(360deg)}}');
  return cardShell(c, {
    kicker: 'CHAT LAB', pill: 'MULTIMODAL', pillColor: c.teal, title: 'Watch the agent think',
    sub: ['Text, images, docs and audio —', 'every step shown live.'],
    cta: 'juandlch.dev/lab/chat', inner: rows.join('\n'), css: css.join('\n'),
    aria: ['Chat Lab — watch the agent think', 'Card linking to a live multimodal chat demo; agent steps tick off one by one: read a file, call a tool, draft a cited answer.'],
  });
}

/* -------------------------------------------------------------- timeline */
function timeline(c) {
  const W = 1200, H = 250, Y = 88;
  // Big line = what was being built; small caps = role · company (no rank ladder, start years only).
  const stops = [
    { year: '2022', head: 'Software that runs a business', role: 'FULL STACK · STELLION TECH', d: ['Two ERP systems,', 'end to end'] },
    { year: '2023', head: 'Systems that talk to each other', role: 'FULL STACK · TRADE EC', d: ['APIs, integrations', 'and data on AWS'] },
    { year: '2024', head: 'AI that ships to production', role: 'LEAD AI ENGINEER · TRADE EC', d: ['Led the team: agents, voice,', 'document AI, AWS architecture'] },
    NOW,
  ].map((s, i) => ({ ...s, x: 150 + i * 300 }));
  const lastX = stops[stops.length - 1].x;
  const css = [`text{font-family:${SANS}}.mono{font-family:${MONO}}`,
    `.draw{stroke-dasharray:100;animation:draw 2.6s cubic-bezier(.6,.1,.3,1) both}`,
    `@keyframes draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}`,
    `.ring{transform-box:fill-box;transform-origin:center;animation:ring 2s ease-out 2.6s infinite both}`,
    `@keyframes ring{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.4);opacity:0}}`];
  const body = stops.map((s, i) => {
    const delay = (0.15 + ((s.x - 150) / (lastX - 150)) * 2.3).toFixed(2);
    css.push(`.s${i}{animation:pop .5s ease-out ${delay}s both}`);
    const last = i === stops.length - 1;
    return `<g class="s${i}">
${last ? `<circle class="ring" cx="${s.x}" cy="${Y}" r="11" fill="none" stroke="${c.teal}" stroke-width="2"/>` : ''}
<circle cx="${s.x}" cy="${Y}" r="${last ? 10 : 8}" fill="${last ? c.teal : c.card}" stroke="${last ? c.teal : c.violet}" stroke-width="3"/>
<text x="${s.x}" y="${Y - 32}" fill="${last ? c.teal : c.violet}" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1.5" class="mono">${s.year}</text>
<text x="${s.x}" y="${Y + 46}" fill="${c.text}" font-size="17.5" font-weight="800" text-anchor="middle" letter-spacing="-.2">${esc(s.head)}</text>
<text x="${s.x}" y="${Y + 72}" fill="${last ? c.teal : c.violet}" font-size="11.5" font-weight="800" text-anchor="middle" letter-spacing="1.6">${esc(s.role)}</text>
${s.d.map((l, j) => `<text x="${s.x}" y="${Y + 100 + j * 21}" fill="${c.muted}" font-size="14.5" text-anchor="middle">${esc(l)}</text>`).join('\n')}
</g>`;
  }).join('\n');
  css.push(`@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`);
  css.push(REDUCED());
  return svg({
    w: W, h: H,
    title: 'Career timeline, 2022 to today',
    desc: stops.map((s) => `${s.year}: ${s.head} (${s.role.toLowerCase()})`).join('; '),
    css: css.join('\n'),
    body: `<defs><linearGradient id="accent" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="${lastX}" y2="0"><stop stop-color="${c.violet}"/><stop offset=".55" stop-color="${c.lilac}"/><stop offset="1" stop-color="${c.teal}"/></linearGradient></defs>
<path d="M40 ${Y}H1160" stroke="${c.border}" stroke-width="3" stroke-linecap="round"/>
<path class="draw" d="M40 ${Y}H${lastX}" pathLength="100" stroke="url(#accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M${lastX + 14} ${Y}H1170" stroke="${c.teal}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round" opacity=".6"/>
${body}`,
  });
}

/* ---------------------------------------------------------------- footer */
function footer(c) {
  // "Useful AI over impressive demos": a change travels demo → evals → review → prod
  const T = 5.5;
  const W = 1200, H = 210, Y = 96;
  const stages = ['demo', 'evals', 'review', 'prod'].map((label, i) => ({ label, x: 690 + i * 145 }));
  const t0 = 0.4, hop = 0.9; // packet reaches stage i at t0 + i*hop
  const css = [`text{font-family:${SANS}}.mono{font-family:${MONO}}`,
    `.pk{animation:pk ${T}s linear infinite}`,
    `@keyframes pk{0%,${pct(t0, T)}{transform:translateX(0);opacity:1}${pct(t0 + 3 * hop, T)}{transform:translateX(${3 * 145}px);opacity:1}${pct(t0 + 3 * hop + 0.3, T)},100%{transform:translateX(${3 * 145}px);opacity:0}}`,
    `.ship{transform-box:fill-box;transform-origin:center;animation:ship ${T}s ease-out infinite}`,
    `@keyframes ship{0%,${pct(t0 + 3 * hop, T)}{opacity:0;transform:scale(.6)}${pct(t0 + 3 * hop + 0.25, T)}{opacity:1;transform:scale(1.1)}${pct(t0 + 3 * hop + 0.45, T)},${pct(T - 0.5, T)}{opacity:1;transform:scale(1)}${pct(T - 0.2, T)},100%{opacity:0}}`,
    `.ring{transform-box:fill-box;transform-origin:center;animation:ring 1.6s ease-out infinite}`,
    `@keyframes ring{0%{transform:scale(.7);opacity:.8}100%{transform:scale(2.2);opacity:0}}`];
  const nodes = stages.map((s, i) => {
    const at = t0 + i * hop;
    css.push(`.ok${i}{animation:ok${i} ${T}s infinite}@keyframes ok${i}{0%,${pct(at, T)}{opacity:0}${pct(at + 0.12, T)},${pct(T - 0.5, T)}{opacity:1}${pct(T - 0.2, T)},100%{opacity:0}}`);
    const last = i === stages.length - 1;
    return `<g>
${last ? `<circle class="ring ok${i}" cx="${s.x}" cy="${Y}" r="16" fill="none" stroke="${c.teal}" stroke-width="2"/>` : ''}
<circle cx="${s.x}" cy="${Y}" r="16" fill="${c.card}" stroke="${c.cardStroke}" stroke-width="2"/>
<g class="ok${i}"><circle cx="${s.x}" cy="${Y}" r="16" fill="${last ? c.teal : c.violet}"/><path d="M${s.x - 6} ${Y}l4 4 8-9" fill="none" stroke="${c.card}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>
<text x="${s.x}" y="${Y + 42}" fill="${last ? c.teal : c.muted}" font-size="14" font-weight="700" text-anchor="middle" class="mono">${s.label}</text>
</g>`;
  }).join('\n');
  css.push(REDUCED('.pk{display:none}'));
  const body = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>
<clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17" stroke="${c.border}" stroke-width="2" fill="none"/>
<text x="56" y="82" fill="${c.text}" font-size="34" font-weight="800" letter-spacing="-1">Useful AI over impressive demos.</text>
<text x="58" y="118" fill="${c.muted}" font-size="18">A demo is step one. Evals, review and production are the job.</text>
<text x="58" y="160" fill="${c.faint}" font-size="13" letter-spacing="1" class="mono">MEDELLÍN, CO · 6.24°N 75.58°W · ES / EN</text>
<path d="M${stages[0].x} ${Y}H${stages[3].x}" stroke="${c.border}" stroke-width="3" stroke-linecap="round"/>
<circle class="pk" cx="${stages[0].x}" cy="${Y}" r="6" fill="${c.lilac}"/>
${nodes}
<g class="ship"><rect x="${stages[3].x - 52}" y="${Y - 58}" width="104" height="26" rx="13" fill="${c.teal}"/>
<text x="${stages[3].x}" y="${Y - 40}" fill="${c.card}" font-size="12.5" font-weight="900" letter-spacing="2" text-anchor="middle">SHIPPED</text></g>
</g>`;
  return svg({
    w: W, h: H,
    title: 'Useful AI over impressive demos',
    desc: 'Footer: a change travels from demo to evals to review to production, where it is marked shipped. Based in Medellín, Colombia.',
    css: css.join('\n'), body,
  });
}

/* ------------------------------------------------------- case-file flows */
// Small architecture diagrams for the "What I've shipped" case files. They are
// images rather than Mermaid because GitHub's Mermaid renderer breaks inside
// collapsed <details> (spinners that never finish, zero-size diagrams).
// Node kinds: io (pill), step (card), agent (violet card), db (cylinder).
function flow({ h, nodes, edges, title, desc }) {
  return (c) => {
    const W = 1200;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, { w: 190, h: n.sub ? 56 : 44, ...n }]));
    const css = [`text{font-family:${SANS}}`,
      `.flow{stroke-dasharray:2 98;animation:flow 2.4s linear infinite}`,
      `@keyframes flow{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}`,
      `.march{animation:march 1s linear infinite}@keyframes march{to{stroke-dashoffset:-12}}`,
      REDUCED('.flow{display:none}')];
    const edgeSvg = edges.map((e, i) => {
      const dashed = e.dashed ? ' stroke-dasharray="6 6" class="march"' : '';
      const base = `<path d="${e.d}" fill="none" stroke="${e.dashed ? c.faint : c.cardStroke}" stroke-width="2"${dashed} marker-end="url(#arrow${e.dashed ? 'D' : ''})"/>`;
      const pkt = e.dashed ? '' : `<path class="flow" style="animation-delay:-${((i * 0.37) % 2.4).toFixed(2)}s" d="${e.d}" pathLength="100" fill="none" stroke="${i % 2 ? c.teal : c.violet}" stroke-width="6" stroke-linecap="round"/>`;
      const label = e.label ? (() => {
        const [lx, ly] = e.at; const lw = e.label.length * 7.4 + 18;
        return `<rect x="${lx - lw / 2}" y="${ly - 12}" width="${lw}" height="22" rx="11" fill="${c.bg2}" stroke="${c.border}"/><text x="${lx}" y="${ly + 3.5}" fill="${c.muted}" font-size="12" font-weight="600" text-anchor="middle">${esc(e.label)}</text>`;
      })() : '';
      return base + pkt + label;
    }).join('\n');
    const nodeSvg = Object.values(byId).map((n) => {
      const x = n.x - n.w / 2, y = n.y - n.h / 2;
      const stroke = n.kind === 'agent' ? c.violet : n.kind === 'io' ? c.teal : c.cardStroke;
      const rx = n.kind === 'io' ? n.h / 2 : 10;
      const shape = n.kind === 'db'
        ? `<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="10" fill="${c.card}" stroke="${stroke}" stroke-width="1.5"/><path d="M${x + 8} ${y + 9}Q${n.x} ${y + 19} ${x + n.w - 8} ${y + 9}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`
        : `<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="${rx}" fill="${c.card}" stroke="${stroke}" stroke-width="${n.kind === 'agent' ? 2 : 1.5}"/>`;
      const ty = n.sub ? n.y - 3 : n.y + 5;
      return `<g>${shape}
<text x="${n.x}" y="${ty + (n.kind === 'db' ? 3 : 0)}" fill="${c.text}" font-size="15" font-weight="700" text-anchor="middle">${esc(n.label)}</text>
${n.sub ? `<text x="${n.x}" y="${n.y + 16}" fill="${c.muted}" font-size="12.5" text-anchor="middle">${esc(n.sub)}</text>` : ''}</g>`;
    }).join('\n');
    const body = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>
<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c.cardStroke}"/></marker>
<marker id="arrowD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c.faint}"/></marker>
<clipPath id="clip"><rect width="${W}" height="${h}" rx="16"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${h}" fill="url(#bg)"/>
<rect x="1" y="1" width="${W - 2}" height="${h - 2}" rx="15" stroke="${c.border}" stroke-width="2" fill="none"/>
${edgeSvg}
${nodeSvg}
</g>`;
    return svg({ w: W, h, title, desc, css: css.join('\n'), body });
  };
}

const caseDriveThru = flow({
  h: 320,
  title: 'Drive-thru voice AI architecture',
  desc: 'The customer speaks; Deepgram streams speech to text; a Claude agent handles turn-taking, calls the order API, and answers through ElevenLabs voice. The customer can interrupt mid-sentence.',
  nodes: [
    { id: 'c', x: 140, y: 150, label: 'Customer speaks', kind: 'io', w: 200 },
    { id: 'stt', x: 420, y: 62, label: 'Deepgram', sub: 'streaming STT' },
    { id: 'a', x: 650, y: 150, label: 'Claude agent', sub: 'turn-taking', kind: 'agent' },
    { id: 'pos', x: 1010, y: 62, label: 'Order / POS API', kind: 'db', w: 200 },
    { id: 'tts', x: 1010, y: 250, label: 'ElevenLabs', sub: 'voice' },
  ],
  edges: [
    { d: 'M140 128C140 80 220 62 318 62', label: 'audio stream', at: [200, 80] },
    { d: 'M522 62C600 62 650 90 650 116' },
    { d: 'M748 140C820 130 860 62 904 62', label: 'tool call', at: [826, 104] },
    { d: 'M748 162C820 175 860 250 908 250' },
    { d: 'M908 262C700 312 300 312 150 176', label: 'speaks back', at: [520, 292] },
    { d: 'M244 150H548', dashed: true, label: 'interrupts mid-sentence', at: [396, 150] },
  ],
});

const caseWhatsApp = flow({
  h: 320,
  title: 'Insurance assistant on WhatsApp',
  desc: 'A WhatsApp user writes; Meta WhatsApp Cloud API sends a webhook to the conversation flows, which handle policy lookups, coverage checks and claims against the insurer systems, then reply.',
  nodes: [
    { id: 'u', x: 115, y: 150, label: 'WhatsApp user', kind: 'io', w: 170 },
    { id: 'm', x: 345, y: 150, label: 'Meta WhatsApp', sub: 'Cloud API' },
    { id: 'r', x: 590, y: 150, label: 'Conversation', sub: 'flows', kind: 'agent', w: 180 },
    { id: 'p', x: 840, y: 62, label: 'Policy lookup', w: 180 },
    { id: 'cv', x: 840, y: 150, label: 'Coverage check', w: 180 },
    { id: 'cl', x: 840, y: 238, label: 'Claims', w: 180 },
    { id: 'i', x: 1075, y: 150, label: 'Insurer systems', kind: 'db', w: 190 },
  ],
  edges: [
    { d: 'M200 150H248' },
    { d: 'M442 142H498', label: 'webhook', at: [470, 118] },
    { d: 'M680 140C710 120 720 62 748 62' },
    { d: 'M682 150H748' },
    { d: 'M680 160C710 180 720 238 748 238' },
    { d: 'M932 62C960 62 975 110 978 140' },
    { d: 'M932 150H978' },
    { d: 'M932 238C960 238 975 190 978 160' },
    { d: 'M560 178C520 240 400 240 360 180', dashed: true, label: 'reply', at: [460, 226] },
  ],
});

const caseClassEval = flow({
  h: 170,
  title: 'Automated class evaluation pipeline',
  desc: 'A class recording goes to Amazon Transcribe, Step Functions orchestrates evaluation agents, and they return a JSON report to the client app.',
  nodes: [
    { id: 'v', x: 110, y: 85, label: 'Class recording', kind: 'io', w: 175 },
    { id: 'tr', x: 330, y: 85, label: 'Amazon', sub: 'Transcribe', w: 170 },
    { id: 'sf', x: 545, y: 85, label: 'Step Functions', sub: 'orchestration', w: 175 },
    { id: 'e', x: 765, y: 85, label: 'Evaluation', sub: 'agents', kind: 'agent', w: 170 },
    { id: 'j', x: 965, y: 85, label: 'JSON report', w: 150 },
    { id: 'app', x: 1115, y: 85, label: 'Client app', kind: 'io', w: 130 },
  ],
  edges: [
    { d: 'M198 85H243' },
    { d: 'M415 85H456' },
    { d: 'M633 85H678' },
    { d: 'M850 85H888' },
    { d: 'M1040 85H1048' },
  ],
});

const caseRag = flow({
  h: 230,
  title: 'Cinema assistant retrieval loop',
  desc: 'A question is rewritten, searched with hybrid keyword and vector search, reranked, and checked by a validator agent; grounded answers become recommendations, otherwise the loop tries again.',
  nodes: [
    { id: 'q', x: 95, y: 90, label: 'Question', kind: 'io', w: 130 },
    { id: 'rw', x: 285, y: 90, label: 'Query rewrite', w: 170 },
    { id: 'h', x: 490, y: 90, label: 'Hybrid search', sub: 'keyword + vector', w: 180 },
    { id: 'rr', x: 680, y: 90, label: 'Rerank', w: 140 },
    { id: 'va', x: 870, y: 90, label: 'Validator agent', sub: 'grounded?', kind: 'agent', w: 180 },
    { id: 'ans', x: 1090, y: 90, label: 'Answer +', sub: 'recommendation', kind: 'io', w: 170 },
  ],
  edges: [
    { d: 'M160 90H198' },
    { d: 'M370 90H398' },
    { d: 'M580 90H608' },
    { d: 'M750 90H778' },
    { d: 'M960 90H1003', label: 'yes', at: [982, 66] },
    { d: 'M870 118C870 200 285 200 285 114', dashed: true, label: 'no, try again', at: [578, 178] },
  ],
});

const BUILDERS = {
  hero, terminal, 'lab-voice': labVoice, 'lab-chat': labChat, timeline, footer,
  'case-drivethru': caseDriveThru, 'case-whatsapp': caseWhatsApp,
  'case-classeval': caseClassEval, 'case-rag': caseRag,
};
for (const [name, build] of Object.entries(BUILDERS)) {
  for (const [theme, colors] of Object.entries(THEMES)) {
    const file = join(OUT, `${name}-${theme}.svg`);
    writeFileSync(file, build(colors));
    console.log(`wrote ${file}`);
  }
}
