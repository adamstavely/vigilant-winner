// header.jsx — sticky top navigation
const { useState, useRef, useEffect } = React;

function useClickOutside(ref, onClose){
  useEffect(()=>{
    function h(e){ if(ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', h);
    return ()=>document.removeEventListener('mousedown', h);
  },[]);
}

function Header({page, setPage, onCreate, onSearch, openRun, glyph='diamond', framing='codename', flat=false}){
  const [wsOpen, setWsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avOpen, setAvOpen] = useState(false);
  const [agOpen, setAgOpen] = useState(false);
  const wsRef = useRef(), notifRef = useRef(), avRef = useRef(), agRef = useRef();
  useClickOutside(wsRef, ()=>setWsOpen(false));
  useClickOutside(notifRef, ()=>setNotifOpen(false));
  useClickOutside(avRef, ()=>setAvOpen(false));
  useClickOutside(agRef, ()=>setAgOpen(false));

  const nav = [
    {id:'explore', label:'Explore'},
    {id:'tasks', label:'Tasks'},
    {id:'workspaces', label:'Workspaces', dropdown:true},
    {id:'metrics', label:'Metrics'},
    {id:'tools', label:'Tools'},
  ];
  const runningCount = (typeof RUNS!=='undefined') ? RUNS.filter(r=>r.status==='running').length : 0;
  const needCount = (typeof needsYou!=='undefined') ? needsYou().length : 0;
  const isWsActive = ['workspaces','clearance','memos','prep','briefings','knowledge','upload','teams','review'].includes(page);
  const wsItems = WORKSPACES.filter(w=>w.id!=='requests' && w.id!=='upload');

  return (
    <header style={{position:'sticky',top:0,zIndex:100,height:'var(--header-h)',
      background:'rgba(255,255,255,0.72)',backdropFilter:'blur(18px) saturate(1.4)',
      WebkitBackdropFilter:'blur(18px) saturate(1.4)',
      borderBottom:'1px solid rgba(220,227,237,0.8)'}}>
      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',height:'100%',padding:'0 28px',
        display:'flex',alignItems:'center',gap:18}}>
        <Brand size={28} onClick={()=>setPage('dashboard')}/>
        <div style={{width:1,height:26,background:'var(--line-2)',margin:'0 2px'}}></div>

        <nav style={{display:'flex',alignItems:'center',gap:3,position:'relative'}}>
          {nav.map(n=> n.dropdown ? (
            <div key={n.id} ref={wsRef} style={{position:'relative'}}>
              <button className={'navlink'+(isWsActive?' active':'')} data-tour="nav-workspaces" onClick={()=>{setWsOpen(o=>!o);}}>
                {n.label}<Icon name="chevron_down" size={14} sw={2} style={{transition:'transform .15s',transform:wsOpen?'rotate(180deg)':'none',opacity:.6}}/>
              </button>
              {wsOpen && (
                <div className="pop card" style={{position:'absolute',top:42,left:0,width:800,padding:7,
                  display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,
                  boxShadow:'var(--shadow-lg)',borderRadius:12}}>
                  {wsItems.map(w=>(
                    <button key={w.id} onClick={()=>{setPage(w.id);setWsOpen(false);}}
                      style={{display:'flex',gap:11,alignItems:'center',width:'100%',padding:'9px 10px',border:0,
                        background:'transparent',borderRadius:8,textAlign:'left',cursor:'pointer'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{width:34,height:34,borderRadius:9,background:'var(--hover)',color:'var(--ink-2)',
                        display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}>
                        <Icon name={w.icon} size={17}/></span>
                      <span style={{flex:1,minWidth:0}}>
                        <span style={{display:'block',fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>{w.name}</span>
                        <span style={{display:'block',fontSize:11.5,color:'var(--ink-3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{w.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button key={n.id} className={'navlink'+(page===n.id?' active':'')} data-tour={'nav-'+n.id} onClick={()=>setPage(n.id)}>{n.label}</button>
          ))}
        </nav>

        <div style={{flex:1}}></div>

        <div ref={agRef} data-tour="agents" style={{position:'relative'}}>
          <button className="navlink" title="Agent fleet" onClick={()=>setAgOpen(o=>!o)} style={{height:34,gap:8,paddingLeft:8,paddingRight:11,border:'1px solid var(--line-2)',background:'#fff'}}>
            <FleetToken size={20}/>
            <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink)'}}>{runningCount}</span>
            {needCount>0 && <span className="badge" style={{background:'#EBF4FF',color:'#0073E6',height:18,fontSize:10.5,padding:'0 6px'}}>{needCount} for you</span>}
          </button>
          {agOpen && <FleetPopover setPage={setPage} openRun={openRun} close={()=>setAgOpen(false)} glyph={glyph} flat={flat} framing={framing}/>}
        </div>
        <button className="btn btn-ghost btn-icon" title="Help & tutorials" data-tour="help" onClick={()=>window.dispatchEvent(new CustomEvent('mcaap-tour:open'))}><Icon name="help" size={21}/></button>
        <button className={'btn btn-ghost btn-icon'+(page==='termbase'?' active':'')} title="Term base" data-tour="termbase" onClick={()=>setPage('termbase')} style={page==='termbase'?{background:'var(--blue-t)',color:'var(--blue)'}:undefined}><Icon name="book" size={21}/></button>
        <div style={{width:1,height:26,background:'var(--line-2)',margin:'0 4px'}}></div>
        <button className="btn btn-ghost btn-icon" title="Messages"><Icon name="message" size={21}/></button>
        <div ref={notifRef} style={{position:'relative'}}>
          <button className="btn btn-ghost btn-icon" title="Notifications" onClick={()=>setNotifOpen(o=>!o)} style={{position:'relative'}}>
            <Icon name="bell" size={21}/>
            <span style={{position:'absolute',top:6,right:7,width:7,height:7,borderRadius:'50%',background:'var(--coral)',boxShadow:'0 0 0 2px rgba(255,255,255,.9)'}}></span>
          </button>
          {notifOpen && <NotifPanel/>}
        </div>
        <button className="btn btn-ghost btn-icon" title="Apps"><Icon name="apps" size={21}/></button>

        <div ref={avRef} style={{position:'relative'}}>
          <button title="Tyler Chen" data-tour="avatar" onClick={()=>setAvOpen(o=>!o)} style={{border:0,background:'transparent',padding:0,cursor:'pointer',marginLeft:2,display:'flex'}}>
            <span className="av" style={{width:32,height:32,background:PEOPLE.tyler.color,fontSize:12,boxShadow:'0 0 0 2px #fff, 0 1px 3px rgba(29,53,87,.2)'}}>TC</span>
          </button>
          {avOpen && <AvatarMenu setPage={setPage} close={()=>setAvOpen(false)}/>}
        </div>
      </div>
    </header>
  );
}

function NotifPanel(){
  const items = ACTIVITY.slice(0,5);
  return (
    <div className="pop card" style={{position:'absolute',top:44,right:0,width:340,padding:0,boxShadow:'var(--shadow-lg)',borderRadius:12,overflow:'hidden'}}>
      <div style={{padding:'13px 16px',borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:600,fontSize:14}}>Notifications</span>
        <span className="linkish" style={{fontSize:12.5}}>Mark all read</span>
      </div>
      <div style={{maxHeight:360,overflowY:'auto'}}>
        {items.map((a,i)=>{
          const k=ACT_KIND[a.kind];
          return (
            <div key={i} style={{display:'flex',gap:11,padding:'12px 16px',borderBottom:i<items.length-1?'1px solid var(--line)':'0',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{width:30,height:30,borderRadius:8,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={k.icon} size={15}/></span>
              <div style={{flex:1,fontSize:12.5,lineHeight:1.45,color:'var(--ink-2)'}}>
                <b style={{color:'var(--ink)',fontWeight:600}}>{PEOPLE[a.who].name}</b> {a.verb} <b style={{color:'var(--ink)',fontWeight:550}}>{a.what}</b>
                <div className="muted" style={{fontSize:11,marginTop:2}}>{a.t} ago</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AvatarMenu({setPage, close}){
  const me = PEOPLE.tyler;
  function go(fn){ close(); fn(); }
  const item = (icon,label,onClick,opts={})=>(
    <button onClick={()=>go(onClick)}
      style={{display:'flex',alignItems:'center',gap:11,width:'100%',padding:'9px 12px',border:0,background:'transparent',borderRadius:8,textAlign:'left',cursor:'pointer',fontSize:13,fontWeight:550,color:opts.danger?'var(--coral)':'var(--ink)'}}
      onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <Icon name={icon} size={16} style={{color:opts.danger?'var(--coral)':'var(--ink-3)',flex:'none'}}/>
      <span style={{flex:1}}>{label}</span>
      {opts.badge!=null && <span className="badge" style={{background:'var(--blue-tint,#EBF4FF)',color:'var(--blue)',height:18,fontSize:10.5,fontWeight:600}}>{opts.badge}</span>}
    </button>
  );
  return (
    <div className="pop card" style={{position:'absolute',top:44,right:0,width:248,padding:6,boxShadow:'var(--shadow-lg)',borderRadius:12}}>
      <div style={{display:'flex',alignItems:'center',gap:11,padding:'8px 10px 10px'}}>
        <span className="av" style={{width:38,height:38,background:me.color,fontSize:14,flex:'none'}}>TC</span>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{me.name}</div>
          <div className="muted" style={{fontSize:11.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{me.email||me.role}</div>
        </div>
      </div>
      <div style={{height:1,background:'var(--line)',margin:'2px 4px 6px'}}></div>
      {item('user','My profile', ()=>setPage('myprofile'))}
      {item('inbox','My requests', ()=>setPage('requests'), {badge:12})}
      {item('settings','Settings', ()=>setPage('dashboard'))}
      <div style={{height:1,background:'var(--line)',margin:'6px 4px'}}></div>
      {item('external','Sign out', ()=>{}, {danger:true})}
    </div>
  );
}

function FleetPopover({ setPage, openRun, close, glyph, flat, framing }){
  const live = RUNS.filter(r=>r.status==='running');
  const attn = needsYou();
  const Row = ({r})=>{
    const a=AGENTS[r.agent], s=RUN_STATUS[r.status];
    return (
      <button onClick={()=>{close();openRun(r.id);}} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',border:0,background:'transparent',borderRadius:9,textAlign:'left',cursor:'pointer'}}
        onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <AgentToken id={r.agent} size={30} glyph={glyph} flat={flat} live={r.status==='running'}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
          <div style={{fontSize:11,color:s.color,fontWeight:550,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{agentName(r.agent,framing)} · {r.metric}</div>
        </div>
        {r.status==='running'
          ? <span style={{fontSize:11,fontWeight:700,color:a.color,fontFamily:"ui-monospace,Menlo,monospace"}}>{r.progress}%</span>
          : <span className="badge" style={{background:s.tint,color:s.color}}>{r.status==='ready'?'Ready':'Approve'}</span>}
      </button>
    );
  };
  return (
    <div className="pop card" style={{position:'absolute',top:44,right:0,width:354,padding:0,boxShadow:'var(--shadow-lg)',borderRadius:13,overflow:'hidden'}}>
      <div style={{padding:'12px 15px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:9}}>
        <FleetToken size={24}/>
        <span style={{fontWeight:700,fontSize:14,letterSpacing:'-.01em'}}>Agent fleet</span>
        <div style={{flex:1}}></div>
        <span className="linkish" style={{fontSize:12}} onClick={()=>{close();(window.__goAgents?window.__goAgents():setPage('tasks'));}}>Open List view</span>
      </div>
      <div style={{maxHeight:380,overflowY:'auto',padding:6}}>
        {attn.length>0 && <div className="eyebrow" style={{padding:'8px 8px 5px',color:'#B5851C'}}>Waiting on you · {attn.length}</div>}
        {attn.map(r=><Row key={r.id} r={r}/>)}
        {live.length>0 && <div className="eyebrow" style={{padding:'10px 8px 5px'}}>Working now · {live.length}</div>}
        {live.map(r=><Row key={r.id} r={r}/>)}
      </div>
      <button className="btn btn-ghost btn-sm" style={{width:'100%',borderRadius:0,borderTop:'1px solid var(--line)',height:40}} onClick={()=>{close();(window.__goAgents?window.__goAgents():setPage('agents'));}}>
        Open in Tasks · List<Icon name="arrow_right" size={14}/>
      </button>
    </div>
  );
}

Object.assign(window, { Header, NotifPanel, AvatarMenu, useClickOutside, FleetPopover });
