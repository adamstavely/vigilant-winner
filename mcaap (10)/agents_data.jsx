// agents_data.jsx — AI agent roster, runs, statuses, reasoning streams

// ---- the agent roster: each maps to a real IMIN litigation workflow ----
const AGENTS = {
  atlas: {
    id:'atlas', code:'ATLAS', role:'Relevance Coder', wf:'relevance',
    color:'#0073E6', tint:'#EBF4FF', icon:'target',
    skill:'First-pass responsiveness & relevance coding across document sets',
    autonomyDefault:'checkpoint' },
  cassius: {
    id:'cassius', code:'CASSIUS', role:'Privilege Sentinel', wf:'privilege',
    color:'#B5851C', tint:'#F8F0DA', icon:'shield',
    skill:'Flags attorney–client privilege & drafts privilege-log entries',
    autonomyDefault:'checkpoint' },
  vesta: {
    id:'vesta', code:'VESTA', role:'Clearance Screener', wf:'press',
    color:'#16A34A', tint:'#F0FDF4', icon:'megaphone',
    skill:'Screens public statements & filings for Rule 3.6 / privilege risk',
    autonomyDefault:'checkpoint' },
  solon: {
    id:'solon', code:'SOLON', role:'Brief Drafter', wf:'brief',
    color:'#E1574F', tint:'#FDEBEA', icon:'pen',
    skill:'Drafts brief & memo sections from the record and templates',
    autonomyDefault:'copilot' },
  juno: {
    id:'juno', code:'JUNO', role:'Deposition Prep', wf:'deposition',
    color:'#475569', tint:'#F1F5F9', icon:'mic',
    skill:'Builds depo outlines, pulls exhibits & cross-refs the chronology',
    autonomyDefault:'copilot' },
  oracle: {
    id:'oracle', code:'ORACLE', role:'Research Analyst', wf:null,
    color:'#16A34A', tint:'#F0FDF4', icon:'bulb',
    skill:'Ask-anything research across the matter record & case law',
    autonomyDefault:'auto' },
};
const AGENT_ORDER = ['atlas','cassius','vesta','solon','juno','oracle'];

// ---- run lifecycle states ----
const RUN_STATUS = {
  running:   {label:'Running',             color:'#0073E6', tint:'#EBF4FF', live:true},
  needs_you: {label:'Needs your approval', color:'#E8920C', tint:'#FCF0DC'},
  ready:     {label:'Output ready',        color:'#475569', tint:'#F1F5F9'},
  paused:    {label:'Paused',              color:'#64748B', tint:'#F1F5F9'},
  queued:    {label:'Queued',              color:'#1D3557', tint:'#EAF0F7'},
  blocked:   {label:'Needs input',         color:'#DC2626', tint:'#FEF2F2'},
  done:      {label:'Completed',           color:'#16A34A', tint:'#F0FDF4'},
};

// autonomy modes
const AUTONOMY = {
  auto:      {label:'Autonomous',  icon:'sync',   desc:'Runs to completion, then reports back', color:'#16A34A'},
  checkpoint:{label:'Checkpoints', icon:'shield_check', desc:'Pauses at key gates for your sign-off', color:'#E8920C'},
  copilot:   {label:'Co-pilot',    icon:'hand',   desc:'Proposes every step; you accept each one', color:'#0073E6'},
};

// ---- the live fleet of agent runs ----
// step.kind: think | read | act | gate | done | wait | search | write
const RUNS = [
  {
    id:'AR-318', agent:'cassius', status:'needs_you', autonomy:'checkpoint',
    title:'Privilege review — GC separation memo set',
    matter:'Vantage v. Meridian', workspace:'Privilege sign-off', wfTask:'M3',
    progress:84, metric:'12 of 248 flagged', started:'26m ago', startedBy:'tyler',
    eta:'Waiting on you', tokens:'118k',
    summary:'Reviewed 248 documents from the GC separation memo set. 12 new attorney–client communications are ready for the privilege log — pending your approval.',
    gate:{
      kind:'approve_rows',
      title:'Approve 12 privilege-log entries',
      body:'I found 12 new attorney–client privileged communications not yet on the log. Approve before I write them to the privilege log for VANT-PROD-002.',
      rows:[
        {doc:'VANT-018442', from:'M. Reyes (GC)', to:'CEO + Board', basis:'A/C — legal advice re: separation terms', conf:0.97},
        {doc:'VANT-018517', from:'Outside counsel', to:'M. Reyes (GC)', basis:'A/C — work product, draft memo', conf:0.95},
        {doc:'VANT-018610', from:'M. Reyes (GC)', to:'HR Director', basis:'A/C — legal advice re: disclosure', conf:0.88},
        {doc:'VANT-018663', from:'CEO', to:'M. Reyes (GC)', basis:'A/C — request for legal advice', conf:0.84},
      ],
      more:8 },
    steps:[
      {t:'08:42', kind:'read',  txt:'Loaded 248 documents from “GC separation memo” set (VANT-PROD-002).'},
      {t:'08:43', kind:'think', txt:'Scanning for attorney–client and work-product indicators across custodians.'},
      {t:'08:51', kind:'search',txt:'Identified 31 candidate privileged communications. Cross-checking against the existing log.'},
      {t:'08:58', kind:'act',   txt:'19 candidates already logged under entries P-204…P-222 — excluded as duplicates.'},
      {t:'09:04', kind:'think', txt:'Narrowed to 12 new attorney–client communications with confidence ≥ 0.82.'},
      {t:'09:06', kind:'gate',  txt:'Drafted 12 privilege-log entries. Holding for your approval before writing to the log.'},
    ],
  },
  {
    id:'AR-322', agent:'atlas', status:'running', autonomy:'checkpoint',
    title:'First-pass coding — VANT-PROD-002 hot docs',
    matter:'Vantage v. Meridian', workspace:'Relevance coding', wfTask:'M4',
    progress:62, metric:'2,981 of 4,820 docs', started:'1h ago', startedBy:'team',
    eta:'~24 min left', tokens:'2.1M',
    summary:'Coding the VANT-PROD-002 production for responsiveness and issue tags. Flagging hot documents for second-level review as it goes.',
    steps:[
      {t:'08:05', kind:'read',  txt:'Opened production VANT-PROD-002 — 4,820 documents across 6 custodians.'},
      {t:'08:06', kind:'think', txt:'Applied issue taxonomy: Responsive, Privileged, Hot, Needs-review.'},
      {t:'08:31', kind:'act',   txt:'Coded 1,500 documents. 214 responsive, 38 flagged hot, 9 escalated to privilege.'},
      {t:'09:02', kind:'act',   txt:'Coded 2,981 / 4,820. 41 hot docs queued for your second-level review.'},
      {t:'09:03', kind:'think', txt:'Confidence dropping on Caldwell custodian — denser legal content. Slowing pass.'},
    ],
  },
  {
    id:'AR-310', agent:'vesta', status:'ready', autonomy:'checkpoint',
    title:'Risk screen — MSJ filing press release',
    matter:'Vantage v. Meridian', workspace:'Press clearance', wfTask:'M1',
    progress:100, metric:'5 findings · 2 high-risk', started:'2h ago', startedBy:'jordan',
    eta:'Output ready', tokens:'64k',
    summary:'Screened the draft press release for the MSJ filing. 5 findings: 2 high-risk (a privilege reference and a Rule 3.6 trial-publicity concern) and 3 minor accuracy edits.',
    steps:[
      {t:'07:10', kind:'read',  txt:'Loaded draft press release “Vantage moves for summary judgment”.'},
      {t:'07:11', kind:'think', txt:'Checking against Rule 3.6, protective order, and privilege boundaries.'},
      {t:'07:18', kind:'search',txt:'Matched paragraph 3 to sealed exhibit — potential privilege reference.'},
      {t:'07:24', kind:'act',   txt:'Compiled 5 findings with suggested redlines. 2 high-risk, 3 minor.'},
      {t:'07:25', kind:'done',  txt:'Screen complete. Findings ready for your clearance decision.'},
    ],
    findings:[
      {sev:'high', rule:'A/C Privilege', txt:'Paragraph 3 paraphrases a sealed, privileged GC memo. Recommend striking the clause.'},
      {sev:'high', rule:'Rule 3.6', txt:'“We expect the court to agree” may be improper trial publicity. Soften to factual posture.'},
      {sev:'low',  rule:'Accuracy',  txt:'Filing date listed as June 6; docket shows June 9.'},
      {sev:'low',  rule:'Accuracy',  txt:'Caption misstates the case number suffix (-CV-4471, not -4417).'},
      {sev:'low',  rule:'Style',     txt:'Quote attribution missing title for lead counsel.'},
    ],
  },
  {
    id:'AR-305', agent:'solon', status:'running', autonomy:'copilot',
    title:'Draft argument § III — Motion for Summary Judgment',
    matter:'Vantage v. Meridian', workspace:'Brief review', wfTask:'M2',
    progress:48, metric:'Section III.B of V', started:'40m ago', startedBy:'okafor',
    eta:'Proposing next edit', tokens:'340k',
    summary:'Drafting the argument section of the MSJ. Co-pilot mode — proposing one paragraph at a time for A. Okafor to accept, edit, or rewrite.',
    steps:[
      {t:'08:35', kind:'read',  txt:'Loaded brief shell, statement of facts, and 22 cited authorities.'},
      {t:'08:40', kind:'write', txt:'Drafted § III.A — standard of review. Accepted by A. Okafor.'},
      {t:'08:52', kind:'write', txt:'Drafted § III.B ¶1 — no genuine dispute as to the separation terms.'},
      {t:'09:01', kind:'wait',  txt:'Proposed § III.B ¶2 citing Caldwell. Waiting for accept / edit.'},
    ],
  },
  {
    id:'AR-298', agent:'juno', status:'paused', autonomy:'copilot',
    title:'Outline — Henderson deposition',
    matter:'Vantage v. Meridian', workspace:'Deposition prep', wfTask:'M5',
    progress:30, metric:'Outline 30% · 14 exhibits', started:'Paused 3h ago', startedBy:'tyler',
    eta:'Paused by you', tokens:'88k',
    summary:'Building the Henderson cross outline and tying exhibits to the chronology. You paused this to prioritise the privilege review.',
    steps:[
      {t:'06:02', kind:'read',  txt:'Loaded Henderson custodial file and the master chronology.'},
      {t:'06:14', kind:'act',   txt:'Drafted outline topics 1–4. Linked 14 exhibits to chronology entries.'},
      {t:'06:20', kind:'wait',  txt:'Paused by Tyler Chen — “focus the fleet on the privilege deadline first.”'},
    ],
  },
  {
    id:'AR-287', agent:'oracle', status:'done', autonomy:'auto',
    title:'Research memo — spoliation sanctions, 9th Cir.',
    matter:'Vantage v. Meridian', workspace:'Knowledge', wfTask:null,
    progress:100, metric:'Memo · 9 authorities', started:'Done 14m ago', startedBy:'tyler',
    eta:'Completed', tokens:'210k',
    summary:'Researched the standard for spoliation sanctions in the 9th Circuit and drafted a 3-page memo with 9 controlling and persuasive authorities.',
    steps:[
      {t:'08:20', kind:'read',  txt:'Parsed the question: adverse-inference standard after FRCP 37(e) amendments.'},
      {t:'08:24', kind:'search',txt:'Pulled 9th Cir. authorities + 3 N.D. Cal. opinions on intent to deprive.'},
      {t:'08:33', kind:'write', txt:'Drafted 3-page memo with a controlling-authority table and recommendation.'},
      {t:'08:36', kind:'done',  txt:'Memo filed to Knowledge → Vantage v. Meridian. Notified Tyler Chen.'},
    ],
  },
  {
    id:'AR-330', agent:'atlas', status:'queued', autonomy:'checkpoint',
    title:'First-pass coding — Caldwell custodian',
    matter:'Vantage v. Meridian', workspace:'Relevance coding', wfTask:null,
    progress:0, metric:'Queued · 2,140 docs', started:'Scheduled 10:30', startedBy:'team',
    eta:'Starts after AR-322', tokens:'—',
    summary:'Queued to run after the current production pass finishes. Will code the Caldwell custodian set for responsiveness.',
    steps:[
      {t:'—', kind:'wait', txt:'Waiting for ATLAS to free up after AR-322 completes (~24 min).'},
    ],
  },
];

function runsByStatus(s){ return RUNS.filter(r=>r.status===s); }
function needsYou(){ return RUNS.filter(r=>r.status==='needs_you'||r.status==='ready'||r.status==='blocked'); }

// map a Tasks-board workflow id -> the agent that handles it
const WF_AGENT = { press:'vesta', relevance:'atlas', brief:'solon', privilege:'cassius', deposition:'juno', production:'atlas' };
// is there a live/active run tied to this workflow task id?
function runForTask(taskId){ return RUNS.find(r=>r.wfTask===taskId && r.status!=='done' && r.status!=='queued'); }

// ---- convergence: place agent runs into the Tasks kanban ----
// pipeline-column placement (when a specific workflow is selected)
const RUN_BOARD_COL = { 'AR-318':'review', 'AR-322':'first', 'AR-310':'counsel', 'AR-305':'draft', 'AR-298':'exhibits', 'AR-330':'queue' };
// generic-column placement (the "All" board: To do / In progress / Blocked / Done)
const RUN_GEN_COL = { queued:'todo', running:'in_progress', needs_you:'blocked', ready:'blocked', blocked:'blocked', paused:'blocked', done:'done' };
// runs that belong on the board for a given workflow filter ('all' or a wf id); research (no wf) is excluded
function boardRunsFor(wfId){ return RUNS.filter(r=>{ const w=AGENTS[r.agent].wf; if(!w) return false; return wfId==='all' ? true : w===wfId; }); }
function runCol(run, isWf){ return isWf ? RUN_BOARD_COL[run.id] : RUN_GEN_COL[run.status]; }

const STEP_KIND = {
  think: {icon:'bulb',     color:'#475569'},
  read:  {icon:'file',     color:'#0073E6'},
  search:{icon:'search',   color:'#0073E6'},
  act:   {icon:'target',   color:'#16A34A'},
  write: {icon:'pen',      color:'#E1574F'},
  gate:  {icon:'shield',   color:'#E8920C'},
  wait:  {icon:'clock',    color:'#64748B'},
  done:  {icon:'check',    color:'#16A34A'},
};

Object.assign(window, { AGENTS, AGENT_ORDER, RUN_STATUS, AUTONOMY, RUNS, runsByStatus, needsYou, STEP_KIND, WF_AGENT, runForTask, RUN_BOARD_COL, RUN_GEN_COL, boardRunsFor, runCol });
