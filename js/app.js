(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const desk = matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');
const D = DECOR, body = document.body, fx = $('#fx');
/* aparelho modesto: mesmos elementos, com céu mais leve e menos partículas por rajada */
const lite = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3;
body.classList.toggle('lite', lite);

/* ============ TEXTO: divisão pelos pontos finais, sem alterar nada ============ */
const SENTENCES = (LETTER_DATA.text.match(/[^.]+(?:\.+|$)/g) || []).map(s => s.trim()).filter(Boolean);
console.assert(SENTENCES.join(' ') === LETTER_DATA.text.trim(), 'a divisão alterou o texto da carta');

/* partes de frases longas: corta nos marcadores de LETTER_SPLITS, sem mexer no texto */
const PARTS = SENTENCES.map((s, i) => {
  const cuts = (LETTER_SPLITS[i] || []).map(m => s.indexOf(m)).filter(n => n > 0);
  const b = [0, ...cuts, s.length];
  const parts = b.slice(0, -1).map((a, k) => s.slice(a, b[k + 1]).trim());
  console.assert(parts.join(' ') === s, 'a divisão em partes alterou a frase ' + i);
  return parts;
});
const pageText = (p, i) => (p.part != null ? PARTS[i][p.part] : SENTENCES[i]);

const used = new Set(PAGE_CONFIG.flatMap(p => p.sentences || []));
const SCENES = ['jardim', 'apotecaria', 'constelacao', 'mar'];
const pages = [
  ...PAGE_CONFIG,
  ...SENTENCES.map((_, i) => i).filter(i => !used.has(i)).map((i, k) => ({ sentences: [i], scene: SCENES[k % 4], layout: 'livro' }))
];
const N = pages.length;

/* ============ SVGs declarados no HTML via data-d="nome|arg|arg" ============ */
$$('[data-d]').forEach(el => { const [name, ...args] = el.dataset.d.split('|'); el.innerHTML = D[name](...args); });

/* ============ CENAS ============ */
const STAR_LEVEL = { capa: 1, jardim: .5, apotecaria: .7, constelacao: 1.4, mar: 1, hogwarts: 1.2, misterio: 1.1, lanternas: .8, neve: .9, album: .6, final: 1.4 };
let starTarget = 1;
function setScene(name) {
  body.dataset.scene = name;
  $$('[data-in]').forEach(el => el.classList.toggle('on', el.dataset.in.split(' ').includes(name)));
  starTarget = STAR_LEVEL[name] ?? 1;
  if (reduce) drawSky(0);
}

/* ============ LIVRO ============ */
const book = $('#book');
const T = 28, GAP = 1.2;
const zR = i => (i === 0 ? T : T - 2.5 - i * GAP);   // repouso na pilha da direita
const zL = i => 1 + i * GAP;                          // repouso na pilha da esquerda
const tf = (z, r, s = 0) => `translateZ(${z}px) rotateY(${r}deg) skewY(${s}deg)`;
const roman = n => 'x'.repeat(n / 10) + ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][n % 10];
const overlays = '<div class="shade"></div><div class="cast"></div>';
const corners = c => ['tl', 'tr', 'bl', 'br'].map(k => `<span class="corner c-${k}">${D.corner(c)}</span>`).join('');

const coverFront = `<div class="cover-art leather"><span class="spine"></span><div class="frame">${corners(C.ouro)}
  <div class="emblem"><span class="em-magic">${D.magic()}</span><span class="em-laurel">${D.laurel(C.ouro)}</span><span class="em-heart">${D.heart(C.ouro)}</span><span class="em-crown">${D.crown()}</span></div>
  <h1 class="cover-title">${esc(LETTER_DATA.title)}</h1></div></div>`;
const endpaper = `<div class="plate"><div>${D.magic(C.ame)}</div></div>`;

const pageFront = (p, i) => {
  const orn = ORNAMENTS[p.scene] || ORNAMENTS.jardim;
  const layout = p.quote ? 'citacao' : p.layout;
  const ava = p.avatar ? `<img class="ava" src="${esc(p.avatar)}" alt="" decoding="async">` : '';
  const text = p.quote
    ? p.quote.map(q => `<p>${esc(q)}</p>`).join('') + `<p class="by">${ava}<span>${esc(p.by || '')}</span></p>`
    : p.sentences.map(s => `<p>${esc(pageText(p, s))}</p>`).join('');
  return `<div class="gutter"></div><div class="rule">${corners(C.sepia)}</div>
    <div class="page-in lay-${layout}${p.img ? ' has-pic' : ''}${!p.quote && p.sentences.reduce((n, i) => n + pageText(p, i).length, 0) > 380 ? ' long' : ''}${p.part ? ' cont' : ''}"><div class="orn-top">${p.img
      ? `<span class="pic" data-tap="star"><i class="tape"></i><img src="${esc(p.img)}" alt="" style="object-position:${esc(p.pos || '50% 50%')}" decoding="async" draggable="false"></span>` : orn.top}</div>
    <div class="txt" data-max="${layout === 'livro' ? 21.5 : layout === 'centro' ? 24 : p.img ? 21 : 25}"><div>${text}</div></div>
    <div class="orn-bot">${orn.bot}</div></div><span class="folio">${roman(i + 1)}</span>`;
};
const verso = scene => `<div class="gutter"></div><div class="rule">${corners(C.sepia)}</div><div class="plate"><div>${PLATES[scene] || PLATES.fim}</div></div>`;

const mkLeaf = (cls, front, back, fc, bc) => {
  const l = document.createElement('div');
  l.className = 'leaf ' + cls;
  l.innerHTML = `<div class="face front ${fc}">${front}${overlays}</div><div class="face back ${bc}">${back}${overlays}</div>`;
  return l;
};
book.innerHTML = '<div class="board leather"></div><div class="edge-r"></div><div class="edge-b"></div>';
const leaves = [
  mkLeaf('cover', coverFront, endpaper, '', 'endpaper'),
  ...pages.map((p, i) => mkLeaf('page', pageFront(p, i), verso(pages[i + 1]?.scene), 'paper', 'paper'))
];
leaves.forEach((l, i) => { l.style.transform = tf(zR(i), 0); book.append(l); });

/* o texto nunca é cortado: a fonte diminui até a frase caber na página */
function fitText() {
  $$('.txt').forEach(t => {
    const inner = t.firstElementChild;
    let s = +t.dataset.max;
    const set = () => { inner.style.fontSize = s + 'px'; };
    set();
    while (inner.offsetHeight > t.clientHeight - 8 && s > 11) { s -= .5; set(); }
  });
}

/* virada física: a folha gira em torno da lombada, com dobra, luz e sombra projetada */
function flip(i, dir, dur = ANIMATIONS.flip) {
  const leaf = leaves[i], fwd = dir > 0;
  const opt = { duration: reduce ? 320 : dur, easing: ANIMATIONS.ease, direction: fwd ? 'normal' : 'reverse', fill: 'both' };
  const anims = [leaf.animate([
    { transform: tf(zR(i), 0) },
    { transform: tf(T + 4, -90, reduce ? 0 : -4), offset: .5 },
    { transform: tf(zL(i), -180) }
  ], opt)];
  const fade = (el, ks) => el && anims.push(el.animate(ks.map(([offset, opacity]) => ({ offset, opacity })), opt));
  fade($('.front > .shade', leaf), [[0, 0], [.5, 1], [1, 1]]);
  fade($('.back > .shade', leaf), [[0, 1], [.5, 1], [1, 0]]);
  fade(leaves[i + 1] && $('.front > .cast', leaves[i + 1]), [[0, .95], [.6, .3], [1, 0]]);
  fade(i > 0 && $('.back > .cast', leaves[i - 1]), [[0, 0], [.45, .15], [.9, .85], [1, .85]]);
  return anims[0].finished.then(() => {
    leaf.style.transform = tf(fwd ? zL(i) : zR(i), fwd ? -180 : 0);
    anims.forEach(a => a.cancel());
  });
}

let cur = 1, busy = false, riseTimer = 0;
/* só ficam desenhadas as folhas que podem aparecer na próxima virada; só a atual anima */
function showLeaves(c, all) {
  leaves.forEach((l, i) => {
    l.classList.toggle('off', !all && (i < c - 2 || i > c + 1));
    l.classList.toggle('live', i === c);
  });
}
const folio = $('#folio'), prevBtn = $('#prev');

function setCurrent(i) {
  cur = i;
  leaves[i].classList.add('seen');
  showLeaves(i);
  folio.textContent = `${i} / ${N}`;
  prevBtn.disabled = i === 1;
  setScene(pages[i - 1].scene);
}

async function openBook() {
  if (busy || !['closed', 'final'].includes(body.dataset.stage)) return;
  busy = true;
  clearInterval(riseTimer);
  const r = book.getBoundingClientRect(), halo = $('.halo');
  halo.classList.add('pulse');
  burst(r.left + r.width / 2, r.top + r.height / 2, 'star', 16, 150);
  sweepPetals(9);
  if (audio) audio.play().catch(() => {});
  await sleep(reduce ? 0 : 700);
  body.dataset.stage = 'open';
  await sleep(reduce ? 0 : 420);
  setTimeout(() => { setCurrent(1); halo.classList.remove('pulse'); }, reduce ? 0 : ANIMATIONS.cover * .5);
  await flip(0, 1, ANIMATIONS.cover);
  busy = false;
}

async function next() {
  if (busy || body.dataset.stage !== 'open') return;
  if (cur === N) return closeBook();
  busy = true;
  const i = cur;
  setCurrent(i + 1);
  sweepPetals(3);
  await flip(i, 1);
  if (pages[i].surprise) surprise();
  if (pages[i].scene === 'constelacao') meteor = null, nextMeteor = 0;
  busy = false;
}

async function prev() {
  if (busy || body.dataset.stage !== 'open' || cur === 1) return;
  busy = true;
  setCurrent(cur - 1);
  await flip(cur, -1);
  busy = false;
}

function surprise() {
  const r = book.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * .4, 'heart', 18, 190);
  flash(.32);
  sweepPetals(10);
}

async function closeBook() {
  busy = true;
  showLeaves(-1, true);
  const jobs = [];
  for (let i = cur - 1, k = 0; i >= 0; i--, k++)
    jobs.push(sleep(k * 130).then(() => flip(i, -1, ANIMATIONS.close + (i === 0 ? 380 : 0))));
  sweepPetals(8);
  await Promise.all(jobs);
  showLeaves(0);
  body.dataset.stage = 'closed';
  $('.halo').classList.add('pulse');
  await sleep(reduce ? 100 : 950);
  flash(.75);
  $('.halo').classList.remove('pulse');
  showAlbum();
  busy = false;
}

function showAlbum() {
  clearInterval(riseTimer);
  body.dataset.stage = 'album';
  setScene('album');
  goPhoto(pi, true);
}

function showFinale() {
  stopAuto();
  body.dataset.stage = 'final';
  setScene('final');
  cur = 1;
  flash(.4);
  clearInterval(riseTimer);
  if (!reduce) riseTimer = setInterval(() => {
    if (document.hidden) return;
    rise(rand(8, 92), Math.random() < .5 ? 'heart' : 'petal');
  }, 850);
}

/* ============ PARTÍCULAS DE INTERAÇÃO ============ */
const bitHTML = kind => kind === 'heart' ? D.heart(Math.random() < .5 ? C.rosa : C.rosaF)
  : kind === 'snow' ? D.snow()
  : kind === 'petal' ? D.petal([C.rosa, C.rosaC, C.lilas, '#fff6ee'][Math.floor(rand(0, 4))])
  : D.star(Math.random() < .6 ? C.ouro : '#fff6dc');

function bit(kind, size) {
  const el = document.createElement('i');
  el.className = 'bit';
  el.style.setProperty('--s', size + 'px');
  el.innerHTML = bitHTML(kind);
  fx.append(el);
  return el;
}

function burst(x, y, kind = 'star', n = 10, spread = 80) {
  if (reduce) n = Math.min(n, 4); else if (lite) n = Math.ceil(n * .6);
  for (let k = 0; k < n; k++) {
    const el = bit(kind, rand(8, 17)), a = rand(0, 6.283), d = rand(spread * .35, spread);
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.animate([
      { transform: 'translate(-50%,-50%) scale(.5)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - spread * .35}px)) scale(1) rotate(${rand(-120, 120)}deg)`, opacity: 0 }
    ], { duration: rand(750, 1400), easing: 'cubic-bezier(.23,1,.32,1)' }).onfinish = () => el.remove();
  }
}

function sweepPetals(n) {
  if (reduce) return;
  for (let k = 0; k < n; k++) {
    const el = bit('petal', rand(12, 24));
    el.style.left = '-6vw'; el.style.top = rand(8, 70) + 'vh';
    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
      { opacity: .95, offset: .15 },
      { transform: `translate(116vw, ${rand(8, 34)}vh) rotate(${rand(260, 620)}deg)`, opacity: .9 }
    ], { duration: rand(2200, 3800), delay: k * rand(70, 160), easing: 'cubic-bezier(.4,.1,.5,1)', fill: 'backwards' }).onfinish = () => el.remove();
  }
}

function rise(xvw, kind) {
  const el = bit(kind, rand(10, 20));
  el.style.left = xvw + 'vw'; el.style.top = '102vh';
  el.animate([
    { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
    { opacity: .9, offset: .15 },
    { transform: `translate(${rand(-12, 12)}vw, -112vh) rotate(${rand(-160, 160)}deg)`, opacity: 0 }
  ], { duration: rand(6000, 9500), easing: 'linear' }).onfinish = () => el.remove();
}

function flash(peak) {
  $('#flash').animate([{ opacity: 0 }, { opacity: peak, offset: .3 }, { opacity: 0 }], { duration: reduce ? 400 : 1500, easing: 'ease-out' });
}

const pulse = el => el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 480, easing: 'cubic-bezier(.23,1,.32,1)' });

/* descobertas: coração, estrela, frasco, flor, borboleta */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-tap]');
  if (!el) return;
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  switch (el.dataset.tap) {
    case 'heart': pulse(el); burst(x, y, 'heart', 9); break;
    case 'star': pulse(el); burst(x, y, 'star', 11, 100); break;
    case 'snow': pulse(el); burst(x, y, 'snow', 11, 100); break;
    case 'flask':
      el.animate([0, -15, 12, -7, 3, 0].map(a => ({ transform: `rotate(${a}deg)` })), { duration: 850, easing: 'ease-out' });
      burst(x, r.top + r.height * .25, 'star', 8, 60); break;
    case 'flower':
      el.animate([0, 5, -4, 2, 0].map(a => ({ transform: `rotate(${a}deg)` })), { duration: 900, easing: 'ease-out' });
      burst(x, r.top + r.height * .35, 'petal', 9, 90); break;
    case 'fairy':
      el.querySelector('.fz').animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(360deg) scale(1.3)' }, { transform: 'rotate(720deg) scale(1)' }], { duration: 900, easing: 'cubic-bezier(.23,1,.32,1)' });
      burst(x, y, 'star', 14, 110); break;
    case 'bill':
      el.animate([0, 360].map(a => ({ transform: `rotate(${a}deg)` })), { duration: 900, easing: 'cubic-bezier(.23,1,.32,1)' });
      burst(x, y, 'star', 14, 120); flash(.18); break;
    case 'bfly':
      el.style.setProperty('--bx', rand(6, 80) + 'vw'); el.style.setProperty('--by', rand(6, 78) + 'vh'); break;
  }
});

/* ============ GESTOS NO LIVRO ============ */
const world = $('#world');
let pd = null;
world.addEventListener('pointerdown', e => { pd = { x: e.clientX, y: e.clientY }; });
world.addEventListener('pointerup', e => {
  if (!pd) return;
  const dx = e.clientX - pd.x, dy = e.clientY - pd.y, stage = body.dataset.stage;
  pd = null;
  if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) {
    if (stage === 'open') dx < 0 ? next() : prev();
    else if (dx < 0) openBook();
    return;
  }
  if (Math.abs(dx) > 10 || Math.abs(dy) > 10 || e.target.closest('[data-tap]')) return;
  const onBook = e.target.closest('#book');
  if (stage === 'closed' || stage === 'final') { if (onBook) openBook(); return; }
  if (stage !== 'open') return;
  if (!onBook) return burst(e.clientX, e.clientY, 'star', 5, 50);
  const rx = e.clientX / innerWidth;
  if (desk.matches) return rx > .5 ? next() : prev();
  if (rx > .62) next(); else if (rx < .3) prev(); else burst(e.clientX, e.clientY, 'star', 7, 60);
});
world.addEventListener('pointercancel', () => { pd = null; });

$('#next').addEventListener('click', next);
prevBtn.addEventListener('click', prev);
$('#again').addEventListener('click', openBook);
$('#tophotos').addEventListener('click', showAlbum);

/* ============ ÁLBUM ============ */
const placeholder = n => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eca4bd"/><stop offset=".55" stop-color="#c4b1e6"/><stop offset="1" stop-color="#7a5fb0"/></linearGradient></defs><rect width="600" height="750" fill="url(#g)"/><circle cx="300" cy="330" r="92" fill="none" stroke="#fff8e6" stroke-width="5" stroke-dasharray="14 12"/><text x="300" y="350" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="#fff8e6">${n}</text><text x="300" y="500" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="34" fill="#fff8e6">sua foto entra aqui</text></svg>`);
const shuffled = list => {   // Fisher-Yates
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const photos = PHOTO_DATA.length ? (PHOTO_SHUFFLE ? shuffled(PHOTO_DATA) : PHOTO_DATA) : [1, 2, 3].map(n => ({ src: placeholder(n), alt: `Espaço reservado para a foto ${n}` }));
const P = photos.length;
const track = $('#track'), viewport = $('#viewport'), dots = $('#dots');
let pi = 0, autoTimer = 0;

track.innerHTML = photos.map((p, i) => `<figure class="slide"><div class="polaroid" style="--tilt:${[-1.2, 1.4, -.6, 1.8][i % 4]}deg"><span class="tape"></span>
  <img src="${esc(p.src)}" alt="${esc(p.alt || '')}" ${i > 1 ? 'loading="lazy"' : ''} decoding="async" draggable="false"><figcaption>${i + 1} / ${P}</figcaption></div></figure>`).join('');
dots.innerHTML = photos.map(() => '<i></i>').join('');
const slides = $$('.slide', track);

function goPhoto(i, instant) {
  if (i >= P) return showFinale();
  pi = Math.max(0, i);
  track.style.transition = instant ? 'none' : '';
  track.style.transform = `translateX(${-pi * 100}%)`;
  slides.forEach((s, k) => s.classList.toggle('act', k === pi));
  $$('i', dots).forEach((d, k) => d.classList.toggle('act', k === pi));
  $('#ph-prev').disabled = pi === 0;
}

function stopAuto() {
  clearInterval(autoTimer); autoTimer = 0;
  $('#ph-auto').setAttribute('aria-pressed', 'false');
  $('.ic-play').hidden = false; $('.ic-pause').hidden = true;
}
$('#ph-auto').addEventListener('click', () => {
  if (autoTimer) return stopAuto();
  $('#ph-auto').setAttribute('aria-pressed', 'true');
  $('.ic-play').hidden = true; $('.ic-pause').hidden = false;
  autoTimer = setInterval(() => (pi < P - 1 ? goPhoto(pi + 1) : stopAuto()), ANIMATIONS.autoplay);
});
$('#ph-prev').addEventListener('click', () => { stopAuto(); goPhoto(pi - 1); });
$('#ph-next').addEventListener('click', () => { stopAuto(); goPhoto(pi + 1); });

let drag = null;
viewport.addEventListener('pointerdown', e => {
  if (drag) return;
  stopAuto();
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), dx: 0, id: e.pointerId, moved: false };
});
window.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  let dx = e.clientX - drag.x;
  if (!drag.moved && Math.abs(dx) < 8) return;
  drag.moved = true;
  if (pi === 0 && dx > 0) dx *= .35;   // atrito na borda
  drag.dx = dx;
  track.style.transition = 'none';
  track.style.transform = `translateX(calc(${-pi * 100}% + ${dx}px))`;
});
const endDrag = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const { dx, moved, t } = drag, v = Math.abs(dx) / (performance.now() - t);
  drag = null;
  if (!moved) { if (e.type === 'pointerup' && e.target.closest('.act .polaroid')) openLb(pi, e.target.closest('.polaroid').querySelector('img')); return; }
  const go = Math.abs(dx) > viewport.clientWidth * .22 || v > .35;
  goPhoto(go ? pi + (dx < 0 ? 1 : -1) : pi);
};
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

/* ============ LIGHTBOX ============ */
const lb = $('#lightbox'), lbImg = $('#lb-img');
let li = 0, lbDown = null;

async function openLb(i, from) {
  li = i;
  lbImg.src = photos[i].src; lbImg.alt = photos[i].alt || '';
  $('#lb-count').textContent = `${i + 1} / ${P}`;
  lb.classList.add('open');
  if (!from || reduce) return;
  const a = from.getBoundingClientRect();
  await lbImg.decode().catch(() => {});
  const b = lbImg.getBoundingClientRect();
  if (!b.width) return;
  lbImg.animate([
    { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` },
    { transform: 'none' }
  ], { duration: 420, easing: 'cubic-bezier(.23,1,.32,1)' });
}
function lbGo(d) {
  const n = li + d;
  if (n < 0 || n >= P) return;
  lbImg.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 40}px)` }], { duration: 160, easing: 'ease-out' }).onfinish = () => {
    openLb(n);
    lbImg.animate([{ opacity: 0, transform: `translateX(${d * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
  };
}
const closeLb = () => { lb.classList.remove('open'); goPhoto(li, true); };
$('#lb-close').addEventListener('click', closeLb);
$('#lb-prev').addEventListener('click', () => lbGo(-1));
$('#lb-next').addEventListener('click', () => lbGo(1));
lb.addEventListener('pointerdown', e => { lbDown = { x: e.clientX, y: e.clientY }; });
lb.addEventListener('pointerup', e => {
  if (!lbDown) return;
  const dx = e.clientX - lbDown.x, dy = e.clientY - lbDown.y;
  lbDown = null;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lbGo(dx < 0 ? 1 : -1);
  else if (dy > 90 || e.target === lb) closeLb();
});

/* ============ TECLADO ============ */
document.addEventListener('keydown', e => {
  const stage = body.dataset.stage, right = e.key === 'ArrowRight', left = e.key === 'ArrowLeft';
  if (lb.classList.contains('open')) { if (e.key === 'Escape') closeLb(); else if (right) lbGo(1); else if (left) lbGo(-1); return; }
  if (stage === 'open') { if (right) next(); else if (left) prev(); }
  else if (stage === 'album') { if (right) goPhoto(pi + 1); else if (left) goPhoto(pi - 1); }
  else if (right || e.key === 'Enter') openBook();
});

/* ============ ÁUDIO (só toca depois de um toque) ============ */
const audio = AUDIO_SRC ? new Audio(AUDIO_SRC) : null;
if (audio) {
  const sb = $('#sound');
  audio.loop = true; audio.volume = .6; sb.hidden = false;
  sb.addEventListener('click', () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  ['play', 'pause'].forEach(ev => audio.addEventListener(ev, () => sb.classList.toggle('off', audio.paused)));
}

/* ============ PÉTALAS EM QUEDA ============ */
const drift = $('#drift');
for (let k = 0, n = reduce ? 0 : 11; k < n; k++) {
  const el = document.createElement('i');
  el.className = 'petal';
  el.style.cssText = `--x:${rand(-5, 95)}%;--s:${rand(9, 19)}px;--d:${rand(15, 28)}s;--dl:${-rand(0, 28)}s;--f:${rand(2.4, 4.6)}s;--dx:${rand(-8, 22)}vw`;
  el.innerHTML = D.petal([C.rosa, C.rosaC, C.lilas, '#fff6ee'][k % 4]);
  drift.append(el);
}
/* neve (cena "neve") e lanternas (cenas "lanternas" e "final") */
for (let k = 0, n = reduce ? 0 : 12; k < n; k++) {
  const el = document.createElement('i');
  el.className = 'petal flake';
  el.style.cssText = `--x:${rand(-5, 98)}%;--s:${rand(10, 22)}px;--d:${rand(13, 24)}s;--dl:${-rand(0, 24)}s;--f:${rand(3, 6)}s;--dx:${rand(-10, 10)}vw`;
  el.innerHTML = D.snow();
  drift.append(el);
}
const lanterns = $('#lanterns');
for (let k = 0, n = reduce ? 3 : 9; k < n; k++) {
  const el = document.createElement('i');
  el.className = 'lantern';
  el.style.cssText = `--x:${rand(2, 90)}%;--s:${rand(16, 40)}px;--d:${rand(20, 36)}s;--dl:${-rand(0, 36)}s;--dx:${rand(-12, 12)}vw`;
  el.innerHTML = D.lantern();
  lanterns.append(el);
}

/* pó de fada: rastro de brilhos atrás de cada fada */
$('#fairies').innerHTML = FAIRY_DATA.slice(0, 6).map((f, i) =>
  `<div class="fairy f${'abcdef'[i]}" data-tap="fairy"><i><span class="fz">${f.asas ? `<img class="asas" src="${esc(f.asas)}" alt="" draggable="false">` : ''}<img class="corpo${f.olha === 'direita' ? ' vira' : ''}" src="${esc(f.corpo)}" alt="" draggable="false"></span></i></div>`).join('');
const fairies = $$('.fairy');
if (!reduce && fairies.length) setInterval(() => {
  if (document.hidden) return;
  for (const f of fairies) {
    const r = f.getBoundingClientRect();
    if (r.right < 0 || r.left > innerWidth) continue;
    const el = bit('star', rand(4, 10));
    el.style.left = r.left + r.width / 2 + rand(-10, 10) + 'px'; el.style.top = r.top + r.height * rand(.45, .95) + 'px';
    el.animate([{ transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 }, { transform: `translate(calc(-50% + ${rand(-14, 14)}px), calc(-50% + ${rand(26, 60)}px)) scale(.3) rotate(${rand(-90, 90)}deg)`, opacity: 0 }], { duration: rand(1000, 1800), easing: 'ease-out' }).onfinish = () => el.remove();
  }
}, lite ? 520 : 230);

/* de vez em quando uma fada dá uma pirueta e solta um punhado de pó */
if (!reduce && fairies.length) setInterval(() => {
  if (document.hidden) return;
  const f = fairies[Math.floor(Math.random() * fairies.length)], r = f.getBoundingClientRect();
  if (r.right < 0 || r.left > innerWidth) return;
  const loop = Math.random() < .5;
  f.querySelector('.fz').animate(loop
    ? [{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(360deg) scale(1.15)' }]
    : [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-22px) scale(1.2)', offset: .4 }, { transform: 'translateY(0) scale(1)' }],
    { duration: loop ? 850 : 1100, easing: 'cubic-bezier(.45,.05,.3,1)' });
  burst(r.left + r.width / 2, r.top + r.height / 2, 'star', 7, 60);
}, 3400);

/* vaga-lumes */
const ffBox = $('#fireflies');
for (let k = 0, n = reduce ? 4 : 14; k < n; k++) {
  const el = document.createElement('i');
  el.className = 'firefly';
  el.style.cssText = `--x:${rand(2, 96)}%;--y:${rand(52, 96)}%;--d:${rand(6, 12)}s;--dl:${-rand(0, 12)}s;--ax:${rand(-30, 30)}px;--ay:${rand(-40, 10)}px;--bx:${rand(-40, 40)}px;--by:${rand(-60, 0)}px`;
  ffBox.append(el);
}

/* ============ CÉU: estrelas, poeira dourada, meteoros ============ */
const cv = $('#stars'), cx = cv.getContext('2d');
let SW = 0, SH = 0, stars = [], dust = [], inten = 1, meteor = null, nextMeteor = 4000;

function resizeSky() {
  const d = lite ? 1 : Math.min(devicePixelRatio || 1, 1.5);
  SW = innerWidth; SH = innerHeight;
  cv.width = SW * d; cv.height = SH * d;
  cx.setTransform(d, 0, 0, d, 0, 0);
  const n = reduce ? 50 : Math.round(Math.min(lite ? 80 : 150, SW * SH / 5200));
  stars = Array.from({ length: n }, () => ({ x: Math.random() * SW, y: Math.random() * SH * .88, r: rand(.4, 1.5), k: Math.random(), sp: rand(.5, 1.7), ph: rand(0, 6.283), gold: Math.random() < .3 }));
  dust = Array.from({ length: reduce ? 0 : 22 }, () => ({ x: Math.random() * SW, y: Math.random() * SH, r: rand(.7, 1.8), v: rand(.08, .3), ph: rand(0, 6.283) }));
  if (reduce) drawSky(0);
}

function drawSky(t) {
  cx.clearRect(0, 0, SW, SH);
  for (const s of stars) {
    // k decide o comportamento: fixa, pisca, brilha em cruz, some devagar
    let a = s.k < .3 ? .55 : s.k < .9 ? .3 + .7 * (.5 + .5 * Math.sin(t * .001 * s.sp + s.ph)) : Math.max(0, Math.sin(t * .0003 * s.sp + s.ph));
    a = Math.min(1, a * inten);
    if (a < .03) continue;
    cx.globalAlpha = a;
    cx.fillStyle = s.gold ? '#f3d99a' : '#ffffff';
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill();
    if (s.k >= .75 && s.k < .9) {
      const g = s.r * 4.5 * a;
      cx.fillRect(s.x - g, s.y - .35, g * 2, .7); cx.fillRect(s.x - .35, s.y - g, .7, g * 2);
    }
  }
  cx.fillStyle = '#f3d99a';
  for (const p of dust) {
    p.y -= p.v; p.x += Math.sin(t * .0006 + p.ph) * .18;
    if (p.y < -5) { p.y = SH + 5; p.x = Math.random() * SW; }
    cx.globalAlpha = .18 + .3 * (.5 + .5 * Math.sin(t * .0012 + p.ph));
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
  }
  if (!meteor && t > nextMeteor && inten > .8) {
    meteor = { x: rand(SW * .35, SW * 1.05), y: rand(-10, SH * .22), life: 0 };
    nextMeteor = t + rand(5500, 11000);
  }
  if (meteor) {
    meteor.life++; meteor.x -= 7; meteor.y += 4.2;
    const g = cx.createLinearGradient(meteor.x, meteor.y, meteor.x + 70, meteor.y - 42);
    g.addColorStop(0, 'rgba(255,248,224,.95)'); g.addColorStop(1, 'rgba(255,248,224,0)');
    cx.globalAlpha = Math.max(0, 1 - meteor.life / 34);
    cx.strokeStyle = g; cx.lineWidth = 1.6;
    cx.beginPath(); cx.moveTo(meteor.x, meteor.y); cx.lineTo(meteor.x + 70, meteor.y - 42); cx.stroke();
    if (meteor.life > 34) meteor = null;
  }
  cx.globalAlpha = 1;
}

/* ============ PARALLAX ============ */
const layers = $$('.layer').map(el => ({ el, d: +el.dataset.depth }));
let px = 0, py = 0, tx = 0, ty = 0, lastTrail = 0;
if (!reduce && fine) {
  addEventListener('pointermove', e => {
    tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5;
    const now = performance.now();
    if (now - lastTrail > 110 && body.dataset.stage !== 'album') {   // rastro discreto do cursor, só no desktop
      lastTrail = now;
      const el = bit('star', rand(4, 8));
      el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px';
      el.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: .8 }, { transform: `translate(-50%, calc(-50% + ${rand(10, 26)}px)) scale(.5)`, opacity: 0 }], { duration: 800, easing: 'ease-out' }).onfinish = () => el.remove();
    }
  });
} else if (!reduce && !lite && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    tx = Math.max(-.5, Math.min(.5, e.gamma / 50)); ty = Math.max(-.5, Math.min(.5, (e.beta - 45) / 60));
  });
}

let frame = 0;
function loop(t) {
  requestAnimationFrame(loop);
  if (document.hidden) return;
  if (Math.abs(tx - px) + Math.abs(ty - py) > .0008) {
    px += (tx - px) * .06; py += (ty - py) * .06;
    for (const l of layers) l.el.style.transform = `translate3d(${(-px * l.d).toFixed(2)}px, ${(-py * l.d).toFixed(2)}px, 0)`;
  }
  if (frame++ % (lite ? 3 : 2)) return;   // céu a ~30 fps (20 em aparelho modesto)
  inten += (starTarget - inten) * .04;
  drawSky(t);
}

/* ============ INÍCIO ============ */
let rz = 0;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { resizeSky(); fitText(); }, 120); });
resizeSky();
fitText();
document.fonts?.ready.then(fitText);
setScene('capa');
folio.textContent = `1 / ${N}`;
showLeaves(0);
goPhoto(0, true);
if (!reduce) requestAnimationFrame(loop);

/* atalhos para revisar: index.html#p3 abre na página 3, #album e #final pulam para essas cenas */
const hash = location.hash.slice(1);
if (hash === 'album') showAlbum();
else if (hash === 'final') showFinale();
else if (/^p\d+$/.test(hash)) (async () => {
  await openBook();
  for (let k = 1; k < Math.min(+hash.slice(1), N); k++) await next();
})();

})();
