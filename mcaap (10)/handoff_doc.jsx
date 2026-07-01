// handoff_doc.jsx — shell, cover, foundations, handoff notes, assembly
const { useState, useEffect, useRef } = React;

/* ---------- nav model ---------- */
const NAV = [
  { grp:'Foundations', items:[
    { id:'top',     label:'Overview',         icon:'book' },
    { id:'brand',   label:'Brand & logo',     icon:'sparkle' },
    { id:'color',   label:'Color',            icon:'image' },
    { id:'type',    label:'Typography',       icon:'text' },
    { id:'spacing', label:'Spacing & elevation', icon:'layers' },
    { id:'motion',  label:'Motion',           icon:'pulse' },
  ]},
  { grp:'Build', items:[
    { id:'components', label:'Components', icon:'grid' },
    { id:'icons',      label:'Icons',      icon:'apps' },
    { id:'dataviz',    label:'Charts',     icon:'chart' },
    { id:'handoff',    label:'Handoff notes', icon:'route' },
  ]},
];

function Sidebar({active, go}){
  return (
    <aside className="gd-side">
      <div className="gd-side-brand">
        <Logo size={30}/>
        <div>
          <div className="nm">IMIN</div>
          <div className="sub">Design System</div>
        </div>
      </div>
      {NAV.map(g=>(
        <div className="gd-navgrp" key={g.grp}>
          <div className="gd-navgrp-t">{g.grp}</div>
          {g.items.map(it=>(
            <div key={it.id} className={'gd-nav'+(active===it.id?' on':'')} onClick={()=>go(it.id)}>
              <Icon name={it.icon} size={16} sw={1.85}/> {it.label}
            </div>
          ))}
        </div>
      ))}
      <div style={{padding:'22px 10px 0',marginTop:14,borderTop:'1px solid var(--line)'}}>
        <div style={{fontSize:11,color:'var(--ink-3)',lineHeight:1.6}}>
          <div style={{fontWeight:650,color:'var(--ink-2)'}}>v1.0 · Jun 2026</div>
          Handoff reference · derived from <code style={{fontSize:10.5}}>styles.css</code>
        </div>
      </div>
    </aside>
  );
}

/* ---------- cover ---------- */
function Cover(){
  return (
    <section className="gd-cover" id="top">
      <div className="gbar grad-bar"></div>
      <h1>Design&nbsp;→&nbsp;Development<br/><em>handoff style guide</em></h1>
      <p className="lede">The single source of truth between design and engineering for IMIN. Tokens, components, and specs — every example on this page renders live from the production stylesheet, so what you see is what ships.</p>
      <div className="gd-meta">
        <div className="mi"><div className="k">Product</div><div className="v">IMIN — Agency Operations</div></div>
        <div className="mi"><div className="k">Stylesheet</div><div className="v">styles.css · CSS custom properties</div></div>
        <div className="mi"><div className="k">Type</div><div className="v">Inter · Spectral</div></div>
        <div className="mi"><div className="k">Status</div><div className="v" style={{color:'#1FA98A'}}>● Living document</div></div>
      </div>
    </section>
  );
}

/* ---------- foundations: brand ---------- */
function BrandSection(){
  return (
    <section className="gd-sec" id="brand">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">01</span> · Foundations</div>
        <h2>Brand &amp; logo</h2>
        <p>The mark is a rotated-diamond cluster derived from a spectrum gradient. It carries the only multi-hue gradient in the system — everything else stays restrained so the logo and data can lead.</p>
      </div>
      <Demo padLg>
        <div style={{display:'flex',alignItems:'center',gap:14}}><Logo size={64}/><span style={{fontSize:34,fontWeight:700,letterSpacing:'-.04em'}}>IMIN</span></div>
        <span style={{width:28}}></span>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Logo size={40}/><Logo size={30}/><Logo size={22}/>
        </div>
      </Demo>
      <div className="gd-grid" style={{gridTemplateColumns:'1fr 1fr',marginTop:14}}>
        <div className="tcard">
          <div className="eyebrow" style={{marginBottom:8}}>Signature gradient</div>
          <div className="grad-bar" style={{height:34,borderRadius:8}}></div>
          <div className="tcard tv" style={{border:0,padding:'10px 0 0',fontFamily:'ui-monospace,Menlo,monospace',fontSize:11,color:'var(--ink-3)'}}>--logo-grad · 135° · cyan → blue → violet → coral → orange → lime</div>
        </div>
        <div className="tcard">
          <div className="eyebrow" style={{marginBottom:8}}>Gradient text</div>
          <div className="grad-text" style={{fontSize:30,fontWeight:700,letterSpacing:'-.02em'}}>IMIN Studio</div>
          <div className="tv" style={{fontFamily:'ui-monospace,Menlo,monospace',marginTop:8}}>class="grad-text"</div>
        </div>
      </div>
      <Note warn>The spectrum gradient is reserved for the <b>logo, hero accents, and one feature moment per screen</b>. Do not use it for buttons, backgrounds, or body text. Solid <code>--primary</code> is the workhorse brand color.</Note>
    </section>
  );
}

/* ---------- foundations: color ---------- */
const C_INK = [
  {nm:'--ink', val:'#24272D', desc:'Primary text'},
  {nm:'--ink-2', val:'#5F6773', desc:'Secondary text'},
  {nm:'--ink-3', val:'#8C94A3', desc:'Muted / meta'},
  {nm:'--ink-4', val:'#AEB5C0', desc:'Faint / disabled'},
];
const C_SURF = [
  {nm:'--surface', val:'#FFFFFF', desc:'Cards', ink:true},
  {nm:'--surface-2', val:'#FBFCFE', desc:'Row hover', ink:true},
  {nm:'--hover', val:'#F4F7FB', desc:'Hover fill', ink:true},
  {nm:'--line', val:'#E6EAF1', desc:'Hairline', ink:true},
  {nm:'--line-2', val:'#DCE3ED', desc:'Stronger border', ink:true},
];
const C_BRAND = [
  {nm:'--primary', val:'#1D3557', desc:'Brand / primary btn'},
  {nm:'--primary-700', val:'#16293F', desc:'Hover / pressed'},
  {nm:'--primary-tint', val:'#EAF0F7', desc:'Tinted fills', ink:true},
];
const C_ACCENT = [
  {nm:'--cyan', val:'#2FB2F3'}, {nm:'--blue', val:'#1D6BD0'}, {nm:'--indigo', val:'#5568C7'},
  {nm:'--violet', val:'#8A63C4'}, {nm:'--teal', val:'#3EC0D7'}, {nm:'--lime', val:'#7FC457'},
  {nm:'--orange', val:'#FF9A4E'}, {nm:'--coral', val:'#F86566'}, {nm:'--pink', val:'#E068A7'},
];
const C_SEM = [
  {nm:'Success', val:'#1FA98A', desc:'Complete / positive'},
  {nm:'Info', val:'#1D6BD0', desc:'In progress'},
  {nm:'Warning', val:'#FF9A4E', desc:'Review / attention'},
  {nm:'Danger', val:'#F86566', desc:'Urgent / blocked'},
];
function ColorSection(){
  return (
    <section className="gd-sec" id="color">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">02</span> · Foundations</div>
        <h2>Color</h2>
        <p>A calm neutral foundation with one navy brand and a nine-stop accent spectrum borrowed from the logo. Every value is a CSS custom property — reference the token, never the hex. Click any swatch to copy.</p>
      </div>
      <div className="gd-sub">Ink — text hierarchy</div>
      <SwatchGrid items={C_INK}/>
      <div className="gd-sub">Surfaces &amp; lines</div>
      <SwatchGrid items={C_SURF}/>
      <div className="gd-sub">Brand</div>
      <SwatchGrid items={C_BRAND}/>
      <div className="gd-sub">Accent spectrum</div>
      <SwatchGrid items={C_ACCENT}/>
      <Note>Each accent ships with a matching <b>tint</b> token (e.g. <code>--blue-t</code>, <code>--violet-t</code>) for badge and pill backgrounds. Pair the saturated hue for text/icons with its tint for the fill.</Note>
      <div className="gd-sub">Semantic</div>
      <SwatchGrid items={C_SEM}/>
      <Code lang="css" code={`/* Reference tokens, never raw hex */
.badge--info   { color: var(--blue);   background: var(--blue-t); }
.btn-primary   { background: var(--primary); }
.btn-primary:hover { background: var(--primary-700); }`}/>
    </section>
  );
}

/* ---------- foundations: type ---------- */
function TypeSection(){
  return (
    <section className="gd-sec" id="type">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">03</span> · Foundations</div>
        <h2>Typography</h2>
        <p>Two families with clear jobs. <b>Inter</b> runs the entire interface — dense, neutral, optical-size aware. <b>Spectral</b> appears only at display and editorial moments for warmth and contrast.</p>
      </div>
      <div className="gd-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="tcard">
          <div style={{fontFamily:'Inter',fontSize:44,fontWeight:700,letterSpacing:'-.03em',lineHeight:1}}>Aa</div>
          <div style={{marginTop:14}}><div className="tk">Inter</div><div className="tv">Interface · 400 450 500 550 600 700</div></div>
        </div>
        <div className="tcard">
          <div style={{fontFamily:"'Spectral',serif",fontSize:44,fontWeight:700,letterSpacing:'-.02em',lineHeight:1}}>Aa</div>
          <div style={{marginTop:14}}><div className="tk">Spectral</div><div className="tv">Display / editorial · 400–700 + italic</div></div>
        </div>
      </div>
      <div className="gd-sub">Type scale</div>
      <Demo col padLg>
        <div style={{fontFamily:"'Spectral',serif",fontSize:44,fontWeight:700,letterSpacing:'-.02em',lineHeight:1.05,color:'var(--ink)'}}>Display · Spectral 700</div>
        <div style={{fontFamily:"'Spectral',serif",fontSize:30,fontWeight:700,letterSpacing:'-.015em',color:'var(--ink)'}}>Section heading · Spectral 700 · 30px</div>
        <div style={{fontSize:18,fontWeight:600,letterSpacing:'-.02em',color:'var(--ink)'}}>Subtitle · Inter 600 · 18px</div>
        <div style={{fontSize:14.5,fontWeight:600,color:'var(--ink)'}}>Card title · Inter 600 · 14.5px</div>
        <div style={{fontSize:14,color:'var(--ink-2)',lineHeight:1.45}}>Body · Inter 400 · 14px · letter-spacing −0.006em. The base reading size for the entire product — tables, panels, descriptions.</div>
        <div className="eyebrow">Eyebrow · Inter 600 · 11px · .08em uppercase</div>
        <div style={{fontSize:12.5,color:'var(--ink-3)'}}>Caption / muted · Inter 400 · 12.5px</div>
      </Demo>
      <SpecTable cols={['Role','Family','Size','Weight','Tracking']} rows={[
        [{tok:'Display'}, 'Spectral', {val:'46px'}, {val:'700'}, {val:'-0.02em'}],
        [{tok:'Section h2'}, 'Spectral', {val:'30px'}, {val:'700'}, {val:'-0.015em'}],
        [{tok:'Card title'}, 'Inter', {val:'14.5px'}, {val:'600'}, {val:'-0.01em'}],
        [{tok:'Body (base)'}, 'Inter', {val:'14px'}, {val:'400'}, {val:'-0.006em'}],
        [{tok:'Eyebrow'}, 'Inter', {val:'11px'}, {val:'600'}, {val:'0.08em ↑'}],
        [{tok:'Table head'}, 'Inter', {val:'11px'}, {val:'600'}, {val:'0.05em ↑'}],
        [{tok:'Badge'}, 'Inter', {val:'11.5px'}, {val:'550'}, {val:'-0.01em'}],
      ]}/>
      <Note>The body sets a global <code>letter-spacing:-0.006em</code> and disables <code>font-synthesis-weight</code>. Weight <b>550</b> (a real Inter axis) is used heavily for buttons and emphasis — keep it; don't round to 600.</Note>
    </section>
  );
}

/* ---------- foundations: spacing + elevation ---------- */
const RADII = [
  {tk:'--radius', v:'6px', s:'buttons, inputs'},
  {tk:'--radius-lg', v:'10px', s:'kanban, panels'},
  {tk:'--radius-xl', v:'14px', s:'cards'},
  {tk:'pill', v:'999px', s:'chips, pills, avatars'},
];
const SHADOWS = [
  {tk:'--shadow-sm', d:'resting cards'},
  {tk:'--shadow', d:'hovered rows'},
  {tk:'--shadow-md', d:'lifted cards, popovers'},
  {tk:'--shadow-lg', d:'drawers, modals, toasts'},
];
const SPACE = [2,4,6,8,10,12,14,16,20,24,28];
function SpacingSection(){
  return (
    <section className="gd-sec" id="spacing">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">04</span> · Foundations</div>
        <h2>Spacing &amp; elevation</h2>
        <p>Spacing rhythm runs on small even steps; layout is capped and centered. Elevation is a four-rung shadow scale tinted with the brand navy, never pure black.</p>
      </div>
      <div className="gd-sub">Spacing rhythm</div>
      <Demo col>
        <div style={{display:'flex',alignItems:'flex-end',gap:10,flexWrap:'wrap'}}>
          {SPACE.map(n=>(
            <div key={n} style={{textAlign:'center'}}>
              <div style={{width:n,height:n,minWidth:2,background:'var(--blue)',borderRadius:2,margin:'0 auto'}}></div>
              <div style={{fontSize:10.5,color:'var(--ink-3)',marginTop:8,fontVariantNumeric:'tabular-nums'}}>{n}</div>
            </div>
          ))}
        </div>
      </Demo>
      <Note>Use <code>display:flex/grid</code> with <code>gap</code> for spacing groups — buttons, chips, toolbars. Common gaps: <b>6–10px</b> inside components, <b>14–16px</b> between cards, <b>28px</b> page gutters. Page content caps at <code>--maxw 1320px</code>.</Note>

      <div className="gd-sub">Corner radius</div>
      <div className="gd-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {RADII.map(r=>(
          <div className="tcard" key={r.tk} style={{textAlign:'center'}}>
            <div style={{height:54,background:'var(--primary-tint)',border:'1.5px solid var(--blue)',borderRadius:r.v==='999px'?'999px':r.v,margin:'0 auto 12px',width:'100%'}}></div>
            <div className="tk">{r.tk}</div><div className="tv">{r.v}</div>
            <div className="tv" style={{color:'var(--ink-4)'}}>{r.s}</div>
          </div>
        ))}
      </div>

      <div className="gd-sub">Elevation</div>
      <div className="gd-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {SHADOWS.map(sh=>(
          <div key={sh.tk} style={{textAlign:'center'}}>
            <div style={{height:84,background:'#fff',borderRadius:14,boxShadow:`var(${sh.tk})`,border:'1px solid var(--line)',marginBottom:12}}></div>
            <div className="tk" style={{fontSize:12,fontFamily:'ui-monospace,Menlo,monospace',fontWeight:600}}>{sh.tk}</div>
            <div className="tv" style={{fontSize:11.5,color:'var(--ink-3)'}}>{sh.d}</div>
          </div>
        ))}
      </div>
      <Code lang="css" code={`--shadow-sm: 0 1px 2px rgba(29,53,87,.05), 0 1px 3px rgba(29,53,87,.04);
--shadow-md: 0 4px 10px rgba(29,53,87,.06), 0 16px 36px rgba(29,53,87,.10);
/* shadows use brand navy (29,53,87) at low alpha — never #000 */`}/>
    </section>
  );
}

/* ---------- foundations: motion ---------- */
function MotionSection(){
  return (
    <section className="gd-sec" id="motion">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">05</span> · Foundations</div>
        <h2>Motion</h2>
        <p>Motion is quick, eased, and purposeful — confirm an interaction, never decorate. One signature easing curve governs nearly everything.</p>
      </div>
      <div className="gd-grid" style={{gridTemplateColumns:'1.1fr 1fr'}}>
        <div className="tcard">
          <div className="eyebrow" style={{marginBottom:10}}>Signature easing</div>
          <svg width="100%" height="120" viewBox="0 0 200 120" style={{display:'block'}}>
            <line x1="10" y1="110" x2="190" y2="110" stroke="var(--line-2)"/>
            <line x1="10" y1="110" x2="10" y2="10" stroke="var(--line-2)"/>
            <path d="M10 110 C 46 30, 64 18, 190 14" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="tv" style={{fontFamily:'ui-monospace,Menlo,monospace',marginTop:6}}>cubic-bezier(.2,.8,.3,1)</div>
        </div>
        <div className="tcard">
          <div className="eyebrow" style={{marginBottom:10}}>Duration scale</div>
          <SpecTable cols={['Token','Use']} rows={[
            [{val:'.12–.13s'}, 'Hover, color, nav'],
            [{val:'.15–.16s'}, 'Cards, dropdowns (pop)'],
            [{val:'.20s'}, 'Shadow / elevation'],
            [{val:'.35–.40s'}, 'Entrances (rise, streamIn)'],
          ]}/>
        </div>
      </div>
      <div className="gd-sub">Named keyframes</div>
      <SpecTable cols={['Keyframe','Motion','Where']} rows={[
        [{tok:'pop'}, 'translateY + scale in', 'Dropdowns, menus'],
        [{tok:'rise'}, 'translateY(8px) → 0', 'Section / card entrance'],
        [{tok:'streamIn'}, 'fade + 5px up', 'Agent stream steps'],
        [{tok:'sheen'}, 'sweeping highlight', 'Progress bars'],
        [{tok:'blink'}, 'opacity pulse', 'Live cursor'],
        [{tok:'agentPulse / livePing'}, 'expanding ring', 'Live status dots'],
      ]}/>
      <Note warn>Gate decorative loops (sheen, ping, blink) behind <code>@media (prefers-reduced-motion: no-preference)</code>. Functional transitions (hover, entrance) can stay — they convey state.</Note>
    </section>
  );
}

/* ---------- handoff notes ---------- */
function HandoffNotes(){
  return (
    <section className="gd-sec" id="handoff">
      <div className="gd-sec-head">
        <div className="eb"><span className="n">07</span> · Handoff</div>
        <h2>Engineering notes</h2>
        <p>Conventions to keep design and code converged after this document leaves the room.</p>
      </div>
      <div className="gd-sub">Naming &amp; structure</div>
      <SpecTable cols={['Convention','Rule']} rows={[
        ['Tokens', 'All design values live as CSS custom properties on :root. Reference var(--token); never inline a raw hex or px from a swatch.'],
        ['Classes', 'Flat, semantic, BEM-free (.btn, .card, .chip.on). State is a modifier class (.on, .active, .dragging, .over).'],
        ['Data maps', 'Status / priority / tags / people are data objects in data.jsx. Color comes from the map, not the markup.'],
        ['Icons', 'One <Icon name size sw/> component. Stroke inherits currentColor — set color on the parent.'],
      ]}/>

      <div className="gd-sub">Layout &amp; responsiveness</div>
      <SpecTable cols={['Property','Value']} rows={[
        [{tok:'--maxw'}, {val:'1320px content cap, centered'}],
        [{tok:'--header-h'}, {val:'64px sticky app header'}],
        [{tok:'Page gutter'}, {val:'28px (24px on narrow)'}],
        [{tok:'Min hit target'}, {val:'≥ 32px controls, ≥ 26px avatars'}],
      ]}/>

      <div className="gd-sub">Accessibility checklist</div>
      <Demo col>
        {[
          'Body text ≥ 14px; never below 11px for meta labels.',
          'Status is never color-only — pills pair a colored dot + text label.',
          'Interactive elements keep visible hover + focus states; preserve the easing token.',
          'Decorative animation respects prefers-reduced-motion.',
          'Icon-only buttons carry an accessible label (title / aria-label).',
        ].map((t,i)=>(
          <div key={i} style={{display:'flex',gap:11,alignItems:'flex-start',fontSize:13.5,color:'var(--ink-2)',lineHeight:1.5}}>
            <Icon name="shield_check" size={17} sw={1.9} style={{color:'#1FA98A',flex:'none',marginTop:1}}/> {t}
          </div>
        ))}
      </Demo>

      <div className="gd-sub">Do &amp; don't</div>
      <div className="gd-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="tcard" style={{borderColor:'#BFE3D6'}}>
          <div style={{display:'flex',alignItems:'center',gap:7,color:'#1FA98A',fontWeight:650,fontSize:13,marginBottom:10}}><Icon name="check" size={16} sw={2.4}/> Do</div>
          {['Reference tokens for every color, radius, shadow.','Use one primary button per view.','Lean on tints for badge / pill fills.','Build groups with flex/grid + gap.'].map((t,i)=>(
            <div key={i} style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5,padding:'4px 0'}}>· {t}</div>
          ))}
        </div>
        <div className="tcard" style={{borderColor:'#F2C9C9'}}>
          <div style={{display:'flex',alignItems:'center',gap:7,color:'#F86566',fontWeight:650,fontSize:13,marginBottom:10}}><Icon name="x" size={16} sw={2.4}/> Don't</div>
          {['Invent new hex values or one-off shadows.','Apply the spectrum gradient to UI chrome.','Hard-code status colors in components.','Round Inter 550 up to 600 or 700.'].map((t,i)=>(
            <div key={i} style={{fontSize:13,color:'var(--ink-2)',lineHeight:1.5,padding:'4px 0'}}>· {t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- app ---------- */
function App(){
  const [active, setActive] = useState('top');
  const go = (id)=>{
    const el = document.getElementById(id);
    if(el){ window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 18, behavior:'smooth' }); }
  };
  useEffect(()=>{
    const ids = NAV.flatMap(g=>g.items.map(i=>i.id));
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin:'-15% 0px -75% 0px', threshold:0 });
    ids.forEach(id=>{ const el=document.getElementById(id); if(el) obs.observe(el); });
    return ()=>obs.disconnect();
  },[]);
  return (
    <div className="gd-app">
      <Sidebar active={active} go={go}/>
      <main className="gd-main">
        <div className="gd-wrap">
          <Cover/>
          <BrandSection/>
          <ColorSection/>
          <TypeSection/>
          <SpacingSection/>
          <MotionSection/>
          <ComponentsSection/>
          <IconSection/>
          <DataVizSection/>
          <HandoffNotes/>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
