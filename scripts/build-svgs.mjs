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
<text x="66" y="300" fill="${c.muted}" font-size="12.5" font-weight="800" letter-spacing="2">LEAD AI ENGINEER · AGENTS · REALTIME VOICE · DOCUMENT AI · AWS</text>

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
    { k: 'out', t: [['juandy', c.text], [' — Lead AI Engineer · Medellín, Colombia · ', c.muted], ['6.24°N 75.58°W', c.teal]] },
    { k: 'cmd', t: 'cat principles.txt' },
    { k: 'out', t: [['→ ', c.violet], ['architecture before implementation', c.muted]] },
    { k: 'out', t: [['→ ', c.violet], ['every AI feature ships with a latency, cost & failure budget', c.muted]] },
    { k: 'out', t: [['→ ', c.violet], ['production-grade from the first commit', c.muted]] },
    { k: 'cmd', t: 'claude "review this agent before it ships"', note: '  # every PR still gets human eyes' },
    { k: 'out', t: [['✓ ', c.green], ['3 suggestions · 0 surprises in prod ', c.muted], ['(that’s the goal, anyway)', c.faint]] },
    { k: 'cmd', t: 'uptime --off-the-clock' },
    { k: 'out', t: [['goalkeeper', c.amber], [' (yes, I dive) · ', c.muted], ['linux tinkerer', c.teal], [' · automation experiments', c.muted]] },
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
    desc: 'A terminal types out who Juandy is: Lead AI Engineer in Medellín, his engineering principles, Claude Code as his main tool, and that he is a goalkeeper and Linux tinkerer off the clock.',
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
    css.push(`.sp${i}{transform-box:fill-box;transform-origin:center;animation:spin .8s linear infinite,sp${i} ${T}s infinite}`);
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
  const W = 1200, H = 240, Y = 92;
  const stops = [
    { x: 150, year: '2022', role: 'Full Stack', d: ['Stellion Tech · two ERP', 'systems, end to end'] },
    { x: 450, year: '2023', role: 'Cloud & Backend', d: ['Trade EC / TRD Global', 'APIs, integrations, data'] },
    { x: 750, year: '2024', role: 'AI Engineering', d: ['Agents, document search,', 'OCR and voice in products'] },
    { x: 1050, year: '2024 – NOW', role: 'Lead AI Engineer', d: ['Team lead · AI consulting', 'AWS architecture'] },
  ];
  const css = [`text{font-family:${SANS}}.mono{font-family:${MONO}}`,
    `.draw{stroke-dasharray:100;animation:draw 2.6s cubic-bezier(.6,.1,.3,1) both}`,
    `@keyframes draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}`,
    `.ring{transform-box:fill-box;transform-origin:center;animation:ring 2s ease-out 2.6s infinite both}`,
    `@keyframes ring{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.4);opacity:0}}`];
  const body = stops.map((s, i) => {
    const delay = (0.15 + ((s.x - 150) / 900) * 2.3).toFixed(2);
    css.push(`.s${i}{animation:pop .5s ease-out ${delay}s both}`);
    const last = i === stops.length - 1;
    return `<g class="s${i}">
${last ? `<circle class="ring" cx="${s.x}" cy="${Y}" r="11" fill="none" stroke="${c.teal}" stroke-width="2"/>` : ''}
<circle cx="${s.x}" cy="${Y}" r="${last ? 10 : 8}" fill="${last ? c.teal : c.card}" stroke="${last ? c.teal : c.violet}" stroke-width="3"/>
<text x="${s.x}" y="${Y - 32}" fill="${last ? c.teal : c.violet}" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1.5" class="mono">${s.year}</text>
<text x="${s.x}" y="${Y + 48}" fill="${c.text}" font-size="22" font-weight="800" text-anchor="middle">${esc(s.role)}</text>
${s.d.map((l, j) => `<text x="${s.x}" y="${Y + 76 + j * 22}" fill="${c.muted}" font-size="16" text-anchor="middle">${esc(l)}</text>`).join('\n')}
</g>`;
  }).join('\n');
  css.push(`@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`);
  css.push(REDUCED());
  return svg({
    w: W, h: H,
    title: 'Career timeline 2022 – now',
    desc: '2022 Full Stack at Stellion Tech; 2023 Cloud & Backend at Trade EC / TRD Global; 2024 AI Engineering; 2024 to now Lead AI Engineer.',
    css: css.join('\n'),
    body: `<defs><linearGradient id="accent" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="1050" y2="0"><stop stop-color="${c.violet}"/><stop offset=".55" stop-color="${c.lilac}"/><stop offset="1" stop-color="${c.teal}"/></linearGradient></defs>
<path d="M60 ${Y}H1140" stroke="${c.border}" stroke-width="3" stroke-linecap="round"/>
<path class="draw" d="M60 ${Y}H1050" pathLength="100" stroke="url(#accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M1062 ${Y}H1140" stroke="${c.teal}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round" opacity=".6"/>
${body}`,
  });
}

/* ---------------------------------------------------------------- footer */
function footer(c) {
  const T = 4.2;
  const W = 1200, H = 210;
  // goal frame on the right; ball flies in from the left, glove dives and catches it
  const net = [];
  for (let x = 860; x <= 1150; x += 18) net.push(`M${x} 40V182`);
  for (let y = 58; y <= 182; y += 18) net.push(`M852 ${y}H1158`);
  const css = `text{font-family:${SANS}}.mono{font-family:${MONO}}
.ball{animation:ball ${T}s cubic-bezier(.3,.6,.4,1) infinite}
@keyframes ball{0%{transform:translate(0,0);opacity:0}6%{opacity:1}45%{transform:translate(330px,-70px)}55%,82%{transform:translate(372px,-58px);opacity:1}90%,100%{transform:translate(372px,-58px);opacity:0}}
.spin{transform-box:fill-box;transform-origin:center;animation:spin ${T}s linear infinite}
@keyframes spin{0%{transform:rotate(0)}55%,100%{transform:rotate(540deg)}}
.glove{animation:glove ${T}s ease-in-out infinite}
@keyframes glove{0%,30%{transform:translate(0,0) rotate(0)}52%,80%{transform:translate(-22px,-14px) rotate(-12deg)}95%,100%{transform:translate(0,0) rotate(0)}}
.save{transform-box:fill-box;transform-origin:center;animation:save ${T}s ease-out infinite}
@keyframes save{0%,54%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}64%,82%{opacity:1;transform:scale(1)}90%,100%{opacity:0;transform:scale(1)}}
${REDUCED('.ball{transform:translate(372px,-58px)}.glove{transform:translate(-22px,-14px) rotate(-12deg)}')}`;
  const glove = `<g class="glove" style="transform-origin:1030px 130px">
<g transform="translate(1030 120)" stroke="${c.ballInk}" stroke-opacity=".25" stroke-width="1.5">
<rect x="-29" y="-48" width="13" height="44" rx="6.5" fill="${c.violet}"/>
<rect x="-14" y="-56" width="13" height="52" rx="6.5" fill="${c.violet}"/>
<rect x="1" y="-54" width="13" height="50" rx="6.5" fill="${c.violet}"/>
<rect x="16" y="-44" width="13" height="40" rx="6.5" fill="${c.violet}"/>
<rect x="-30" y="-14" width="60" height="50" rx="16" fill="${c.violet}"/>
<rect x="-52" y="-6" width="15" height="38" rx="7.5" fill="${c.lilac}" transform="rotate(-38 -44 13)"/>
<rect x="-26" y="34" width="52" height="16" rx="5" fill="${c.teal}"/>
<path d="M-18 8h36" stroke="${c.card}" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>
</g></g>`;
  const body = `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.bg1}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>
<clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17" stroke="${c.border}" stroke-width="2" fill="none"/>
<text x="56" y="82" fill="${c.text}" font-size="34" font-weight="800" letter-spacing="-1">Useful AI over impressive demos.</text>
<text x="58" y="118" fill="${c.muted}" font-size="18">Off the clock: goalkeeper, Linux tinkerer, automation experiments.</text>
<text x="58" y="160" fill="${c.faint}" font-size="13" letter-spacing="1" class="mono">MEDELLÍN, CO · 6.24°N 75.58°W · ES / EN</text>
<path d="${net.join('')}" stroke="${c.border}" stroke-width="1" opacity=".8"/>
<path d="M852 184V40H1158V184" fill="none" stroke="${c.muted}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M600 186H1180" stroke="${c.border}" stroke-width="2"/>
${glove}
<g class="ball"><g class="spin"><circle cx="640" cy="160" r="17" fill="${c.ball}" stroke="${c.ballInk}" stroke-opacity=".35" stroke-width="1.5"/>
<text x="640" y="165" fill="${c.violet}" font-size="14" font-weight="800" text-anchor="middle" class="mono">{ }</text></g></g>
<g class="save"><text x="928" y="30" fill="${c.amber}" font-size="18" font-weight="900" letter-spacing="2" text-anchor="middle" transform="rotate(-6 928 30)">SAVED!</text></g>
</g>`;
  return svg({
    w: W, h: H,
    title: 'Useful AI over impressive demos',
    desc: 'Footer: a goalkeeper glove dives to catch a curly-brace ball. Off the clock Juandy is a goalkeeper, Linux tinkerer and automation experimenter, based in Medellín.',
    css, body,
  });
}

const BUILDERS = { hero, terminal, 'lab-voice': labVoice, 'lab-chat': labChat, timeline, footer };
for (const [name, build] of Object.entries(BUILDERS)) {
  for (const [theme, colors] of Object.entries(THEMES)) {
    const file = join(OUT, `${name}-${theme}.svg`);
    writeFileSync(file, build(colors));
    console.log(`wrote ${file}`);
  }
}
