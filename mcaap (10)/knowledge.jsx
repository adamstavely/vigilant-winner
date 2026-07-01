// knowledge.jsx — Knowledge Management workspace: capture tribal knowledge into the ecosystem

const K_SOURCES = [
  {name:'Notion', sub:'Team wiki', color:'#24272D', count:512, state:'synced', t:'4m ago'},
  {name:'Confluence', sub:'Ops space', color:'#0073E6', count:1840, state:'synced', t:'1h ago'},
  {name:'OneNote', sub:'Analyst notebooks', color:'#475569', count:286, state:'syncing', t:'now'},
  {name:'Slack', sub:'#ops-floor archive', color:'#16A34A', count:9420, state:'synced', t:'12m ago'},
  {name:'SharePoint', sub:'Legacy share', color:'#B5851C', count:638, state:'review', t:'—'},
  {name:'Local notes', sub:'Desktop imports', color:'#1D3557', count:74, state:'synced', t:'2h ago'},
];
const K_STATE = {
  synced:{label:'Synced', color:'#16A34A', dot:'#16A34A'},
  syncing:{label:'Syncing…', color:'#B5851C', dot:'#B5851C'},
  review:{label:'Needs review', color:'#DC2626', dot:'#DC2626'},
};
const K_CAPTURE = [
  {who:'maya', where:'Slack · #ops-floor', text:'Walkthrough of the northern terminal collection workaround when the primary feed drops.', kind:'Procedure'},
  {who:'sam', where:'OneNote · Sam W.', text:'Contact protocol & cadence for the regional liaison — kept only in personal notes.', kind:'Contact'},
  {who:'diego', where:'Desktop · imagery-tips.md', text:'Thermal capture calibration settings that consistently beat the defaults.', kind:'Technique'},
  {who:'priya', where:'Confluence draft', text:'Reporting-threshold edge cases the standing guidance does not cover.', kind:'Guidance'},
];
const K_ARTICLES = [
  {title:'Northern Terminal — Collection Playbook', who:'maya', tags:['collection','ports'], excerpt:'End-to-end steps for tasking, fallback feeds, and quality checks against the northern terminal.', endorse:14, updated:'Jun 4'},
  {title:'Reading the Throughput Model', who:'priya', tags:['analysis','method'], excerpt:'How to interpret the quarterly throughput model, including the assumptions that most often mislead.', endorse:9, updated:'Jun 3'},
  {title:'Liaison Cadence & Etiquette', who:'sam', tags:['liaison','contacts'], excerpt:'Who to contact, when, and the phrasing that keeps coordination channels open.', endorse:21, updated:'Jun 2'},
  {title:'Thermal Imagery — Field Calibration', who:'diego', tags:['imagery','technique'], excerpt:'Calibration presets and gotchas for thermal captures across humidity bands.', endorse:7, updated:'Jun 1'},
  {title:'Sensor Grid — Trip Triage', who:'noah', tags:['sensors','triage'], excerpt:'A fast decision tree for separating real sensor trips from environmental noise.', endorse:11, updated:'May 30'},
  {title:'Cable Drafting — House Style', who:'lena', tags:['writing','memos'], excerpt:'The conventions that get cables through clearance on the first pass.', endorse:18, updated:'May 29'},
];
const K_TAG = {color:'#16A34A', tint:'#F0FDF4'};

function KnowledgeWorkspace({setPage, flash}){
  const [capture,setCapture]=React.useState(K_CAPTURE);
  function imp(i){ setCapture(c=>c.filter((_,j)=>j!==i)); flash&&flash('Imported into the knowledge base'); }

  return (
    <div className="rise">
      <WsHeader name="Language Exploitation" setPage={setPage}
        action={<button className="btn btn-primary" onClick={()=>flash&&flash('Capture started — pick a source or write a note')}><Icon name="plus" size={16} sw={2.2}/>Capture knowledge</button>}/>
      <div className="page" style={{paddingTop:24}}>
        {/* banner */}
        <div className="card" data-tour="lang-banner" style={{padding:'20px 24px',marginBottom:22,position:'relative',overflow:'hidden'}}>
          <HeroPattern opacity={0.5}/>
          <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:28,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:13,flex:1,minWidth:260}}>
              <span style={{width:46,height:46,borderRadius:12,background:'var(--lime-t)',color:'#16A34A',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="bulb" size={23}/></span>
              <div>
                <div style={{fontSize:16,fontWeight:700,letterSpacing:'-.02em',color:'var(--ink)'}}>Bring tribal knowledge into the ecosystem</div>
                <div className="muted" style={{fontSize:13,marginTop:2}}>Connect the places people already keep notes, then capture what only lives in their heads.</div>
              </div>
            </div>
            {[['Notes captured','142','#16A34A'],['Contributors','23','#0073E6'],['Sources connected','8','#475569']].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center',flex:'none'}}>
                <div style={{fontSize:26,fontWeight:700,letterSpacing:'-.03em',color:c}}>{v}</div>
                <div className="muted" style={{fontSize:11.5,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 380px',gap:22,alignItems:'start'}}>
          <div style={{minWidth:0}}>
            <SectionHead title="Knowledge articles" sub="Documented know-how, endorsed by the team" icon="book"/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginBottom:30}} data-tour="lang-articles">
              {K_ARTICLES.map((a,i)=>(
                <div key={i} className="card card-hover card-pad" style={{cursor:'pointer',display:'flex',flexDirection:'column',gap:10}} onClick={()=>flash&&flash(`Opening “${a.title}”`)}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {a.tags.map(t=><span key={t} className="badge" style={{background:K_TAG.tint,color:K_TAG.color,height:20}}>{t}</span>)}
                  </div>
                  <div style={{fontSize:15,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',lineHeight:1.3}}>{a.title}</div>
                  <div className="sec" style={{fontSize:12.5,lineHeight:1.5}}>{a.excerpt}</div>
                  <div style={{display:'flex',alignItems:'center',gap:9,marginTop:'auto',paddingTop:11,borderTop:'1px solid var(--line)'}}>
                    <Avatar id={a.who} size={22}/>
                    <span style={{fontSize:12,color:'var(--ink-2)',fontWeight:500}}>{PEOPLE[a.who].name.split(' ')[0]}</span>
                    <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                    <span className="muted" style={{fontSize:11.5}}>{a.updated}</span>
                    <div style={{flex:1}}></div>
                    <span style={{display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:'var(--ink-3)'}}><Icon name="check" size={14} sw={2.4} style={{color:'#16A34A'}}/>{a.endorse}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right rail */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div className="card card-pad" data-tour="lang-sources">
              <SectionHead title="Connected sources" sub="Where notes already live" icon="sync"/>
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                {K_SOURCES.map((s,i)=>{
                  const st=K_STATE[s.state];
                  return (
                    <div key={s.name} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 6px',borderTop:i?'1px solid var(--line)':0}}>
                      <span style={{width:32,height:32,borderRadius:8,background:s.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',fontWeight:700,fontSize:13}}>{s.name[0]}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{s.name}</div>
                        <div className="muted" style={{fontSize:11}}>{s.sub} · {s.count.toLocaleString()} items</div>
                      </div>
                      <span style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:st.color,flex:'none'}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:st.dot}}></span>{st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button className="btn btn-secondary btn-sm" style={{width:'100%',marginTop:12}} onClick={()=>flash&&flash('Connect a new source')}><Icon name="plus" size={14}/>Connect a source</button>
            </div>

            <div className="card card-pad" data-tour="lang-capture">
              <SectionHead title="Suggested to capture" sub="Knowledge stuck in one person's notes" icon="bulb"/>
              <div style={{display:'flex',flexDirection:'column',gap:11}}>
                {capture.map((c,i)=>(
                  <div key={i} style={{border:'1px solid var(--line)',borderRadius:11,padding:'12px 13px',background:'var(--surface-2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                      <Avatar id={c.who} size={20}/>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--ink)'}}>{PEOPLE[c.who].name.split(' ')[0]}</span>
                      <span className="badge" style={{background:'#fff',border:'1px solid var(--line-2)',color:'var(--ink-3)',height:18,fontWeight:500}}>{c.kind}</span>
                      <div style={{flex:1}}></div>
                      <span className="muted" style={{fontSize:10.5,fontFamily:'ui-monospace,Menlo,monospace'}}>{c.where}</span>
                    </div>
                    <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5,marginBottom:10}}>{c.text}</div>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={()=>imp(i)}><Icon name="download" size={13}/>Import</button>
                      <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)'}} onClick={()=>setCapture(cc=>cc.filter((_,j)=>j!==i))}>Dismiss</button>
                    </div>
                  </div>
                ))}
                {!capture.length && (
                  <div style={{textAlign:'center',padding:'22px 8px'}}>
                    <span style={{width:36,height:36,borderRadius:10,background:'#F0FDF4',color:'#16A34A',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={18} sw={2.4}/></span>
                    <div style={{fontSize:13,color:'var(--ink-3)',marginTop:8,fontWeight:500}}>All caught up — nothing waiting to capture.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KnowledgeWorkspace });
