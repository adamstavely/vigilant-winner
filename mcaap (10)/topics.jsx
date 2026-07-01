// topics.jsx — Topics lens: browse data by theme

// ===== shared browse-grid helpers (used by Topics / Devices / People) =====

// quick-details modal shell
function InfoModal({title, sub, icon='layers', color='#475569', onClose, onView, viewLabel='Open', viewIcon='arrow_right', children}){
  React.useEffect(()=>{const esc=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[]);
  return (
    <div style={{position:'fixed',inset:0,zIndex:320,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'8vh',paddingBottom:'4vh',overflowY:'auto'}}>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(36,39,45,.32)',backdropFilter:'blur(2px)',animation:'fade .2s'}}></div>
      <div className="pop card" style={{position:'relative',width:'min(540px,94vw)',boxShadow:'var(--shadow-lg)',borderRadius:16,overflow:'hidden'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:13}}>
          <span style={{width:40,height:40,borderRadius:11,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={20}/></span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:16,fontWeight:700,letterSpacing:'-.02em',color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>
            {sub && <div className="muted" style={{fontSize:12,marginTop:1,lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{sub}</div>}
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
        </div>
        <div style={{padding:'18px 22px',display:'flex',flexDirection:'column',gap:18,maxHeight:'54vh',overflowY:'auto'}}>{children}</div>
        <div style={{padding:'13px 22px',borderTop:'1px solid var(--line)',display:'flex',gap:10,background:'var(--surface-2)'}}>
          {onView && <button className="btn btn-primary" style={{flex:1}} onClick={onView}><Icon name={viewIcon} size={16}/>{viewLabel}</button>}
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
function InfoSection({title, count, children}){
  return (
    <div>
      <div className="eyebrow" style={{marginBottom:9}}>{title}{count!=null && <span style={{color:'var(--ink-4)'}}> · {count}</span>}</div>
      {children}
    </div>
  );
}
function InfoItem({icon, title, sub, badge, onClick}){
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:11,padding:'8px',margin:'0 -8px',borderRadius:8,cursor:onClick?'pointer':'default',transition:'.12s'}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.background='var(--surface-2)';}}
      onMouseLeave={e=>{if(onClick)e.currentTarget.style.background='transparent';}}>
      <span style={{width:30,height:30,borderRadius:8,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={15}/></span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>
        {sub && <div className="muted" style={{fontSize:11.5,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sub}</div>}
      </div>
      {badge}
    </div>
  );
}
function InfoRows({rows}){
  const r=rows.filter(Boolean);
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      {r.map(([k,v],i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',gap:16,padding:'8px 0',borderTop:i?'1px solid var(--line)':0,fontSize:13}}>
          <span style={{color:'var(--ink-3)',flex:'none'}}>{k}</span>
          <span style={{color:'var(--ink)',fontWeight:500,textAlign:'right',minWidth:0,wordBreak:'break-word'}}>{v}</span>
        </div>
      ))}
    </div>
  );
}
function TypeChips({types}){
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
      {types.length?types.map(ty=><span key={ty} className="badge" style={{background:'var(--hover)',color:'var(--ink-2)',height:24,fontFamily:'ui-monospace,Menlo,monospace',fontWeight:600}}>{ty}</span>)
        :<span className="muted" style={{fontSize:12.5}}>—</span>}
    </div>
  );
}
// labeled inline meta line on a card (label + clamped value)
function MetaLine({label, value}){
  return (
    <div style={{display:'flex',gap:8,fontSize:11.5,lineHeight:1.45}}>
      <span style={{flex:'none',width:70,color:'var(--ink-4)',fontWeight:700,textTransform:'uppercase',fontSize:9.5,letterSpacing:'.05em',paddingTop:2}}>{label}</span>
      <span style={{flex:1,minWidth:0,color:'var(--ink-2)',fontWeight:500,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{value}</span>
    </div>
  );
}
// union of file types across a set of collections
function collectionTypes(cols){ const s=new Set(); cols.forEach(c=>(c.types||'').split(',').forEach(t=>{const v=t.trim(); if(v)s.add(v.toUpperCase());})); return [...s]; }

// row of View + Details buttons reused across browse cards/lists
function CardActions({onView, onDetails, viewLabel='View', viewIcon='arrow_right', stacked}){
  return (
    <div style={{display:'flex',gap:8, ...(stacked?{}:{marginTop:'auto'})}}>
      <button className="btn btn-primary btn-sm" style={{flex:stacked?'none':1}} onClick={e=>{e.stopPropagation();onView();}}><Icon name={viewIcon} size={14}/>{viewLabel}</button>
      <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)'}} onClick={e=>{e.stopPropagation();onDetails();}}>Details</button>
    </div>
  );
}

function FavStar({on, onToggle, size=18, style}){
  return (
    <button onClick={e=>{e.stopPropagation();onToggle&&onToggle();}} title={on?'Remove from favorites':'Add to favorites'}
      style={{border:0,background:'transparent',padding:2,margin:-2,cursor:'pointer',display:'flex',color:on?'#B5851C':'var(--ink-4)',flex:'none',transition:'color .12s',...(style||{})}}>
      <Icon name={on?'star_fill':'star'} size={size}/>
    </button>
  );
}
function TopicsGrid({filter, openTopic, view='card', favs={}, toggleFav=()=>{}, favOnly=false}){
  const f=(filter||'').toLowerCase();
  const list=TOPICS.filter(t=>(t.name.toLowerCase().includes(f) || t.desc.toLowerCase().includes(f)) && (!favOnly || favs[t.id]));
  const [detail,setDetail]=React.useState(null);
  if(!list.length) return <Empty label={favOnly?"No favorite topics yet.":"No topics match your filter."}/>;
  const resolve=t=>({
    cols: t.collections.map(fid=>FOLDERS.find(x=>x.id===fid)).filter(Boolean),
    devs: t.devices.map(did=>DEVICES.find(x=>x.id===did)).filter(Boolean),
  });
  return (
    <React.Fragment>
    {view==='list' ? (
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        {list.map((t,i)=>{ const {cols,devs}=resolve(t); const types=collectionTypes(cols);
          return (
          <div key={t.id} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 16px',borderTop:i?'1px solid var(--line)':0}}>
            <FavStar on={!!favs[t.id]} onToggle={()=>toggleFav(t.id)} size={16}/>
            <span style={{width:36,height:36,borderRadius:9,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={18}/></span>
            <div style={{width:190,flex:'none',minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</div>
              <div className="muted" style={{fontSize:11.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.items} items · {cols.length} collections · {devs.length} devices</div>
            </div>
            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:3}}>
              <MetaLine label="Collections" value={cols.length?cols.map(c=>c.name).join(' · '):'None'}/>
              <MetaLine label="File types" value={types.length?types.join(' · '):'—'}/>
            </div>
            <CardActions stacked viewLabel="View" onView={()=>openTopic&&openTopic(t.id)} onDetails={()=>setDetail(t)}/>
          </div>);
        })}
      </div>
    ) : (
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,paddingBottom:8}}>
        {list.map(t=>{ const {cols,devs}=resolve(t); const types=collectionTypes(cols);
          return (
          <div key={t.id} className="card card-hover" style={{padding:'15px 16px 14px',display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
              <span style={{width:40,height:40,borderRadius:11,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={20}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'-.01em'}}>{t.name}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:2}}>{t.items} items · updated {t.updated}</div>
              </div>
              <FavStar on={!!favs[t.id]} onToggle={()=>toggleFav(t.id)}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7,paddingTop:11,borderTop:'1px solid var(--line)'}}>
              <MetaLine label="Collections" value={cols.length?cols.map(c=>c.name).join(' · '):'None'}/>
              <MetaLine label="Devices" value={devs.length?devs.map(d=>d.name).join(' · '):'None'}/>
              <MetaLine label="Types" value={types.length?types.join(' · '):'—'}/>
            </div>
            <CardActions viewLabel="View" onView={()=>openTopic&&openTopic(t.id)} onDetails={()=>setDetail(t)}/>
          </div>);
        })}
      </div>
    )}
    {detail && <TopicQuickDetails t={detail} onClose={()=>setDetail(null)} onView={()=>{setDetail(null);openTopic&&openTopic(detail.id);}}/>}
    </React.Fragment>
  );
}

function TopicQuickDetails({t, onClose, onView}){
  const cols=t.collections.map(fid=>FOLDERS.find(x=>x.id===fid)).filter(Boolean);
  const devs=t.devices.map(did=>DEVICES.find(x=>x.id===did)).filter(Boolean);
  const ppl=t.people.map(pid=>PEOPLE[pid]).filter(Boolean);
  const types=collectionTypes(cols);
  return (
    <InfoModal title={t.name} sub={t.desc} icon={t.icon} onClose={onClose} onView={onView} viewLabel="Open topic" viewIcon="layers">
      <InfoSection title="File types"><TypeChips types={types}/></InfoSection>
      <InfoSection title="Collections" count={cols.length}>
        {cols.length?cols.map(c=><InfoItem key={c.id} icon="folder" title={c.name} sub={`${c.files} files · ${c.size} · ${c.types}`}/>):<span className="muted" style={{fontSize:12.5}}>No collections in this topic.</span>}
      </InfoSection>
      <InfoSection title="Devices" count={devs.length}>
        {devs.length?devs.map(d=>{const stt=DEVICE_STATUS[d.status];return <InfoItem key={d.id} icon={DEVICE_TYPE[d.type].icon} title={d.name} sub={d.ev+' · '+d.os} badge={<span className="badge" style={{background:stt.tint,color:stt.color,height:19,fontSize:10.5,flex:'none'}}>{stt.label}</span>}/>;}):<span className="muted" style={{fontSize:12.5}}>No devices in this topic.</span>}
      </InfoSection>
      <InfoSection title="Contributors" count={ppl.length}>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {ppl.map(p=><span key={p.id} style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5,color:'var(--ink-2)',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:999,padding:'3px 11px 3px 3px'}}><Avatar id={p.id} size={20} ring={false}/>{p.name}</span>)}
        </div>
      </InfoSection>
    </InfoModal>
  );
}

// ---------- Topic detail page ----------
function TopicMiniRow({icon, color, title, sub, badge, onClick}){
  return (
    <div onClick={onClick}
      style={{display:'flex',alignItems:'center',gap:11,padding:'10px 8px',margin:'0 -8px',cursor:'pointer',borderRadius:8,transition:'.12s'}}
      onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{width:30,height:30,borderRadius:8,background:color+'1a',color:color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={15}/></span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>
        <div className="muted" style={{fontSize:11.5,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sub}</div>
      </div>
      {badge}
      <Icon name="chevron_right" size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
    </div>
  );
}

function TopicDetail({id, setPage, openDevice, openPerson, flash}){
  const t = TOPICS.find(x=>x.id===id) || TOPICS[0];
  const cols = t.collections.map(fid=>FOLDERS.find(f=>f.id===fid)).filter(Boolean);
  const devs = t.devices.map(did=>DEVICES.find(d=>d.id===did)).filter(Boolean);
  const ppl = t.people.map(pid=>PEOPLE[pid]).filter(Boolean);

  return (
    <div className="rise">
      {/* header band */}
      <div style={{borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.65)',backdropFilter:'blur(4px)'}}>
        <div className="page" style={{paddingTop:16,paddingBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5,color:'var(--ink-3)',fontWeight:500,marginBottom:16}}>
            <span style={{cursor:'pointer'}} onClick={()=>setPage('dashboard')}>Home</span>
            <Icon name="chevron_right" size={13} style={{opacity:.6}}/>
            <span style={{cursor:'pointer'}} onClick={()=>setPage('explore')}>Explore</span>
            <Icon name="chevron_right" size={13} style={{opacity:.6}}/>
            <span style={{color:'var(--ink-2)'}}>{t.name}</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,minWidth:0}}>
              <span style={{width:64,height:64,borderRadius:15,background:t.color+'1a',color:t.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={30}/></span>
              <div style={{minWidth:0}}>
                <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>{t.name}</h1>
                <p className="muted" style={{fontSize:13.5,margin:'6px 0 0',maxWidth:520,lineHeight:1.5}}>{t.desc}</p>
              </div>
            </div>
            <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-sm" onClick={()=>flash&&flash(`Opening ${t.items} items in ${t.name}…`)}><Icon name="layers" size={15}/>Open all items</button>
              <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Lens saved')}><Icon name="bookmark" size={15}/>Save lens</button>
              <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',padding:'0 10px'}} onClick={()=>flash&&flash('More actions')}><Icon name="more" size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="page" style={{paddingTop:24}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 340px',gap:20,alignItems:'start'}}>
          {/* MAIN */}
          <div style={{display:'flex',flexDirection:'column',gap:20,minWidth:0}}>
            {/* stat tiles */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
              {[['Items',t.items,'layers','#0073E6'],['Collections',cols.length,'collections','#475569'],['Devices',devs.length,'phone','#16A34A'],['Contributors',ppl.length,'users','#B5851C']].map(([l,v,ic,c])=>(
                <div key={l} className="card card-pad" style={{display:'flex',alignItems:'center',gap:13}}>
                  <span style={{width:38,height:38,borderRadius:10,background:c+'1a',color:c,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={ic} size={19}/></span>
                  <div>
                    <div style={{fontSize:22,fontWeight:700,color:'var(--ink)',letterSpacing:'-.02em',lineHeight:1}}>{v}</div>
                    <div className="muted" style={{fontSize:11.5,marginTop:3,fontWeight:500}}>{l}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* collections */}
            <div className="card card-pad">
              <SectionHead icon="collections" title="Collections" sub={`${cols.length} in this topic`}/>
              {cols.length===0 ? <div className="muted" style={{fontSize:13,padding:'8px 0'}}>No collections tagged to this topic yet.</div> : (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 24px'}}>
                  {cols.map(f=>(
                    <TopicMiniRow key={f.id} icon="folder" color={f.color} title={f.name} sub={`${f.files} files · ${f.size}`}
                      onClick={()=>{window.__reviewFolder=f.name;setPage('review');}}/>
                  ))}
                </div>
              )}
            </div>

            {/* devices */}
            <div className="card card-pad">
              <SectionHead icon="phone" title="Devices" sub={`${devs.length} in this topic`}/>
              {devs.length===0 ? <div className="muted" style={{fontSize:13,padding:'8px 0'}}>No devices tagged to this topic.</div> : (
                <div style={{display:'flex',flexDirection:'column'}}>
                  {devs.map((d,i)=>{ const ty=DEVICE_TYPE[d.type], stt=DEVICE_STATUS[d.status]; return (
                    <div key={d.id} style={{borderTop:i?'1px solid var(--line)':0}}>
                      <TopicMiniRow icon={ty.icon} color={d.color} title={d.name}
                        sub={<span style={{fontFamily:'ui-monospace,Menlo,monospace'}}>{d.ev}</span>}
                        badge={<span className="badge" style={{background:stt.tint,color:stt.color,height:19,fontSize:10.5,flex:'none'}}>{stt.label}</span>}
                        onClick={()=>openDevice&&openDevice(d.id)}/>
                    </div>
                  );})}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:11}}>Contributors · {ppl.length}</div>
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                {ppl.map((p,i)=>(
                  <div key={p.id} onClick={()=>openPerson&&openPerson(p.id)}
                    style={{display:'flex',alignItems:'center',gap:11,padding:'9px 8px',margin:'0 -8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <Avatar id={p.id} size={32} ring={false}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{p.name}</div>
                      <div className="muted" style={{fontSize:11.5,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.role}</div>
                    </div>
                    <Icon name="chevron_right" size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-pad" style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <span style={{width:34,height:34,borderRadius:9,background:t.color+'1a',color:t.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="bulb" size={18}/></span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>About this lens</div>
                <div className="muted" style={{fontSize:11.5,marginTop:3,lineHeight:1.5}}>Topics cluster related content, devices and people so you can browse everything connected to a theme in one place. Last updated {t.updated}.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TopicsGrid, TopicDetail, InfoModal, InfoSection, InfoItem, InfoRows, TypeChips, MetaLine, collectionTypes, CardActions, FavStar, TopicQuickDetails });
