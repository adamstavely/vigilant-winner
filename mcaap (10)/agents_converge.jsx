// agents_converge.jsx — converge Mission Control with the Tasks board
// AgentRunCard: an agent run as a kanban card (lives in the pipeline columns)
// UnifiedFeed: the "Fleet" lens — people + agents in one worklist, grouped by attention

const CMONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

// ---- agent run as a board card (sits inside a workflow column next to human cards) ----
function AgentRunCard({ run, glyph='diamond', flat=false, framing='codename' }){
  const a = AGENTS[run.agent], s = RUN_STATUS[run.status];
  const live = run.status==='running';
  const cur = run.steps[run.steps.length-1];
  return (
    <div onClick={()=>window.__openRun && window.__openRun(run.id)}
      style={{position:'relative',background:'#fff',border:'1px solid var(--line)',
        borderLeft:'3px solid var(--line-2)',borderRadius:10,padding:'11px 12px 12px',cursor:'pointer',boxShadow:'var(--shadow-sm)',
        transition:'box-shadow .15s,transform .12s'}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow)';e.currentTarget.style.transform='translateY(-1px)';}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none';}}>
      {/* header: agent identity + status */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,rowGap:7,marginBottom:9,flexWrap:'wrap'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6,minWidth:0}}>
          <AgentToken id={run.agent} size={22} glyph={glyph} flat={flat} live={live}/>
          <span style={{fontSize:10.5,fontWeight:800,letterSpacing:'.05em',color:a.color,whiteSpace:'nowrap'}}>{framing==='role'?a.role.toUpperCase():a.code}</span>
          <span style={{fontSize:8,fontWeight:700,letterSpacing:'.07em',color:a.color,background:a.tint,padding:'1px 4px',borderRadius:3,flex:'none'}}>AGENT</span>
        </span>
        <RunStatusPill k={run.status} sm/>
      </div>
      {/* title */}
      <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',lineHeight:1.32,marginBottom:6}}>{run.title}</div>
      {/* current step */}
      <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--ink-2)',marginBottom:10,minWidth:0}}>
        {live && <Icon name={STEP_KIND[cur.kind].icon} size={12} sw={2} style={{flex:'none',color:'var(--ink-3)'}}/>}
        <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0,flex:1}}>{cur.txt}</span>
      </div>
      {/* progress */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:run.status==='needs_you'||run.status==='ready'?10:0}}>
        <div style={{flex:1,minWidth:0}}><RunProgress value={run.progress} color={s.color} h={4} animated={false}/></div>
        <span style={{fontFamily:CMONO,fontSize:10,fontWeight:600,color:s.color,flex:'none',whiteSpace:'nowrap'}}>{run.metric}</span>
      </div>
      {/* inline CTA when waiting */}
      {(run.status==='needs_you'||run.status==='ready') &&
        <button onClick={(e)=>{e.stopPropagation();window.__openRun && window.__openRun(run.id);}}
          className="btn btn-sm" style={{width:'100%',background:s.color,color:'#fff'}}>
          <Icon name={run.status==='ready'?'eye':'check'} size={13} sw={2.2}/>{run.status==='ready'?'Review output':'Review & approve'}
        </button>}
    </div>
  );
}

// ---- a human task as a feed row (mirrors the agent RunRow shape) ----
function TaskFeedRow({ t, P, WF, openTask, flash }){
  const w = WF[t.wf], who = P[t.who];
  const due = t.done ? t.doneDate : (t.due?('Due '+t.due):'');
  const dueColor = t.tone==='today'||t.tone==='tomorrow' ? '#DC2626' : 'var(--ink-3)';
  return (
    <div className="card agent-row" onClick={()=>flash && flash('Opening '+t.id)}
      style={{display:'flex',alignItems:'stretch',padding:0,cursor:'pointer',overflow:'hidden',borderColor:'var(--line)'}}>
      <div style={{width:4,background:'var(--line-2)',flex:'none'}}></div>
      <div style={{flex:1,display:'flex',alignItems:'center',gap:16,padding:'13px 18px',minWidth:0}}>
        <span title={who.name} className="av" style={{width:38,height:38,background:who.color,fontSize:13,flex:'none'}}>{who.initials}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden'}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'.03em',color:'var(--ink-2)',textTransform:'uppercase',flex:'none'}}>{who.name}</span>
            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)',flex:'none'}}></span>
            <span className="muted" style={{fontSize:11.5,display:'inline-flex',alignItems:'center',gap:5,minWidth:0,overflow:'hidden',textOverflow:'ellipsis'}}><Icon name={w.icon} size={12} style={{color:'var(--ink-3)',flex:'none'}}/>{w.label}</span>
          </div>
          <div style={{fontSize:14,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:4}}>{t.title}</div>
          <div style={{fontSize:12,color:'var(--ink-3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.desc}</div>
        </div>
        <div style={{width:120,flex:'none',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <span className="badge" style={{background:'#F1F5F9',color:'var(--ink-2)'}}><Icon name="user" size={11}/>Person</span>
          <span style={{fontFamily:CMONO,fontSize:11,fontWeight:600,color:dueColor}}>{due}</span>
        </div>
      </div>
    </div>
  );
}

// ---- the unified Fleet worklist: people + agents, grouped by attention ----
function UnifiedFeed({ wf, scoped, asg, openRun, glyph='diamond', flat=false, framing='codename', flash, P, WF }){
  const isWf = wf!=='all';
  // agents in scope
  let runs = boardRunsFor(wf);
  // human tasks in scope (already scoped by Only Mine / My Teams), filtered by workflow
  let humans = isWf ? scoped.filter(t=>t.wf===wf) : scoped;
  if(asg==='people') runs=[];
  if(asg==='agents') humans=[];

  const groups = [
    {id:'wait',  label:'Waiting on you', color:'#E8920C',
      runs: runs.filter(r=>['needs_you','ready','blocked'].includes(r.status)),
      tasks: humans.filter(t=>!t.done && t.g==='blocked')},
    {id:'active',label:'In progress', color:'#0073E6',
      runs: runs.filter(r=>r.status==='running'),
      tasks: humans.filter(t=>!t.done && t.g==='in_progress')},
    {id:'sched', label:'Scheduled & to do', color:'#1D3557',
      runs: runs.filter(r=>['queued','paused'].includes(r.status)),
      tasks: humans.filter(t=>!t.done && t.g==='todo')},
    {id:'done',  label:'Completed', color:'#16A34A',
      runs: runs.filter(r=>r.status==='done'),
      tasks: humans.filter(t=>t.done)},
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {groups.map(g=>{
        const total=g.runs.length+g.tasks.length;
        if(total===0) return null;
        return (
          <div key={g.id}>
            <div style={{display:'flex',alignItems:'center',gap:9,margin:'0 2px 11px'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:g.color,boxShadow:'0 0 0 3px '+g.color+'22'}}></span>
              <span style={{fontSize:13.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>{g.label}</span>
              <span className="badge" style={{background:g.color+'18',color:g.color}}>{total}</span>
              <span className="muted" style={{fontSize:12}}>· {g.runs.length} agent{g.runs.length===1?'':'s'} · {g.tasks.length} {g.tasks.length===1?'person':'people'}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {g.runs.map(r=><RunRow key={r.id} run={r} openRun={openRun} glyph={glyph} flat={flat} framing={framing}/>)}
              {g.tasks.map(t=><TaskFeedRow key={t.id} t={t} P={P} WF={WF} flash={flash}/>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { AgentRunCard, TaskFeedRow, UnifiedFeed, CMONO });
