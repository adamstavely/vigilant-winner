// profile.jsx — Person profile as a CRM relationship record

// ---- meeting history (seeded per person) ----
function _mSeed(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
function _mRng(seed){ return function(){ let t=seed+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
const MTG_TYPE = {
  kickoff:  {label:'Kickoff',         icon:'bulb',    color:'#0073E6'},
  checkin:  {label:'Weekly check‑in', icon:'message', color:'#16A34A'},
  review:   {label:'Creative review', icon:'eye',     color:'#475569'},
  delivery: {label:'Delivery sync',   icon:'check',   color:'#16A34A'},
  renewal:  {label:'Renewal call',    icon:'route',   color:'#B5851C'},
  qbr:      {label:'Quarterly review',icon:'chart',   color:'#1D3557'},
};
const MTG_CH = {video:{label:'Video',icon:'video'}, call:{label:'Call',icon:'phone'}, person:{label:'In person',icon:'users'}};
const _MTG_NOTE = {
  kickoff:['Scoped the engagement and agreed first deliverables.','Aligned on goals, timeline and points of contact.'],
  checkin:['Reviewed progress, no blockers raised.','Walked through this week’s queue and priorities.','Quick status — everything on track.'],
  review:['Gave feedback on the latest cut; minor revisions.','Reviewed drafts; approved direction with notes.'],
  delivery:['Handed off final assets and confirmed receipt.','Delivered the package; signed off on quality.'],
  renewal:['Discussed renewal terms and next-year scope.','Flagged contract end; sending paperwork this week.'],
  qbr:['Reviewed quarter performance and upcoming roadmap.','Recapped deliverables and set Q3 objectives.'],
};
function genMeetings(p){
  const r=_mRng(_mSeed(p.id));
  const owner = p.owner || 'lena';
  const dates=['Jun 2','May 27','May 19','May 8','Apr 24','Apr 10','Mar 26','Mar 12','Feb 26'];
  const channels=['video','video','call','person'];
  const seq = p.rel==='renewal'
    ? ['renewal','checkin','review','checkin','delivery','kickoff']
    : ['checkin','review','checkin','delivery','qbr','checkin','kickoff'];
  const n = 5+Math.floor(r()*2);
  return seq.slice(0,n).map((t,i)=>({
    type:t, date:dates[i], channel:channels[Math.floor(r()*channels.length)],
    note:_MTG_NOTE[t][Math.floor(r()*_MTG_NOTE[t].length)], who:owner,
  }));
}

function ProfileStat({value, label, icon, color, accent}){
  return (
    <div className="card card-pad" style={{display:'flex',alignItems:'center',gap:13}}>
      <span style={{width:38,height:38,borderRadius:10,background:(color||'#0073E6')+'1a',color:color||'#0073E6',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={19}/></span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:21,fontWeight:700,color:accent||'var(--ink)',letterSpacing:'-.02em',lineHeight:1,whiteSpace:'nowrap'}}>{value}</div>
        <div className="muted" style={{fontSize:11.5,marginTop:3,fontWeight:500}}>{label}</div>
      </div>
    </div>
  );
}

function InfoRow({icon, label, value, mono, copyable, flash, last}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderTop:'1px solid var(--line)'}}>
      <Icon name={icon} size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
      <span style={{fontSize:12.5,color:'var(--ink-3)',width:74,flex:'none'}}>{label}</span>
      <span style={{flex:1,minWidth:0,fontSize:12.5,color:'var(--ink)',fontWeight:550,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontFamily:mono?'ui-monospace,Menlo,monospace':'inherit'}}>{value}</span>
      {copyable && <button title="Copy" onClick={()=>flash&&flash('Copied '+label.toLowerCase())} style={{border:0,background:'transparent',padding:2,cursor:'pointer',color:'var(--ink-4)',flex:'none'}}><Icon name="link" size={13}/></button>}
    </div>
  );
}

function PersonProfile({id, setPage, openTask, openDevice, flash}){
  const p = PEOPLE[id] || PL[0];
  const st = personStats(p.id);
  const ps = PERSON_STATUS[p.status];
  const rs = REL_STATUS[p.rel] || REL_STATUS.active;
  const owner = p.owner ? PEOPLE[p.owner] : null;
  const days = daysUntil(p.contractEnd);
  const meetings = React.useMemo(()=>genMeetings(p),[p.id]);
  // renewal progress assuming a 12-month term
  const renewPct = days==null ? null : Math.max(4, Math.min(100, Math.round((365-days)/365*100)));

  const actions = (
    <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
      <button className="btn btn-primary btn-sm" onClick={()=>flash&&flash('Logging a meeting…')}><Icon name="calendar" size={15}/>Log meeting</button>
      <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Opening email…')}><Icon name="mail" size={15}/>Email</button>
      <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',padding:'0 10px'}} onClick={()=>flash&&flash('More actions')}><Icon name="more" size={16}/></button>
    </div>
  );

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
            <span style={{color:'var(--ink-2)'}}>{p.name}</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,minWidth:0}}>
              <span style={{position:'relative',flex:'none'}}>
                <Avatar id={p.id} size={72} ring={false}/>
                <span title={ps.label} style={{position:'absolute',right:1,bottom:1,width:17,height:17,borderRadius:'50%',background:ps.color,boxShadow:'0 0 0 3.5px #fff'}}></span>
              </span>
              <div style={{minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>{p.name}</h1>
                  <span className="badge" style={{background:rs.tint,color:rs.color,height:21,fontWeight:600}}><span style={{width:5.5,height:5.5,borderRadius:'50%',background:rs.color}}></span>{rs.label}</span>
                </div>
                <div style={{fontSize:14,color:'var(--ink-2)',fontWeight:550,marginTop:5}}>{p.relType} · {p.company}</div>
                <div style={{display:'flex',alignItems:'center',gap:9,marginTop:6,fontSize:12.5,color:'var(--ink-3)',flexWrap:'wrap'}}>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Icon name="pin_loc" size={13}/>{p.location}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Icon name="clock" size={13}/>{p.tz}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span>Working together since {p.since}</span>
                </div>
              </div>
            </div>
            {actions}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="page" style={{paddingTop:24}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 340px',gap:20,alignItems:'start'}}>
          {/* MAIN */}
          <div style={{display:'flex',flexDirection:'column',gap:20,minWidth:0}}>
            {/* CRM stat tiles */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
              <ProfileStat value={p.value||'In‑house'} label="Contract value" icon="chart" color="#16A34A"/>
              <ProfileStat value={days==null?'—':days+'d'} label="To renewal" icon="calendar" color="#B5851C" accent={days!=null&&p.rel==='renewal'?'var(--orange)':undefined}/>
              <ProfileStat value={p.meetings} label="Meetings logged" icon="message" color="#475569"/>
              <ProfileStat value={p.lastMet} label="Last contact" icon="clock" color="#0073E6"/>
            </div>

            {/* meeting history */}
            <div className="card card-pad">
              <SectionHead icon="message" title="Meeting history" sub={`${meetings.length} recent · ${p.meetings} all‑time`}
                action={<button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)'}} onClick={()=>flash&&flash('Logging a meeting…')}><Icon name="plus" size={14}/>Log</button>}/>
              <div style={{display:'flex',flexDirection:'column'}}>
                {meetings.map((m,i)=>{ const mt=MTG_TYPE[m.type], ch=MTG_CH[m.channel]; return (
                  <div key={i} style={{display:'flex',gap:14,position:'relative'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:'none'}}>
                      <span style={{width:32,height:32,borderRadius:'50%',background:mt.color+'1a',color:mt.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={mt.icon} size={15}/></span>
                      {i<meetings.length-1 && <span style={{width:2,flex:1,background:'var(--line)',minHeight:18}}></span>}
                    </div>
                    <div style={{flex:1,minWidth:0,paddingBottom:i<meetings.length-1?16:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                        <span style={{fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>{mt.label}</span>
                        <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',height:18,fontSize:10.5,border:'1px solid var(--line)'}}><Icon name={ch.icon} size={11}/>{ch.label}</span>
                        <span className="muted" style={{fontSize:11.5,marginLeft:'auto'}}>{m.date}</span>
                      </div>
                      <div className="muted" style={{fontSize:12.5,marginTop:4,lineHeight:1.45}}>{m.note}</div>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:11.5,color:'var(--ink-3)'}}><Avatar id={m.who} size={16}/>with {PEOPLE[m.who].name}</div>
                    </div>
                  </div>
                );})}
              </div>
            </div>

            {/* work in flight */}
            <div className="card card-pad">
              <SectionHead icon="check_square" title="Work in flight" sub={`${st.total} total · ${st.active} active`}
                action={<span className="linkish" style={{fontSize:12.5,cursor:'pointer'}} onClick={()=>setPage('tasks')}>View board</span>}/>
              {st.tasks.length===0 ? <div className="muted" style={{fontSize:13,padding:'10px 0'}}>No active work.</div> : (
                <div style={{display:'flex',flexDirection:'column'}}>
                  {st.tasks.map((t,i)=>{
                    const s=STATUS[t.col];
                    return (
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {/* relationship */}
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:11}}>Relationship</div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                <span style={{width:34,height:34,borderRadius:9,background:rs.tint,color:rs.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="route" size={17}/></span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>{p.relType}</div>
                  <div className="muted" style={{fontSize:11.5}}>{p.company}</div>
                </div>
                <span className="badge" style={{background:rs.tint,color:rs.color,height:20,fontSize:10.5,fontWeight:600}}>{rs.label}</span>
              </div>
              {owner ? (
                <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderTop:'1px solid var(--line)',marginTop:8}}>
                  <Icon name="user" size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
                  <span style={{fontSize:12.5,color:'var(--ink-3)',width:74,flex:'none'}}>Owner</span>
                  <span style={{flex:1,display:'flex',alignItems:'center',gap:7,cursor:'pointer'}} onClick={()=>window.__openPerson&&window.__openPerson(owner.id)}>
                    <Avatar id={owner.id} size={20}/><span style={{fontSize:12.5,fontWeight:600,color:'var(--ink)'}}>{owner.name}</span>
                  </span>
                </div>
              ) : (
                <InfoRow icon="shield" label="Owner" value={`In‑house · ${p.dept}`}/>
              )}
              <InfoRow icon="calendar" label="Since" value={p.since}/>
              {p.value && <InfoRow icon="chart" label="Value" value={p.value}/>}
              {/* renewal */}
              {days!=null ? (
                <div style={{paddingTop:12,marginTop:6,borderTop:'1px solid var(--line)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:7}}>
                    <span style={{fontSize:12.5,color:'var(--ink-3)'}}>Contract term</span>
                    <span style={{fontSize:12.5,fontWeight:600,color:p.rel==='renewal'?'var(--orange)':'var(--ink)'}}>{days}d to renewal</span>
                  </div>
                  <div style={{height:6,borderRadius:3,background:'var(--surface-2)',overflow:'hidden'}}>
                    <div style={{width:renewPct+'%',height:'100%',background:p.rel==='renewal'?'var(--orange)':'var(--blue)',borderRadius:3}}></div>
                  </div>
                  <div className="muted" style={{fontSize:11,marginTop:6}}>Renews {new Date(p.contractEnd).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                  {p.rel==='renewal' && <button className="btn btn-secondary btn-sm" style={{marginTop:11,width:'100%'}} onClick={()=>flash&&flash('Renewal started')}><Icon name="route" size={14}/>Start renewal</button>}
                </div>
              ) : (
                <div style={{paddingTop:11,marginTop:6,borderTop:'1px solid var(--line)',fontSize:12.5,color:'var(--ink-3)',display:'flex',alignItems:'center',gap:7}}>
                  <Icon name="shield_check" size={14} style={{color:'var(--lime)'}}/>Internal team member — no contract
                </div>
              )}
            </div>

            {/* contact */}
            <div className="card card-pad">
              <div className="eyebrow" style={{marginBottom:6}}>Contact</div>
              <InfoRow icon="mail"    label="Email"    value={p.email} copyable flash={flash}/>
              <InfoRow icon="phone"   label="Phone"    value={p.phone} copyable flash={flash}/>
              <InfoRow icon="pin_loc" label="Location" value={p.location}/>
              <InfoRow icon="clock"   label="Timezone" value={p.tz}/>
              <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--line)',fontSize:12.5,color:'var(--ink-2)',lineHeight:1.55}}>{p.bio}</div>
            </div>

            {/* collections */}
            {st.owned.length>0 && (
              <div className="card card-pad">
                <div className="eyebrow" style={{marginBottom:11}}>Collections · {st.collections}</div>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  {st.owned.map((f,i)=>(
                    <div key={f.id} onClick={()=>{window.__reviewFolder=f.name;setPage('review');}}
                      style={{display:'flex',alignItems:'center',gap:11,padding:'9px 8px',margin:'0 -8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{width:28,height:28,borderRadius:8,background:f.color+'1a',color:f.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="folder" size={15}/></span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f.name}</div>
                        <div className="muted" style={{fontSize:11,marginTop:1}}>{f.files} files · {f.size}</div>
                      </div>
                      <Icon name="chevron_right" size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* devices */}
            {st.devices.length>0 && (
              <div className="card card-pad">
                <div className="eyebrow" style={{marginBottom:11}}>Devices in custody · {st.devices.length}</div>
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  {st.devices.map((d,i)=>{
                    const ty=DEVICE_TYPE[d.type], stt=DEVICE_STATUS[d.status];
                    return (
                      <div key={d.id} onClick={()=>openDevice&&openDevice(d.id)}
                        style={{display:'flex',alignItems:'center',gap:11,padding:'9px 8px',margin:'0 -8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{width:28,height:28,borderRadius:8,background:d.color+'1a',color:d.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={ty.icon} size={15}/></span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.name}</div>
                          <div className="muted" style={{fontSize:11,marginTop:1,fontFamily:'ui-monospace,Menlo,monospace'}}>{d.ev}</div>
                        </div>
                        <span className="badge" style={{background:stt.tint,color:stt.color,height:19,fontSize:10.5,flex:'none'}}>{stt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PersonProfile, genMeetings });
