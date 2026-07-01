// metrics.jsx — analytics page

function MetricsPage(){
  const [range,setRange]=React.useState('30d');
  const perf=[
    {label:'Tasks Completed', value:'248', delta:+18, dir:'up', good:true, accent:'#16A34A', spark:[120,140,135,160,180,200,225,248]},
    {label:'Review Throughput', value:'92', delta:+7, dir:'up', good:true, accent:'#0073E6', spark:[60,68,72,70,78,84,88,92], unit:'/wk'},
    {label:'Avg Approval Time', value:'1.8', delta:-0.4, dir:'down', good:true, accent:'#475569', spark:[3.2,3.0,2.7,2.5,2.2,2.0,1.9,1.8], unit:'days'},
    {label:'Completion Rate', value:'94', delta:+3, dir:'up', good:true, accent:'#B5851C', spark:[86,88,87,90,91,92,93,94], unit:'%'},
  ];
  return (
    <div className="rise">
      <div style={{position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)',background:'rgba(255,255,255,.4)'}}>
        <HeroPattern opacity={0.7}/>
        <div className="page" style={{position:'relative',zIndex:1,paddingTop:34,paddingBottom:26}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>Analytics</div>
              <h1 style={{fontSize:25,fontWeight:700,letterSpacing:'-.03em',margin:0,color:'var(--ink)'}}>Metrics</h1>
              <p className="sec" style={{fontSize:14,margin:'5px 0 0'}}>Performance & productivity across the agency</p>
            </div>
            <div style={{display:'flex',gap:9,alignItems:'center'}}>
              <button className="btn btn-secondary btn-sm"><Icon name="users" size={14}/>All Teams<Icon name="chevron_down" size={13}/></button>
              <button className="btn btn-secondary btn-sm"><Icon name="layers" size={14}/>All Workspaces<Icon name="chevron_down" size={13}/></button>
              <div style={{display:'flex',gap:3,background:'#EEF1F6',padding:3,borderRadius:8}}>
                {['7d','30d','90d'].map(r=>(
                  <button key={r} onClick={()=>setRange(r)} style={{border:0,background:range===r?'#fff':'transparent',color:range===r?'var(--ink)':'var(--ink-3)',
                    fontSize:12.5,fontWeight:550,padding:'5px 11px',borderRadius:6,cursor:'pointer',boxShadow:range===r?'var(--shadow-sm)':'none'}}>{r}</button>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm"><Icon name="download" size={14}/>Export</button>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{paddingTop:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {perf.map(p=>(
            <div key={p.label} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:12.5,fontWeight:550,color:'var(--ink-2)'}}>{p.label}</span>
                <span style={{width:8,height:8,borderRadius:3,background:p.accent}}></span>
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:8}}>
                <span style={{fontSize:28,fontWeight:700,letterSpacing:'-.03em',color:'var(--ink)'}}>{p.value}{p.unit&&<span style={{fontSize:14,fontWeight:600,color:'var(--ink-3)',marginLeft:2}}>{p.unit}</span>}</span>
                <TrendBadge delta={p.delta} dir={p.dir} good={p.good}/>
              </div>
              <Sparkline data={p.spark} color={p.accent} w={210} h={32}/>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.5fr) minmax(0,1fr)',gap:20,marginTop:20,alignItems:'start'}}>
          <div className="card card-pad">
            <SectionHead title="Completion Trends" sub="Tasks completed vs. created · last 8 weeks" icon="trend_up"
              action={<div style={{display:'flex',gap:14}}>
                <Legend c="#0073E6" l="Completed"/><Legend c="#64748B" l="Created"/>
              </div>}/>
            <AreaChart series={[[18,22,26,24,30,34,36,38],[24,26,25,30,32,33,35,34]]} color={['#0073E6','#CBD5E1']}
              labels={['W16','W17','W18','W19','W20','W21','W22','W23']} h={236}/>
          </div>
          <div className="card card-pad">
            <SectionHead title="SLA Performance" sub="On-time delivery" icon="clock"/>
            <div style={{display:'flex',alignItems:'center',gap:22,padding:'8px 0'}}>
              <Donut value={94} label="94%" sub="on time" color="#16A34A" size={132}/>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:12}}>
                {[['Met SLA','#16A34A',94],['At risk','#B5851C',4],['Breached','#DC2626',2]].map(([l,c,v])=>(
                  <div key={l}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12.5,marginBottom:4}}>
                      <span style={{color:'var(--ink-2)',fontWeight:500}}>{l}</span><span style={{fontWeight:600,color:'var(--ink)'}}>{v}%</span>
                    </div>
                    <div style={{height:6,background:'#F1F5F9',borderRadius:4,overflow:'hidden'}}><div style={{width:v+'%',height:'100%',background:c,borderRadius:4}}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1.3fr)',gap:20,marginTop:20,alignItems:'start'}}>
          <div className="card card-pad">
            <SectionHead title="Request Volume" sub="By type · this month" icon="inbox"/>
            <BarChart data={[24,18,31,12]} labels={['Language','Review','Approval','Clearance']}
              color={['#16A34A','#0073E6','#475569','#B5851C']} h={210}/>
          </div>
          <div className="card card-pad">
            <SectionHead title="Team Utilization" sub="Capacity used this week" icon="users"/>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:2}}>
              {WORKLOAD.map(w=>{
                const p=PEOPLE[w.who]; const over=w.load>=90,high=w.load>=75;
                const c=over?'#DC2626':high?'#B5851C':'#16A34A';
                return (
                  <div key={w.who} style={{display:'flex',alignItems:'center',gap:12}}>
                    <Avatar id={w.who} size={26}/>
                    <span style={{width:120,fontSize:12.5,fontWeight:550,color:'var(--ink)'}}>{p.name}</span>
                    <div style={{flex:1,height:8,background:'#F1F5F9',borderRadius:5,overflow:'hidden'}}>
                      <div style={{width:w.load+'%',height:'100%',background:c,borderRadius:5,transition:'width .8s'}}></div>
                    </div>
                    <span style={{width:38,textAlign:'right',fontSize:12.5,fontWeight:600,color:over?'#DC2626':'var(--ink-2)'}}>{w.load}%</span>
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
function Legend({c,l}){
  return <span style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--ink-2)',fontWeight:500}}><span style={{width:9,height:9,borderRadius:3,background:c}}></span>{l}</span>;
}

Object.assign(window, { MetricsPage });
