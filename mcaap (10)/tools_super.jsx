// tools_super.jsx — "Tools" catalog (SuperApp pattern): grid · categories · search · favorites · detail drawer

const TOOL_CATS = {
  language:     {label:'Language',     color:'#16A34A', tint:'#F0FDF4', icon:'route'},
  data:         {label:'Data',         color:'#1D3557', tint:'#EAF0F7', icon:'database'},
  identity:     {label:'Identity',     color:'#0073E6', tint:'#EBF4FF', icon:'fingerprint'},
  financial:    {label:'Financial',    color:'#B5851C', tint:'#F8F0DA', icon:'chart'},
  productivity: {label:'Productivity', color:'#475569', tint:'#F1F5F9', icon:'sparkle'},
};
const CAT_ORDER = ['productivity','data','identity','language','financial'];

const BUMP = {
  major:{label:'Major', color:'#DC2626', tint:'#FEF2F2'},
  minor:{label:'Minor', color:'#0073E6', tint:'#EBF4FF'},
  patch:{label:'Patch', color:'#64748B', tint:'#F1F5F9'},
};

// party: 'first_party' (built in-house) | 'third_party' (external vendor)
function tool(id, name, cat, icon, desc, o={}){
  return { id, name, cat, icon, desc,
    party:o.party||'first_party', team:o.team||'Platform Eng', contact:o.contact||'#imin-platform',
    version:o.version||'1.0.0', access:o.access||'All staff', audit:o.audit!==false,
    launch:o.launch||'in-app', fav:!!o.fav, uses:o.uses||0, agent:o.agent||null,
    changelog:o.changelog||[] };
}

const TOOLS = [
  // productivity
  tool('privlog','Privilege Log Builder','productivity','shield','Assemble, format and export privilege logs with consistent basis language.',
    {version:'3.2.1', access:'Counsel only', uses:214, agent:'cassius', fav:true,
     changelog:[{version:'3.2.1',date:'Jun 4, 2026',bump:'patch',notes:'Fixed duplicate-entry merge on import.'},
                {version:'3.2.0',date:'May 28, 2026',bump:'minor',notes:'Added CASSIUS agent assist for draft entries.'},
                {version:'3.0.0',date:'Apr 2, 2026',bump:'major',notes:'New basis taxonomy + court-template export.'}]}),
  tool('redact','Redaction Studio','productivity','eye','Apply, review and burn-in redactions across documents and media.',
    {version:'2.7.0', access:'Case team', uses:486,
     changelog:[{version:'2.7.0',date:'Jun 1, 2026',bump:'minor',notes:'Auto-detect PII suggestions.'},
                {version:'2.6.3',date:'May 12, 2026',bump:'patch',notes:'Performance on 500+ page PDFs.'}]}),
  tool('bates','Bates Numberer','productivity','list','Stamp Bates numbers and confidentiality designations across a production.',
    {version:'1.9.0', access:'Case team', uses:332,
     changelog:[{version:'1.9.0',date:'May 20, 2026',bump:'minor',notes:'Custom prefix ranges per custodian.'}]}),
  tool('cite','Citation Checker','productivity','book','Verify and Bluebook-format citations against the record and reporters.',
    {party:'third_party', team:'Cite-Right Inc.', contact:'support@citeright.com', version:'5.4.2', access:'All staff', uses:158, launch:'external',
     changelog:[{version:'5.4.2',date:'Jun 3, 2026',bump:'patch',notes:'Updated 2026 reporter tables.'},
                {version:'5.4.0',date:'May 1, 2026',bump:'minor',notes:'Parallel-cite detection.'}]}),
  tool('brief','Briefing Builder','productivity','pen','Compose briefs and memos from templates, the record and prior work.',
    {version:'2.1.0', access:'Counsel only', uses:97, agent:'solon',
     changelog:[{version:'2.1.0',date:'May 30, 2026',bump:'minor',notes:'SOLON agent drafting in co-pilot mode.'}]}),

  // data
  tool('ingest','Data Ingest','data','database','Intake forms and pipelines to bring datasets into the ecosystem.',
    {version:'4.0.1', access:'Case team', uses:540,
     changelog:[{version:'4.0.1',date:'Jun 5, 2026',bump:'patch',notes:'Resilient resume on large uploads.'},
                {version:'4.0.0',date:'May 6, 2026',bump:'major',notes:'New connector framework + checksum verification.'}]}),
  tool('extract','Device Extraction','data','cpu','Acquire and process phones, laptops and drives into review-ready sets.',
    {version:'3.5.0', access:'Admin', uses:88,
     changelog:[{version:'3.5.0',date:'May 18, 2026',bump:'minor',notes:'iOS 18 + Android 14 parsers.'}]}),
  tool('production','Production Builder','data','layers','Stage, convert and QC document productions before service.',
    {version:'2.3.2', access:'Case team', uses:176, agent:'atlas',
     changelog:[{version:'2.3.2',date:'Jun 2, 2026',bump:'patch',notes:'TIFF conversion stability.'},
                {version:'2.3.0',date:'Apr 24, 2026',bump:'minor',notes:'Native+image hybrid productions.'}]}),
  tool('dedupe','Dedupe & Threading','data','files','De-duplicate and email-thread large collections to cut review volume.',
    {version:'1.6.0', access:'Case team', uses:201,
     changelog:[{version:'1.6.0',date:'May 22, 2026',bump:'minor',notes:'Near-dupe similarity tuning.'}]}),

  // identity
  tool('custodians','Custodian Directory','identity','users','Track custodians, sources, holds and chain-of-custody.',
    {version:'2.0.0', access:'All staff', uses:312, fav:true,
     changelog:[{version:'2.0.0',date:'May 10, 2026',bump:'major',notes:'Legal-hold acknowledgement tracking.'}]}),
  tool('access','Access Review','identity','lock','Review who can see what; run periodic access attestations.',
    {version:'1.4.1', access:'Admin', uses:64,
     changelog:[{version:'1.4.1',date:'Jun 1, 2026',bump:'patch',notes:'Export attestations to CSV.'}]}),
  tool('clearance','Clearance Lookup','identity','shield_check','Check conflicts, clearances and confidentiality designations.',
    {version:'1.2.0', access:'Counsel only', uses:143, agent:'vesta',
     changelog:[{version:'1.2.0',date:'May 26, 2026',bump:'minor',notes:'VESTA pre-screen integration.'}]}),

  // language
  tool('termbase','Term Base','language','book','Shared glossary of defined terms, names and translations.',
    {version:'3.1.0', access:'All staff', uses:421, fav:true,
     changelog:[{version:'3.1.0',date:'May 29, 2026',bump:'minor',notes:'Per-matter term overrides.'}]}),
  tool('translate','Translate & Localize','language','route','Translate and adapt documents and exhibits across languages.',
    {party:'third_party', team:'LinguaPort', contact:'help@linguaport.io', version:'6.2.0', access:'All staff', uses:188, launch:'external',
     changelog:[{version:'6.2.0',date:'May 15, 2026',bump:'minor',notes:'Legal-domain model for FR/DE.'}]}),
  tool('transcribe','Transcribe','language','mic','Transcribe audio and video evidence with speaker labels.',
    {party:'third_party', team:'Verbatim AI', contact:'support@verbatim.ai', version:'4.1.3', access:'Case team', uses:131, launch:'external',
     changelog:[{version:'4.1.3',date:'Jun 2, 2026',bump:'patch',notes:'Timestamp accuracy on overlap.'}]}),

  // financial
  tool('damages','Damages Modeler','financial','chart','Model damages scenarios and produce expert-ready exhibits.',
    {version:'1.3.0', access:'Counsel only', uses:54,
     changelog:[{version:'1.3.0',date:'May 8, 2026',bump:'minor',notes:'Sensitivity tables + chart export.'}]}),
  tool('billing','LEDES Billing','financial','file','Capture time and export LEDES-format invoices to clients.',
    {party:'third_party', team:'BillFlow', contact:'accounts@billflow.com', version:'8.0.4', access:'Admin', uses:209, launch:'external',
     changelog:[{version:'8.0.4',date:'Jun 3, 2026',bump:'patch',notes:'LEDES 2.2 compliance fix.'}]}),
  tool('budget','Matter Budget','financial','pulse','Track matter budgets, burn rate and phase-level spend.',
    {version:'2.2.0', access:'Case team', uses:77,
     changelog:[{version:'2.2.0',date:'May 19, 2026',bump:'minor',notes:'Phase/task budget rollups.'}]}),
];

// ---------- page ----------
function ToolsPage({ setPage, flash }){
  const [q,setQ] = React.useState('');
  const [cat,setCat] = React.useState('all');
  const [favOnly,setFavOnly] = React.useState(false);
  const [sel,setSel] = React.useState(null);
  const [favs,setFavs] = React.useState(()=>{
    try{ const s=JSON.parse(localStorage.getItem('imin_tool_favs')); if(s) return new Set(s); }catch(e){}
    return new Set(TOOLS.filter(t=>t.fav).map(t=>t.id));
  });
  function toggleFav(id){ setFavs(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); try{localStorage.setItem('imin_tool_favs',JSON.stringify([...n]));}catch(e){} return n; }); }

  const ql=q.trim().toLowerCase();
  const filtered = TOOLS.filter(t=>{
    if(cat!=='all' && t.cat!==cat) return false;
    if(favOnly && !favs.has(t.id)) return false;
    if(ql && !(t.name.toLowerCase().includes(ql)||t.desc.toLowerCase().includes(ql)||t.team.toLowerCase().includes(ql))) return false;
    return true;
  });
  const cats = cat==='all' ? CAT_ORDER : [cat];
  const selTool = TOOLS.find(t=>t.id===sel);

  return (
    <div className="rise">
      {/* hero */}
      <div style={{position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.4)'}}>
        <HeroPattern opacity={0.7}/>
        <div className="page" style={{position:'relative',zIndex:1,paddingTop:30,paddingBottom:22}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>Workspace · Tools</div>
              <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>Tools</h1>
              <p className="sec" style={{fontSize:14,margin:'5px 0 0'}}>{TOOLS.length} internal & third-party tools for the case team · {TOOLS.filter(t=>t.agent).length} with agent assist</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <div style={{position:'relative'}}>
                <Icon name="search" size={16} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--ink-4)'}}/>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools…"
                  style={{height:38,width:240,border:'1px solid var(--line-2)',borderRadius:9,padding:'0 12px 0 34px',fontSize:13.5,fontFamily:'inherit',outline:'none',background:'#fff'}}
                  onFocus={e=>e.target.style.borderColor='var(--blue)'} onBlur={e=>e.target.style.borderColor='var(--line-2)'}/>
              </div>
              <button className={'btn btn-sm '+(favOnly?'btn-primary':'btn-secondary')} onClick={()=>setFavOnly(v=>!v)} style={{height:38}}>
                <Icon name={favOnly?'star_fill':'star'} size={15} style={favOnly?{color:'#fff'}:{color:'#B5851C'}}/>Favorites
              </button>
            </div>
          </div>

          {/* category chips */}
          <div style={{display:'flex',alignItems:'center',gap:7,marginTop:18,flexWrap:'wrap'}}>
            <button className={'chip'+(cat==='all'?' on':'')} onClick={()=>setCat('all')}>All<span style={{marginLeft:2,fontFamily:"ui-monospace,Menlo,monospace",fontSize:11,fontWeight:600,opacity:.7}}>{TOOLS.length}</span></button>
            {CAT_ORDER.map(id=>{
              const c=TOOL_CATS[id], on=cat===id, n=TOOLS.filter(t=>t.cat===id).length;
              return (
                <button key={id} onClick={()=>setCat(id)} style={{display:'inline-flex',alignItems:'center',gap:6,height:28,padding:'0 12px',borderRadius:999,fontSize:12.5,fontWeight:550,cursor:'pointer',transition:'.13s',
                  border:'1px solid '+(on?c.color:'var(--line-2)'),background:on?c.tint:'#fff',color:on?c.color:'var(--ink-2)'}}
                  onMouseEnter={e=>{if(!on)e.currentTarget.style.background='var(--hover)';}} onMouseLeave={e=>{if(!on)e.currentTarget.style.background='#fff';}}>
                  <Icon name={c.icon} size={13} style={{color:c.color}}/>{c.label}
                  <span style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:11,fontWeight:600,color:on?c.color:'var(--ink-3)'}}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* grid grouped by category */}
      <div className="page" style={{paddingTop:24}}>
        {filtered.length===0 &&
          <div style={{padding:'60px',textAlign:'center',color:'var(--ink-4)',border:'1.5px dashed var(--line-2)',borderRadius:14}}>No tools match “{q}”.</div>}
        {cats.map(cid=>{
          const list=filtered.filter(t=>t.cat===cid);
          if(list.length===0) return null;
          const c=TOOL_CATS[cid];
          return (
            <div key={cid} style={{marginBottom:30}}>
              <div style={{display:'flex',alignItems:'center',gap:9,margin:'0 2px 14px'}}>
                <span style={{width:26,height:26,borderRadius:8,background:c.tint,color:c.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={c.icon} size={15}/></span>
                <span style={{fontSize:15,fontWeight:700,letterSpacing:'-.01em',color:'var(--ink)'}}>{c.label}</span>
                <span className="badge" style={{background:'#F1F5F9',color:'var(--ink-3)'}}>{list.length}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
                {list.map(t=><ToolCard key={t.id} t={t} fav={favs.has(t.id)} toggleFav={toggleFav} onOpen={()=>setSel(t.id)} flash={flash}/>)}
              </div>
            </div>
          );
        })}
      </div>

      {selTool && <ToolDrawer t={selTool} fav={favs.has(selTool.id)} toggleFav={toggleFav} onClose={()=>setSel(null)} setPage={setPage} flash={flash}/>}
    </div>
  );
}

function PartyBadge({ party, sm }){
  const first = party==='first_party';
  return (
    <span className="badge" style={{background:first?'#EBF4FF':'#FFFBEB',color:first?'#0073E6':'#C58A1E',height:sm?18:20,fontSize:sm?10:10.5,letterSpacing:'.02em',whiteSpace:'nowrap'}}>
      <Icon name={first?'shield_check':'globe'} size={sm?10:11}/>{first?'1st\u2011party':'3rd\u2011party'}
    </span>
  );
}

function ToolCard({ t, fav, toggleFav, onOpen, flash }){
  const c=TOOL_CATS[t.cat];
  const ag = t.agent && (typeof AGENTS!=='undefined') ? AGENTS[t.agent] : null;
  return (
    <div className="card card-hover" onClick={onOpen} style={{padding:'15px 16px',cursor:'pointer',display:'flex',flexDirection:'column',gap:12,minHeight:158}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:11}}>
        <span style={{width:42,height:42,borderRadius:11,background:c.tint,color:c.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={21}/></span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14.5,fontWeight:650,color:'var(--ink)',letterSpacing:'-.01em',display:'flex',alignItems:'center',gap:7}}>{t.name}
            {t.launch==='external' && <Icon name="external" size={13} style={{color:'var(--ink-4)'}}/>}</div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5}}>
            <PartyBadge party={t.party} sm/>
            <span style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:10.5,color:'var(--ink-3)',fontWeight:500}}>v{t.version}</span>
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();toggleFav(t.id);}} className="btn btn-ghost btn-icon btn-sm" title="Favorite" style={{flex:'none',color:fav?'#B5851C':'var(--ink-4)'}}>
          <Icon name={fav?'star_fill':'star'} size={17}/>
        </button>
      </div>
      <div style={{fontSize:12.5,color:'var(--ink-3)',lineHeight:1.5,flex:1,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{t.desc}</div>
      <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:11,borderTop:'1px solid var(--line)'}}>
        {ag ? <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:ag.color}}><Icon name="sparkle" size={12}/>{ag.code} assist</span>
            : <span className="muted" style={{fontSize:11.5,display:'inline-flex',alignItems:'center',gap:5}}><Icon name="user" size={12}/>{t.access}</span>}
        <div style={{flex:1}}></div>
        <button onClick={e=>{e.stopPropagation();flash&&flash('Launching '+t.name);}} className="btn btn-secondary btn-sm">
          {t.launch==='external'?<Icon name="external" size={13}/>:<Icon name="arrow_right" size={13}/>}Open
        </button>
      </div>
    </div>
  );
}

// ---------- detail drawer ----------
function ToolDrawer({ t, fav, toggleFav, onClose, setPage, flash }){
  const c=TOOL_CATS[t.cat];
  const ag = t.agent && (typeof AGENTS!=='undefined') ? AGENTS[t.agent] : null;
  React.useEffect(()=>{const esc=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[]);
  const meta=[
    ['Category', <span style={{display:'inline-flex',alignItems:'center',gap:6,color:c.color,fontWeight:600}}><Icon name={c.icon} size={13}/>{c.label}</span>],
    ['Version', <span style={{fontFamily:"ui-monospace,Menlo,monospace",fontWeight:600}}>v{t.version}</span>],
    ['Access level', t.access],
    ['Audit log', t.audit ? <span style={{display:'inline-flex',alignItems:'center',gap:5,color:'#16A34A',fontWeight:600}}><Icon name="shield_check" size={13}/>Enabled</span> : <span className="muted">Off</span>],
    ['Launches', (t.launch==='external'?'New tab (external)':'In-app')],
  ];
  return (
    <div style={{position:'fixed',inset:0,zIndex:320}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(36,39,45,.28)',backdropFilter:'blur(1px)',animation:'fade .2s'}}></div>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'min(460px,96vw)',background:'#fff',boxShadow:'-20px 0 60px rgba(29,53,87,.18)',animation:'slidein .26s cubic-bezier(.2,.8,.3,1)',display:'flex',flexDirection:'column'}}>
        {/* header */}
        <div style={{padding:'18px 20px',borderBottom:'1px solid var(--line)'}}>
          <div style={{display:'flex',justifyContent:'flex-end',gap:4,marginBottom:6}}>
            <button onClick={()=>toggleFav(t.id)} className="btn btn-ghost btn-icon btn-sm" title="Favorite" style={{color:fav?'#B5851C':'var(--ink-4)'}}><Icon name={fav?'star_fill':'star'} size={17}/></button>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
          </div>
          <div style={{display:'flex',alignItems:'flex-start',gap:13}}>
            <span style={{width:48,height:48,borderRadius:13,background:c.tint,color:c.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={24}/></span>
            <div style={{flex:1,minWidth:0}}>
              <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:0,color:'var(--ink)',lineHeight:1.2}}>{t.name}</h2>
              <div style={{display:'flex',alignItems:'center',gap:7,marginTop:7}}><PartyBadge party={t.party}/>{ag && <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11.5,fontWeight:600,color:ag.color}}><Icon name="sparkle" size={12}/>{ag.code} assist</span>}</div>
            </div>
          </div>
          <p style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.55,margin:'14px 0 0'}}>{t.desc}</p>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'18px 20px',display:'flex',flexDirection:'column',gap:20}}>
          {/* maintainer */}
          <div>
            <div className="eyebrow" style={{marginBottom:10}}>Maintainer</div>
            <div className="card" style={{padding:'13px 14px',display:'flex',alignItems:'center',gap:12}}>
              <span style={{width:38,height:38,borderRadius:10,background:t.party==='first_party'?'var(--primary-tint)':'#FFFBEB',color:t.party==='first_party'?'var(--primary)':'#C58A1E',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.party==='first_party'?'users':'globe'} size={18}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>{t.team}</div>
                <div className="muted" style={{fontSize:11.5}}>{t.party==='first_party'?'Internal team':'Third-party vendor'} · {t.contact}</div>
              </div>
            </div>
          </div>

          {/* meta grid */}
          <div>
            <div className="eyebrow" style={{marginBottom:10}}>Details</div>
            <div style={{display:'flex',flexDirection:'column',gap:1}}>
              {meta.map(([l,v])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderTop:'1px solid var(--line)'}}>
                  <span style={{fontSize:12,color:'var(--ink-3)',fontWeight:550,width:100,flex:'none'}}>{l}</span>
                  <span style={{fontSize:12.5,color:'var(--ink)',fontWeight:500,textAlign:'right',flex:1}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* changelog */}
          <div>
            <div className="eyebrow" style={{marginBottom:10}}>Changelog</div>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:7,top:6,bottom:6,width:2,background:'var(--line)'}}></div>
              {t.changelog.map((ch,i)=>{
                const b=BUMP[ch.bump];
                return (
                  <div key={i} style={{display:'flex',gap:13,padding:'5px 0 14px',position:'relative'}}>
                    <span style={{width:16,height:16,borderRadius:'50%',border:'3px solid #fff',background:b.color,flex:'none',marginTop:2,zIndex:1,boxShadow:'0 0 0 1px '+b.color+'55'}}></span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                        <span style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:12,fontWeight:700,color:'var(--ink)'}}>v{ch.version}</span>
                        <span className="badge" style={{background:b.tint,color:b.color,height:18,fontSize:10}}>{b.label}</span>
                        <span className="muted" style={{fontSize:11}}>{ch.date}</span>
                      </div>
                      <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5}}>{ch.notes}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer launch */}
        <div style={{padding:'14px 20px',borderTop:'1px solid var(--line)',background:'var(--surface-2)',display:'flex',gap:9,alignItems:'center'}}>
          {t.audit && <span className="muted" style={{fontSize:11,display:'inline-flex',alignItems:'center',gap:5}}><Icon name="lock" size={12}/>Audit logged</span>}
          <div style={{flex:1}}></div>
          {ag && <button className="btn btn-secondary" onClick={()=>{onClose();window.__openKickoff&&window.__openKickoff(t.agent);}}><Icon name="sparkle" size={15} style={{color:ag.color}}/>Delegate</button>}
          <button className="btn btn-primary" onClick={()=>flash&&flash('Launching '+t.name)} style={{background:c.color}}>
            {t.launch==='external'?<Icon name="external" size={16}/>:<Icon name="arrow_right" size={16}/>}Open {t.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ToolsPage, TOOLS, TOOL_CATS });
