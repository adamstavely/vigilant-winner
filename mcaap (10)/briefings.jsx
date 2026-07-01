// briefings.jsx — Briefing Books workspace: build, distribute, track & gather feedback

const B_SERIF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const B_KIND = {
  memo:    {label:'Memo',     icon:'route',  color:'#475569'},
  report:  {label:'Report',   icon:'file',   color:'#0073E6'},
  imagery: {label:'Imagery',  icon:'image',  color:'#16A34A'},
  map:     {label:'Map',      icon:'globe',  color:'#0073E6'},
  assess:  {label:'Assessment',icon:'chart', color:'#B5851C'},
  tab:     {label:'Tab',      icon:'bookmark',color:'#0EA5E9'},
};
const B_STATUS = {
  draft:{label:'Draft', color:'#B5851C', tint:'#F8EFD9'},
  final:{label:'Final', color:'#16A34A', tint:'#F0FDF4'},
  dist: {label:'Distributed', color:'#0073E6', tint:'#EBF4FF'},
};
// receiver feedback verdict
const B_VERDICT = {
  useful:   {label:'Highly useful',    color:'#16A34A', tint:'#F0FDF4'},
  partial:  {label:'Partially useful', color:'#B5851C', tint:'#F8EFD9'},
  followup: {label:'Needs follow‑up',  color:'#C2410C', tint:'#FBE7DD'},
};
let _bsid=1; const bs=(kind,title,src)=>({id:'s'+(_bsid++),kind,title,src,pages:kind==='imagery'?2:kind==='map'?1:kind==='assess'?4:3});
let _secid=1; const mkSec=(name)=>({id:'sec'+(_secid++), type:'section', name:name||'New section'});

const BOOKS = [
  // ---------- in the build queue ----------
  {id:'bk1', title:"Principal's Morning Book", sub:'June 6, 2026 · 0600', status:'draft', cover:'#1D3557', recipient:"Director's Office", contributors:['maya','tyler','noah'],
    sections:[ bs('tab','Cover & Table of Contents','tyler'), mkSec('Part I — Overnight'), bs('memo','Overnight Highlights','maya'), bs('report','Eastern Sector — Situation','noah'), mkSec('Part II — Imagery & Analysis'), bs('imagery','Harbor Imagery Pack','diego'), bs('assess','Throughput Assessment','priya') ]},
  {id:'bk2', title:'Weekly Regional Roundup', sub:'Week 23 · Jun 1–5', status:'final', cover:'#16A34A', recipient:'Regional Desk Chief', contributors:['priya','sam'],
    sections:[ bs('tab','Cover','sam'), bs('report','Regional Summary','priya'), bs('map','Activity Heat Map','noah'), bs('assess','Outlook','priya') ]},
  {id:'bk3', title:'Coordination Pre-Read', sub:'Interagency Sync · Jun 6', status:'draft', cover:'#475569', recipient:'Interagency Working Group', contributors:['noah','tyler'],
    sections:[ bs('tab','Agenda','noah'), bs('memo','Coordination Points','noah'), bs('report','Deconfliction Notes','tyler') ]},
  {id:'bk6', title:'Quarterly Posture Review', sub:'Q2 2026', status:'draft', cover:'#1D3557', recipient:'Oversight Board', contributors:['tyler','priya','sam'],
    sections:[ bs('tab','Cover','tyler'), bs('assess','Posture Assessment','priya'), bs('report','Collection Summary','sam') ]},

  // ---------- distributed — tracked in history, feedback received ----------
  {id:'bk4', title:'Leadership Decision Folder', sub:'Asset Reallocation · Jun 4', status:'dist', cover:'#DC2626', recipient:'Leadership Council', contributors:['sam','lena'], distributed:'Jun 4 · 0815',
    sections:[ bs('tab','Cover','sam'), bs('memo','Decision Memo','sam'), bs('assess','Risk Assessment','lena'), bs('map','Coverage Map','noah') ],
    feedback:{who:'Dir. K. Alvarez', role:'Leadership Council', date:'Jun 4 · 1430', rating:4, verdict:'useful',
      summary:'Clear and decision‑ready. The risk assessment was exactly what the council needed to move. Tighten the recommendation up front next time.',
      notes:[ {src:'sam', section:'Decision Memo', note:'Lead with the recommendation — I had to hunt for it on page 2.'}, {src:'lena', section:'Risk Assessment', note:'Excellent — you flagged the supply exposure we had missed.'} ],
      shared:true, acks:['sam','lena']}},
  {id:'bk7', title:"Principal's Morning Book", sub:'June 5, 2026 · 0600', status:'dist', cover:'#1D3557', recipient:"Director's Office", contributors:['maya','tyler','noah'], distributed:'Jun 5 · 0602',
    sections:[ bs('tab','Cover','tyler'), bs('memo','Overnight Highlights','maya'), bs('report','Eastern Sector','noah'), bs('assess','Throughput','priya') ],
    feedback:{who:'Dir. K. Alvarez', role:"Director's Office", date:'Jun 5 · 0915', rating:5, verdict:'useful',
      summary:'Best morning book this rotation. Overnight section was crisp and the imagery told the story without narration.',
      notes:[ {src:'maya', section:'Overnight Highlights', note:'Perfect length. Keep this format.'} ],
      shared:true, acks:['maya','tyler','noah']}},
  {id:'bk8', title:'Daily Operations SITREP', sub:'June 5, 2026 · 1800', status:'dist', cover:'#2A6FDB', recipient:'Operations Center', contributors:['tyler','aria'], distributed:'Jun 5 · 1812',
    sections:[ bs('tab','Cover','tyler'), bs('report','Day Summary','tyler'), bs('map','Activity Map','noah') ],
    feedback:{who:'Watch Officer R. Doss', role:'Operations Center', date:'Jun 5 · 2105', rating:3, verdict:'partial',
      summary:'Useful for handover but the activity map was a day stale. Need same‑day geotags for the evening edition.',
      notes:[ {src:'noah', section:'Activity Map', note:'Map data was 24h old — refresh before the 1800 cut.'} ],
      shared:false, acks:[]}},
  {id:'bk9', title:'Coordination Pre-Read', sub:'Interagency Sync · Jun 4', status:'dist', cover:'#475569', recipient:'Interagency Working Group', contributors:['noah','tyler'], distributed:'Jun 4 · 1600',
    sections:[ bs('tab','Agenda','noah'), bs('memo','Coordination Points','noah') ],
    feedback:null},
  {id:'bk10', title:'Weekly Regional Roundup', sub:'Week 22 · May 25–29', status:'dist', cover:'#16A34A', recipient:'Regional Desk Chief', contributors:['priya','sam'], distributed:'May 29 · 1700',
    sections:[ bs('tab','Cover','sam'), bs('report','Regional Summary','priya'), bs('assess','Outlook','priya') ],
    feedback:{who:'Chief M. Ortega', role:'Regional Desk', date:'May 30 · 1010', rating:4, verdict:'followup',
      summary:'Solid roundup. Outlook section raised a question on the southern corridor — please follow up with a focused note.',
      notes:[ {src:'priya', section:'Outlook', note:'Expand the southern corridor call — chief wants a standalone follow‑up.'} ],
      shared:true, acks:['priya']}},
  {id:'bk5', title:'Field Team Onboarding Book', sub:'Rotation 4 · Jun 2', status:'dist', cover:'#B5851C', recipient:'Incoming Field Rotation', contributors:['maya'], distributed:'Jun 2 · 0900',
    sections:[ bs('tab','Welcome','maya'), bs('report','Standing Requirements','maya'), bs('report','Reporting Procedures','tyler') ],
    feedback:null},
];

const B_LIBRARY = [
  {kind:'memo', title:'Quarterly Assessment — Port Throughput', src:'maya', meta:'M-3041 · CUI'},
  {kind:'report', title:'Convoy Movement — Sector F4', src:'noah', meta:'Updated 2h ago'},
  {kind:'imagery', title:'UAV ISR Pass — Northern Terminal', src:'diego', meta:'14 frames'},
  {kind:'map', title:'Eastern Sector Activity — Heat Map', src:'noah', meta:'Geotagged · 42 pts'},
  {kind:'assess', title:'Infrastructure Resilience — Southern Grid', src:'priya', meta:'Confidence: moderate'},
  {kind:'memo', title:'Coordination Cable — Weekly', src:'sam', meta:'Cable · CUI'},
  {kind:'report', title:'Checkpoint Report — District 7', src:'priya', meta:'Field report'},
  {kind:'imagery', title:'Thermal Capture — Depot', src:'diego', meta:'3 frames'},
  {kind:'assess', title:'Signal Activity — Coastal', src:'diego', meta:'SECRET'},
  {kind:'report', title:'Market Sentiment — Regional', src:'maya', meta:'Field note'},
];

// ---- small star rating control ----
function Stars({value=0, size=15, onSet}){
  return (
    <span style={{display:'inline-flex',gap:2,color:'#E0A12E'}}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} type="button" onClick={onSet?()=>onSet(n):undefined}
          style={{border:0,background:'transparent',padding:0,display:'flex',cursor:onSet?'pointer':'default',color:'inherit'}}>
          <Icon name={n<=value?'star_fill':'star'} size={size} style={{opacity:n<=value?1:.4}}/>
        </button>
      ))}
    </span>
  );
}

function FbStat({value, label, icon, color}){
  return (
    <div className="card card-pad" style={{display:'flex',alignItems:'center',gap:12,padding:'13px 15px'}}>
      <span style={{width:34,height:34,borderRadius:9,background:(color||'#0073E6')+'1a',color:color||'#0073E6',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={17}/></span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:19,fontWeight:700,color:'var(--ink)',letterSpacing:'-.02em',lineHeight:1}}>{value}</div>
        <div className="muted" style={{fontSize:11,marginTop:3,fontWeight:500}}>{label}</div>
      </div>
    </div>
  );
}

function BriefingsWorkspace({setPage, flash}){
  const [openId,setOpenId]=React.useState(null);
  const [openTab,setOpenTab]=React.useState('contents');
  const [books,setBooks]=React.useState(BOOKS);
  const [view,setView]=React.useState('queue'); // queue | history
  const cur=books.find(b=>b.id===openId);
  function update(id,fn){ setBooks(arr=>arr.map(b=>b.id===id?fn(b):b)); }
  function open(id,tab){ setOpenId(id); setOpenTab(tab||'contents'); }

  if(cur) return <BookBuilder b={cur} tab={openTab} setTab={setOpenTab} onBack={()=>setOpenId(null)} update={update} flash={flash}/>;

  const queue=books.filter(b=>b.status!=='dist');
  const dist=books.filter(b=>b.status==='dist');
  const awaiting=dist.filter(b=>!b.feedback).length;
  const rated=dist.filter(b=>b.feedback);
  const avg=rated.length?(rated.reduce((a,b)=>a+b.feedback.rating,0)/rated.length):0;

  return (
    <div className="rise">
      <WsHeader name="Briefing Books" setPage={setPage}
        action={<button className="btn btn-primary" onClick={()=>flash&&flash('New briefing book created')}><Icon name="plus" size={16} sw={2.2}/>New book</button>}/>
      <div className="page" style={{paddingTop:22}}>
        {/* stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}} data-tour="brief-stats">
          <FbStat value={queue.length} label="In the build queue" icon="layers" color="#475569"/>
          <FbStat value={dist.length} label="Distributed (history)" icon="send" color="#0073E6"/>
          <FbStat value={awaiting} label="Awaiting feedback" icon="clock" color="#B5851C"/>
          <FbStat value={avg?avg.toFixed(1)+' / 5':'—'} label={`Avg. receiver rating · ${rated.length}`} icon="star" color="#16A34A"/>
        </div>

        {/* view switch */}
        <div style={{display:'flex',gap:4,marginBottom:18,background:'var(--surface-2)',padding:4,borderRadius:11,width:'fit-content',border:'1px solid var(--line)'}} data-tour="brief-views">
          {[['queue','Build queue',queue.length],['history','History & feedback',dist.length]].map(([id,label,n])=>(
            <button key={id} onClick={()=>setView(id)}
              style={{display:'flex',alignItems:'center',gap:8,height:34,padding:'0 16px',borderRadius:8,border:0,cursor:'pointer',
                fontSize:13,fontWeight:600,fontFamily:'inherit',
                background:view===id?'#fff':'transparent',color:view===id?'var(--ink)':'var(--ink-3)',
                boxShadow:view===id?'0 1px 2px rgba(29,53,87,.1)':'none'}}>
              {label}<span style={{fontSize:11,fontWeight:700,color:view===id?'var(--blue)':'var(--ink-4)'}}>{n}</span>
            </button>
          ))}
        </div>

        {view==='queue' ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,paddingBottom:40}} data-tour="brief-grid">
            {queue.map(b=>{
              const st=B_STATUS[b.status];
              const mats=b.sections.filter(s=>s.type!=='section');
              const pages=mats.reduce((a,s)=>a+s.pages,0);
              return (
                <div key={b.id} onClick={()=>open(b.id)} className="card card-hover" style={{padding:0,overflow:'hidden',cursor:'pointer',display:'flex'}}>
                  <div style={{width:64,flex:'none',background:b.cover,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Icon name="book" size={24} style={{color:'rgba(255,255,255,.92)'}}/>
                    <div style={{position:'absolute',left:0,top:0,bottom:0,width:5,background:'rgba(255,255,255,.18)'}}></div>
                  </div>
                  <div style={{flex:1,minWidth:0,padding:'16px 17px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'flex-start'}}>
                      <div className="muted" style={{fontSize:11.5,fontWeight:500}}>{b.sub}</div>
                      <span className="badge" style={{background:st.tint,color:st.color,height:19,flex:'none'}}>{st.label}</span>
                    </div>
                    <div style={{fontFamily:B_SERIF,fontSize:18,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',lineHeight:1.2,margin:'5px 0 0'}}>{b.title}</div>
                    <div className="muted" style={{fontSize:11.5,marginTop:6,display:'flex',alignItems:'center',gap:5}}><Icon name="send" size={12}/>For {b.recipient}</div>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginTop:11,paddingTop:11,borderTop:'1px solid var(--line)'}}>
                      <span style={{fontSize:11.5,color:'var(--ink-3)',fontWeight:500}}><b style={{color:'var(--ink-2)'}}>{mats.length}</b> items</span>
                      <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                      <span style={{fontSize:11.5,color:'var(--ink-3)',fontWeight:500}}><b style={{color:'var(--ink-2)'}}>{pages}</b> pages</span>
                      <div style={{flex:1}}></div>
                      <AvatarStack ids={b.contributors} size={22} max={3}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <HistoryTable books={dist} open={open}/>
        )}
      </div>
    </div>
  );
}

// ---- distributed-book history with feedback status ----
function HistoryTable({books, open}){
  const sorted=[...books];
  return (
    <div className="card" style={{padding:0,overflow:'hidden',marginBottom:40}}>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,2.4fr) 1.4fr 1fr 1.6fr 80px',gap:12,padding:'11px 18px',borderBottom:'1px solid var(--line)',background:'var(--surface-2)'}}>
        {['Briefing book','Recipient','Distributed','Receiver feedback','Made by'].map(h=>(
          <div key={h} className="eyebrow" style={{fontSize:10.5}}>{h}</div>
        ))}
      </div>
      {sorted.map((b,i)=>{
        const fb=b.feedback, v=fb&&B_VERDICT[fb.verdict];
        return (
          <div key={b.id} onClick={()=>open(b.id,'feedback')}
            style={{display:'grid',gridTemplateColumns:'minmax(0,2.4fr) 1.4fr 1fr 1.6fr 80px',gap:12,alignItems:'center',padding:'13px 18px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',transition:'.12s'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
              <span style={{width:30,height:38,borderRadius:'3px 5px 5px 3px',background:b.cover,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'inset 4px 0 0 rgba(255,255,255,.18)'}}><Icon name="book" size={14} style={{color:'#fff'}}/></span>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:B_SERIF,fontSize:14.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</div>
                <div className="muted" style={{fontSize:11,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.sub}</div>
              </div>
            </div>
            <div style={{fontSize:12.5,color:'var(--ink-2)',fontWeight:550,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.recipient}</div>
            <div className="muted" style={{fontSize:12}}>{b.distributed}</div>
            <div>
              {fb ? (
                <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                  <Stars value={fb.rating} size={13}/>
                  <span className="badge" style={{background:v.tint,color:v.color,height:19,fontSize:10.5}}>{v.label}</span>
                  {!fb.shared && <span className="badge" style={{background:'#FEF1F1',color:'#C2410C',height:19,fontSize:10.5}}>Not shared</span>}
                </div>
              ) : (
                <span className="badge" style={{background:'#F8EFD9',color:'#B5851C',height:19,fontSize:10.5}}><Icon name="clock" size={11}/>Awaiting</span>
              )}
            </div>
            <div style={{justifySelf:'start'}}><AvatarStack ids={b.contributors} size={21} max={3}/></div>
          </div>
        );
      })}
      {!sorted.length && <div style={{textAlign:'center',padding:'40px',color:'var(--ink-3)',fontSize:13}}>No books distributed yet.</div>}
    </div>
  );
}

function BookBuilder({b, tab, setTab, onBack, update, flash}){
  const st=B_STATUS[b.status];
  const mats=b.sections.filter(s=>s.type!=='section');
  const secCount=b.sections.filter(s=>s.type==='section').length;
  const pages=mats.reduce((a,s)=>a+s.pages,0);
  const fbCount=b.feedback?b.feedback.notes.length+1:0;

  function distribute(){
    update(b.id, bk=>({...bk, status:'dist', distributed:'Jun 6 · '+new Date().toTimeString().slice(0,5).replace(':',''), feedback:bk.feedback||null}));
    flash&&flash('Briefing book distributed to '+b.recipient);
    setTab('feedback');
  }

  return (
    <div className="rise">
      <div style={{position:'sticky',top:'var(--header-h)',zIndex:40,background:'rgba(255,255,255,.85)',backdropFilter:'blur(10px)',borderBottom:'1px solid var(--line)'}}>
        <div className="page" style={{padding:'11px 28px',display:'flex',alignItems:'center',gap:14}}>
          <button onClick={onBack} className="btn btn-secondary btn-sm"><Icon name="chevron_left" size={15} sw={2.2}/>Books</button>
          <span style={{width:1,height:24,background:'var(--line-2)'}}></span>
          <span style={{width:28,height:28,borderRadius:7,background:b.cover,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="book" size={15} style={{color:'#fff'}}/></span>
          <div style={{minWidth:0,flex:1}}>
            <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</div>
            <div className="muted" style={{fontSize:11.5}}>{b.sub} · For {b.recipient}{b.distributed?` · sent ${b.distributed}`:''}</div>
          </div>
          <span className="badge" style={{background:st.tint,color:st.color,height:22}}>{st.label}</span>
          <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Exported book as PDF')}><Icon name="download" size={14}/>Export</button>
          {b.status!=='dist'
            ? <button className="btn btn-primary btn-sm" onClick={distribute}><Icon name="send" size={14}/>Distribute</button>
            : <button className="btn btn-primary btn-sm" onClick={()=>setTab('feedback')}><Icon name="comment" size={14}/>Feedback</button>}
        </div>
        {/* tab bar */}
        <div className="page" style={{padding:'0 28px',display:'flex',gap:22}}>
          {[['contents','Contents','layers'],['feedback','Receiver feedback','comment']].map(([id,label,icon])=>(
            <button key={id} onClick={()=>setTab(id)} style={{display:'flex',alignItems:'center',gap:7,border:0,background:'transparent',
              padding:'11px 0',cursor:'pointer',fontSize:13,fontWeight:tab===id?600:500,position:'relative',
              color:tab===id?'var(--blue)':'var(--ink-3)'}}>
              <Icon name={icon} size={15}/>{label}
              {id==='feedback'&&fbCount>0 && <span style={{fontSize:10.5,fontWeight:700,background:'#EBF4FF',color:'var(--blue)',borderRadius:999,padding:'1px 7px'}}>{fbCount}</span>}
              {tab===id && <span style={{position:'absolute',left:0,right:0,bottom:-1,height:2.5,background:'var(--blue)',borderRadius:2}}></span>}
            </button>
          ))}
        </div>
      </div>

      {tab==='contents'
        ? <BookContents b={b} update={update} flash={flash} secCount={secCount}/>
        : <FeedbackTab b={b} update={update} flash={flash}/>}
    </div>
  );
}

function BookContents({b, update, flash, secCount}){
  const [filter,setFilter]=React.useState('');
  function move(i,dir){
    const j=i+dir; if(j<0||j>=b.sections.length) return;
    update(b.id, bk=>{ const s=[...bk.sections]; [s[i],s[j]]=[s[j],s[i]]; return {...bk,sections:s}; });
  }
  function remove(id){ update(b.id, bk=>({...bk,sections:bk.sections.filter(s=>s.id!==id)})); }
  function add(item){ update(b.id, bk=>({...bk,sections:[...bk.sections, bs(item.kind,item.title,item.src)]})); flash&&flash(`Added “${item.title}” to the book`); }
  function addSection(){ update(b.id, bk=>({...bk,sections:[...bk.sections, mkSec('New section')]})); flash&&flash('Section added — give it a name'); }
  function renameSection(id,name){ update(b.id, bk=>({...bk,sections:bk.sections.map(s=>s.id===id?{...s,name}:s)})); }
  const lib=B_LIBRARY.filter(x=>x.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="page" style={{paddingTop:24,display:'grid',gridTemplateColumns:'minmax(0,1fr) 380px',gap:24,alignItems:'start',maxWidth:1240}}>
      <div className="card card-pad">
        <SectionHead title="Book contents" sub="Group materials into sections, reorder, or remove" icon="layers"
          action={<button className="btn btn-secondary btn-sm" onClick={addSection}><Icon name="plus" size={14} sw={2.2}/>Add section</button>}/>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {(()=>{ let n=0; const hasSec=secCount>0; return b.sections.map((s,i)=>{
            if(s.type==='section'){
              return (
                <div key={s.id} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 13px',borderRadius:11,background:'var(--surface-2)',border:'1px solid var(--line-2)',marginTop:i?6:0}}>
                  <span style={{width:30,height:30,borderRadius:8,background:'var(--ink)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="bookmark" size={15}/></span>
                  <input value={s.name} onChange={e=>renameSection(s.id,e.target.value)} placeholder="Section name"
                    style={{flex:1,minWidth:0,border:0,outline:'none',background:'transparent',fontSize:13.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em',fontFamily:'inherit'}}/>
                  <span className="badge" style={{background:'#fff',color:'var(--ink-3)',border:'1px solid var(--line)',height:19,fontSize:10.5,flex:'none'}}>Section</span>
                  <div style={{display:'flex',alignItems:'center',gap:2,flex:'none'}}>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Move up" onClick={()=>move(i,-1)} disabled={i===0} style={{opacity:i===0?.35:1}}><Icon name="arrow_up" size={15}/></button>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Move down" onClick={()=>move(i,1)} disabled={i===b.sections.length-1} style={{opacity:i===b.sections.length-1?.35:1}}><Icon name="arrow_down" size={15}/></button>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Remove section" onClick={()=>remove(s.id)}><Icon name="trash" size={15}/></button>
                  </div>
                </div>
              );
            }
            n++;
            const k=B_KIND[s.kind];
            return (
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:13,padding:'12px 14px',border:'1px solid var(--line)',borderRadius:11,background:'#fff',marginLeft:hasSec?18:0}}>
                <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:12,fontWeight:700,color:'var(--ink-4)',width:20,textAlign:'center',flex:'none'}}>{n}</span>
                <span style={{width:34,height:34,borderRadius:9,background:k.color+'18',color:k.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={k.icon} size={16}/></span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.title}</div>
                  <div className="muted" style={{fontSize:11.5,marginTop:2,display:'flex',alignItems:'center',gap:6}}>{k.label} · {s.pages} {s.pages>1?'pages':'page'} <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span><Avatar id={s.src} size={14}/>{PEOPLE[s.src].name.split(' ')[0]}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:2,flex:'none'}}>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Move up" onClick={()=>move(i,-1)} disabled={i===0} style={{opacity:i===0?.35:1}}><Icon name="arrow_up" size={15}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Move down" onClick={()=>move(i,1)} disabled={i===b.sections.length-1} style={{opacity:i===b.sections.length-1?.35:1}}><Icon name="arrow_down" size={15}/></button>
                  <button className="btn btn-ghost btn-icon btn-sm" title="Remove" onClick={()=>remove(s.id)}><Icon name="trash" size={15}/></button>
                </div>
              </div>
            );
          }); })()}
          {!b.sections.length && <div style={{textAlign:'center',padding:'30px',color:'var(--ink-3)',fontSize:13,border:'1.5px dashed var(--line-2)',borderRadius:12}}>Empty book — add a section or materials from the library.</div>}
        </div>
      </div>

      <div style={{position:'sticky',top:'calc(var(--header-h) + 60px)'}}>
        <div className="card card-pad">
          <SectionHead title="Add materials" sub="Collate from the library" icon="plus"/>
          <div style={{display:'flex',alignItems:'center',gap:8,height:34,padding:'0 11px',border:'1px solid var(--line-2)',background:'#fff',borderRadius:8,marginBottom:12}}>
            <Icon name="search" size={15} style={{color:'var(--ink-3)'}}/>
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search materials…" style={{flex:1,border:0,outline:'none',fontSize:13,fontFamily:'inherit',background:'transparent'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:2,maxHeight:'calc(100vh - var(--header-h) - 280px)',overflowY:'auto'}}>
            {lib.map((x,i)=>{
              const k=B_KIND[x.kind];
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'9px 6px',borderTop:i?'1px solid var(--line)':0}}>
                  <span style={{width:30,height:30,borderRadius:8,background:k.color+'18',color:k.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={k.icon} size={14}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12.5,fontWeight:550,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{x.title}</div>
                    <div className="muted" style={{fontSize:11}}>{k.label} · {x.meta}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{flex:'none'}} onClick={()=>add(x)}><Icon name="plus" size={13} sw={2.4}/>Add</button>
                </div>
              );
            })}
            {!lib.length && <div style={{textAlign:'center',padding:'24px',color:'var(--ink-3)',fontSize:12.5}}>No materials match.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== Receiver feedback =====================
function FeedbackTab({b, update, flash}){
  const fb=b.feedback;
  if(b.status!=='dist'){
    return (
      <div className="page" style={{paddingTop:24,maxWidth:760}}>
        <div className="card card-pad" style={{textAlign:'center',padding:'48px 30px'}}>
          <span style={{width:48,height:48,borderRadius:12,background:'var(--surface-2)',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:14}}><Icon name="send" size={22} style={{color:'var(--ink-4)'}}/></span>
          <div style={{fontSize:15,fontWeight:600,color:'var(--ink)'}}>Distribute the book to collect feedback</div>
          <div className="muted" style={{fontSize:13,marginTop:6,maxWidth:420,margin:'6px auto 0',lineHeight:1.5}}>Once this book reaches <b style={{color:'var(--ink-2)'}}>{b.recipient}</b>, you can log their feedback here and route it back to everyone who contributed.</div>
        </div>
      </div>
    );
  }
  return fb
    ? <FeedbackView b={b} fb={fb} update={update} flash={flash}/>
    : <FeedbackCapture b={b} update={update} flash={flash}/>;
}

function FeedbackView({b, fb, update, flash}){
  const v=B_VERDICT[fb.verdict];
  function share(){
    update(b.id, bk=>({...bk, feedback:{...bk.feedback, shared:true, acks:bk.contributors}}));
    flash&&flash('Feedback shared with '+b.contributors.length+' contributors');
  }
  return (
    <div className="page" style={{paddingTop:24,display:'grid',gridTemplateColumns:'minmax(0,1fr) 320px',gap:24,alignItems:'start',maxWidth:1240}}>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        {/* receiver verdict */}
        <div className="card card-pad">
          <div style={{display:'flex',alignItems:'center',gap:13,marginBottom:14}}>
            <span style={{width:42,height:42,borderRadius:11,background:v.tint,color:v.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="comment" size={20}/></span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:600,color:'var(--ink)'}}>Feedback from {fb.who}</div>
              <div className="muted" style={{fontSize:12,marginTop:1}}>{fb.role} · received {fb.date}</div>
            </div>
            <div style={{textAlign:'right',flex:'none'}}>
              <Stars value={fb.rating} size={17}/>
              <div className="muted" style={{fontSize:11,marginTop:3}}>{fb.rating}.0 / 5</div>
            </div>
          </div>
          <span className="badge" style={{background:v.tint,color:v.color,height:22,marginBottom:12}}>{v.label}</span>
          <p style={{fontFamily:B_SERIF,fontSize:16,lineHeight:1.55,color:'var(--ink)',margin:0,fontStyle:'italic'}}>“{fb.summary}”</p>
        </div>

        {/* notes routed to contributors */}
        <div className="card card-pad">
          <SectionHead title="Notes for contributors" sub="Routed back to the people who built each part" icon="message"/>
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            {fb.notes.map((nt,i)=>(
              <div key={i} style={{display:'flex',gap:12,padding:'13px 14px',border:'1px solid var(--line)',borderRadius:11,background:'#fff'}}>
                <Avatar id={nt.src} size={32}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                    <span style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{PEOPLE[nt.src].name}</span>
                    <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',height:18,fontSize:10.5,border:'1px solid var(--line)'}}>{nt.section}</span>
                  </div>
                  <div style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5,marginTop:5}}>{nt.note}</div>
                </div>
              </div>
            ))}
            {!fb.notes.length && <div className="muted" style={{fontSize:13,padding:'8px 0'}}>No per‑section notes — see the overall feedback above.</div>}
          </div>
        </div>
      </div>

      {/* share-back sidebar */}
      <div style={{position:'sticky',top:'calc(var(--header-h) + 60px)',display:'flex',flexDirection:'column',gap:16}}>
        <div className="card card-pad">
          <div className="eyebrow" style={{marginBottom:11}}>Share back with contributors</div>
          {fb.shared ? (
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:10,background:'#F0FDF4',color:'#16A34A'}}>
              <Icon name="check" size={17}/>
              <span style={{fontSize:12.5,fontWeight:600}}>Shared with all {b.contributors.length} contributors</span>
            </div>
          ) : (
            <>
              <div className="muted" style={{fontSize:12.5,lineHeight:1.5,marginBottom:12}}>This feedback hasn’t been routed yet. Share it so the team sees how their work landed.</div>
              <button className="btn btn-primary btn-sm" style={{width:'100%'}} onClick={share}><Icon name="send" size={14}/>Share with contributors</button>
            </>
          )}
          <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--line)'}}>
            <div className="muted" style={{fontSize:11,marginBottom:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Contributors</div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {b.contributors.map(id=>{
                const seen=fb.acks.includes(id);
                return (
                  <div key={id} style={{display:'flex',alignItems:'center',gap:10}}>
                    <Avatar id={id} size={26}/>
                    <span style={{flex:1,fontSize:12.5,fontWeight:550,color:'var(--ink)'}}>{PEOPLE[id].name}</span>
                    {seen
                      ? <span className="badge" style={{background:'#F0FDF4',color:'#16A34A',height:18,fontSize:10.5}}><Icon name="check" size={11}/>Notified</span>
                      : <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',height:18,fontSize:10.5,border:'1px solid var(--line)'}}>Pending</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackCapture({b, update, flash}){
  const [rating,setRating]=React.useState(0);
  const [verdict,setVerdict]=React.useState('useful');
  const [summary,setSummary]=React.useState('');
  const [who,setWho]=React.useState('');
  const [notes,setNotes]=React.useState(()=>b.contributors.map(id=>({src:id, note:''})));
  const can=rating>0 && summary.trim();

  function setNote(i,val){ setNotes(ns=>ns.map((n,j)=>j===i?{...n,note:val}:n)); }
  function submit(){
    const kept=notes.filter(n=>n.note.trim()).map(n=>({src:n.src, section:'—', note:n.note.trim()}));
    update(b.id, bk=>({...bk, feedback:{who:who.trim()||b.recipient, role:b.recipient, date:'Jun 6 · '+new Date().toTimeString().slice(0,5), rating, verdict, summary:summary.trim(), notes:kept, shared:false, acks:[]}}));
    flash&&flash('Feedback logged — share it with the team when ready');
  }
  const inputStyle={width:'100%',border:'1px solid var(--line-2)',borderRadius:9,padding:'9px 12px',fontSize:13,fontFamily:'inherit',outline:'none',background:'#fff',color:'var(--ink)'};

  return (
    <div className="page" style={{paddingTop:24,maxWidth:760,paddingBottom:48}}>
      <div className="card card-pad">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
          <span style={{width:34,height:34,borderRadius:9,background:'#F8EFD9',color:'#B5851C',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="clock" size={17}/></span>
          <div>
            <div style={{fontSize:15,fontWeight:600,color:'var(--ink)'}}>Log feedback from {b.recipient}</div>
            <div className="muted" style={{fontSize:12,marginTop:1}}>Distributed {b.distributed} · awaiting feedback</div>
          </div>
        </div>

        <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--ink-2)',display:'block',marginBottom:7}}>Overall rating</label>
              <div style={{height:39,display:'flex',alignItems:'center'}}><Stars value={rating} size={24} onSet={setRating}/></div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--ink-2)',display:'block',marginBottom:7}}>From (receiver)</label>
              <input value={who} onChange={e=>setWho(e.target.value)} placeholder={b.recipient} style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={{fontSize:12,fontWeight:600,color:'var(--ink-2)',display:'block',marginBottom:7}}>Verdict</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {Object.entries(B_VERDICT).map(([k,v])=>(
                <button key={k} onClick={()=>setVerdict(k)} style={{display:'flex',alignItems:'center',gap:7,height:34,padding:'0 13px',borderRadius:9,cursor:'pointer',fontSize:12.5,fontWeight:600,fontFamily:'inherit',
                  border:'1px solid '+(verdict===k?v.color:'var(--line-2)'),background:verdict===k?v.tint:'#fff',color:verdict===k?v.color:'var(--ink-3)'}}>
                  {verdict===k&&<Icon name="check" size={13}/>}{v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{fontSize:12,fontWeight:600,color:'var(--ink-2)',display:'block',marginBottom:7}}>Summary feedback</label>
            <textarea value={summary} onChange={e=>setSummary(e.target.value)} rows={3} placeholder="What worked, what the receiver needs next time…" style={{...inputStyle,resize:'vertical',lineHeight:1.5}}/>
          </div>

          <div>
            <label style={{fontSize:12,fontWeight:600,color:'var(--ink-2)',display:'block',marginBottom:8}}>Notes for contributors <span style={{fontWeight:500,color:'var(--ink-4)'}}>· optional, routed to each person</span></label>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {notes.map((n,i)=>(
                <div key={n.src} style={{display:'flex',alignItems:'center',gap:11}}>
                  <Avatar id={n.src} size={28}/>
                  <span style={{fontSize:12.5,fontWeight:550,color:'var(--ink)',width:96,flex:'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{PEOPLE[n.src].name}</span>
                  <input value={n.note} onChange={e=>setNote(i,e.target.value)} placeholder="Note for this contributor…" style={{...inputStyle,flex:1}}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:10,paddingTop:4}}>
            <button className="btn btn-primary" disabled={!can} onClick={submit} style={{opacity:can?1:.5,cursor:can?'pointer':'not-allowed'}}><Icon name="check" size={15}/>Log feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BriefingsWorkspace });
