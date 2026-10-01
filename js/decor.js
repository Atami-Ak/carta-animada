/* ============================================================
   DECORATIONS — biblioteca de SVGs e composições de cada página.
   ============================================================ */

const C = {
  rosa: '#eca4bd', rosaF: '#d9779b', rosaC: '#f8d3de',
  lilas: '#c4b1e6', ame: '#7a5fb0',
  ouro: '#e3c27a', ouroF: '#c79a45',
  creme: '#f8eeda', folha: '#8fae8b', folhaF: '#5f8a6b',
  tinta: '#6b4a5e', sepia: '#b08a7a'
};

const DECOR = (() => {
  const svg = (vb, body, cls = '', extra = '') =>
    `<svg class="${cls}" viewBox="${vb}" ${extra} aria-hidden="true">${body}</svg>`;
  const rot = (n, fn) => Array.from({ length: n }, (_, k) => fn(k)).join('');

  const STAR = 'M0-10C1.5-3 3-1.5 10 0C3 1.5 1.5 3 0 10C-1.5 3-3 1.5-10 0C-3-1.5-1.5-3 0-10Z';
  const HEART = 'M0 10C-5 5-12 1-12-5C-12-10-5-13 0-7C5-13 12-10 12-5C12 1 5 5 0 10Z';
  const LEAF = 'M0 0C5-8 16-8 21 0C16 6 5 6 0 0Z';

  const flowerG = (a, b, core = C.ouro) =>
    rot(5, k => `<path d="M0-4C-17-14-19-40 0-47C19-40 17-14 0-4Z" fill="${a}" transform="rotate(${k * 72})"/>`) +
    rot(5, k => `<path d="M0-3C-10-10-11-26 0-31C11-26 10-10 0-3Z" fill="${b}" transform="rotate(${k * 72 + 36})"/>`) +
    `<circle r="7" fill="${core}"/>` +
    rot(6, k => `<circle r="1.4" cy="-10" fill="${C.ouroF}" transform="rotate(${k * 60})"/>`);

  const leaves = (list, c) =>
    list.map(([x, y, r, s = 1]) => `<path d="${LEAF}" fill="${c}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`).join('');

  return {
    star: (c = C.ouro) => svg('-12 -12 24 24', `<path d="${STAR}" fill="${c}"/>`, 'star'),

    heart: (c = C.rosaF) => svg('-14 -15 28 27', `<path d="${HEART}" fill="${c}"/>`, 'heart'),

    petal: (c = C.rosa) => svg('0 -10 20 20', `<path d="M0 0C6-10 16-8 19 0C16 8 6 10 0 0Z" fill="${c}"/>`, 'petal-svg'),

    flower: (a = C.rosa, b = C.rosaC) => svg('-50 -50 100 100', flowerG(a, b), 'flower'),

    branch: (c = C.folha, s = C.folhaF) => svg('0 0 120 60',
      `<path d="M4 52C30 50 70 34 116 8" fill="none" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/>` +
      leaves([[22, 50, -70], [36, 46, 20], [52, 40, -80], [66, 34, 10], [80, 27, -85], [92, 20, 5], [104, 13, -80, .8]], c), 'branch'),

    garden: (a = C.rosa, a2 = C.rosaC, b = C.lilas, b2 = '#e6dcf7', c = '#fff6ee', c2 = C.rosaC) => svg('0 0 140 160',
      `<g fill="none" stroke="${C.folhaF}" stroke-width="2.2" stroke-linecap="round">
         <path d="M34 160C36 118 26 86 40 54"/><path d="M72 160C72 130 82 104 76 78"/><path d="M104 160C106 138 114 118 110 100"/>
         <path d="M18 160C18 140 10 128 6 118"/><path d="M124 160C126 146 134 138 138 130"/>
       </g>` +
      leaves([[35, 120, -150, 1.2], [36, 96, -20, 1.1], [74, 128, -25, 1.2], [76, 104, -155, 1], [107, 130, -150, 1], [108, 118, -25, .9], [8, 124, -110, .9], [134, 134, -60, .9]], C.folha) +
      `<g transform="translate(40 48) scale(.56)">${flowerG(a, a2)}</g>
       <g transform="translate(77 72) scale(.42)">${flowerG(b, b2)}</g>
       <g transform="translate(110 96) scale(.34)">${flowerG(c, c2)}</g>
       <circle cx="6" cy="116" r="5" fill="${a}"/><circle cx="138" cy="128" r="4.5" fill="${b}"/>`, 'garden-svg'),

    herbs: () => svg('0 0 140 160',
      `<g fill="none" stroke="${C.folhaF}" stroke-width="2" stroke-linecap="round">
         <path d="M30 160C30 110 44 70 36 30"/><path d="M70 160C74 120 62 96 72 60"/><path d="M108 160C104 134 116 114 110 92"/>
       </g>` +
      leaves([[31, 136, -20, 1.2], [32, 118, -160, 1.2], [36, 98, -25, 1.1], [39, 78, -155, 1.1], [39, 58, -30, 1], [37, 42, -150, .9],
        [71, 132, -160, 1.1], [69, 110, -20, 1.1], [68, 90, -155, 1], [70, 72, -30, .9],
        [107, 136, -25, 1], [108, 118, -155, 1], [111, 102, -35, .9]], C.folha) +
      `<g fill="${C.lilas}"><circle cx="36" cy="26" r="4"/><circle cx="31" cy="20" r="3.4"/><circle cx="40" cy="18" r="3.2"/><circle cx="35" cy="12" r="2.8"/></g>
       <g fill="${C.ouro}"><circle cx="72" cy="56" r="3.6"/><circle cx="67" cy="50" r="3"/><circle cx="76" cy="48" r="2.8"/></g>
       <g fill="${C.rosa}"><circle cx="110" cy="88" r="3.4"/><circle cx="105" cy="82" r="2.8"/><circle cx="114" cy="80" r="2.6"/></g>`, 'garden-svg'),

    flask: (liq = C.rosa) => svg('0 0 40 62',
      `<rect x="13" y="0" width="14" height="8" rx="2" fill="#b98a5e"/>
       <path d="M3.3 44Q11.6 40 20 44T36.7 44A17 17 0 0 1 3.3 44Z" fill="${liq}" opacity=".9"/>
       <path d="M15 8V24.5A17 17 0 1 0 25 24.5V8Z" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.8)" stroke-width="1.4" stroke-linejoin="round"/>
       <path d="M9 36A12 12 0 0 0 9 48" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6" stroke-linecap="round"/>
       <g fill="#fff8dc"><circle class="spk" cx="16" cy="50" r="1.5"/><circle class="spk" cx="25" cy="47" r="1.1"/><circle class="spk" cx="21" cy="53" r="1"/></g>`, 'flask-svg'),

    vial: (liq = C.lilas) => svg('0 0 30 70',
      `<rect x="9" y="0" width="12" height="8" rx="2" fill="#b98a5e"/>
       <path d="M5 40Q10 37 15 40T25 40V60A9 9 0 0 1 16 69H14A9 9 0 0 1 5 60Z" fill="${liq}" opacity=".9"/>
       <path d="M8 8H22V16C22 19 25 20 25 24V60A9 9 0 0 1 16 69H14A9 9 0 0 1 5 60V24C5 20 8 19 8 16Z" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.8)" stroke-width="1.4" stroke-linejoin="round"/>
       <g fill="#fff8dc"><circle class="spk" cx="12" cy="50" r="1.4"/><circle class="spk" cx="18" cy="57" r="1.1"/></g>`, 'flask-svg'),

    magic: (c = C.ouro) => svg('-50 -50 100 100',
      `<g fill="none" stroke="${c}" stroke-width=".8">
         <circle r="47"/><circle r="42"/><circle r="27"/><circle r="12"/>
         <path d="M0-42L36.4 21L-36.4 21Z"/><path d="M0 42L36.4-21L-36.4-21Z"/>` +
      rot(24, k => `<path d="M0-42V-47" transform="rotate(${k * 15})"/>`) +
      rot(6, k => `<circle r="3.2" cy="-34.5" transform="rotate(${k * 60 + 30})"/>`) +
      `</g><path d="${STAR}" fill="${c}" transform="scale(.8)"/>`, 'magic'),

    constel: (c = '#fff6dc') => {
      const p = [[0, -8], [-13, -22], [-29, -17], [-32, 2], [-17, 19], [0, 33], [17, 19], [32, 2], [29, -17], [13, -22]];
      return svg('-40 -30 80 70',
        `<path class="cline" pathLength="1" d="M${p.map(q => q.join(' ')).join('L')}Z" fill="none" stroke="${c}" stroke-width=".5" opacity=".7"/>` +
        p.map(([x, y], i) => `<path class="cstar" style="--i:${i}" d="${STAR}" fill="${c}" transform="translate(${x} ${y}) scale(${i % 3 === 0 ? .34 : .22})"/>`).join(''), 'constel-svg');
    },

    starRow: (c = C.ouroF) => {
      const p = [[10, 20], [52, 8], [98, 19], [144, 6], [190, 16]];
      return svg('0 0 200 28',
        `<path d="M${p.map(q => q.join(' ')).join('L')}" fill="none" stroke="${c}" stroke-width=".6" opacity=".6"/>` +
        p.map(([x, y], i) => `<path d="${STAR}" fill="${c}" transform="translate(${x} ${y}) scale(${i % 2 ? .62 : .4})"/>`).join(''));
    },

    column: (f = '#e9defa', s = '#a892d0') => svg('0 0 60 200',
      `<g fill="${f}" stroke="${s}" stroke-width="1.2">
         <rect x="4" y="2" width="52" height="6" rx="1"/>
         <circle cx="11" cy="15" r="8"/><circle cx="49" cy="15" r="8"/>
         <rect x="8" y="12" width="44" height="10" rx="2"/>
         <path d="M14 22H46L44 180H16Z"/>
         <rect x="10" y="180" width="40" height="7" rx="2"/><rect x="5" y="187" width="50" height="11" rx="2"/>
       </g>
       <g fill="none" stroke="${s}" stroke-width="1"><circle cx="11" cy="15" r="3.5"/><circle cx="49" cy="15" r="3.5"/>
         <path d="M21 26L22 176M27 26L27.5 176M33 26L32.5 176M39 26L38 176"/></g>`, 'column'),

    laurel: (c = C.ouroF) => {
      const half = [35, 55, 75, 95, 115, 135, 155]
        .map(a => `<path d="M0 0C4-6 4-12 0-17C-4-12-4-6 0 0Z" transform="rotate(${a}) translate(0 -31) rotate(-62)"/>`).join('');
      return svg('-42 -42 84 84',
        `<g fill="${c}">${half}<g transform="scale(-1 1)">${half}</g></g>
         <path d="M-7 32Q0 37 7 32" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`, 'laurel');
    },

    crown: (c = C.ouro) => svg('-28 -23 56 38',
      `<path d="M-20 10L-25-10L-11 0L0-17L11 0L25-10L20 10Z" fill="${c}"/>
       <rect x="-20" y="10" width="40" height="3.4" rx="1.7" fill="${C.ouroF}"/>
       <g fill="${C.rosa}"><circle cx="-25" cy="-12" r="2.4"/><circle cy="-19.5" r="2.7"/><circle cx="25" cy="-12" r="2.4"/></g>`, 'crown'),

    castle: (f = '#241544', w = C.ouro) => svg('0 -10 300 180',
      `<g fill="${f}">
         <path d="M0 170Q150 112 300 170Z"/>
         <rect x="122" y="52" width="56" height="100"/><path d="M116 54L150 6L184 54Z"/>
         <rect x="84" y="82" width="28" height="70"/><path d="M79 84L98 44L117 84Z"/>
         <rect x="188" y="82" width="28" height="70"/><path d="M183 84L202 44L221 84Z"/>
         <rect x="54" y="106" width="22" height="50"/><path d="M50 108L65 78L80 108Z"/>
         <rect x="224" y="106" width="22" height="50"/><path d="M220 108L235 78L250 108Z"/>
         <rect x="60" y="124" width="180" height="34"/>
         <path d="M149 8V-8H151V-6L161-3L151 0V8Z"/>
       </g>
       <g fill="${w}">
         <rect x="146" y="70" width="8" height="13" rx="4"/><rect x="95.5" y="96" width="5" height="9" rx="2.5"/><rect x="199.5" y="96" width="5" height="9" rx="2.5"/>
         <rect x="134" y="104" width="5" height="9" rx="2.5"/><rect x="161" y="104" width="5" height="9" rx="2.5"/>
         <rect x="62.5" y="118" width="4" height="7" rx="2"/><rect x="232.5" y="118" width="4" height="7" rx="2"/>
         <path d="M142 158V140A8 8 0 0 1 158 140V158Z"/>
       </g>`, 'castle-svg'),

    moon: () => svg('-40 -40 80 80',
      `<defs><radialGradient id="mg" cx="38%" cy="35%"><stop offset="0" stop-color="#fffaf0"/><stop offset=".7" stop-color="#f6e3b5"/><stop offset="1" stop-color="#e3c27a"/></radialGradient></defs>
       <circle r="40" fill="url(#mg)"/>
       <g fill="#d9bf86" opacity=".42"><circle cx="-12" cy="-10" r="7"/><circle cx="14" cy="6" r="5"/><circle cx="-4" cy="18" r="4"/><circle cx="18" cy="-18" r="3"/></g>`),

    butterfly: (a = C.lilas, b = C.rosa) => {
      const w = `<g class="wing"><path d="M0 0C-3-13-17-15-17-5C-17 1-8 3 0 0Z" fill="${a}"/><path d="M0 0C-8 1-14 5-11 10C-8 14-2 7 0 0Z" fill="${b}"/></g>`;
      return svg('-20 -16 40 30', `${w}<g transform="scale(-1 1)">${w}</g><ellipse rx="1" ry="6" fill="${C.tinta}"/>`, 'bfly-svg');
    },

    wave: (f = '#3d2b70') => svg('0 0 400 40',
      `<path d="M0 20Q25 4 50 20T100 20T150 20T200 20T250 20T300 20T350 20T400 20V40H0Z" fill="${f}"/>`, '', 'preserveAspectRatio="none"'),

    waveLine: (c = C.ame) => svg('0 0 200 22',
      `<g fill="none" stroke="${c}" stroke-linecap="round"><path stroke-width="1.4" d="M2 8Q14 0 26 8T50 8T74 8T98 8T122 8T146 8T170 8T198 8"/>
       <path stroke-width="1" opacity=".55" d="M14 17Q26 9 38 17T62 17T86 17T110 17T134 17T158 17T186 17"/></g>`),

    hills: (f = '#170d2e') => svg('0 0 400 80',
      `<path d="M0 80V46C40 30 80 34 120 44C170 56 210 20 262 30C310 39 350 52 400 34V80Z" fill="${f}"/>`, '', 'preserveAspectRatio="none"'),

    /* floco de neve (Frozen) */
    snow: (c = '#eef4ff') => svg('-12 -12 24 24',
      `<g fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round">` +
      rot(6, k => `<path d="M0 0V-10.5M0-6.5L-3-9.5M0-6.5L3-9.5M0-3L-2-5M0-3L2-5" transform="rotate(${k * 60})"/>`) + `</g>`, 'snow'),

    /* lanterna flutuante (Enrolados) */
    lantern: () => svg('0 0 40 56',
      `<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a"/><stop offset=".6" stop-color="#f6a95c"/><stop offset="1" stop-color="#ffe9b0"/></linearGradient></defs>
       <path d="M8 8H32L36 44Q20 51 4 44Z" fill="url(#lg)" opacity=".92"/>
       <path d="M8 8H32" stroke="#b9772f" stroke-width="2" stroke-linecap="round"/>
       <ellipse cx="20" cy="45" rx="15" ry="4" fill="#fff3c8" opacity=".85"/>
       <g fill="#c9772e" opacity=".75"><circle cx="20" cy="26" r="4"/>` +
      rot(8, k => `<path d="M-1-6L0-${k % 2 ? 9 : 11}L1-6Z" transform="translate(20 26) rotate(${k * 45})"/>`) + `</g>`, 'lantern-svg'),

    sun: (c = C.ouroF) => svg('-30 -30 60 60',
      `<g fill="${c}"><circle r="10"/>` + rot(16, k => `<path d="M-2.3-12.5L0-${k % 2 ? 19 : 27}L2.3-12.5Z" transform="rotate(${k * 22.5})"/>`) + `</g>`, 'sun'),

    /* vela flutuante, pomo de ouro e raio (Harry Potter) */
    candle: (b = '#fbf2dc') => svg('0 0 14 50',
      `<circle cx="7" cy="9" r="7" fill="#ffe9a8" opacity=".3"/>
       <path class="flame" d="M7 2C10 8 11 11 7 15C3 11 4 8 7 2Z" fill="#ffd77a"/>
       <rect x="4" y="15" width="6" height="33" rx="1.5" fill="${b}"/><path d="M4 22Q6 25 5.5 30" fill="none" stroke="rgba(120,90,60,.35)" stroke-width="1"/>`, 'candle-svg'),

    snitch: () => {
      const w = `<g class="wing"><path d="M-4-1C-13-12-26-11-28-4C-20-6-12-2-4 2Z" fill="#fff6dc" stroke="${C.ouroF}" stroke-width=".6"/></g>`;
      return svg('-30 -14 60 28', `${w}<g transform="scale(-1 1)">${w}</g><circle r="5.5" fill="${C.ouro}"/><circle cx="-1.6" cy="-1.8" r="1.8" fill="#fff6dc" opacity=".8"/><path d="M-5 1Q0 4 5 1" fill="none" stroke="${C.ouroF}" stroke-width=".7"/>`, 'bfly-svg');
    },

    bolt: (c = C.ouroF) => svg('0 0 20 30', `<path d="M12 0L2 17H9L6 30L18 11H11Z" fill="${c}"/>`),

    /* laço (Barbie) */
    bow: (c = '#ff7ab8') => svg('-24 -14 48 30',
      `<g fill="${c}"><path d="M0 0C-8-12-22-12-22-2C-22 8-8 8 0 0Z"/><path d="M0 0C8-12 22-12 22-2C22 8 8 8 0 0Z"/>
       <path d="M0 0L-9 14L-4 12L-1 15Z"/><path d="M0 0L9 14L4 12L1 15Z"/></g>
       <circle r="4" fill="#ffb3d6"/><path d="M-17-3Q-12-7-6-3M17-3Q12-7 6-3" fill="none" stroke="#ffd0e6" stroke-width="1.2" stroke-linecap="round"/>`, 'bow'),

    /* coração de Te Fiti e canoa (Moana) */
    spiral: () => svg('-20 -22 40 44',
      `<ellipse rx="15" ry="18" fill="#5fb89a"/><ellipse rx="15" ry="18" fill="none" stroke="#bff0dc" stroke-width="1"/>
       <path d="M0 1C3 0 4 4 1 5.5C-4 7-7 2-5.5-3C-4-9 4-10 8-5C11 0 9 8 3 10.5" fill="none" stroke="#dffbf0" stroke-width="1.8" stroke-linecap="round"/>`, 'spiral'),

    canoe: (f = '#1d1238') => svg('0 0 80 62',
      `<g fill="${f}"><path d="M4 46Q40 58 76 46L68 53Q40 61 12 53Z"/><rect x="39" y="6" width="2" height="44"/>
       <path d="M41 8C64 16 66 36 43 46Z"/><path d="M14 58H70" stroke="${f}" stroke-width="2.5" stroke-linecap="round"/></g>
       <path d="M51 28C53 27 54 30 52 31C49 32 47 29 48 26C50 22 56 23 57 28" fill="none" stroke="${C.ouro}" stroke-width="1.3" stroke-linecap="round"/>`, 'canoe-svg'),

    /* cajado (Frieren) e almofariz (Apotecária) */
    staff: () => svg('0 0 40 200',
      `<rect x="18.500" y="44" width="3" height="154" rx="1.5" fill="#8a6a4a"/>
       <path d="M20 46C4 40 2 16 20 4C11 18 14 32 28 36" fill="none" stroke="${C.ouro}" stroke-width="3.2" stroke-linecap="round"/>
       <path d="M20 46C30 44 36 36 36 28" fill="none" stroke="${C.ouro}" stroke-width="3.2" stroke-linecap="round"/>
       <circle cx="21" cy="24" r="6" fill="#d9486a"/><circle cx="19" cy="22" r="2" fill="#ffc4d2"/>
       <path d="M14 50H26L23 58H17Z" fill="${C.ouroF}"/>`.replace('18.500', '18.5'), 'staff-svg'),

    mortar: () => svg('0 0 60 50',
      `<path d="M36 22L54 3" stroke="#8a6a4a" stroke-width="5" stroke-linecap="round"/>
       <path d="M6 18H54C54 36 44 46 30 46C16 46 6 36 6 18Z" fill="#cdbba3" stroke="#8f7a63" stroke-width="1.4"/>
       <rect x="3" y="15" width="54" height="6" rx="3" fill="#e0d2bd" stroke="#8f7a63" stroke-width="1.2"/>
       <rect x="20" y="45" width="20" height="4" rx="2" fill="#a8947b"/>
       <g fill="${C.folha}"><circle cx="20" cy="14" r="3"/><circle cx="27" cy="12" r="3.4"/><circle cx="15" cy="13" r="2.2"/></g>`, 'mortar-svg'),

    corner: (c = C.ouro) => svg('0 0 40 40',
      `<g fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round">
         <path d="M2 38V14C2 7 7 2 14 2H38"/><path d="M8 30C8 16 16 8 30 8"/>
         <path d="M8 22C12 22 14 19 13 16C12 13 8 14 9 17"/><path d="M22 8C22 12 19 14 16 13C13 12 14 8 17 9"/>
       </g><circle cx="8" cy="8" r="1.6" fill="${c}"/>`, 'corner-svg')
  };
})();

/* Composição de cada página: o que entra acima e abaixo do texto. */
const ORNAMENTS = (() => {
  const D = DECOR, o = (cls, html, attr = '') => `<span class="o ${cls}" ${attr}>${html}</span>`;
  return {
    jardim: {
      top: o('o-star', D.star(C.ouroF)) + o('o-crown', D.crown()) + o('o-star', D.star(C.ouroF)),
      bot: o('o-branch', D.branch()) + o('o-flower', D.flower(), 'data-tap="flower"') + o('o-branch flip', D.branch())
    },
    apotecaria: {
      top: o('o-branch flip', D.branch()) + o('o-vial', D.vial(C.lilas), 'data-tap="flask"') + o('o-branch', D.branch()),
      bot: o('o-flask', D.flask(C.rosa), 'data-tap="flask"') + o('o-flower sm', D.flower(C.lilas, '#e6dcf7'), 'data-tap="flower"') + o('o-vial', D.vial(C.ouro), 'data-tap="flask"')
    },
    constelacao: {
      top: o('o-const', D.starRow()),
      bot: o('o-magic', D.magic(C.ame))
    },
    mar: {
      top: o('o-laurel', D.laurel() + `<i class="in">${D.heart()}</i>`, 'data-tap="heart"'),
      bot: o('o-col', D.column('#efe6fb', C.ame)) + o('o-wave', D.waveLine()) + o('o-col', D.column('#efe6fb', C.ame))
    },
    hogwarts: {
      top: o('o-candle', D.candle('#d9bd94')) + o('o-snitch', D.snitch(), 'data-tap="star"') + o('o-candle', D.candle('#d9bd94')),
      bot: o('o-star', D.star(C.ouroF)) + o('o-bolt', D.bolt(), 'data-tap="star"') + o('o-star', D.star(C.ouroF))
    },
    lanternas: {
      top: o('o-sun', D.sun(), 'data-tap="star"'),
      bot: o('o-lantern sm', D.lantern()) + o('o-flower', D.flower(C.lilas, '#e6dcf7'), 'data-tap="flower"') + o('o-lantern', D.lantern(), 'data-tap="star"')
    },
    neve: {
      top: o('o-snow sm', D.snow('#8fa6d8')) + o('o-snow', D.snow('#7a8fcb'), 'data-tap="snow"') + o('o-snow sm', D.snow('#8fa6d8')),
      bot: o('o-snow sm', D.snow('#8fa6d8')) + o('o-heart', D.heart(), 'data-tap="heart"') + o('o-snow sm', D.snow('#8fa6d8'))
    }
  };
})();

/* Ilustração do verso de cada folha (a página da esquerda quando o livro está aberto). */
const PLATES = (() => {
  const D = DECOR;
  return {
    apotecaria: D.herbs(),
    constelacao: D.magic(C.tinta),
    mar: D.laurel(C.sepia) + `<i class="in">${D.heart(C.rosa)}</i>`,
    hogwarts: D.snitch(),
    lanternas: D.sun(C.sepia),
    neve: D.snow('#8fa6d8'),
    fim: D.flower(C.rosa, C.rosaC)
  };
})();
