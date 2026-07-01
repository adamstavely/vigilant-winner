/* illustrations.ts — inline animated-SVG illustrations for the onboarding tours.
   Each value is a self-contained SVG string (viewBox 0 0 260 148). Animation is
   driven by CSS classes defined in mcaap-onboarding.css (.il-*). */

const NAVY = '#1D3557', BLUE = '#0073E6', GOLD = '#B5851C', GOLDL = '#E8C46A',
      GREEN = '#16A34A', RED = '#D24B43', PAPER = '#FFFFFF', TINT = '#EAF0F7',
      LINE = '#E2E8F0', INK3 = '#94A3B8';

function frame(inner: string, bg?: string): string {
  return '<svg viewBox="0 0 260 148" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">' +
    '<defs><linearGradient id="ilbg" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + (bg || '#F4F7FC') + '"/><stop offset="1" stop-color="#ECF2FB"/></linearGradient>' +
    '<linearGradient id="ilgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + GOLDL + '"/><stop offset="1" stop-color="' + GOLD + '"/></linearGradient></defs>' +
    '<rect x="1" y="1" width="258" height="146" rx="16" fill="url(#ilbg)" stroke="' + LINE + '"/>' + inner + '</svg>';
}
function diamond(cx: number, cy: number, r: number, fill: string, extra?: string): string {
  return '<path ' + (extra || '') + ' d="M' + cx + ' ' + (cy - r) + ' C' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r) + ' ' + cy +
    ' C' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + cx + ' ' + (cy + r) +
    ' C' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r) + ' ' + cy +
    ' C' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>';
}
function rc(x: number, y: number, w: number, h: number, fill: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + fill + '" stroke="' + LINE + '"/>'; }
function bar(x: number, y: number, w: number, fill: string, stroke?: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="6" rx="3" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '"' : '') + '/>'; }
function lines(x: number, y: number, _n: number, w: number): string { let s = ''; for (let i = 0; i < 5; i++) s += bar(x, y + i * 13, (i % 2 ? w * .7 : w), LINE); return s; }
function tag(x: number, y: number, t: string, c: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + (t ? 44 : 24) + '" height="15" rx="7" fill="#fff" stroke="' + c + '"/>' + (t ? '<text x="' + (x + 22) + '" y="' + (y + 11) + '" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="' + c + '" text-anchor="middle">' + t + '</text>' : ''); }
function col(x: number, label: string, dots: string[]): string {
  let s = '<text x="' + (x + 22) + '" y="34" font-size="7.5" font-family="Inter,sans-serif" font-weight="700" fill="' + INK3 + '" text-anchor="middle">' + label.toUpperCase() + '</text>';
  for (let i = 0; i < dots.length; i++) { s += '<rect x="' + x + '" y="' + (46 + i * 26) + '" width="44" height="20" rx="5" fill="#fff" stroke="' + LINE + '"/><circle cx="' + (x + 8) + '" cy="' + (56 + i * 26) + '" r="3" fill="' + dots[i] + '"/>'; }
  return s;
}

export const ILLUS: Record<string, string> = {
  welcome: frame(
    '<g class="il-spin-slow" style="transform-origin:130px 74px">' +
    '<circle cx="130" cy="30" r="3.4" fill="' + BLUE + '"/><circle cx="188" cy="60" r="3.4" fill="' + GOLD + '"/>' +
    '<circle cx="170" cy="112" r="3.4" fill="' + GREEN + '"/><circle cx="82" cy="108" r="3.4" fill="' + BLUE + '"/><circle cx="66" cy="46" r="3.4" fill="' + GOLDL + '"/></g>' +
    '<circle cx="130" cy="74" r="40" fill="none" stroke="' + LINE + '" stroke-dasharray="3 6"/>' +
    '<g class="il-float">' + diamond(130, 74, 26, NAVY) + diamond(130, 74, 13, 'url(#ilgold)') + '</g>'),

  explore: frame(
    '<g>' + rc(30, 30, 58, 40, PAPER) + rc(101, 30, 58, 40, PAPER) + rc(172, 30, 58, 40, TINT) +
    rc(30, 82, 58, 36, TINT) + rc(101, 82, 58, 36, PAPER) + rc(172, 82, 58, 36, PAPER) +
    bar(40, 44, 30, BLUE) + bar(40, 52, 20, LINE) + bar(111, 44, 34, NAVY) + bar(111, 52, 22, LINE) + '</g>' +
    '<g class="il-float"><circle cx="150" cy="92" r="17" fill="none" stroke="' + BLUE + '" stroke-width="4"/>' +
    '<line x1="162" y1="104" x2="176" y2="118" stroke="' + BLUE + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<circle class="il-pulse" cx="150" cy="92" r="17" fill="' + BLUE + '" opacity=".14"/></g>'),

  search: frame(
    lines(38, 40, 3, 120) +
    '<g class="il-float"><circle cx="150" cy="78" r="26" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="4.5"/>' +
    '<circle class="il-pulse" cx="150" cy="78" r="26" fill="' + BLUE + '" opacity=".12"/>' +
    '<line x1="169" y1="97" x2="192" y2="120" stroke="' + NAVY + '" stroke-width="6" stroke-linecap="round"/>' +
    bar(139, 72, 22, BLUE) + bar(139, 82, 14, LINE) + '</g>'),

  tasks: frame(
    col(24, 'Backlog', [INK3, INK3]) + col(84, 'Doing', [BLUE, INK3]) + col(144, 'Review', [GOLD]) + col(204, 'Done', [GREEN]) +
    '<g class="il-slide-card"><rect x="84" y="46" width="52" height="22" rx="5" fill="' + PAPER + '" stroke="' + BLUE + '"/>' +
    bar(90, 53, 26, BLUE) + bar(90, 60, 16, LINE) + '</g>'),

  agents: frame(
    '<circle class="il-ring" cx="130" cy="70" r="30" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="146 30" stroke-linecap="round" style="transform-origin:130px 70px"/>' +
    '<circle cx="130" cy="70" r="30" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
    '<g class="il-float"><path d="M130 48 L150 60 V84 L130 96 L110 84 V60 Z" fill="' + NAVY + '"/>' + diamond(130, 72, 9, 'url(#ilgold)') + '</g>' +
    '<g class="il-spark"><circle cx="182" cy="46" r="3" fill="' + GOLD + '"/><circle cx="78" cy="52" r="3" fill="' + BLUE + '"/><circle cx="176" cy="100" r="3" fill="' + GREEN + '"/></g>'),

  clearance: frame(
    '<rect class="il-float" x="60" y="26" width="120" height="96" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(74, 44, 62, NAVY) + bar(74, 56, 92, LINE) +
    '<rect x="74" y="66" width="92" height="9" rx="3" fill="' + RED + '" opacity=".18"/><line x1="74" y1="76" x2="166" y2="76" stroke="' + RED + '" stroke-width="2"/>' +
    bar(74, 86, 80, LINE) + bar(74, 96, 60, LINE) +
    '<g class="il-rise"><circle cx="168" cy="104" r="16" fill="' + GREEN + '"/><path d="M161 104 l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>'),

  memos: frame(
    '<circle cx="52" cy="40" r="10" fill="' + PAPER + '" stroke="' + NAVY + '" stroke-width="3"/>' +
    '<circle cx="130" cy="74" r="10" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="3"/>' +
    '<circle cx="208" cy="108" r="10" fill="' + PAPER + '" stroke="' + GREEN + '" stroke-width="3"/>' +
    '<path id="mroute" d="M52 50 C52 74 90 74 130 74 C170 74 170 98 208 98" fill="none" stroke="' + LINE + '" stroke-width="3" stroke-dasharray="4 6"/>' +
    '<circle class="il-move" r="5" fill="' + GOLD + '"><animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto"><mpath href="#mroute"/></animateMotion></circle>' +
    tag(30, 62, 'Draft', NAVY) + tag(108, 96, 'Concur', BLUE) + tag(186, 130, '', GREEN)),

  prep: frame(
    '<rect x="52" y="28" width="120" height="92" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(66, 44, 50, NAVY) +
    '<path class="il-draw" d="M66 62 H150" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="90"/>' +
    bar(66, 74, 96, LINE) + bar(66, 84, 70, LINE) + bar(66, 94, 88, LINE) +
    '<g class="il-pen"><path d="M150 60 l30 -22 10 10 -30 22 -13 3 3 -13 z" fill="' + GOLDL + '" stroke="' + GOLD + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M180 38 l10 10" stroke="' + GOLD + '" stroke-width="1.5"/></g>'),

  briefings: frame(
    '<g class="il-float"><rect x="86" y="42" width="88" height="72" rx="6" fill="' + BLUE + '"/>' +
    '<rect x="78" y="36" width="88" height="72" rx="6" fill="' + NAVY + '"/>' +
    '<rect x="70" y="30" width="88" height="72" rx="6" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(82, 44, 48, NAVY) + bar(82, 56, 64, LINE) + bar(82, 66, 52, LINE) + bar(82, 76, 60, LINE) + bar(82, 86, 40, LINE) + '</g>' +
    '<g class="il-rise"><circle cx="176" cy="98" r="13" fill="url(#ilgold)"/>' + diamond(176, 98, 6, '#fff') + '</g>'),

  language: frame(
    '<g class="il-spin-slow" style="transform-origin:96px 74px"><circle cx="96" cy="74" r="34" fill="' + TINT + '" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<path d="M62 74 H130 M96 40 C112 56 112 92 96 108 C80 92 80 56 96 40" fill="none" stroke="' + BLUE + '" stroke-width="2"/></g>' +
    '<path class="il-draw" d="M138 60 H150" stroke="' + INK3 + '" stroke-width="3" stroke-linecap="round"/>' +
    '<g class="il-float">' + bar(150, 46, 74, PAPER, LINE) + bar(158, 50, 50, NAVY) + bar(150, 66, 74, PAPER, LINE) + bar(158, 70, 60, BLUE) + bar(150, 86, 74, PAPER, LINE) + bar(158, 90, 40, GOLD) + '</g>'),

  upload: frame(
    '<g class="il-float"><ellipse cx="130" cy="112" rx="46" ry="12" fill="' + NAVY + '"/><path d="M84 74 v38 c0 6.6 20.6 12 46 12 s46 -5.4 46 -12 v-38" fill="' + NAVY + '"/>' +
    '<ellipse cx="130" cy="74" rx="46" ry="12" fill="' + BLUE + '"/></g>' +
    '<g class="il-up"><circle cx="130" cy="44" r="20" fill="url(#ilgold)"/><path d="M130 54 V34 M121 43 l9 -9 9 9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>'),

  triage: frame(
    '<g class="il-float"><path d="M64 44 h132 l-10 30 h-112 z" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<path d="M74 74 h30 a6 6 0 0 0 6 6 h40 a6 6 0 0 0 6 -6 h30" fill="none" stroke="' + NAVY + '" stroke-width="2.5"/></g>' +
    '<g class="il-fall1"><rect x="76" y="92" width="30" height="20" rx="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-fall2"><rect x="115" y="96" width="30" height="20" rx="4" fill="' + GOLD + '"/></g>' +
    '<g class="il-fall3"><rect x="154" y="92" width="30" height="20" rx="4" fill="' + GREEN + '"/></g>'),

  celebrate: frame(
    '<g class="il-spark"><path d="M60 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="' + GOLD + '"/>' +
    '<path d="M206 48 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="' + BLUE + '"/>' +
    '<circle cx="72" cy="108" r="4" fill="' + GREEN + '"/><circle cx="196" cy="106" r="4" fill="' + GOLDL + '"/><circle cx="130" cy="26" r="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-rise"><circle cx="130" cy="78" r="34" fill="' + NAVY + '"/>' + diamond(130, 78, 17, 'url(#ilgold)') + '</g>'),

  help: frame(
    '<g class="il-float"><circle cx="130" cy="70" r="34" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="3"/>' +
    '<path d="M118 60 a12 12 0 1 1 16 12 c-3 2 -4 4 -4 8" fill="none" stroke="' + NAVY + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="130" cy="90" r="3.4" fill="' + NAVY + '"/></g>' +
    '<g class="il-spark"><circle cx="180" cy="44" r="3" fill="' + GOLD + '"/><circle cx="82" cy="52" r="3" fill="' + BLUE + '"/></g>'),
};
