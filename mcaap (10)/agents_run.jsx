// agents_run.jsx — live agent run detail (reasoning stream + approval gates + controls)

function AgentRunDetail({ runId, setPage, glyph='diamond', framing='codename', flat=false, flash }){
  const run = RUNS.find(r=>r.id===runId) || RUNS[0];
  const a = AGENTS[run.agent], s = RUN_STATUS[run.status];
  const [status,setStatus] = React.useState(run.status);
  const [steps,setSteps] = React.useState(run.steps);
  const [steer,setSteer] = React.useState('');
  const live = status==='running';
  const cur = RUN_STATUS[status];

  // live "ticker": for running agents, periodically push a micro-update step
  const TICK = {
    atlas:['Coding document {n} of 4,820…','Flagged a hot document for second-level review.','Applied issue tag “separation terms”.','Confidence check on Caldwell custodian…'],
    solon:['Weighing Caldwell v. Brennan as primary authority…','Tightening the standard-of-review paragraph…','Cross-checking record cite RJN ¶14…'],
  };
  React.useEffect(()=>{
    if(status!=='running' || !TICK[run.agent]) return;
    let i=0, n=2981;
    const id=setInterval(()=>{
      n+=Math.floor(Math.random()*40+8);
      const tpl=TICK[run.agent][i%TICK[run.agent].length].replace('{n}',n.toLocaleString());
      setSteps(prev=>[...prev.slice(-7),{t:nowClock(), kind:i%2?'act':'think', txt:tpl, fresh:true}]);
      i++;
    }, 2600);
    return ()=>clearInterval(id);
  },[status]);

  function nowClock(){ const d=new Date(); return `${String(9).padStart(2,'0')}:${String(4+Math.floor(Math.random()*50)).padStart(2,'0')}`; }
  function approveGate(){
    setStatus('running');
    setSteps(prev=>[...prev,{t:'now',kind:'done',txt:'You approved 12 entries. Writing them to the privilege log for VANT-PROD-002.',fresh:true}]);
    flash && flash('12 privilege-log entries approved');
  }
  function sendSteer(){
    if(!steer.trim()) return;
    setSteps(prev=>[...prev,{t:'now',kind:'wait',txt:'You: “'+steer.trim()+'”',you:true,fresh:true}]);
    setSteer('');
    flash && flash('Note sent to '+a.code);
  }

  return (
    <div className="rise" data-screen-label="Agent run detail">
      {/* header band */}
      <div style={{position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.5)'}}>
        <HeroPattern opacity={.7}/>
        <div className="page" style={{position:'relative',zIndex:1,paddingTop:20,paddingBottom:20}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>(window.__goAgents?window.__goAgents():setPage('tasks'))} style={{marginLeft:-8,marginBottom:14}}>
            <Icon name="chevron_left" size={16}/>Back to Tasks · List
          </button>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div style={{display:'flex',gap:15,alignItems:'flex-start',minWidth:0}}>
              <AgentToken id={run.agent} size={52} glyph={glyph} flat={flat} live={live}/>
              <div style={{minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:5,flexWrap:'wrap'}}>
                  <span style={{fontSize:11.5,fontWeight:700,letterSpacing:'.04em',color:a.color,textTransform:'uppercase'}}>{agentName(run.agent,framing)}</span>
                  <span className="muted" style={{fontSize:11.5}}>· {framing==='named'?a.role:run.id}</span>
                  <RunStatusPill k={status}/>
                  <AutonomyChip mode={run.autonomy} sm/>
                </div>
                <h1 style={{fontSize:22,fontWeight:700,letterSpacing:'-.025em',margin:0,color:'var(--ink)',lineHeight:1.2}}>{run.title}</h1>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:7,fontSize:12.5,color:'var(--ink-2)'}}>
                  <Icon name="gavel" size={14} style={{color:'var(--ink-3)'}}/><b style={{fontWeight:600,color:'var(--ink)'}}>{run.matter}</b>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  {run.workspace}
                  {run.wfTask && <><span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span><span className="linkish">Task {run.wfTask}</span></>}
                </div>
              </div>
            </div>
            <RunControls status={status} setStatus={setStatus} agent={a} flash={flash}/>
          </div>
        </div>
      </div>

      <div className="page" style={{paddingTop:22,display:'grid',gridTemplateColumns:'minmax(0,1.7fr) minmax(0,1fr)',gap:22,alignItems:'start'}}>
        {/* ---- left: reasoning stream ---- */}
        <div style={{display:'flex',flexDirection:'column',gap:16,minWidth:0}}>
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:9,padding:'14px 18px',borderBottom:'1px solid var(--line)'}}>
              <Icon name="pulse" size={16} style={{color:a.color}}/>
              <span style={{fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>Reasoning stream</span>
              {live && <span style={{display:'inline-flex',alignItems:'center',gap:5,marginLeft:2,fontSize:11,fontWeight:600,color:a.color}}>
                <span style={{position:'relative',width:6,height:6}}><span style={{position:'absolute',inset:0,borderRadius:'50%',background:a.color}}></span><span style={{position:'absolute',inset:0,borderRadius:'50%',background:a.color,animation:'livePing 1.6s ease-out infinite'}}></span></span>Live
              </span>}
              <div style={{flex:1}}></div>
              <button className="btn btn-ghost btn-sm"><Icon name="external" size={13}/>Full transcript</button>
            </div>
            <div style={{padding:'8px 18px 18px'}}>
              <Stream steps={steps} agent={a} live={live}/>
            </div>

            {/* steer composer */}
            <div style={{padding:'12px 18px',borderTop:'1px solid var(--line)',background:'var(--surface-2)',display:'flex',gap:10,alignItems:'center'}}>
              <AgentToken id={run.agent} size={28} glyph={glyph} flat={flat}/>
              <input value={steer} onChange={e=>setSteer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendSteer()}
                placeholder={`Steer ${a.code} — add an instruction or constraint…`}
                style={{flex:1,height:38,border:'1px solid var(--line-2)',borderRadius:9,padding:'0 13px',fontSize:13,fontFamily:'inherit',outline:'none',background:'#fff'}}/>
              <button className="btn btn-primary btn-icon" onClick={sendSteer}><Icon name="send" size={16}/></button>
            </div>
          </div>

          {/* gate / output, depending on status */}
          {status==='needs_you' && run.gate && <GateCard run={run} agent={a} onApprove={approveGate} flash={flash}/>}
          {status==='ready' && run.findings && <FindingsCard run={run} agent={a} flash={flash} setStatus={setStatus}/>}
        </div>

        {/* ---- right: meta rail ---- */}
        <div style={{display:'flex',flexDirection:'column',gap:16,minWidth:0}}>
          <RunMetaCard run={run} agent={a} status={status}/>
          <ArtifactsCard run={run} agent={a}/>
          <GuardrailsCard run={run} agent={a}/>
        </div>
      </div>
    </div>
  );
}

function RunControls({ status, setStatus, agent, flash }){
  if(status==='done')
    return <div style={{display:'flex',gap:9}}>
      <button className="btn btn-secondary"><Icon name="sync" size={16}/>Re-run</button>
      <button className="btn btn-primary"><Icon name="external" size={16}/>Open output</button>
    </div>;
  if(status==='paused')
    return <div style={{display:'flex',gap:9}}>
      <button className="btn btn-ghost"><Icon name="trash" size={16}/></button>
      <button className="btn btn-primary" onClick={()=>{setStatus('running');flash&&flash(agent.code+' resumed');}}><Icon name="sync" size={16}/>Resume agent</button>
    </div>;
  return (
    <div style={{display:'flex',gap:9}}>
      <button className="btn btn-secondary" onClick={()=>flash&&flash('Opened steering thread')}><Icon name="message" size={16}/>Steer</button>
      <button className="btn btn-secondary" onClick={()=>{setStatus('paused');flash&&flash(agent.code+' paused');}}><Icon name="clock" size={16}/>Pause</button>
      <button className="btn btn-secondary" style={{color:'var(--coral)',borderColor:'#F3C6C6'}} onClick={()=>flash&&flash(agent.code+' stopped')}><Icon name="x" size={16}/>Stop</button>
    </div>
  );
}

function Stream({ steps, agent, live }){
  const endRef = React.useRef(null);
  return (
    <div style={{position:'relative'}}>
      <div style={{position:'absolute',left:15,top:10,bottom:18,width:2,background:'var(--line)'}}></div>
      <div style={{display:'flex',flexDirection:'column'}}>
        {steps.map((st,i)=>{
          const k=STEP_KIND[st.kind]||STEP_KIND.think;
          const isLast = i===steps.length-1;
          return (
            <div key={i} className={st.fresh?'stream-step':''} style={{display:'flex',gap:13,padding:'9px 0',position:'relative'}}>
              <span style={{width:32,height:32,borderRadius:9,flex:'none',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',
                background: st.you?'var(--primary-tint)':k.color+'18', color: st.you?'var(--primary)':k.color, boxShadow:'0 0 0 3px #fff'}}>
                <Icon name={st.you?'user':k.icon} size={15} sw={1.9}/>
              </span>
              <div style={{flex:1,minWidth:0,paddingTop:3}}>
                <div style={{fontSize:13,color: st.you?'var(--primary)':'var(--ink-2)',lineHeight:1.5,fontWeight:st.you?600:450}}>
                  {st.kind==='gate' && <b style={{color:'#B5851C'}}>⏸ Checkpoint · </b>}
                  {st.txt}
                  {live && isLast && <span className="cursor-blink" style={{marginLeft:3,color:agent.color,fontWeight:700}}>▍</span>}
                </div>
                <div className="muted" style={{fontSize:10.5,marginTop:3,fontFamily:"ui-monospace,Menlo,monospace"}}>{st.t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- approval gate (CASSIUS privilege) ----
function GateCard({ run, agent, onApprove, flash }){
  const g = run.gate;
  const [approved,setApproved] = React.useState({});
  return (
    <div className="gate-card" style={{padding:0,overflow:'hidden'}}>
      <div style={{padding:'15px 18px',display:'flex',alignItems:'center',gap:11,borderBottom:'1px solid #F4D79A'}}>
        <span style={{width:34,height:34,borderRadius:9,background:'#FBE4B0',color:'#B5851C',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="shield" size={18}/></span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:'#7A5B12'}}>{g.title}</div>
          <div style={{fontSize:11.5,color:'#9A7A2E',fontWeight:500}}>Human-in-the-loop checkpoint · {agent.code} is paused</div>
        </div>
        <span className="badge" style={{background:'#FBE4B0',color:'#7A5B12'}}>Approval required</span>
      </div>
      <div style={{padding:'15px 18px'}}>
        <p style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.55,margin:'0 0 14px'}}>{g.body}</p>
        <div style={{border:'1px solid #EFD9A6',borderRadius:11,overflow:'hidden',background:'#fff'}}>
          {g.rows.map((r,i)=>{
            const on = approved[i]!==false;
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 13px',borderTop:i?'1px solid var(--line)':'0',opacity:on?1:.45,transition:'.15s'}}>
                <span style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:11.5,fontWeight:600,color:'var(--primary)',width:96,flex:'none'}}>{r.doc}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,color:'var(--ink)',fontWeight:550,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.basis}</div>
                  <div className="muted" style={{fontSize:11}}>{r.from} → {r.to}</div>
                </div>
                <span className="badge" style={{background: r.conf>=.9?'#F0FDF4':'#FFFBEB', color:r.conf>=.9?'#16A34A':'#C58A1E',flex:'none'}}>{Math.round(r.conf*100)}%</span>
                <button onClick={()=>setApproved(p=>({...p,[i]:!on}))} className="btn btn-ghost btn-icon btn-sm" title={on?'Exclude':'Include'} style={{flex:'none',color:on?'#16A34A':'var(--ink-4)'}}>
                  <Icon name={on?'check_square':'square'} size={17}/>
                </button>
              </div>
            );
          })}
          <div style={{padding:'9px 13px',borderTop:'1px solid var(--line)',fontSize:11.5,color:'var(--ink-3)',background:'var(--surface-2)'}}>+ {g.more} more entries with confidence ≥ 0.82</div>
        </div>
        <div style={{display:'flex',gap:9,marginTop:15,alignItems:'center'}}>
          <button className="btn btn-primary" onClick={onApprove}><Icon name="check" size={16} sw={2.4}/>Approve & write to log</button>
          <button className="btn btn-secondary"><Icon name="pen" size={15}/>Edit entries</button>
          <div style={{flex:1}}></div>
          <button className="btn btn-ghost" style={{color:'var(--coral)'}}>Reject all</button>
        </div>
      </div>
    </div>
  );
}

// ---- output review (VESTA clearance findings) ----
function FindingsCard({ run, agent, flash, setStatus }){
  const SEV={high:{label:'High risk',color:'#DC2626',tint:'#FEF2F2'},low:{label:'Minor',color:'#C58A1E',tint:'#FFF7E6'}};
  return (
    <div className="card" style={{overflow:'hidden',borderColor:'#E3D6F2'}}>
      <div style={{padding:'15px 18px',display:'flex',alignItems:'center',gap:11,borderBottom:'1px solid var(--line)',background:'#FAF7FE'}}>
        <span style={{width:34,height:34,borderRadius:9,background:'#EFE6FA',color:'#475569',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="megaphone" size={17}/></span>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:'var(--ink)'}}>Clearance findings — {agent.code} flagged {run.findings.length}</div>
          <div style={{fontSize:11.5,color:'var(--ink-3)',fontWeight:500}}>Review each before clearing the statement for release</div>
        </div>
      </div>
      <div style={{padding:'6px 18px 16px'}}>
        {run.findings.map((f,i)=>{
          const sv=SEV[f.sev];
          return (
            <div key={i} style={{display:'flex',gap:12,padding:'13px 0',borderBottom:i<run.findings.length-1?'1px solid var(--line)':'0'}}>
              <span className="badge" style={{background:sv.tint,color:sv.color,flex:'none',height:22,marginTop:1}}><span className="dot" style={{background:sv.color}}></span>{sv.label}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'.03em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:3}}>{f.rule}</div>
                <div style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5}}>{f.txt}</div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{flex:'none',alignSelf:'flex-start'}}>View<Icon name="arrow_right" size={13}/></button>
            </div>
          );
        })}
        <div style={{display:'flex',gap:9,marginTop:15}}>
          <button className="btn btn-primary" onClick={()=>{setStatus('done');flash&&flash('Redlines accepted — statement updated');}}><Icon name="check" size={16} sw={2.2}/>Accept all redlines</button>
          <button className="btn btn-secondary" onClick={()=>flash&&flash('Sent back to '+agent.code)}><Icon name="sync" size={15}/>Send back with notes</button>
          <div style={{flex:1}}></div>
          <button className="btn btn-secondary" style={{color:'#16A34A',borderColor:'#BFE6D9'}} onClick={()=>{setStatus('done');flash&&flash('Statement cleared for release');}}>Clear for release</button>
        </div>
      </div>
    </div>
  );
}

function RunMetaCard({ run, agent, status }){
  const s=RUN_STATUS[status];
  const rows=[
    ['Matter', run.matter,'gavel'],
    ['Workspace', run.workspace, agent.icon],
    ['Started by', PEOPLE[run.startedBy]?PEOPLE[run.startedBy].name:'Review team','user'],
    ['Started', run.started,'clock'],
    ['Est. cost', run.tokens+' tokens','cpu'],
  ];
  return (
    <div className="card card-pad">
      <div style={{display:'flex',alignItems:'center',gap:15,marginBottom:16}}>
        <Donut value={run.progress} size={66} stroke={9} color={s.color} label={run.progress+'%'}/>
        <div style={{minWidth:0,display:'flex',flexDirection:'column',gap:3}}>
          <div style={{fontSize:12.5,fontWeight:700,color:'var(--ink)',lineHeight:1.3}}>{run.metric}</div>
          <div className="muted" style={{fontSize:11.5,lineHeight:1.3}}>{run.eta}</div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        {rows.map(([l,v,ic])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderTop:'1px solid var(--line)'}}>
            <Icon name={ic} size={14} style={{color:'var(--ink-4)',flex:'none'}}/>
            <span style={{fontSize:12,color:'var(--ink-3)',fontWeight:550,width:84,flex:'none'}}>{l}</span>
            <span style={{fontSize:12.5,color:'var(--ink)',fontWeight:550,textAlign:'right',flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtifactsCard({ run, agent }){
  const map={
    cassius:[['Privilege log draft','12 new entries','shield','#B5851C'],['Excluded duplicates','19 already logged','files','#64748B']],
    atlas:[['Coded documents','2,981 tagged','target','#0073E6'],['Hot docs for review','41 escalated','flame','#DC2626']],
    vesta:[['Findings report','5 findings · 2 high','megaphone','#16A34A'],['Suggested redlines','3 inline edits','pen','#E1574F']],
    solon:[['Draft — § III argument','2 of 5 sections','pen','#E1574F'],['Authorities cited','22 sources','book','#0073E6']],
    juno:[['Cross outline','Topics 1–4','mic','#475569'],['Exhibits linked','14 to chronology','files','#0073E6']],
    oracle:[['Research memo','3 pages · 9 cites','file','#16A34A'],['Authority table','controlling + persuasive','book','#0073E6']],
  };
  const arts=map[run.agent]||[];
  return (
    <div className="card card-pad">
      <SectionHead title="Artifacts" sub="What this run is producing" icon="layers"/>
      <div style={{display:'flex',flexDirection:'column',gap:9}}>
        {arts.map(([t,sub,ic,c],i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 11px',border:'1px solid var(--line)',borderRadius:10,cursor:'pointer',transition:'.13s'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
            <span style={{width:32,height:32,borderRadius:8,background:c+'18',color:c,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={ic} size={16}/></span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)'}}>{t}</div>
              <div className="muted" style={{fontSize:11}}>{sub}</div>
            </div>
            <Icon name="external" size={14} style={{color:'var(--ink-4)'}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuardrailsCard({ run, agent }){
  const rails=[
    ['Scope locked to '+run.matter, true],
    ['Cannot file, serve, or send externally', true],
    [run.autonomy==='auto'?'Runs autonomously to completion':'Pauses at every '+(run.autonomy==='copilot'?'step':'checkpoint'), true],
    ['All actions logged to the audit trail', true],
  ];
  return (
    <div className="card card-pad">
      <SectionHead title="Guardrails" sub="What this agent may & may not do" icon="lock"/>
      <div style={{display:'flex',flexDirection:'column',gap:9}}>
        {rails.map(([t],i)=>(
          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,fontSize:12.5,color:'var(--ink-2)',lineHeight:1.4}}>
            <Icon name="shield_check" size={15} sw={2} style={{color:'#16A34A',flex:'none',marginTop:1}}/>{t}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AgentRunDetail });
