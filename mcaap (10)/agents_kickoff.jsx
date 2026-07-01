// agents_kickoff.jsx — "New request" chooser + delegate-to-agent launcher

// request types — each maps to a workflow; agent-backed ones name their agent
const REQUEST_TYPES = [
  {id:'review',    label:'Document review',     sub:'First-pass responsiveness & relevance coding', icon:'inbox',       color:'#0073E6', agent:'atlas'},
  {id:'privilege', label:'Privilege review',    sub:'Flag privilege & build the log',               icon:'shield',      color:'#B5851C', agent:'cassius'},
  {id:'clearance', label:'Clearance screen',    sub:'Screen a statement or filing for risk',        icon:'megaphone',   color:'#16A34A', agent:'vesta'},
  {id:'dataupload',label:'Data upload',       sub:'Intake forms & bring datasets into the ecosystem', icon:'database', color:'#1D3557', agent:null, page:'upload'},
  {id:'depo',      label:'Deposition prep',     sub:'Outlines, exhibits & designations',            icon:'mic',         color:'#475569', agent:'juno'},
  {id:'research',  label:'Research question',   sub:'Ask across the matter & case law',             icon:'bulb',        color:'#16A34A', agent:'oracle'},
  {id:'language',  label:'Language / translation',sub:'Translate & adapt for a market',             icon:'route',       color:'#0073E6', agent:null},
  {id:'approval',  label:'Approval / sign-off', sub:'Route to a person for approval',               icon:'check_square',color:'#1D3557', agent:null},
];

function ModalShell({ onClose, width=620, children }){
  React.useEffect(()=>{const esc=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc);},[]);
  return (
    <div style={{position:'fixed',inset:0,zIndex:320,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'7vh',paddingBottom:'4vh',overflowY:'auto'}}>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(36,39,45,.34)',backdropFilter:'blur(2px)',animation:'fade .2s'}}></div>
      <div className="pop card" style={{position:'relative',width:`min(${width}px,94vw)`,boxShadow:'var(--shadow-lg)',borderRadius:16,overflow:'hidden'}}>{children}</div>
    </div>
  );
}

// ---- the "what do you need?" chooser ----
function NewRequestModal({ onClose, onDelegate, onTeamRequest, glyph='diamond', flat=false, framing='codename' }){
  const [sel,setSel] = React.useState(null);
  const chosen = REQUEST_TYPES.find(t=>t.id===sel);
  return (
    <ModalShell onClose={onClose} width={640}>
      <div style={{padding:'18px 22px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:11}}>
          <span style={{width:32,height:32,borderRadius:9,background:'var(--primary-tint)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="plus" size={18} sw={2.2}/></span>
          <div>
            <div style={{fontSize:16,fontWeight:700,letterSpacing:'-.02em'}}>New request</div>
            <div className="muted" style={{fontSize:12}}>What do you need? Hand it to your team — or to an agent.</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
      </div>

      <div style={{padding:'18px 22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
          {REQUEST_TYPES.map(t=>{
            const on = sel===t.id;
            return (
              <button key={t.id} onClick={()=>setSel(t.id)} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 13px',textAlign:'left',
                border:'1.5px solid '+(on?t.color:'var(--line)'),borderRadius:12,background:on?t.color+'0d':'#fff',cursor:'pointer',transition:'.14s',position:'relative'}}
                onMouseEnter={e=>{if(!on)e.currentTarget.style.borderColor='var(--line-2)';}}
                onMouseLeave={e=>{if(!on)e.currentTarget.style.borderColor='var(--line)';}}>
                <span style={{width:36,height:36,borderRadius:9,background:'var(--hover)',color:'var(--ink-2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={t.icon} size={18}/></span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:650,color:'var(--ink)',display:'flex',alignItems:'center',gap:6}}>{t.label}</div>
                  <div className="muted" style={{fontSize:11.5,lineHeight:1.4,marginTop:2}}>{t.sub}</div>
                </div>
                {on && <span style={{position:'absolute',top:11,right:11,width:18,height:18,borderRadius:'50%',background:t.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={12} sw={3} style={{color:'#fff'}}/></span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:'14px 22px',borderTop:'1px solid var(--line)',display:'flex',alignItems:'center',gap:10,background:'var(--surface-2)'}}>
        {chosen && chosen.agent
          ? <span style={{fontSize:12,color:'var(--ink-2)',display:'flex',alignItems:'center',gap:7}}>
              <Icon name="sparkle" size={14} style={{color:chosen.color}}/>{AGENTS[chosen.agent].code} can take this now, or assign it to a teammate.
            </span>
          : <span className="muted" style={{fontSize:12}}>{chosen?(chosen.page?'Opens the '+chosen.label+' workspace.':'This request routes to a teammate.'):'Choose a request type to continue.'}</span>}
        <div style={{flex:1}}></div>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        {chosen && chosen.page &&
          <button className="btn btn-primary" onClick={()=>{onClose(); window.__setPage&&window.__setPage(chosen.page);}}>Open {chosen.label}<Icon name="arrow_right" size={15}/></button>}
        {chosen && !chosen.agent && !chosen.page &&
          <button className="btn btn-primary" onClick={()=>onTeamRequest(chosen)}>Continue<Icon name="arrow_right" size={15}/></button>}
        {chosen && chosen.agent && <>
          <button className="btn btn-secondary" onClick={()=>onTeamRequest(chosen)}><Icon name="user" size={15}/>Assign to team</button>
          <button className="btn btn-primary" onClick={()=>onDelegate(chosen.agent, chosen)}>
            <Icon name="sparkle" size={15}/>Delegate to {AGENTS[chosen.agent].code}
          </button>
        </>}
      </div>
    </ModalShell>
  );
}

// ---- delegate-to-agent launcher ----
const SCOPE_SOURCES = {
  atlas:[['VANT-PROD-002 production','4,820 docs · 6 custodians'],['Caldwell custodian set','2,140 docs'],['Full review universe','38,402 docs']],
  cassius:[['GC separation memo set','248 docs'],['VANT-PROD-002 production','4,820 docs'],['Flagged-for-privilege queue','61 docs']],
  vesta:[['Draft press release','MSJ filing'],['Media statement — depositions','1 doc'],['Upload a statement','—']],
  solon:[['Motion for Summary Judgment','brief shell + record'],['Reply brief','from template'],['New memo','blank']],
  juno:[['Henderson deposition','custodial file + chronology'],['Caldwell deposition','designations'],['New witness','—']],
  oracle:[['Vantage v. Meridian record','full matter'],['Case law only','9th Cir.'],['Knowledge base','142 docs']],
};

function KickoffModal({ onClose, agentId, prefill, launch, glyph='diamond', flat=false, framing='codename' }){
  const [aid,setAid] = React.useState(agentId || 'atlas');
  const a = AGENTS[aid];
  const [instr,setInstr] = React.useState('');
  const [src,setSrc] = React.useState(0);
  const [mode,setMode] = React.useState(a.autonomyDefault);
  const sources = SCOPE_SOURCES[aid]||SCOPE_SOURCES.atlas;
  React.useEffect(()=>{ setMode(AGENTS[aid].autonomyDefault); setSrc(0); },[aid]);

  const PLACE={atlas:'e.g. Code VANT-PROD-002 for responsiveness; flag anything touching the separation terms as hot.',
    cassius:'e.g. Review the GC separation memos for attorney–client privilege and draft log entries.',
    vesta:'e.g. Screen this press release for Rule 3.6 and privilege issues before we release it.',
    solon:'e.g. Draft the argument section establishing no genuine dispute on the separation terms.',
    juno:'e.g. Build a cross outline for Henderson and tie exhibits to the chronology.',
    oracle:'e.g. What is the 9th Circuit standard for spoliation sanctions after the FRCP 37(e) amendments?'};

  return (
    <ModalShell onClose={onClose} width={760}>
      <div style={{display:'grid',gridTemplateColumns:'232px 1fr'}}>
        {/* left: agent picker */}
        <div style={{borderRight:'1px solid var(--line)',background:'var(--surface-2)',padding:'16px 14px',display:'flex',flexDirection:'column',gap:5}}>
          <div className="eyebrow" style={{padding:'2px 6px 8px'}}>Pick an agent</div>
          {AGENT_ORDER.map(id=>{
            const ag=AGENTS[id], on=id===aid;
            return (
              <button key={id} onClick={()=>setAid(id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 9px',borderRadius:10,border:'1px solid '+(on?ag.color+'55':'transparent'),
                background:on?'#fff':'transparent',cursor:'pointer',textAlign:'left',boxShadow:on?'var(--shadow-sm)':'none',transition:'.12s'}}
                onMouseEnter={e=>{if(!on)e.currentTarget.style.background='#fff';}} onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent';}}>
                <AgentToken id={id} size={32} glyph={glyph} flat={flat}/>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:700,color:'var(--ink)',whiteSpace:'nowrap'}}>{framing==='role'?ag.role:ag.code}</div>
                  <div className="muted" style={{fontSize:10.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:150}}>{ag.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* right: config */}
        <div style={{display:'flex',flexDirection:'column',minWidth:0}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:12}}>
            <AgentToken id={aid} size={40} glyph={glyph} flat={flat}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15.5,fontWeight:700,letterSpacing:'-.02em',color:'var(--ink)'}}>Delegate to {a.code}</div>
              <div className="muted" style={{fontSize:11.5}}>{a.skill}</div>
            </div>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={17}/></button>
          </div>

          <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:17,maxHeight:'56vh',overflowY:'auto'}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--ink-3)',display:'block',marginBottom:7}}>What should {a.code} do?</label>
              <textarea autoFocus value={instr} onChange={e=>setInstr(e.target.value)} placeholder={PLACE[aid]} rows={3}
                style={{width:'100%',border:'1px solid var(--line-2)',borderRadius:10,padding:'10px 12px',fontSize:13,fontFamily:'inherit',outline:'none',resize:'vertical',lineHeight:1.5}}
                onFocus={e=>e.target.style.borderColor=a.color} onBlur={e=>e.target.style.borderColor='var(--line-2)'}/>
            </div>

            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--ink-3)',display:'block',marginBottom:7}}>Scope — what it works on</label>
              <div style={{display:'flex',flexDirection:'column',gap:7}}>
                {sources.map((sc,i)=>(
                  <button key={i} onClick={()=>setSrc(i)} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 12px',borderRadius:10,
                    border:'1.5px solid '+(src===i?a.color:'var(--line)'),background:src===i?a.tint+'66':'#fff',cursor:'pointer',textAlign:'left',transition:'.13s'}}>
                    <span style={{width:18,height:18,borderRadius:'50%',border:'2px solid '+(src===i?a.color:'var(--line-2)'),flex:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {src===i && <span style={{width:8,height:8,borderRadius:'50%',background:a.color}}></span>}</span>
                    <span style={{fontSize:13,fontWeight:600,color:'var(--ink)',flex:1}}>{sc[0]}</span>
                    <span className="muted" style={{fontSize:11.5,fontFamily:"ui-monospace,Menlo,monospace"}}>{sc[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--ink-3)',display:'block',marginBottom:7}}>Autonomy</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                {Object.entries(AUTONOMY).map(([k,m])=>{
                  const on=mode===k;
                  return (
                    <button key={k} onClick={()=>setMode(k)} style={{padding:'11px 11px',borderRadius:11,border:'1.5px solid '+(on?m.color:'var(--line)'),
                      background:on?m.color+'10':'#fff',cursor:'pointer',textAlign:'left',transition:'.13s'}}>
                      <Icon name={m.icon} size={17} style={{color:on?m.color:'var(--ink-3)'}}/>
                      <div style={{fontSize:12.5,fontWeight:700,color:on?m.color:'var(--ink)',marginTop:6}}>{m.label}</div>
                      <div className="muted" style={{fontSize:10.5,lineHeight:1.35,marginTop:2}}>{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{display:'flex',alignItems:'flex-start',gap:9,padding:'11px 13px',borderRadius:10,background:'#F0F9F5',border:'1px solid #CDEBDD'}}>
              <Icon name="shield_check" size={16} sw={2} style={{color:'#16A34A',flex:'none',marginTop:1}}/>
              <span style={{fontSize:11.5,color:'#1F7A5C',lineHeight:1.45}}>Scoped to <b>Vantage v. Meridian</b>. {a.code} can read & draft but <b>cannot file, serve, or send externally</b>. Every action is logged to the audit trail.</span>
            </div>
          </div>

          <div style={{padding:'14px 20px',borderTop:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,background:'var(--surface-2)'}}>
            <AutonomyChip mode={mode}/>
            <div style={{display:'flex',gap:9}}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>launch(aid,mode)} style={{background:a.color}}>
                <Icon name="sparkle" size={16}/>Launch {a.code}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

Object.assign(window, { NewRequestModal, KickoffModal, REQUEST_TYPES });
