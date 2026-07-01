// upload.jsx — Data Upload workspace: required intake form + dataset upload

const U_SOURCES = ['Satellite ground station','UAV ISR platform','Field reporting','SIGINT collection','Sensor network','Partner liaison feed','Manual analyst upload'];
const U_CATS = [
  {id:'imagery', label:'Imagery', icon:'image'},
  {id:'signals', label:'Signals', icon:'signal'},
  {id:'reporting', label:'Reporting', icon:'file'},
  {id:'sensor', label:'Sensor / telemetry', icon:'pulse'},
  {id:'geo', label:'Geospatial', icon:'globe'},
];
const U_CLS = [
  {id:'U', label:'Unclassified', color:'#16A34A'},
  {id:'CUI', label:'CUI', color:'#0073E6'},
  {id:'S', label:'Secret // NOFORN', color:'#DC2626'},
];
const U_TAGS = ['eastern-sector','ports','northern-terminal','coastal','infrastructure','convoy','baseline','time-sensitive'];
const U_CAVEATS = ['NOFORN','FOUO / CUI','ORCON (originator controls)','PII present','Releasable to partners'];
const U_SAMPLE_FILES = [
  {name:'pass_2026-06-05_harbor.tif', size:'248 MB', kind:'image'},
  {name:'throughput_q2.csv', size:'1.4 MB', kind:'files'},
  {name:'sector_f4_geotags.geojson', size:'320 KB', kind:'globe'},
  {name:'collection_log.pdf', size:'2.1 MB', kind:'file'},
];

function Field({label, req, hint, children, bad}){
  return (
    <div>
      <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12.5,fontWeight:600,color:bad?'#DC2626':'var(--ink-2)',marginBottom:7}}>
        {label}{req && <span style={{color:'#DC2626'}}>*</span>}
        {bad && <span style={{fontSize:11,fontWeight:500}}>· required</span>}
      </label>
      {children}
      {hint && <div className="muted" style={{fontSize:11.5,marginTop:5}}>{hint}</div>}
    </div>
  );
}

function DataUploadWorkspace({setPage, flash}){
  const [name,setName]=React.useState('');
  const [source,setSource]=React.useState('');
  const [cat,setCat]=React.useState('');
  const [cls,setCls]=React.useState('');
  const [from,setFrom]=React.useState('');
  const [to,setTo]=React.useState('');
  const [geo,setGeo]=React.useState('');
  const [desc,setDesc]=React.useState('');
  const [tags,setTags]=React.useState([]);
  const [caveats,setCaveats]=React.useState([]);
  const [files,setFiles]=React.useState([]);
  const [tried,setTried]=React.useState(false);
  const [done,setDone]=React.useState(false);
  const [over,setOver]=React.useState(false);

  function toggle(arr,set,v){ set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]); }
  function addFiles(){
    const pick=U_SAMPLE_FILES.filter(f=>!files.some(x=>x.name===f.name)).slice(0,2);
    if(!pick.length){ flash&&flash('All sample files already added'); return; }
    pick.forEach((f,k)=>{
      const id=f.name;
      setFiles(arr=>[...arr,{...f,id,progress:6}]);
      const iv=setInterval(()=>{
        setFiles(arr=>arr.map(x=>x.id===id?{...x,progress:Math.min(100,x.progress+Math.random()*22+10)}:x));
      },180);
      setTimeout(()=>clearInterval(iv),1800);
    });
  }
  function removeFile(id){ setFiles(arr=>arr.filter(f=>f.id!==id)); }

  const missing={ name:!name.trim(), source:!source, cat:!cat, cls:!cls, desc:!desc.trim(), files:!files.length };
  const valid=!Object.values(missing).some(Boolean);

  function submit(){
    setTried(true);
    if(!valid){ flash&&flash('Complete the required fields before submitting'); return; }
    setDone(true); flash&&flash('Dataset submitted to the ingest queue');
  }

  const inputStyle={width:'100%',height:40,border:'1px solid var(--line-2)',borderRadius:9,padding:'0 13px',fontSize:14,fontFamily:'inherit',outline:'none',background:'#fff'};

  if(done) return <UploadDone name={name} files={files} onAnother={()=>{setDone(false);setName('');setSource('');setCat('');setCls('');setDesc('');setTags([]);setCaveats([]);setFiles([]);setTried(false);}} setPage={setPage}/>;

  return (
    <div className="rise">
      <WsHeader name="Data Upload" setPage={setPage}/>
      <div className="page" style={{paddingTop:24}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 340px',gap:24,alignItems:'start',maxWidth:1180}}>
          {/* FORM */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            {/* dataset details */}
            <div className="card card-pad" data-tour="upload-details">
              <SectionHead title="Dataset details" sub="Describe the data so others can find and trust it" icon="database"/>
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <Field label="Dataset name" req bad={tried&&missing.name}>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Northern Terminal — Q2 Throughput"
                    style={{...inputStyle,borderColor:tried&&missing.name?'#DC2626':'var(--line-2)'}}/>
                </Field>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  <Field label="Source system" req bad={tried&&missing.source}>
                    <select value={source} onChange={e=>setSource(e.target.value)} style={{...inputStyle,borderColor:tried&&missing.source?'#DC2626':'var(--line-2)',color:source?'var(--ink)':'var(--ink-4)'}}>
                      <option value="">Select a source…</option>
                      {U_SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Owner">
                    <div style={{...inputStyle,display:'flex',alignItems:'center',gap:9,background:'var(--surface-2)'}}>
                      <Avatar id="tyler" size={22}/><span style={{fontSize:13.5,color:'var(--ink-2)',fontWeight:500}}>Tyler Chen (you)</span>
                    </div>
                  </Field>
                </div>
                <Field label="Data category" req bad={tried&&missing.cat}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {U_CATS.map(c=>(
                      <button key={c.id} onClick={()=>setCat(c.id)} style={{display:'inline-flex',alignItems:'center',gap:7,height:36,padding:'0 14px',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:550,transition:'.12s',
                        border:'1px solid '+(cat===c.id?'var(--primary)':'var(--line-2)'),background:cat===c.id?'var(--primary)':'#fff',color:cat===c.id?'#fff':'var(--ink-2)'}}>
                        <Icon name={c.icon} size={15}/>{c.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Classification" req bad={tried&&missing.cls}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {U_CLS.map(c=>(
                      <button key={c.id} onClick={()=>setCls(c.id)} style={{display:'inline-flex',alignItems:'center',gap:8,height:36,padding:'0 14px',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:600,transition:'.12s',
                        border:'1.5px solid '+(cls===c.id?c.color:'var(--line-2)'),background:cls===c.id?c.color+'12':'#fff',color:cls===c.id?c.color:'var(--ink-3)'}}>
                        <span style={{width:9,height:9,borderRadius:'50%',background:c.color}}></span>{c.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            {/* coverage */}
            <div className="card card-pad">
              <SectionHead title="Coverage & context" sub="Time and place this data covers" icon="globe"/>
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                  <Field label="Date from"><input value={from} onChange={e=>setFrom(e.target.value)} placeholder="2026-04-01" style={inputStyle}/></Field>
                  <Field label="Date to"><input value={to} onChange={e=>setTo(e.target.value)} placeholder="2026-06-30" style={inputStyle}/></Field>
                  <Field label="Geographic coverage" hint="Sector / coordinates"><input value={geo} onChange={e=>setGeo(e.target.value)} placeholder="Sector F4–G5" style={inputStyle}/></Field>
                </div>
                <Field label="Description" req bad={tried&&missing.desc}>
                  <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What is in this dataset, how it was collected, and any limitations…"
                    style={{...inputStyle,height:96,padding:'11px 13px',lineHeight:1.5,resize:'vertical',borderColor:tried&&missing.desc?'#DC2626':'var(--line-2)'}}/>
                </Field>
                <Field label="Tags" hint="Improves discovery in Explore">
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    {U_TAGS.map(t=>(
                      <button key={t} onClick={()=>toggle(tags,setTags,t)} className={'chip'+(tags.includes(t)?' on':'')} style={{height:28}}>{t}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Handling caveats">
                  <div style={{display:'flex',flexDirection:'column',gap:7}}>
                    {U_CAVEATS.map(c=>(
                      <label key={c} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--ink-2)',cursor:'pointer'}}>
                        <span onClick={()=>toggle(caveats,setCaveats,c)} style={{width:18,height:18,borderRadius:5,border:'1.5px solid',borderColor:caveats.includes(c)?'var(--primary)':'var(--line-2)',background:caveats.includes(c)?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',transition:'.12s'}}>{caveats.includes(c)&&<Icon name="check" size={11} sw={3} style={{color:'#fff'}}/>}</span>
                        {c}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            {/* files */}
            <div className="card card-pad" data-tour="upload-files">
              <SectionHead title="Files" sub="Upload the dataset files" icon="upload"/>
              <div onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
                onDrop={e=>{e.preventDefault();setOver(false);addFiles();}} onClick={addFiles}
                style={{border:'1.5px dashed '+(over?'var(--blue)':tried&&missing.files?'#DC2626':'var(--line-2)'),borderRadius:12,padding:'30px 20px',textAlign:'center',cursor:'pointer',
                  background:over?'var(--blue-t)':'var(--surface-2)',transition:'.15s'}}>
                <span style={{width:46,height:46,borderRadius:12,background:'#fff',border:'1px solid var(--line)',color:'var(--blue)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="upload" size={22}/></span>
                <div style={{fontSize:14,fontWeight:600,color:'var(--ink)',marginTop:11}}>Drag files here, or <span style={{color:'var(--blue)'}}>browse</span></div>
                <div className="muted" style={{fontSize:12,marginTop:3}}>TIFF, CSV, GeoJSON, PDF, ZIP · up to 5 GB per file</div>
              </div>
              {files.length>0 && (
                <div style={{display:'flex',flexDirection:'column',gap:9,marginTop:14}}>
                  {files.map(f=>{
                    const pct=Math.round(f.progress), uploading=pct<100;
                    return (
                      <div key={f.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 13px',border:'1px solid var(--line)',borderRadius:10}}>
                        <span style={{width:34,height:34,borderRadius:9,background:'var(--surface-2)',border:'1px solid var(--line)',color:'var(--ink-3)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={f.kind} size={16}/></span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',gap:10}}>
                            <span style={{fontSize:13,fontWeight:550,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{f.name}</span>
                            <span className="muted" style={{fontSize:11.5,flex:'none'}}>{f.size}</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:9,marginTop:6}}>
                            <div style={{flex:1,height:5,background:'#F1F5F9',borderRadius:3,overflow:'hidden'}}><div style={{width:pct+'%',height:'100%',background:uploading?'var(--blue)':'#16A34A',borderRadius:3,transition:'width .18s'}}></div></div>
                            <span style={{fontSize:11,fontWeight:600,color:uploading?'var(--blue)':'#16A34A',flex:'none',width:64,textAlign:'right'}}>{uploading?`${pct}%`:'Uploaded'}</span>
                          </div>
                        </div>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={e=>{e.stopPropagation();removeFile(f.id);}}><Icon name="x" size={15}/></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY RAIL */}
          <div style={{position:'sticky',top:'calc(var(--header-h) + 16px)',display:'flex',flexDirection:'column',gap:14}}>
            <div className="card card-pad" data-tour="upload-checklist">
              <div className="eyebrow" style={{marginBottom:12}}>Intake checklist</div>
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                {[['Dataset name',!missing.name],['Source system',!missing.source],['Category',!missing.cat],['Classification',!missing.cls],['Description',!missing.desc],['At least one file',!missing.files]].map(([l,ok])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',fontSize:13,color:ok?'var(--ink-2)':'var(--ink-3)'}}>
                    <span style={{width:19,height:19,borderRadius:'50%',background:ok?'#F0FDF4':'#F1F5F9',color:ok?'#16A34A':'var(--ink-4)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={ok?'check':'x'} size={11} sw={3}/></span>
                    {l}
                  </div>
                ))}
              </div>
              <div style={{height:1,background:'var(--line)',margin:'13px 0'}}></div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12.5}}>
                <span className="muted">Files</span><span style={{fontWeight:600,color:'var(--ink)'}}>{files.length}</span>
              </div>
              {cls && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12.5,marginTop:7}}>
                <span className="muted">Classification</span>
                <span style={{fontWeight:700,color:U_CLS.find(c=>c.id===cls).color}}>{U_CLS.find(c=>c.id===cls).label}</span>
              </div>}
              <button className="btn btn-primary" style={{width:'100%',marginTop:15,opacity:valid?1:.85}} onClick={submit}><Icon name="database" size={16}/>Submit to ingest</button>
              {tried && !valid && <div style={{fontSize:11.5,color:'#DC2626',marginTop:9,textAlign:'center',fontWeight:500}}>Some required fields are missing.</div>}
            </div>
            <div className="card card-pad" style={{background:'var(--surface-2)'}}>
              <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <Icon name="shield" size={16} style={{color:'var(--ink-3)',flex:'none',marginTop:1}}/>
                <div className="muted" style={{fontSize:12,lineHeight:1.5}}>Submissions enter the ingest queue, are validated against the schema, then indexed into Explore and the knowledge base.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadDone({name, files, onAnother, setPage}){
  return (
    <div className="rise">
      <WsHeader name="Data Upload" setPage={setPage}/>
      <div className="page" style={{paddingTop:24,maxWidth:680,margin:'0 auto'}}>
        <div className="card card-pad" style={{textAlign:'center',padding:'40px 28px'}}>
          <span style={{width:60,height:60,borderRadius:16,background:'#F0FDF4',color:'#16A34A',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={30} sw={2.4}/></span>
          <h2 style={{fontSize:22,fontWeight:700,letterSpacing:'-.02em',margin:'18px 0 0',color:'var(--ink)'}}>Submitted to the ingest queue</h2>
          <p className="sec" style={{fontSize:14,margin:'8px 0 0',lineHeight:1.55}}><b style={{color:'var(--ink)'}}>{name||'Your dataset'}</b> — {files.length} file{files.length===1?'':'s'} — is now validating against the schema. You'll be notified when it's indexed.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:22}}>
            <button className="btn btn-primary" onClick={onAnother}><Icon name="plus" size={16} sw={2.2}/>Upload another</button>
            <button className="btn btn-secondary" onClick={()=>setPage('explore')}><Icon name="globe" size={15}/>Go to Explore</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DataUploadWorkspace });
