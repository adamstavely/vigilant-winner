/* onboarding-tours.js — data + illustrations for the MCAAP onboarding tutorial.
   Plain data so both the live web component (onboarding.js) and the lifted
   Stencil source (stencil-src/) can share one source of truth.
   Exposes: window.MCAAP_ILLUS (svg strings) and window.MCAAP_TOURS (array). */
(function () {
  // ---- palette (mirrors styles.css tokens) ----
  var NAVY = '#1D3557', BLUE = '#0073E6', GOLD = '#B5851C', GOLDL = '#E8C46A',
      GREEN = '#16A34A', RED = '#D24B43', PAPER = '#FFFFFF', TINT = '#EAF0F7',
      LINE = '#E2E8F0', INK3 = '#94A3B8';

  // Each illustration is a self-contained SVG (viewBox 0 0 260 148).
  // Animation is driven by CSS classes defined in onboarding.js's shadow sheet:
  //   .il-float .il-pulse .il-draw .il-slide .il-spark .il-rise .il-spin .il-sweep
  function frame(inner, bg) {
    return '<svg viewBox="0 0 260 148" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">' +
      '<defs><linearGradient id="ilbg" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + (bg || '#F4F7FC') + '"/><stop offset="1" stop-color="#ECF2FB"/></linearGradient>' +
      '<linearGradient id="ilgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + GOLDL + '"/><stop offset="1" stop-color="' + GOLD + '"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="258" height="146" rx="16" fill="url(#ilbg)" stroke="' + LINE + '"/>' + inner + '</svg>';
  }
  function diamond(cx, cy, r, fill, extra) {
    return '<path ' + (extra || '') + ' d="M' + cx + ' ' + (cy - r) + ' C' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r) + ' ' + cy +
      ' C' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + cx + ' ' + (cy + r) +
      ' C' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r) + ' ' + cy +
      ' C' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>';
  }

  var ILLUS = {};

  ILLUS.welcome = frame(
    '<g class="il-spin-slow" style="transform-origin:130px 74px">' +
    '<circle cx="130" cy="30" r="3.4" fill="' + BLUE + '"/><circle cx="188" cy="60" r="3.4" fill="' + GOLD + '"/>' +
    '<circle cx="170" cy="112" r="3.4" fill="' + GREEN + '"/><circle cx="82" cy="108" r="3.4" fill="' + BLUE + '"/><circle cx="66" cy="46" r="3.4" fill="' + GOLDL + '"/></g>' +
    '<circle cx="130" cy="74" r="40" fill="none" stroke="' + LINE + '" stroke-dasharray="3 6"/>' +
    '<g class="il-float">' + diamond(130, 74, 26, NAVY) + diamond(130, 74, 13, 'url(#ilgold)') + '</g>');

  ILLUS.explore = frame(
    '<g>' +
    rc(30, 30, 58, 40, PAPER) + rc(101, 30, 58, 40, PAPER) + rc(172, 30, 58, 40, TINT) +
    rc(30, 82, 58, 36, TINT) + rc(101, 82, 58, 36, PAPER) + rc(172, 82, 58, 36, PAPER) +
    bar(40, 44, 30, BLUE) + bar(40, 52, 20, LINE) + bar(111, 44, 34, NAVY) + bar(111, 52, 22, LINE) +
    '</g>' +
    '<g class="il-float"><circle cx="150" cy="92" r="17" fill="none" stroke="' + BLUE + '" stroke-width="4"/>' +
    '<line x1="162" y1="104" x2="176" y2="118" stroke="' + BLUE + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<circle class="il-pulse" cx="150" cy="92" r="17" fill="' + BLUE + '" opacity=".14"/></g>');

  ILLUS.search = frame(
    lines(38, 40, 3, 120) +
    '<g class="il-float"><circle cx="150" cy="78" r="26" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="4.5"/>' +
    '<circle class="il-pulse" cx="150" cy="78" r="26" fill="' + BLUE + '" opacity=".12"/>' +
    '<line x1="169" y1="97" x2="192" y2="120" stroke="' + NAVY + '" stroke-width="6" stroke-linecap="round"/>' +
    bar(139, 72, 22, BLUE) + bar(139, 82, 14, LINE) + '</g>');

  ILLUS.tasks = frame(
    col(24, 'Backlog', [INK3, INK3]) + col(84, 'Doing', [BLUE, INK3]) + col(144, 'Review', [GOLD]) + col(204, 'Done', [GREEN]) +
    '<g class="il-slide-card"><rect x="84" y="46" width="52" height="22" rx="5" fill="' + PAPER + '" stroke="' + BLUE + '"/>' +
    bar(90, 53, 26, BLUE) + bar(90, 60, 16, LINE) + '</g>');

  ILLUS.agents = frame(
    '<circle class="il-ring" cx="130" cy="70" r="30" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="146 30" stroke-linecap="round" style="transform-origin:130px 70px"/>' +
    '<circle cx="130" cy="70" r="30" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
    '<g class="il-float"><path d="M130 48 L150 60 V84 L130 96 L110 84 V60 Z" fill="' + NAVY + '"/>' + diamond(130, 72, 9, 'url(#ilgold)') + '</g>' +
    '<g class="il-spark"><circle cx="182" cy="46" r="3" fill="' + GOLD + '"/><circle cx="78" cy="52" r="3" fill="' + BLUE + '"/><circle cx="176" cy="100" r="3" fill="' + GREEN + '"/></g>');

  ILLUS.clearance = frame(
    '<rect class="il-float" x="60" y="26" width="120" height="96" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(74, 44, 62, NAVY) + bar(74, 56, 92, LINE) +
    '<rect x="74" y="66" width="92" height="9" rx="3" fill="' + RED + '" opacity=".18"/><line x1="74" y1="76" x2="166" y2="76" stroke="' + RED + '" stroke-width="2"/>' +
    bar(74, 86, 80, LINE) + bar(74, 96, 60, LINE) +
    '<g class="il-rise"><circle cx="168" cy="104" r="16" fill="' + GREEN + '"/><path d="M161 104 l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.memos = frame(
    '<circle cx="52" cy="40" r="10" fill="' + PAPER + '" stroke="' + NAVY + '" stroke-width="3"/>' +
    '<circle cx="130" cy="74" r="10" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="3"/>' +
    '<circle cx="208" cy="108" r="10" fill="' + PAPER + '" stroke="' + GREEN + '" stroke-width="3"/>' +
    '<path id="mroute" d="M52 50 C52 74 90 74 130 74 C170 74 170 98 208 98" fill="none" stroke="' + LINE + '" stroke-width="3" stroke-dasharray="4 6"/>' +
    '<circle class="il-move" r="5" fill="' + GOLD + '"><animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto"><mpath href="#mroute"/></animateMotion></circle>' +
    tag(30, 62, 'Draft', NAVY) + tag(108, 96, 'Concur', BLUE) + tag(186, 130, '', GREEN));

  ILLUS.prep = frame(
    '<rect x="52" y="28" width="120" height="92" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(66, 44, 50, NAVY) +
    '<path class="il-draw" d="M66 62 H150" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="90"/>' +
    bar(66, 74, 96, LINE) + bar(66, 84, 70, LINE) + bar(66, 94, 88, LINE) +
    '<g class="il-pen"><path d="M150 60 l30 -22 10 10 -30 22 -13 3 3 -13 z" fill="' + GOLDL + '" stroke="' + GOLD + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M180 38 l10 10" stroke="' + GOLD + '" stroke-width="1.5"/></g>');

  ILLUS.briefings = frame(
    '<g class="il-float"><rect x="86" y="42" width="88" height="72" rx="6" fill="' + BLUE + '"/>' +
    '<rect x="78" y="36" width="88" height="72" rx="6" fill="' + NAVY + '"/>' +
    '<rect x="70" y="30" width="88" height="72" rx="6" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(82, 44, 48, NAVY) + bar(82, 56, 64, LINE) + bar(82, 66, 52, LINE) + bar(82, 76, 60, LINE) + bar(82, 86, 40, LINE) + '</g>' +
    '<g class="il-rise"><circle cx="176" cy="98" r="13" fill="url(#ilgold)"/>' + diamond(176, 98, 6, '#fff') + '</g>');

  ILLUS.language = frame(
    '<g class="il-spin-slow" style="transform-origin:96px 74px"><circle cx="96" cy="74" r="34" fill="' + TINT + '" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<path d="M62 74 H130 M96 40 C112 56 112 92 96 108 C80 92 80 56 96 40" fill="none" stroke="' + BLUE + '" stroke-width="2"/></g>' +
    '<path class="il-draw" d="M138 60 H150" stroke="' + INK3 + '" stroke-width="3" stroke-linecap="round"/>' +
    '<g class="il-float">' + bar(150, 46, 74, PAPER, LINE) + bar(158, 50, 50, NAVY) + bar(150, 66, 74, PAPER, LINE) + bar(158, 70, 60, BLUE) + bar(150, 86, 74, PAPER, LINE) + bar(158, 90, 40, GOLD) + '</g>');

  ILLUS.upload = frame(
    '<g class="il-float"><ellipse cx="130" cy="112" rx="46" ry="12" fill="' + NAVY + '"/><path d="M84 74 v38 c0 6.6 20.6 12 46 12 s46 -5.4 46 -12 v-38" fill="' + NAVY + '"/>' +
    '<ellipse cx="130" cy="74" rx="46" ry="12" fill="' + BLUE + '"/></g>' +
    '<g class="il-up"><circle cx="130" cy="44" r="20" fill="url(#ilgold)"/><path d="M130 54 V34 M121 43 l9 -9 9 9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.triage = frame(
    '<g class="il-float"><path d="M64 44 h132 l-10 30 h-112 z" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<path d="M74 74 h30 a6 6 0 0 0 6 6 h40 a6 6 0 0 0 6 -6 h30" fill="none" stroke="' + NAVY + '" stroke-width="2.5"/></g>' +
    '<g class="il-fall1"><rect x="76" y="92" width="30" height="20" rx="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-fall2"><rect x="115" y="96" width="30" height="20" rx="4" fill="' + GOLD + '"/></g>' +
    '<g class="il-fall3"><rect x="154" y="92" width="30" height="20" rx="4" fill="' + GREEN + '"/></g>');

  ILLUS.celebrate = frame(
    '<g class="il-spark"><path d="M60 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="' + GOLD + '"/>' +
    '<path d="M206 48 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="' + BLUE + '"/>' +
    '<circle cx="72" cy="108" r="4" fill="' + GREEN + '"/><circle cx="196" cy="106" r="4" fill="' + GOLDL + '"/><circle cx="130" cy="26" r="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-rise"><circle cx="130" cy="78" r="34" fill="' + NAVY + '"/>' + diamond(130, 78, 17, 'url(#ilgold)') +
    '<path d="M118 78 l8 9 16 -18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></g>');

  ILLUS.help = frame(
    '<g class="il-float"><circle cx="130" cy="70" r="34" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="3"/>' +
    '<path d="M118 60 a12 12 0 1 1 16 12 c-3 2 -4 4 -4 8" fill="none" stroke="' + NAVY + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="130" cy="90" r="3.4" fill="' + NAVY + '"/></g>' +
    '<g class="il-spark"><circle cx="180" cy="44" r="3" fill="' + GOLD + '"/><circle cx="82" cy="52" r="3" fill="' + BLUE + '"/></g>');

  // ---- small builders ----
  function rc(x, y, w, h, fill) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + fill + '" stroke="' + LINE + '"/>'; }
  function bar(x, y, w, fill, stroke) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="6" rx="3" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '"' : '') + '/>'; }
  function lines(x, y, n, w) { var s = ''; for (var i = 0; i < 5; i++) s += bar(x, y + i * 13, (i % 2 ? w * .7 : w), LINE); return s; }
  function tag(x, y, t, c) { return '<rect x="' + x + '" y="' + y + '" width="' + (t ? 44 : 24) + '" height="15" rx="7" fill="#fff" stroke="' + c + '"/>' + (t ? '<text x="' + (x + 22) + '" y="' + (y + 11) + '" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="' + c + '" text-anchor="middle">' + t + '</text>' : '') ; }
  function col(x, label, dots) {
    var s = '<text x="' + (x + 22) + '" y="34" font-size="7.5" font-family="Inter,sans-serif" font-weight="700" fill="' + INK3 + '" text-anchor="middle">' + label.toUpperCase() + '</text>';
    for (var i = 0; i < dots.length; i++) { s += '<rect x="' + x + '" y="' + (46 + i * 26) + '" width="44" height="20" rx="5" fill="#fff" stroke="' + LINE + '"/><circle cx="' + (x + 8) + '" cy="' + (56 + i * 26) + '" r="3" fill="' + dots[i] + '"/>'; }
    return s;
  }

  // ============================ TOURS ============================
  // Each step targets a real [data-tour] element on the page named by `page`.
  // Steps with no `target` render as a centered card (used only for the intro).
  var TOURS = [
    {
      id: 'getting-started', title: 'Getting Started', tagline: 'The whole platform in six stops',
      icon: 'map', color: NAVY, minutes: 2, primary: true,
      steps: [
        { illus: 'welcome', title: 'Welcome to MCAAP', body: 'Your agency operations command center — tasks, clearance, memos, briefings and an AI agent fleet, all in one place. This quick tour shows where everything lives. Use the arrow keys or the buttons below to move; press Esc to leave anytime.', page: 'dashboard' },
        { illus: 'explore', target: '[data-tour="nav-explore"]', placement: 'bottom', title: 'Explore', page: 'dashboard', body: 'Browse and search every collection, device, topic and person that has been ingested into the ecosystem. This is your window into the underlying data.' },
        { illus: 'tasks', target: '[data-tour="nav-tasks"]', placement: 'bottom', title: 'Tasks', page: 'dashboard', body: 'The production board — every piece of work moving from Backlog to Done, plus the queue for your AI agent fleet.' },
        { illus: 'briefings', target: '[data-tour="nav-workspaces"]', placement: 'bottom', title: 'Workspaces', page: 'dashboard', body: 'Your specialized workflows live here: Clearance, Memos, Prep, Briefing Books, Language Exploitation, Triage and more. Open the menu to jump into any one.' },
        { illus: 'agents', target: '[data-tour="agents"]', placement: 'bottom', title: 'Your agent fleet', page: 'dashboard', body: 'Watch AI agents work in real time. The badge tells you how many runs are live and how many are paused waiting for your sign-off.' },
        { illus: 'help', target: '[data-tour="help"]', placement: 'bottom', title: 'Help is always here', page: 'dashboard', body: 'Reopen this tutorial anytime from the “?” button and pick any workflow tour. Ready to dive into a specific workflow? Choose one from the menu next.' }
      ]
    },
    {
      id: 'tasks-agents', title: 'Tasks & AI Agents', tagline: 'Run the board and delegate to your fleet',
      icon: 'check_square', color: BLUE, minutes: 3,
      steps: [
        { illus: 'tasks', target: '[data-tour="tasks-title"]', placement: 'bottom', page: 'tasks-board', title: 'This is Tasks', body: 'Every piece of production work, from press clearance to deposition prep, tracked in one place and moving from intake to done.' },
        { illus: 'tasks', target: '[data-tour="tasks-views"]', placement: 'bottom', title: 'Three views', body: 'See the work as a Board, a flat List, or a Calendar — switch here depending on how you want to plan.' },
        { illus: 'memos', target: '[data-tour="tasks-workflows"]', placement: 'bottom', title: 'Filter by pipeline', body: 'Each workflow — press clearance, relevance coding, brief review, privilege sign-off and more — has its own pipeline. Pick one to focus the board.' },
        { illus: 'tasks', target: '[data-tour="tasks-board"]', placement: 'top', title: 'Move work across columns', body: 'Drag a card from one column to the next to advance it. Whatever column it sits in is its status — no separate step needed.' },
        { illus: 'agents', target: '[data-tour="tasks-assignee"]', placement: 'bottom', title: 'People or agents', body: 'Split the board between People and AI Agents. Any card can be handed to an agent to run — look for “Run with…” on a card.' },
        { illus: 'agents', target: '[data-tour="agents"]', placement: 'bottom', title: 'Watch & approve your fleet', body: 'Your agent fleet lives up here. This shows how many runs are working now and how many are paused waiting for your sign-off — click to open any run.' }
      ]
    },
    {
      id: 'clearance', title: 'Clearance', tagline: 'Screen statements before they go public',
      icon: 'megaphone', color: GREEN, minutes: 3,
      steps: [
        { illus: 'clearance', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'clearance', title: 'This is Clearance', body: 'Clearance screens public statements — press releases, media statements, talking points — against privileged material and conduct rules before release.' },
        { illus: 'agents', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Screen or add a statement', body: 'Run VESTA to AI-screen a draft against the case’s confidential materials, or add a new statement to begin.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Your queue', body: 'Switch between Assigned to me, My team and All to control which statements you see.' },
        { illus: 'clearance', target: '[data-tour="ws-table"]', placement: 'top', title: 'Work a statement', body: 'Open any row to review the AI findings inline, apply suggested revisions, then route the statement to counsel for final clearance — with a full audit trail.' }
      ]
    },
    {
      id: 'memos', title: 'Memos', tagline: 'Concur and pass memos up the chain',
      icon: 'route', color: NAVY, minutes: 2,
      steps: [
        { illus: 'memos', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'memos', title: 'This is Memos', body: 'Memos move decision documents upward — each one is reviewed, concurred on, and passed to the next person in the chain.' },
        { illus: 'prep', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a memo', body: 'Create a new memo when you need to put a decision or recommendation in writing.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'What’s awaiting you', body: 'Your queue surfaces memos waiting on your concurrence, separate from what your team is handling.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Read, concur, track', body: 'Open a memo to read it, add your concurrence, or send it back with comments — and see exactly where it sits in the routing chain.' }
      ]
    },
    {
      id: 'prep', title: 'Prep', tagline: 'Draft memos & assessments from templates',
      icon: 'pen', color: GOLD, minutes: 2,
      steps: [
        { illus: 'prep', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'prep', title: 'This is Prep', body: 'Prep is your drafting workspace — start memos and assessments from proven templates instead of a blank page.' },
        { illus: 'prep', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a draft', body: 'Spin up a new draft from a template; the structure and boilerplate come pre-filled so you focus on substance.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Yours vs the team’s', body: 'Filter to the drafts you’re collaborating on, or see everything your team has in flight.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Write, then hand off', body: 'Open a draft to write with AI assist, then send it into Memos or Clearance to begin its review journey.' }
      ]
    },
    {
      id: 'briefings', title: 'Briefing Books', tagline: 'Build and collate briefing books',
      icon: 'book', color: GOLD, minutes: 2,
      steps: [
        { illus: 'briefings', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'briefings', title: 'This is Briefing Books', body: 'Assemble polished, multi-section books that pull together everything a principal needs for a meeting or event.' },
        { illus: 'briefings', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a new book', body: 'Create a book, then collate sections into it.' },
        { illus: 'explore', target: '[data-tour="brief-stats"]', placement: 'bottom', title: 'Track the pipeline', body: 'See your build queue, what’s been distributed, what’s awaiting feedback, and your average receiver rating.' },
        { illus: 'tasks', target: '[data-tour="brief-views"]', placement: 'bottom', title: 'Queue vs history', body: 'Flip between books you’re still building and the history of distributed books with reader feedback.' },
        { illus: 'briefings', target: '[data-tour="brief-grid"]', placement: 'top', title: 'Open a book', body: 'Open any book to add and reorder sections — memos, assessments, maps — then publish and share it.' }
      ]
    },
    {
      id: 'language', title: 'Language Exploitation', tagline: 'Turn what your team knows into shared knowledge',
      icon: 'bulb', color: GREEN, minutes: 3,
      steps: [
        { illus: 'language', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'knowledge', title: 'This is Language Exploitation', body: 'This workspace turns what your team knows — including knowledge that only lives in people’s heads — into shared, searchable, endorsed articles.' },
        { illus: 'help', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Capture knowledge', body: 'Start a capture from a source or a quick note whenever you learn something worth keeping.' },
        { illus: 'briefings', target: '[data-tour="lang-articles"]', placement: 'top', title: 'Knowledge articles', body: 'Documented know-how, endorsed by the team, so the next person doesn’t have to relearn it.' },
        { illus: 'upload', target: '[data-tour="lang-sources"]', placement: 'left', title: 'Connect the sources', body: 'Link the tools where notes already live so nothing gets stranded outside the ecosystem.' },
        { illus: 'search', target: '[data-tour="lang-capture"]', placement: 'left', title: 'Capture what’s stuck', body: 'The system surfaces knowledge trapped in one person’s notes — import it in a click.' }
      ]
    },
    {
      id: 'upload', title: 'Data Upload', tagline: 'Bring datasets into the ecosystem',
      icon: 'database', color: NAVY, minutes: 2,
      steps: [
        { illus: 'upload', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'upload', title: 'This is Data Upload', body: 'The front door for new material — datasets, device extractions and files entering the ecosystem.' },
        { illus: 'prep', target: '[data-tour="upload-details"]', placement: 'right', title: 'Describe the dataset', body: 'Name it and set the source, category and classification. Good intake metadata makes everything downstream findable and trusted.' },
        { illus: 'upload', target: '[data-tour="upload-files"]', placement: 'top', title: 'Add the files', body: 'Drag files onto the dropzone — TIFF, CSV, GeoJSON, PDF, ZIP — and watch each one upload.' },
        { illus: 'explore', target: '[data-tour="upload-checklist"]', placement: 'left', title: 'Submit to ingest', body: 'The intake checklist tracks what’s still required. When it’s complete, submit — the dataset is validated, indexed and appears in Explore.' }
      ]
    },
    {
      id: 'triage', title: 'Triage', tagline: 'First-pass coding & sign-offs',
      icon: 'eye', color: GREEN, minutes: 2,
      steps: [
        { illus: 'triage', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'review', title: 'This is Triage', body: 'Triage gives new items their first pass — coded for relevance, signed off, and tracked with a full change history.' },
        { illus: 'clearance', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Jump in', body: 'Start review opens the first item in your queue so you can begin coding immediately.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Focus your queue', body: 'Work what’s assigned to you, or take on the whole team’s backlog.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Code & sign off', body: 'Open an item to tag it, mark it relevant or not, and sign off. Every decision is recorded with who, what and when.' }
      ]
    },
    {
      id: 'explore', title: 'Explore & Search', tagline: 'Find anything in the ecosystem',
      icon: 'search', color: BLUE, minutes: 2,
      steps: [
        { illus: 'search', target: '[data-tour="explore-search"]', placement: 'bottom', page: 'explore', title: 'Search across everything', body: 'One search bar spans every source. Toggle AI Mode to ask in plain language instead of keywords.' },
        { illus: 'explore', target: '[data-tour="explore-browse"]', placement: 'bottom', title: 'Or browse', body: 'Don’t know the query yet? Browse by Collections, Topics, Devices and People — the graph is fully linked.' },
        { illus: 'agents', target: '[data-tour="explore-tabs"]', placement: 'bottom', title: 'Map & subscriptions', body: 'Switch to Map to draw a polygon and pull every geotagged item inside it, or Subscriptions for saved searches that auto-run and flag new results.' }
      ]
    }
  ];

  window.MCAAP_ILLUS = ILLUS;
  window.MCAAP_TOURS = TOURS;

  // ============================ ROLES ============================
  // Curated learning paths. Each role points at the tours most relevant to it
  // (in recommended order). Getting Started is auto-pinned to the top of every
  // role path by the menu, so it need not be listed here.
  var ROLES = [
    { id: 'ops',       label: 'Operations Lead',        icon: 'map',          color: NAVY,  blurb: 'Run the board, delegate to agents, keep work moving.', tours: ['tasks-agents', 'explore', 'clearance', 'briefings'] },
    { id: 'cmo',       label: 'Collection Manager',     icon: 'database',     color: NAVY,  blurb: 'Bring data in and make it findable across the ecosystem.', tours: ['upload', 'explore', 'tasks-agents'] },
    { id: 'exploiter', label: 'Language Exploiter',     icon: 'bulb',         color: GREEN, blurb: 'Turn source material & tribal knowledge into shared intel.', tours: ['language', 'upload', 'explore'] },
    { id: 'clearance', label: 'Clearance Officer',      icon: 'megaphone',    color: GREEN, blurb: 'Screen statements and route decisions for sign-off.', tours: ['clearance', 'memos', 'explore'] },
    { id: 'briefer',   label: 'Reports & Briefings',    icon: 'book',         color: GOLD,  blurb: 'Draft, concur, and assemble briefing books.', tours: ['prep', 'memos', 'briefings', 'explore'] },
    { id: 'reviewer',  label: 'Triage Reviewer',        icon: 'eye',          color: GREEN, blurb: 'First-pass coding, relevance calls and sign-offs.', tours: ['triage', 'explore', 'tasks-agents'] }
  ];

  window.MCAAP_ROLES = ROLES;
})();
