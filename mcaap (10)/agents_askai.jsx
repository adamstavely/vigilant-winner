// agents_askai.jsx — "Ask AI" right-side drawer: Chat · Agents · Activity

function AskAIDrawer({ onClose, openRun, glyph='diamond', flat=false, framing='codename' }){
  const [tab,setTab] = React.useState('chat');
  React.useEffect(()=>{
    const esc=e=>e.key==='Escape'&&onClose();
    window.addEventListener('keydown',esc); return ()=>window.removeEventListener('keydown',esc);
  },[]);
  const attn = needsYou();
  const tabs = [
    ['chat','Chat','message',0],
    ['agents','Agents','cpu',attn.length],
    ['activity','Activity','pulse',0],
  ];
  function goRun(id){ onClose(); openRun && openRun(id); }

  return (
    <div style={{position:'fixed',inset:0,zIndex:340}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(36,39,45,.28)',backdropFilter:'blur(1px)',animation:'fade .2s'}}></div>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'min(480px,96vw)',background:'#fff',
        boxShadow:'-20px 0 60px rgba(29,53,87,.18)',animation:'slidein .26s cubic-bezier(.2,.8,.3,1)',display:'flex',flexDirection:'column'}}>
        {/* header */}
        <div style={{padding:'15px 18px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:12}}>
          <FleetToken size={36}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15.5,fontWeight:700,letterSpacing:'-.02em',display:'flex',alignItems:'center',gap:7}}>Ask AI
              <span className="badge" style={{background:'#EBF4FF',color:'#0073E6',height:17,fontSize:9.5,letterSpacing:'.04em'}}>COPILOT</span></div>
            <div className="muted" style={{fontSize:11.5}}>Scoped to <b style={{fontWeight:600,color:'var(--ink-2)'}}>Vantage v. Meridian</b></div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
        </div>
        {/* tabs */}
        <div style={{display:'flex',gap:2,padding:'0 14px',borderBottom:'1px solid var(--line)'}}>
          {tabs.map(([id,lb,ic,n])=>(
            <button key={id} onClick={()=>setTab(id)} className="seg-tab" style={{display:'flex',alignItems:'center',gap:7,padding:'12px 12px',marginRight:4,
              fontSize:13,fontWeight:tab===id?600:500,color:tab===id?'var(--ink)':'var(--ink-3)',position:'relative'}}>
              <Icon name={ic} size={15}/>{lb}
              {n>0 && <span className="badge" style={{background:'#FCF0DC',color:'#B5851C',height:17,fontSize:10,padding:'0 5px'}}>{n}</span>}
              {tab===id && <span style={{position:'absolute',left:6,right:6,bottom:-1,height:2,background:'var(--primary)',borderRadius:2}}></span>}
            </button>
          ))}
        </div>
        {/* body */}
        {tab==='chat' && <AskChat glyph={glyph} flat={flat} framing={framing} goRun={goRun}/>}
        {tab==='agents' && <AskAgents glyph={glyph} flat={flat} framing={framing} goRun={goRun} onClose={onClose}/>}
        {tab==='activity' && <AskActivity glyph={glyph} flat={flat} framing={framing} goRun={goRun}/>}
      </div>
    </div>
  );
}

// ---------- Chat tab ----------
const SUGGESTED = [
  'What needs my attention today?',
  'Where are we on document review?',
  'Summarize the privilege review',
  'Draft a reply to the MSJ',
];
function aiReply(text){
  const q = text.toLowerCase();
  if(/privilege|priv\b|log/.test(q)) return {txt:'CASSIUS has 12 attorney–client privilege entries waiting for your approval on the GC separation set — 84% reviewed. Nothing has been written to the log yet.', run:'AR-318', cta:'Open CASSIUS review'};
  if(/clear|press|statement|publicity|3\.6/.test(q)) return {txt:'VESTA finished screening the MSJ press release: 5 findings, 2 high-risk (a privilege reference in ¶3 and a Rule 3.6 trial-publicity line). Ready for your clearance decision.', run:'AR-310', cta:'Open VESTA findings'};
  if(/review|coding|document|doc|hot|production/.test(q)) return {txt:'ATLAS is 62% through VANT-PROD-002 — 2,981 of 4,820 documents coded, 41 hot docs queued for your second-level review. About 24 minutes left.', run:'AR-322', cta:'Open ATLAS run'};
  if(/draft|brief|reply|motion|msj|write|argument/.test(q)) return {txt:'SOLON is drafting the MSJ argument in co-pilot mode (§ III.A & B done). I can start a reply-brief draft or continue the current section — you’ll approve each paragraph.', delegate:'solon', cta:'Delegate to SOLON'};
  if(/depo|deposition|henderson|exhibit/.test(q)) return {txt:'JUNO’s Henderson outline is paused at 30% (14 exhibits linked) — you paused it to prioritise the privilege deadline. Want me to resume it?', run:'AR-298', cta:'Open JUNO run'};
  if(/attention|today|need|waiting|urgent/.test(q)) return {txt:'Three things need you right now:\n• CASSIUS — approve 12 privilege-log entries\n• VESTA — clear the MSJ press release (2 high-risk findings)\n• ATLAS — 4 hot-doc coding conflicts on the Caldwell custodian', agents:true};
  if(/research|case law|spoliation|memo|9th/.test(q)) return {txt:'ORACLE filed a 3-page memo on 9th Circuit spoliation sanctions (9 authorities) to Knowledge 14 minutes ago. Want the summary or the full memo?', run:'AR-287', cta:'Open ORACLE memo'};
  return {txt:'I can search the matter record, draft from the file, or put an agent on it. Try asking about the privilege review, document coding, the MSJ press release, or deposition prep.'};
}

function AskChat({ glyph, flat, framing, goRun }){
  const [msgs,setMsgs] = React.useState([
    {who:'ai', txt:'Hi Tyler — I’m your AI copilot on Vantage v. Meridian. Ask me anything about the matter, and I can hand work to an agent when it helps.'},
  ]);
  const [val,setVal] = React.useState('');
  const [thinking,setThinking] = React.useState(false);
  const bodyRef = React.useRef(null);
  React.useEffect(()=>{ const el=bodyRef.current; if(el) el.scrollTop=el.scrollHeight; },[msgs,thinking]);

  function send(text){
    const t=(text||val).trim(); if(!t) return;
    setMsgs(m=>[...m,{who:'me',txt:t}]); setVal(''); setThinking(true);
    setTimeout(()=>{
      const r=aiReply(t);
      setThinking(false);
      setMsgs(m=>[...m,{who:'ai',...r}]);
    }, 650);
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div ref={bodyRef} style={{flex:1,overflowY:'auto',padding:'18px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {msgs.map((m,i)=> m.who==='me' ? (
            <div key={i} style={{alignSelf:'flex-end',maxWidth:'85%',background:'var(--primary)',color:'#fff',padding:'9px 13px',borderRadius:'13px 13px 4px 13px',fontSize:13,lineHeight:1.5,whiteSpace:'pre-wrap'}}>{m.txt}</div>
          ) : (
            <div key={i} style={{display:'flex',gap:10,maxWidth:'92%'}}>
              <FleetToken size={26}/>
              <div style={{minWidth:0}}>
                <div style={{background:'var(--surface-2)',border:'1px solid var(--line)',padding:'10px 13px',borderRadius:'13px 13px 13px 4px',fontSize:13,lineHeight:1.55,color:'var(--ink-2)',whiteSpace:'pre-wrap'}}>{m.txt}</div>
                {(m.cta) &&
                  <button onClick={()=> m.run ? goRun(m.run) : (window.__openKickoff && window.__openKickoff(m.delegate))}
                    className="btn btn-secondary btn-sm" style={{marginTop:8}}>
                    {m.run ? <Icon name="arrow_right" size={13}/> : <Icon name="sparkle" size={13} style={{color:'#0073E6'}}/>}{m.cta}</button>}
              </div>
            </div>
          ))}
          {thinking &&
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <FleetToken size={26}/>
              <div style={{display:'flex',gap:4,padding:'12px 14px',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:13}}>
                {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:'50%',background:'var(--ink-4)',animation:'blink 1s infinite',animationDelay:i*0.15+'s'}}></span>)}
              </div>
            </div>}
        </div>
      </div>
      {/* suggested + composer */}
      <div style={{borderTop:'1px solid var(--line)',padding:'12px 14px',background:'var(--surface-2)'}}>
        <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:10}}>
          {SUGGESTED.map(s=>(
            <button key={s} onClick={()=>send(s)} className="chip" style={{height:28,fontSize:11.5}}>{s}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:9,alignItems:'flex-end'}}>
          <textarea value={val} onChange={e=>setVal(e.target.value)} rows={1}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder="Ask anything, or type / to delegate…"
            style={{flex:1,border:'1px solid var(--line-2)',borderRadius:10,padding:'9px 12px',fontSize:13,fontFamily:'inherit',outline:'none',resize:'none',background:'#fff',lineHeight:1.45,maxHeight:120}}
            onFocus={e=>e.target.style.borderColor='var(--blue)'} onBlur={e=>e.target.style.borderColor='var(--line-2)'}/>
          <button className="btn btn-primary btn-icon" onClick={()=>send()}><Icon name="send" size={16}/></button>
        </div>
      </div>
    </div>
  );
}

// ---------- Agents tab (mini mission control) ----------
function AskAgents({ glyph, flat, framing, goRun, onClose }){
  const attn = needsYou();
  const running = runsByStatus('running');
  const Row = ({r, big})=>{
    const a=AGENTS[r.agent], s=RUN_STATUS[r.status];
    return (
      <div onClick={()=>goRun(r.id)} className="card" style={{padding:'12px 13px',cursor:'pointer',border:'1px solid '+(big?'#F4D79A':'var(--line)'),transition:'.13s'}}
        onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:big?9:8}}>
          <AgentToken id={r.agent} size={30} glyph={glyph} flat={flat} live={r.status==='running'}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:a.color}}>{framing==='role'?a.role:a.code}</div>
            <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
          </div>
          <RunStatusPill k={r.status} sm/>
        </div>
        {r.status==='running'
          ? <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1}}><RunProgress value={r.progress} color={s.color} h={4} animated/></div><span style={{fontFamily:CMONO,fontSize:10,fontWeight:600,color:s.color}}>{r.metric}</span></div>
          : big && <button className="btn btn-sm" style={{width:'100%',background:s.color,color:'#fff'}}><Icon name={r.status==='ready'?'eye':'check'} size={13} sw={2.2}/>{r.status==='ready'?'Review output':'Review & approve'}</button>}
      </div>
    );
  };
  return (
    <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:18}}>
      <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>{onClose();window.__openKickoff&&window.__openKickoff();}}>
        <Icon name="sparkle" size={16}/>Delegate to an agent</button>
      {attn.length>0 && <div>
        <div style={{display:'flex',alignItems:'center',gap:8,margin:'0 2px 10px'}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'#E8920C'}}></span>
          <span style={{fontSize:12.5,fontWeight:700,color:'var(--ink)'}}>Waiting on you</span>
          <span className="badge" style={{background:'#FCF0DC',color:'#B5851C'}}>{attn.length}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>{attn.map(r=><Row key={r.id} r={r} big/>)}</div>
      </div>}
      {running.length>0 && <div>
        <div style={{display:'flex',alignItems:'center',gap:8,margin:'0 2px 10px'}}>
          <span style={{fontSize:12.5,fontWeight:700,color:'var(--ink)'}}>Working now</span>
          <span className="badge" style={{background:'#EBF4FF',color:'#0073E6'}}>{running.length}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>{running.map(r=><Row key={r.id} r={r}/>)}</div>
      </div>}
      <button className="btn btn-ghost btn-sm" onClick={()=>{onClose();(window.__goAgents?window.__goAgents():window.__setPage&&window.__setPage('tasks'));}}>
        Open in Tasks · List<Icon name="arrow_right" size={14}/></button>
    </div>
  );
}

// ---------- Activity tab (audit trail) ----------
const AI_AUDIT = [
  {agent:'cassius', icon:'shield', txt:'Drafted 12 privilege-log entries — holding for approval', t:'3m ago', tone:'#B5851C'},
  {agent:'atlas',   icon:'target', txt:'Coded 2,981 / 4,820 docs · flagged 41 hot for review', t:'8m ago', tone:'#0073E6'},
  {who:'tyler',     icon:'check',  txt:'You approved 8 privilege entries from CASSIUS', t:'22m ago', tone:'#16A34A'},
  {agent:'vesta',   icon:'megaphone', txt:'Finished screening the MSJ press release — 5 findings', t:'1h ago', tone:'#16A34A'},
  {agent:'oracle',  icon:'bulb',   txt:'Filed spoliation research memo to Knowledge', t:'1h ago', tone:'#16A34A'},
  {who:'tyler',     icon:'sparkle',txt:'You delegated “Henderson outline” to JUNO', t:'3h ago', tone:'#475569'},
  {agent:'solon',   icon:'pen',    txt:'Drafted § III.A — accepted by A. Okafor', t:'4h ago', tone:'#E1574F'},
];
function AskActivity({ glyph, flat, framing, goRun }){
  return (
    <div style={{flex:1,overflowY:'auto',padding:'16px 18px'}}>
      <div style={{fontSize:12,color:'var(--ink-3)',fontWeight:550,marginBottom:14,display:'flex',alignItems:'center',gap:7}}>
        <Icon name="lock" size={13}/>Every AI & agent action on this matter is logged here.
      </div>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',left:15,top:8,bottom:8,width:2,background:'var(--line)'}}></div>
        {AI_AUDIT.map((e,i)=>(
          <div key={i} style={{display:'flex',gap:13,padding:'9px 0',position:'relative'}}>
            <span style={{flex:'none',zIndex:1}}>
              {e.agent ? <AgentToken id={e.agent} size={32} glyph={glyph} flat={flat}/> :
                <span style={{width:32,height:32,borderRadius:9,background:e.tone+'18',color:e.tone,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 3px #fff'}}><Icon name={e.icon} size={15}/></span>}
            </span>
            <div style={{flex:1,minWidth:0,paddingTop:3}}>
              <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5}}>
                {e.agent && <b style={{color:AGENTS[e.agent].color,fontWeight:700}}>{framing==='role'?AGENTS[e.agent].role:AGENTS[e.agent].code} </b>}
                {e.txt}
              </div>
              <div className="muted" style={{fontSize:11,marginTop:2}}>{e.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AskAIDrawer });
