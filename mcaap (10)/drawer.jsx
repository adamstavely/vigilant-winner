// drawer.jsx — task detail right drawer

function TaskDrawer({task, onClose, moveTask}){
  const [tab,setTab]=React.useState('Activity');
  React.useEffect(()=>{
    function esc(e){ if(e.key==='Escape') onClose(); }
    window.addEventListener('keydown',esc); return ()=>window.removeEventListener('keydown',esc);
  },[]);
  if(!task) return null;
  const tabs=['Activity','Comments','History','Attachments'];

  return (
    <div style={{position:'fixed',inset:0,zIndex:200}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(36,39,45,.28)',backdropFilter:'blur(1px)',animation:'fade .2s'}}></div>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'min(540px,94vw)',background:'#fff',
        boxShadow:'-20px 0 60px rgba(29,53,87,.18)',animation:'slidein .26s cubic-bezier(.2,.8,.3,1)',display:'flex',flexDirection:'column'}}>
        {/* header */}
        <div style={{padding:'18px 22px 16px',borderBottom:'1px solid var(--line)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <span className="badge" style={{background:'#F2F5F9',color:'var(--ink-3)'}}>{task.id}</span>
              <span className="muted" style={{fontSize:12}}>{task.workspace} workspace</span>
            </div>
            <div style={{display:'flex',gap:4}}>
              <button className="btn btn-ghost btn-icon btn-sm" title="Link"><Icon name="link" size={16}/></button>
              <button className="btn btn-ghost btn-icon btn-sm" title="More"><Icon name="more" size={16}/></button>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} title="Close"><Icon name="x" size={17}/></button>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'flex-start',gap:11}}>
            <span style={{width:38,height:38,borderRadius:10,background:STATUS[task.col].tint,color:STATUS[task.col].color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="file" size={19}/></span>
            <h2 style={{fontSize:18.5,fontWeight:700,letterSpacing:'-.02em',margin:0,color:'var(--ink)',lineHeight:1.25}}>{task.file}</h2>
          </div>
        </div>

        <div style={{flex:1,overflowY:'auto'}}>
          {/* overview meta */}
          <div style={{padding:'18px 22px',borderBottom:'1px solid var(--line)'}}>
            <Meta label="Status">
              <select value={task.col} onChange={e=>moveTask(task.id,e.target.value)} style={{appearance:'none',border:'1px solid var(--line-2)',borderRadius:7,
                padding:'5px 28px 5px 10px',fontSize:12.5,fontWeight:550,color:STATUS[task.col].color,background:`${STATUS[task.col].tint} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%238C94A3' stroke-width='2'%3E%3Cpath d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E") no-repeat right 9px center`,cursor:'pointer',fontFamily:'inherit'}}>
                {COLUMNS.map(c=><option key={c.id} value={c.id}>{STATUS[c.id].label}</option>)}
              </select>
            </Meta>
            <Meta label="Due date"><span style={{fontSize:13,fontWeight:550,whiteSpace:'nowrap',color:['Jun 4','Jun 5'].includes(task.due)?'var(--coral)':'var(--ink)',display:'flex',alignItems:'center',gap:6}}><Icon name="calendar" size={14}/>{task.due}, 2026</span></Meta>
            <Meta label="Priority"><span className="badge" style={{background:PRIORITY[task.priority].color+'1a',color:PRIORITY[task.priority].color}}><Icon name="flame" size={12} sw={2}/>{PRIORITY[task.priority].label}</span></Meta>
            <Meta label="Assignees">
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {task.assignees.map(a=><div key={a} style={{display:'flex',alignItems:'center',gap:6}}><Avatar id={a} size={24}/><span style={{fontSize:12.5,color:'var(--ink-2)'}}>{PEOPLE[a].name}</span></div>)}
              </div>
            </Meta>
            <Meta label="Tags" top>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{task.tags.map(t=><Tag key={t} k={t}/>)}</div>
            </Meta>
            {task.desc && <div style={{marginTop:14,fontSize:13,color:'var(--ink-2)',lineHeight:1.55}}>{task.desc}</div>}
          </div>

          {/* tabs */}
          <div style={{display:'flex',gap:2,padding:'0 22px',borderBottom:'1px solid var(--line)',position:'sticky',top:0,background:'#fff',zIndex:1}}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{border:0,background:'transparent',padding:'13px 4px',marginRight:16,fontSize:13,
                fontWeight:tab===t?600:500,color:tab===t?'var(--ink)':'var(--ink-3)',cursor:'pointer',position:'relative'}}>
                {t}
                {tab===t && <span style={{position:'absolute',left:0,right:0,bottom:-1,height:2,background:'var(--primary)',borderRadius:2}}></span>}
              </button>
            ))}
          </div>

          <div style={{padding:'18px 22px 30px'}}>
            {tab==='Activity' && <DrawerActivity task={task}/>}
            {tab==='Comments' && <DrawerComments task={task}/>}
            {tab==='History' && <DrawerHistory/>}
            {tab==='Attachments' && <DrawerAttachments task={task}/>}
            <RelatedWork/>
          </div>
        </div>

        {/* comment composer */}
        <div style={{padding:'12px 22px',borderTop:'1px solid var(--line)',display:'flex',gap:10,alignItems:'center',background:'var(--surface-2)'}}>
          <Avatar id="tyler" size={28}/>
          <input placeholder="Write a comment…" style={{flex:1,height:36,border:'1px solid var(--line-2)',borderRadius:8,padding:'0 12px',fontSize:13,fontFamily:'inherit',outline:'none',background:'#fff'}}/>
          <button className="btn btn-primary btn-icon"><Icon name="send" size={16}/></button>
        </div>
      </div>
    </div>
  );
}

function Meta({label, children, top}){
  return (
    <div style={{display:'flex',alignItems:top?'flex-start':'center',gap:12,padding:'5px 0'}}>
      <span style={{width:84,flex:'none',fontSize:12,fontWeight:550,color:'var(--ink-3)',paddingTop:top?3:0}}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function DrawerActivity({task}){
  const acts=[
    {who:'diego',verb:'moved this to',what:STATUS[task.col].label,t:'34m',kind:'status'},
    {who:'maya',verb:'attached',what:task.attachments+' files',t:'2h',kind:'attach'},
    {who:'lena',verb:'changed priority to',what:PRIORITY[task.priority].label,t:'5h',kind:'comment'},
    {who:'tyler',verb:'created this task',what:'',t:'2d',kind:'assign'},
  ];
  return (
    <div style={{position:'relative',marginBottom:22}}>
      <div style={{position:'absolute',left:13,top:8,bottom:8,width:2,background:'var(--line)'}}></div>
      {acts.map((a,i)=>{
        const k=ACT_KIND[a.kind];
        return (
          <div key={i} style={{display:'flex',gap:12,padding:'7px 0',position:'relative'}}>
            <span style={{width:28,height:28,borderRadius:8,background:k.tint,color:k.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none',zIndex:1,boxShadow:'0 0 0 3px #fff'}}><Icon name={k.icon} size={14}/></span>
            <div style={{fontSize:12.5,color:'var(--ink-2)',paddingTop:5,lineHeight:1.4}}>
              <b style={{color:'var(--ink)'}}>{PEOPLE[a.who].name.split(' ')[0]}</b> {a.verb} {a.what&&<b style={{color:'var(--ink)',fontWeight:550}}>{a.what}</b>} <span className="muted">· {a.t} ago</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function DrawerComments({task}){
  const cs=[
    {who:'lena',t:'2h',txt:'Looks great — just tighten the lower-third timing on the hero shot and we’re good to ship.'},
    {who:'diego',t:'1h',txt:'On it. New cut uploading now, should land in ~20 min.'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:22}}>
      {cs.map((c,i)=>(
        <div key={i} style={{display:'flex',gap:11}}>
          <Avatar id={c.who} size={30}/>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{PEOPLE[c.who].name}</span>
              <span className="muted" style={{fontSize:11.5}}>{c.t} ago</span>
            </div>
            <div style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.55,background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:'10px 13px'}}>{c.txt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function DrawerHistory(){
  const h=[
    {t:'Today 09:14',txt:'Status changed Backlog → In Progress',who:'Diego'},
    {t:'Yesterday 16:40',txt:'Due date moved Jun 8 → Jun 6',who:'Tyler'},
    {t:'Yesterday 11:02',txt:'Assignee added: Lena Brandt',who:'Tyler'},
    {t:'Jun 3 14:20',txt:'Priority set to Urgent',who:'Lena'},
    {t:'Jun 3 09:00',txt:'Task created',who:'Tyler'},
  ];
  return (
    <div style={{marginBottom:22}}>
      {h.map((x,i)=>(
        <div key={i} style={{display:'flex',gap:12,padding:'9px 0',borderBottom:i<h.length-1?'1px solid var(--line)':'0'}}>
          <span style={{width:118,flex:'none',fontSize:11.5,color:'var(--ink-3)',fontWeight:500}}>{x.t}</span>
          <span style={{fontSize:12.5,color:'var(--ink-2)'}}>{x.txt} <span className="muted">· {x.who}</span></span>
        </div>
      ))}
    </div>
  );
}
function DrawerAttachments({task}){
  const files=[
    {n:'hero-cut-v4.mp4',s:'248 MB',c:'#475569'},
    {n:'color-grade-ref.png',s:'4.2 MB',c:'#0073E6'},
    {n:'brief-final.pdf',s:'820 KB',c:'#DC2626'},
  ].slice(0, Math.max(1,Math.min(3,task.attachments||1)));
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:22}}>
      {files.map((f,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',border:'1px solid var(--line)',borderRadius:10,cursor:'pointer'}}>
          <span style={{width:32,height:32,borderRadius:8,background:f.c+'1a',color:f.c,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="file" size={16}/></span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12.5,fontWeight:550,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f.n}</div>
            <div className="muted" style={{fontSize:11}}>{f.s}</div>
          </div>
          <Icon name="download" size={15} style={{color:'var(--ink-4)'}}/>
        </div>
      ))}
    </div>
  );
}
function RelatedWork(){
  return (
    <div>
      <div className="eyebrow" style={{marginBottom:10}}>Related work</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {[['R-84','Q3 Hero Cut — Legal Review','Review','#0073E6'],['R-90','Style Guide — Final Approval','Approval','#475569']].map(([id,n,ty,c])=>(
          <div key={id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',border:'1px solid var(--line)',borderRadius:10,cursor:'pointer'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:c}}></span>
            <span style={{fontSize:12.5,fontWeight:550,color:'var(--ink)',flex:1}}>{n}</span>
            <span className="badge" style={{background:'#F2F5F9',color:'var(--ink-3)'}}>{ty}</span>
            <Icon name="external" size={14} style={{color:'var(--ink-4)'}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TaskDrawer });
