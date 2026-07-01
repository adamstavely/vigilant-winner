// device.jsx — Device detail page

// content categories present on a device, scaled to its file count
const DEV_CATS = [
  {key:'photos',   label:'Photos & Video', icon:'image', color:'#0EA5E9', w:0.34},
  {key:'messages', label:'Messages',       icon:'message', color:'#0073E6', w:0.22},
  {key:'docs',     label:'Documents',      icon:'file', color:'#16A34A', w:0.14},
  {key:'apps',     label:'App Data',       icon:'apps', color:'#475569', w:0.12},
  {key:'browser',  label:'Browser & Web',  icon:'globe', color:'#B5851C', w:0.09},
  {key:'calls',    label:'Call Logs',      icon:'phone', color:'#1D3557', w:0.05},
  {key:'mail',     label:'Email',          icon:'mail', color:'#0EA5E9', w:0.04},
];

function DevStat({value, label, icon, color}){
  return (
    <div className="card card-pad" style={{display:'flex',alignItems:'center',gap:13}}>
      <span style={{width:38,height:38,borderRadius:10,background:(color||'#0073E6')+'1a',color:color||'#0073E6',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={icon} size={19}/></span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:21,fontWeight:700,color:'var(--ink)',letterSpacing:'-.02em',lineHeight:1,whiteSpace:'nowrap'}}>{value}</div>
        <div className="muted" style={{fontSize:11.5,marginTop:3,fontWeight:500}}>{label}</div>
      </div>
    </div>
  );
}

function DevInfoRow({icon, label, value, mono, last, accent}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:11,padding:'9px 0',borderBottom:last?0:'1px solid var(--line)'}}>
      <Icon name={icon} size={15} style={{color:'var(--ink-4)',flex:'none'}}/>
      <span style={{fontSize:12.5,color:'var(--ink-3)',width:84,flex:'none'}}>{label}</span>
      <span style={{flex:1,minWidth:0,fontSize:12.5,color:accent||'var(--ink)',fontWeight:550,textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontFamily:mono?'ui-monospace,Menlo,monospace':'inherit'}}>{value}</span>
    </div>
  );
}

function DeviceDetail({id, setPage, openPerson, flash}){
  const d = DEVICES.find(x=>x.id===id) || DEVICES[0];
  const ty = DEVICE_TYPE[d.type], stt = DEVICE_STATUS[d.status];
  const cust = PEOPLE[d.custodian];
  const locked = d.status==='locked';
  const [menuOpen,setMenuOpen]=React.useState(false);
  const [cocOpen,setCocOpen]=React.useState(false);

  const cats = DEV_CATS.map(c=>({...c, n: Math.round(d.files*c.w)}));

  // extraction / chain-of-custody timeline
  const steps = [
    {label:'Acquired', who:cust, when:d.acquired, icon:'inbox', done:true, note:d.loc},
    {label:'Imaged', who:cust, when:d.acquired, icon:'harddrive', done:!locked, note:locked?'Awaiting passcode unlock':'Bit-for-bit forensic image'},
    {label:'Processing', who:PEOPLE.tyler, when:d.last, icon:'cpu', done:d.status==='extracted'||d.status==='review', note:'Indexing & content analysis'},
    {label:'Extracted', who:PEOPLE.aria, when:d.last, icon:'shield_check', done:d.status==='extracted', note:d.status==='extracted'?`${d.files.toLocaleString()} items ready`:'Pending'},
  ];

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
            <span style={{color:'var(--ink-2)'}}>{d.name}</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,minWidth:0}}>
              <span style={{width:64,height:64,borderRadius:15,background:d.color+'1a',color:d.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={ty.icon} size={30}/></span>
              <div style={{minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>{d.name}</h1>
                  <span className="badge" style={{background:stt.tint,color:stt.color,height:21,fontWeight:600}}><span style={{width:5.5,height:5.5,borderRadius:'50%',background:stt.color}}></span>{stt.label}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:9,marginTop:7,fontSize:12.5,color:'var(--ink-3)',flexWrap:'wrap'}}>
                  <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontWeight:600,color:'var(--ink-2)'}}>{d.ev}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span>{ty.label}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Icon name={d.encrypted?'lock':'unlock'} size={13}/>{d.encrypted?'Encrypted':'Unencrypted'}</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:13}}>
              <div style={{display:'flex',gap:9,flexWrap:'wrap',justifyContent:'flex-end'}}>
                <button className="btn btn-primary btn-sm" disabled={locked} style={locked?{opacity:.5,pointerEvents:'none'}:{}} onClick={()=>{window.__reviewFolder=d.name;setPage('review');}}><Icon name="files" size={15}/>Browse files</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Preparing export…')}><Icon name="download" size={15}/>Export</button>
                <div style={{position:'relative'}}>
                  <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',padding:'0 10px'}} onClick={()=>setMenuOpen(o=>!o)}><Icon name="more" size={16}/></button>
                  {menuOpen && (
                    <React.Fragment>
                      <div onClick={()=>setMenuOpen(false)} style={{position:'fixed',inset:0,zIndex:60}}></div>
                      <div className="pop card" style={{position:'absolute',top:40,right:0,width:228,padding:6,zIndex:61,boxShadow:'var(--shadow-lg)',borderRadius:11,textAlign:'left'}}>
                        {[
                          {ic:'route',  label:'Chain of custody', fn:()=>{setCocOpen(true);}},
                          {ic:'shield_check', label:'Verify integrity', fn:()=>flash&&flash('Re‑verifying hash…')},
                          {ic:'download', label:'Export report (PDF)', fn:()=>flash&&flash('Generating report…')},
                          {ic:'harddrive', label:'Re‑acquire image', fn:()=>flash&&flash('Re‑acquisition queued')},
                        ].map(it=>(
                          <button key={it.label} onClick={()=>{setMenuOpen(false);it.fn();}}
                            style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',border:0,background:'transparent',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500,color:'var(--ink-2)',textAlign:'left'}}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--hover)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <Icon name={it.ic} size={15} style={{color:'var(--ink-3)',flex:'none'}}/>{it.label}
                          </button>
                        ))}
                        <div style={{height:1,background:'var(--line)',margin:'5px 6px'}}></div>
                        <button onClick={()=>{setMenuOpen(false);flash&&flash('Removed from workspace');}}
                          style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',border:0,background:'transparent',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500,color:'var(--coral)',textAlign:'left'}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--coral-t)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <Icon name="trash" size={15} style={{flex:'none'}}/>Remove device
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <span style={{width:30,height:30,borderRadius:8,background:'var(--lime-t)',color:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="shield_check" size={16}/></span>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)'}}>Integrity verified</div>
                  <div className="muted" style={{fontSize:11,marginTop:1,whiteSpace:'nowrap'}}>SHA‑256 hash verified ✓</div>
                </div>
              </div>
            </div>
          </div>
          {/* specs strip */}
          <div style={{display:'flex',alignItems:'center',gap:'14px 20px',marginTop:18,paddingTop:16,borderTop:'1px solid var(--line)',flexWrap:'wrap'}}>
            {[
              ['Model', d.model, false],
              ['OS', d.os, false],
              ['Capacity', `${d.size} / ${d.cap}`, false],
              ['Encryption', d.encrypted?'Enabled':'None', false],
              ['Serial', d.serial, true],
              ['Acquired', d.acquired, false],
              ['Intake', d.loc, false],
            ].map(([l,v,m],i)=>(
              <React.Fragment key={l}>
                {i>0 && <span style={{width:1,height:28,background:'var(--line)',flex:'none'}}></span>}
                <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:0}}>
                  <span style={{fontSize:10,fontWeight:600,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--ink-4)'}}>{l}</span>
                  <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',fontFamily:m?'ui-monospace,Menlo,monospace':'inherit'}}>{v}</span>
                </div>
              </React.Fragment>
            ))}
            {/* custodian */}
            <span style={{width:1,height:28,background:'var(--line)',flex:'none'}}></span>
            <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:0}}>
              <span style={{fontSize:10,fontWeight:600,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--ink-4)'}}>Custodian</span>
              <span onClick={()=>openPerson&&openPerson(cust.id)} style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer'}}>
                <Avatar id={cust.id} size={18}/>
                <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap'}}>{cust.name}</span>
                <Icon name="chevron_right" size={13} style={{color:'var(--ink-4)'}}/>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="page" style={{paddingTop:24,display:'flex',flexDirection:'column',gap:20}}>
        {/* stat tiles */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          <DevStat value={locked?'—':d.files.toLocaleString()} label="Items extracted" icon="files" color="#0073E6"/>
          <DevStat value={d.size} label={`of ${d.cap} used`} icon="harddrive" color="#16A34A"/>
          <DevStat value={locked?'—':d.apps} label="Applications" icon="apps" color="#475569"/>
          <DevStat value={d.last} label="Last activity" icon="clock" color="#B5851C"/>
        </div>

        {/* artifacts — centerpiece, full width */}
        {locked ? (
          <div className="card card-pad" style={{textAlign:'center',padding:'56px 20px'}}>
            <span style={{width:52,height:52,borderRadius:14,background:'var(--coral-t)',color:'var(--coral)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="lock" size={26}/></span>
            <div style={{fontSize:16,fontWeight:700,color:'var(--ink)',marginTop:13}}>Device is locked</div>
            <div className="muted" style={{fontSize:13,marginTop:5,maxWidth:380,margin:'5px auto 0',lineHeight:1.55}}>This device is encrypted and awaiting passcode unlock before a forensic image can be taken. No content has been extracted yet.</div>
            <button className="btn btn-secondary btn-sm" style={{marginTop:16}} onClick={()=>flash&&flash('Unlock request submitted')}><Icon name="fingerprint" size={15}/>Request unlock</button>
          </div>
        ) : (
          <DeviceArtifacts device={d} flash={flash}/>
        )}
      </div>

      {/* chain of custody modal */}
      {cocOpen && (
        <div onClick={()=>setCocOpen(false)} style={{position:'fixed',inset:0,zIndex:300,background:'rgba(20,32,52,.34)',backdropFilter:'blur(2px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div className="pop card" onClick={e=>e.stopPropagation()} style={{width:460,maxWidth:'100%',maxHeight:'86vh',overflowY:'auto',padding:0,boxShadow:'var(--shadow-lg)',borderRadius:14}}>
            <div style={{display:'flex',alignItems:'center',gap:11,padding:'16px 20px',borderBottom:'1px solid var(--line)'}}>
              <span style={{width:34,height:34,borderRadius:9,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="route" size={17}/></span>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:'var(--ink)'}}>Chain of custody</div>
                <div className="muted" style={{fontSize:12,marginTop:1}}>{d.name} · {d.ev}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setCocOpen(false)}><Icon name="x" size={17}/></button>
            </div>
            <div style={{padding:'18px 20px'}}>
              {steps.map((s,i)=>(
                <div key={i} style={{display:'flex',gap:14,position:'relative'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:'none'}}>
                    <span style={{width:32,height:32,borderRadius:'50%',background:s.done?'var(--blue-t)':'var(--surface-2)',color:s.done?'var(--blue)':'var(--ink-4)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid '+(s.done?'transparent':'var(--line-2)'),flex:'none'}}><Icon name={s.done?'check':s.icon} size={15} sw={s.done?2.4:1.75}/></span>
                    {i<steps.length-1 && <span style={{width:2,flex:1,background:s.done?'var(--blue)':'var(--line)',opacity:s.done?.35:1,minHeight:22}}></span>}
                  </div>
                  <div style={{flex:1,paddingBottom:i<steps.length-1?16:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                      <span style={{fontSize:13.5,fontWeight:600,color:'var(--ink)'}}>{s.label}</span>
                      {!s.done && <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-4)',height:18,fontSize:10.5,border:'1px solid var(--line-2)'}}>Pending</span>}
                      <span className="muted" style={{fontSize:11.5,marginLeft:'auto'}}>{s.when}</span>
                    </div>
                    <div className="muted" style={{fontSize:12,marginTop:3}}>{s.note}</div>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:11.5,color:'var(--ink-3)'}}><Avatar id={s.who.id} size={17}/>{s.who.name}</div>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',alignItems:'center',gap:9,marginTop:6,padding:'11px 13px',background:'var(--lime-t)',borderRadius:10}}>
                <Icon name="shield_check" size={16} style={{color:'var(--lime)',flex:'none'}}/>
                <span style={{fontSize:12,color:'var(--ink-2)'}}>Integrity verified — <span style={{fontFamily:'ui-monospace,Menlo,monospace'}}>SHA‑256</span> matches the original acquisition image.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DeviceDetail });
