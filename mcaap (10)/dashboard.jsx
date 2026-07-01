// dashboard.jsx — operational command center

function Dashboard({ setPage, openTask, openCreate }) {
  const [showTeam, setShowTeam] = React.useState(false);
  return (
    <div className="rise">
      <DashHero openCreate={openCreate} setPage={setPage} openTeam={() => setShowTeam(true)} />
      <div className="page" style={{ marginTop: -44, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <RequestsQueue openTask={openTask} />
            <DashFavorites setPage={setPage} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <ActionCenter setPage={setPage} />
            <ActivityFeed />
          </div>
        </div>
        <SnapshotRow setPage={setPage} />
      </div>
      {showTeam && <TeamModal onClose={() => setShowTeam(false)} />}
    </div>);

}

function TeamModal({ onClose }) {
  React.useEffect(() => {const esc = (e) => e.key === 'Escape' && onClose();window.addEventListener('keydown', esc);return () => window.removeEventListener('keydown', esc);}, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 320, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8vh', paddingBottom: '4vh', overflowY: 'auto' }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(36,39,45,.32)', backdropFilter: 'blur(2px)', animation: 'fade .2s' }}></div>
      <div className="pop card" style={{ position: 'relative', width: 'min(600px,94vw)', boxShadow: 'var(--shadow-lg)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '17px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="users" size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em' }}>Team Workload</div>
            <div className="muted" style={{ fontSize: 12 }}>5 of 8 active · 68% capacity · bottlenecks this week</div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {WORKLOAD.map((w) => {
              const p = PEOPLE[w.who];
              const over = w.load >= 90,high = w.load >= 75;
              const c = over ? 'var(--coral)' : high ? 'var(--orange)' : 'var(--lime)';
              return (
                <div key={w.who} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <Avatar id={w.who} size={30} />
                  <div style={{ width: 120, flex: 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{p.role}</div>
                  </div>
                  <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: w.load + '%', height: '100%', background: c, borderRadius: 5, transition: 'width .8s cubic-bezier(.2,.8,.3,1)' }}></div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, width: 40, textAlign: 'right', color: over ? 'var(--coral)' : 'var(--ink-2)' }}>{w.load}%</span>
                  {over && <span className="badge" style={{ background: 'var(--coral-t)', color: 'var(--coral)' }}>Bottleneck</span>}
                </div>);

            })}
          </div>
        </div>
      </div>
    </div>);

}

function DashHero({ openCreate, setPage, openTeam }) {
  const online = ['diego', 'lena', 'noah', 'maya', 'priya'];
  return (
    <div style={{ position: 'relative', paddingTop: 40, paddingBottom: 72, overflow: 'hidden' }}>
      <HeroPattern />
      <div className="page" style={{ position: 'relative', zIndex: 1, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="calendar" size={14} /> Friday, June 5, 2026
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.03em', margin: '8px 0 0', color: 'var(--ink)' }}>
              Welcome back, Tyler!
            </h1>
            <p className="sec" style={{ fontSize: 14.5, margin: '6px 0 0', maxWidth: 520 }}>
              You have <button className="inline-link" onClick={() => window.__openTasks && window.__openTasks({ view: 'board' })}>4 tasks</button> due today and <button className="inline-link" onClick={() => setPage('review')}>2 reviews</button> awaiting your sign-off.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
            <button onClick={() => window.__openAskAI && window.__openAskAI()}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
              border: '1.5px solid transparent', background: 'linear-gradient(180deg,#F7FAFE,#fff) padding-box, linear-gradient(135deg,#0073E6,#7364C2,#E0648F,#B5851C) border-box', boxShadow: 'var(--shadow-sm)', transition: '.15s' }}
            onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-1px)';e.currentTarget.style.boxShadow = 'var(--shadow-md)';}}
            onMouseLeave={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = 'var(--shadow-sm)';}}>
              <FleetToken size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.01em', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 7 }}>Ask Donovan</div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>Chat, delegate & watch your agents</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, background: 'var(--primary)', color: '#fff', flex: 'none' }}><Icon name="message" size={16} /></span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={openCreate}>
            <Icon name="plus" size={16} sw={2.2} />New Request
          </button>
          <button className="btn btn-secondary" onClick={() => window.__openKickoff && window.__openKickoff()}>
            <Icon name="sparkle" size={16} style={{ color: '#0073E6' }} />Delegate to agent
          </button>
        </div>
      </div>
    </div>);

}

function SnapshotRow({ setPage }) {
  return (
    <div className="card card-pad" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="chart" size={17} style={{ color: 'var(--ink-3)' }} />
          <div>
            <div className="card-title" style={{ fontSize: 15.5 }}>Snapshot</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 1 }}>This week at a glance</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage('metrics')}>View metrics report<Icon name="arrow_right" size={14} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
        {KPIS.map((k, i) => {
          const attention = !!k.bad || k.label === 'Overdue';
          const lineC = '#0073E6';
          return (
            <button key={k.label} onClick={() => setPage('metrics')} title="Open detailed metrics"
            style={{ textAlign: 'left', border: 0, borderLeft: i ? '1px solid var(--line)' : '0', background: 'transparent', cursor: 'pointer',
              padding: i ? '4px 18px' : '4px 18px 4px 2px', display: 'flex', flexDirection: 'column', gap: 8, borderRadius: i ? 0 : 6, transition: 'background .12s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 550, color: 'var(--ink-2)' }}>{k.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1, color: 'var(--ink)' }}>{k.value}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: attention ? 'var(--danger)' : 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon name={k.dir === 'up' ? 'arrow_up' : 'arrow_down'} size={11} sw={2.4} />{Math.abs(k.delta)}
                </span>
              </div>
              <Sparkline data={k.spark} color={lineC} w={150} h={24} fill={true} />
            </button>);

        })}
      </div>
    </div>);

}

function DashFavorites({ setPage }) {
  const favs = FOLDERS.filter((f) => f.fav);
  return (
    <div className="card card-pad">
      <SectionHead title="Favorites" icon="star_fill"
        action={<button className="btn btn-ghost btn-sm" onClick={() => setPage('explore')}>Open Explore<Icon name="arrow_right" size={14} /></button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
        {favs.map((f) =>
        <button key={f.id} onClick={() => setPage('explore')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', border: '1px solid var(--line)', borderRadius: 11,
            background: '#fff', cursor: 'pointer', textAlign: 'left', transition: '.15s' }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--line-2)';e.currentTarget.style.background = 'var(--surface-2)';}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--line)';e.currentTarget.style.background = '#fff';}}>
            <span style={{ width: 38, height: 38, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.color + '18', color: f.color }}><Icon name="folder" size={19} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                <Icon name="star_fill" size={13} style={{ color: '#E8B53D', flex: 'none' }} />
              </div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{f.files} files · {f.size}</div>
            </div>
            <Avatar id={f.owner} size={22} />
          </button>
        )}
      </div>
    </div>);

}

function MyWork({ openTask, setPage }) {
  const mine = TASKS.filter((t) => t.assignees.includes('tyler') || ['T-187', 'T-198', 'T-211', 'T-201'].includes(t.id)).slice(0, 5);
  const tabs = ['Assigned', 'Due Soon', 'Needs Attention'];
  const [tab, setTab] = React.useState('Assigned');
  let list = mine;
  if (tab === 'Due Soon') list = [...mine].sort((a, b) => new Date(a.due) - new Date(b.due));
  if (tab === 'Needs Attention') list = mine.filter((t) => t.priority === 'urgent' || t.priority === 'high' || t.col === 'review');
  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="check_square" size={17} style={{ color: 'var(--ink-3)' }} /><span className="card-title" style={{ fontSize: 15.5 }}>My Work</span></div>
        <div style={{ display: 'flex', gap: 4, background: '#F2F5F9', padding: 3, borderRadius: 8 }}>
          {tabs.map((t) =>
          <button key={t} onClick={() => setTab(t)} style={{ border: 0, background: tab === t ? '#fff' : 'transparent', color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
            fontSize: 12.5, fontWeight: 550, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', transition: '.12s' }}>{t}</button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {list.map((t, i) =>
        <div key={t.id} onClick={() => openTask(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 6px',
          borderTop: i ? '1px solid var(--line)' : '0', cursor: 'pointer', borderRadius: 8, transition: '.12s' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS[t.col].color, flex: 'none' }}></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.file}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                {t.tags.slice(0, 2).map((tg) => <Tag key={tg} k={tg} sm />)}
                <span className="muted" style={{ fontSize: 11.5 }}>{t.id}</span>
              </div>
            </div>
            {t.priority && (t.priority === 'urgent' || t.priority === 'high') && <PriorityFlag k={t.priority} />}
            <span style={{ fontSize: 12, fontWeight: 550, color: t.due === 'Jun 4' || t.due === 'Jun 5' ? 'var(--coral)' : 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="clock" size={13} />{t.due}
            </span>
            <AvatarStack ids={t.assignees} size={24} max={2} />
          </div>
        )}
      </div>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: '100%' }} onClick={() => setPage('tasks')}>Open Tasks board<Icon name="arrow_right" size={14} /></button>
    </div>);

}

// Requests Queue status — toned to 3 states (not-started / in-process / done) + a red exception for rejections
const REQ_STATE = {
  'Submitted': { bg: '#F1F5F9', fg: '#475569' }, // gray — not started
  'In Review': { bg: '#FFFBEB', fg: '#92600A' }, // amber — in process
  'Approved': { bg: '#F0FDF4', fg: '#16A34A' }, // green — complete
  'Completed': { bg: '#F0FDF4', fg: '#16A34A' }, // green — complete
  'Rejected': { bg: '#FEF2F2', fg: '#DC2626' }, // red — needs attention
  _default: { bg: '#F1F5F9', fg: '#475569' }
};
function RequestsQueue({ openTask }) {
  return (
    <div className="card card-pad">
      <SectionHead title="Requests Queue" icon="inbox"
      action={<button className="btn btn-ghost btn-sm">View all<Icon name="chevron_right" size={14} /></button>} />
      <div style={{ overflowX: 'auto', margin: '0 -8px' }}>
        <table className="tbl">
          <thead><tr>
            <th>Request</th><th>Type</th><th>Submitted</th><th>Status</th><th>Reviewer</th><th>Due</th>
          </tr></thead>
          <tbody>
            {REQUESTS.slice(0, 6).map((r) => {
              const sm = REQ_STATE[r.status] || REQ_STATE._default;
              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--ink)', fontWeight: 600, maxWidth: 220 }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                    <span className="muted" style={{ fontSize: 11, fontWeight: 400 }}>{r.id}</span>
                  </td>
                  <td><span className="badge" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-2)', fontWeight: 550 }}>{r.type}</span></td>
                  <td>{r.submitted}</td>
                  <td><span className="st" style={{ background: sm.bg, color: sm.fg, padding: '0 10px' }}>{r.status}</span></td>
                  <td><span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 550 }}>{PEOPLE[r.reviewer].name.split(' ')[0]}</span></td>
                  <td style={{ color: r.due === 'Jun 5' || r.due === 'Jun 6' ? 'var(--danger)' : 'var(--ink-2)', fontWeight: 550 }}>{r.due}</td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}

function Workload() {
  return (
    <div className="card card-pad">
      <SectionHead title="Team Workload" sub="Current utilization & bottlenecks this week" icon="users" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {WORKLOAD.map((w) => {
          const p = PEOPLE[w.who];
          const over = w.load >= 90,high = w.load >= 75;
          const c = over ? 'var(--coral)' : high ? 'var(--orange)' : 'var(--lime)';
          return (
            <div key={w.who} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar id={w.who} size={28} />
              <div style={{ width: 96, flex: 'none' }}>
                <div style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name.split(' ')[0]} {p.name.split(' ')[1][0]}.</div>
                <div className="muted" style={{ fontSize: 10.5 }}>{p.role}</div>
              </div>
              <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: w.load + '%', height: '100%', background: c, borderRadius: 5, transition: 'width .8s cubic-bezier(.2,.8,.3,1)' }}></div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, width: 38, textAlign: 'right', color: over ? 'var(--coral)' : 'var(--ink-2)' }}>{w.load}%</span>
              {over && <span className="badge" style={{ background: 'var(--coral-t)', color: 'var(--coral)' }}>Bottleneck</span>}
            </div>);

        })}
      </div>
    </div>);

}

function ActionCenter({ setPage }) {
  const agNeed = typeof needsYou !== 'undefined' ? needsYou().length : 0;
  const items = [
  { label: 'Agents need you', count: agNeed, icon: 'cpu', color: '#0073E6', tint: '#EBF4FF', sub: 'Agents paused for your sign-off', tasks: { view: 'board', asg: 'agents' }, agent: true },
  { label: 'Triage', count: 9, icon: 'inbox', color: '#0073E6', tint: '#EBF4FF', sub: 'New items awaiting sorting', tasks: { view: 'board', wf: 'relevance' } },
  { label: 'Clearance', count: 2, icon: 'megaphone', color: '#16A34A', tint: '#F0FDF4', sub: 'Statements pending your screen', tasks: { view: 'board', wf: 'press' } },
  { label: 'Memos', count: 4, icon: 'route', color: '#475569', tint: '#F1F5F9', sub: 'Awaiting your concurrence', go: 'memos' },
  { label: 'Prep', count: 3, icon: 'pen', color: '#B5851C', tint: '#FFFBEB', sub: 'Drafts in progress', go: 'prep' }];

  function goItem(it) {if (it.tasks && window.__openTasks) window.__openTasks(it.tasks);else setPage(it.go);}
  const agent = items.find((i) => i.agent);
  const rest = items.filter((i) => !i.agent);
  return (
    <div className="card card-pad">
      <SectionHead title="Action Center" icon="flame" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {agent &&
        <button onClick={() => goItem(agent)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
          border: '1px solid #CBDDF5', borderRadius: 10, background: 'linear-gradient(180deg,#F7FAFE,#fff)', cursor: 'pointer', textAlign: 'left', transition: '.15s' }}
        onMouseEnter={(e) => {e.currentTarget.style.borderColor = agent.color;e.currentTarget.style.background = agent.tint + '55';}}
        onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#CBDDF5';e.currentTarget.style.background = 'linear-gradient(180deg,#F7FAFE,#fff)';}}>
            <span style={{ flex: 'none' }}><FleetToken size={36} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{agent.label}</div>
            </div>
            <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em' }}>{agent.count}</span>
            <Icon name="chevron_right" size={16} style={{ color: 'var(--ink-4)' }} />
          </button>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {rest.map((it) =>
          <button key={it.label} onClick={() => goItem(it)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 11, padding: '13px 14px',
            border: '1px solid var(--line)', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: '.15s' }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'var(--line-2)';e.currentTarget.style.background = 'var(--surface-2)';}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'var(--line)';e.currentTarget.style.background = '#fff';}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface-2)', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={it.icon} size={18} /></span>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1 }}>{it.count}</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{it.label}</div>
            </button>
          )}
        </div>
      </div>
    </div>);

}

function ActivityFeed() {
  return (
    <div className="card card-pad">
      <SectionHead title="Team Activity" icon="history" />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: 6, bottom: 6, width: 2, background: 'var(--line)' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ACTIVITY.map((a, i) => {
            const k = ACT_KIND[a.kind];
            return (
              <div key={i} style={{ display: 'flex', gap: 13, padding: '8px 0', position: 'relative' }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--hover)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', zIndex: 1, boxShadow: '0 0 0 3px #fff' }}><Icon name={k.icon} size={15} /></span>
                <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-2)', paddingTop: 2 }}>
                  <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{PEOPLE[a.who].name.split(' ')[0]}</b> {a.verb} <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{a.what}</span>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{a.t} ago</div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

}

function RecentWorkspaces({ setPage }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {WORKSPACES.map((w) =>
      <div key={w.id} className="card card-hover card-pad" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14 }} onClick={() => setPage(w.id)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: w.tint, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={w.icon} size={20} /></span>
            <Icon name="arrow_right" size={17} style={{ color: 'var(--ink-4)' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{w.name}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{w.desc}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, paddingTop: 2, borderTop: '1px solid var(--line)', marginTop: 2, paddingTop: 11 }}>
            <div><span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{w.active}</span><span className="muted" style={{ fontSize: 11, marginLeft: 5 }}>active</span></div>
            <div><span style={{ fontSize: 17, fontWeight: 700, color: w.color }}>{w.today}</span><span className="muted" style={{ fontSize: 11, marginLeft: 5 }}>today</span></div>
          </div>
        </div>
      )}
    </div>);

}

Object.assign(window, { Dashboard });