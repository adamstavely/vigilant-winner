import { Component, Element, State, Method, h } from '@stencil/core';
import { TOURS, Tour, Step } from './tours';
import { ROLES, Role } from './tours';
import { ILLUS } from './illustrations';

const STORE_KEY = 'mcaap.onboarding.v1';

/** Map a step's `page` hint onto the host app's navigation. Adapt to your router. */
function navigate(page?: string) {
  if (!page) return;
  const w = window as any;
  if (page === 'tasks-board') { w.__openTasks ? w.__openTasks({ view: 'board' }) : w.__setPage?.('tasks'); return; }
  if (page === 'agents' || page === 'tasks-fleet') { w.__goAgents ? w.__goAgents() : w.__setPage?.('tasks'); return; }
  w.__setPage?.(page);
}

const ICONS: Record<string, string> = {
  map: '<path d="M9 4.5L3.5 7v12.5L9 17l6 2.5 5.5-2.5V4.5L15 7 9 4.5z"/><path d="M9 4.5v12.5M15 7v12.5"/>',
  check_square: '<path d="M9 11.5l2 2 4.5-4.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/>',
  megaphone: '<path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H8l8 4.5V5L8 9.5H5.5A1.5 1.5 0 0 0 4 10.5z"/><path d="M18.5 9a3.4 3.4 0 0 1 0 6"/>',
  route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/>',
  pen: '<path d="M4 20l.9-3.6L15.4 5.9a2 2 0 0 1 2.8 0a2 2 0 0 1 0 2.8L7.6 19.1 4 20z"/><path d="M14 7.4l2.6 2.6"/>',
  book: '<path d="M12 6.4C10.4 5 7.8 4.6 4.5 5.2v13c3.3-.6 5.9-.2 7.5 1.2"/><path d="M12 6.4C13.6 5 16.2 4.6 19.5 5.2v13c-3.3-.6-5.9-.2-7.5 1.2"/><path d="M12 6.4v13.2"/>',
  bulb: '<path d="M9.5 18.5h5M10.5 21.5h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.6 3.1 3 7 3s7-1.4 7-3V6"/><path d="M5 12c0 1.6 3.1 3 7 3s7-1.4 7-3"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow_right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrow_left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>',
};
const Icon = (name: string, size = 18) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    stroke-width={1.9} stroke-linecap="round" stroke-linejoin="round" innerHTML={ICONS[name] || ''} />
);

const TINTS: Record<string, string> = { '#1D3557': '#EAF0F7', '#0073E6': '#EBF4FF', '#16A34A': '#F0FDF4', '#B5851C': '#FFFBEB' };

@Component({ tag: 'mcaap-onboarding', styleUrl: 'mcaap-onboarding.css', shadow: true })
export class McaapOnboarding {
  @Element() el!: HTMLElement;

  @State() mode: 'closed' | 'welcome' | 'menu' | 'tour' | 'done' = 'closed';
  @State() tourId: string | null = null;
  @State() step = 0;
  @State() menuTab: 'role' | 'all' = 'role';
  @State() selectedRole: string | null = null;
  @State() completed: Record<string, boolean> = {};
  @State() neverShow = false;
  private seenWelcome = false;

  // ---- public API ----
  @Method() async open() { this.mode = 'menu'; }
  @Method() async start(id: string) { this.beginTour(id); }

  private get tour(): Tour | undefined { return TOURS.find(t => t.id === this.tourId); }

  connectedCallback() {
    this.loadState();
    this.onOpen = () => (this.mode = 'menu');
    this.onStart = (e: any) => this.beginTour(e.detail?.id);
    this.onKey = this.handleKey.bind(this);
    this.onScroll = () => { if (this.mode === 'tour') this.layout(); };
    window.addEventListener('mcaap-tour:open', this.onOpen);
    window.addEventListener('mcaap-tour:start', this.onStart as EventListener);
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onScroll);
    window.addEventListener('scroll', this.onScroll, true);
    if (!this.seenWelcome && !this.neverShow) setTimeout(() => { if (this.mode === 'closed') this.mode = 'welcome'; }, 900);
  }
  disconnectedCallback() {
    window.removeEventListener('mcaap-tour:open', this.onOpen);
    window.removeEventListener('mcaap-tour:start', this.onStart as EventListener);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onScroll);
    window.removeEventListener('scroll', this.onScroll, true);
  }
  private onOpen!: () => void;
  private onStart!: (e: Event) => void;
  private onKey!: (e: KeyboardEvent) => void;
  private onScroll!: () => void;

  // ---- persistence ----
  private loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      this.completed = s.completed || {};
      this.neverShow = !!s.neverShow;
      this.seenWelcome = !!s.seenWelcome;
    } catch { /* first run */ }
  }
  private saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ completed: this.completed, neverShow: this.neverShow, seenWelcome: this.seenWelcome })); } catch { /* ignore */ }
  }

  // ---- flow ----
  private beginTour(id?: string) {
    if (!TOURS.some(t => t.id === id)) return;
    this.tourId = id!; this.step = 0; this.mode = 'tour';
    this.seenWelcome = true; this.saveState();
    this.enterStep();
  }
  private enterStep() {
    const s = this.tour!.steps[this.step];
    if (s.page) navigate(s.page);
    let tries = 0;
    const attempt = () => {
      const ok = !s.target || document.querySelector(s.target);
      if (ok || tries > 28) { this.step = this.step; this.layout(); return; }
      tries++; requestAnimationFrame(attempt);
    };
    setTimeout(attempt, s.page ? 90 : 0);
  }
  private next() {
    const t = this.tour!;
    if (this.step >= t.steps.length - 1) { this.finish(); return; }
    this.step++; this.enterStep();
  }
  private prev() { if (this.step > 0) { this.step--; this.enterStep(); } }
  private finish() {
    this.completed = { ...this.completed, [this.tourId!]: true };
    this.seenWelcome = true; this.saveState();
    this.mode = 'done';
  }
  private close() { this.mode = 'closed'; this.tourId = null; }

  private handleKey(e: KeyboardEvent) {
    if (this.mode === 'closed') return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
    if (this.mode !== 'tour') return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); this.next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
  }

  componentDidRender() { if (this.mode === 'tour') this.layout(); }

  // ---- spotlight positioning ----
  private layout() {
    const s = this.tour?.steps[this.step];
    if (!s) return;
    const sr = this.el.shadowRoot!;
    const target = s.target ? document.querySelector(s.target) as HTMLElement | null : null;
    const hole = sr.querySelector('.hole') as HTMLElement, ring = sr.querySelector('.ring') as HTMLElement,
      arrow = sr.querySelector('.arrow') as HTMLElement, card = sr.querySelector('.card') as HTMLElement;
    if (!target || !hole || !card) return;

    let r = target.getBoundingClientRect();
    const vh = window.innerHeight, vw = window.innerWidth, pad = 8;
    if (r.top < 80 || r.bottom > vh - 60) {
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - Math.max(90, vh * 0.28)), behavior: 'smooth' });
      setTimeout(() => this.layout(), 340);
    }
    r = target.getBoundingClientRect();
    const hx = r.left - pad, hy = r.top - pad, hw = r.width + pad * 2, hh = r.height + pad * 2;
    Object.assign(hole.style, { left: hx + 'px', top: hy + 'px', width: hw + 'px', height: hh + 'px' });
    Object.assign(ring.style, { left: (hx - 2) + 'px', top: (hy - 2) + 'px', width: (hw + 4) + 'px', height: (hh + 4) + 'px' });

    const cw = card.offsetWidth || 360, ch = card.offsetHeight || 320, gap = 18;
    let place = s.placement || 'bottom';
    const below = vh - r.bottom, above = r.top;
    if (place === 'bottom' && below < ch + gap && above > below) place = 'top';
    if (place === 'top' && above < ch + gap && below > above) place = 'bottom';
    let top: number, left: number; const ar: { top?: number; left?: number } = {};
    if (place === 'top' || place === 'bottom') {
      left = Math.max(12, Math.min(r.left + r.width / 2 - cw / 2, vw - cw - 12));
      top = place === 'bottom' ? r.bottom + gap : r.top - ch - gap;
      ar.left = Math.max(left + 14, Math.min(r.left + r.width / 2 - 7, left + cw - 22));
      ar.top = place === 'bottom' ? top - 7 : top + ch - 7;
    } else {
      top = Math.max(12, Math.min(r.top + r.height / 2 - ch / 2, vh - ch - 12));
      left = place === 'right' ? r.right + gap : r.left - cw - gap;
      ar.top = Math.max(top + 14, Math.min(r.top + r.height / 2 - 7, top + ch - 22));
      ar.left = place === 'right' ? left - 7 : left + cw - 7;
    }
    top = Math.max(12, Math.min(top, vh - ch - 12));
    Object.assign(card.style, { top: top + 'px', left: left + 'px' });
    if (arrow) Object.assign(arrow.style, { top: ar.top + 'px', left: ar.left + 'px', display: 'block' });
  }

  // ---- views ----
  render() {
    if (this.mode === 'closed') return null;
    if (this.mode === 'welcome') return this.viewWelcome();
    if (this.mode === 'menu') return this.viewMenu();
    if (this.mode === 'tour') return this.viewTour();
    return this.viewDone();
  }

  private viewWelcome() {
    return (
      <div class="wrap">
        <div class="catch" />
        <div class="centerwrap"><div class="modal">
          <button class="btn btn-icon close" onClick={() => this.close()} aria-label="Close">{Icon('x', 17)}</button>
          <div class="mhead">
            <div class="mhero" innerHTML={ILLUS.welcome} />
            <div class="eyebrow"><span class="dot" />Guided tour</div>
            <h1 class="mtitle">Welcome to MCAAP</h1>
            <p class="mtext">Your agency operations command center. Take a two-minute tour of the whole platform, or jump straight into the workflow you work in most.</p>
          </div>
          <div class="mbody">
            <div class="mactions">
              <button class="btn btn-primary btn-lg" onClick={() => this.beginTour('getting-started')}>{Icon('map', 17)}Take the tour</button>
              <button class="btn btn-ghost btn-lg" onClick={() => (this.mode = 'menu')}>Browse all tours {Icon('arrow_right', 16)}</button>
            </div>
            <div class="skiprow" style={{ padding: '18px 0 0' }}>
              <label class="chk"><input type="checkbox" checked={this.neverShow}
                onInput={(e: any) => { this.neverShow = e.target.checked; this.seenWelcome = true; this.saveState(); }} /> Don’t show this again</label>
              <button class="btn btn-text" onClick={() => this.close()}>Skip for now</button>
            </div>
          </div>
        </div></div>
      </div>
    );
  }

  private tourCard(t: Tour) {
    const done = !!this.completed[t.id];
    return (
      <button class={{ tourcard: true, primary: !!t.primary }} onClick={() => this.beginTour(t.id)}>
        <span class="tc-icon" style={{ background: TINTS[t.color] || '#F1F5F9', color: t.color }}>{Icon(t.icon, 20)}</span>
        <span style={{ flex: '1', minWidth: '0' }}>
          <span class="tc-title">{t.title}{done && <span class="done-badge">{Icon('check', 11)}Done</span>}</span>
          <span class="tc-tag">{t.tagline}</span>
          <span class="tc-meta">{Icon('clock', 12)}{t.minutes} min · {t.steps.length} steps</span>
        </span>
        {t.primary && <span style={{ color: t.color }}>{Icon('arrow_right', 18)}</span>}
      </button>
    );
  }

  private rolePath(role: Role): Tour[] {
    const ids = role.tours.slice();
    if (ids.indexOf('getting-started') < 0) ids.unshift('getting-started');
    const seen: Record<string, boolean> = {};
    return ids.map(id => TOURS.find(t => t.id === id)).filter((t): t is Tour => !!t && !seen[t.id] && (seen[t.id] = true));
  }

  private viewMenu() {
    const doneCount = TOURS.filter(t => this.completed[t.id]).length;
    const tab = this.menuTab;
    let body: any;
    if (tab === 'all') {
      body = <div class="menu-grid">{TOURS.map(t => this.tourCard(t))}</div>;
    } else if (!this.selectedRole) {
      body = [
        <div class="menu-hint">Choose your role to see a recommended learning path — or switch to <b>All tutorials</b> to pick any.</div>,
        <div class="role-grid">{ROLES.map(r => {
          const path = this.rolePath(r);
          const done = path.filter(t => this.completed[t.id]).length;
          return (
            <button class="rolecard" onClick={() => (this.selectedRole = r.id)}>
              <span class="tc-icon" style={{ background: TINTS[r.color] || '#F1F5F9', color: r.color }}>{Icon(r.icon, 20)}</span>
              <span class="rc-title">{r.label}{done === path.length && <span class="done-badge">{Icon('check', 11)}Done</span>}</span>
              <span class="rc-blurb">{r.blurb}</span>
              <span class="tc-meta">{Icon('map', 12)}{path.length} tutorials{done ? ' · ' + done + ' done' : ''}</span>
              <span class="rc-go">{Icon('arrow_right', 16)}</span>
            </button>
          );
        })}</div>,
      ];
    } else {
      const role = ROLES.find(r => r.id === this.selectedRole) || ROLES[0];
      const path = this.rolePath(role);
      body = [
        <button class="backbtn" onClick={() => (this.selectedRole = null)}>{Icon('arrow_left', 15)}All roles</button>,
        <div class="role-head">
          <span class="tc-icon" style={{ background: TINTS[role.color] || '#F1F5F9', color: role.color }}>{Icon(role.icon, 20)}</span>
          <div style={{ minWidth: '0' }}><div class="rh-title">{role.label}</div><div class="rh-blurb">{role.blurb}</div></div>
        </div>,
        <div class="path-label">{Icon('map', 12)}Recommended path · {path.length} tutorials</div>,
        <div class="menu-grid">{path.map(t => this.tourCard(t))}</div>,
      ];
    }
    return (
      <div class="wrap">
        <div class="catch" />
        <div class="centerwrap"><div class="modal">
          <div class="menu-head">
            <span class="menu-mark">{Icon('map', 22)}</span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div class="mtitle" style={{ fontSize: '20px', margin: '0' }}>Tutorials</div>
              <div class="mtext" style={{ fontSize: '13px', marginTop: '3px' }}>{doneCount} of {TOURS.length} completed. Replay any tutorial anytime.</div>
            </div>
            <button class="btn btn-icon" onClick={() => this.close()} aria-label="Close">{Icon('x', 17)}</button>
          </div>
          <div class="menu-tabs">
            <div class="seg">
              <button class={{ on: tab === 'role' }} onClick={() => { this.menuTab = 'role'; this.selectedRole = null; }}>{Icon('user', 15)}By role</button>
              <button class={{ on: tab === 'all' }} onClick={() => { this.menuTab = 'all'; this.selectedRole = null; }}>{Icon('grid', 15)}All tutorials</button>
            </div>
          </div>
          <div class="mbody" style={{ padding: '0 0 6px' }}>
            {body}
            <div class="menu-foot">
              <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Use <span class="kbd">←</span> <span class="kbd">→</span> to navigate · <span class="kbd">Esc</span> to close</span>
              <button class="btn btn-text" onClick={() => { this.completed = {}; this.saveState(); }}>Reset progress</button>
            </div>
          </div>
        </div></div>
      </div>
    );
  }

  private viewTour() {
    const t = this.tour!, s = t.steps[this.step], total = t.steps.length;
    const hasTarget = !!(s.target && document.querySelector(s.target));
    const pct = Math.round(((this.step + 1) / total) * 100);
    const last = this.step >= total - 1;
    const card = (
      <div class={{ card: true, center: !hasTarget }}>
        <button class="btn btn-icon close" onClick={() => this.close()} aria-label="Close tour">{Icon('x', 16)}</button>
        <div class="illus" innerHTML={ILLUS[s.illus] || ILLUS.welcome} />
        <div class="body">
          <div class="eyebrow"><span class="dot" />{t.title}</div>
          <h2 class="title">{s.title}</h2>
          <p class="text">{s.body}</p>
        </div>
        <div class="foot">
          <div class="prog">
            <div class="count">Step {this.step + 1} of {total}</div>
            <div class="track"><div class="fill" style={{ width: pct + '%' }} /></div>
          </div>
          <div class="btns">
            {this.step > 0 && <button class="btn btn-icon" onClick={() => this.prev()} aria-label="Back">{Icon('arrow_left', 16)}</button>}
            <button class="btn btn-primary" onClick={() => this.next()}>{last ? 'Finish' : 'Next'}{last ? Icon('check', 16) : Icon('arrow_right', 16)}</button>
          </div>
        </div>
        <div class="skiprow">
          <button class="btn btn-text" onClick={() => (this.mode = 'menu')}>All tours</button>
          <button class="btn btn-text" onClick={() => this.close()}>Skip tour</button>
        </div>
      </div>
    );
    return hasTarget
      ? <div class="wrap"><div class="catch clear" /><div class="hole" /><div class="ring" /><div class="arrow" />{card}</div>
      : <div class="wrap"><div class="catch" /><div class="centerwrap">{card}</div></div>;
  }

  private viewDone() {
    const t = this.tour;
    const nextT = TOURS.find(x => !this.completed[x.id] && !x.primary);
    return (
      <div class="wrap">
        <div class="catch" />
        <div class="centerwrap"><div class="modal">
          <button class="btn btn-icon close" onClick={() => this.close()} aria-label="Close">{Icon('x', 17)}</button>
          <div class="mhead">
            <div class="mhero" innerHTML={ILLUS.celebrate} />
            <div class="eyebrow"><span class="dot" />Tour complete</div>
            <h1 class="mtitle">Nice work!</h1>
            <p class="mtext">You’ve finished the <b style={{ color: '#24272D' }}>{t?.title}</b> tour. It’s marked complete — you can replay it anytime from the “?” menu.</p>
          </div>
          <div class="mbody"><div class="mactions">
            {nextT && <button class="btn btn-primary btn-lg" onClick={() => this.beginTour(nextT.id)}>Next: {nextT.title} {Icon('arrow_right', 16)}</button>}
            <button class="btn btn-ghost btn-lg" onClick={() => (this.mode = 'menu')}>{Icon('map', 16)}All tours</button>
            <button class="btn btn-text btn-lg" onClick={() => this.close()}>Done</button>
          </div></div>
        </div></div>
      </div>
    );
  }
}
