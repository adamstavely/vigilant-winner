// shared.jsx — UI primitives & charts

function Logo({size=30}){
  const src=(typeof window!=='undefined' && window.__resources && window.__resources.logo) || "assets/logo-256.png";
  return <img src={src} width={size} height={size} alt="IMIN"
    style={{display:'block', filter:'drop-shadow(0 1px 2px rgba(29,53,87,.12))'}} draggable="false"/>;
}
function Brand({size=30, onClick}){
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',userSelect:'none'}}>
      <Logo size={size}/>
      <span style={{fontSize:18,fontWeight:700,letterSpacing:'-.03em',color:'var(--ink)'}}>IMIN</span>
    </div>
  );
}

function Avatar({id, size=26, ring=true, title}){
  const p = PEOPLE[id] || {initials:'?', color:'#1D3557', name:''};
  return (
    <span className="av" title={title===false?undefined:(title||p.name)} style={{
      width:size, height:size, background:p.color, fontSize:Math.round(size*0.4),
      boxShadow: ring ? '0 0 0 2px #fff' : 'none'
    }}>{p.initials}</span>
  );
}
function AvatarStack({ids, size=24, max=3}){
  const shown = ids.slice(0,max), extra = ids.length-max;
  return (
    <div className="av-stack">
      {shown.map(id=> <Avatar key={id} id={id} size={size}/>)}
      {extra>0 && <span className="av" style={{width:size,height:size,background:'#E2E8F0',color:'var(--ink-3)',fontSize:Math.round(size*0.38)}}>+{extra}</span>}
    </div>
  );
}

function Tag({k, sm}){
  const t = TAGS[k]; if(!t) return null;
  return <span className="badge" style={{background:t.tint, color:t.color, fontSize:sm?10.5:11.5, height:sm?20:22}}>{t.label}</span>;
}
function StatusPill({k}){
  const s = STATUS[k]; if(!s) return null;
  return <span className="st" style={{background:s.tint, color:s.color}}><span className="dot" style={{background:s.color}}></span>{s.label}</span>;
}
function PriorityFlag({k}){
  const p = PRIORITY[k]; if(!p) return null;
  return <span title={p.label+' priority'} style={{display:'inline-flex'}}><Icon name="flame" size={14} sw={2} style={{color:p.color}}/></span>;
}

// ---------- charts ----------
function smoothPath(pts){
  if(pts.length<2) return '';
  let d=`M ${pts[0][0]},${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){
    const [x0,y0]=pts[i], [x1,y1]=pts[i+1];
    const cx=(x0+x1)/2;
    d+=` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}
function Sparkline({data, color='#0073E6', w=92, h=30, fill=true}){
  const min=Math.min(...data), max=Math.max(...data), pad=3;
  const rng=(max-min)||1;
  const pts=data.map((v,i)=>[pad+i*(w-pad*2)/(data.length-1), h-pad-(v-min)/rng*(h-pad*2)]);
  const line=smoothPath(pts);
  const gid='sg'+color.replace('#','')+w;
  return (
    <svg width={w} height={h} style={{display:'block',overflow:'visible'}}>
      {fill && <><defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.18"/><stop offset="1" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={`${line} L ${pts[pts.length-1][0]},${h} L ${pts[0][0]},${h} Z`} fill={`url(#${gid})`}/></>}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.6" fill={color}/>
    </svg>
  );
}

function AreaChart({series, labels, color='#0073E6', h=220}){
  const w=640; const padL=8, padR=8, padT=14, padB=26;
  const max=Math.max(...series.flat())*1.12;
  const iw=w-padL-padR, ih=h-padT-padB;
  const toPts=(arr)=>arr.map((v,i)=>[padL+i*iw/(arr.length-1), padT+ih-(v/max)*ih]);
  const colors=Array.isArray(color)?color:[color];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{display:'block',overflow:'visible'}}>
      {[0,.25,.5,.75,1].map((g,i)=>(
        <line key={i} x1={padL} x2={w-padR} y1={padT+g*ih} y2={padT+g*ih} stroke="#F1F5F9" strokeWidth="1"/>
      ))}
      {series.map((arr,si)=>{
        const pts=toPts(arr), line=smoothPath(pts), c=colors[si%colors.length];
        const gid='ac'+si+c.replace('#','');
        return (<g key={si}>
          <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity={si===0?0.16:0.08}/><stop offset="1" stopColor={c} stopOpacity="0"/>
          </linearGradient></defs>
          <path d={`${line} L ${pts[pts.length-1][0]},${padT+ih} L ${pts[0][0]},${padT+ih} Z`} fill={`url(#${gid})`}/>
          <path d={line} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
          {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill="#fff" stroke={c} strokeWidth="1.8"/>)}
        </g>);
      })}
      {labels && labels.map((l,i)=>(
        <text key={i} x={padL+i*iw/(labels.length-1)} y={h-7} fontSize="10.5" fill="#64748B"
          textAnchor={i===0?'start':i===labels.length-1?'end':'middle'} fontWeight="500">{l}</text>
      ))}
    </svg>
  );
}

function BarChart({data, labels, color='#0073E6', h=200, max:mx}){
  const w=560, padB=26, padT=10, gap=14;
  const max=mx||Math.max(...data)*1.15;
  const ih=h-padB-padT, bw=(w-gap*(data.length-1))/data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{display:'block'}}>
      {data.map((v,i)=>{
        const bh=(v/max)*ih, x=i*(bw+gap), y=padT+ih-bh;
        const c=Array.isArray(color)?color[i%color.length]:color;
        return (<g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx="5" fill={c} opacity="0.92"/>
          {labels && <text x={x+bw/2} y={h-8} fontSize="10.5" fill="#64748B" textAnchor="middle" fontWeight="500">{labels[i]}</text>}
        </g>);
      })}
    </svg>
  );
}

function Donut({value, size=120, stroke=13, color='#0073E6', track='#F1F5F9', label, sub}){
  const r=(size-stroke)/2, c=2*Math.PI*r, off=c*(1-value/100);
  return (
    <div style={{position:'relative',width:size,height:size}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{transition:'stroke-dashoffset 1s cubic-bezier(.2,.8,.3,1)'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontSize:size*0.24,fontWeight:700,color:'var(--ink)',letterSpacing:'-.02em'}}>{label}</span>
        {sub && <span style={{fontSize:11,color:'var(--ink-3)',fontWeight:500}}>{sub}</span>}
      </div>
    </div>
  );
}

function TrendBadge({delta, dir, good, bad, neutral}){
  const positive = dir==='up';
  let color = '#64748B';
  if(!neutral){ color = (good ? '#16A34A' : bad ? '#DC2626' : (positive?'#16A34A':'#DC2626')); }
  else { color = positive ? '#16A34A' : '#DC2626'; }
  return (
    <span className="badge" style={{background:'transparent', color, padding:0, gap:3, fontSize:12, fontWeight:600}}>
      <Icon name={positive?'arrow_up':'arrow_down'} size={13} sw={2.4}/>{Math.abs(delta)}
    </span>
  );
}

// Subtle geometric hero pattern from logo's diamond shape language
function HeroPattern({opacity=1}){
  return (
    <div className="hero-pattern" style={{opacity}}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
        <defs>
          <pattern id="diamonds" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <path d="M32 12 C 40 24, 40 24, 52 32 C 40 40, 40 40, 32 52 C 24 40, 24 40, 12 32 C 24 24, 24 24, 32 12 Z"
              fill="none" stroke="#0073E6" strokeWidth="1" opacity="0.05"/>
          </pattern>
          <radialGradient id="heroFade" cx="50%" cy="0%" r="90%">
            <stop offset="0" stopColor="#fff" stopOpacity="0"/>
            <stop offset="1" stopColor="#F4F7FC" stopOpacity="0.9"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamonds)"/>
        <rect width="100%" height="100%" fill="url(#heroFade)"/>
      </svg>
    </div>
  );
}

// section header
function SectionHead({title, sub, action, icon}){
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:14,gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {icon && <span style={{display:'inline-flex',color:'var(--ink-3)'}}><Icon name={icon} size={17}/></span>}
        <div>
          <div className="card-title" style={{fontSize:15.5}}>{title}</div>
          {sub && <div className="muted" style={{fontSize:12.5,marginTop:1}}>{sub}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

Object.assign(window, {
  Logo, Brand, Avatar, AvatarStack, Tag, StatusPill, PriorityFlag,
  Sparkline, AreaChart, BarChart, Donut, TrendBadge, HeroPattern, SectionHead, smoothPath
});
