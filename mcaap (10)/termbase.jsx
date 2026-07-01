// termbase.jsx — Gold Copy Term Base (language glossary) — IMIN styling
// Reached from the book icon in the top nav. For the Language user type.

const TB_SERIF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const TB_STATUS = {
  gold:       {label:'Gold Copy',        color:'#B5851C', tint:'#FFFBEB'},
  review:     {label:'In Review',        color:'#B5851C', tint:'#FFFBEB'},
  deprecated: {label:'Deprecated',       color:'#64748B', tint:'#F1F5F9'},
  dnt:        {label:'Do Not Translate', color:'#DC2626', tint:'#FEF2F2'},
};
const TB_CAT = {
  word:   {label:'Word & Phrase', short:'Word & Phrase', icon:'comment', plural:'Words & Phrases'},
  place:  {label:'Place',         short:'Place',         icon:'pin_loc', plural:'Places'},
  formal: {label:'Formal Name',   short:'Formal Name',   icon:'bookmark',plural:'Formal Names'},
};
// Each glossary is a curated cut of the Gold Copy. Opening one scopes the
// working view (filters, list, detail) to just that glossary's entries.
const TB_GLOSSARIES = [
  {id:'literary', name:'Literary Gold Copy', pair:['EN','ES'], domain:'Literary & Idiomatic', color:'#B5851C', icon:'book', owner:'maya', updated:'Mar 2026',
    desc:'Idioms, loanwords and figurative language for prose & literary translation.',
    match:e=> e.cat==='word' && ['Literary','Multiple','General'].includes(e.domain)},
  {id:'medical', name:'Medical Terminology', pair:['EN','ES'], domain:'Clinical & Diagnostic', color:'#DC2626', icon:'shield_check', owner:'priya', updated:'Jan 2026',
    desc:'Clinical, diagnostic and anatomical terms with controlled acronyms.',
    match:e=> e.domain==='Medical' || (e.sub||'').includes('Anatomy')},
  {id:'names', name:'Names & Places', pair:['EN','ES'], domain:'Proper Nouns', color:'#0073E6', icon:'pin_loc', owner:'noah', updated:'Mar 2026',
    desc:'Exonyms, published titles and other proper-name conventions.',
    match:e=> e.cat==='place' || e.cat==='formal'},
  {id:'general', name:'General Vocabulary', pair:['EN','ES'], domain:'Everyday & Professional', color:'#16A34A', icon:'comment', owner:'sam', updated:'Feb 2026',
    desc:'Common professional and everyday vocabulary with register notes.',
    match:e=> e.domain==='General' || e.domain==='Geography'},
];
function glossaryEntries(g){ return TB_ENTRIES.filter(g.match); }

const TB_ENTRIES = [
  {id:'t1', term:'break a leg', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Theatre & Performance', status:'gold',
    pos:'idiom · interjection', primary:'mucha mierda', gloss:'Theatrical good-luck idiom — direct cultural equivalent.',
    def:'An expression of good luck said to a performer before they go on stage. Not to be taken literally.',
    register:'informal', region:'General', colloquial:'Yes', orthography:'lower-case; no hyphen', related:['good luck',"knock 'em dead"],
    variants:[
      {votes:47, term:'mucha mierda', reg:'informal', note:'Standard in Spanish theatre circles. Vulgar literal sense is not felt in context.'},
      {votes:12, term:'que se rompa una pata', reg:'informal', region:'Lat. Am.', note:'Lit. ‘may a leg break’ — used in some Latin-American theatre.'},
      {votes:5,  term:'buena suerte', reg:'neutral', note:'Generic ‘good luck’. Safe but loses the theatrical color.'},
      {votes:-28, term:'romper una pierna', reg:'Rejected', note:'Literal calque. Incorrect — do not use.'},
    ],
    context:{en:'“Break a leg out there tonight,” the director whispered.', es:'—Mucha mierda esta noche —susurró el director.'},
    note:'A figurative idiom. NEVER translate word-for-word — “romper una pierna” is meaningless and reads as an error. Map to the target culture’s equivalent theatrical good-luck phrase.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t2', term:'déjà vu', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Loanword', status:'dnt',
    pos:'noun', primary:'déjà vu', gloss:'Keep as-is (do not translate).',
    def:'A French loanword used unchanged in both English and Spanish. Retain original spelling and diacritics.',
    register:'neutral', region:'General', colloquial:'No', orthography:'lower-case; keep accents', related:['jamais vu'],
    note:'Do Not Translate. The loanword is fully naturalised in the target language — translating or de-accenting it is an error.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Feb 2026'}},

  {id:'t3', term:'ghosting', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Social / Modern', status:'review',
    pos:'noun (gerund)', primary:'dejar en visto', gloss:'Proposed — abruptly cutting off contact.',
    def:'The practice of ending a relationship by suddenly withdrawing all communication. Modern colloquial usage.',
    register:'informal', region:'General', colloquial:'Yes', orthography:'lower-case', related:['stonewalling'],
    variants:[
      {votes:9, term:'dejar en visto', reg:'informal', note:'Lit. ‘leave on seen’. Widely understood, captures the messaging-era sense.'},
      {votes:4, term:'hacer ghosting', reg:'informal', note:'Calque with the English root. Common online but contested.'},
    ],
    note:'Under review — no ratified equivalent yet. Votes are advisory until an Expert lexicographer signs off.',
    approver:null},

  {id:'t4', term:'MRI', src:'EN', tgt:'ES', cat:'word', domain:'Medical', sub:'Diagnostic Imaging', status:'gold',
    pos:'noun (acronym)', primary:'resonancia magnética (RM)', gloss:'Full term + Spanish acronym. Preferred.',
    def:'Magnetic Resonance Imaging — a diagnostic imaging technique. Render the full term with the Spanish acronym on first use.',
    register:'formal', region:'General', colloquial:'No', orthography:'expand on first use; ‘RM’ thereafter', related:['CT scan','ultrasound'],
    variants:[
      {votes:31, term:'resonancia magnética (RM)', reg:'formal', note:'Preferred clinical form. Spell out, then abbreviate.'},
      {votes:6,  term:'IRM', reg:'formal', region:'Lat. Am.', note:'‘Imagen por resonancia magnética’ — used in some Latin-American sources.'},
    ],
    note:'Never carry the English acronym “MRI” into Spanish clinical text. Use the Spanish full form and acronym.',
    approver:{name:'Dr. Raúl Sandoval', level:'Level Expert', lang:'ES', date:'Jan 2026'}},

  {id:'t5', term:'once in a blue moon', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Idiom', status:'gold',
    pos:'idiom · adverbial', primary:'de Pascuas a Ramos', gloss:'Idiomatic: very infrequently.',
    def:'An idiom meaning something happens very rarely. Map to a target-language idiom, not a literal rendering.',
    register:'informal', region:'General', colloquial:'Yes', orthography:'lower-case', related:['hardly ever'],
    variants:[
      {votes:22, term:'de Pascuas a Ramos', reg:'informal', note:'Idiomatic; literally ‘from Easter to Palm Sunday’.'},
      {votes:8,  term:'cada muerte de obispo', reg:'informal', region:'Lat. Am.', note:'Equally idiomatic, more regional.'},
    ],
    context:{en:'He calls his brother once in a blue moon.', es:'Llama a su hermano de Pascuas a Ramos.'},
    note:'Choose by target region. Avoid literal ‘luna azul’, which carries none of the frequency sense.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t6', term:'Schadenfreude', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Loanword', status:'dnt',
    pos:'noun', primary:'Schadenfreude', gloss:'Keep as-is (do not translate).',
    def:'A German loanword for pleasure derived from another’s misfortune. Used unchanged in literary register.',
    register:'formal', region:'General', colloquial:'No', orthography:'capitalised (German noun)', related:['gloating'],
    note:'Do Not Translate. Retain capitalisation. A gloss may be added in a footnote but the headword stays German.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Feb 2026'}},

  {id:'t7', term:'spill the beans', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Idiom', status:'gold',
    pos:'idiom · verbal', primary:'irse de la lengua', gloss:'To let something slip; reveal a secret.',
    def:'To disclose information, often inadvertently. Use a target-language idiom of accidental disclosure.',
    register:'informal', region:'General', colloquial:'Yes', orthography:'lower-case', related:['let the cat out of the bag'],
    variants:[
      {votes:18, term:'irse de la lengua', reg:'informal', note:'To let something slip; reveal a secret.'},
      {votes:7,  term:'descubrir el pastel', reg:'informal', note:'To give the game away; expose a scheme.'},
    ],
    note:'Pick the idiom by nuance — accidental slip vs. exposing a plot.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t8', term:'spine', src:'EN', tgt:'ES', cat:'word', domain:'Multiple', sub:'Anatomy / Bookbinding', status:'gold',
    pos:'noun', primary:'el lomo', gloss:'The spine of a book; masc. noun.',
    def:'Context-dependent. ‘el lomo’ for the spine of a book; ‘la columna (vertebral)’ for the anatomical spine.',
    register:'neutral', region:'General', colloquial:'No', orthography:'lower-case', related:['column','backbone'],
    variants:[
      {votes:15, term:'el lomo', reg:'neutral', note:'Bookbinding sense — the spine of a book. Masculine.'},
      {votes:14, term:'la columna vertebral', reg:'formal', note:'Anatomical sense — the backbone. Feminine.'},
    ],
    note:'Disambiguate by domain before choosing. The two senses are not interchangeable.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t9', term:'The Brothers Karamazov', src:'EN', tgt:'ES', cat:'formal', domain:'Literary', sub:'Published Title', status:'gold',
    pos:'proper noun (title)', primary:'Los hermanos Karamázov', gloss:'Canonical published title.',
    def:'The established Spanish title of Dostoevsky’s novel. Use the canonical published form, not a fresh translation.',
    register:'formal', region:'General', colloquial:'No', orthography:'title case; accent on Karamázov', related:['Crime and Punishment'],
    note:'Use the recognised published title. Re-translating canonical titles fragments the catalogue and confuses readers.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t10', term:'the doctor', src:'EN', tgt:'ES', cat:'word', domain:'General', sub:'Profession', status:'gold',
    pos:'noun', primary:'el médico / la médica', gloss:'Physician. Gender by referent.',
    def:'A physician. Choose grammatical gender by the referent; both forms are standard.',
    register:'neutral', region:'General', colloquial:'No', orthography:'lower-case', related:['nurse','surgeon'],
    variants:[
      {votes:20, term:'el médico / la médica', reg:'neutral', note:'Gender agrees with the referent.'},
      {votes:11, term:'el doctor / la doctora', reg:'neutral', note:'Also correct, esp. as a courtesy title.'},
    ],
    note:'Match grammatical gender to the person referred to. Do not default to masculine when the referent is known.',
    approver:{name:'Dr. Raúl Sandoval', level:'Level Expert', lang:'ES', date:'Jan 2026'}},

  {id:'t11', term:'The Hague', src:'EN', tgt:'ES', cat:'place', domain:'Geography', sub:'Exonym', status:'gold',
    pos:'proper noun (place)', primary:'La Haya', gloss:'Established Spanish exonym.',
    def:'The Spanish exonym for the Dutch city Den Haag / ’s-Gravenhage. Use the established form.',
    register:'formal', region:'General', colloquial:'No', orthography:'title case; article ‘La’', related:['Amsterdam','Rotterdam'],
    note:'Use the recognised exonym. Do not transliterate the Dutch name.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Mar 2026'}},

  {id:'t12', term:'to kill a mockingbird', src:'EN', tgt:'ES', cat:'word', domain:'Literary', sub:'Idiom (legacy)', status:'deprecated',
    pos:'idiom', primary:'matar a un ruiseñor', gloss:'Deprecated — see published title entry.',
    def:'Legacy entry. Superseded — the literal idiom guidance conflicts with the canonical published-title handling.',
    register:'neutral', region:'General', colloquial:'No', orthography:'lower-case', related:['The Brothers Karamazov'],
    note:'Deprecated. Retained for history only. Refer to the Formal Name workflow for published titles.',
    approver:{name:'Dr. Elena Márquez', level:'Level Expert', lang:'ES', date:'Nov 2025'}},
];

// review queue — proposed changes awaiting Expert ratification
const TB_QUEUE = [
  {id:'q1', term:'ghosting', kind:'New term', src:'noah', when:'2h', note:'No Gold Copy equivalent yet — proposing “dejar en visto”.', target:'ES'},
  {id:'q2', term:'spine', kind:'Edit', src:'priya', when:'1d', note:'Add anatomical sense + gender note to disambiguate.', target:'ES'},
  {id:'q3', term:'to kill a mockingbird', kind:'Deprecation', src:'maya', when:'2d', note:'Conflicts with published-title handling — propose deprecating.', target:'ES'},
  {id:'q4', term:'résumé', kind:'New term', src:'sam', when:'3d', note:'Loanword — propose Do-Not-Translate classification.', target:'FR'},
];

// blue ratified check
function Verified({size=18}){
  return <span title="Ratified" style={{display:'inline-flex',width:size,height:size,borderRadius:'50%',background:'var(--blue)',color:'#fff',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="check" size={size*0.62} sw={3}/></span>;
}
function LangPair({src, tgt}){
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'var(--ink-3)',letterSpacing:'.03em'}}>
      <span>{src}</span><Icon name="arrow_right" size={12} sw={2} style={{opacity:.6}}/><span>{tgt}</span>
    </span>
  );
}

function TermbaseWorkspace({setPage, flash}){
  const [tab,setTab]=React.useState('glossary');
  const [glossaryId,setGlossaryId]=React.useState(null);   // null = glossary index
  const [cat,setCat]=React.useState('all');
  const [status,setStatus]=React.useState('any');
  const [q,setQ]=React.useState('');
  const [sort,setSort]=React.useState('gold');
  const [sel,setSel]=React.useState(null);

  const glossary = TB_GLOSSARIES.find(g=>g.id===glossaryId) || null;

  function openGlossary(g){
    const first=TB_ENTRIES.find(g.match);
    setCat('all'); setStatus('any'); setQ(''); setSort('gold');
    setSel(first?first.id:null);
    setGlossaryId(g.id);
  }
  function backToIndex(){ setGlossaryId(null); }

  const inGlossary = tab==='glossary' && glossary;

  return (
    <div className="rise">
      {/* header band */}
      <div style={{borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.65)',backdropFilter:'blur(4px)'}}>
        <div style={{maxWidth:1320,margin:'0 auto',padding:'0 28px'}}>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12.5,color:'var(--ink-3)',fontWeight:500,padding:'14px 0 0'}}>
            <span style={{cursor:'pointer'}} onClick={()=>setPage('dashboard')}>Home</span>
            <Icon name="chevron_right" size={13} style={{opacity:.6}}/>
            <span style={{cursor:inGlossary?'pointer':'default',color:inGlossary?'var(--ink-3)':'var(--ink-2)'}} onClick={()=>inGlossary&&backToIndex()}>Glossaries</span>
            {inGlossary && <React.Fragment><Icon name="chevron_right" size={13} style={{opacity:.6}}/><span style={{color:'var(--ink-2)'}}>{glossary.name}</span></React.Fragment>}
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,marginTop:6}}>
            <div style={{display:'flex',alignItems:'flex-end',gap:24,minWidth:0}}>
              <h1 style={{fontSize:18.5,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)',paddingBottom:13,flex:'none'}}>Term base</h1>
              <div style={{display:'flex',gap:22}}>
                {[['glossary','Glossaries','book'],['queue','Review Queue','clock']].map(([id,label,icon])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{display:'flex',alignItems:'center',gap:7,border:0,background:'transparent',
                    padding:'13px 0',cursor:'pointer',fontSize:13.5,fontWeight:tab===id?600:500,position:'relative',
                    color:tab===id?'var(--blue)':'var(--ink-3)'}}>
                    <Icon name={icon} size={15}/>{label}
                    {id==='queue' && <span style={{fontSize:11,fontWeight:700,background:'#FFFBEB',color:'#B5851C',borderRadius:999,padding:'1px 7px'}}>{TB_QUEUE.length}</span>}
                    {tab===id && <span style={{position:'absolute',left:0,right:0,bottom:-1,height:2.5,background:'var(--blue)',borderRadius:2}}></span>}
                  </button>
                ))}
              </div>
            </div>
            {tab==='glossary' && (inGlossary
              ? <button className="btn btn-primary btn-sm" style={{marginBottom:10}} onClick={()=>flash&&flash('New term — propose an entry')}><Icon name="plus" size={15} sw={2.2}/>New term</button>
              : <button className="btn btn-primary btn-sm" style={{marginBottom:10}} onClick={()=>flash&&flash('New glossary — name it and pick a language pair')}><Icon name="plus" size={15} sw={2.2}/>New glossary</button>)}
          </div>
        </div>
      </div>

      {tab==='queue'
        ? <TermReviewQueue setTab={setTab} setSel={setSel} setStatus={setStatus} flash={flash}/>
        : glossary
          ? <Glossary glossary={glossary} onBack={backToIndex} {...{cat,setCat,status,setStatus,q,setQ,sort,setSort,sel,setSel,flash}}/>
          : <GlossaryIndex onOpen={openGlossary} flash={flash}/>}
    </div>
  );
}

// ===== glossary index — cards of available glossaries =====
function GlossaryIndex({onOpen, flash}){
  return (
    <div style={{maxWidth:1320,margin:'0 auto',padding:'24px 28px 48px'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,marginBottom:18}}>
        <div>
          <div style={{fontSize:15.5,fontWeight:700,letterSpacing:'-.01em',color:'var(--ink)'}}>Your glossaries</div>
          <div className="muted" style={{fontSize:12.5,marginTop:2}}>Pick a glossary to browse, search and propose entries. Every entry is Level-Expert ratified.</div>
        </div>
        <span className="badge" style={{background:'#FFFBEB',color:'#B5851C',height:24,fontWeight:700,border:'1px solid #EBDFC2'}}><Icon name="shield_check" size={13}/>Gold Copy</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(296px,1fr))',gap:16}}>
        {TB_GLOSSARIES.map(g=>{
          const ents=glossaryEntries(g);
          const gold=ents.filter(e=>e.status==='gold').length;
          const review=ents.filter(e=>e.status==='review').length;
          const dnt=ents.filter(e=>e.status==='dnt').length;
          return (
            <div key={g.id} onClick={()=>onOpen(g)} className="card card-hover" style={{padding:0,overflow:'hidden',cursor:'pointer',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'17px 18px 15px',display:'flex',flexDirection:'column',gap:11,flex:1}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
                  <span style={{width:42,height:42,borderRadius:11,background:'var(--surface-2)',color:'var(--ink-3)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={g.icon} size={21}/></span>
                  <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:'var(--ink-3)',letterSpacing:'.03em',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:999,padding:'3px 9px'}}>
                    {g.pair[0]}<Icon name="arrow_right" size={11} sw={2} style={{opacity:.6}}/>{g.pair[1]}
                  </span>
                </div>
                <div>
                  <div style={{fontFamily:TB_SERIF,fontSize:17,fontWeight:650,letterSpacing:'-.01em',color:'var(--ink)'}}>{g.name}</div>
                  <div className="muted" style={{fontSize:11.5,fontWeight:600,marginTop:2,color:'var(--accent)'}}>{g.domain}</div>
                </div>
                <p style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5,margin:0,flex:1}}>{g.desc}</p>
                <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                  <span style={{fontSize:13,fontWeight:700,color:'var(--ink)'}}>{ents.length}<span className="muted" style={{fontWeight:500,fontSize:11.5}}> entries</span></span>
                  {gold>0 && <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,fontWeight:600,color:'#B5851C'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#B5851C'}}></span>{gold} gold</span>}
                  {review>0 && <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,fontWeight:600,color:'#0073E6'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#0073E6'}}></span>{review} review</span>}
                  {dnt>0 && <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,fontWeight:600,color:'#DC2626'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#DC2626'}}></span>{dnt} DNT</span>}
                </div>
              </div>
              <div style={{borderTop:'1px solid var(--line)',background:'var(--surface-2)',padding:'10px 18px',display:'flex',alignItems:'center',gap:9}}>
                <Avatar id={g.owner} size={22}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11.5,fontWeight:600,color:'var(--ink-2)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{PEOPLE[g.owner].name}</div>
                  <div className="muted" style={{fontSize:10.5}}>Updated {g.updated}</div>
                </div>
                <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:g.color}}>Open<Icon name="arrow_right" size={14}/></span>
              </div>
            </div>
          );
        })}

        {/* create */}
        <button onClick={()=>flash&&flash('New glossary — name it and pick a language pair')}
          style={{border:'1.5px dashed var(--line-2)',background:'var(--surface-2)',borderRadius:'var(--radius-xl)',cursor:'pointer',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,padding:'30px 20px',minHeight:200,transition:'.14s',fontFamily:'inherit'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue)';e.currentTarget.style.background='var(--blue-t)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line-2)';e.currentTarget.style.background='var(--surface-2)';}}>
          <span style={{width:42,height:42,borderRadius:11,background:'#fff',color:'var(--blue)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="plus" size={21} sw={2.2}/></span>
          <div style={{fontSize:13.5,fontWeight:600,color:'var(--ink-2)'}}>New glossary</div>
          <div className="muted" style={{fontSize:11.5,textAlign:'center',maxWidth:200,lineHeight:1.45}}>Start a glossary for a new domain or language pair.</div>
        </button>
      </div>
    </div>
  );
}

function FilterGroup({label, items, value, onSet}){
  return (
    <div style={{marginBottom:22}}>
      <div className="eyebrow" style={{marginBottom:9}}>{label}</div>
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        {items.map(it=>{
          const on=value===it.id;
          return (
            <button key={it.id} onClick={()=>onSet(it.id)}
              style={{display:'flex',alignItems:'center',gap:9,width:'100%',padding:'7px 9px',border:0,borderRadius:8,cursor:'pointer',textAlign:'left',
                background:on?'var(--blue-t)':'transparent',color:on?'var(--blue)':'var(--ink-2)',fontFamily:'inherit'}}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background='var(--hover)';}}
              onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent';}}>
              {it.dot && <span style={{width:8,height:8,borderRadius:'50%',background:it.dot,flex:'none'}}></span>}
              {it.icon && <Icon name={it.icon} size={15} style={{flex:'none',opacity:.85}}/>}
              <span style={{flex:1,minWidth:0,fontSize:13,fontWeight:on?600:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.label}</span>
              <span style={{fontSize:11.5,fontWeight:600,color:on?'var(--blue)':'var(--ink-4)',fontVariantNumeric:'tabular-nums'}}>{it.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function useViewportWidth(){
  const [w,setW]=React.useState(typeof window!=='undefined'?window.innerWidth:1280);
  React.useEffect(()=>{ const h=()=>setW(window.innerWidth); window.addEventListener('resize',h); return ()=>window.removeEventListener('resize',h); },[]);
  return w;
}

function Glossary({glossary,onBack,cat,setCat,status,setStatus,q,setQ,sort,setSort,sel,setSel,flash}){
  const w=useViewportWidth();
  const wide=w>=1024;
  const stick={position:'sticky',top:'calc(var(--header-h) + 16px)'};

  const scoped=glossaryEntries(glossary);
  const counts={
    cat:{all:scoped.length, word:0,place:0,formal:0},
    status:{any:scoped.length, gold:0,review:0,deprecated:0,dnt:0},
  };
  scoped.forEach(e=>{counts.cat[e.cat]++; counts.status[e.status]++;});

  let list=scoped.filter(e=>(cat==='all'||e.cat===cat)&&(status==='any'||e.status===status)
    &&(!q.trim()||e.term.toLowerCase().includes(q.toLowerCase())||(e.primary||'').toLowerCase().includes(q.toLowerCase())));
  list=[...list].sort((a,b)=> sort==='az'
    ? a.term.toLowerCase().localeCompare(b.term.toLowerCase())
    : (a.status==='gold'?0:1)-(b.status==='gold'?0:1) || a.term.toLowerCase().localeCompare(b.term.toLowerCase()));
  const cur=scoped.find(e=>e.id===sel)||null;

  return (
    <div style={{maxWidth:1320,margin:'0 auto',padding:'22px 28px 48px',
      display:'grid',gridTemplateColumns:wide?'200px minmax(300px,1fr) 372px':'184px minmax(0,1fr)',gap:wide?24:20,alignItems:'start'}}>

      {/* LEFT RAIL */}
      <div style={wide?stick:undefined}>
        <button onClick={onBack} style={{display:'inline-flex',alignItems:'center',gap:6,border:0,background:'transparent',color:'var(--ink-3)',
          fontSize:12,fontWeight:600,cursor:'pointer',padding:0,marginBottom:12}}>
          <Icon name="chevron_left" size={14} sw={2.2}/>All glossaries
        </button>
        <div className="card card-pad" style={{padding:'15px 16px',marginBottom:18,background:'linear-gradient(180deg,'+glossary.color+'14,#fff)',borderColor:glossary.color+'40'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{width:30,height:30,borderRadius:8,background:glossary.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={glossary.icon} size={17}/></span>
            <div style={{minWidth:0}}>
              <div className="eyebrow" style={{color:glossary.color,marginBottom:1}}>{glossary.pair[0]} → {glossary.pair[1]}</div>
              <div style={{fontSize:13.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{glossary.name}</div>
            </div>
          </div>
          <p style={{fontSize:11.5,color:'var(--ink-3)',lineHeight:1.5,margin:'10px 0 0'}}>{glossary.desc}</p>
        </div>

        <FilterGroup label="Category" value={cat} onSet={setCat} items={[
          {id:'all', label:'All entries', count:counts.cat.all},
          {id:'word', icon:TB_CAT.word.icon, label:TB_CAT.word.plural, count:counts.cat.word},
          {id:'place', icon:TB_CAT.place.icon, label:TB_CAT.place.plural, count:counts.cat.place},
          {id:'formal', icon:TB_CAT.formal.icon, label:TB_CAT.formal.plural, count:counts.cat.formal},
        ]}/>
        <FilterGroup label="Status" value={status} onSet={setStatus} items={[
          {id:'any', label:'Any status', count:counts.status.any},
          {id:'gold', dot:TB_STATUS.gold.color, label:'Gold Copy', count:counts.status.gold},
          {id:'review', dot:TB_STATUS.review.color, label:'In Review', count:counts.status.review},
          {id:'deprecated', dot:TB_STATUS.deprecated.color, label:'Deprecated', count:counts.status.deprecated},
          {id:'dnt', dot:TB_STATUS.dnt.color, label:'Do Not Translate', count:counts.status.dnt},
        ]}/>
      </div>

      {/* MIDDLE — list */}
      <div style={{minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,height:42,padding:'0 14px',border:'1px solid var(--line-2)',background:'#fff',borderRadius:10,boxShadow:'var(--shadow-sm)',marginBottom:14}}>
          <Icon name="search" size={17} style={{color:'var(--ink-3)'}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the glossary…" style={{flex:1,border:0,outline:'none',fontSize:13.5,fontFamily:'inherit',background:'transparent',color:'var(--ink)'}}/>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <span className="muted" style={{fontSize:12.5,fontWeight:500}}>{list.length} of {scoped.length} entries</span>
          <div style={{display:'flex',gap:3,background:'var(--surface-2)',padding:3,borderRadius:8,border:'1px solid var(--line)'}}>
            {[['gold','Gold first'],['az','A–Z']].map(([id,label])=>(
              <button key={id} onClick={()=>setSort(id)} style={{height:26,padding:'0 11px',borderRadius:6,border:0,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit',
                background:sort===id?'#fff':'transparent',color:sort===id?'var(--ink)':'var(--ink-3)',boxShadow:sort===id?'0 1px 2px rgba(29,53,87,.1)':'none'}}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {list.map(e=>{
            const st=TB_STATUS[e.status], k=TB_CAT[e.cat], on=sel===e.id;
            return (
              <div key={e.id} onClick={()=>setSel(e.id)} className="card card-hover"
                style={{padding:'14px 16px',cursor:'pointer',borderColor:on?'var(--blue)':'var(--line)',boxShadow:on?'0 0 0 1px var(--blue), var(--shadow-sm)':'var(--shadow-sm)'}}>
                <div style={{display:'flex',alignItems:'center',gap:9,justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,minWidth:0}}>
                    <span style={{fontFamily:TB_SERIF,fontSize:18,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.term}</span>
                    {e.status==='gold' && <Verified size={16}/>}
                    {e.status==='review' && <Icon name="clock" size={15} style={{color:TB_STATUS.review.color,flex:'none'}}/>}
                    {e.status==='deprecated' && <Icon name="history" size={15} style={{color:TB_STATUS.deprecated.color,flex:'none'}}/>}
                  </div>
                  <LangPair src={e.src} tgt={e.tgt}/>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8,flexWrap:'wrap'}}>
                  <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-2)',border:'1px solid var(--line)',height:20}}><Icon name={k.icon} size={11}/>{k.short}</span>
                  <span className="muted" style={{fontSize:11.5}}>·  {e.domain}</span>
                  {e.status==='dnt' && <span className="badge" style={{background:st.tint,color:st.color,height:20,fontSize:10.5,fontWeight:700}}>DNT</span>}
                </div>
                {e.gloss && <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5,marginTop:9}}>
                  <span style={{fontWeight:600,color:e.status==='dnt'?'var(--ink)':'var(--blue)'}}>{e.primary}</span>
                  <span className="muted"> — {e.gloss}</span>
                </div>}
              </div>
            );
          })}
          {!list.length && <div style={{textAlign:'center',padding:'40px',color:'var(--ink-3)',fontSize:13,border:'1.5px dashed var(--line-2)',borderRadius:12}}>No entries match these filters.</div>}
        </div>
      </div>

      {/* RIGHT — detail */}
      <div style={wide?stick:{gridColumn:'1 / -1'}}>
        {cur ? <TermDetail e={cur} flash={flash}/> : (
          <div className="card card-pad" style={{textAlign:'center',padding:'48px 24px',color:'var(--ink-3)'}}>
            <Icon name="comment" size={26} style={{opacity:.4}}/>
            <div style={{fontSize:13,marginTop:10}}>Select a term to see its full entry.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({label, value, last}){
  return (
    <div style={{display:'flex',gap:12,padding:'8px 0',borderTop:'1px solid var(--line)'}}>
      <span style={{fontSize:11,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--ink-3)',width:108,flex:'none',paddingTop:1}}>{label}</span>
      <span style={{flex:1,fontSize:12.5,color:'var(--ink)',fontWeight:550,lineHeight:1.4}}>{value}</span>
    </div>
  );
}

function TermDetail({e, flash}){
  const st=TB_STATUS[e.status], k=TB_CAT[e.cat];
  return (
    <div className="card" style={{padding:0,overflow:'hidden',maxHeight:'calc(100vh - var(--header-h) - 40px)',display:'flex',flexDirection:'column'}}>
      <div style={{overflowY:'auto',padding:'18px 20px'}}>
        {/* header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:10}}>
          <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-2)',border:'1px solid var(--line)',height:21}}><Icon name={k.icon} size={11}/>{k.label}</span>
          <LangPair src={e.src} tgt={e.tgt}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <h2 style={{fontFamily:TB_SERIF,fontSize:27,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em',margin:0,lineHeight:1.1}}>{e.term}</h2>
          {e.status==='gold' && <Verified size={20}/>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8,flexWrap:'wrap'}}>
          <span style={{fontFamily:TB_SERIF,fontStyle:'italic',fontSize:14,color:'var(--ink-3)'}}>{e.pos}</span>
          <span className="badge" style={{background:st.tint,color:st.color,height:21,fontWeight:600}}>{e.status==='gold'&&<Icon name="check" size={12}/>}{st.label}</span>
        </div>
        <p style={{fontSize:13.5,color:'var(--ink-2)',lineHeight:1.55,margin:'14px 0 0'}}>{e.def}</p>

        {/* variants */}
        {e.variants && e.variants.length>0 && (
          <div style={{marginTop:20}}>
            <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:10}}>
              <span className="eyebrow">Variants &amp; Synonyms</span>
              <span style={{fontSize:10,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--ink-4)'}}>Votes are advisory</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {e.variants.map((v,i)=>{
                const rejected=v.reg==='Rejected', pos=v.votes>=0;
                return (
                  <div key={i} style={{display:'flex',gap:11,padding:'10px 12px',border:'1px solid var(--line)',borderRadius:10,background:rejected?'#FCF4F4':'#fff',opacity:rejected?.85:1}}>
                    <span style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:40,flex:'none',borderRadius:8,
                      background:rejected?'var(--coral-t)':pos?'#E9F4EE':'var(--surface-2)',color:rejected?'var(--coral)':pos?'#16A34A':'var(--ink-3)'}}>
                      <Icon name={pos?'arrow_up':'arrow_down'} size={13} sw={2.4}/>
                      <span style={{fontSize:12,fontWeight:700,lineHeight:1,marginTop:1,fontVariantNumeric:'tabular-nums'}}>{Math.abs(v.votes)}</span>
                    </span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                        <span style={{fontSize:13.5,fontWeight:600,color:rejected?'var(--ink-3)':'var(--ink)',textDecoration:rejected?'line-through':'none'}}>{v.term}</span>
                        <span style={{fontSize:11,fontStyle:'italic',color:rejected?'var(--coral)':'var(--ink-3)'}}>{v.reg}</span>
                        {v.region && <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',border:'1px solid var(--line)',height:17,fontSize:10}}>{v.region}</span>}
                      </div>
                      <div style={{fontSize:12,color:'var(--ink-2)',lineHeight:1.45,marginTop:3}}>{v.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* in context */}
        {e.context && (
          <div style={{marginTop:20}}>
            <span className="eyebrow">In context</span>
            <div style={{marginTop:9,borderLeft:'3px solid var(--blue)',paddingLeft:13,display:'flex',flexDirection:'column',gap:9}}>
              <div>
                <span className="kbd" style={{marginBottom:4}}>EN</span>
                <p style={{fontFamily:TB_SERIF,fontSize:14.5,color:'var(--ink)',lineHeight:1.5,margin:'5px 0 0'}}>{e.context.en}</p>
              </div>
              <div>
                <span className="kbd" style={{marginBottom:4}}>ES</span>
                <p style={{fontFamily:TB_SERIF,fontStyle:'italic',fontSize:14.5,color:'var(--ink-2)',lineHeight:1.5,margin:'5px 0 0'}}>{e.context.es}</p>
              </div>
            </div>
          </div>
        )}

        {/* lexicographer's note */}
        {e.note && (
          <div style={{marginTop:20,padding:'13px 14px',borderRadius:11,background:'var(--accent-subtle)',border:'1px solid #CBDDF5'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
              <Icon name="bulb" size={14} style={{color:'#0073E6'}}/>
              <span className="eyebrow" style={{color:'#0073E6'}}>Lexicographer’s Note</span>
            </div>
            <p style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.55,margin:0}}>{e.note}</p>
          </div>
        )}

        {/* entry data */}
        <div style={{marginTop:20}}>
          <span className="eyebrow">Entry data</span>
          <div style={{marginTop:6}}>
            <MetaRow label="Domain" value={e.domain}/>
            <MetaRow label="Sub-domain" value={e.sub}/>
            <MetaRow label="Part of speech" value={e.pos}/>
            <MetaRow label="Register / Style" value={e.register}/>
            <MetaRow label="Region" value={e.region}/>
            <MetaRow label="Colloquial / Slang" value={e.colloquial}/>
            <MetaRow label="Orthography" value={e.orthography}/>
            {e.related && e.related.length>0 && (
              <div style={{display:'flex',gap:12,padding:'8px 0',borderTop:'1px solid var(--line)'}}>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:'var(--ink-3)',width:108,flex:'none',paddingTop:3}}>Related</span>
                <div style={{flex:1,display:'flex',gap:6,flexWrap:'wrap'}}>
                  {e.related.map(r=><span key={r} className="badge" style={{background:'var(--blue-t)',color:'var(--blue)',height:20}}>{r}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* footer — approval */}
      <div style={{borderTop:'1px solid var(--line)',background:'var(--surface-2)',padding:'12px 18px',display:'flex',alignItems:'center',gap:11}}>
        {e.approver ? (
          <>
            <Verified size={20}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Approved by {e.approver.name}</div>
              <div className="muted" style={{fontSize:11}}>{e.approver.level} · {e.approver.lang} · {e.approver.date}</div>
            </div>
          </>
        ) : (
          <>
            <Icon name="clock" size={18} style={{color:TB_STATUS.review.color,flex:'none'}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,fontWeight:600,color:'var(--ink)'}}>Awaiting ratification</div>
              <div className="muted" style={{fontSize:11}}>No Expert sign-off yet</div>
            </div>
          </>
        )}
        <button className="btn btn-secondary btn-sm" style={{flex:'none'}} onClick={()=>flash&&flash('Propose an edit to “'+e.term+'”')}><Icon name="pen" size={13}/>Propose edit</button>
      </div>
    </div>
  );
}

const TB_QKIND={'New term':{color:'#16A34A',tint:'#F0FDF4',icon:'plus'},'Edit':{color:'#0073E6',tint:'#EBF4FF',icon:'pen'},'Deprecation':{color:'#64748B',tint:'#F1F5F9',icon:'history'}};
function TermReviewQueue({setTab, setSel, setStatus, flash}){
  return (
    <div style={{maxWidth:920,margin:'0 auto',padding:'24px 28px 48px'}}>
      <div className="card card-pad" style={{marginBottom:18,display:'flex',alignItems:'center',gap:13,background:'linear-gradient(180deg,#FFFCF4,#fff)',borderColor:'#F4E6C2'}}>
        <span style={{width:38,height:38,borderRadius:10,background:'#FFFBEB',color:'#B5851C',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="clock" size={19}/></span>
        <div style={{flex:1}}>
          <div style={{fontSize:14.5,fontWeight:700,color:'var(--ink)',letterSpacing:'-.01em'}}>{TB_QUEUE.length} proposals awaiting ratification</div>
          <div className="muted" style={{fontSize:12.5,marginTop:2}}>Expert lexicographers review new terms, edits and deprecations before they enter the Gold Copy.</div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:11}}>
        {TB_QUEUE.map(item=>{
          const kk=TB_QKIND[item.kind];
          return (
            <div key={item.id} className="card card-pad" style={{padding:'15px 18px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:13}}>
                <span style={{width:36,height:36,borderRadius:9,background:kk.tint,color:kk.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name={kk.icon} size={17}/></span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
                    <span style={{fontFamily:TB_SERIF,fontSize:17,fontWeight:600,color:'var(--ink)',letterSpacing:'-.01em'}}>{item.term}</span>
                    <span className="badge" style={{background:kk.tint,color:kk.color,height:20,fontWeight:600}}>{item.kind}</span>
                    <span className="badge" style={{background:'var(--surface-2)',color:'var(--ink-3)',border:'1px solid var(--line)',height:20,fontSize:10.5}}>EN→{item.target}</span>
                  </div>
                  <div style={{fontSize:12.5,color:'var(--ink-2)',lineHeight:1.5,marginTop:6}}>{item.note}</div>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginTop:9,fontSize:11.5,color:'var(--ink-3)'}}>
                    <Avatar id={item.src} size={18}/>Proposed by {PEOPLE[item.src].name.split(' ')[0]}<span style={{width:3,height:3,borderRadius:'50%',background:'var(--ink-4)'}}></span>{item.when} ago
                  </div>
                </div>
                <div style={{display:'flex',gap:7,flex:'none'}}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>flash&&flash('Returned “'+item.term+'” to proposer')}>Decline</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>flash&&flash('Ratified “'+item.term+'” into the Gold Copy')}><Icon name="check" size={14}/>Ratify</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TermbaseWorkspace });
