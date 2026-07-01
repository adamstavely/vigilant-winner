// handoff_components.jsx — doc primitives + Components / Icons / Data-viz sections

/* ---------- syntax highlighter (placeholder-safe) ---------- */
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function hl(code, lang){
  let s = esc(code); const store=[];
  const stash=(cls,txt)=>{ store.push(`<span class="${cls}">${txt}</span>`); return `\u0000${store.length-1}\u0000`; };
  if(lang==='css'){
    s = s.replace(/\/\*[\s\S]*?\*\//g, m=>stash('tk-com',m));
    s = s.replace(/(^|[\n;{}])(\s*)([a-z-]+)(\s*:\s*)([^;\n{}]+)/g,
      (m,pre,ws,prop,colon,val)=> pre+ws+stash('tk-prop',prop)+colon+stash('tk-val',val));
  } else {
    s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, m=>stash('tk-com',m));
    s = s.replace(/(["'])(?:(?!\1)[^])*?\1/g, m=>stash('tk-str',m));
    s = s.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, (m,a,b)=> a+stash('tk-tag',b));
    s = s.replace(/([A-Za-z_][\w-]*)(=)/g, (m,a,b)=> stash('tk-attr',a)+b);
  }
  s = s.replace(/\u0000(\d+)\u0000/g, (m,i)=>store[Number(i)]);
  return s;
}

/* ---------- clipboard + toast ---------- */
function gdToast(msg){
  let el=document.getElementById('gd-toast');
  if(!el){ el=document.createElement('div'); el.id='gd-toast'; el.className='pill-toast'; document.body.appendChild(el); }
  el.innerHTML='';
  const ic=document.createElement('span'); ic.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7FC457" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  el.appendChild(ic); el.appendChild(document.createTextNode(msg));
  el.classList.add('show'); clearTimeout(window.__gdT); window.__gdT=setTimeout(()=>el.classList.remove('show'),1400);
}
function gdCopy(text, label){ navigator.clipboard?.writeText(text).then(()=>gdToast(label||'Copied')).catch(()=>gdToast('Copied')); }

/* ---------- code block ---------- */
function Code({code, lang='html', file}){
  return (
    <div className="gd-code">
      <div className="gd-code-bar">
        <span className="fn">{file || (lang==='css'?'styles.css':'markup')}</span>
        <button className="gd-copy" onClick={()=>gdCopy(code,'Code copied')}>
          <Icon name="files" size={12} sw={2}/> Copy
        </button>
      </div>
      <pre dangerouslySetInnerHTML={{__html: hl(code, lang)}}/>
    </div>
  );
}

/* ---------- swatch ---------- */
function Swatch({nm, val, desc, ink}){
  const isVar = nm.startsWith('--');
  const display = isVar ? `var(${nm})` : nm;
  return (
    <div className="sw" onClick={()=>gdCopy(val.toUpperCase(), `${val.toUpperCase()} copied`)} title="Click to copy hex">
      <div className="chip" style={{background:val, boxShadow: ink?'inset 0 0 0 1px var(--line)':'none'}}></div>
      <div className="meta">
        <div className="nm">{display}</div>
        <div className="hex">{val}</div>
        {desc && <div className="desc">{desc}</div>}
      </div>
    </div>
  );
}
function SwatchGrid({items}){
  return <div className="sw-grid">{items.map((it,i)=><Swatch key={i} {...it}/>)}</div>;
}

/* ---------- spec table ---------- */
function SpecTable({cols, rows}){
  return (
    <table className="spec">
      <thead><tr>{cols.map((c,i)=><th key={i}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r,i)=>(
        <tr key={i}>{r.map((cell,j)=>(
          <td key={j} className={cell && cell.tok ? 'tok' : (cell && cell.val ? 'val' : '')}>
            {cell && cell.tok ? cell.tok : cell && cell.val!==undefined ? cell.val : cell}
          </td>
        ))}</tr>
      ))}</tbody>
    </table>
  );
}

/* ---------- demo surface ---------- */
function Demo({children, col, padLg, label}){
  return (
    <div className={'gd-demo'+(col?' col':'')+(padLg?' pad-lg':'')}>
      {label && <div className="lbl">{label}</div>}
      {children}
    </div>
  );
}
function Note({children, warn}){
  return (
    <div className={'gd-note'+(warn?' warn':'')}>
      <Icon name={warn?'alert':'bulb'} size={16} sw={2}/>
      <div>{children}</div>
    </div>
  );
}

/* ============================================================ */
/* SECTION: Components                                           */
/* ============================================================ */
function ComponentsSection(){
  return (
    <section className="gd-sec" id="components">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">04</span> · Components</div>
        <h2>Component library</h2>
        <p>Every component below is rendered live from the production stylesheet. Class names are the contract — build to these and visuals stay in sync with design automatically.</p>
      </div>

      {/* Buttons */}
      <div className="gd-sub">Buttons</div>
      <Demo label="Variants & sizes">
        <button className="btn btn-primary"><Icon name="plus" size={16} sw={2}/> New task</button>
        <button className="btn btn-secondary"><Icon name="filter" size={16} sw={2}/> Filter</button>
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary btn-sm">Save</button>
        <button className="btn btn-secondary btn-sm">Edit</button>
        <button className="btn btn-secondary btn-icon"><Icon name="more" size={18}/></button>
        <button className="btn btn-secondary btn-icon btn-sm"><Icon name="x" size={14} sw={2}/></button>
      </Demo>
      <SpecTable cols={['Class','Height','Padding','Radius','Use']} rows={[
        [{tok:'.btn-primary'}, {val:'36px'}, {val:'0 14px'}, {val:'6px'}, 'Single primary action per view'],
        [{tok:'.btn-secondary'}, {val:'36px'}, {val:'0 14px'}, {val:'6px'}, 'Neutral / secondary actions'],
        [{tok:'.btn-ghost'}, {val:'36px'}, {val:'0 14px'}, {val:'6px'}, 'Low-emphasis, inline'],
        [{tok:'.btn-sm'}, {val:'30px'}, {val:'0 11px'}, {val:'5px'}, 'Dense rows, toolbars'],
        [{tok:'.btn-icon'}, {val:'36px'}, {val:'square'}, {val:'8px'}, 'Icon-only; pair with .btn-sm for 32px'],
      ]}/>
      <Code lang="html" code={`<button class="btn btn-primary">
  <svg class="icon"><!-- plus --></svg> New task
</button>

<button class="btn btn-secondary btn-sm">Edit</button>
<button class="btn btn-secondary btn-icon"><!-- more --></button>`}/>
      <Note>Primary buttons lift <b>1px on hover</b> (<code>translateY(-1px)</code>) and settle on <code>:active</code>. Keep the transition token <code>.12s cubic-bezier(.2,.8,.3,1)</code> — it's the house easing used across all interactive lifts.</Note>

      {/* Cards */}
      <div className="gd-sub">Cards</div>
      <Demo padLg>
        <div className="card card-pad" style={{flex:1,minWidth:220}}>
          <div className="eyebrow">Workspace</div>
          <div className="card-title" style={{marginTop:4}}>Q3 Campaign Launch</div>
          <div className="muted" style={{fontSize:12.5,marginTop:6}}>Static surface — base elevation.</div>
        </div>
        <div className="card card-pad card-hover" style={{flex:1,minWidth:220}}>
          <div className="eyebrow">Workspace</div>
          <div className="card-title" style={{marginTop:4}}>Brand Guidelines v4</div>
          <div className="muted" style={{fontSize:12.5,marginTop:6}}>Hover me — interactive card lifts 2px.</div>
        </div>
      </Demo>
      <SpecTable cols={['Class','Radius','Border','Shadow']} rows={[
        [{tok:'.card'}, {val:'14px'}, {val:'1px var(--line)'}, {val:'--shadow-sm'}],
        [{tok:'.card-pad'}, {val:'—'}, {val:'18px 20px padding'}, {val:'—'}],
        [{tok:'.card-hover'}, {val:'14px'}, {val:'→ var(--line-2)'}, {val:'→ --shadow-md, -2px lift'}],
      ]}/>
      <Code lang="html" code={`<div class="card card-pad card-hover">
  <div class="eyebrow">Workspace</div>
  <div class="card-title">Q3 Campaign Launch</div>
</div>`}/>

      {/* Chips & badges */}
      <div className="gd-sub">Chips, tags &amp; badges</div>
      <Demo label="Filter chips (toggle)">
        <span className="chip on"><Icon name="check" size={13} sw={2.5}/> All</span>
        <span className="chip">Active</span>
        <span className="chip">Archived</span>
        <span className="chip"><Icon name="calendar" size={13} sw={2}/> This week</span>
      </Demo>
      <Demo label="Category tags (data-driven)">
        {Object.keys(window.TAGS||{}).slice(0,7).map(k=><Tag key={k} k={k}/>)}
      </Demo>
      <SpecTable cols={['Component','Height','Shape','Notes']} rows={[
        [{tok:'.chip'}, {val:'26px'}, {val:'pill'}, 'Add .on for the selected state'],
        [{tok:'.badge'}, {val:'22px'}, {val:'6px'}, 'Tinted label; color from token map'],
        [{tok:'<Tag k>'}, {val:'22px'}, {val:'6px'}, 'Reads TAGS[k] → {label, color, tint}'],
      ]}/>

      {/* Status pills */}
      <div className="gd-sub">Status pills</div>
      <Demo label="Pipeline status — STATUS token map">
        {Object.keys(window.STATUS||{}).map(k=><StatusPill key={k} k={k}/>)}
      </Demo>
      <Demo label="Priority flags — PRIORITY token map">
        {Object.keys(window.PRIORITY||{}).map(k=>(
          <span key={k} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12.5,color:'var(--ink-2)',fontWeight:550}}>
            <PriorityFlag k={k}/> {window.PRIORITY[k].label}
          </span>
        ))}
      </Demo>
      <Note>Status and priority are <b>data-driven</b>. A pill is a label + a 7px dot, both colored from the same token entry. Never hard-code these colors in markup — extend the map in <code>data.jsx</code> and every pill updates.</Note>
      <Code lang="html" code={`<span class="st" style="background:var(--blue-t); color:var(--blue)">
  <span class="dot" style="background:var(--blue)"></span> In Progress
</span>`}/>

      {/* Avatars */}
      <div className="gd-sub">Avatars</div>
      <Demo label="Single, sizes & stack">
        {(window.PL||[]).slice(0,1).map(p=><Avatar key={p.id} id={p.id} size={40}/>)}
        {(window.PL||[]).slice(1,2).map(p=><Avatar key={p.id} id={p.id} size={32}/>)}
        {(window.PL||[]).slice(2,3).map(p=><Avatar key={p.id} id={p.id} size={26}/>)}
        <span style={{width:18}}></span>
        <AvatarStack ids={(window.PL||[]).slice(0,5).map(p=>p.id)} size={30} max={3}/>
      </Demo>
      <SpecTable cols={['Prop','Default','Notes']} rows={[
        [{tok:'size'}, {val:'26'}, 'Font scales to 0.4× size; min hit target 26px'],
        [{tok:'ring'}, {val:'true'}, '2px white ring (box-shadow) for overlap legibility'],
        [{tok:'AvatarStack max'}, {val:'3'}, 'Overflow collapses into a +N counter chip'],
      ]}/>

      {/* Table */}
      <div className="gd-sub">Data table</div>
      <Demo padLg col>
        <table className="tbl">
          <thead><tr><th>Task</th><th>Owner</th><th>Status</th><th>Priority</th></tr></thead>
          <tbody>
            <tr><td style={{color:'var(--ink)',fontWeight:550}}>Finalize launch copy</td><td><Avatar id={(window.PL||[{}])[0].id} size={22}/></td><td><StatusPill k="in_progress"/></td><td><PriorityFlag k="urgent"/></td></tr>
            <tr><td style={{color:'var(--ink)',fontWeight:550}}>Export brand assets</td><td><Avatar id={(window.PL||[{},{}])[1] ? window.PL[1].id : undefined} size={22}/></td><td><StatusPill k="review"/></td><td><PriorityFlag k="high"/></td></tr>
            <tr><td style={{color:'var(--ink)',fontWeight:550}}>Archive Q2 retro</td><td><Avatar id={(window.PL||[{},{},{}])[2] ? window.PL[2].id : undefined} size={22}/></td><td><StatusPill k="complete"/></td><td><PriorityFlag k="med"/></td></tr>
          </tbody>
        </table>
      </Demo>
      <Note>Rows hover to <code>var(--surface-2)</code> with a pointer cursor. Header cells are <b>11px uppercase, .05em tracked</b>. Cell borders use <code>border-top:1px solid var(--line)</code> — no outer table border.</Note>

      {/* Nav + misc */}
      <div className="gd-sub">Navigation &amp; inline elements</div>
      <Demo label="Nav links">
        <span className="navlink active"><Icon name="grid" size={16}/> Dashboard</span>
        <span className="navlink"><Icon name="check_square" size={16}/> Tasks</span>
        <span className="navlink"><Icon name="chart" size={16}/> Metrics</span>
      </Demo>
      <Demo label="Inline: keyboard, link, divider">
        <span style={{fontSize:13,color:'var(--ink-2)'}}>Press <span className="kbd">⌘</span> <span className="kbd">K</span> to search</span>
        <span className="linkish">View all activity</span>
      </Demo>
    </section>
  );
}

/* ============================================================ */
/* SECTION: Icons                                               */
/* ============================================================ */
function IconSection(){
  const names = Object.keys(window.ICON_PATHS || {});
  return (
    <section className="gd-sec" id="icons">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">05</span> · Iconography</div>
        <h2>Icon set</h2>
        <p>{names.length} custom stroke icons on a 24×24 grid. One component, currentColor stroke — size and weight are props, never bake color into the SVG.</p>
      </div>
      <Code lang="html" code={`<Icon name="search" size={18} sw={1.75} />
<!-- size = px box · sw = stroke-width · inherits color via currentColor -->`}/>
      <div className="gd-sub">All icons · click name to copy</div>
      <div className="ico-grid">
        {names.map(n=>(
          <div className="ico" key={n} onClick={()=>gdCopy(n, `"${n}" copied`)}>
            <Icon name={n} size={22} sw={1.75}/>
            <span className="nm">{n}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================ */
/* SECTION: Data viz                                            */
/* ============================================================ */
function DataVizSection(){
  return (
    <section className="gd-sec" id="dataviz">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">06</span> · Data visualization</div>
        <h2>Charts</h2>
        <p>Lightweight inline-SVG charts — no charting dependency. Smoothing uses a shared <code>smoothPath()</code> Catmull-style helper; fills are vertical alpha gradients of the line color.</p>
      </div>
      <div className="gd-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="card card-pad">
          <div className="eyebrow">Sparkline</div>
          <div style={{marginTop:12}}><Sparkline data={[4,7,5,9,8,12,10,14]} color="#1D6BD0" w={220} h={56}/></div>
        </div>
        <div className="card card-pad" style={{display:'flex',alignItems:'center',gap:18}}>
          <Donut value={72} size={104} label="72%" sub="On track" color="#1FA98A"/>
          <div>
            <div className="eyebrow">Donut</div>
            <div className="muted" style={{fontSize:12.5,marginTop:6,maxWidth:140}}>Animated stroke-dashoffset, rounded cap.</div>
          </div>
        </div>
      </div>
      <div className="card card-pad" style={{marginTop:14}}>
        <div className="eyebrow">Area chart</div>
        <div style={{marginTop:10}}>
          <AreaChart series={[[12,18,15,22,19,26,24],[8,11,9,14,12,16,15]]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} color={['#1D6BD0','#8A63C4']} h={200}/>
        </div>
      </div>
      <div className="card card-pad" style={{marginTop:14}}>
        <div className="eyebrow">Bar chart</div>
        <div style={{marginTop:10}}>
          <BarChart data={[14,22,18,26,20,30]} labels={['Jan','Feb','Mar','Apr','May','Jun']} color="#1D6BD0" h={180}/>
        </div>
      </div>
      <Note>Charts inherit the <b>accent palette</b>. Pass a single color or an array for multi-series. Default stroke width is <code>2.4</code> for area, line caps rounded, grid lines <code>#EEF2F7</code>.</Note>
    </section>
  );
}

Object.assign(window, {
  esc, hl, gdToast, gdCopy, Code, Swatch, SwatchGrid, SpecTable, Demo, Note,
  ComponentsSection, IconSection, DataVizSection
});
