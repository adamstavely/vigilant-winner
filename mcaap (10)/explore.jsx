// explore.jsx — Explore page: Search tab (content search) + Map tab (geospatial polygon query)

// ---------------- geospatial sample data ----------------
const GEO_KIND = {
  report:  {label:'Field Report', icon:'file',   color:'#0073E6', tint:'#EBF4FF'},
  imagery: {label:'Imagery',      icon:'image',  color:'#16A34A', tint:'#F0FDF4'},
  signal:  {label:'Signal',       icon:'signal', color:'#475569', tint:'#F1F5F9'},
  sensor:  {label:'Sensor',       icon:'pulse',  color:'#B5851C', tint:'#FFFBEB'},
  cable:   {label:'Cable',        icon:'mail',   color:'#0EA5E9', tint:'#F0F9FF'},
};
const GEO_TITLES = {
  report:['Port activity summary','Convoy movement note','Checkpoint report','District situation report','Infrastructure status','Patrol debrief','Market sentiment note'],
  imagery:['Satellite pass — harbor','UAV ISR frame','Coastal imagery mosaic','Overhead — depot','Thermal capture','Bridge survey frame'],
  signal:['VHF intercept','Emitter geolocation','Comms burst','Radar track','Beacon ping'],
  sensor:['Seismic array reading','Acoustic buoy telemetry','Ground sensor trip','Weather station feed','Flow-meter sample'],
  cable:['Station cable — weekly','Liaison message','Coordination cable','Advisory cable'],
};
const GEO_CLS = {U:{label:'U',color:'#64748B',tint:'#F1F5F9'}, CUI:{label:'CUI',color:'#0073E6',tint:'#EBF4FF'}, S:{label:'S',color:'#DC2626',tint:'#FEF2F2'}};
const VBW = 1000, VBH = 620;

function _mulberry(seed){ return function(){ let t=seed+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
const GEO = (function(){
  const r=_mulberry(91), kinds=Object.keys(GEO_KIND), clsKeys=['U','U','CUI','U','CUI','S','CUI'];
  const times=['12m','41m','1h','2h','5h','9h','1d','2d','3d'];
  const srcs=['tyler','maya','diego','priya','sam','noah','aria','lena'];
  const clusters=[[250,170,8],[360,300,7],[180,430,6],[700,240,9],[790,430,7],[560,130,5]];
  const out=[]; let id=1;
  clusters.forEach(([cx,cy,n])=>{
    for(let i=0;i<n;i++){
      const ang=r()*Math.PI*2, rad=18+r()*78;
      const x=Math.max(28,Math.min(VBW-28, cx+Math.cos(ang)*rad));
      const y=Math.max(28,Math.min(VBH-28, cy+Math.sin(ang)*rad*0.85));
      const kind=kinds[Math.floor(r()*kinds.length)];
      const titles=GEO_TITLES[kind];
      const col=String.fromCharCode(65+Math.floor(x/(VBW/8)));
      const row=Math.floor(y/(VBH/6))+1;
      out.push({id:id++, x, y, kind, title:titles[Math.floor(r()*titles.length)],
        cls:clsKeys[Math.floor(r()*clsKeys.length)], who:srcs[Math.floor(r()*srcs.length)],
        time:times[Math.floor(r()*times.length)], sector:col+row});
    }
  });
  return out;
})();

function geoLatLng(x,y){
  const lat=(42 - y/VBH*12), lng=(122 - x/VBW*18);
  return `${lat.toFixed(2)}°N  ${lng.toFixed(2)}°W`;
}

// saved polygon area queries — the "Polygon Repo"
const SAVED_AREAS = [
  {id:'pa1', name:'Harbor District',     who:'tyler', when:'2d', pts:[{x:612,y:150},{x:802,y:140},{x:846,y:300},{x:720,y:352},{x:592,y:262}]},
  {id:'pa2', name:'North Convoy Route',  who:'maya',  when:'5d', pts:[{x:168,y:108},{x:344,y:132},{x:392,y:268},{x:236,y:312},{x:140,y:214}]},
  {id:'pa3', name:'Coastal Sensor Belt', who:'diego', when:'1w', pts:[{x:120,y:372},{x:286,y:402},{x:306,y:528},{x:138,y:512}]},
  {id:'pa4', name:'Eastern Depot Grid',  who:'sam',   when:'2w', pts:[{x:690,y:372},{x:868,y:398},{x:884,y:512},{x:712,y:506}]},
];
// tiny normalized thumbnail of a saved polygon
function PolyThumb({pts, color='#0073E6', w=40, h=28}){
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
  const pad=4, sw=maxX-minX||1, sh=maxY-minY||1, s=Math.min((w-pad*2)/sw,(h-pad*2)/sh);
  const ox=(w-sw*s)/2, oy=(h-sh*s)/2;
  const str=pts.map(p=>`${ox+(p.x-minX)*s},${oy+(p.y-minY)*s}`).join(' ');
  return (
    <svg width={w} height={h} style={{display:'block',borderRadius:7,background:'#E7EEF7',flex:'none'}}>
      <polygon points={str} fill={color+'26'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// stylized basemap land shapes (abstract, cartographic)
const LAND = [
  "M-20 120 C 120 70, 300 80, 360 160 C 410 226, 360 300, 420 350 C 470 392, 430 470, 320 500 C 200 534, 60 520, -20 470 Z",
  "M560 60 C 700 30, 880 60, 1020 40 L 1020 300 C 920 300, 880 360, 820 410 C 760 458, 700 430, 640 400 C 560 360, 540 300, 540 220 C 540 150, 500 90, 560 60 Z",
  "M840 470 C 900 450, 980 470, 1020 520 L 1020 660 L 800 660 C 790 580, 790 500, 840 470 Z",
];

// ===================== Explore page =====================
function ExplorePage({setPage, openCreate, flash, onSearch, openPerson, openDevice, openTopic}){
  const [tab,setTab]=React.useState('search');
  const subNew=subTotalNew({});
  const tabs=[{id:'search',label:'Search',icon:'search'},{id:'map',label:'Map',icon:'globe'},{id:'subs',label:'Subscriptions',icon:'bell',badge:subNew}];
  return (
    <div className="rise">
      <div style={{borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.65)',backdropFilter:'blur(4px)'}}>
        <div className="page" style={{paddingTop:0,paddingBottom:0}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:24}}>
            <h1 style={{fontSize:18.5,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)',paddingBottom:13,flex:1}}>Explore</h1>
            <div style={{display:'flex',gap:22,flex:'none'}} data-tour="explore-tabs">
                {tabs.map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:7,border:0,background:'transparent',
                    padding:'13px 0',cursor:'pointer',fontSize:13.5,fontWeight:tab===t.id?600:500,
                    color:tab===t.id?'var(--blue)':'var(--ink-3)',position:'relative'}}>
                    <Icon name={t.icon} size={15}/>{t.label}
                    {t.badge>0 && <span style={{fontSize:11,fontWeight:700,background:tab===t.id?'var(--blue)':'#EBF4FF',color:tab===t.id?'#fff':'var(--blue)',borderRadius:999,padding:'1px 7px'}}>{t.badge}</span>}
                    {tab===t.id && <span style={{position:'absolute',left:0,right:0,bottom:-1,height:2.5,background:'var(--blue)',borderRadius:2}}></span>}
                  </button>
                ))}
              </div>
            <div style={{flex:1}}></div>
          </div>
        </div>
      </div>
      {tab==='search'
        ? <ContentWorkspace embed w={CONTENT_WS} setPage={setPage} openCreate={openCreate} flash={flash} onSearch={onSearch} openPerson={openPerson} openDevice={openDevice} openTopic={openTopic}/>
        : tab==='map'
          ? <MapSearch flash={flash} setPage={setPage}/>
          : <SubscriptionSearches flash={flash} setPage={setPage} onSearch={onSearch}/>}
    </div>
  );
}

// ===================== Map / geospatial search =====================
function pointInPoly(p, poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i].x, yi=poly[i].y, xj=poly[j].x, yj=poly[j].y;
    const hit=((yi>p.y)!==(yj>p.y)) && (p.x < (xj-xi)*(p.y-yi)/(yj-yi)+xi);
    if(hit) inside=!inside;
  }
  return inside;
}
function polyArea(poly){
  let a=0;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){ a += (poly[j].x+poly[i].x)*(poly[j].y-poly[i].y); }
  return Math.abs(a/2);
}
function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }

function MapSearch({flash, setPage}){
  const svgRef=React.useRef(null);
  const [active,setActive]=React.useState({report:true,imagery:true,signal:true,sensor:true,cable:true});
  const [pts,setPts]=React.useState([]);
  const [mode,setMode]=React.useState('idle');   // idle | draw | done
  const [cursor,setCursor]=React.useState(null);
  const [hover,setHover]=React.useState(null);    // hovered marker id
  const [drag,setDrag]=React.useState(null);      // vertex index being dragged
  const [saved,setSaved]=React.useState(SAVED_AREAS);

  const CLOSE_R=18;
  const visible=GEO.filter(g=>active[g.kind]);

  function toMap(e){
    const r=svgRef.current.getBoundingClientRect();
    return {x:(e.clientX-r.left)/r.width*VBW, y:(e.clientY-r.top)/r.height*VBH};
  }
  function start(){ setMode('draw'); setPts([]); setCursor(null); }
  function clear(){ setMode('idle'); setPts([]); setCursor(null); }
  function close(arr){
    let p=arr||pts;
    if(p.length>=2 && dist(p[p.length-1],p[0])<CLOSE_R) p=p.slice(0,-1);
    if(p.length<3) return;
    setPts(p); setMode('done'); setCursor(null);
  }
  function onClick(e){
    if(mode!=='draw') return;
    const p=toMap(e);
    if(pts.length>=3 && dist(p,pts[0])<CLOSE_R){ close(pts); return; }
    setPts(a=>[...a,p]);
  }
  function onMove(e){ if(mode==='draw') setCursor(toMap(e)); }

  function loadArea(a){ setMode('done'); setPts(a.pts.map(p=>({...p}))); setCursor(null); }
  function saveArea(){
    if(pts.length<3) return;
    setSaved(s=>[{id:'pa'+Date.now(), name:'Saved area '+(s.length+1), who:'tyler', when:'now', pts:pts.map(p=>({...p}))}, ...s]);
    flash&&flash('Saved to Polygon Repo');
  }

  // vertex drag
  React.useEffect(()=>{
    if(drag===null) return;
    function mv(e){ const p=toMap(e); setPts(a=>a.map((v,i)=>i===drag?p:v)); }
    function up(){ setDrag(null); }
    window.addEventListener('mousemove',mv); window.addEventListener('mouseup',up);
    return ()=>{ window.removeEventListener('mousemove',mv); window.removeEventListener('mouseup',up); };
  },[drag]);
  // esc to cancel
  React.useEffect(()=>{
    function k(e){ if(e.key==='Escape') clear(); }
    window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);
  },[]);

  const inside = React.useMemo(()=> mode==='done' ? visible.filter(g=>pointInPoly(g,pts)) : [], [mode,pts,active]);
  const insideIds = React.useMemo(()=>new Set(inside.map(g=>g.id)),[inside]);
  const areaKm = mode==='done' ? Math.round(polyArea(pts)*0.56) : 0;

  const polyStr = pts.map(p=>`${p.x},${p.y}`).join(' ');
  const drawStr = cursor && mode==='draw' ? polyStr+` ${cursor.x},${cursor.y}` : polyStr;

  return (
    <div className="page" style={{paddingTop:22}}>
      {/* toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:14}}>
        <button onClick={mode==='idle'?start:start} className={'btn '+(mode!=='idle'?'btn-primary':'btn-secondary')}
          style={mode!=='idle'?{}:{borderColor:'var(--line-2)'}}>
          <Icon name="polygon" size={16}/>{mode==='idle'?'Draw area':'Redraw'}
        </button>
        <button onClick={clear} className="btn btn-ghost btn-sm" disabled={!pts.length}
          style={{opacity:pts.length?1:.45,pointerEvents:pts.length?'auto':'none',border:'1px solid var(--line-2)'}}>
          <Icon name="trash" size={14}/>Clear
        </button>
        <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5,color:'var(--ink-3)',fontWeight:500}}>
          <Icon name={mode==='draw'?'pin_loc':'globe'} size={14} style={{color:'var(--ink-4)'}}/>
          {mode==='idle' && 'Draw a polygon to query geotagged data within it'}
          {mode==='draw' && 'Click to add points · click the first point (or double-click) to close'}
          {mode==='done' && 'Drag any point to refine the area'}
        </div>
        <div style={{flex:1}}></div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {Object.entries(GEO_KIND).map(([k,v])=>(
            <button key={k} onClick={()=>setActive(a=>({...a,[k]:!a[k]}))}
              style={{display:'inline-flex',alignItems:'center',gap:6,height:28,padding:'0 10px',borderRadius:999,cursor:'pointer',
                fontSize:12,fontWeight:550,transition:'.12s',
                border:'1px solid '+(active[k]?v.color:'var(--line-2)'),
                background:active[k]?v.tint:'#fff', color:active[k]?v.color:'var(--ink-4)'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:active[k]?v.color:'var(--ink-4)'}}></span>{v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 372px',gap:20,alignItems:'start'}}>
        {/* MAP */}
        <div className="card" style={{padding:0,overflow:'hidden',position:'relative'}}>
          <svg ref={svgRef} viewBox={`0 0 ${VBW} ${VBH}`} width="100%" style={{display:'block',aspectRatio:`${VBW}/${VBH}`,
            cursor:mode==='draw'?'crosshair':'default', background:'#E7EEF7', userSelect:'none'}}
            onClick={onClick} onMouseMove={onMove} onDoubleClick={()=>mode==='draw'&&close(pts)}>
            {/* water grain */}
            <defs>
              <pattern id="grid" width="62.5" height="62" patternUnits="userSpaceOnUse">
                <path d="M62.5 0H0V62" fill="none" stroke="#CFDDEC" strokeWidth="1"/>
              </pattern>
              <linearGradient id="landg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4F2EA"/><stop offset="1" stopColor="#ECE8DC"/>
              </linearGradient>
            </defs>
            <rect width={VBW} height={VBH} fill="url(#grid)"/>
            {/* land */}
            {LAND.map((d,i)=><path key={i} d={d} fill="url(#landg)" stroke="#D8D2C2" strokeWidth="1.5"/>)}
            {/* graticule labels */}
            {[1,2,3,4].map(i=>(
              <text key={'lx'+i} x={i*VBW/5} y={14} fontSize="10" fill="#9DB0C6" textAnchor="middle" fontWeight="500">{(122-i*VBW/5/VBW*18).toFixed(0)}°W</text>
            ))}
            {[1,2,3,4].map(i=>(
              <text key={'ly'+i} x={6} y={i*VBH/5+3} fontSize="10" fill="#9DB0C6" fontWeight="500">{(42-i*VBH/5/VBH*12).toFixed(0)}°N</text>
            ))}

            {/* markers */}
            {visible.map(g=>{
              const v=GEO_KIND[g.kind];
              const isIn = mode==='done' && insideIds.has(g.id);
              const dim = mode==='done' && !isIn;
              const hot = hover===g.id;
              const r = isIn?7:5.2;
              return (
                <g key={g.id} opacity={dim?0.22:1} style={{transition:'opacity .25s'}}
                  onMouseEnter={()=>setHover(g.id)} onMouseLeave={()=>setHover(null)}>
                  {(isIn||hot) && <circle cx={g.x} cy={g.y} r={r+6} fill={v.color} opacity="0.16"/>}
                  <circle cx={g.x} cy={g.y} r={hot?r+1.5:r} fill={v.color} stroke="#fff" strokeWidth="1.6"
                    style={{transition:'r .12s'}}/>
                  <title>{g.title} · {GEO_KIND[g.kind].label} · {g.sector}</title>
                </g>
              );
            })}

            {/* polygon */}
            {pts.length>0 && (mode==='done'
              ? <polygon points={polyStr} fill="rgba(29,107,208,.13)" stroke="#0073E6" strokeWidth="2.2" strokeLinejoin="round"/>
              : <polyline points={drawStr} fill="rgba(29,107,208,.08)" stroke="#0073E6" strokeWidth="2.2" strokeDasharray="2 0" strokeLinejoin="round" strokeLinecap="round"/>
            )}
            {/* vertices */}
            {pts.map((p,i)=>{
              const first = i===0;
              const closeable = mode==='draw' && first && pts.length>=3;
              return (
                <circle key={i} cx={p.x} cy={p.y} r={closeable?8:5.5}
                  fill={closeable?'#0073E6':'#fff'} stroke="#0073E6" strokeWidth="2.2"
                  style={{cursor:mode==='done'?'grab':'pointer'}}
                  onMouseDown={e=>{ if(mode==='done'){ e.stopPropagation(); setDrag(i);} }}/>
              );
            })}

            {/* compass + scale */}
            <g transform={`translate(${VBW-46},42)`}>
              <circle r="17" fill="rgba(255,255,255,.85)" stroke="#D8D2C2" strokeWidth="1"/>
              <path d="M0 -11 L4 2 L0 -1 L-4 2 Z" fill="#DC2626"/>
              <text y="-12" fontSize="8.5" fill="#475569" textAnchor="middle" fontWeight="700" dy="-1">N</text>
            </g>
            <g transform={`translate(28,${VBH-26})`}>
              <rect x="0" y="0" width="84" height="4" fill="#475569" rx="1"/>
              <text x="0" y="-5" fontSize="9.5" fill="#475569" fontWeight="600">50 km</text>
            </g>
          </svg>

          {/* coord readout */}
          <div style={{position:'absolute',left:12,top:12,display:'flex',alignItems:'center',gap:7,
            background:'rgba(255,255,255,.9)',border:'1px solid var(--line)',borderRadius:8,padding:'5px 10px',
            fontSize:11.5,fontWeight:600,color:'var(--ink-2)',fontFamily:'ui-monospace,Menlo,monospace',boxShadow:'var(--shadow-sm)'}}>
            <Icon name="target" size={13} style={{color:'var(--blue)'}}/>
            {cursor?geoLatLng(cursor.x,cursor.y):'—'}
          </div>

          {/* idle CTA overlay */}
          {mode==='idle' && pts.length===0 && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
              <div className="pop" style={{background:'rgba(255,255,255,.94)',border:'1px solid var(--line)',borderRadius:14,padding:'18px 22px',
                textAlign:'center',boxShadow:'var(--shadow-md)',pointerEvents:'auto',maxWidth:300}}>
                <span style={{width:42,height:42,borderRadius:11,background:'var(--blue-t)',color:'var(--blue)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="polygon" size={21}/></span>
                <div style={{fontSize:14.5,fontWeight:700,color:'var(--ink)',marginTop:11}}>Query by area</div>
                <div className="muted" style={{fontSize:12.5,marginTop:4,lineHeight:1.5}}>Draw a polygon to return every geotagged item that falls inside it.</div>
                <button className="btn btn-primary btn-sm" style={{marginTop:13}} onClick={start}><Icon name="polygon" size={14}/>Draw area</button>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS */}
        <div style={{position:'sticky',top:'calc(var(--header-h) + 16px)',display:'flex',flexDirection:'column',gap:12}}>
          <div className="card card-pad">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <span style={{width:30,height:30,borderRadius:8,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="pin_loc" size={16}/></span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>{mode==='done'?'In selected area':'Geotagged data'}</div>
                  <div className="muted" style={{fontSize:11.5}}>{mode==='done'?`≈ ${areaKm.toLocaleString()} km² · ${pts.length} vertices`:`${visible.length} items on map`}</div>
                </div>
              </div>
              {mode==='done' && <span style={{fontSize:22,fontWeight:700,color:'var(--blue)',letterSpacing:'-.02em'}}>{inside.length}</span>}
            </div>

            {mode!=='done' && (
              <div style={{marginTop:14,borderTop:'1px solid var(--line)',paddingTop:14}}>
                <div className="eyebrow" style={{marginBottom:10}}>On map by type</div>
                <div style={{display:'flex',flexDirection:'column',gap:9}}>
                  {Object.entries(GEO_KIND).map(([k,v])=>{
                    const n=GEO.filter(g=>g.kind===k).length;
                    return (
                      <div key={k} style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{width:24,height:24,borderRadius:7,background:v.tint,color:v.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={v.icon} size={13}/></span>
                        <span style={{flex:1,fontSize:13,color:'var(--ink-2)',fontWeight:500}}>{v.label}</span>
                        <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink-3)'}}>{n}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:14,fontSize:12.5,color:'var(--ink-3)',lineHeight:1.5,background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:'11px 13px'}}>
                  <Icon name="polygon" size={13} style={{color:'var(--blue)',verticalAlign:'-2px',marginRight:6}}/>
                  Draw an area on the map to filter these down to a specific region.
                </div>
              </div>
            )}
          </div>

          {mode==='done' && (
            <div className="card card-pad" style={{maxHeight:'calc(100vh - var(--header-h) - 190px)',overflowY:'auto'}}>
              {inside.length===0 ? (
                <div style={{textAlign:'center',padding:'24px 8px'}}>
                  <span style={{width:38,height:38,borderRadius:10,background:'var(--surface-2)',color:'var(--ink-4)',display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--line)'}}><Icon name="search" size={18}/></span>
                  <div style={{fontSize:13,color:'var(--ink-3)',marginTop:9,fontWeight:500}}>No geotagged items in this area.</div>
                  <button className="btn btn-secondary btn-sm" style={{marginTop:12}} onClick={start}>Redraw area</button>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:2}}>
                  {inside.map((g,i)=>{
                    const v=GEO_KIND[g.kind], c=GEO_CLS[g.cls];
                    return (
                      <div key={g.id} onMouseEnter={()=>setHover(g.id)} onMouseLeave={()=>setHover(null)}
                        onClick={()=>flash&&flash(`Opening ${g.title}…`)}
                        style={{display:'flex',gap:11,padding:'10px 8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,
                          background:hover===g.id?'var(--surface-2)':'transparent',transition:'.12s'}}>
                        <span style={{width:30,height:30,borderRadius:8,background:v.tint,color:v.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={v.icon} size={15}/></span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{g.title}</div>
                          <div style={{display:'flex',alignItems:'center',gap:7,marginTop:3,fontSize:11.5,color:'var(--ink-3)'}}>
                            <span style={{fontFamily:'ui-monospace,Menlo,monospace'}}>{g.sector}</span>
                            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                            <Avatar id={g.who} size={15}/>{PEOPLE[g.who].name.split(' ')[0]}
                            <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{g.time}
                          </div>
                        </div>
                        <span className="badge" style={{background:c.tint,color:c.color,height:19,flex:'none',alignSelf:'flex-start'}}>{c.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {inside.length>0 && (
                <div style={{display:'flex',gap:8,marginTop:13,paddingTop:13,borderTop:'1px solid var(--line)'}}>
                  <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={()=>flash&&flash(`${inside.length} items added to a new collection`)}><Icon name="download" size={14}/>Export {inside.length}</button>
                  <button className="btn btn-secondary btn-sm" onClick={saveArea}><Icon name="bookmark" size={14}/>Save</button>
                </div>
              )}
            </div>
          )}

          {/* Polygon Repo */}
          <div className="card card-pad">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <span style={{width:30,height:30,borderRadius:8,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="polygon" size={16}/></span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>Polygon Repo</div>
                  <div className="muted" style={{fontSize:11.5}}>Saved area queries</div>
                </div>
              </div>
              <span style={{fontSize:12.5,fontWeight:600,color:'var(--ink-3)'}}>{saved.length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:2,maxHeight:268,overflowY:'auto',margin:'0 -8px'}}>
              {saved.map((a,i)=>{
                const n=GEO.filter(g=>active[g.kind]&&pointInPoly(g,a.pts)).length;
                return (
                  <div key={a.id} onClick={()=>loadArea(a)} title="Load this area"
                    style={{display:'flex',alignItems:'center',gap:11,padding:'9px 8px',borderTop:i?'1px solid var(--line)':0,cursor:'pointer',borderRadius:8,transition:'.12s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <PolyThumb pts={a.pts}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3,fontSize:11,color:'var(--ink-3)'}}>
                        <Avatar id={a.who} size={14}/>{PEOPLE[a.who].name.split(' ')[0]}
                        <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{a.when}
                      </div>
                    </div>
                    <span className="badge" style={{background:'var(--blue-t)',color:'var(--blue)',height:19,flex:'none'}}>{n}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== Subscription searches =====================
// Saved searches that auto-run on a schedule and surface NEW matches.
const SUB_KIND = {
  doc:    {icon:'file',  color:'#0073E6', tint:'#EBF4FF', label:'Document'},
  image:  {icon:'image', color:'#16A34A', tint:'#F0FDF4', label:'Image'},
  video:  {icon:'video', color:'#B5851C', tint:'#FFFBEB', label:'Video'},
  mail:   {icon:'mail',  color:'#475569', tint:'#F1F5F9', label:'Email'},
  sheet:  {icon:'grid',  color:'#16A34A', tint:'#F0FDF4', label:'Spreadsheet'},
  device: {icon:'phone', color:'#1D3557', tint:'#EAF0F7', label:'Device'},
};
const SUB_SEARCHES = [
  {id:'sub1', name:'Project Atlas mentions', query:'"Project Atlas" OR "Atlas routing"', cadence:'Realtime', last:'4m ago', owner:'tyler',
    scope:['All content','Devices'], total:38,
    results:[
      {kind:'mail',  title:'FW: Atlas specs (to personal)', who:'maya',  time:'4m',  isNew:true,  snippet:'Forwarding these so I have a copy at home before things get complicated…'},
      {kind:'doc',   title:'Project_Atlas_specs_v3.pdf',     who:'diego', time:'2h',  isNew:true,  snippet:'Routing algorithm — §4 updated with revised throughput targets.'},
      {kind:'doc',   title:'routing_algorithm_notes.docx',   who:'noah',  time:'1d',  isNew:false, snippet:'Working notes on the Atlas routing heuristics.'},
      {kind:'sheet', title:'client_list_west.xlsx',          who:'priya', time:'3d',  isNew:false, snippet:'Western region client roster referenced in Atlas planning.'},
    ]},
  {id:'sub2', name:'Conveyor safety — Line 3', query:'conveyor AND (safety OR defect) AND "Line 3"', cadence:'Hourly', last:'22m ago', owner:'aria',
    scope:['All content'], total:54,
    results:[
      {kind:'doc',   title:'Internal Safety Audit — Line 3',  who:'tyler', time:'18m', isNew:true,  snippet:'Audit flags actuator wear on the Line 3 conveyor as a serious risk.'},
      {kind:'image', title:'line3_actuator_closeup.png',      who:'aria',  time:'40m', isNew:true,  snippet:'Field photo of the worn actuator referenced in the maintenance ticket.'},
      {kind:'video', title:'Line3_CCTV_0312_0900.mp4',        who:'aria',  time:'1h',  isNew:true,  snippet:'CCTV capture of the line during the reported incident window.'},
      {kind:'mail',  title:'Conveyor safety — URGENT',        who:'tyler', time:'1d',  isNew:false, snippet:'Repeated warnings about the Line 3 conveyor going unaddressed.'},
    ]},
  {id:'sub3', name:'Privileged / confidential flags', query:'tag:privileged OR "attorney-client"', cadence:'Realtime', last:'9m ago', owner:'sam',
    scope:['All content','Email'], total:12,
    results:[
      {kind:'mail',  title:'PRIVILEGED & CONFIDENTIAL — strategy', who:'sam', time:'9m', isNew:true, snippet:'Counsel strategy memo — flagged for privilege review before production.'},
      {kind:'doc',   title:'severance_model_privileged.pdf',       who:'sam', time:'2d', isNew:false, snippet:'Privileged severance modeling worksheet.'},
    ]},
  {id:'sub4', name:'Henderson — severance & comp', query:'Henderson AND (severance OR compensation OR "back pay")', cadence:'Daily', last:'6h ago', owner:'priya',
    scope:['All content'], total:21,
    results:[
      {kind:'sheet', title:'Henderson_severance_calc.xlsx', who:'priya', time:'6h', isNew:false, snippet:'Severance calculation worksheet — figures unchanged since last run.'},
      {kind:'doc',   title:'comp_band_review.pdf',          who:'sam',   time:'2d', isNew:false, snippet:'Compensation band review referencing the Henderson matter.'},
    ]},
  {id:'sub5', name:'Maritime — northern terminal', query:'"northern terminal" AND (throughput OR convoy)', cadence:'Weekly', last:'2d ago', owner:'maya',
    scope:['All content','Devices'], total:9,
    results:[
      {kind:'doc',   title:'Quarterly throughput assessment.pdf', who:'maya', time:'2d', isNew:false, snippet:'Container throughput up ~18% QoQ at the northern terminal.'},
    ]},
];
function subNewCount(s, seen){ return seen[s.id] ? 0 : s.results.filter(r=>r.isNew).length; }
function subTotalNew(seen){ return SUB_SEARCHES.reduce((a,s)=>a+subNewCount(s,seen),0); }

function SubscriptionSearches({flash, setPage, onSearch}){
  const [seen,setSeen]=React.useState({});
  const withNew=SUB_SEARCHES.filter(s=>subNewCount(s,seen)>0).length;
  // default-select the first subscription that has new content
  const firstNew=(SUB_SEARCHES.find(s=>s.results.some(r=>r.isNew))||SUB_SEARCHES[0]).id;
  const [selId,setSelId]=React.useState(firstNew);
  const sel=SUB_SEARCHES.find(s=>s.id===selId);

  function markRead(id){ setSeen(m=>({...m,[id]:true})); flash&&flash('Marked results as read'); }
  function openInSearch(s){ onSearch ? onSearch(s.query) : (flash&&flash('Opening “'+s.name+'” in Search')); }

  const selNew = sel ? subNewCount(sel,seen) : 0;

  return (
    <div className="page" style={{paddingTop:22,paddingBottom:48}}>
      {/* summary */}
      <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:34,height:34,borderRadius:9,background:'var(--blue-t)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="bell" size={18}/></span>
          <div>
            <div style={{fontSize:15,fontWeight:700,letterSpacing:'-.01em',color:'var(--ink)'}}>Subscription searches</div>
            <div className="muted" style={{fontSize:12.5,marginTop:1}}>Saved searches that auto-run &mdash; {withNew?`${withNew} ${withNew===1?'query has':'queries have'} new results`:'all caught up'}.</div>
          </div>
        </div>
        <div style={{flex:1}}></div>
        <button className="btn btn-primary btn-sm" onClick={()=>flash&&flash('New subscription — name it and set a schedule')}><Icon name="plus" size={15} sw={2.2}/>New subscription</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'360px minmax(0,1fr)',gap:20,alignItems:'start'}}>
        {/* LEFT — subscription list */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {SUB_SEARCHES.map(s=>{
            const n=subNewCount(s,seen), on=selId===s.id;
            return (
              <div key={s.id} onClick={()=>setSelId(s.id)} className="card"
                style={{padding:'13px 15px',cursor:'pointer',borderColor:on?'var(--blue)':n?'#CBDDF5':'var(--line)',
                  boxShadow:on?'0 0 0 1px var(--blue), var(--shadow-sm)':'var(--shadow-sm)',transition:'.14s'}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}>
                  <span style={{width:28,height:28,borderRadius:8,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',
                    background:n?'var(--blue-t)':'var(--surface-2)',color:n?'var(--blue)':'var(--ink-3)'}}><Icon name={n?'bell':'search'} size={15}/></span>
                  <span style={{flex:1,minWidth:0,fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</span>
                  {n>0
                    ? <span style={{flex:'none',fontSize:11,fontWeight:700,color:'#fff',background:'var(--blue)',borderRadius:999,padding:'2px 8px'}}>{n} new</span>
                    : <Icon name="check" size={15} sw={2.4} style={{color:'#16A34A',flex:'none'}}/>}
                </div>
                <div style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:11,color:'var(--ink-3)',margin:'9px 0 0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                  background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:6,padding:'5px 8px'}}>{s.query}</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:9,fontSize:11,color:'var(--ink-3)'}}>
                  <span style={{display:'inline-flex',alignItems:'center',gap:4,fontWeight:600,color:s.cadence==='Realtime'?'#16A34A':'var(--ink-3)'}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:s.cadence==='Realtime'?'#16A34A':'var(--ink-4)'}}></span>{s.cadence}
                  </span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>
                  <Icon name="clock" size={12} style={{color:'var(--ink-4)'}}/>{s.last}
                  <div style={{flex:1}}></div>
                  <Avatar id={s.owner} size={16}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — selected subscription results */}
        {sel && (
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--line)'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:14}}>
                <div style={{minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                    <h2 style={{fontSize:17,fontWeight:700,letterSpacing:'-.015em',color:'var(--ink)',margin:0}}>{sel.name}</h2>
                    {selNew>0 && <span style={{fontSize:11,fontWeight:700,color:'#fff',background:'var(--blue)',borderRadius:999,padding:'2px 9px'}}>{selNew} new</span>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8,fontSize:12,color:'var(--ink-3)',flexWrap:'wrap'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:5,fontWeight:600,whiteSpace:'nowrap',color:sel.cadence==='Realtime'?'#16A34A':'var(--ink-2)'}}><Icon name="history" size={13}/>{sel.cadence}</span>
                    <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)',flex:'none'}}></span>
                    <span style={{whiteSpace:'nowrap'}}>Last run {sel.last}</span>
                    <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)',flex:'none'}}></span>
                    <span style={{whiteSpace:'nowrap'}}>{sel.total} total matches</span>
                    <span style={{display:'inline-flex',gap:5,marginLeft:2}}>{sel.scope.map((sc)=><span key={sc} className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',border:'1px solid var(--line)',height:18,fontSize:10.5,whiteSpace:'nowrap'}}>{sc}</span>)}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:8,flex:'none'}}>
                  {selNew>0 && <button className="btn btn-secondary btn-sm" onClick={()=>markRead(sel.id)}><Icon name="check" size={14}/>Mark read</button>}
                  <button className="btn btn-primary btn-sm" onClick={()=>openInSearch(sel)}><Icon name="search" size={14}/>Open in Search</button>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:13,fontFamily:'ui-monospace,Menlo,monospace',fontSize:11.5,color:'var(--ink-2)',
                background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:8,padding:'8px 11px'}}>
                <Icon name="search" size={13} style={{color:'var(--ink-4)',flex:'none'}}/>
                <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sel.query}</span>
              </div>
            </div>

            <div style={{padding:'8px 12px 14px'}}>
              {selNew>0 && (
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 8px 8px'}}>
                  <span className="eyebrow" style={{color:'var(--blue)'}}>New since last viewed</span>
                  <span style={{flex:1,height:1,background:'var(--line)'}}></span>
                </div>
              )}
              {sel.results.map((r,i)=>{
                const v=SUB_KIND[r.kind], isNew=r.isNew && selNew>0;
                // when this is the first non-new after the new group, render a divider
                const prevNew=i>0 && sel.results[i-1].isNew && selNew>0;
                const showEarlierLabel = !isNew && (i===0 || (sel.results[i-1].isNew && selNew>0));
                return (
                  <React.Fragment key={i}>
                    {showEarlierLabel && (
                      <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 8px 8px'}}>
                        <span className="eyebrow">Earlier results</span>
                        <span style={{flex:1,height:1,background:'var(--line)'}}></span>
                      </div>
                    )}
                    <div onClick={()=>flash&&flash('Opening '+r.title+'…')}
                      style={{display:'flex',gap:12,padding:'11px 10px',borderRadius:10,cursor:'pointer',transition:'.12s',
                        background:isNew?'var(--blue-t)':'transparent',opacity:isNew?1:.92}}
                      onMouseEnter={e=>e.currentTarget.style.background=isNew?'#E2EDFB':'var(--surface-2)'}
                      onMouseLeave={e=>e.currentTarget.style.background=isNew?'var(--blue-t)':'transparent'}>
                      <span style={{width:34,height:34,borderRadius:9,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',background:v.tint,color:v.color}}><Icon name={v.icon} size={17}/></span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:13.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</span>
                          {isNew && <span style={{flex:'none',width:7,height:7,borderRadius:'50%',background:'var(--blue)'}}></span>}
                        </div>
                        <div style={{fontSize:12,color:'var(--ink-2)',lineHeight:1.45,marginTop:3,display:'-webkit-box',WebkitLineClamp:1,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{r.snippet}</div>
                        <div style={{display:'flex',alignItems:'center',gap:7,marginTop:5,fontSize:11,color:'var(--ink-3)'}}>
                          <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',border:'1px solid var(--line)',height:17,fontSize:10}}>{v.label}</span>
                          <Avatar id={r.who} size={15}/>{PEOPLE[r.who].name.split(' ')[0]}
                          <span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{r.time} ago
                        </div>
                      </div>
                      <Icon name="chevron_right" size={16} style={{color:'var(--ink-4)',flex:'none',alignSelf:'center'}}/>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ExplorePage, MapSearch, SubscriptionSearches });
