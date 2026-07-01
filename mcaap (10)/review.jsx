// review.jsx — Evidence Review & Coding workspace (opened from Explore › View Files)

// ---- file-type presentation ----
const RV_TYPE = {
  mail:  { icon: 'mail',  color: '#475569' },
  zip:   { icon: 'files', color: '#475569' },
  sheet: { icon: 'grid',  color: '#16A34A' },
  audio: { icon: 'audio', color: '#475569' },
  image: { icon: 'image', color: '#0EA5E9' },
  video: { icon: 'video', color: '#B5851C' },
  pdf:   { icon: 'file',  color: '#DC2626' },
  doc:   { icon: 'file',  color: '#0073E6' },
  txt:   { icon: 'file',  color: '#64748B' },
};

// custodian initials/colors
const RV_PPL = {
  Henderson: { initials: 'MH', color: '#1D3557' },
  Brenner:   { initials: 'KB', color: '#1D3557' },
  Tran:      { initials: 'DT', color: '#1D3557' },
  Anand:     { initials: 'RA', color: '#1D3557' },
  Vasquez:   { initials: 'LV', color: '#1D3557' },
  Caldwell:  { initials: 'JC', color: '#1D3557' },
};

// ---- the four issues this matter is coded against ----
const RV_ISSUES = [
  { id: 'safety',   n: 1, label: 'Safety Complaints',        sub: 'Knowledge of the Line 3 conveyor defect & internal reports' },
  { id: 'retal',    n: 2, label: 'Retaliation / Termination', sub: "Decision-making around Henderson's separation" },
  { id: 'trade',    n: 3, label: 'Trade Secret / NDA',        sub: 'Project Atlas materials & the confidentiality counterclaim' },
  { id: 'damages',  n: 4, label: 'Damages / Comp',            sub: 'Compensation, severance, and economic loss' },
];

// ---- review queue ----
function rdoc(id, type, title, who, date, o = {}) {
  return { id, type, title, who, date, bates: o.bates, size: o.size, source: o.source,
    tags: o.tags || [], hot: !!o.hot, priv: !!o.priv, reviewed: o.reviewed || null, body: o.body, archive: o.archive,
    summary: o.summary, summaryPts: o.summaryPts };
}

// AI summary fallback for docs without an authored one
const RV_TYPE_NOUN = { mail: 'email', pdf: 'PDF document', doc: 'document', sheet: 'spreadsheet', image: 'image', audio: 'audio recording', video: 'video', zip: 'archive', txt: 'text file' };
function rvSummary(d) {
  if (d.summary) return d.summary;
  const noun = RV_TYPE_NOUN[d.type] || 'file';
  const tagPart = d.tags.length ? ` It is tagged ${d.tags.join(', ')}.` : '';
  return `${d.size} ${noun} from ${d.source || 'the collection'}, custodian ${d.who}, dated ${d.date}.${tagPart} No issues auto-detected — review the contents to code for relevance and privilege.`;
}

const RV_DOCS = [
  rdoc('d1', 'zip', 'Henderson_personal_export.zip', 'Henderson', 'Apr 2, 24',
    { bates: 'VANT-0001501', size: '18 MB', source: 'Henderson Personal', tags: ['Project Atlas', 'confidential'], hot: true,
      summary: 'Self-collected export from Henderson\u2019s personal drive containing six files exfiltrated near his resignation date. Bundles Project Atlas routing specs and a confidential west-region client list alongside a resignation draft \u2014 a likely trade-secret / misappropriation exhibit.',
      summaryPts: ['Project Atlas specs + client list present', 'Pulled 4 days before resignation', 'Mixed media: docs, image, voicemail'],
      archive: [
        { name: 'Project_Atlas_specs_v3.pdf', type: 'pdf',   size: '2.2 MB', tags: ['Project Atlas', 'confidential'], hot: true },
        { name: 'routing_algorithm_notes.docx', type: 'doc', size: '96 KB',  tags: ['Project Atlas'] },
        { name: 'client_list_west.xlsx',     type: 'sheet', size: '142 KB', tags: ['confidential'] },
        { name: 'resignation_draft.txt',     type: 'txt',   size: '4 KB',   tags: [] },
        { name: 'IMG_4471.jpg',              type: 'image', size: '3.0 MB', tags: [] },
        { name: 'voicemail_from_recruiter.m4a', type: 'audio', size: '980 KB', tags: [] },
      ] }),
  rdoc('d2', 'mail', 'FW: Atlas specs (to personal)', 'Henderson', 'Mar 29, 24',
    { bates: 'VANT-0001488', size: '88 KB', source: 'Exchange', tags: ['Project Atlas'], hot: true,
      summary: 'Henderson forwards Project Atlas routing specs v3 from his work account to a personal Gmail, explicitly asking not to reply on the thread \u2014 strong evidence of intent to retain proprietary materials before departure.',
      summaryPts: ['Work \u2192 personal Gmail transfer', '\u201CBefore things get complicated\u201D', 'Atlas specs v3 attached'],
      body: ['From: m.henderson@vantage.com', 'To: marcus.h.personal@gmail.com', 'Subject: FW: Atlas specs',
        'Forwarding these so I have a copy at home before things get complicated. Don\u2019t reply to this thread.',
        'Begin forwarded message — Project Atlas routing specs v3 attached.'] }),
  rdoc('d3', 'sheet', 'Q1 Incident Log \u2014 Warehouse', 'Brenner', 'Mar 29, 24',
    { bates: 'VANT-0001460', size: '212 KB', source: 'SharePoint', tags: ['Safety'], reviewed: 'relevant' }),
  rdoc('d4', 'mail', 'Lunch & learn', 'Henderson', 'Mar 28, 24',
    { bates: 'VANT-0001455', size: '24 KB', source: 'Exchange', tags: [] }),
  rdoc('d5', 'sheet', 'PO log Q1', 'Henderson', 'Mar 26, 24',
    { bates: 'VANT-0001440', size: '180 KB', source: 'SharePoint', tags: [] }),
  rdoc('d6', 'sheet', 'Henderson_severance_calc.xlsx', 'Tran', 'Mar 21, 24',
    { bates: 'VANT-0001399', size: '64 KB', source: 'HR Drive', tags: ['confidential'] }),
  rdoc('d7', 'audio', 'Voicemail \u2014 Henderson to Anand', 'Anand', 'Mar 20, 24',
    { bates: 'VANT-0001388', size: '1.4 MB', source: 'Voicemail', tags: [] }),
  rdoc('d8', 'mail', 'RE: performance file \u2014 Henderson', 'Anand', 'Mar 19, 24',
    { bates: 'VANT-0001377', size: '40 KB', source: 'Exchange', tags: ['HR'],
      summary: 'HR thread discussing Henderson\u2019s performance file. Relevant to the company\u2019s stated, non-retaliatory rationale for termination; check timing against his safety complaints before coding.',
      summaryPts: ['HR documents performance concerns', 'Bears on retaliation timeline', 'Potential pretext evidence'] }),
  rdoc('d9', 'mail', 'PRIVILEGED & CONFIDENTIAL \u2014 strategy', 'Vasquez', 'Mar 19, 24',
    { bates: 'VANT-0001372', size: '52 KB', source: 'Exchange', tags: ['Privileged'], priv: true,
      summary: 'Counsel strategy memo marked attorney-client privileged. Auto-flagged for the privilege log \u2014 do not produce. Confirm the privilege call and add to the log rather than the production set.',
      summaryPts: ['Attorney-client privileged', 'Withhold from production', 'Add to privilege log'] }),
  rdoc('d10', 'audio', 'Recorded line \u2014 Tran & Caldwell', 'Tran', 'Mar 18, 24',
    { bates: 'VANT-0001360', size: '6.1 MB', source: 'Call recording', tags: [], hot: true }),
  rdoc('d11', 'mail', 'RE: Henderson situation \u2014 next steps', 'Caldwell', 'Mar 18, 24',
    { bates: 'VANT-0001351', size: '36 KB', source: 'Exchange', tags: ['Retaliation'], hot: true, reviewed: 'relevant' }),
  rdoc('d12', 'mail', 'Conveyor safety \u2014 URGENT', 'Henderson', 'Mar 18, 24',
    { bates: 'VANT-0001349', size: '30 KB', source: 'Exchange', tags: ['Safety'] }),
  rdoc('d13', 'mail', 'Line 1 throughput numbers', 'Tran', 'Mar 16, 24',
    { bates: 'VANT-0001330', size: '28 KB', source: 'Exchange', tags: [] }),
  rdoc('d14', 'zip', 'scanned_docs.zip', 'Brenner', 'Mar 15, 24',
    { bates: 'VANT-0001318', size: '44 MB', source: 'Scanner', tags: [],
      archive: [
        { name: 'maintenance_ticket_0312.pdf', type: 'pdf', size: '1.1 MB', tags: ['Safety'] },
        { name: 'inspection_signoff.pdf', type: 'pdf', size: '820 KB', tags: [] },
        { name: 'parts_invoice.pdf', type: 'pdf', size: '410 KB', tags: [] },
      ] }),
  rdoc('d15', 'sheet', 'Overtime tracker', 'Brenner', 'Mar 15, 24',
    { bates: 'VANT-0001315', size: '96 KB', source: 'SharePoint', tags: [] }),
  rdoc('d16', 'audio', 'town_hall_audio.mp3', 'Caldwell', 'Mar 15, 24',
    { bates: 'VANT-0001310', size: '38 MB', source: 'Recording', tags: [] }),
  rdoc('d17', 'pdf', 'Internal Safety Audit \u2014 Line 3', 'Henderson', 'Mar 15, 24',
    { bates: 'VANT-0001305', size: '2.8 MB', source: 'SharePoint', tags: ['Safety'], hot: true, reviewed: 'relevant',
      summary: 'Internal audit flagging actuator wear on the Line 3 conveyor as a serious safety risk. Corroborates Henderson\u2019s protected complaints and is central to the retaliation claim \u2014 already coded relevant.',
      summaryPts: ['Documents the Line 3 hazard', 'Supports protected-activity element', 'Authored by Henderson'] }),
  rdoc('d18', 'image', 'line3_actuator_closeup.png', 'Brenner', 'Mar 13, 24',
    { bates: 'VANT-0001290', size: '4.2 MB', source: 'Field photo', tags: ['Safety'] }),
  rdoc('d19', 'mail', 'Re: 1:1 notes', 'Vasquez', 'Mar 12, 24',
    { bates: 'VANT-0001282', size: '22 KB', source: 'Exchange', tags: [] }),
  rdoc('d20', 'zip', 'attachments_bundle.zip', 'Henderson', 'Mar 12, 24',
    { bates: 'VANT-0001270', size: '12 MB', source: 'Exchange', tags: [],
      archive: [
        { name: 'org_chart.pdf', type: 'pdf', size: '300 KB', tags: [] },
        { name: 'shift_schedule.xlsx', type: 'sheet', size: '88 KB', tags: [] },
      ] }),
  rdoc('d21', 'video', 'Line3_CCTV_0312_0900.mp4', 'Brenner', 'Mar 12, 24',
    { bates: 'VANT-0001265', size: '210 MB', source: 'CCTV', tags: ['Safety'] }),
  rdoc('d22', 'video', 'safety_training.mp4', 'Caldwell', 'Mar 10, 24',
    { bates: 'VANT-0001240', size: '180 MB', source: 'Training', tags: [] }),
];

const RV_TABS = [
  { id: 'coding', label: 'Coding', icon: 'check' },
  { id: 'meta', label: 'Meta', icon: 'list' },
  { id: 'entities', label: 'Entities', icon: 'user', count: 1 },
  { id: 'comments', label: 'Comments', icon: 'comment' },
  { id: 'history', label: 'History', icon: 'history' },
];

// ---- review-team assignment (me = Tyler; team = Aria/Sam/Priya) ----
const RV_ASG = {
  d1: 'tyler', d2: 'tyler', d3: 'aria', d4: 'priya', d5: 'priya', d6: 'sam', d7: 'priya', d8: 'sam',
  d9: 'aria', d10: 'tyler', d11: 'tyler', d12: 'aria', d13: 'priya', d14: 'priya', d15: 'priya',
  d16: 'sam', d17: 'tyler', d18: 'aria', d19: 'priya', d20: 'priya', d21: 'aria', d22: 'sam',
};
const RV_SCOPES = [{ id: 'me', label: 'Assigned to me' }, { id: 'team', label: 'My team' }, { id: 'all', label: 'All' }];
function rvScope(d) { return RV_ASG[d.id] === 'tyler' ? 'me' : 'team'; }

// ---- tag pill ----
function RvTag({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 19, padding: '0 8px', borderRadius: 5,
      background: '#F4ECD7', color: '#94712B', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{children}</span>);
}

function RvAvatar({ who, size = 26 }) {
  const p = RV_PPL[who] || { initials: '?', color: '#1D3557' };
  return <span className="av" style={{ width: size, height: size, background: p.color, fontSize: Math.round(size * 0.4) }}>{p.initials}</span>;
}

// ===================== entry: datatable of assigned docs =====================
function ReviewQueue({ setPage, flash, folderName }) {
  const [startId, setStartId] = React.useState(null);
  if (startId) return <RvWorkbench setPage={setPage} flash={flash} folderName={folderName} startId={startId} onBack={() => setStartId(null)} />;
  return <RvList setPage={setPage} flash={flash} folderName={folderName} onOpen={setStartId} />;
}

function RvList({ setPage, flash, folderName, onOpen }) {
  const firstId = RV_DOCS[0].id;
  const columns = [
    { label: 'Document', render: (d) => {
        const t = RV_TYPE[d.type];
        return <QTitle icon={t.icon} color={t.color} title={d.title} sub={d.archive ? d.archive.length + ' items · ' + d.size : d.source + ' · ' + d.size} />; } },
    { label: 'Custodian', width: 132, render: (d) => <QPerson av={<RvAvatar who={d.who} size={24} />} name={d.who} /> },
    { label: 'Reviewer', width: 128, render: (d) => {
        const a = RV_ASG[d.id];
        return <QPerson av={<Avatar id={a} size={24} ring={false} />} name={PEOPLE[a].name.split(' ')[0] + (a === 'tyler' ? ' (you)' : '')} />; } },
    { label: 'Flags', width: 92, render: (d) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          {d.priv && <span title="Privileged" style={{ display: 'inline-flex', color: '#B5851C' }}><Icon name="shield" size={14} /></span>}
          {d.hot && <span title="Hot / key document" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#DC2626', fontSize: 11.5, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: 2, background: '#DC2626' }}></span>Hot</span>}
          {!d.priv && !d.hot && <span style={{ color: 'var(--ink-4)' }}>&mdash;</span>}
        </span>) },
    { label: 'Coding', width: 120, render: (d) => d.reviewed
        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--lime)' }}><Icon name="check" size={14} sw={2.4} />Relevant</span>
        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-3)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--line-2)' }}></span>Pending</span> },
    { label: 'Date', width: 80, align: 'right', render: (d) => <span style={{ fontSize: 12, color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>{d.date}</span> },
  ];
  return (
    <div className="rise">
      <WsHeader name="Triage" setPage={setPage}
        action={
          <button className="btn btn-primary" onClick={() => onOpen(firstId)}>
            <Icon name="eye" size={16} />Start review
          </button>} />
      <WorkQueue
        scopes={RV_SCOPES} scopeOf={rvScope} rows={RV_DOCS} columns={columns} onOpen={onOpen}
        emptyLabel="No documents in this view." />
    </div>);
}

// ===================== single-doc workbench =====================
function RvWorkbench({ setPage, flash, folderName, startId, onBack }) {
  const [selId, setSelId] = React.useState(startId || RV_DOCS[0].id);
  const [tab, setTab] = React.useState('coding');
  const [coding, setCoding] = React.useState({});
  const listRef = React.useRef(null);

  const sel = RV_DOCS.find((d) => d.id === selId);
  const code = coding[selId] || {};
  const decision = code.decision || (sel.reviewed) || null;
  const reviewedCount = RV_DOCS.filter((d) => coding[d.id]?.decision || d.reviewed).length;

  function setCode(patch) { setCoding((c) => ({ ...c, [selId]: { ...c[selId], ...patch } })); }
  function toggleIssue(id) {
    const cur = code.issues || [];
    setCode({ issues: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  }
  function nextUnreviewed() {
    const i = RV_DOCS.findIndex((d) => d.id === selId);
    for (let k = 1; k <= RV_DOCS.length; k++) {
      const d = RV_DOCS[(i + k) % RV_DOCS.length];
      if (!(coding[d.id]?.decision || d.reviewed)) { setSelId(d.id); return; }
    }
    flash && flash('Queue fully reviewed \u2014 nice work');
  }
  function save() {
    if (!decision) { flash && flash('Pick Relevant or Not relevant first'); return; }
    flash && flash('Coding saved \u00B7 ' + sel.bates);
    nextUnreviewed();
  }

  // keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'r') setCode({ decision: 'relevant' });
      else if (k === 'n') setCode({ decision: 'notrel' });
      else if (k === 'p') setCode({ priv: !code.priv });
      else if (k === 'h') setCode({ hot: !code.hot });
      else if (['1', '2', '3', '4'].includes(k)) toggleIssue(RV_ISSUES[+k - 1].id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="rise" style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden', background: '#fff' }}>
      {/* ============ LEFT: queue ============ */}
      <aside style={{ width: 296, flex: 'none', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
        <div style={{ padding: '13px 16px 11px', borderBottom: '1px solid var(--line)' }}>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 0, background: 'transparent',
            color: 'var(--ink-3)', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 9 }}>
            <Icon name="chevron_left" size={13} sw={2.2} />Triage queue
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Review Queue</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)' }}>{reviewedCount}/{RV_DOCS.length}</span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'var(--line)', marginTop: 9, overflow: 'hidden' }}>
            <div style={{ width: (reviewedCount / RV_DOCS.length * 100) + '%', height: '100%', background: 'var(--lime)', borderRadius: 2, transition: 'width .25s' }}></div>
          </div>
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto' }}>
          {RV_DOCS.map((d) => {
            const t = RV_TYPE[d.type];
            const isSel = d.id === selId;
            const done = coding[d.id]?.decision || d.reviewed;
            return (
              <button key={d.id} onClick={() => { setSelId(d.id); setTab('coding'); }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 11, width: '100%', textAlign: 'left', border: 0,
                  borderBottom: '1px solid var(--line)', borderLeft: isSel ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  background: isSel ? 'var(--primary-tint)' : 'transparent', padding: '11px 14px 11px 12px', cursor: 'pointer', transition: 'background .12s' }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = 'var(--hover)'; }}
                onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, flex: 'none', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: t.color + '18', color: t.color }}><Icon name={t.icon} size={15} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: isSel ? 600 : 550, color: isSel ? 'var(--primary)' : 'var(--ink)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</span>
                    {d.priv && <Icon name="shield" size={12} style={{ color: '#B5851C', flex: 'none' }} />}
                    {d.hot && <span style={{ width: 7, height: 7, borderRadius: 2, background: '#DC2626', flex: 'none' }}></span>}
                  </span>
                  <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.who} &middot; {d.date}
                  </span>
                </span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flex: 'none', marginTop: 5,
                  background: done ? (done === 'notrel' ? 'var(--ink-4)' : 'var(--lime)') : 'transparent',
                  border: done ? 'none' : '1.5px solid var(--line-2)' }}></span>
              </button>);
          })}
        </div>
      </aside>

      {/* ============ CENTER: document ============ */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#F7F8FB' }}>
        {/* doc header */}
        <div style={{ borderBottom: '1px solid var(--line)', background: '#fff', padding: '14px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: RV_TYPE[sel.type].color + '18', color: RV_TYPE[sel.type].color }}><Icon name={RV_TYPE[sel.type].icon} size={17} /></span>
            <h1 style={{ fontSize: 17, fontWeight: 650, letterSpacing: '-.01em', margin: 0, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.title}</h1>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-ghost btn-icon btn-sm" title="Download"><Icon name="download" size={16} /></button>
            <button className="btn btn-ghost btn-icon btn-sm" title="Open externally"><Icon name="external" size={15} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-3)' }}>
            <RvAvatar who={sel.who} size={22} />
            <span style={{ color: 'var(--ink-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>{sel.who}</span>
            <Dotsep /><span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, whiteSpace: 'nowrap' }}>{sel.bates}</span>
            <Dotsep /><span style={{ whiteSpace: 'nowrap' }}>{sel.date}</span>
            <Dotsep /><span style={{ whiteSpace: 'nowrap' }}>{sel.size}</span>
            {sel.source && <React.Fragment><Dotsep /><span style={{ whiteSpace: 'nowrap' }}>{sel.source}</span></React.Fragment>}
            {sel.tags.length > 0 && <span style={{ display: 'inline-flex', gap: 6, marginLeft: 4 }}>{sel.tags.map((tg) => <RvTag key={tg}>{tg}</RvTag>)}</span>}
          </div>
        </div>

        {/* doc body (scrolls) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '34px 26px 60px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <RvSummaryCard sel={sel} />
            {sel.archive ? <RvArchive sel={sel} flash={flash} /> : sel.body ? <RvMail sel={sel} /> : <RvPlaceholder sel={sel} />}
          </div>
        </div>
      </main>

      {/* ============ RIGHT: coding ============ */}
      <aside style={{ width: 392, flex: 'none', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 12px', borderBottom: '1px solid var(--line)', flex: 'none' }}>
          {RV_TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent',
              padding: '13px 9px', cursor: 'pointer', fontSize: 12.5, fontWeight: tab === tb.id ? 600 : 500, position: 'relative',
              color: tab === tb.id ? 'var(--primary)' : 'var(--ink-3)' }}>
              <Icon name={tb.icon} size={14} />{tb.label}
              {tb.count != null && <span style={{ fontSize: 10, fontWeight: 700, minWidth: 15, height: 15, padding: '0 4px', borderRadius: 7,
                background: tab === tb.id ? 'var(--primary)' : 'var(--line)', color: tab === tb.id ? '#fff' : 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{tb.count}</span>}
              {tab === tb.id && <span style={{ position: 'absolute', left: 6, right: 6, bottom: -1, height: 2.5, background: 'var(--primary)', borderRadius: 2 }}></span>}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px' }}>
          {tab === 'coding' ? <RvCoding sel={sel} code={code} decision={decision} setCode={setCode} toggleIssue={toggleIssue} />
            : <RvStub tab={tab} sel={sel} />}
        </div>

        {/* footer */}
        <div style={{ borderTop: '1px solid var(--line)', padding: '12px 18px', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: decision ? (decision === 'notrel' ? 'var(--ink-3)' : 'var(--lime)') : 'var(--ink-3)', marginBottom: 11 }}>
            <Icon name={decision ? 'check' : 'clock'} size={14} sw={decision ? 2.4 : 1.75} />
            {decision === 'relevant' ? 'Marked relevant' : decision === 'notrel' ? 'Marked not relevant' : 'Awaiting review'}
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button onClick={save} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 0,
              background: 'var(--primary)', color: '#fff', fontSize: 13.5, fontWeight: 600, padding: '11px', borderRadius: 9, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(29,53,87,.22)' }}><Icon name="download" size={15} />Save coding</button>
            <button onClick={nextUnreviewed} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1px solid var(--line-2)',
              background: '#fff', color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 600, padding: '11px 15px', borderRadius: 9, cursor: 'pointer' }}>
              Next unreviewed<Icon name="arrow_right" size={15} /></button>
          </div>
        </div>
      </aside>
    </div>);
}

function Dotsep() { return <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-4)', flex: 'none' }}></span>; }

// ---- center: archive contents ----
function RvArchive({ sel, flash }) {
  return (
    <div className="card" style={{ borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '20px 22px', borderBottom: '1px solid var(--line)' }}>
        <span style={{ width: 42, height: 42, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#F1F5F9', color: '#475569' }}><Icon name="files" size={21} /></span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 650, color: 'var(--ink)' }}>{sel.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{sel.archive.length} items &middot; {sel.size} compressed</div>
        </div>
      </div>
      <div style={{ padding: '7px 10px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px 6px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
          <Icon name="folder" size={13} />Archive contents
        </div>
        {sel.archive.map((f, i) => {
          const t = RV_TYPE[f.type];
          return (
            <button key={i} onClick={() => flash && flash('Opening ' + f.name)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', border: 0, background: 'transparent',
                padding: '12px', borderRadius: 9, cursor: 'pointer', transition: 'background .12s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: t.color + '18', color: t.color }}><Icon name={t.icon} size={16} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 550, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                  {f.hot && <span style={{ width: 7, height: 7, borderRadius: 2, background: '#DC2626', flex: 'none' }}></span>}
                </span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{f.size}</span>
              </span>
              {f.tags.length > 0 && <span style={{ display: 'inline-flex', gap: 6, flex: 'none' }}>{f.tags.map((tg) => <RvTag key={tg}>{tg}</RvTag>)}</span>}
              <Icon name="chevron_right" size={16} style={{ color: 'var(--ink-4)', flex: 'none' }} />
            </button>);
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-4)', padding: '12px 0 18px' }}>Each item can be coded independently &mdash; click to open.</div>
    </div>);
}

// ---- center: email ----
function RvMail({ sel }) {
  return (
    <div className="card" style={{ borderRadius: 14, padding: '32px 40px 40px', boxShadow: 'var(--shadow-sm)' }}>
      {sel.body.map((line, i) => {
        const isHeader = i < 3 && /^(From|To|Subject):/.test(line);
        return <p key={i} style={{ margin: i === 0 ? '0 0 4px' : isHeader ? '0 0 4px' : '0 0 15px',
          fontSize: isHeader ? 12.5 : 14.5, lineHeight: 1.6, color: isHeader ? 'var(--ink-3)' : 'var(--ink)',
          fontFamily: isHeader ? "ui-monospace, Menlo, monospace" : 'inherit', textWrap: 'pretty' }}>{line}</p>;
      })}
    </div>);
}

// ---- center: AI file summary card (pinned atop the document) ----
function RvSummaryCard({ sel }) {
  const [open, setOpen] = React.useState(true);
  const pts = sel.summaryPts || [];
  return (
    <div className="card" style={{ padding: 0, marginBottom: 22, overflow: 'hidden', borderColor: '#CBDDF5' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 16px', background: 'var(--accent-subtle, #EBF4FF)', borderBottom: open ? '1px solid #DCE8F7' : 0 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: '#fff' }}><Icon name="sparkle" size={13} /></span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--accent)' }}>File summary</span>
        <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 500 }}>VESTA</span>
        <div style={{ flex: 1 }}></div>
        <button onClick={() => setOpen(!open)} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: 0 }}>
          {open ? 'Hide' : 'Show'}<Icon name="chevron_right" size={14} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '.15s' }} />
        </button>
      </div>
      {open &&
        <div style={{ padding: '14px 16px 16px' }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-2)', textWrap: 'pretty' }}>{rvSummary(sel)}</p>
          {pts.length > 0 &&
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 13 }}>
              {pts.map((p, i) =>
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink-2)',
                  background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 11px 4px 9px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flex: 'none' }}></span>{p}
                </span>
              )}
            </div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 13, fontSize: 11, color: 'var(--ink-4)' }}>
            <Icon name="info" size={12} />AI-generated from file contents &mdash; verify before coding.
          </div>
        </div>}
    </div>);
}

// ---- center: non-previewable placeholder ----
function RvPlaceholder({ sel }) {
  const t = RV_TYPE[sel.type];
  return (
    <div className="card" style={{ borderRadius: 14, padding: '60px 30px', textAlign: 'center', boxShadow: 'var(--shadow-sm)',
      backgroundImage: 'repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 12px, #fff 12px, #fff 24px)' }}>
      <span style={{ width: 60, height: 60, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: t.color + '18', color: t.color }}><Icon name={t.icon} size={30} /></span>
      <div style={{ fontSize: 15, fontWeight: 650, color: 'var(--ink)', marginTop: 16 }}>{sel.title}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{sel.size} &middot; {sel.source}</div>
      <div style={{ display: 'inline-flex', gap: 9, marginTop: 20 }}>
        <button className="btn btn-secondary btn-sm"><Icon name="eye" size={14} />Open viewer</button>
        <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--line-2)' }}><Icon name="download" size={14} />Download</button>
      </div>
      <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11.5, color: 'var(--ink-4)', marginTop: 22 }}>{sel.type.toUpperCase()} preview \u2014 drop a {sel.type} renderer here</div>
    </div>);
}

// ---- right: coding panel ----
function RvCoding({ sel, code, decision, setCode, toggleIssue }) {
  const issues = code.issues || [];
  const priv = code.priv != null ? code.priv : sel.priv;
  const hot = code.hot != null ? code.hot : sel.hot;
  return (
    <React.Fragment>
      <SectionLabel main="Review decision" sub="relevance & flags" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        <DecisionBtn active={decision === 'relevant'} accent="var(--lime)" icon="check" label="Relevant" k="R" onClick={() => setCode({ decision: 'relevant' })} />
        <DecisionBtn active={decision === 'notrel'} accent="var(--ink-3)" icon="x" label="Not relevant" k="N" onClick={() => setCode({ decision: 'notrel' })} />
      </div>

      <SectionLabel main="Flags" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        <FlagRow on={priv} icon="shield" label="Privileged" sub="Attorney-client / work product" k="P" accent="#B5851C" onClick={() => setCode({ priv: !priv })} />
        <FlagRow on={hot} icon="flame" label="Hot / key document" sub="Flag for the trial team" k="H" accent="#DC2626" onClick={() => setCode({ hot: !hot })} />
      </div>

      <SectionLabel main="Assign to issue" sub="press 1\u20134" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {RV_ISSUES.map((iss) => {
          const on = issues.includes(iss.id);
          return (
            <button key={iss.id} onClick={() => toggleIssue(iss.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, textAlign: 'left',
              border: '1px solid ' + (on ? 'var(--primary)' : 'var(--line)'), background: on ? 'var(--primary-tint)' : '#fff', borderRadius: 11, padding: '12px 13px', cursor: 'pointer', transition: '.13s' }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, flex: 'none', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: on ? 'var(--primary)' : '#fff', border: on ? 'none' : '1.5px solid var(--line-2)', color: '#fff' }}>
                {on && <Icon name="check" size={12} sw={3} />}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{iss.label}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{iss.sub}</span>
              </span>
              <span className="kbd" style={{ flex: 'none', marginTop: 1 }}>{iss.n}</span>
            </button>);
        })}
      </div>

      <SectionLabel main="Notes" />
      <textarea value={code.note || ''} onChange={(e) => setCode({ note: e.target.value })}
        placeholder="Add a note for the team \u2014 why this matters, follow-ups, deposition flags\u2026"
        style={{ width: '100%', minHeight: 92, resize: 'vertical', border: '1px solid var(--line-2)', borderRadius: 10, padding: '11px 13px',
          fontSize: 13, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none', lineHeight: 1.5, background: 'var(--surface-2)', marginBottom: 24 }} />

      <SectionLabel main="Attach to brief" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px dashed var(--line-2)', borderRadius: 11, padding: '14px 15px',
        background: 'var(--surface-2)', opacity: decision === 'relevant' ? 1 : .7 }}>
        <Icon name="paperclip" size={16} style={{ color: 'var(--ink-3)', flex: 'none' }} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.45 }}>
          {decision === 'relevant'
            ? <React.Fragment>Ready &mdash; <span className="linkish">attach as an exhibit</span> to a brief.</React.Fragment>
            : <React.Fragment>Mark this document <b style={{ color: 'var(--lime)' }}>Relevant</b> to attach it to a brief as an exhibit.</React.Fragment>}
        </span>
      </div>
    </React.Fragment>);
}

function SectionLabel({ main, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 11 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{main}</span>
      {sub && <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{sub}</span>}
    </div>);
}

function DecisionBtn({ active, accent, icon, label, k, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, border: '1.5px solid ' + (active ? accent : 'var(--line)'),
      background: active ? accent + '14' : '#fff', borderRadius: 12, padding: '15px 10px', cursor: 'pointer', transition: '.13s' }}>
      <Icon name={icon} size={20} sw={2.2} style={{ color: active ? accent : 'var(--ink-3)' }} />
      <span style={{ fontSize: 13.5, fontWeight: 650, color: active ? 'var(--ink)' : 'var(--ink-2)' }}>{label}</span>
      <span className="kbd">{k}</span>
    </button>);
}

function FlagRow({ on, icon, label, sub, k, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', border: '1px solid ' + (on ? accent : 'var(--line)'),
      background: on ? accent + '12' : '#fff', borderRadius: 11, padding: '11px 13px', cursor: 'pointer', transition: '.13s' }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? accent + '22' : 'var(--surface-2)', color: on ? accent : 'var(--ink-3)' }}><Icon name={icon} size={16} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</span>
      </span>
      <span className="kbd" style={{ flex: 'none' }}>{k}</span>
    </button>);
}

// ---- right: other tabs (lightweight) ----
function RvStub({ tab, sel }) {
  if (tab === 'meta') {
    const rows = [['Custodian', sel.who], ['Bates', sel.bates], ['Date', sel.date], ['Size', sel.size], ['Source', sel.source || '\u2014'], ['Type', sel.type.toUpperCase()], ['Tags', sel.tags.join(', ') || '\u2014']];
    return (
      <div>
        <SectionLabel main="Document metadata" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '11px 2px', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
              <span style={{ color: 'var(--ink-3)' }}>{k}</span>
              <span style={{ color: 'var(--ink)', fontWeight: 550, textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>);
  }
  if (tab === 'entities') {
    return (
      <div>
        <SectionLabel main="Detected entities" sub="1 person" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid var(--line)', borderRadius: 11, padding: '12px 13px' }}>
          <RvAvatar who={sel.who} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{sel.who}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Custodian &middot; mentioned in this document</div>
          </div>
        </div>
      </div>);
  }
  const empty = { comments: ['comment', 'No comments yet', 'Start a thread for the trial team on this document.'], history: ['history', 'No activity', 'Coding actions on this document will appear here.'] }[tab];
  return (
    <div style={{ textAlign: 'center', padding: '46px 16px', color: 'var(--ink-3)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={empty[0]} size={21} style={{ color: 'var(--ink-4)' }} /></span>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 12 }}>{empty[1]}</div>
      <div style={{ fontSize: 12.5, marginTop: 4, maxWidth: 220, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>{empty[2]}</div>
    </div>);
}

Object.assign(window, { ReviewQueue, RvWorkbench, RvList });
