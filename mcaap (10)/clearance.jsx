// clearance.jsx — Clearance workspace: screen public statements & route to counsel

const SERIF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const CL_MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const PAPER = '#F4F7FC';
const CL_LINE = 'var(--line)';
const INK_BTN = 'var(--primary)';

// severity palette
const SEV = {
  high: { label: 'High', color: '#D24B43', tint: '#FBEAE8', mark: '#F4D7D3' },
  med: { label: 'Medium', color: '#B5851C', tint: '#F8EFD9', mark: '#F2E2BD' },
  low: { label: 'Low', color: '#0073E6', tint: '#EBF4FF', mark: '#D4E4F8' } };


// people for clearance
const CLP = {
  jordan: { name: 'Jordan Cole', initials: 'JC', color: '#1D3557' },
  mensah: { name: 'R. Mensah', initials: 'RM', color: '#1D3557' } };


// ---- finding factory ----
function fnd(id, ic, cat, sev, rule, quote, why, rev, ref, status = 'open') {
  return { id, ic, cat, sev, rule, quote, why, rev, ref, status };
}

// ---- statement data ----
const CL_STATEMENTS = [
{
  id: 's1',
  title: 'Henderson Legal Team Moves for Summary Judgment in Vantage Whistleblower Suit',
  kind: 'Press Release', location: 'SAN FRANCISCO, Calif.', date: 'July 2, 2024', short: 'Jul 2, 24',
  author: 'jordan', counsel: 'mensah', screened: true, status: 'open', forRelease: true,
  body: [
  { k: 'p', runs: ['The legal team representing Marcus Henderson today filed a motion for summary judgment in his wrongful-termination and whistleblower-retaliation lawsuit against Vantage Logistics, Inc., pending in the U.S. District Court for the Northern District of California.'] },
  { k: 'p', runs: ['Mr. Henderson, Vantage\u2019s former Vice President of Operations, was terminated in April 2024 after repeatedly warning management that a defective conveyor on Line 3 posed a serious risk of injury. ', { f: 'f1' }] },
  { k: 'p', runs: ['Internal records confirm the danger. ', { f: 'f2' }] },
  { k: 'p', runs: [{ f: 'f3' }] },
  { k: 'p', runs: ['\u201CWe are confident ', { f: 'f4' }, ', and ', { f: 'f5' }, ',\u201D said lead counsel.'] },
  { k: 'p', runs: ['Media inquiries: Jordan Cole, Director of Communications, Mensah & Associates.'] }],

  findings: [
  fnd('f1', 'alert', 'Factual Assertion', 'high', 'Rule 8.4 / Defamation',
  'Vantage knowingly endangered its workers and illegally retaliated against Mr. Henderson for doing the right thing.',
  'States contested allegations as established fact. Until adjudicated, asserting unlawful intent invites a false-statement and defamation exposure for the firm.',
  'the suit alleges Vantage endangered workers and unlawfully retaliated against Mr. Henderson for raising safety concerns.',
  'ABA Model Rule 8.4 (Misconduct)'),
  fnd('f2', 'shield', 'Privileged Material', 'high', 'A/C Privilege',
  'An internal legal memorandum prepared by Vantage\u2019s general counsel concluded that the company faced significant liability for terminating Mr. Henderson so soon after his safety complaints.',
  'Describes the substance of an internal legal memo produced under attorney-client privilege. Publicizing privileged analysis risks waiver and a protective-order challenge.',
  'Internal records raised concerns about the timing of Mr. Henderson\u2019s termination relative to his safety complaints.',
  'VANT-PRIV-0042 (privileged memo)'),
  fnd('f3', 'file', 'Confidential Terms', 'high', 'FRE 408 / Confidentiality',
  'The company quietly offered Mr. Henderson a $68,300 severance package contingent on a signed release, which he declined.',
  'Settlement-related figures are likely inadmissible, and publishing the amount may breach confidentiality obligations.',
  'The company offered Mr. Henderson a severance package contingent on a signed release, which he declined.',
  'VANT-0001310 (Severance model)'),
  fnd('f4', 'pen', 'Accuracy', 'low', 'Rule 4.1',
  'the evidence proves Vantage\u2019s conduct was unlawful',
  'Overstates the record; conduct is alleged, not adjudicated. Characterizing untested evidence as proof risks a misleading statement.',
  'the evidence will show that Vantage\u2019s conduct was unlawful',
  'ABA Model Rules 4.1 / 7.1'),
  fnd('f5', 'gavel', 'Trial Publicity', 'med', 'Rule 3.6',
  'we fully expect the Court to rule in Mr. Henderson\u2019s favor',
  'Expresses an opinion as to the outcome of the proceeding, which Rule 3.6 disfavors in extrajudicial statements.',
  'we look forward to presenting Mr. Henderson\u2019s case to the Court',
  'ABA Model Rule 3.6 (Trial Publicity)')],

  history: [
  { ic: 'send', t: 'Submitted by Jordan Cole', s: 'Jul 2, 2024 \u00B7 9:15 AM' },
  { ic: 'sparkle', t: 'AI screen complete \u2014 5 findings', s: 'Jul 2, 2024 \u00B7 9:16 AM' }] },


{
  id: 's2',
  title: 'Marcus Henderson Files Whistleblower Suit Against Vantage Logistics',
  kind: 'Press Release', location: 'SAN FRANCISCO, Calif.', date: 'April 11, 2024', short: 'Apr 11, 24',
  author: 'jordan', counsel: 'mensah', screened: true, status: 'cleared', forRelease: true,
  body: [
  { k: 'p', runs: ['Marcus Henderson, the former Vice President of Operations at Vantage Logistics, Inc., today filed a lawsuit in the U.S. District Court for the Northern District of California alleging wrongful termination and whistleblower retaliation.'] },
  { k: 'p', runs: ['According to the complaint, Mr. Henderson was dismissed in April 2024 after raising repeated concerns about workplace-safety conditions on the company\u2019s distribution lines.'] },
  { k: 'p', runs: ['\u201CMr. Henderson looks forward to presenting his case to the Court,\u201D said lead counsel. The complaint seeks reinstatement, back pay, and other relief the Court deems appropriate.'] },
  { k: 'p', runs: ['Media inquiries: Jordan Cole, Director of Communications, Mensah & Associates.'] }],

  findings: [],
  history: [
  { ic: 'send', t: 'Submitted by Jordan Cole', s: 'Apr 11, 2024 \u00B7 8:40 AM' },
  { ic: 'sparkle', t: 'AI screen complete \u2014 0 findings', s: 'Apr 11, 2024 \u00B7 8:41 AM' },
  { ic: 'check', t: 'Cleared for release by R. Mensah', s: 'Apr 11, 2024 \u00B7 10:02 AM' }] },


{
  id: 's3',
  title: 'Statement Regarding Upcoming Depositions',
  kind: 'Media Statement', location: 'SAN FRANCISCO, Calif.', date: 'June 24, 2024', short: 'Jun 24, 24',
  author: 'jordan', counsel: 'mensah', screened: true, status: 'attorney', forRelease: true,
  body: [
  { k: 'p', runs: ['The parties in Henderson v. Vantage Logistics are scheduled to begin depositions later this month as the case proceeds through discovery.'] },
  { k: 'p', runs: ['\u201CDepositions are a routine part of the litigation process, ', { f: 'g1' }, ',\u201D said a spokesperson for the legal team.'] },
  { k: 'p', runs: ['The team declined to comment further on pending matters.'] },
  { k: 'p', runs: ['Media inquiries: Jordan Cole, Director of Communications, Mensah & Associates.'] }],

  findings: [
  fnd('g1', 'gavel', 'Trial Publicity', 'med', 'Rule 3.6',
  'and we are confident the testimony will vindicate Mr. Henderson\u2019s account',
  'Predicts the substance of witness testimony before it is given \u2014 an opinion on the merits that Rule 3.6 cautions against.',
  'and the testimony will be an important part of the record',
  'ABA Model Rule 3.6 (Trial Publicity)')],

  history: [
  { ic: 'send', t: 'Submitted by Jordan Cole', s: 'Jun 24, 2024 \u00B7 11:20 AM' },
  { ic: 'sparkle', t: 'AI screen complete \u2014 1 finding', s: 'Jun 24, 2024 \u00B7 11:21 AM' },
  { ic: 'gavel', t: 'Routed to R. Mensah for clearance', s: 'Jun 24, 2024 \u00B7 2:05 PM' }] },


{
  id: 's4',
  title: 'Draft \u2014 Comment on Defendant\u2019s Motion to Dismiss Counterclaim',
  kind: 'Talking Points', location: '', date: 'Draft \u2014 not for release', short: 'Jun 28, 24',
  author: 'jordan', counsel: 'mensah', screened: false, status: 'open', forRelease: false,
  body: [
  { k: 'p', runs: ['Talking points re: Vantage\u2019s motion to dismiss the counterclaim. For internal alignment only \u2014 not approved for distribution.'] },
  { k: 'p', runs: ['Defendant\u2019s motion mischaracterizes the counterclaim. ', { f: 'h1' }, '.'] },
  { k: 'p', runs: ['If pressed, emphasize that the matter is in active litigation and decline to characterize the evidence.'] }],

  findings: [
  fnd('h1', 'file', 'Confidential Source', 'med', 'Protective Order',
  'The conveyor-safety record speaks for itself, and Vantage\u2019s own internal incident reports support Mr. Henderson\u2019s position',
  'Cites internal incident reports that may be subject to the discovery protective order. Confirm public availability before referencing in any release.',
  'The conveyor-safety record will be central to the case',
  'PO \u00A7 4 (Confidential designation)', 'pending')],

  history: [
  { ic: 'send', t: 'Drafted by Jordan Cole', s: 'Jun 28, 2024 \u00B7 4:30 PM' }] }];



// ---- stage helpers ----
function openCount(s) {return s.findings.filter((f) => f.status === 'open').length;}
function stageOf(s) {
  if (!s.screened) return 'awaiting';
  if (s.status === 'cleared') return 'cleared';
  if (s.status === 'attorney') return 'attorney';
  return openCount(s) > 0 ? 'flagged' : 'ready';
}
const CL_STEPS = [
{ id: 'submitted', label: 'Submitted', ic: 'send' },
{ id: 'screen', label: 'AI Screen', ic: 'sparkle' },
{ id: 'attorney', label: 'Attorney Review', ic: 'gavel' },
{ id: 'cleared', label: 'Cleared', ic: 'check' }];

const GREEN = '#16A34A', GRAY = '#CBD2DC', BLUE = '#0073E6', RED = '#D24B43';
// returns {done, act, actC, badge, bC, bT}
function stageMeta(stage) {
  switch (stage) {
    case 'awaiting':return { done: 0, act: 0, actC: BLUE, badge: 'Awaiting screen', bC: '#64748B', bT: '#F2F5F9' };
    case 'flagged':return { done: 1, act: 1, actC: RED, badge: 'Issues flagged', bC: RED, bT: '#FBEAE8' };
    case 'ready':return { done: 2, act: -1, actC: GREEN, badge: 'Ready to route', bC: GREEN, bT: '#F0FDF4' };
    case 'attorney':return { done: 2, act: 2, actC: BLUE, badge: 'Attorney review', bC: '#B5851C', bT: '#F8EFD9' };
    case 'cleared':return { done: 3, act: 3, actC: BLUE, badge: 'Cleared for release', bC: GREEN, bT: '#F0FDF4' };
    default:return { done: 0, act: 0, actC: BLUE, badge: '', bC: '#64748B', bT: '#F2F5F9' };}

}
function nodeColor(i, m) {return i < m.done ? GREEN : i === m.act ? m.actC : GRAY;}

function ClAvatar({ id, size = 26 }) {
  const p = CLP[id] || { initials: '?', color: '#64748B' };
  return <span className="av" style={{ width: size, height: size, background: p.color, fontSize: Math.round(size * 0.38) }}>{p.initials}</span>;
}

// =================== Workspace shell ===================
function ClearanceWorkspace({ setPage, flash }) {
  const [stmts, setStmts] = React.useState(CL_STATEMENTS);
  const [openId, setOpenId] = React.useState(null);

  function update(id, fn) {setStmts((arr) => arr.map((s) => s.id === id ? fn(s) : s));}
  function applyF(id, fid) {update(id, (s) => ({ ...s, findings: s.findings.map((f) => f.id === fid ? { ...f, status: 'applied' } : f) }));}
  function dismissF(id, fid) {update(id, (s) => ({ ...s, findings: s.findings.map((f) => f.id === fid ? { ...f, status: 'dismissed' } : f) }));}
  function reopenF(id, fid) {update(id, (s) => ({ ...s, findings: s.findings.map((f) => f.id === fid ? { ...f, status: 'open' } : f) }));}
  function route(id) {update(id, (s) => ({ ...s, status: 'attorney',
      history: [...s.history, { ic: 'gavel', t: 'Routed to R. Mensah for clearance', s: 'Jul 2, 2024 \u00B7 just now' }] }));
    flash && flash('Routed to R. Mensah for clearance');}
  function runScreen(id) {update(id, (s) => ({ ...s, screened: true, status: 'open',
      findings: s.findings.map((f) => ({ ...f, status: 'open' })),
      history: [...s.history, { ic: 'sparkle', t: `AI screen complete \u2014 ${s.findings.length} finding${s.findings.length === 1 ? '' : 's'}`, s: 'just now' }] }));
    flash && flash('AI screen complete');}

  const current = stmts.find((s) => s.id === openId);

  return (
    <div className="rise">
      {current ?
      <ClReview s={current} onBack={() => setOpenId(null)} onApply={applyF} onDismiss={dismissF} onReopen={reopenF} onRoute={route} onRunScreen={runScreen} /> :
      <ClList stmts={stmts} setPage={setPage} onOpen={setOpenId} flash={flash} />}
    </div>);

}

// =================== List view (datatable) ===================
const CL_SCOPES = [{ id: 'me', label: 'Assigned to me' }, { id: 'team', label: 'My team' }, { id: 'all', label: 'All' }];
function clScope(s) {
  const stage = stageOf(s);
  return stage === 'attorney' || stage === 'cleared' ? 'team' : 'me';
}

function ClList({ stmts, setPage, onOpen, flash }) {
  const columns = [
    { label: 'Statement', render: (s) =>
        <QTitle icon="megaphone" color="#16A34A" tint="#F0FDF4" title={s.title} sub={s.kind + (s.location ? ' · ' + s.location : '')} /> },
    { label: 'Stage', width: 168, render: (s) => {
        const m = stageMeta(stageOf(s));
        return <span style={{ fontSize: 12.5, fontWeight: 600, color: m.bC, background: m.bT, padding: '5px 11px', borderRadius: 999, whiteSpace: 'nowrap' }}>{m.badge}</span>; } },
    { label: 'Owner', width: 150, render: (s) => <QPerson av={<ClAvatar id={s.author} size={24} />} name={CLP[s.author].name} /> },
    { label: 'Findings', width: 118, render: (s) => {
        const o = openCount(s), stage = stageOf(s);
        if (!s.screened) return <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>Not screened</span>;
        if (o) return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: RED }}><Icon name="pen" size={13} sw={2} />{o} open</span>;
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: GREEN }}><Icon name="check" size={14} sw={2.4} />Clear</span>; } },
    { label: 'Date', width: 92, align: 'right', render: (s) => <span style={{ fontFamily: CL_MONO, fontSize: 12, color: 'var(--ink-4)' }}>{s.short}</span> },
  ];
  return (
    <React.Fragment>
      <WsHeader name="Clearance" setPage={setPage}
        action={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => window.__openKickoff && window.__openKickoff('vesta', { label: 'Clearance screen' })}>
              <Icon name="sparkle" size={16} style={{ color: '#16A34A' }} />Screen with VESTA
            </button>
            <button className="btn btn-primary" onClick={() => flash && flash('Upload a statement to begin screening')}>
              <Icon name="plus" size={16} sw={2.2} />New statement
            </button>
          </div>} />
      <WorkQueue
        scopes={CL_SCOPES} scopeOf={clScope} rows={stmts} columns={columns} onOpen={onOpen}
        emptyLabel="No statements in this view." />
    </React.Fragment>);

}

function ClStepper() {
  return (
    <div style={{ marginTop: 26, background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 16, padding: 6, boxShadow: '0 1px 2px rgba(29,53,87,.04)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', alignItems: 'stretch' }}>
        {CL_STEPS.map((st, i) =>
        <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px', borderRight: i < 3 ? `1px solid ${CL_LINE}` : '0', position: 'relative' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--hover)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icon name={st.ic} size={18} />
            </span>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-4)', textTransform: 'uppercase' }}>Step {i + 1}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>{st.label}</div>
            </div>
            {i < 3 &&
          <span style={{ position: 'absolute', right: -9, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: '#fff', color: 'var(--ink-4)', display: 'flex' }}>
                <Icon name="chevron_right" size={16} sw={2.4} />
              </span>}
          </div>
        )}
      </div>
    </div>);

}

function ClTrack({ stage, h = 4 }) {
  const m = stageMeta(stage);
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {CL_STEPS.map((st, i) =>
      <React.Fragment key={st.id}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: nodeColor(i, m), flex: 'none',
          boxShadow: i === m.act ? `0 0 0 4px ${m.actC}22` : 'none' }}></span>
          {i < 3 &&
        <span style={{ flex: 1, height: h, borderRadius: 2, background: i < m.done ? GREEN : '#E7E5DC' }}></span>}
        </React.Fragment>
      )}
    </div>);

}

function ClStatementCard({ s, onOpen }) {
  const stage = stageOf(s);
  const m = stageMeta(stage);
  const open = openCount(s);
  const author = CLP[s.author];
  let foot = null;
  const footBase = { display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', flex: 'none' };
  if (stage === 'flagged') foot = <span style={{ ...footBase, color: RED }}><Icon name="pen" size={14} sw={2} />{open} open finding{open === 1 ? '' : 's'}</span>;else
  if (stage === 'attorney') foot = <span style={{ ...footBase, color: '#B5851C' }}><Icon name="pen" size={14} sw={2} />{open} open finding{open === 1 ? '' : 's'}</span>;else
  if (stage === 'ready') foot = <span style={{ ...footBase, color: GREEN }}><Icon name="check" size={14} sw={2.4} />All findings resolved</span>;else
  if (stage === 'cleared') foot = <span style={{ ...footBase, color: GREEN }}><Icon name="check" size={15} sw={2.4} />Cleared</span>;

  return (
    <div onClick={onOpen} style={{ background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 16, padding: '22px 26px', cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(29,53,87,.04)', transition: 'transform .15s, box-shadow .2s' }}
    onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = '0 10px 30px rgba(29,53,87,.10)';}}
    onMouseLeave={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = '0 1px 2px rgba(29,53,87,.04)';}}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>
          <Icon name="megaphone" size={21} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, letterSpacing: '-.01em', margin: 0, color: 'var(--ink)', lineHeight: 1.25 }}>{s.title}</h3>
            <span style={{ flex: 'none', fontSize: 12.5, fontWeight: 600, color: m.bC, background: m.bT, padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{m.badge}</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 6 }}>
            {s.kind}{s.location ? ' \u00B7 ' + s.location + ' \u2014 ' + s.date : ' \u00B7 ' + s.date}
          </div>
          <div style={{ margin: '18px 0 16px' }}><ClTrack stage={stage} /></div>
          <div style={{ borderTop: `1px solid ${CL_LINE}`, paddingTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, flex: 'none' }}>
              <ClAvatar id={s.author} size={26} /><span style={{ fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 500, whiteSpace: 'nowrap' }}>{author.name}</span>
            </span>
            {foot}
            <div style={{ flex: 1 }}></div>
            <span style={{ fontFamily: CL_MONO, fontSize: 12.5, color: 'var(--ink-4)' }}>{s.short}</span>
          </div>
        </div>
      </div>
    </div>);

}

// =================== Review detail ===================
function ClReview({ s, onBack, onApply, onDismiss, onReopen, onRoute, onRunScreen }) {
  const [active, setActive] = React.useState(null);
  const stage = stageOf(s);
  const m = stageMeta(stage);
  const open = openCount(s);
  const routed = s.status === 'attorney' || s.status === 'cleared';

  return (
    <div>
      {/* sub header */}
      <div style={{ position: 'sticky', top: 'var(--header-h)', zIndex: 40, background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${CL_LINE}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${CL_LINE}`, background: '#fff',
            color: 'var(--ink-2)', fontSize: 13, fontWeight: 600, padding: '7px 13px', borderRadius: 9, cursor: 'pointer' }}>
            <Icon name="chevron_left" size={15} sw={2.2} />Press
          </button>
          <span style={{ width: 1, height: 26, background: CL_LINE }}></span>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Icon name="megaphone" size={16} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.kind}{s.location ? ' \u00B7 ' + s.location + ' \u2014 ' + s.date : ' \u00B7 ' + s.date}</div>
          </div>
          <ClStepPills stage={stage} />
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '30px 28px 70px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 392px', gap: 30, alignItems: 'start' }}>
        {/* document */}
        <ClDoc s={s} active={active} setActive={setActive} />

        {/* findings panel */}
        <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 70px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!s.screened ?
          <ClUnscreened s={s} onRunScreen={onRunScreen} /> :
          <React.Fragment>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em' }}>AI screen findings</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: open ? RED : GREEN }}>{open ? open + ' open' : 'All resolved'}</span>
              </div>
              {s.findings.length === 0 &&
            <div style={{ background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 14, padding: '26px 18px', textAlign: 'center' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: '#F0FDF4', color: GREEN, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={20} sw={2.4} /></span>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginTop: 10 }}>No issues found</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>This statement screened clean against the case&rsquo;s privileged &amp; confidential materials.</div>
                </div>}
              {s.findings.map((f) =>
            <ClFinding key={f.id} f={f} active={active === f.id}
            onEnter={() => setActive(f.id)} onLeave={() => setActive(null)}
            onApply={() => onApply(s.id, f.id)} onDismiss={() => onDismiss(s.id, f.id)} onReopen={() => onReopen(s.id, f.id)} />
            )}

              <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5, padding: '4px 2px' }}>
                Resolve or dismiss findings above, then route to counsel for final clearance. Counsel sees any findings you leave open.
              </div>

              {s.status === 'cleared' ?
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#F0FDF4', color: GREEN, fontSize: 14, fontWeight: 600, padding: '14px', borderRadius: 12 }}>
                  <Icon name="check" size={17} sw={2.4} />Cleared for release
                </div> :
            routed ?
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#F8EFD9', color: '#B5851C', fontSize: 14, fontWeight: 600, padding: '14px', borderRadius: 12 }}>
                  <Icon name="gavel" size={16} />With {CLP[s.counsel].name} for clearance
                </div> :

            <button onClick={() => onRoute(s.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, border: 0, background: INK_BTN, color: '#fff', fontSize: 14, fontWeight: 600,
              padding: '15px', borderRadius: 12, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px rgba(29,53,87,.22)' }}>
                  <Icon name="send" size={16} />Route to {CLP[s.counsel].name} for clearance
                </button>}

              <ClHistory s={s} />
            </React.Fragment>}
        </div>
      </div>
    </div>);

}

function ClStepPills({ stage }) {
  const m = stageMeta(stage);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 'none' }}>
      {CL_STEPS.map((st, i) => {
        const isActive = i === m.act;
        const done = i < m.done;
        const c = done ? 'var(--primary)' : isActive ? 'var(--accent)' : GRAY;
        return (
          <React.Fragment key={st.id}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 4px' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: done || isActive ? c : 'transparent',
                border: done || isActive ? 'none' : `1.6px solid ${GRAY}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {done ? <Icon name="check" size={11} sw={3} /> : isActive ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></span> : null}
              </span>
              <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: done || isActive ? 'var(--ink)' : 'var(--ink-4)', whiteSpace: 'nowrap' }}>{st.label}</span>
            </span>
            {i < 3 && <span style={{ width: 16, height: 2, borderRadius: 2, background: i < m.done ? 'var(--primary)' : 'var(--line)', margin: '0 2px' }}></span>}
          </React.Fragment>);

      })}
    </div>);

}

function ClDoc({ s, active, setActive }) {
  const byId = Object.fromEntries(s.findings.map((f) => [f.id, f]));
  return (
    <div style={{ background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 18, padding: '54px 64px 60px', boxShadow: '0 1px 3px rgba(29,53,87,.05)', minHeight: 200 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: '#16A34A', textTransform: 'uppercase', marginBottom: 22 }}>
        {s.forRelease ? 'For Immediate Release' : 'Internal \u2014 Not For Release'}
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, letterSpacing: '-.015em', color: 'var(--ink)', lineHeight: 1.18, margin: 0 }}>{s.title}</h1>
      {s.location ?
      <div style={{ fontFamily: CL_MONO, fontSize: 13, color: 'var(--ink-3)', margin: '20px 0 4px', letterSpacing: '.01em' }}>{s.location} &mdash; {s.date}</div> :
      <div style={{ fontFamily: CL_MONO, fontSize: 13, color: 'var(--ink-3)', margin: '20px 0 4px' }}>{s.date}</div>}
      <div style={{ height: 1, background: CL_LINE, margin: '18px 0 26px' }}></div>

      <div style={{ fontFamily: SERIF, fontSize: 17.5, lineHeight: 1.72, color: '#2A2C30' }}>
        {s.body.map((p, pi) =>
        <p key={pi} style={{ margin: pi ? '0 0 18px' : '0 0 18px', textWrap: 'pretty' }}>
            {p.runs.map((r, ri) => {
            if (typeof r === 'string') return <React.Fragment key={ri}>{r}</React.Fragment>;
            const f = byId[r.f];
            if (!f) return null;
            if (f.status === 'applied') return <React.Fragment key={ri}>{f.rev}</React.Fragment>;
            if (f.status === 'dismissed') return <React.Fragment key={ri}>{f.quote}</React.Fragment>;
            const sv = SEV[f.sev];
            const on = active === f.id;
            return (
              <mark key={ri} onMouseEnter={() => setActive(f.id)} onMouseLeave={() => setActive(null)}
              style={{ background: on ? sv.mark : sv.tint, color: 'inherit', borderRadius: 3, padding: '1px 2px',
                boxShadow: `inset 0 -2px 0 ${sv.color}`, cursor: 'pointer', transition: 'background .12s',
                outline: on ? `2px solid ${sv.color}` : 'none', outlineOffset: 1 }}>{f.quote}</mark>);

          })}
          </p>
        )}
        <div style={{ textAlign: 'center', color: 'var(--ink-4)', letterSpacing: '.3em', marginTop: 30, fontSize: 14 }}>{s.forRelease ? '# # #' : '\u2014 end \u2014'}</div>
      </div>
    </div>);

}

function ClUnscreened({ s, onRunScreen }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 16, padding: '30px 22px', textAlign: 'center' }}>
      <span style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--violet-t)', color: 'var(--violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkle" size={24} /></span>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginTop: 14 }}>Not yet screened</div>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.5 }}>
        Run the AI screen to check this draft against the case&rsquo;s privileged &amp; confidential materials and the applicable conduct rules.
      </div>
      <button onClick={() => onRunScreen(s.id)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 18, border: 0,
        background: INK_BTN, color: '#fff', fontSize: 14, fontWeight: 600, padding: '13px 20px', borderRadius: 11, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px rgba(29,53,87,.22)' }}>
        <Icon name="sparkle" size={16} />Run AI screen
      </button>
      <div style={{ marginTop: 22, textAlign: 'left' }}><ClHistory s={s} /></div>
    </div>);

}

function ClFinding({ f, active, onEnter, onLeave, onApply, onDismiss, onReopen }) {
  const sv = SEV[f.sev];
  if (f.status === 'applied' || f.status === 'dismissed') {
    const applied = f.status === 'applied';
    return (
      <div style={{ background: '#fff', border: `1px solid ${CL_LINE}`, borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 11, opacity: .92 }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: applied ? '#F0FDF4' : 'var(--hover)', color: applied ? GREEN : 'var(--ink-3)' }}>
          <Icon name={applied ? 'check' : 'x'} size={15} sw={2.4} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{f.cat}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{applied ? 'Revision applied' : 'Dismissed \u2014 left for counsel'}</div>
        </div>
        <button onClick={onReopen} style={{ border: 0, background: 'transparent', color: 'var(--ink-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Undo</button>
      </div>);

  }
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave}
    style={{ background: '#fff', border: `1.5px solid ${active ? sv.color : CL_LINE}`, borderRadius: 14, padding: '15px 16px',
      boxShadow: active ? `0 6px 20px ${sv.color}22` : '0 1px 2px rgba(29,53,87,.04)', transition: '.15s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
        <span style={{ width: 24, height: 24, borderRadius: 7, background: sv.tint, color: sv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={f.ic} size={14} /></span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{f.cat}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: sv.color, background: sv.tint, padding: '2px 7px', borderRadius: 5 }}>{sv.label}</span>
        <div style={{ flex: 1 }}></div>
        <span style={{ fontFamily: CL_MONO, fontSize: 11, color: 'var(--ink-2)' }}>{f.rule}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, borderLeft: `3px solid ${sv.color}`, paddingLeft: 12, marginBottom: 11 }}>
        &ldquo;{f.quote}&rdquo;
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12 }}>{f.why}</div>

      <div style={{ background: 'var(--accent-subtle)', border: '1px solid #CBDDF5', borderRadius: 10, padding: '11px 12px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          <Icon name="pen" size={12} sw={2} />Suggested revision
        </div>
        <div style={{ fontSize: 13, color: '#1A3A5C', lineHeight: 1.5 }}>{f.rev}</div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onApply} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: 0, background: 'var(--primary)', color: '#fff',
          fontSize: 13, fontWeight: 600, padding: '10px', borderRadius: 9, cursor: 'pointer' }}>
          <Icon name="check" size={15} sw={2.4} />Apply revision
        </button>
        <button onClick={onDismiss} style={{ border: `1px solid ${CL_LINE}`, background: '#fff', color: 'var(--ink-2)', fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 9, cursor: 'pointer' }}>
          Dismiss
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 11, fontFamily: CL_MONO, fontSize: 11, color: 'var(--ink-4)' }}>
        <Icon name="paperclip" size={12} />{f.ref}
      </div>
    </div>);

}

function ClHistory({ s }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '8px 0 12px' }}>Routing history</div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: 10, bottom: 10, width: 1.5, background: CL_LINE }}></div>
        {s.history.map((h, i) =>
        <div key={i} style={{ display: 'flex', gap: 12, padding: '5px 0', position: 'relative' }}>
            <span style={{ width: 25, height: 25, borderRadius: 7, background: 'var(--hover)', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', zIndex: 1, boxShadow: `0 0 0 3px ${PAPER}` }}>
              <Icon name={h.ic} size={13} />
            </span>
            <div style={{ paddingTop: 3 }}>
              <div style={{ fontSize: 12.5, fontWeight: 550, color: 'var(--ink-2)', lineHeight: 1.35 }}>{h.t}</div>
              <div style={{ fontFamily: CL_MONO, fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>{h.s}</div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { ClearanceWorkspace });
