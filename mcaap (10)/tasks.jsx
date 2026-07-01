// tasks.jsx — Workflow kanban board with dynamic columns, filters, calendar

// ---- generic board columns (shown for "All tasks") ----
const GEN_COLS = [
  { id: 'todo', label: 'To do', accent: '#64748B' },
  { id: 'in_progress', label: 'In progress', accent: '#0073E6' },
  { id: 'blocked', label: 'Blocked / waiting', accent: '#DC2626' },
  { id: 'done', label: 'Done', accent: '#16A34A', tail: true }];


// ---- workflows, each with its own pipeline columns ----
const WF = {
  press: {
    label: 'Press clearance', icon: 'megaphone', color: '#16A34A', tint: '#F0FDF4',
    cols: [
    { id: 'intake', label: 'Intake' },
    { id: 'airev', label: 'AI risk review' },
    { id: 'counsel', label: 'Counsel clearance' },
    { id: 'cleared', label: 'Cleared', tail: true }] },

  relevance: {
    label: 'Relevance coding', icon: 'inbox', color: '#0073E6', tint: '#EBF4FF',
    cols: [
    { id: 'queue', label: 'Review queue' },
    { id: 'first', label: 'First-level' },
    { id: 'qc', label: 'Conflicts / QC' },
    { id: 'coded', label: 'Coded', tail: true }] },

  brief: {
    label: 'Brief review', icon: 'pen', color: '#E1574F', tint: '#FDEBEA',
    cols: [
    { id: 'draft', label: 'Drafting' },
    { id: 'counsel', label: 'Counsel review' },
    { id: 'revise', label: 'Revisions' },
    { id: 'filed', label: 'Filed', tail: true }] },

  privilege: {
    label: 'Privilege sign-off', icon: 'shield', color: '#B5851C', tint: '#F8F0DA',
    cols: [
    { id: 'flagged', label: 'Flagged' },
    { id: 'review', label: 'Privilege review' },
    { id: 'log', label: 'On the log' },
    { id: 'signed', label: 'Signed off', tail: true }] },

  deposition: {
    label: 'Deposition prep', icon: 'mic', color: '#475569', tint: '#F1F5F9',
    cols: [
    { id: 'outline', label: 'Outline' },
    { id: 'exhibits', label: 'Exhibits' },
    { id: 'desig', label: 'Designations' },
    { id: 'ready', label: 'Depo-ready', tail: true }] },

  production: {
    label: 'Production sign-off', icon: 'layers', color: '#2E8B8B', tint: '#E1F2F2',
    cols: [
    { id: 'stage', label: 'Staging' },
    { id: 'qc', label: 'Conversion / QC' },
    { id: 'priv', label: 'Privilege check' },
    { id: 'produced', label: 'Produced', tail: true }] } };



const WF_ORDER = ['press', 'relevance', 'brief', 'privilege', 'deposition', 'production'];

const PRI_COLOR = { urgent: '#DC2626', high: '#C58A1E' };

// people for this board (name + initials + color)
const P = {
  jordan: { name: 'Jordan Cole', initials: 'JC', color: '#1D3557' },
  okafor: { name: 'A. Okafor', initials: 'AO', color: '#1D3557' },
  park: { name: 'L. Park', initials: 'LP', color: '#1D3557' },
  team: { name: 'Review team', initials: 'RT', color: '#1D3557' },
  self: { name: 'Self', initials: 'TC', color: '#0073E6' },
  foster: { name: 'D. Foster', initials: 'DF', color: '#1D3557' },
  mine: true };


// wf: workflow id · g: generic column · w: workflow column · pri · due · tone · done · doneDate · mine
function wt(id, wf, g, w, title, desc, who, opts = {}) {
  return { id, wf, g, w, title, desc, who, pri: opts.pri || null,
    due: opts.due || '', tone: opts.tone || null, done: !!opts.done, doneDate: opts.doneDate || '', mine: !!opts.mine };
}

const WF_TASKS = [
wt('M1', 'press', 'todo', 'airev', 'Clear press release — MSJ filing',
'5 AI findings open · 2 high-risk (privilege + Rule 3.6)', 'jordan',
{ pri: 'urgent', due: 'today', tone: 'today', mine: true }),
wt('M2', 'brief', 'todo', 'counsel', 'Review draft — Motion for Summary Judgment',
'Argument section needs counsel review before filing', 'okafor',
{ pri: 'high', due: 'in 2d' }),
wt('M3', 'privilege', 'todo', 'review', 'Privilege sign-off — 12 flagged documents',
'GC separation memo & related A/C communications for the log', 'park',
{ pri: 'high', due: 'in 5d' }),
wt('M4', 'relevance', 'todo', 'qc', 'Second-level review — VANT-PROD-002 hot docs',
'Confirm relevance calls on 8 documents flagged hot', 'team',
{ due: 'in 7d' }),
wt('M5', 'deposition', 'in_progress', 'exhibits', 'Prep outline — Henderson deposition',
'Cross-reference exhibits to the chronology before 7/9', 'self',
{ pri: 'high', due: 'in 6d', mine: true }),
wt('M6', 'press', 'in_progress', 'counsel', 'Review media statement — depositions',
'1 minor accuracy finding; awaiting your clearance', 'jordan',
{ due: 'tomorrow', tone: 'tomorrow', mine: true }),
wt('M7', 'relevance', 'blocked', 'qc', 'Resolve coding conflicts — Caldwell custodian',
'Two reviewers disagree on 4 documents; needs your call', 'team',
{ due: 'in 8d', mine: true }),
wt('M8', 'production', 'blocked', 'qc', 'Sign off — PLF-PROD-003 before service',
'Waiting on vendor TIFF conversion to complete', 'foster',
{ due: 'in 9d' }),
wt('M9', 'deposition', 'done', 'ready', 'Reviewed — Caldwell deposition designations',
'Designations & counter-designations finalized', 'okafor',
{ pri: 'high', done: true, doneDate: 'Jun 26, 24' }),
wt('M10', 'press', 'done', 'cleared', 'Cleared — initial filing press release',
'Approved & released 4/11', 'jordan',
{ done: true, doneDate: 'Apr 10, 24' }),
wt('M11', 'brief', 'done', 'filed', 'Approve — Motion in Limine (Atlas materials)',
'Cleared for filing', 'park',
{ done: true, doneDate: 'Jun 27, 24' })];


const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

function TasksPage({ openCreate, openTask, openRun, flash, glyph='diamond', framing='codename', flat=false }) {
  const [view, setView] = React.useState((window.__tasksView)||'board'); // board | fleet | calendar
  const [scope, setScope] = React.useState('teams'); // teams | mine
  const [asg, setAsg] = React.useState(window.__tasksAsg||'all'); // all | people | agents
  const [wf, setWf] = React.useState(window.__tasksWf||'all'); // all | <workflow id>
  const [items, setItems] = React.useState(WF_TASKS);
  React.useEffect(()=>{
    if(window.__tasksView){ setView(window.__tasksView); window.__tasksView=null; }
    if(window.__tasksAsg){ setAsg(window.__tasksAsg); window.__tasksAsg=null; }
    if(window.__tasksWf){ setWf(window.__tasksWf); window.__tasksWf=null; }
  },[]);

  // scope filter (Only Mine / My Teams) is independent of the workflow chips
  const scoped = scope === 'mine' ? items.filter((t) => t.mine) : items;

  // open = not done; counts used by the workflow chips
  const wfCount = (id) => scoped.filter((t) => t.wf === id && !t.done).length;
  const allOpen = scoped.filter((t) => !t.done).length;

  // board mode: generic columns for "all", pipeline columns for a workflow
  const isWf = wf !== 'all';
  const cols = isWf ? WF[wf].cols : GEN_COLS;
  const colKey = isWf ? 'w' : 'g';
  const boardTasks = isWf ? scoped.filter((t) => t.wf === wf) : scoped;

  function moveTask(id, colId) {
    setItems((arr) => arr.map((t) => t.id === id ? { ...t, [colKey]: colId, done: colKey === 'g' ? colId === 'done' : t.done } : t));
  }

  const subtitle = isWf ?
  `${WF[wf].label} pipeline · ${boardTasks.length} matter${boardTasks.length === 1 ? '' : 's'} in flight` :
  `${allOpen} open across ${GEN_COLS.length - 1} stages · ${scoped.filter((t) => t.tone).length} due within 48h`;

  return (
    <div className="rise">
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.4)' }}>
        <HeroPattern opacity={0.7} />
        <div className="page" style={{ position: 'relative', zIndex: 1, paddingTop: 30, paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-.03em', margin: 0, color: 'var(--ink)' }} data-tour="tasks-title">Tasks</h1>
              <p className="sec" style={{ fontSize: 14, margin: '5px 0 0' }}>{subtitle}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 3, background: '#EEF1F6', padding: 3, borderRadius: 9 }} data-tour="tasks-views">
                {[['board', 'columns', 'Board'], ['fleet', 'list', 'List'], ['calendar', 'calendar', 'Calendar']].map(([id, ic, lb]) =>
                <button key={id} onClick={() => setView(id)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 0,
                  background: view === id ? '#fff' : 'transparent', color: view === id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 13, fontWeight: 550,
                  padding: '7px 13px', borderRadius: 7, cursor: 'pointer', boxShadow: view === id ? 'var(--shadow-sm)' : 'none', transition: '.12s' }}>
                    <Icon name={ic} size={15} />{lb}</button>
                )}
              </div>
              <button className="btn btn-primary" data-tour="tasks-new" onClick={openCreate}><Icon name="plus" size={16} sw={2.2} />New Request</button>
            </div>
          </div>

          {/* scope row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0 0', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 3, background: '#EEF1F6', padding: 3, borderRadius: 9 }}>
              {[['mine', 'Only Mine'], ['teams', 'My Teams']].map(([id, lb]) =>
              <button key={id} onClick={() => setScope(id)} style={{ border: 0, background: scope === id ? '#fff' : 'transparent',
                color: scope === id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 12.5, fontWeight: 550, padding: '6px 13px', borderRadius: 7,
                cursor: 'pointer', boxShadow: scope === id ? 'var(--shadow-sm)' : 'none', transition: '.12s' }}>{lb}</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 3, background: '#EEF1F6', padding: 3, borderRadius: 9 }} data-tour="tasks-assignee">
              {[['all', 'All', 'list'], ['people', 'People', 'users'], ['agents', 'Agents', 'cpu']].map(([id, lb, ic]) =>
              <button key={id} onClick={() => setAsg(id)} style={{ display:'flex', alignItems:'center', gap:6, border: 0, background: asg === id ? '#fff' : 'transparent',
                color: asg === id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 12.5, fontWeight: 550, padding: '6px 12px', borderRadius: 7,
                cursor: 'pointer', boxShadow: asg === id ? 'var(--shadow-sm)' : 'none', transition: '.12s' }}><Icon name={ic} size={13}/>{lb}</button>
              )}
            </div>
            <div style={{ flex: 1 }}></div>
            <span className="muted" style={{ fontSize: 12.5 }}>{boardTasks.length} shown</span>
          </div>

          {/* workflow chips */}
          {view !== 'calendar' &&
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 0 18px', flexWrap: 'wrap' }} data-tour="tasks-workflows">
            <button className={'chip' + (wf === 'all' ? ' on' : '')} onClick={() => setWf('all')}>
                All<span style={{ marginLeft: 1, fontWeight: 600, opacity: wf === 'all' ? 0.85 : 0.6, fontFamily: MONO, fontSize: 11 }}>{allOpen}</span>
              </button>
              {WF_ORDER.map((id) => {
              const w = WF[id], on = wf === id, n = wfCount(id);
              return (
                <button key={id} onClick={() => setWf(id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 11px', borderRadius: 999, fontSize: 12, fontWeight: 550,
                  cursor: 'pointer', transition: '.13s', whiteSpace: 'nowrap',
                  border: '1px solid ' + (on ? w.color : 'var(--line-2)'),
                  background: on ? w.tint : '#fff',
                  color: on ? w.color : 'var(--ink-2)' }}
                onMouseEnter={(e) => {if (!on) e.currentTarget.style.background = 'var(--hover)';}}
                onMouseLeave={(e) => {if (!on) e.currentTarget.style.background = '#fff';}}>
                    <Icon name={w.icon} size={13} sw={2} style={{ color: on ? w.color : 'var(--ink-3)' }} />
                    {w.label}
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: on ? w.color : 'var(--ink-3)' }}>{n}</span>
                  </button>);

            })}
            </div>
          }
          {view === 'calendar' && <div style={{ height: 18 }}></div>}
        </div>
      </div>

      <div className="page" style={{ paddingTop: 22 }}>
        {view === 'board' ?
        <Kanban cols={cols} colKey={colKey} tasks={asg==='agents'?[]:boardTasks} moveTask={moveTask} openCreate={openCreate} accentColor={isWf ? WF[wf].color : null}
          agentRuns={asg==='people'?[]:boardRunsFor(wf)} isWf={isWf} glyph={glyph} flat={flat} framing={framing} /> :
        view === 'fleet' ?
        <UnifiedFeed wf={wf} scoped={scoped} asg={asg} openRun={openRun||window.__openRun} glyph={glyph} flat={flat} framing={framing} flash={flash} P={P} WF={WF} /> :
        <CalendarView openTask={openTask} openCreate={openCreate} />}
      </div>
    </div>);

}

function Kanban({ cols, colKey, tasks, moveTask, openCreate, accentColor, agentRuns=[], isWf=false, glyph='diamond', flat=false, framing='codename' }) {
  const [dragId, setDragId] = React.useState(null);
  const [overCol, setOverCol] = React.useState(null);

  // accent for a pipeline column: gray start → workflow color middle → green tail
  const colAccent = (col, i) => {
    if (col.accent) return col.accent;
    if (col.tail) return '#16A34A';
    if (i === 0) return '#64748B';
    return accentColor || '#0073E6';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length},minmax(0,1fr))`, gap: 16, alignItems: 'start' }} data-tour="tasks-board">
      {cols.map((col, ci) => {
        const accent = colAccent(col, ci);
        const list = tasks.filter((t) => t[colKey] === col.id);
        const runs = agentRuns.filter((r) => runCol(r, isWf) === col.id);
        const total = list.length + runs.length;
        return (
          <div key={col.id} className={'kcol' + (overCol === col.id ? ' over' : '')}
          onDragOver={(e) => {e.preventDefault();setOverCol(col.id);}}
          onDragLeave={(e) => {if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null);}}
          onDrop={(e) => {e.preventDefault();if (dragId) moveTask(dragId, col.id);setDragId(null);setOverCol(null);}}
          style={{ background: 'rgba(247,250,253,.7)', border: '1px solid var(--line)', borderRadius: 14, padding: 10, minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: accent }}></span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{col.label}</span>
              {runs.length>0 && <span title={runs.length+' agent'+(runs.length===1?'':'s')} style={{display:'inline-flex'}}><FleetToken size={15}/></span>}
              <div style={{ flex: 1 }}></div>
              <span className="badge" style={{ background: '#E2E8F0', color: 'var(--ink-3)' }}>{total}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 40 }}>
              {runs.map((r) => <AgentRunCard key={r.id} run={r} glyph={glyph} flat={flat} framing={framing} />)}
              {list.map((t) => <WFCard key={t.id} t={t} dragId={dragId} setDragId={setDragId} setOverCol={setOverCol} />)}
              {total === 0 &&
              <div style={{ padding: '22px 10px', textAlign: 'center', border: '1.5px dashed var(--line-2)', borderRadius: 10, color: 'var(--ink-4)', fontSize: 12.5 }}>
                  Drop here
                </div>
              }
            </div>
          </div>);

      })}
    </div>);

}

function WFCard({ t, dragId, setDragId, setOverCol }) {
  const w = WF[t.wf];
  const who = P[t.who];
  const dueColor = t.tone === 'today' || t.tone === 'tomorrow' ? '#DC2626' : 'var(--ink-3)';
  // left edge encodes urgency (attention), not type — keeps the board calm
  const edge = t.done ? 'var(--line)'
    : (t.pri === 'urgent' || t.tone === 'today') ? '#DC2626'
    : (t.pri === 'high' || t.tone === 'tomorrow') ? '#C58A1E'
    : 'var(--line)';
  return (
    <div className={'kcard' + (dragId === t.id ? ' dragging' : '')} draggable
    onDragStart={() => setDragId(t.id)} onDragEnd={() => {setDragId(null);setOverCol(null);}}
    style={{ borderLeft: `3px solid ${edge}`, paddingLeft: 12, opacity: t.done ? 0.92 : 1 }}>
      {/* header: workflow + priority */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 9 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--ink-3)', fontSize: 10, fontWeight: 700, letterSpacing: '.045em', textTransform: 'uppercase' }}>
          <Icon name={w.icon} size={13} sw={2} />{w.label}
        </span>
        {t.pri &&
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: PRI_COLOR[t.pri], fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            {t.pri === 'urgent' && <Icon name="flame" size={11} sw={2.2} />}{t.pri}
          </span>}
      </div>
      {/* title */}
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.32, marginBottom: 5,
        textDecoration: t.done ? 'line-through' : 'none', textDecorationColor: 'var(--ink-4)', color: t.done ? 'var(--ink-3)' : 'var(--ink)' }}>{t.title}</div>
      {/* desc */}
      <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.45, marginBottom: 13 }}>{t.desc}</div>
      {/* agent affordance: live run strip, or "run with agent" */}
      {(() => {
        const run = (typeof runForTask !== 'undefined') && runForTask(t.id);
        const agId = (typeof WF_AGENT !== 'undefined') && WF_AGENT[t.wf];
        const gl = window.__agentTweaks || {};
        if (run) {
          const ag = AGENTS[run.agent], s = RUN_STATUS[run.status];
          return (
            <div onClick={(e) => { e.stopPropagation(); window.__openRun && window.__openRun(run.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', margin: '0 0 11px', borderRadius: 9,
                background: s.tint + 'aa', border: '1px solid ' + s.color + '33', cursor: 'pointer' }}>
              <AgentToken id={run.agent} size={22} glyph={gl.glyph} flat={gl.flat} live={run.status === 'running'} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: ag.color, letterSpacing: '.02em' }}>{ag.code}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: s.color }}>{s.label}</span>
              <div style={{ flex: 1 }}></div>
              <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 600, color: ag.color }}>{run.status === 'running' ? run.progress + '%' : '→'}</span>
            </div>
          );
        }
        if (agId && !t.done) {
          const ag = AGENTS[agId];
          return (
            <button onClick={(e) => { e.stopPropagation(); window.__openKickoff && window.__openKickoff(agId, { label: t.title }); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '6px 9px', margin: '0 0 11px', borderRadius: 9,
                border: '1px dashed var(--line-2)', background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 11, fontWeight: 600, transition: '.13s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = ag.color; e.currentTarget.style.color = ag.color; e.currentTarget.style.background = ag.tint + '66'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.background = 'transparent'; }}>
              <Icon name="sparkle" size={12} />Run with {ag.code}
            </button>
          );
        }
        return null;
      })()}
      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span className="av" style={{ width: 22, height: 22, background: who.color, fontSize: 9 }}>{who.initials}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{who.name}</span>
        </span>
        {t.done ?
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 500, whiteSpace: 'nowrap' }}>{t.doneDate}</span> :
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: dueColor, whiteSpace: 'nowrap', letterSpacing: '-.01em' }}>Due {t.due}</span>}
      </div>
    </div>);

}

function CalendarView({ openTask, openCreate }) {
  const [mode, setMode] = React.useState('month');
  const tagColor = (t) => TAGS[t] && TAGS[t].color || (t === 'leave' ? '#64748B' : t === 'campaign' ? '#0073E6' : '#475569');
  const tagTint = (t) => TAGS[t] && TAGS[t].tint || (t === 'leave' ? '#F1F5F9' : t === 'campaign' ? '#EBF4FF' : '#F1F5F9');
  // June 2026: June 1 is a Monday
  const firstDow = new Date(2026, 5, 1).getDay(); // 1 = Monday
  const daysInMonth = 30;
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>June 2026</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="chevron_left" size={16} /></button>
            <button className="btn btn-ghost btn-icon btn-sm"><Icon name="chevron_right" size={16} /></button>
          </div>
          <button className="btn btn-secondary btn-sm">Today</button>
        </div>
        <div style={{ display: 'flex', gap: 3, background: '#EEF1F6', padding: 3, borderRadius: 8 }}>
          {['month', 'week'].map((m) =>
          <button key={m} onClick={() => setMode(m)} style={{ border: 0, textTransform: 'capitalize', background: mode === m ? '#fff' : 'transparent',
            color: mode === m ? 'var(--ink)' : 'var(--ink-3)', fontSize: 12.5, fontWeight: 550, padding: '5px 13px', borderRadius: 6, cursor: 'pointer',
            boxShadow: mode === m ? 'var(--shadow-sm)' : 'none' }}>{m}</button>
          )}
        </div>
      </div>

      {mode === 'month' ?
      <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--line)' }}>
            {dows.map((d) => <div key={d} style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {cells.map((d, i) => {
            const evs = d ? CAL_EVENTS[d] || [] : [];
            const isToday = d === 5;
            return (
              <div key={i} onClick={() => d && openCreate()} style={{ minHeight: 108, padding: 8, borderRight: i % 7 !== 6 ? '1px solid var(--line)' : '0',
                borderBottom: i < cells.length - 7 ? '1px solid var(--line)' : '0', background: d ? isToday ? 'rgba(45,178,243,.04)' : '#fff' : 'var(--surface-2)',
                cursor: d ? 'pointer' : 'default', transition: '.12s', position: 'relative' }}
              onMouseEnter={(e) => {if (d) e.currentTarget.style.background = isToday ? 'rgba(45,178,243,.08)' : 'var(--surface-2)';}}
              onMouseLeave={(e) => {if (d) e.currentTarget.style.background = isToday ? 'rgba(45,178,243,.04)' : '#fff';}}>
                  {d && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 550, color: isToday ? '#fff' : 'var(--ink-2)',
                    width: isToday ? 22 : 'auto', height: isToday ? 22 : 'auto', borderRadius: '50%', background: isToday ? 'var(--primary)' : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{d}</span>
                  </div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {evs.slice(0, 3).map((e, j) =>
                  <div key={j} onClick={(ev) => {ev.stopPropagation();openCreate();}} title={e.t}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 6px', borderRadius: 5, background: tagTint(e.tag),
                    fontSize: 10.5, fontWeight: 550, color: tagColor(e.tag), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: tagColor(e.tag), flex: 'none' }}></span>{e.t}
                      </div>
                  )}
                    {evs.length > 3 && <span className="muted" style={{ fontSize: 10.5, paddingLeft: 6 }}>+{evs.length - 3} more</span>}
                  </div>
                </div>);

          })}
          </div>
        </div> :
      <WeekView openTask={openTask} openCreate={openCreate} tagColor={tagColor} tagTint={tagTint} />}
    </div>);

}

function WeekView({ openTask, openCreate, tagColor, tagTint }) {
  const days = [['Mon', 1], ['Tue', 2], ['Wed', 3], ['Thu', 4], ['Fri', 5], ['Sat', 6], ['Sun', 7]];
  const hours = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(7,1fr)' }}>
      <div style={{ borderRight: '1px solid var(--line)' }}>
        <div style={{ height: 46, borderBottom: '1px solid var(--line)' }}></div>
        {hours.map((h) => <div key={h} style={{ height: 70, fontSize: 10.5, color: 'var(--ink-3)', padding: '4px 8px', textAlign: 'right', borderBottom: '1px solid var(--line)' }}>{h}</div>)}
      </div>
      {days.map(([dn, dd], ci) => {
        const evs = CAL_EVENTS[dd] || [];
        const isToday = dd === 5;
        return (
          <div key={dd} style={{ borderRight: ci < 6 ? '1px solid var(--line)' : '0' }}>
            <div style={{ height: 46, borderBottom: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isToday ? 'rgba(45,178,243,.05)' : '#fff' }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{dn}</span>
              <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 600, color: isToday ? 'var(--blue)' : 'var(--ink)' }}>{dd}</span>
            </div>
            <div style={{ position: 'relative', background: isToday ? 'rgba(45,178,243,.02)' : '#fff' }} onClick={() => openCreate()}>
              {hours.map((h, hi) => <div key={hi} style={{ height: 70, borderBottom: '1px solid var(--line)' }}></div>)}
              <div style={{ position: 'absolute', inset: 0, padding: '4px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {evs.map((e, j) =>
                <div key={j} onClick={(ev) => {ev.stopPropagation();openCreate();}}
                style={{ padding: '5px 7px', borderRadius: 6, background: tagTint(e.tag), borderLeft: `2.5px solid ${tagColor(e.tag)}`,
                  fontSize: 10.5, fontWeight: 550, color: tagColor(e.tag), cursor: 'pointer', lineHeight: 1.3 }}>{e.t}</div>
                )}
              </div>
            </div>
          </div>);

      })}
    </div>);

}

Object.assign(window, { TasksPage, Kanban, WFCard, CalendarView, WeekView, WF, WF_TASKS });
