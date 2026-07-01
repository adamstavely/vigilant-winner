// app.jsx — root, routing, shared task state + AI agent integration
function App(){
  const [page, setPage] = React.useState('dashboard');
  const [tasks, setTasks] = React.useState(TASKS);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('finance');
  const [profileId, setProfileId] = React.useState(null);
  const [deviceId, setDeviceId] = React.useState(null);
  const [topicId, setTopicId] = React.useState(null);

  // ---- AI agents ----
  const [t, setTweak] = useTweaks(AGENT_TWEAK_DEFAULTS);
  const [runId, setRunId] = React.useState(null);            // open run detail
  const [newReq, setNewReq] = React.useState(false);         // "New request" chooser
  const [kickoff, setKickoff] = React.useState(null);        // {agentId, prefill}
  const [askAI, setAskAI] = React.useState(false);           // Ask AI drawer
  const agentProps = { glyph:t.glyph, framing:t.framing, flat:t.flat, convergence:t.convergence };

  function openRun(id){ setRunId(id); setPage('agentrun'); }
  function openNewRequest(){ setNewReq(true); }
  function goAgents(){ window.__tasksView='fleet'; setPage('tasks'); }
  window.__goAgents = goAgents;
  function openKickoff(agentId, prefill){ setNewReq(false); setKickoff({agentId:agentId||null, prefill:prefill||null}); }
  function launchAgent(agentId, mode){
    setKickoff(null);
    const code = AGENTS[agentId].code;
    flash(code+' launched — running now');
    const existing = RUNS.find(r=>r.agent===agentId && (r.status==='running'||r.status==='needs_you'||r.status==='ready'));
    if(existing){ openRun(existing.id); } else { goAgents(); }
  }
  function teamRequest(type){ setNewReq(false); flash((type?type.label:'Request')+' submitted to your team'); }

  function runSearch(q){ setSearchQuery((q||'').trim()||'finance'); setPage('search'); }
  function openPerson(id){ setProfileId(id); setPage('profile'); }
  function openDevice(id){ setDeviceId(id); setPage('device'); }
  function openTopic(id){ setTopicId(id); setPage('topic'); }
  window.__openPerson = openPerson;
  window.__openKickoff = (agentId, prefill)=>openKickoff(agentId, prefill);
  window.__openRun = openRun;
  window.__agentTweaks = agentProps;
  window.__setPage = setPage;
  window.__openAskAI = ()=>setAskAI(true);
  window.__openTasks = (o={})=>{ window.__tasksView=o.view||'board'; window.__tasksAsg=o.asg||null; window.__tasksWf=o.wf||null; setPage('tasks'); };

  React.useEffect(()=>{ window.scrollTo({top:0}); }, [page, runId]);

  function moveTask(id, col){ setTasks(ts=>ts.map(t=>t.id===id?{...t,col}:t)); }
  function openTask(id){ setSelectedTask(id); }
  function addTask(t){ setTasks(ts=>[t,...ts]); flash('Task created'); }
  function flash(msg){ setToast(msg); clearTimeout(window.__t); window.__t=setTimeout(()=>setToast(null),2400); }

  const task = tasks.find(t=>t.id===selectedTask);

  let body;
  if(page==='agentrun') body=<AgentRunDetail runId={runId} setPage={setPage} flash={flash} {...agentProps}/>;
  else if(page==='dashboard') body=<Dashboard setPage={setPage} openTask={openTask} openCreate={openNewRequest}/>;
  else if(page==='tasks') body=<TasksPage tasks={tasks} moveTask={moveTask} openTask={openTask} openCreate={openNewRequest} openKickoff={openKickoff} openRun={openRun} flash={flash} {...agentProps}/>;
  else if(page==='metrics') body=<MetricsPage/>;
  else if(page==='tools') body=<ToolsPage setPage={setPage} flash={flash}/>;
  else if(page==='explore') body=<ExplorePage setPage={setPage} openCreate={openNewRequest} flash={flash} onSearch={runSearch} openPerson={openPerson} openDevice={openDevice} openTopic={openTopic}/>;
  else if(page==='profile') body=<PersonProfile id={profileId} setPage={setPage} openTask={openTask} openDevice={openDevice} flash={flash}/>;
  else if(page==='myprofile') body=<MyProfile setPage={setPage} openTask={openTask} openDevice={openDevice} flash={flash}/>;
  else if(page==='termbase') body=<TermbaseWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='device') body=<DeviceDetail id={deviceId} setPage={setPage} openPerson={openPerson} flash={flash}/>;
  else if(page==='topic') body=<TopicDetail id={topicId} setPage={setPage} openDevice={openDevice} openPerson={openPerson} flash={flash}/>;
  else if(page==='clearance') body=<ClearanceWorkspace setPage={setPage} flash={flash} openKickoff={openKickoff} {...agentProps}/>;
  else if(page==='memos') body=<MemosWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='prep') body=<PrepWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='briefings') body=<BriefingsWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='knowledge') body=<KnowledgeWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='upload') body=<DataUploadWorkspace setPage={setPage} flash={flash}/>;
  else if(page==='search') body=<SearchResults query={searchQuery} setPage={setPage} onSearch={runSearch}/>;
  else if(page==='review') body=<ReviewQueue setPage={setPage} flash={flash} folderName={window.__reviewFolder} openKickoff={openKickoff} {...agentProps}/>;
  else body=<WorkspaceDetail id={page} setPage={setPage} openTask={openTask} openCreate={openNewRequest} flash={flash} onSearch={runSearch}/>;

  return (
    <React.Fragment>
      <div className="mesh-bg"></div>
      <div className="shell">
        <Header page={page} setPage={setPage} onCreate={openNewRequest} onSearch={runSearch} openRun={openRun} {...agentProps}/>
        {body}
      </div>
      {task && <TaskDrawer task={task} onClose={()=>setSelectedTask(null)} moveTask={moveTask}/>}
      {creating && <CreateModal onClose={()=>setCreating(false)} onCreate={addTask}/>}
      {newReq && <NewRequestModal onClose={()=>setNewReq(false)} onDelegate={openKickoff} onTeamRequest={teamRequest} {...agentProps}/>}
      {kickoff && <KickoffModal onClose={()=>setKickoff(null)} agentId={kickoff.agentId} prefill={kickoff.prefill} launch={launchAgent} {...agentProps}/>}
      {askAI && <AskAIDrawer onClose={()=>setAskAI(false)} openRun={openRun} {...agentProps}/>}
      <AgentTweaks t={t} setTweak={setTweak}/>
      {toast && (
        <div className="pop" style={{position:'fixed',bottom:26,left:'50%',transform:'translateX(-50%)',zIndex:400,
          background:'var(--ink)',color:'#fff',padding:'11px 18px',borderRadius:11,fontSize:13.5,fontWeight:550,
          display:'flex',alignItems:'center',gap:9,boxShadow:'var(--shadow-lg)'}}>
          <span style={{width:18,height:18,borderRadius:'50%',background:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="check" size={12} sw={3} style={{color:'#fff'}}/></span>
          {toast}
        </div>
      )}
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
