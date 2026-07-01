// myprofile.jsx — the signed-in user's own account profile
// Distinct from PersonProfile (the CRM relationship record shown for people in Explore)

function MyInfoRow({icon, label, value, mono, copyable, flash}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderTop:'1px solid var(--line)'}}>
      <Icon name={icon} size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
      <span style={{fontSize:12.5,color:'var(--ink-3)',width:84,flex:'none'}}>{label}</span>
      <span style={{flex:1,minWidth:0,fontSize:12.5,color:'var(--ink)',fontWeight:550,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontFamily:mono?'ui-monospace,Menlo,monospace':'inherit'}}>{value}</span>
      {copyable && <button title="Copy" onClick={()=>flash&&flash('Copied '+label.toLowerCase())} style={{border:0,background:'transparent',padding:2,cursor:'pointer',color:'var(--ink-4)',flex:'none'}}><Icon name="link" size={13}/></button>}
    </div>
  );
}

function MyProfileStat({value, label, icon, color, onClick}){
  return (
    <div className="card card-pad" onClick={onClick}
      style={{display:'flex',alignItems:'center',gap:13,cursor:onClick?'pointer':'default'}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.background='var(--surface-2)';}}
      onMouseLeave={e=>{if(onClick)e.currentTarget.style.background='';}}>
      <span style={{width:38,height:38,borderRadius:10,background:(color||'#0073E6')+'1a',color:color||'#0073E6',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={19}/></span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:21,fontWeight:700,color:'var(--ink)',letterSpacing:'-.02em',lineHeight:1}}>{value}</div>
        <div className="muted" style={{fontSize:11.5,marginTop:3,fontWeight:500}}>{label}</div>
      </div>
    </div>
  );
}

function MyProfile({setPage, openTask, openDevice, flash}){
  const ME = 'tyler';
  const p = PEOPLE[ME];
  const st = personStats(ME);
  const ps = PERSON_STATUS[p.status];
  const myReqs = REQUESTS.filter(r=>r.reviewer===ME || ['In Review','Submitted'].includes(r.status));
  const openReqs = myReqs.filter(r=>!['Completed','Approved','Rejected'].includes(r.status)).length;

  return (
    <div className="rise">
      {/* header band */}
      <div style={{borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.65)',backdropFilter:'blur(4px)'}}>
        <div className="page" style={{paddingTop:16,paddingBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5,color:'var(--ink-3)',fontWeight:500,marginBottom:16}}>
            <span style={{cursor:'pointer'}} onClick={()=>setPage('dashboard')}>Home</span>
            <Icon name="chevron_right" size={13} style={{opacity:.6}}/>
            <span style={{color:'var(--ink-2)'}}>My profile</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,minWidth:0}}>
              <span style={{position:'relative',flex:'none'}}>
                <Avatar id={ME} size={72} ring={false}/>
                <span title={ps.label} style={{position:'absolute',right:1,bottom:1,width:17,height:17,borderRadius:'50%',background:ps.color,boxShadow:'0 0 0 3.5px #fff'}}></span>
              </span>
              <div style={{minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>{p.name}</h1>
                  <span className="badge" style={{background:'#EBF4FF',color:'var(--blue)',height:21,fontWeight:600}}>You</span>
                </div>
                <div style={{fontSize:14,color:'var(--ink-2)',fontWeight:550,marginTop:5}}>{p.role} · {p.dept}</div>
                <div style={{display:'flex',alignItems:'center',gap:9,marginTop:6,fontSize:12.5,color:'var(--ink-3)',flexWrap:'wrap'}}>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Icon name="pin_loc" size={13}/>{p.location}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Icon name="clock" size={13}/>{p.tz}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span>Member since {p.joined}</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-sm" onClick={()=>flash&&flash('Editing profile…')}><Icon name="pen" size={15}/>Edit profile</button>
              <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Opening settings…')}><Icon name="settings" size={15}/>Settings</button>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="page" style={{paddingTop:24}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 340px',gap:20,alignItems:'start'}}>
          {/* MAIN */}
          <div style={{display:'flex',flexDirection:'column',gap:20,minWidth:0}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
              <MyProfileStat value={st.active} label="Active tasks" icon="check_square" color="#0073E6" onClick={()=>setPage('tasks')}/>
              <MyProfileStat value={openReqs} label="Open requests" icon="inbox" color="#B5851C" onClick={()=>setPage('requests')}/>
              <MyProfileStat value={st.collections} label="Collections" icon="folder" color="#475569"/>
              <MyProfileStat value={st.devices.length} label="Devices in custody" icon="phone" color="#16A34A"/>
            </div>

            {/* my requests */}
            <div className="card card-pad">
              <SectionHead icon="inbox" title="My requests" sub={`${openReqs} open · ${myReqs.length} total`}
                action={<span className="linkish" style={{fontSize:12.5,cursor:'pointer'}} onClick={()=>setPage('requests')}>View all</span>}/>
              <div style={{display:'flex',flexDirection:'column'}}>
                {myReqs.slice(0,5).map((r,i)=>{ const s=REQ_STATUS[r.status]; return (
                  <div key={r.id} onClick={()=>setPage('requests')}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'11px 8px',margin:'0 -8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{width:30,height:30,borderRadius:8,background:(REQ_TYPE[r.type]||'#64748B')+'1a',color:REQ_TYPE[r.type]||'#64748B',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="file" size={15}/></span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3,fontSize:11,color:'var(--ink-3)'}}>
                        <span>{r.type}</span><span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span><span>Due {r.due}</span>
                      </div>
                    </div>
                    <span className="st" style={{background:s.tint,color:s.color}}><span className="dot" style={{background:s.color}}></span>{r.status}</span>
                  </div>
                );})}
              </div>
            </div>

            {/* my work */}
            <div className="card card-pad">
              <SectionHead icon="check_square" title="My work" sub={`${st.total} assigned · ${st.active} active`}
                action={<span className="linkish" style={{fontSize:12.5,cursor:'pointer'}} onClick={()=>setPage('tasks')}>View board</span>}/>
              {st.tasks.length===0 ? <div className="muted" style={{fontSize:13,padding:'10px 0'}}>No active work.</div> : (
                <div style={{display:'flex',flexDirection:'column'}}>
                  {st.tasks.map((t,i)=>{ const s=STATUS[t.col]; return (
                    <div key={t.id} onClick={()=>openTask&&openTask(t.id)}
                      style={{display:'flex',alignItems:'center',gap:12,padding:'11px 8px',margin:'0 -8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <PriorityFlag k={t.priority}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.file}</div>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
                          {t.tags.slice(0,2).map(tg=><Tag key={tg} k={tg} sm/>)}
                          <span className="muted" style={{fontSize:11}}>Due {t.due}</span>
                        </div>
                      </div>
                      <span className="st" style={{background:s.tint,color:s.color}}><span className="dot" style={{background:s.color}}></span>{s.label}</span>
                    </div>
                  );})}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {/* account */}
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:6}}>Account</div>
              <MyInfoRow icon="mail"    label="Email"      value={p.email} copyable flash={flash}/>
              <MyInfoRow icon="phone"   label="Phone"      value={p.phone} copyable flash={flash}/>
              <MyInfoRow icon="user"    label="Role"       value={p.role}/>
              <MyInfoRow icon="users"   label="Department" value={p.dept}/>
              <MyInfoRow icon="calendar" label="Joined"    value={p.joined}/>
              <MyInfoRow icon="shield"  label="Reports to" value={p.mgr?PEOPLE[p.mgr].name:'—'}/>
            </div>

            {/* preferences */}
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:6}}>Preferences</div>
              <MyInfoRow icon="bell"    label="Notifications" value="Email + in‑app"/>
              <MyInfoRow icon="clock"   label="Timezone"      value={p.tz}/>
              <MyInfoRow icon="globe"   label="Language"      value="English (US)"/>
              <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',width:'100%',marginTop:12}} onClick={()=>flash&&flash('Opening settings…')}><Icon name="settings" size={14}/>Manage settings</button>
            </div>

            {/* security */}
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:11}}>Security</div>
              <div style={{display:'flex',alignItems:'center',gap:11,fontSize:12.5,color:'var(--ink-2)'}}>
                <Icon name="shield_check" size={16} style={{color:'var(--lime,#16A34A)',flex:'none'}}/>
                <span>Two‑factor authentication is <b style={{color:'var(--ink)'}}>on</b></span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',width:'100%',marginTop:12,color:'var(--coral)'}} onClick={()=>flash&&flash('Signed out')}><Icon name="external" size={14}/>Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MyProfile });
