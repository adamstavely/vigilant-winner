// agents_mission.jsx — Agent Mission Control (feed / list layout)

function agentName(id, framing){
  const a = AGENTS[id];
  if(framing==='role') return a.role;
  if(framing==='named') return a.code;
  if(framing==='task') return a.role;
  return a.code; // codename primary, role shown as secondary
}
function agentSub(id, framing){
  const a = AGENTS[id];
  if(framing==='role') return 'Agent';
  if(framing==='named') return a.role;
  if(framing==='task') return a.skill;
  return a.role;
}

function AgentsPage({ openRun, openKickoff, glyph='diamond', framing='codename', flat=false }){
  const [filter,setFilter] = React.useState('all');
  const attention = needsYou();
  const counts = {
    all: RUNS.length,
    running: runsByStatus('running').length,
    needs: attention.length,
    queued: runsByStatus('queued').length + runsByStatus('paused').length,
    done: runsByStatus('done').length,
  };
  let feed = RUNS;
  if(filter==='running') feed = RUNS.filter(r=>r.status==='running');
  else if(filter==='needs') feed = attention;
  else if(filter==='queued') feed = RUNS.filter(r=>r.status==='queued'||r.status==='paused');
  else if(filter==='done') feed = RUNS.filter(r=>r.status==='done');

  return (
    <div className="rise">
      <MissionHero openKickoff={openKickoff} glyph={glyph} flat={flat} counts={counts} framing={framing}/>

      <div className="page" style={{marginTop:-40,position:'relative',zIndex:2}}>
        {/* needs-you band */}
        {attention.length>0 &&
          <div style={{marginBottom:22}}>
            <div style={{display:'flex',alignItems:'center',gap:9,margin:'0 2px 11px'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'#E8920C',boxShadow:'0 0 0 3px #FCF0DC'}}></span>
              <span style={{fontSize:13.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>Waiting on you</span>
              <span className="badge" style={{background:'#FCF0DC',color:'#B5851C'}}>{attention.length}</span>
              <span className="muted" style={{fontSize:12.5}}>· agents paused for a decision</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(attention.length,3)},1fr)`,gap:14}}>
              {attention.map(r=><AttentionCard key={r.id} run={r} openRun={openRun} glyph={glyph} flat={flat} framing={framing}/>)}
            </div>
          </div>}

        {/* filter row */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          {[['all','All runs',counts.all],['running','Running',counts.running],['needs','Needs you',counts.needs],
            ['queued','Scheduled & paused',counts.queued],['done','Completed',counts.done]].map(([id,lb,n])=>(
            <button key={id} className={'chip'+(filter===id?' on':'')} onClick={()=>setFilter(id)}>
              {lb}<span style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:11,fontWeight:600,opacity:filter===id?.9:.55,marginLeft:1}}>{n}</span>
            </button>
          ))}
          <div style={{flex:1}}></div>
          <button className="btn btn-secondary btn-sm"><Icon name="sliders" size={14}/>Matter: Vantage v. Meridian</button>
        </div>

        {/* the feed */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {feed.map(r=><RunRow key={r.id} run={r} openRun={openRun} glyph={glyph} flat={flat} framing={framing}/>)}
          {feed.length===0 && <div style={{padding:'40px',textAlign:'center',color:'var(--ink-4)',border:'1.5px dashed var(--line-2)',borderRadius:14}}>No agent runs in this view.</div>}
        </div>
      </div>
    </div>
  );
}

function MissionHero({ openKickoff, glyph, flat, counts, framing }){
  return (
    <div style={{position:'relative',paddingTop:34,paddingBottom:66,overflow:'hidden'}}>
      <HeroPattern/>
      <div className="page" style={{position:'relative',zIndex:1,paddingBottom:0}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
            <FleetToken size={50}/>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>Agents · Mission Control</div>
              <h1 style={{fontSize:27,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>Agent Mission Control</h1>
              <p className="sec" style={{fontSize:14,margin:'6px 0 0',maxWidth:520}}>
                <b style={{color:'var(--ink)'}}>{counts.running} agents</b> working the Vantage matter ·
                <b style={{color:'#B5851C'}}> {counts.needs} waiting</b> on your call.
              </p>
            </div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={()=>{window.__tasksView='board';window.__setPage&&window.__setPage('tasks');}}><Icon name="columns" size={16}/>Board view</button>
            <button className="btn btn-secondary"><Icon name="history" size={16}/>Run history</button>
            <button className="btn btn-primary" onClick={openKickoff}><Icon name="plus" size={16} sw={2.2}/>Delegate to agent</button>
          </div>
        </div>

        {/* fleet roster strip */}
        <div style={{display:'flex',gap:10,marginTop:24,flexWrap:'wrap'}}>
          {AGENT_ORDER.map(id=>{
            const a=AGENTS[id];
            const active = RUNS.filter(r=>r.agent===id && (r.status==='running'||r.status==='needs_you'||r.status==='ready'));
            const live = active.some(r=>r.status==='running');
            const wait = active.some(r=>r.status==='needs_you'||r.status==='ready');
            return (
              <div key={id} className="card" style={{padding:'9px 12px 9px 10px',display:'flex',alignItems:'center',gap:10,minWidth:170,
                boxShadow:'var(--shadow-sm)',borderColor: wait?'#F4D79A':'var(--line)'}}>
                <AgentToken id={id} size={34} glyph={glyph} flat={flat} live={live}/>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em',whiteSpace:'nowrap'}}>{agentName(id,framing)}</div>
                  <div style={{fontSize:10.5,fontWeight:550,color: live?a.color: wait?'#B5851C':'var(--ink-3)',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:4}}>
                    {live?'● Working':wait?'Needs you':active.length?'Active':'Idle'}
                    {agentSub(id,framing)!=='Agent' && framing!=='named' && <span className="muted" style={{fontWeight:450}}>· {a.role}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// big card for an agent waiting on a decision
function AttentionCard({ run, openRun, glyph, flat, framing }){
  const a = AGENTS[run.agent], s = RUN_STATUS[run.status];
  const cta = run.status==='needs_you' ? 'Review & approve' : run.status==='ready' ? 'Review output' : 'Resolve';
  return (
    <div className="card agent-row" onClick={()=>openRun(run.id)} style={{padding:0,cursor:'pointer',overflow:'hidden',
      border:'1.5px solid '+(run.status==='needs_you'?'#F4D79A':'var(--line-2)')}}>
      <div style={{height:3,background:s.color}}></div>
      <div style={{padding:'15px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}>
          <AgentToken id={run.agent} size={36} glyph={glyph} flat={flat}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12.5,fontWeight:700,color:'var(--ink)'}}>{agentName(run.agent,framing)}</div>
            <RunStatusPill k={run.status} sm/>
          </div>
        </div>
        <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',lineHeight:1.35,marginBottom:6}}>{run.title}</div>
        <div style={{fontSize:12,color:'var(--ink-2)',lineHeight:1.5,marginBottom:13,
          display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
          {run.gate ? run.gate.body : run.summary}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button className="btn btn-sm" style={{background:s.color,color:'#fff',flex:1}}>
            <Icon name={run.status==='ready'?'eye':'check'} size={14} sw={2.2}/>{cta}
          </button>
          <span className="muted" style={{fontSize:11.5,whiteSpace:'nowrap'}}>{run.id}</span>
        </div>
      </div>
    </div>
  );
}

// the core feed row
function RunRow({ run, openRun, glyph, flat, framing }){
  const a = AGENTS[run.agent], s = RUN_STATUS[run.status];
  const live = run.status==='running';
  const curStep = run.steps[run.steps.length-1];
  return (
    <div className="card agent-row" onClick={()=>openRun(run.id)}
      style={{display:'flex',alignItems:'stretch',padding:0,cursor:'pointer',overflow:'hidden',borderColor:'var(--line)'}}>
      <div style={{width:4,background:s.color,flex:'none'}}></div>
      <div style={{flex:1,display:'flex',alignItems:'center',gap:16,padding:'15px 18px',minWidth:0}}>
        <AgentToken id={run.agent} size={42} glyph={glyph} flat={flat} live={live}/>

        {/* title + step */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden'}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'.03em',color:a.color,textTransform:'uppercase',flex:'none'}}>{agentName(run.agent,framing)}</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)',flex:'none'}}></span>
            <span className="muted" style={{fontSize:11.5,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}}>{run.workspace}</span>
          </div>
          <div style={{fontSize:14,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:5}}>{run.title}</div>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:'var(--ink-2)',minWidth:0}}>
            {live && <Icon name={STEP_KIND[curStep.kind].icon} size={13} sw={2} style={{flex:'none',color:'var(--ink-3)'}}/>}
            <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
              {curStep.txt}
            </span>
          </div>
        </div>

        {/* progress */}
        <div style={{width:170,flex:'none'}} className="hide-sm">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
            <span style={{fontSize:11.5,fontWeight:600,color:'var(--ink-2)',fontFamily:"ui-monospace,Menlo,monospace"}}>{run.metric}</span>
            <span style={{fontSize:11,fontWeight:600,color:s.color}}>{run.progress}%</span>
          </div>
          <RunProgress value={run.progress} color={s.color} animated={false}/>
          <div className="muted" style={{fontSize:10.5,marginTop:6}}>{run.eta}</div>
        </div>

        {/* status + actions */}
        <div style={{width:158,flex:'none',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <RunStatusPill k={run.status}/>
          <RowActions run={run} openRun={openRun}/>
        </div>
      </div>
    </div>
  );
}

function RowActions({ run, openRun }){
  const stop = (e)=>{ e.stopPropagation(); openRun(run.id); };
  if(run.status==='needs_you')
    return <button className="btn btn-sm" onClick={stop} style={{background:'#E8920C',color:'#fff'}}><Icon name="check" size={13} sw={2.4}/>Approve</button>;
  if(run.status==='ready')
    return <button className="btn btn-sm" onClick={stop} style={{background:'#475569',color:'#fff'}}><Icon name="eye" size={13}/>Review</button>;
  if(run.status==='running')
    return <div style={{display:'flex',gap:6}}>
      <button className="btn btn-secondary btn-sm" onClick={(e)=>e.stopPropagation()} title="Pause"><Icon name="clock" size={14}/></button>
      <button className="btn btn-secondary btn-sm" onClick={stop}>Open<Icon name="arrow_right" size={13}/></button>
    </div>;
  if(run.status==='paused')
    return <button className="btn btn-secondary btn-sm" onClick={(e)=>e.stopPropagation()}><Icon name="sync" size={13}/>Resume</button>;
  if(run.status==='queued')
    return <button className="btn btn-ghost btn-sm" onClick={stop}>View queue<Icon name="arrow_right" size={13}/></button>;
  return <button className="btn btn-secondary btn-sm" onClick={stop}>Open<Icon name="arrow_right" size={13}/></button>;
}

Object.assign(window, { AgentsPage, MissionHero, AttentionCard, RunRow, agentName, agentSub });
