// search.jsx — search results page (faceted)

const RESULT_TYPES = [
  {id:'all', label:'All', n:1755},
  {id:'documents', label:'Documents', n:346, icon:'file'},
  {id:'images', label:'Images', n:259, icon:'image'},
  {id:'videos', label:'Videos', n:222, icon:'video'},
  {id:'emails', label:'Emails', n:97, icon:'mail'},
  {id:'audio', label:'Audio', n:136, icon:'audio'},
  {id:'code', label:'Code', n:323, icon:'code'},
  {id:'other', label:'Other', n:372, icon:'files'},
];
const SEARCH_FOLDERS = [
  {n:'Finance', c:'#16A34A', count:5643}, {n:'Legal', c:'#DC2626', count:6824},
  {n:'HR', c:'#475569', count:1779}, {n:'Engineering', c:'#0073E6', count:1736},
  {n:'Marketing', c:'#B5851C', count:1797}, {n:'Operations', c:'#0073E6', count:1807},
  {n:'Strategy', c:'#0EA5E9', count:2895}, {n:'Compliance', c:'#16A34A', count:2992},
];
const SEARCH_FILETYPES = [
  {n:'PDF', count:1284}, {n:'Word', count:842}, {n:'MP4', count:429}, {n:'PNG', count:427},
  {n:'Figma', count:412}, {n:'Keynote', count:318}, {n:'SRT', count:124}, {n:'Email', count:97},
];
const MATCH = {
  tag:    {icon:'sparkle', color:'#475569', label:'tag match'},
  sender: {icon:'mail',    color:'#16A34A', label:'sender match'},
  keyword:{icon:'search',  color:'#0073E6', label:'keyword match in content'},
  ocr:    {icon:'eye',     color:'#B5851C', label:'OCR text match'},
  title:  {icon:'file',    color:'#0EA5E9', label:'title match'},
};
const TYPE_ICON = {documents:'file', images:'image', videos:'video', emails:'mail', audio:'audio', code:'code', other:'files'};
const RESULTS = [
  {id:1, type:'documents', path:['Network Share','Projects','2024','Chen'], title:'Finance Report 2024 Q3.pdf', snippet:'…proposed Q3 reforecast reduces opex by ~4.2% under the revised vendor terms agreed in production planning…', who:'tyler', time:'2h ago', size:'3.6 MB', match:'tag', tag:'contracts', alsoIn:'Unreviewed Contracts'},
  {id:2, type:'videos', path:['Google Drive','Finance','2024','Vasquez'], title:'Finance Report 2024 Q4.mov', snippet:'…total invoiced: $142,500.00 — payment due within 30 days. Reference: INV-2024-0891…', who:'maya', time:'5h ago', size:'422 MB', match:'sender'},
  {id:3, type:'images', path:['OneDrive','Projects','2025','Nair'], title:'Finance Budget Forecast FY2025.png', snippet:'…annotated budget allocation across the seven cost centers with quarterly burn projections…', who:'priya', time:'1d ago', size:'4.3 MB', dims:'3670×2904', match:'keyword'},
  {id:4, type:'documents', path:['Local Drive','Finance','Current','Nair'], title:'Finance Report 2022 Q4.docx', snippet:'…market analysis indicates strong SMB demand. Recommended pricing adjustment of 12% for Q1…', who:'priya', time:'2d ago', size:'1.0 MB', match:'ocr'},
  {id:5, type:'emails', path:['Outlook','Inbox','Finance'], title:'RE: Q3 Close — final numbers', snippet:'…attaching the reconciled ledger. Flagging two line items for legal review before we file…', who:'sam', time:'3d ago', size:'88 KB', match:'sender'},
  {id:6, type:'documents', path:['Network Share','Strategy','2024'], title:'Finance Strategy Deck.key', snippet:'…three-year revenue model assumes 18% net retention and a blended CAC payback of 11 months…', who:'lena', time:'4d ago', size:'24 MB', match:'keyword'},
  {id:7, type:'code', path:['GitHub','imin','reports'], title:'finance_export.py', snippet:'…def reconcile_ledger(entries): # normalize currency and flag variance > threshold…', who:'noah', time:'4d ago', size:'12 KB', match:'keyword'},
  {id:8, type:'images', path:['Frame.io','Brand','Finance'], title:'Q3 Earnings Infographic.png', snippet:'…OCR extracted: “Revenue up 23% YoY · Gross margin 71% · Free cash flow positive”…', who:'diego', time:'5d ago', size:'6.1 MB', dims:'2400×1600', match:'ocr'},
  {id:9, type:'audio', path:['Dropbox','Recordings','Finance'], title:'Q3 Investor Call.m4a', snippet:'…transcript: “…we expect the finance team to close the quarter ahead of guidance…”', who:'sam', time:'1w ago', size:'58 MB', match:'keyword'},
];

function SearchResults({query, setPage, onSearch}){
  const [tab,setTab]=React.useState('all');
  const [view,setView]=React.useState('list');
  const [bulk,setBulk]=React.useState(false);
  const [folders,setFolders]=React.useState([]);
  const [ftypes,setFtypes]=React.useState([]);
  const [range,setRange]=React.useState(null);
  const [filterQ,setFilterQ]=React.useState('');
  const [dismissed,setDismissed]=React.useState([]);
  const [preview,setPreview]=React.useState(null);
  const [overview,setOverview]=React.useState(false);
  const [analyzing,setAnalyzing]=React.useState(false);
  const q = query || 'finance';

  function toggleOverview(){
    if(overview){ setOverview(false); return; }
    setOverview(true); setAnalyzing(true);
    clearTimeout(window.__ovT); window.__ovT=setTimeout(()=>setAnalyzing(false), 950);
  }

  const dirty = folders.length||ftypes.length||range;
  const base = 1755;
  const count = dirty ? Math.max(28, Math.round(base * Math.pow(0.62, folders.length+ftypes.length+(range?1:0)))) : base;

  let list = RESULTS.filter(r=>!dismissed.includes(r.id));
  if(tab!=='all') list = list.filter(r=>r.type===tab);

  function toggle(arr,set,v){ set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]); }
  function clearAll(){ setFolders([]); setFtypes([]); setRange(null); }
  function viewAll(){ clearAll(); setTab('all'); window.scrollTo({top:0,behavior:'smooth'}); }

  return (
    <div className="rise" style={{display:'flex',alignItems:'flex-start',gap:0,maxWidth:1480,margin:'0 auto'}}>
      {/* Filters sidebar */}
      <aside style={{width:280,flex:'none',borderRight:'1px solid var(--line)',background:'rgba(255,255,255,.55)',
        position:'sticky',top:'var(--header-h)',height:'calc(100vh - var(--header-h))',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'18px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:17,fontWeight:700,letterSpacing:'-.02em'}}>Filters</span>
          {dirty ? <span className="linkish" style={{fontSize:12.5}} onClick={clearAll}>Clear all</span> : null}
        </div>
        <div style={{padding:'0 20px 12px'}}>
          <button className="btn btn-secondary" onClick={toggleOverview}
            style={{width:'100%', ...(overview?{background:'#F1F5F9',borderColor:'#475569',color:'#475569'}:{})}}>
            <Icon name="sparkle" size={15} style={{color:'#475569'}}/>Understand these results
          </button>
        </div>
        <div style={{padding:'0 20px 14px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,height:34,padding:'0 11px',border:'1px solid var(--line-2)',background:'#fff',borderRadius:8}}>
            <Icon name="search" size={15} style={{color:'var(--ink-3)'}}/>
            <input value={filterQ} onChange={e=>setFilterQ(e.target.value)} placeholder="Search filters…" style={{flex:1,border:0,outline:'none',fontSize:13,fontFamily:'inherit',background:'transparent'}}/>
          </div>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'0 20px 16px'}}>
          <FacetSection title="Date range" icon="calendar">
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
              {['Today','7 days','30 days','90 days','This year'].map(r=>(
                <button key={r} className={'chip'+(range===r?' on':'')} onClick={()=>setRange(range===r?null:r)} style={{height:28,fontSize:12}}>{r}</button>
              ))}
            </div>
          </FacetSection>
          <FacetSection title="Folders">
            {SEARCH_FOLDERS.filter(f=>f.n.toLowerCase().includes(filterQ.toLowerCase())).map(f=>(
              <FacetRow key={f.n} checked={folders.includes(f.n)} onClick={()=>toggle(folders,setFolders,f.n)}
                dot={f.c} label={f.n} count={f.count}/>
            ))}
          </FacetSection>
          <FacetSection title="File type">
            {SEARCH_FILETYPES.filter(f=>f.n.toLowerCase().includes(filterQ.toLowerCase())).map(f=>(
              <FacetRow key={f.n} checked={ftypes.includes(f.n)} onClick={()=>toggle(ftypes,setFtypes,f.n)}
                label={f.n} count={f.count}/>
            ))}
          </FacetSection>
        </div>

        <div style={{padding:'14px 20px',borderTop:'1px solid var(--line)',background:'rgba(255,255,255,.7)'}}>
          <button className="btn btn-primary" disabled={!dirty}
            onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
            style={{width:'100%',opacity:dirty?1:.55,pointerEvents:dirty?'auto':'none'}}>
            {dirty ? `Apply · ${count.toLocaleString()} results` : 'No changes'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1,minWidth:0,padding:'18px 24px 80px'}}>
        {/* query bar */}
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
          <div className="card" style={{flex:1,display:'flex',alignItems:'center',gap:10,padding:'8px 12px',boxShadow:'var(--shadow-sm)'}}>
            <Icon name="search" size={18} style={{color:'var(--ink-3)',flex:'none'}}/>
            <span className="badge" style={{background:'var(--primary-tint)',color:'var(--primary)',height:26,gap:7,fontSize:12.5}}>
              {q}<Icon name="x" size={13} style={{cursor:'pointer',opacity:.7}} onClick={()=>setPage('explore')}/>
            </span>
            <div style={{display:'flex',gap:2,background:'#F2F5F9',padding:2,borderRadius:7}}>
              {['AND','OR','NOT'].map((o,i)=>(
                <span key={o} style={{fontSize:11,fontWeight:600,padding:'3px 8px',borderRadius:5,cursor:'pointer',
                  color:i===0?'var(--primary)':'var(--ink-3)',background:i===0?'#fff':'transparent',boxShadow:i===0?'var(--shadow-sm)':'none'}}>{o}</span>
              ))}
            </div>
            <input placeholder="Add another term…" style={{flex:1,border:0,outline:'none',fontSize:13.5,fontFamily:'inherit',background:'transparent'}}/>
          </div>
        </div>

        {/* type tabs */}
        <div style={{display:'flex',gap:4,borderBottom:'1px solid var(--line)',marginBottom:14,overflowX:'auto'}}>
          {RESULT_TYPES.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{border:0,background:'transparent',padding:'10px 12px',cursor:'pointer',
              fontSize:13,fontWeight:tab===t.id?600:500,color:tab===t.id?'var(--blue)':'var(--ink-3)',position:'relative',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:7}}>
              {t.label}<span style={{fontSize:11.5,fontWeight:600,color:tab===t.id?'var(--blue)':'var(--ink-4)'}}>{t.n.toLocaleString()}</span>
              {tab===t.id && <span style={{position:'absolute',left:8,right:8,bottom:-1,height:2,background:'var(--blue)',borderRadius:2}}></span>}
            </button>
          ))}
        </div>

        {/* toolbar */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:8}}>
            <span style={{fontSize:17,fontWeight:700,letterSpacing:'-.02em'}}>{count.toLocaleString()}</span>
            <span className="muted" style={{fontSize:13}}>results</span>
          </div>
          <div style={{flex:1}}></div>
          {/* skip-faceting CTA */}
          <button className="btn btn-primary btn-sm" onClick={viewAll} title="Skip filters and browse everything">
            View all results<Icon name="arrow_right" size={14}/>
          </button>
          <div style={{width:1,height:22,background:'var(--line-2)'}}></div>
          <button className="btn btn-secondary btn-sm">Relevance<Icon name="chevron_down" size={13}/></button>
          <div style={{display:'flex',gap:2,background:'#EEF1F6',padding:3,borderRadius:8}}>
            {[['list','list'],['grid','grid']].map(([m,ic])=>(
              <button key={m} onClick={()=>setView(m)} className="btn-icon" style={{width:28,height:26,border:0,borderRadius:6,cursor:'pointer',
                background:view===m?'#fff':'transparent',color:view===m?'var(--ink)':'var(--ink-3)',boxShadow:view===m?'var(--shadow-sm)':'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name={ic} size={15}/></button>
            ))}
          </div>
          <button className={'btn btn-sm '+(bulk?'btn-primary':'btn-secondary')} onClick={()=>setBulk(b=>!b)}><Icon name="check_square" size={14}/>Bulk</button>
          <button className="btn btn-secondary btn-sm"><Icon name="bookmark" size={14}/>Save</button>
        </div>

        {/* AI overview */}
        {overview && <SearchOverview q={q} count={count} analyzing={analyzing}
          onClose={()=>setOverview(false)} onOpen={setPreview} onAsk={()=>window.__openAskAI&&window.__openAskAI()}/>}

        {/* results */}
        {view==='list' ? (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {list.map(r=><ResultCard key={r.id} r={r} q={q} bulk={bulk} onDismiss={()=>setDismissed(d=>[...d,r.id])} onOpen={()=>setPreview(r)}/>)}
            {!list.length && <div className="card" style={{padding:'40px',textAlign:'center',color:'var(--ink-3)'}}>No results in this category.</div>}
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
            {list.map(r=><ResultGridCard key={r.id} r={r} onOpen={()=>setPreview(r)}/>)}
          </div>
        )}
      </main>
      {preview && <SearchPreview item={preview} q={q} onClose={()=>setPreview(null)} onDismiss={()=>{setDismissed(d=>[...d,preview.id]);setPreview(null);}}/>}
    </div>
  );
}

function FacetSection({title, icon, children}){
  const [open,setOpen]=React.useState(true);
  return (
    <div style={{borderTop:'1px solid var(--line)',padding:'14px 0 4px'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',border:0,background:'transparent',cursor:'pointer',padding:0,marginBottom:open?12:0}}>
        <span style={{display:'flex',alignItems:'center',gap:7,fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--ink-3)'}}>
          {icon && <Icon name={icon} size={13}/>}{title}
        </span>
        <Icon name="chevron_down" size={15} style={{color:'var(--ink-4)',transform:open?'none':'rotate(-90deg)',transition:'.15s'}}/>
      </button>
      {open && <div style={{display:'flex',flexDirection:'column',gap:2,paddingBottom:8}}>{children}</div>}
    </div>
  );
}
function FacetRow({checked, onClick, dot, label, count}){
  return (
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:9,width:'100%',border:0,background:'transparent',cursor:'pointer',
      padding:'6px 8px',borderRadius:7,textAlign:'left',transition:'.12s'}}
      onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{width:16,height:16,borderRadius:5,border:'1.5px solid',borderColor:checked?'var(--primary)':'var(--line-2)',background:checked?'var(--primary)':'#fff',
        display:'flex',alignItems:'center',justifyContent:'center',flex:'none',transition:'.12s'}}>{checked && <Icon name="check" size={11} sw={3} style={{color:'#fff'}}/>}</span>
      {dot && <span style={{width:8,height:8,borderRadius:'50%',background:dot,flex:'none'}}></span>}
      <span style={{flex:1,fontSize:13,color:'var(--ink)',fontWeight:500}}>{label}</span>
      <span className="muted" style={{fontSize:11.5,fontVariantNumeric:'tabular-nums'}}>{count.toLocaleString()}</span>
    </button>
  );
}

function ResultCard({r, q, bulk, onDismiss, onOpen}){
  const m=MATCH[r.match];
  return (
    <div className="card card-hover" style={{padding:'16px 18px'}}>
      <div style={{display:'flex',gap:14}}>
        {bulk && <span style={{width:18,height:18,borderRadius:5,border:'1.5px solid var(--line-2)',flex:'none',marginTop:2}}></span>}
        <span onClick={onOpen} style={{width:44,height:44,borderRadius:10,background:'var(--surface-2)',border:'1px solid var(--line)',color:'var(--ink-3)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',cursor:'pointer'}}>
          <Icon name={TYPE_ICON[r.type]||'file'} size={20}/></span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--ink-4)',fontWeight:500,marginBottom:3}}>
            {r.path.map((p,i)=>(<React.Fragment key={i}>{i>0 && <Icon name="chevron_right" size={11} style={{opacity:.6}}/>}<span>{p}</span></React.Fragment>))}
          </div>
          <div className="rtitle" onClick={onOpen} style={{fontSize:15,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',display:'inline-block'}}>{hl(r.title,q)}</div>
          <div className="sec" style={{fontSize:13,margin:'5px 0 9px',lineHeight:1.5}}>{hl(r.snippet,q)}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,fontSize:12,color:'var(--ink-3)',flexWrap:'wrap'}}>
            <span style={{display:'flex',alignItems:'center',gap:6}}><Avatar id={r.who} size={18}/>{PEOPLE[r.who]?PEOPLE[r.who].name.split(' ')[0]:'—'}</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{r.time}
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{r.size}
            {r.dims && <><span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{r.dims}</>}
            <span style={{display:'flex',alignItems:'center',gap:5,color:m.color,fontWeight:550,whiteSpace:'nowrap'}}><Icon name={m.icon} size={13}/>{m.label}{r.tag?`: ${r.tag}`:''}</span>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'flex-start',gap:4,flex:'none',opacity:.85}}>
          <button className="btn btn-ghost btn-icon btn-sm" title="Accept"><Icon name="check" size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" title="Dismiss" onClick={onDismiss}><Icon name="x" size={15}/></button>
          <button className="btn btn-ghost btn-icon btn-sm" title="Flag"><Icon name="flag" size={15}/></button>
        </div>
      </div>
    </div>
  );
}
function ResultGridCard({r, onOpen}){
  const m=MATCH[r.match];
  return (
    <div className="card card-hover" onClick={onOpen} style={{padding:14,display:'flex',flexDirection:'column',gap:10,cursor:'pointer'}}>
      <div style={{height:100,borderRadius:9,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-4)'}}>
        <Icon name={TYPE_ICON[r.type]||'file'} size={30}/></div>
      <div style={{fontSize:12,color:'var(--ink-4)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.path.join(' › ')}</div>
      <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:11.5,color:'var(--ink-3)'}}>
        <span style={{display:'flex',alignItems:'center',gap:5,color:m.color,fontWeight:550}}><Icon name={m.icon} size={12}/>{m.label.split(' ')[0]}</span>
        <span>{r.size}</span>
      </div>
    </div>
  );
}
function hl(text, q){
  if(!q) return text;
  const i=text.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return text;
  return <>{text.slice(0,i)}<mark style={{background:'rgba(45,178,243,.2)',color:'inherit',borderRadius:3,padding:'0 2px'}}>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
}

function SearchPreview({item, q, onClose, onDismiss}){
  const m=MATCH[item.match];
  React.useEffect(()=>{const esc=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[]);
  return (
    <div style={{position:'fixed',inset:0,zIndex:200}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(36,39,45,.28)',backdropFilter:'blur(1px)',animation:'fade .2s'}}></div>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'min(540px,94vw)',background:'#fff',boxShadow:'-20px 0 60px rgba(29,53,87,.18)',animation:'slidein .26s cubic-bezier(.2,.8,.3,1)',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'16px 22px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--ink-4)',fontWeight:500,minWidth:0}}>
            {item.path.map((p,i)=>(<React.Fragment key={i}>{i>0 && <Icon name="chevron_right" size={11} style={{opacity:.6,flex:'none'}}/>}<span style={{whiteSpace:'nowrap'}}>{p}</span></React.Fragment>))}
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} title="Close" style={{flex:'none'}}><Icon name="x" size={17}/></button>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          <div style={{padding:'22px 22px 18px'}}>
            <div style={{height:200,borderRadius:12,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,color:'var(--ink-4)'}}>
              <Icon name={TYPE_ICON[item.type]||'file'} size={44}/>
              <span style={{fontSize:12,fontWeight:500}}>{item.dims||item.size} · {item.type}</span>
            </div>
            <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:'18px 0 0',color:'var(--ink)',lineHeight:1.3}}>{hl(item.title,q)}</h2>
            <div style={{display:'flex',alignItems:'center',gap:10,fontSize:12.5,color:'var(--ink-3)',margin:'10px 0 0',flexWrap:'wrap'}}>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Avatar id={item.who} size={20}/>{PEOPLE[item.who]?PEOPLE[item.who].name:'—'}</span>
              <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{item.time}
              <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{item.size}
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:12,padding:'5px 10px',borderRadius:8,background:m.color+'14',color:m.color,fontSize:12.5,fontWeight:600}}>
              <Icon name={m.icon} size={14}/>{m.label}{item.tag?`: ${item.tag}`:''}
            </div>
          </div>
          <div style={{padding:'0 22px 22px'}}>
            <div className="eyebrow" style={{marginBottom:8}}>Matched excerpt</div>
            <div style={{fontSize:13.5,lineHeight:1.65,color:'var(--ink-2)',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:'14px 16px'}}>{hl(item.snippet,q)}</div>
            <div className="eyebrow" style={{margin:'20px 0 10px'}}>Details</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 16px'}}>
              {[['Location',item.path.join(' / ')],['Type',item.type],['Size',item.size],['Dimensions',item.dims||'—'],['Owner',PEOPLE[item.who]?PEOPLE[item.who].name:'—'],['Modified',item.time]].map(([k,v])=>(
                <div key={k}><div className="muted" style={{fontSize:11,marginBottom:2}}>{k}</div><div style={{fontSize:13,color:'var(--ink)',fontWeight:500,wordBreak:'break-word'}}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:'13px 22px',borderTop:'1px solid var(--line)',display:'flex',gap:9,background:'var(--surface-2)'}}>
          <button className="btn btn-primary" style={{flex:1}}><Icon name="external" size={15}/>View File</button>
          <button className="btn btn-secondary btn-icon" title="Accept"><Icon name="check" size={16}/></button>
          <button className="btn btn-secondary btn-icon" title="Dismiss" onClick={onDismiss}><Icon name="x" size={16}/></button>
          <button className="btn btn-secondary btn-icon" title="Flag"><Icon name="flag" size={16}/></button>
        </div>
      </div>
    </div>
  );
}

// ---- AI overview of the result set ----
const OV_THEMES = [
  {label:'Quarterly close & reporting', prop:.366, color:'#0073E6', note:'Q3/Q4 reforecasts, ledgers & close packets'},
  {label:'Budget & forecasting',        prop:.238, color:'#0EA5E9', note:'FY budget models, burn & pricing analysis'},
  {label:'Invoices & payments',         prop:.163, color:'#B5851C', note:'AP/AR records, terms & reconciliations'},
  {label:'Investor & earnings comms',   prop:.143, color:'#475569', note:'Call transcripts, decks & infographics'},
  {label:'Compliance & legal flags',    prop:.090, color:'#DC2626', note:'Items routed for review before filing'},
];
const OV_NOTABLE = [1, 5, 6]; // result ids

function OvBar({color, pct}){
  return (
    <div style={{height:5,borderRadius:3,background:'var(--line)',overflow:'hidden',flex:1}}>
      <div style={{width:pct+'%',height:'100%',background:color,borderRadius:3,transition:'width .5s cubic-bezier(.2,.8,.3,1)'}}></div>
    </div>
  );
}
function OvShimmer({w}){
  return (
    <div style={{position:'relative',overflow:'hidden',height:11,width:w,borderRadius:5,background:'var(--surface-2)'}}>
      <div className="prog-sheen"></div>
    </div>
  );
}

function SearchOverview({q, count, analyzing, onClose, onOpen, onAsk}){
  const themes = OV_THEMES.map(t=>({...t, n: Math.max(1, Math.round(count*t.prop))}));
  const max = themes[0].n;
  const notable = OV_NOTABLE.map(id=>RESULTS.find(r=>r.id===id)).filter(Boolean);

  return (
    <div className="card" style={{padding:0,overflow:'hidden',marginBottom:16,border:'1px solid var(--violet)',
      boxShadow:'0 6px 24px rgba(138,99,196,.13)',position:'relative'}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'var(--logo-grad)'}}></div>

      {/* header */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'15px 18px 14px',borderBottom:'1px solid var(--line)'}}>
        <span style={{width:34,height:34,borderRadius:9,background:'var(--logo-grad)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',
          boxShadow:'0 2px 8px rgba(138,99,196,.3)'}}>
          <Icon name="sparkle" size={18} style={{color:'#fff'}}/>
        </span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:14.5,fontWeight:700,letterSpacing:'-.01em',color:'var(--ink)'}}>AI overview</span>
            <span className="badge" style={{background:'var(--violet-t)',color:'var(--violet)',height:18,fontSize:10,fontWeight:700,letterSpacing:'.04em'}}>BETA</span>
          </div>
          <div className="muted" style={{fontSize:12,marginTop:1}}>
            {analyzing ? <span style={{animation:'blink 1.1s ease-in-out infinite'}}>Reading the top matches…</span>
              : <>Synthesized across <b style={{color:'var(--ink-2)',fontWeight:600}}>{count.toLocaleString()}</b> results for &ldquo;{q}&rdquo;</>}
          </div>
        </div>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} title="Hide overview" style={{flex:'none'}}><Icon name="x" size={16}/></button>
      </div>

      {analyzing ? (
        <div style={{padding:'18px',display:'flex',flexDirection:'column',gap:11}}>
          <OvShimmer w="92%"/><OvShimmer w="98%"/><OvShimmer w="74%"/>
          <div style={{display:'flex',gap:8,marginTop:6}}><OvShimmer w={120}/><OvShimmer w={92}/><OvShimmer w={138}/></div>
        </div>
      ) : (
        <div style={{padding:'17px 18px 16px'}}>
          {/* summary */}
          <p style={{fontSize:13.5,lineHeight:1.6,color:'var(--ink-2)',margin:0,textWrap:'pretty'}}>
            Most material clusters around <b style={{color:'var(--ink)',fontWeight:600}}>quarterly financial reporting and forecasting</b>. The
            strongest matches are Q3/Q4 close documents and budget models; a reconciled ledger and two flagged line items are routed for
            <b style={{color:'var(--ink)',fontWeight:600}}> legal review before filing</b>. Coverage spans 7 file types and 6 contributors,
            concentrated in the <b style={{color:'var(--ink)',fontWeight:600}}>Finance</b> and <b style={{color:'var(--ink)',fontWeight:600}}>Strategy</b> folders.
          </p>

          {/* themes */}
          <div className="eyebrow" style={{margin:'18px 0 11px'}}>Key themes</div>
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            {themes.map(t=>(
              <div key={t.label} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:t.color,flex:'none'}}></span>
                <div style={{width:208,flex:'none',minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.label}</div>
                  <div className="muted" style={{fontSize:11,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.note}</div>
                </div>
                <OvBar color={t.color} pct={Math.round(t.n/max*100)}/>
                <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink-2)',width:48,textAlign:'right',flex:'none',fontVariantNumeric:'tabular-nums'}}>{t.n.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* needs attention */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:16,padding:'10px 13px',borderRadius:9,
            background:'var(--orange-t)',border:'1px solid #F4D9B8'}}>
            <Icon name="flag" size={15} style={{color:'#C2410C',flex:'none'}}/>
            <span style={{fontSize:12.5,color:'#9A3412',fontWeight:550,lineHeight:1.4}}>
              <b style={{fontWeight:700}}>2 items</b> flag line items for legal review before the quarter can be filed.
            </span>
          </div>

          {/* notable */}
          <div className="eyebrow" style={{margin:'18px 0 9px'}}>Notable in these results</div>
          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            {notable.map(r=>{
              const m=MATCH[r.match];
              return (
                <button key={r.id} onClick={()=>onOpen&&onOpen(r)} style={{display:'flex',alignItems:'center',gap:12,width:'100%',textAlign:'left',
                  border:0,background:'transparent',borderRadius:9,padding:'9px 8px',cursor:'pointer',transition:'.12s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{width:30,height:30,borderRadius:8,background:'var(--surface-2)',border:'1px solid var(--line)',color:'var(--ink-3)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={TYPE_ICON[r.type]||'file'} size={15}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
                    <div className="muted" style={{fontSize:11.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.snippet.replace(/^…|…$/g,'')}</div>
                  </div>
                  <span style={{display:'flex',alignItems:'center',gap:5,color:m.color,fontWeight:600,fontSize:11.5,flex:'none',whiteSpace:'nowrap'}}><Icon name={m.icon} size={12}/>{m.label.split(' ')[0]}</span>
                  <Icon name="chevron_right" size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
                </button>
              );
            })}
          </div>

          {/* footer */}
          <div style={{display:'flex',alignItems:'center',gap:12,marginTop:15,paddingTop:13,borderTop:'1px solid var(--line)',flexWrap:'wrap'}}>
            <span className="muted" style={{fontSize:11.5,display:'flex',alignItems:'center',gap:6,flex:1,minWidth:160}}>
              <Icon name="sparkle" size={12} style={{color:'var(--violet)'}}/>Synthesized from the top 50 matches · AI can be imprecise
            </span>
            <button className="btn btn-secondary btn-sm" onClick={onAsk}><Icon name="sparkle" size={13} style={{color:'var(--violet)'}}/>Ask a follow-up</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SearchResults });
