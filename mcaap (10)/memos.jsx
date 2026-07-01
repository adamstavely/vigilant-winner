// memos.jsx — Memos workspace: review, concur & pass memos along a routing chain

const M_SERIF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const M_MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const M_CLS = {
  U:   {label:'UNCLASSIFIED',     short:'U',   color:'#16A34A', bg:'#16A34A'},
  CUI: {label:'CUI',              short:'CUI', color:'#0073E6', bg:'#0073E6'},
  S:   {label:'SECRET // NOFORN', short:'S',   color:'#DC2626', bg:'#DC2626'},
};

// chain step states: done | current | pending
function step(who, role, state){ return {who, role, state}; }
const MEMOS = [
  { id:'M-3041', title:'Quarterly Assessment — Regional Port Throughput', type:'Intelligence Memo', cls:'CUI',
    originator:'maya', date:'Jun 5, 2026', short:'Jun 5', priority:'high',
    summary:'Sustained increase in container traffic suggests a shift in regional logistics posture.',
    chain:[ step('maya','Originator','done'), step('tyler','Concurrence','current'), step('lena','Branch Chief','pending'), step('sam','Release','pending') ],
    body:[
      'This memorandum assesses container throughput across the three principal regional ports over the trailing quarter and its implications for logistics posture.',
      'Throughput rose an estimated 18% quarter-over-quarter, concentrated at the northern terminal. The increase is consistent with a deliberate rebalancing of inbound freight rather than seasonal variation.',
      'We assess with moderate confidence that the shift reflects new overland connections rather than expanded maritime capacity. Corroborating imagery and field reporting are cited in the annex.',
      'Recommend continued collection against the northern terminal and a follow-on assessment in 30 days.' ],
    history:[ {ic:'send',t:'Originated by Maya Okafor',s:'Jun 5 · 8:10 AM'}, {ic:'route',t:'Routed to T. Chen for concurrence',s:'Jun 5 · 8:11 AM'} ] },

  { id:'M-3038', title:'Decision Memo — Reallocation of Collection Assets', type:'Decision Memo', cls:'S',
    originator:'sam', date:'Jun 4, 2026', short:'Jun 4', priority:'urgent',
    summary:'Requests approval to shift two collection platforms to the eastern sector for 14 days.',
    chain:[ step('sam','Originator','done'), step('tyler','Concurrence','done'), step('lena','Approve','current') ],
    body:[
      'This memo requests a decision on the temporary reallocation of two collection platforms from the southern to the eastern sector.',
      'Recent activity in the eastern sector has outpaced available collection. Reallocation would close the gap for a 14-day window with acceptable risk to standing southern requirements.',
      'Decision required: approve, modify, or disapprove the reallocation as scoped above.' ],
    history:[ {ic:'send',t:'Originated by Sam Whitfield',s:'Jun 4 · 3:40 PM'}, {ic:'check',t:'Concurred — T. Chen',s:'Jun 4 · 5:02 PM'}, {ic:'route',t:'Routed to L. Brandt for approval',s:'Jun 4 · 5:03 PM'} ] },

  { id:'M-3035', title:'Talking Points — Interagency Coordination Call', type:'Talking Points', cls:'CUI',
    originator:'noah', date:'Jun 3, 2026', short:'Jun 3', priority:'med',
    summary:'Coordination points for the weekly interagency sync; awaiting your concurrence.',
    chain:[ step('noah','Originator','done'), step('tyler','Concurrence','current'), step('maya','Release','pending') ],
    body:[
      'The following points are proposed for the weekly interagency coordination call.',
      'First, confirm shared understanding of the revised reporting threshold. Second, deconflict overlapping collection in the contested sector. Third, align on the timeline for the joint assessment.',
      'Hold close to the approved language; defer any questions on sourcing to follow-up channels.' ],
    history:[ {ic:'send',t:'Originated by Noah Kim',s:'Jun 3 · 9:25 AM'}, {ic:'route',t:'Routed to T. Chen for concurrence',s:'Jun 3 · 9:26 AM'} ] },

  { id:'M-3029', title:'Assessment — Infrastructure Resilience, Southern Grid', type:'Assessment', cls:'U',
    originator:'priya', date:'Jun 2, 2026', short:'Jun 2', priority:'low',
    summary:'Final assessment cleared and passed to distribution.',
    chain:[ step('priya','Originator','done'), step('tyler','Concurrence','done'), step('lena','Branch Chief','done'), step('sam','Release','done') ],
    body:[
      'This assessment evaluates the resilience of the southern power grid to sustained demand.',
      'Available reporting indicates redundant capacity sufficient to absorb near-term load growth. No single point of failure was identified within the surveyed segment.',
      'Confidence is moderate, constrained by gaps in maintenance reporting.' ],
    history:[ {ic:'send',t:'Originated by Priya Nair',s:'May 30 · 1:10 PM'}, {ic:'check',t:'Concurred — T. Chen',s:'Jun 1'}, {ic:'check',t:'Cleared — L. Brandt',s:'Jun 2'}, {ic:'check',t:'Passed to distribution — S. Whitfield',s:'Jun 2 · 4:00 PM'} ] },

  { id:'M-3022', title:'Intelligence Memo — Anomalous Signal Activity', type:'Intelligence Memo', cls:'S',
    originator:'diego', date:'Jun 1, 2026', short:'Jun 1', priority:'high',
    summary:'Returned for edits — sourcing paragraph needs strengthening before re-route.',
    chain:[ step('diego','Originator','current'), step('tyler','Concurrence','pending'), step('lena','Release','pending') ],
    returned:true,
    body:[
      'This memo documents anomalous signal activity detected over the trailing 72 hours in the coastal sector.',
      'The emitter pattern is inconsistent with known civilian sources. Geolocation places the activity within the northern approach.',
      'Sourcing for the geolocation claim should be expanded before release.' ],
    history:[ {ic:'send',t:'Originated by Diego Ramírez',s:'May 31'}, {ic:'x',t:'Returned for edits — T. Chen',s:'Jun 1 · 11:00 AM'} ] },
];

function memoStage(m){
  if(m.chain.every(s=>s.state==='done')) return 'passed';
  if(m.returned) return 'returned';
  const cur=m.chain.find(s=>s.state==='current');
  if(cur && cur.who==='tyler') return 'mine';
  return 'review';
}
const MEMO_BADGE = {
  mine:    {label:'Awaiting your concurrence', color:'#0073E6', tint:'#EBF4FF'},
  review:  {label:'In routing', color:'#B5851C', tint:'#F8EFD9'},
  returned:{label:'Returned for edits', color:'#DC2626', tint:'#FBEAE8'},
  passed:  {label:'Passed', color:'#16A34A', tint:'#F0FDF4'},
};

// ============ chain visual ============
function MemoChain({chain, size=26}){
  return (
    <div style={{display:'flex',alignItems:'center'}}>
      {chain.map((s,i)=>(
        <React.Fragment key={i}>
          <span title={`${PEOPLE[s.who].name} · ${s.role}`} style={{position:'relative',display:'inline-flex',flex:'none'}}>
            <Avatar id={s.who} size={size} ring={false}/>
            <span style={{position:'absolute',inset:-2,borderRadius:'50%',pointerEvents:'none',
              boxShadow: s.state==='current'?'0 0 0 2px #0073E6':'none'}}></span>
            {s.state==='done' && <span style={{position:'absolute',right:-2,bottom:-2,width:13,height:13,borderRadius:'50%',background:'#16A34A',
              display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 2px #fff'}}><Icon name="check" size={8} sw={3.5} style={{color:'#fff'}}/></span>}
          </span>
          {i<chain.length-1 && <span style={{width:18,height:2,background: s.state==='done'?'#16A34A':'var(--line-2)',flex:'none',margin:'0 1px'}}></span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function ClsTag({cls, sm}){
  const c=M_CLS[cls];
  return <span className="badge" style={{background:c.color+'18',color:c.color,height:sm?19:21,fontWeight:700,letterSpacing:'.02em',fontSize:sm?10:10.5}}>{c.label}</span>;
}

// ============ workspace ============
const MEMO_SCOPES = [{ id: 'me', label: 'Assigned to me' }, { id: 'team', label: 'My team' }, { id: 'all', label: 'All' }];
function MemosWorkspace({setPage, flash}){
  const [memos,setMemos]=React.useState(MEMOS);
  const [openId,setOpenId]=React.useState(null);

  function advance(id){
    setMemos(arr=>arr.map(m=>{
      if(m.id!==id) return m;
      const ci=m.chain.findIndex(s=>s.state==='current');
      if(ci<0) return m;
      const chain=m.chain.map((s,i)=> i===ci?{...s,state:'done'}: i===ci+1?{...s,state:'current'}:s);
      return {...m, returned:false, chain, history:[...m.history,{ic:'check',t:'Concurred — you',s:'just now'}]};
    }));
    flash&&flash('Concurred · passed to next reviewer');
  }
  function ret(id){
    setMemos(arr=>arr.map(m=> m.id===id?{...m,returned:true,history:[...m.history,{ic:'x',t:'Returned for edits — you',s:'just now'}]}:m));
    flash&&flash('Returned to originator for edits');
  }

  const current=memos.find(m=>m.id===openId);
  if(current) return <MemoDetail m={current} onBack={()=>setOpenId(null)} onAdvance={advance} onReturn={ret}/>;

  const columns=[
    {label:'Memo', render:m=>
      <QTitle icon="route" color="var(--violet)" tint="var(--violet-t)" title={m.title} sub={m.type+' · '+m.id}/>},
    {label:'Class.', width:128, render:m=><ClsTag cls={m.cls} sm/>},
    {label:'Waiting on', width:152, render:m=>{
      const cur=m.chain.find(s=>s.state==='current');
      if(!cur) return <QPerson av={<Avatar id={m.chain[m.chain.length-1].who} size={24} ring={false}/>} name="Distributed"/>;
      return <QPerson av={<Avatar id={cur.who} size={24} ring={false}/>} name={PEOPLE[cur.who].name.split(' ')[0]+(cur.who==='tyler'?' (you)':'')}/>;
    }},
    {label:'Status', width:188, render:m=>{const b=MEMO_BADGE[memoStage(m)];
      return <span style={{fontSize:12.5,fontWeight:600,color:b.color,background:b.tint,padding:'5px 11px',borderRadius:999,whiteSpace:'nowrap'}}>{b.label}</span>;}},
    {label:'Date', width:74, align:'right', render:m=><span style={{fontFamily:M_MONO,fontSize:12,color:'var(--ink-4)'}}>{m.short}</span>},
  ];

  return (
    <div className="rise">
      <WsHeader name="Memos" setPage={setPage}
        action={<button className="btn btn-primary" onClick={()=>setPage('prep')}><Icon name="plus" size={16} sw={2.2}/>New memo</button>}/>
      <WorkQueue
        scopes={MEMO_SCOPES} scopeOf={m=>memoStage(m)==='mine'?'me':'team'} rows={memos} columns={columns} onOpen={setOpenId}
        emptyLabel="No memos in this view."/>
    </div>
  );
}

function MemoCard({m, onOpen}){
  const stage=memoStage(m), b=MEMO_BADGE[stage];
  return (
    <div onClick={onOpen} className="card card-hover" style={{padding:'18px 22px',cursor:'pointer'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:16}}>
        <span style={{width:42,height:42,borderRadius:11,background:'var(--violet-t)',color:'var(--violet)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',marginTop:2}}><Icon name="route" size={20}/></span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:6,flexWrap:'wrap'}}>
            <ClsTag cls={m.cls} sm/>
            <span className="muted" style={{fontSize:11.5,fontWeight:500}}>{m.type}</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
            <span className="muted" style={{fontSize:11.5,fontFamily:M_MONO}}>{m.id}</span>
            {m.priority==='urgent' && <span className="badge" style={{background:'#FEF2F2',color:'#DC2626',height:18}}>Urgent</span>}
          </div>
          <h3 style={{fontFamily:M_SERIF,fontSize:19,fontWeight:600,letterSpacing:'-.01em',margin:0,color:'var(--ink)',lineHeight:1.25}}>{m.title}</h3>
          <p style={{fontSize:13.5,color:'var(--ink-2)',margin:'7px 0 0',lineHeight:1.5,maxWidth:680}}>{m.summary}</p>
          <div style={{display:'flex',alignItems:'center',gap:16,marginTop:16,paddingTop:14,borderTop:'1px solid var(--line)',flexWrap:'wrap'}}>
            <MemoChain chain={m.chain}/>
            <div style={{flex:1}}></div>
            <span style={{flex:'none',fontSize:12.5,fontWeight:600,color:b.color,background:b.tint,padding:'5px 11px',borderRadius:999,whiteSpace:'nowrap'}}>{b.label}</span>
            <span className="muted" style={{fontSize:12,fontFamily:M_MONO,flex:'none'}}>{m.short}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoDetail({m, onBack, onAdvance, onReturn}){
  const stage=memoStage(m), c=M_CLS[m.cls];
  const cur=m.chain.find(s=>s.state==='current');
  const mine=cur && cur.who==='tyler';
  const passed=stage==='passed';
  return (
    <div className="rise">
      <div style={{position:'sticky',top:'var(--header-h)',zIndex:40,background:'rgba(255,255,255,.85)',backdropFilter:'blur(10px)',borderBottom:'1px solid var(--line)'}}>
        <div className="page" style={{padding:'11px 28px',display:'flex',alignItems:'center',gap:14}}>
          <button onClick={onBack} className="btn btn-secondary btn-sm"><Icon name="chevron_left" size={15} sw={2.2}/>Memos</button>
          <span style={{width:1,height:24,background:'var(--line-2)'}}></span>
          <div style={{minWidth:0,flex:1}}>
            <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.title}</div>
            <div className="muted" style={{fontSize:11.5}}>{m.type} · {m.id}</div>
          </div>
          <ClsTag cls={m.cls}/>
        </div>
      </div>

      <div className="page" style={{paddingTop:26,display:'grid',gridTemplateColumns:'minmax(0,1fr) 360px',gap:28,alignItems:'start',maxWidth:1200}}>
        {/* document */}
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{background:c.bg,color:'#fff',textAlign:'center',fontSize:11.5,fontWeight:700,letterSpacing:'.12em',padding:'5px'}}>{c.label}</div>
          <div style={{padding:'44px 56px 40px'}}>
            <div style={{fontFamily:M_MONO,fontSize:12,color:'var(--ink-3)',letterSpacing:'.04em'}}>MEMORANDUM · {m.id}</div>
            <h1 style={{fontFamily:M_SERIF,fontSize:27,fontWeight:700,letterSpacing:'-.015em',color:'var(--ink)',lineHeight:1.2,margin:'14px 0 0'}}>{m.title}</h1>
            <div style={{display:'flex',gap:24,margin:'18px 0',paddingBottom:18,borderBottom:'1px solid var(--line)',fontSize:12.5,flexWrap:'wrap'}}>
              {[['From',PEOPLE[m.originator].name],['Type',m.type],['Date',m.date]].map(([k,v])=>(
                <div key={k}><div className="muted" style={{fontSize:10.5,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{k}</div><div style={{fontWeight:600,color:'var(--ink)'}}>{v}</div></div>
              ))}
            </div>
            <div style={{fontFamily:M_SERIF,fontSize:16.5,lineHeight:1.72,color:'#2A2C30'}}>
              {m.body.map((p,i)=><p key={i} style={{margin:'0 0 16px',textWrap:'pretty'}}>{p}</p>)}
              <div style={{textAlign:'center',color:'var(--ink-4)',letterSpacing:'.3em',marginTop:24,fontSize:14}}>// END //</div>
            </div>
          </div>
          <div style={{background:c.bg,color:'#fff',textAlign:'center',fontSize:11.5,fontWeight:700,letterSpacing:'.12em',padding:'5px'}}>{c.label}</div>
        </div>

        {/* rail */}
        <div style={{position:'sticky',top:'calc(var(--header-h) + 16px)',display:'flex',flexDirection:'column',gap:14}}>
          <div className="card card-pad">
            <div className="eyebrow" style={{marginBottom:14}}>Routing chain</div>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:13,top:14,bottom:14,width:2,background:'var(--line)'}}></div>
              {m.chain.map((s,i)=>{
                const done=s.state==='done', curr=s.state==='current';
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:13,padding:'7px 0',position:'relative'}}>
                    <span style={{width:28,height:28,borderRadius:'50%',flex:'none',zIndex:1,boxShadow:'0 0 0 3px #fff',position:'relative'}}>
                      <Avatar id={s.who} size={28} ring={false}/>
                      {done && <span style={{position:'absolute',right:-2,bottom:-2,width:14,height:14,borderRadius:'50%',background:'#16A34A',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 2px #fff'}}><Icon name="check" size={8} sw={4} style={{color:'#fff'}}/></span>}
                      {curr && <span style={{position:'absolute',inset:-3,borderRadius:'50%',boxShadow:'0 0 0 2px #0073E6'}}></span>}
                    </span>
                    <div style={{minWidth:0,flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:done||curr?'var(--ink)':'var(--ink-3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{PEOPLE[s.who].name}</div>
                      <div style={{fontSize:11.5,color:curr?'var(--blue)':'var(--ink-4)',fontWeight:curr?600:500,whiteSpace:'nowrap'}}>{s.role}{curr?' · now':done?' · done':''}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {passed ? (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9,background:'#F0FDF4',color:'#16A34A',fontSize:14,fontWeight:600,padding:'14px',borderRadius:12}}>
              <Icon name="check" size={17} sw={2.4}/>Passed to distribution
            </div>
          ) : mine ? (
            <div className="card card-pad" style={{display:'flex',flexDirection:'column',gap:9}}>
              <div style={{fontSize:13,fontWeight:700,color:'var(--ink)'}}>Your action</div>
              <div className="muted" style={{fontSize:12.5,lineHeight:1.5,marginBottom:3}}>Concur to pass this memo to the next reviewer, or return it to the originator.</div>
              <button className="btn btn-primary" onClick={()=>onAdvance(m.id)}><Icon name="check" size={16} sw={2.2}/>Concur &amp; pass</button>
              <button className="btn btn-secondary" onClick={()=>onReturn(m.id)}><Icon name="route" size={15}/>Return for edits</button>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9,background:'#F8EFD9',color:'#B5851C',fontSize:13.5,fontWeight:600,padding:'13px',borderRadius:12,textAlign:'center'}}>
              <Icon name="route" size={15}/>With {cur?PEOPLE[cur.who].name:'reviewer'}
            </div>
          )}

          <div className="card card-pad">
            <div className="eyebrow" style={{marginBottom:12}}>History</div>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:12,top:8,bottom:8,width:1.5,background:'var(--line)'}}></div>
              {m.history.map((h,i)=>(
                <div key={i} style={{display:'flex',gap:12,padding:'5px 0',position:'relative'}}>
                  <span style={{width:25,height:25,borderRadius:7,background:'var(--surface-2)',color:'var(--ink-3)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',zIndex:1,boxShadow:'0 0 0 3px #fff'}}><Icon name={h.ic} size={13}/></span>
                  <div style={{paddingTop:3}}>
                    <div style={{fontSize:12.5,fontWeight:550,color:'var(--ink-2)'}}>{h.t}</div>
                    <div style={{fontFamily:M_MONO,fontSize:11,color:'var(--ink-4)',marginTop:1}}>{h.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MemosWorkspace });
