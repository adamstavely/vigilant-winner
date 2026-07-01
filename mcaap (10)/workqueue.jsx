// workqueue.jsx — shared "assigned to you / your team" datatable that fronts
// each work workspace (Clearance, Prep, Memos, Review). Click a row to drop
// into the single-document work area for that workspace.

// segmented scope control: Assigned to me · My team · All
function ScopeTabs({ scopes, scope, setScope, counts }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: '#EEF1F6', padding: 3, borderRadius: 9, width: 'fit-content' }} data-tour="ws-scope">
      {scopes.map((s) => {
        const on = scope === s.id;
        return (
          <button key={s.id} onClick={() => setScope(s.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, border: 0,
              background: on ? '#fff' : 'transparent', color: on ? 'var(--ink)' : 'var(--ink-3)',
              fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 7, cursor: 'pointer',
              boxShadow: on ? 'var(--shadow-sm)' : 'none', transition: '.12s' }}>
            {s.label}
            <span style={{ fontSize: 11, fontWeight: 700, minWidth: 16, height: 16, padding: '0 5px', borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: on ? 'var(--primary-tint)' : 'transparent', color: on ? 'var(--primary)' : 'var(--ink-4)' }}>{counts[s.id]}</span>
          </button>);
      })}
    </div>);
}

// a person cell (avatar + first name) — workspace passes its own resolver
function QPerson({ av, name }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
      {av}<span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 550 }}>{name}</span>
    </span>);
}

// leading "title" cell: icon tile + title + sub-line
function QTitle({ icon, color, tint, title, sub, glyph }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tint || (color + '18'), color: color }}>{glyph || <Icon name={icon} size={17} />}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-.01em' }}>{title}</span>
        {sub && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>}
      </span>
    </span>);
}

// the datatable shell used by every workspace's landing view
function WorkQueue({ blurb, lead, scopes, scopeOf, rows, columns, onOpen, idKey = 'id', emptyLabel = 'Nothing assigned here right now.' }) {
  const [scope, setScope] = React.useState(scopes[0].id);
  const counts = {};
  scopes.forEach((s) => { counts[s.id] = s.id === 'all' ? rows.length : rows.filter((r) => scopeOf(r) === s.id).length; });
  const list = scope === 'all' ? rows : rows.filter((r) => scopeOf(r) === scope);

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 56, maxWidth: 1240 }}>
      {blurb && <p style={{ fontSize: 14, margin: 0, color: 'var(--ink-3)', maxWidth: 640, lineHeight: 1.5 }}>{blurb}</p>}
      {lead}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, margin: '22px 0 14px' }}>
        <ScopeTabs scopes={scopes} scope={scope} setScope={setScope} counts={counts} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-4)', fontWeight: 500 }}>{list.length} {list.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="card" data-tour="ws-table" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
          <colgroup>
            {columns.map((c, i) => <col key={i} style={{ width: c.width || 'auto' }} />)}
            <col style={{ width: 40 }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {columns.map((c, i) => (
                <th key={i} style={{ textAlign: c.align || 'left', fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                  color: 'var(--ink-3)', padding: '11px 16px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
              <th style={{ borderBottom: '1px solid var(--line)' }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((r, ri) => (
              <tr key={r[idKey]} onClick={() => onOpen(r[idKey])}
                style={{ cursor: 'pointer', transition: 'background .12s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {columns.map((c, ci) => (
                  <td key={ci} style={{ padding: c.pad || '13px 16px', borderTop: ri ? '1px solid var(--line)' : 0,
                    textAlign: c.align || 'left', verticalAlign: 'middle', color: 'var(--ink-2)' }}>{c.render(r)}</td>
                ))}
                <td style={{ borderTop: ri ? '1px solid var(--line)' : 0, textAlign: 'right', padding: '0 14px' }}>
                  <Icon name="chevron_right" size={16} style={{ color: 'var(--ink-4)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div style={{ padding: '46px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <Icon name="inbox" size={24} style={{ color: 'var(--ink-4)' }} />
            <div style={{ fontSize: 13.5, marginTop: 9, fontWeight: 500 }}>{emptyLabel}</div>
          </div>
        )}
      </div>
    </div>);
}

Object.assign(window, { WorkQueue, ScopeTabs, QPerson, QTitle });
