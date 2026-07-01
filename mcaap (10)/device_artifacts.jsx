// device_artifacts.jsx — forensic artifact data + tabbed explorer for the device view

// ---- seeded RNG so each device has stable, distinct extracted data ----
function _aSeed(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
function _aRng(seed){ return function(){ let t=seed+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
const _aPick=(r,a)=>a[Math.floor(r()*a.length)];
const _aPal=['#0073E6','#475569','#16A34A','#B5851C','#0EA5E9','#0073E6','#16A34A','#1D3557'];

const _FIRST=['James','Maria','Wei','Omar','Sofia','Liam','Aisha','Noah','Yuki','Ivan','Elena','Carlos','Fatima','Hassan','Grace','Tomas','Nadia','Ravi','Lena','Marcus','Priya','Dmitri','Sara','Kofi','Mei','Andre','Zoe','Pavel','Layla','Sean'];
const _LAST=['Okonkwo','Petrov','Nguyen','Al‑Rashid','Moreno','Carter','Khan','Bauer','Tanaka','Volkov','Reyes','Haddad','Lindqvist','Osei','Cohen','Romano','Park','Silva','Novak','Abbas','Chen','Ferreira','Kowalski','Mbeki','Hofer','Diaz','Walsh','Ito','Brandt','Mensah'];
const _ORGS=['—','Northwind Logistics','Harbor Authority','Meridian Freight','Delta Holdings','Acme Trading','Coastal Imports','(personal)','Vector Systems','Crescent Group'];
const _APPS=[
  {n:'Signal',cat:'Messaging',perms:['Contacts','Mic','Camera']},{n:'WhatsApp',cat:'Messaging',perms:['Contacts','Location','Mic']},
  {n:'Telegram',cat:'Messaging',perms:['Contacts','Storage']},{n:'Wickr Me',cat:'Messaging',perms:['Camera','Mic']},
  {n:'ProtonMail',cat:'Email',perms:['Notifications']},{n:'Gmail',cat:'Email',perms:['Contacts','Calendar']},
  {n:'Instagram',cat:'Social',perms:['Camera','Photos','Location']},{n:'Chrome',cat:'Browser',perms:['Location','Storage']},
  {n:'Google Maps',cat:'Navigation',perms:['Location','Motion']},{n:'Uber',cat:'Travel',perms:['Location','Payments']},
  {n:'Coinbase',cat:'Finance',perms:['Biometrics','Camera']},{n:'Chase Mobile',cat:'Finance',perms:['Biometrics','Location']},
  {n:'NordVPN',cat:'Security',perms:['VPN','Network']},{n:'Spotify',cat:'Media',perms:['Storage','Mic']},
  {n:'Notes',cat:'Productivity',perms:['Storage']},{n:'Dropbox',cat:'Storage',perms:['Files','Camera']},
  {n:'WhatsApp Business',cat:'Messaging',perms:['Contacts','Mic']},{n:'Photos',cat:'Media',perms:['Photos']},
  {n:'Authenticator',cat:'Security',perms:['Camera']},{n:'Calendar',cat:'Productivity',perms:['Calendar']},
  {n:'Binance',cat:'Finance',perms:['Biometrics','Camera']},{n:'Tor Browser',cat:'Browser',perms:['Network']},
];
const _APP_VER=['2.4.1','5.0.3','8.12.0','1.18','3.7.2','11.4','4.0.9','22.1','6.6.1','9.3.0'];
const _NOTE_T=['Meeting points','Shipping schedule','Passcodes','To buy','Addresses','Wire details','Contacts to call','Itinerary','Account numbers','Reminders','Storage unit','Vehicle info','License plates','Safehouse list'];
const _NOTE_B=['Confirm pickup at pier 14 before 0600. Bring the manifest.','Container EU‑4471 routed via Rotterdam, ETA Thursday.','Front door 4471 · garage 9920 · safe 11‑24‑88.','batteries, tape, prepaid SIM x3, cash envelopes.','Unit 218, Lakeside Storage, gate code 5582.','Acct ending 8841, routing on the card in wallet.','Call M before noon, do not text.','Flight 0840 → connection → arrive 2215 local.','Vault combo rotates monthly — see photo album.','Renew the lease, pay the lawyer, ping Sam.'];
const _PW_SVC=[
  {s:'Google',t:'Email'},{s:'iCloud',t:'Cloud'},{s:'Chase Bank',t:'Finance'},{s:'Coinbase',t:'Crypto'},
  {s:'Instagram',t:'Social'},{s:'Home Wi‑Fi',t:'Network'},{s:'ProtonMail',t:'Email'},{s:'Binance',t:'Crypto'},
  {s:'NordVPN',t:'Security'},{s:'Amazon',t:'Shopping'},{s:'Dropbox',t:'Storage'},{s:'Office Portal',t:'Work'},
  {s:'Telegram',t:'Messaging'},{s:'PayPal',t:'Finance'},{s:'Router admin',t:'Network'},{s:'GitHub',t:'Dev'},
];
const _PW_STR=[{l:'Weak',c:'#DC2626'},{l:'Fair',c:'#B5851C'},{l:'Strong',c:'#16A34A'}];
const _SITES=[
  {t:'Marine traffic — live map',u:'marinetraffic.com/en/ais'},{t:'Currency converter',u:'xe.com/currencyconverter'},
  {t:'Encrypted email login',u:'mail.proton.me/login'},{t:'Flight status — BA0249',u:'flightaware.com/live'},
  {t:'Storage unit rental',u:'lakeside-storage.com/units'},{t:'Crypto exchange',u:'coinbase.com/dashboard'},
  {t:'Port of Rotterdam schedule',u:'portofrotterdam.com/schedule'},{t:'VPN server list',u:'nordvpn.com/servers'},
  {t:'Prepaid SIM top‑up',u:'mintmobile.com/account'},{t:'Maps directions',u:'maps.google.com/dir'},
  {t:'News — shipping sanctions',u:'reuters.com/markets'},{t:'Burner phone reviews',u:'gsmarena.com/compare'},
];
const _MAIL_FROM=['logistics@northwind.co','no‑reply@coinbase.com','m.reyes@meridianfreight.com','security@proton.me','billing@nordvpn.com','captain@harborauth.gov','noreply@chase.com'];
const _MAIL_SUBJ=['Re: container manifest EU‑4471','Your withdrawal is complete','Pickup window confirmed','New login from an unrecognized device','Invoice #8841 — paid','Berth assignment — Pier 14','Statement available'];

function _phone(r){ return `+1 (${200+Math.floor(r()*700)}) ${200+Math.floor(r()*700)}‑${(1000+Math.floor(r()*9000))}`; }
function _name(r){ return _aPick(r,_FIRST)+' '+_aPick(r,_LAST); }
function _initials(n){ return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }
function _time(r){ const d=Math.floor(r()*28)+1; const mo=_aPick(r,['Apr','May','Jun']); const h=Math.floor(r()*24), m=Math.floor(r()*60); return `${mo} ${d} · ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; }
function _mask(r){ const ch='Aa3$kZ9mQ2xLp7Bvn4!Rt'; let s=''; for(let i=0;i<8+Math.floor(r()*5);i++) s+=ch[Math.floor(r()*ch.length)]; return s; }

function genArtifacts(d){
  const r=_aRng(_aSeed(d.id+d.serial));
  const cat=k=>Math.round(d.files*({photos:.34,messages:.22,browser:.09,calls:.05,mail:.04}[k]||0));
  const rows=(n,fn)=>Array.from({length:n},(_, i)=>fn(i));
  const contacts=rows(22+Math.floor(r()*10), ()=>{ const n=_name(r); return {name:n,init:_initials(n),color:_aPick(r,_aPal),phone:_phone(r),email:n.toLowerCase().replace(/[^a-z]/g,'.').replace(/\.+/g,'.')+'@mail.com',org:_aPick(r,_ORGS)}; });
  const calls=rows(20+Math.floor(r()*8), ()=>{ const n=_name(r); const dir=_aPick(r,['in','in','out','out','missed']); return {name:n,init:_initials(n),color:_aPick(r,_aPal),phone:_phone(r),dir,time:_time(r),dur:dir==='missed'?'—':`${Math.floor(r()*42)+1}m ${Math.floor(r()*60)}s`}; });
  const apps=[..._APPS].sort(()=>r()-.5).slice(0,Math.min(_APPS.length,14+Math.floor(r()*6))).map(a=>({...a,ver:_aPick(r,_APP_VER),size:`${(8+r()*420).toFixed(0)} MB`}));
  const notes=rows(8+Math.floor(r()*8), ()=>({title:_aPick(r,_NOTE_T),body:_aPick(r,_NOTE_B),date:_time(r)}));
  const pw=[..._PW_SVC].sort(()=>r()-.5).slice(0,10+Math.floor(r()*4)).map(s=>({...s,user:_aPick(r,_FIRST).toLowerCase()+_aPick(r,['','.work','94','_x','77'])+'@'+_aPick(r,['gmail.com','proton.me','outlook.com']),pass:_mask(r),str:_aPick(r,[0,0,1,1,2])}));
  const browser=rows(14+Math.floor(r()*8), ()=>{ const s=_aPick(r,_SITES); return {...s,time:_time(r)}; });
  const mail=rows(10+Math.floor(r()*6), ()=>({from:_aPick(r,_MAIL_FROM),subj:_aPick(r,_MAIL_SUBJ),time:_time(r)}));
  return {
    contacts:{rows:contacts, total:120+Math.floor(r()*620)},
    calls:{rows:calls, total:cat('calls')||60+Math.floor(r()*200)},
    apps:{rows:apps, total:d.apps},
    notes:{rows:notes, total:notes.length+Math.floor(r()*40)},
    passwords:{rows:pw, total:pw.length+Math.floor(r()*70)},
    media:{total:cat('photos')},
    browser:{rows:browser, total:cat('browser')||80+Math.floor(r()*400)},
    mail:{rows:mail, total:cat('mail')||40+Math.floor(r()*160)},
  };
}

// ---- small bits ----
function ACirc({init,color,size=30}){
  return <span style={{width:size,height:size,borderRadius:'50%',background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.36,fontWeight:600,flex:'none'}}>{init}</span>;
}
const CALL_DIR={in:{ic:'arrow_down',c:'#16A34A',l:'Incoming'},out:{ic:'arrow_up',c:'#0073E6',l:'Outgoing'},missed:{ic:'x',c:'#DC2626',l:'Missed'}};

function ArtRow({children, onLeave}){
  return <div style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderTop:'1px solid var(--line)'}}>{children}</div>;
}
function MoreFoot({shown,total,label,flash}){
  if(total<=shown) return null;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'13px',borderTop:'1px solid var(--line)',fontSize:12.5,color:'var(--ink-3)',fontWeight:500}}>
      Showing {shown.toLocaleString()} of {total.toLocaleString()} {label}
      <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',height:26}} onClick={()=>flash&&flash('Loading full '+label+'…')}>Load all</button>
    </div>
  );
}

function DeviceArtifacts({device, flash}){
  const data = React.useMemo(()=>genArtifacts(device),[device.id]);
  const TABS=[
    {id:'contacts', label:'Address Book', icon:'user',    total:data.contacts.total},
    {id:'calls',    label:'Call Logs',    icon:'phone',   total:data.calls.total},
    {id:'apps',     label:'Apps',         icon:'apps',    total:data.apps.total},
    {id:'notes',    label:'Notes',        icon:'text',    total:data.notes.total},
    {id:'passwords',label:'Passwords',    icon:'lock',    total:data.passwords.total},
    {id:'media',    label:'Media',        icon:'image',   total:data.media.total},
    {id:'browser',  label:'Browser',      icon:'globe',   total:data.browser.total},
    {id:'mail',     label:'Email',        icon:'mail',    total:data.mail.total},
  ];
  const [tab,setTab]=React.useState('contacts');
  const [reveal,setReveal]=React.useState({});

  const activeTab = TABS.find(t=>t.id===tab) || TABS[0];
  return (
    <div className="card" style={{padding:0,overflow:'hidden',display:'flex',height:'clamp(560px, calc(100vh - 220px), 760px)'}}>
      {/* category rail */}
      <div style={{width:228,flex:'none',borderRight:'1px solid var(--line)',display:'flex',flexDirection:'column',background:'var(--surface-2)'}}>
        <div style={{padding:'16px 16px 12px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:9}}>
          <span style={{display:'inline-flex',color:'var(--ink-3)'}}><Icon name="layers" size={16}/></span>
          <div>
            <div className="card-title" style={{fontSize:14}}>Artifacts</div>
            <div className="muted" style={{fontSize:11.5,marginTop:1}}>{device.files.toLocaleString()} items</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:8,display:'flex',flexDirection:'column',gap:2}}>
          {TABS.map(t=>{ const on=tab===t.id; return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',
              border:0,padding:'9px 11px',borderRadius:9,cursor:'pointer',transition:'.12s',
              background:on?'#fff':'transparent', boxShadow:on?'var(--shadow-sm)':'none',
              color:on?'var(--blue)':'var(--ink-2)', fontWeight:on?600:500, fontSize:13}}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background='var(--hover)';}}
              onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent';}}>
              <Icon name={t.icon} size={16} style={{flex:'none',color:on?'var(--blue)':'var(--ink-3)'}}/>
              <span style={{flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.label}</span>
              <span style={{fontSize:11,fontWeight:600,padding:'1px 7px',borderRadius:999,flex:'none',
                background:on?'var(--blue-t)':'#fff',color:on?'var(--blue)':'var(--ink-3)',border:'1px solid '+(on?'transparent':'var(--line)')}}>{t.total.toLocaleString()}</span>
            </button>
          );})}
        </div>
      </div>

      {/* records panel */}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'13px 18px',borderBottom:'1px solid var(--line)',flex:'none'}}>
          <span style={{width:34,height:34,borderRadius:9,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={activeTab.icon} size={17}/></span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>{activeTab.label}</div>
            <div className="muted" style={{fontSize:12}}>{activeTab.total.toLocaleString()} items recovered</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,height:34,padding:'0 12px',width:230,maxWidth:'42%',border:'1px solid var(--line-2)',background:'#fff',borderRadius:8}}>
            <Icon name="search" size={15} style={{color:'var(--ink-3)',flex:'none'}}/>
            <input placeholder={`Search ${activeTab.label.toLowerCase()}…`} onKeyDown={e=>{if(e.key==='Enter')flash&&flash('Searching '+activeTab.label.toLowerCase()+'…');}}
              style={{flex:1,minWidth:0,border:0,outline:'none',fontSize:13,fontFamily:'inherit',background:'transparent'}}/>
          </div>
          <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',flex:'none'}} onClick={()=>flash&&flash('Exporting '+activeTab.label.toLowerCase()+'…')}><Icon name="download" size={14}/>Export</button>
        </div>

        {/* records */}
        <div style={{flex:1,minHeight:0,overflowY:'auto'}}>
          {/* ADDRESS BOOK */}
          {tab==='contacts' && (<div>
          {data.contacts.rows.map((c,i)=>(
            <ArtRow key={i}>
              <ACirc init={c.init} color={c.color}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.email}{c.org!=='—'&&` · ${c.org}`}</div>
              </div>
              <span style={{fontSize:12.5,color:'var(--ink-2)',fontFamily:'ui-monospace,Menlo,monospace',flex:'none'}}>{c.phone}</span>
            </ArtRow>
          ))}
          <MoreFoot shown={data.contacts.rows.length} total={data.contacts.total} label="contacts" flash={flash}/>
        </div>)}

        {/* CALL LOGS */}
        {tab==='calls' && (<div>
          {data.calls.rows.map((c,i)=>{ const cd=CALL_DIR[c.dir]; return (
            <ArtRow key={i}>
              <span style={{width:30,height:30,borderRadius:8,background:cd.c+'1a',color:cd.c,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={cd.ic} size={15} sw={2.2}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:1,display:'flex',gap:7}}><span style={{color:cd.c,fontWeight:600}}>{cd.l}</span><span style={{fontFamily:'ui-monospace,Menlo,monospace'}}>{c.phone}</span></div>
              </div>
              <div style={{textAlign:'right',flex:'none'}}>
                <div style={{fontSize:12,color:'var(--ink-2)',fontWeight:550}}>{c.dur}</div>
                <div className="muted" style={{fontSize:11,marginTop:1}}>{c.time}</div>
              </div>
            </ArtRow>
          );})}
          <MoreFoot shown={data.calls.rows.length} total={data.calls.total} label="calls" flash={flash}/>
        </div>)}

        {/* APPS */}
        {tab==='apps' && (<div style={{padding:'4px 0'}}>
          {data.apps.rows.map((a,i)=>(
            <ArtRow key={i}>
              <span style={{width:32,height:32,borderRadius:9,background:_aPal[i%_aPal.length]+'1a',color:_aPal[i%_aPal.length],display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flex:'none'}}>{a.n[0]}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{a.n} <span className="muted" style={{fontWeight:400,fontSize:11.5}}>v{a.ver}</span></div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3,flexWrap:'wrap'}}>
                  <span className="muted" style={{fontSize:11.5}}>{a.cat}</span>
                  {a.perms.map(p=><span key={p} style={{fontSize:10.5,fontWeight:550,padding:'1px 7px',borderRadius:999,background:'var(--surface-2)',border:'1px solid var(--line)',color:'var(--ink-3)'}}>{p}</span>)}
                </div>
              </div>
              <span style={{fontSize:12,color:'var(--ink-3)',fontWeight:550,flex:'none'}}>{a.size}</span>
            </ArtRow>
          ))}
        </div>)}

        {/* NOTES */}
        {tab==='notes' && (<div>
          {data.notes.rows.map((n,i)=>(
            <ArtRow key={i}>
              <span style={{width:30,height:30,borderRadius:8,background:'var(--orange-t)',color:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="text" size={15}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{n.title}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:2,lineHeight:1.45,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.body}</div>
              </div>
              <span className="muted" style={{fontSize:11,flex:'none'}}>{n.date}</span>
            </ArtRow>
          ))}
          <MoreFoot shown={data.notes.rows.length} total={data.notes.total} label="notes" flash={flash}/>
        </div>)}

        {/* PASSWORDS */}
        {tab==='passwords' && (<div>
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',background:'var(--coral-t)',borderTop:'1px solid var(--line)'}}>
            <Icon name="shield" size={14} style={{color:'var(--coral)'}}/>
            <span style={{fontSize:12,color:'var(--ink-2)',flex:1}}>Recovered credentials are sensitive. Access is logged.</span>
            <button className="btn btn-ghost btn-sm" style={{height:26,border:'1px solid var(--line-2)',background:'#fff'}} onClick={()=>{const all={};data.passwords.rows.forEach((_,i)=>all[i]=true);setReveal(r=>Object.keys(r).length?{}:all);}}>
              <Icon name={Object.keys(reveal).length?'eye':'eye'} size={13}/>{Object.keys(reveal).length?'Hide all':'Reveal all'}
            </button>
          </div>
          {data.passwords.rows.map((p,i)=>{ const st=_PW_STR[p.str]; const shown=reveal[i]; return (
            <ArtRow key={i}>
              <span style={{width:30,height:30,borderRadius:8,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="lock" size={14}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)'}}>{p.s} <span className="muted" style={{fontWeight:400,fontSize:11}}>· {p.t}</span></div>
                <div className="muted" style={{fontSize:11.5,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.user}</div>
              </div>
              <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:12.5,color:'var(--ink-2)',width:96,textAlign:'right',flex:'none',letterSpacing:shown?0:'1px'}}>{shown?p.pass:'•••••••'}</span>
              <button title={shown?'Hide':'Reveal'} onClick={()=>setReveal(r=>({...r,[i]:!r[i]}))} style={{border:0,background:'transparent',padding:3,cursor:'pointer',color:'var(--ink-4)',flex:'none'}}><Icon name="eye" size={15}/></button>
              <span className="badge" style={{background:st.c+'1a',color:st.c,height:19,flex:'none'}}>{st.l}</span>
            </ArtRow>
          );})}
          <MoreFoot shown={data.passwords.rows.length} total={data.passwords.total} label="credentials" flash={flash}/>
        </div>)}

        {/* MEDIA */}
        {tab==='media' && (<div style={{padding:14}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
            {Array.from({length:24}).map((_,i)=>(
              <div key={i} style={{aspectRatio:'1',borderRadius:8,background:`repeating-linear-gradient(135deg, var(--surface-2), var(--surface-2) 7px, #F1F5F9 7px, #F1F5F9 14px)`,border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-4)'}}>
                <Icon name={i%5===0?'video':'image'} size={16}/>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginTop:13,fontSize:12.5,color:'var(--ink-3)',fontWeight:500}}>
            Showing 24 of {data.media.total.toLocaleString()} media items
            <button className="btn btn-ghost btn-sm" style={{border:'1px solid var(--line-2)',height:26}} onClick={()=>{window.__reviewFolder=device.name;flash&&flash('Opening media gallery…');}}>Open gallery</button>
          </div>
        </div>)}

        {/* BROWSER */}
        {tab==='browser' && (<div>
          {data.browser.rows.map((b,i)=>(
            <ArtRow key={i}>
              <span style={{width:30,height:30,borderRadius:8,background:'var(--surface-2)',color:'var(--ink-3)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',border:'1px solid var(--line)'}}><Icon name="globe" size={15}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.t}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:1,fontFamily:'ui-monospace,Menlo,monospace',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.u}</div>
              </div>
              <span className="muted" style={{fontSize:11,flex:'none'}}>{b.time}</span>
            </ArtRow>
          ))}
          <MoreFoot shown={data.browser.rows.length} total={data.browser.total} label="history entries" flash={flash}/>
        </div>)}

        {/* EMAIL */}
        {tab==='mail' && (<div>
          {data.mail.rows.map((m,i)=>(
            <ArtRow key={i}>
              <span style={{width:30,height:30,borderRadius:8,background:'var(--cyan-t)',color:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="mail" size={15}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.subj}</div>
                <div className="muted" style={{fontSize:11.5,marginTop:1,fontFamily:'ui-monospace,Menlo,monospace',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.from}</div>
              </div>
              <span className="muted" style={{fontSize:11,flex:'none'}}>{m.time}</span>
            </ArtRow>
          ))}
          <MoreFoot shown={data.mail.rows.length} total={data.mail.total} label="messages" flash={flash}/>
        </div>)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { genArtifacts, DeviceArtifacts });
