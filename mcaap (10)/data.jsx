// data.jsx — sample data for IMIN
const PEOPLE = {
  tyler:  {id:'tyler',  name:'Tyler Chen',     initials:'TC', color:'#0073E6', role:'Operations Lead',  dept:'Operations',   status:'online',  location:'San Francisco, CA', tz:'PT · UTC−7',  email:'tyler.chen@imin.team',    phone:'+1 (415) 555‑0142', joined:'Mar 2021', mgr:null,    bio:'Runs production operations and keeps the content pipeline moving end to end.'},
  maya:   {id:'maya',   name:'Maya Okafor',    initials:'MO', color:'#1D3557', role:'Senior Editor',    dept:'Editorial',    status:'online',  location:'Brooklyn, NY',      tz:'ET · UTC−4',  email:'maya.okafor@imin.team',   phone:'+1 (917) 555‑0188', joined:'Aug 2021', mgr:'lena',  bio:'Leads long-form edits and house style across every published asset.'},
  diego:  {id:'diego',  name:'Diego Ramírez',  initials:'DR', color:'#1D3557', role:'Motion Designer',  dept:'Creative',     status:'away',    location:'Austin, TX',        tz:'CT · UTC−5',  email:'diego.ramirez@imin.team', phone:'+1 (512) 555‑0119', joined:'Jan 2022', mgr:'lena',  bio:'Builds motion systems, title sequences and the studio’s animation language.'},
  priya:  {id:'priya',  name:'Priya Nair',     initials:'PN', color:'#1D3557', role:'Localization Lead',dept:'Localization', status:'offline', location:'London, UK',        tz:'BST · UTC+1', email:'priya.nair@imin.team',    phone:'+44 20 7946 0312',  joined:'May 2022', mgr:'tyler', bio:'Adapts campaigns for EU markets and owns the localization QA loop.'},
  sam:    {id:'sam',    name:'Sam Whitfield',  initials:'SW', color:'#1D3557', role:'Account Manager',  dept:'Accounts',     status:'online',  location:'Chicago, IL',       tz:'CT · UTC−5',  email:'sam.whitfield@imin.team', phone:'+1 (312) 555‑0167', joined:'Feb 2021', mgr:'tyler', bio:'Primary client liaison; manages clearance, approvals and delivery timelines.'},
  lena:   {id:'lena',   name:'Lena Brandt',    initials:'LB', color:'#1D3557', role:'Creative Director',dept:'Creative',     status:'online',  location:'Los Angeles, CA',   tz:'PT · UTC−7',  email:'lena.brandt@imin.team',   phone:'+1 (213) 555‑0104', joined:'Nov 2020', mgr:null,    bio:'Sets the creative direction and signs off on every brand-facing deliverable.'},
  noah:   {id:'noah',   name:'Noah Kim',       initials:'NK', color:'#1D3557', role:'Copywriter',       dept:'Editorial',    status:'away',    location:'Denver, CO',        tz:'MT · UTC−6',  email:'noah.kim@imin.team',      phone:'+1 (720) 555‑0153', joined:'Jun 2022', mgr:'maya',  bio:'Writes campaign, web and product copy with a sharp, conversational voice.'},
  aria:   {id:'aria',   name:'Aria Volkov',    initials:'AV', color:'#1D3557', role:'QA Reviewer',      dept:'Quality',      status:'online',  location:'Toronto, CA',       tz:'ET · UTC−4',  email:'aria.volkov@imin.team',   phone:'+1 (416) 555‑0176', joined:'Sep 2022', mgr:'tyler', bio:'Final-pass QA on accessibility, accuracy and release readiness.'},
};
const PL = Object.values(PEOPLE);
const PERSON_STATUS = {
  online:  {label:'Online',  color:'#16A34A'},
  away:    {label:'Away',    color:'#B5851C'},
  offline: {label:'Offline', color:'#64748B'},
};

// ---- CRM layer: each person is a tracked working relationship ----
const REL_STATUS = {
  active:   {label:'Active',      color:'#16A34A', tint:'#F0FDF4'},
  renewal:  {label:'Renewal due', color:'#B5851C', tint:'#FFFBEB'},
  prospect: {label:'Prospect',    color:'#0073E6', tint:'#EBF4FF'},
  lapsed:   {label:'Lapsed',      color:'#64748B', tint:'#F1F5F9'},
};
const _CRM = {
  tyler: {relType:'Staff',      company:'IMIN — Operations', rel:'active',  owner:null,    value:null,      contractEnd:null,         since:'2021', lastMet:'Jun 5', next:'Jun 8',  meetings:18},
  maya:  {relType:'Contractor', company:'Okafor Editorial',  rel:'renewal', owner:'sam',   value:'$96k/yr', contractEnd:'2026-06-30', since:'2021', lastMet:'Jun 2', next:'Jun 9',  meetings:31},
  diego: {relType:'Freelance',  company:'Ramírez Motion',    rel:'active',  owner:'lena',  value:'$72k/yr', contractEnd:'2026-12-15', since:'2022', lastMet:'May 28',next:'Jun 11', meetings:24},
  priya: {relType:'Agency',     company:'Nair Localization', rel:'active',  owner:'tyler', value:'£40k/yr', contractEnd:'2026-09-01', since:'2022', lastMet:'May 20',next:'Jun 14', meetings:16},
  sam:   {relType:'Staff',      company:'IMIN — Accounts',   rel:'active',  owner:null,    value:null,      contractEnd:null,         since:'2021', lastMet:'Jun 4', next:'Jun 8',  meetings:22},
  lena:  {relType:'Staff',      company:'IMIN — Creative',   rel:'active',  owner:null,    value:null,      contractEnd:null,         since:'2020', lastMet:'Jun 3', next:'Jun 10', meetings:29},
  noah:  {relType:'Freelance',  company:'Kim Copywriting',   rel:'renewal', owner:'maya',  value:'$60k/yr', contractEnd:'2026-06-20', since:'2022', lastMet:'May 30',next:'Jun 12', meetings:14},
  aria:  {relType:'Vendor',     company:'Volkov QA Labs',    rel:'active',  owner:'tyler', value:'$54k/yr', contractEnd:'2026-11-01', since:'2022', lastMet:'May 26',next:'Jun 16', meetings:11},
};
Object.keys(_CRM).forEach(k=>Object.assign(PEOPLE[k], _CRM[k]));
// "today" anchor for the prototype is Jun 6, 2026
function daysUntil(iso){ if(!iso) return null; return Math.round((new Date(iso) - new Date('2026-06-06'))/86400000); }

const TAGS = {
  campaign:{label:'Campaign', color:'#0073E6', tint:'#EBF4FF'},
  video:   {label:'Video',    color:'#475569', tint:'#F1F5F9'},
  social:  {label:'Social',   color:'#0EA5E9', tint:'#F0F9FF'},
  brand:   {label:'Brand',    color:'#B5851C', tint:'#FFFBEB'},
  web:     {label:'Web',      color:'#0073E6', tint:'#EBF4FF'},
  print:   {label:'Print',    color:'#16A34A', tint:'#F0FDF4'},
  legal:   {label:'Legal',    color:'#DC2626', tint:'#FEF2F2'},
  loc:     {label:'Localize', color:'#16A34A', tint:'#F0FDF4'},
};

const STATUS = {
  backlog:    {label:'Backlog',     color:'#64748B', tint:'#F1F5F9'},
  in_progress:{label:'In Progress', color:'#0073E6', tint:'#EBF4FF'},
  review:     {label:'In Review',   color:'#B5851C', tint:'#FFFBEB'},
  complete:   {label:'Complete',    color:'#16A34A', tint:'#F0FDF4'},
};
const PRIORITY = {
  urgent:{label:'Urgent', color:'#DC2626'},
  high:  {label:'High',   color:'#B5851C'},
  med:   {label:'Medium', color:'#0073E6'},
  low:   {label:'Low',    color:'#64748B'},
};

const COLUMNS = [
  {id:'backlog', label:'Backlog'},
  {id:'in_progress', label:'In Progress'},
  {id:'review', label:'Review'},
  {id:'complete', label:'Complete'},
];

// due dates relative to "today" June 5 2026
function mk(id, file, col, due, tags, who, pri, opts={}){
  return {id, file, col, due, tags, assignees:who, priority:pri,
    comments:opts.c||0, attachments:opts.a||0, workspace:opts.ws||'Content',
    desc:opts.desc||'', updates:opts.updates||0, ...opts};
}
const TASKS = [
  mk('T-204','Q3 Brand Campaign — Hero Cut.mp4','in_progress','Jun 6',['campaign','video'],['diego','lena'],'urgent',{c:8,a:3,desc:'Final hero edit for the Q3 launch. Color grade approved; awaiting motion title pass.'}),
  mk('T-198','Acme Rebrand — Style Guide.pdf','review','Jun 5',['brand','print'],['lena','maya'],'high',{c:4,a:2,desc:'Full visual identity guidelines. Needs creative director sign-off before client delivery.'}),
  mk('T-211','Spring Social — Reel Pack (12).zip','in_progress','Jun 9',['social','video'],['noah','diego'],'med',{c:2,a:12,desc:'Twelve short-form reels for the spring push across IG + TikTok.'}),
  mk('T-187','Landing Page — Pricing Refresh','review','Jun 4',['web'],['noah'],'high',{c:6,a:1,desc:'Copy + layout refresh for the pricing page experiment.'}),
  mk('T-220','FR/DE Localization — Launch Email','backlog','Jun 12',['loc','campaign'],['priya'],'med',{c:1,a:0,desc:'Translate and adapt the launch email for French and German markets.'}),
  mk('T-176','Investor Deck — Visual Polish','complete','Jun 2',['brand','print'],['lena','sam'],'med',{c:11,a:5,desc:'Series B narrative deck refinement.'}),
  mk('T-215','Trademark Clearance — “Northwind”','backlog','Jun 14',['legal'],['sam'],'high',{c:0,a:1,ws:'Requests',desc:'Clearance check for the proposed product name ahead of filing.'}),
  mk('T-201','Homepage Hero — Variant Test','in_progress','Jun 8',['web','campaign'],['noah','priya'],'low',{c:3,a:2,desc:'A/B variant of homepage hero messaging.'}),
  mk('T-193','Podcast Series — Cover Art','review','Jun 7',['brand','social'],['diego'],'med',{c:5,a:4,desc:'Cover art system for the new 8-episode series.'}),
  mk('T-184','Annual Report — Infographics','complete','Jun 1',['print','brand'],['maya','aria'],'low',{c:9,a:6,desc:'Data visualizations for the FY annual report.'}),
  mk('T-222','Accessibility Audit — Web App','backlog','Jun 16',['web','legal'],['aria'],'med',{c:0,a:0,desc:'WCAG 2.2 AA audit pass on the marketing site.'}),
  mk('T-209','Holiday Teaser — Storyboard','in_progress','Jun 10',['video','campaign'],['lena','diego'],'high',{c:2,a:3,desc:'Storyboard for the 30s holiday teaser spot.'}),
  mk('T-167','Press Kit — Photography Set','complete','May 30',['brand'],['sam','maya'],'low',{c:7,a:18,desc:'Curated press photography and bios.'}),
  mk('T-218','Newsletter Template — Modular','backlog','Jun 18',['web','social'],['noah'],'low',{c:0,a:0,desc:'Reusable modular newsletter system in the ESP.'}),
];

const REQUESTS = [
  {id:'R-88', name:'“Northwind” Name Clearance',  type:'Clearance', submitted:'Jun 3', status:'In Review', reviewer:'sam',   due:'Jun 9'},
  {id:'R-91', name:'FR/DE Launch Email Copy',      type:'Language',  submitted:'Jun 4', status:'Submitted', reviewer:'priya', due:'Jun 12'},
  {id:'R-84', name:'Q3 Hero Cut — Legal Review',   type:'Review',    submitted:'Jun 2', status:'In Review', reviewer:'aria',  due:'Jun 6'},
  {id:'R-90', name:'Style Guide — Final Approval',  type:'Approval',  submitted:'Jun 3', status:'Approved',  reviewer:'lena',  due:'Jun 5'},
  {id:'R-79', name:'Pricing Page Copy — Sign-off',  type:'Approval',  submitted:'May 31',status:'Completed', reviewer:'tyler', due:'Jun 2'},
  {id:'R-92', name:'Reel Pack — Music Licensing',  type:'Clearance', submitted:'Jun 4', status:'Submitted', reviewer:'sam',   due:'Jun 13'},
  {id:'R-77', name:'Investor Deck — Disclaimer',    type:'Language',  submitted:'May 29',status:'Rejected',  reviewer:'aria',  due:'Jun 1'},
];
const REQ_STATUS = {
  'Submitted':{color:'#64748B', tint:'#F1F5F9'},
  'In Review':{color:'#B5851C', tint:'#FFFBEB'},
  'Approved': {color:'#16A34A', tint:'#F0FDF4'},
  'Rejected': {color:'#DC2626', tint:'#FEF2F2'},
  'Completed':{color:'#0073E6', tint:'#EBF4FF'},
};
const REQ_TYPE = {
  'Language': '#16A34A','Review':'#0073E6','Approval':'#475569','Clearance':'#B5851C'
};

const ACTIVITY = [
  {who:'lena',  verb:'approved', what:'Style Guide — Final Approval', kind:'approval', t:'12m'},
  {who:'diego', verb:'moved',    what:'Q3 Brand Campaign — Hero Cut to In Progress', kind:'status', t:'34m'},
  {who:'aria',  verb:'completed review on', what:'Annual Report — Infographics', kind:'review', t:'1h'},
  {who:'noah',  verb:'commented on', what:'Landing Page — Pricing Refresh', kind:'comment', t:'2h'},
  {who:'sam',   verb:'assigned',  what:'Trademark Clearance — “Northwind” to you', kind:'assign', t:'3h'},
  {who:'maya',  verb:'attached 2 files to', what:'Acme Rebrand — Style Guide', kind:'attach', t:'4h'},
  {who:'priya', verb:'submitted', what:'FR/DE Launch Email Copy request', kind:'request', t:'5h'},
];
const ACT_KIND = {
  approval:{icon:'check', color:'#16A34A', tint:'#F0FDF4'},
  status:  {icon:'columns', color:'#0073E6', tint:'#EBF4FF'},
  review:  {icon:'eye', color:'#B5851C', tint:'#FFFBEB'},
  comment: {icon:'comment', color:'#475569', tint:'#F1F5F9'},
  assign:  {icon:'user', color:'#0EA5E9', tint:'#F0F9FF'},
  attach:  {icon:'paperclip', color:'#0073E6', tint:'#EBF4FF'},
  request: {icon:'inbox', color:'#16A34A', tint:'#F0FDF4'},
};

const KPIS = [
  {label:'Open Tasks',       value:42, delta:+6,  dir:'up',   neutral:true,  accent:'#0073E6', spark:[28,30,29,33,31,36,38,40,42]},
  {label:'Overdue',          value:5,  delta:-2,  dir:'down', good:true,     accent:'#DC2626', spark:[9,8,8,7,7,6,6,5,5]},
  {label:'Completed (wk)',   value:38, delta:+12, dir:'up',   good:true,     accent:'#16A34A', spark:[18,22,21,26,28,30,33,35,38]},
  {label:'Active Projects',  value:14, delta:+1,  dir:'up',   neutral:true,  accent:'#475569', spark:[11,12,12,13,12,13,13,14,14]},
  {label:'Awaiting Approval',value:7,  delta:+3,  dir:'up',   bad:true,      accent:'#B5851C', spark:[3,4,3,5,4,6,5,6,7]},
];

const WORKLOAD = [
  {who:'diego', load:96}, {who:'lena', load:88}, {who:'noah', load:72},
  {who:'maya', load:64}, {who:'priya', load:55}, {who:'aria', load:43}, {who:'sam', load:38},
];

const WORKSPACES = [
  {id:'clearance', name:'Clearance', icon:'megaphone', color:'#16A34A', tint:'#F0FDF4', active:4,  today:2, desc:'Screen & clear public statements before release'},
  {id:'memos',     name:'Memos',     icon:'route',     color:'#475569', tint:'#F1F5F9', active:11, today:4, desc:'Review, concur & pass memos up the chain'},
  {id:'prep',      name:'Prep',      icon:'pen',       color:'#0073E6', tint:'#EBF4FF', active:7,  today:3, desc:'Draft memos & assessments from templates'},
  {id:'briefings', name:'Briefing Books', icon:'book', color:'#B5851C', tint:'#FFFBEB', active:6,  today:2, desc:'Build & collate briefing books'},
  {id:'knowledge', name:'Language Exploitation', icon:'bulb', color:'#16A34A', tint:'#F0FDF4', active:142, today:9, desc:'Extract intelligence from foreign-language material'},
  {id:'upload',    name:'Data Upload', icon:'database', color:'#1D3557', tint:'#EAF0F7', active:5,  today:1, desc:'Intake forms & bring datasets into the ecosystem'},
  {id:'teams',     name:'Teams',     icon:'users',     color:'#0EA5E9', tint:'#F0F9FF', active:8,  today:2, desc:'People, capacity, availability & leave'},
  {id:'requests',  name:'Requests',  icon:'inbox',     color:'#0073E6', tint:'#EBF4FF', active:12, today:4, desc:'Language, review, approval & clearance'},
  {id:'review',    name:'Triage',    icon:'eye',       color:'#16A34A', tint:'#F0FDF4', active:9,  today:3, desc:'First-pass coding, sign-offs & change history'},
];
// Content browse/search lives under Explore (top nav), not as a workspace
const CONTENT_WS = {id:'content', name:'Content', icon:'file', color:'#0073E6', tint:'#EBF4FF', active:38, today:6, desc:'Production tasks, files & content workflows'};

// calendar events for June 2026 (day -> events)
const CAL_EVENTS = {
  4:[{t:'Pricing copy due', tag:'web'}],
  5:[{t:'Style guide sign-off', tag:'brand'},{t:'Hero legal review', tag:'legal'}],
  6:[{t:'Q3 Hero Cut due', tag:'video'}],
  7:[{t:'Podcast cover art', tag:'brand'}],
  8:[{t:'Hero variant test', tag:'web'}],
  9:[{t:'Reel pack delivery', tag:'social'},{t:'Name clearance', tag:'legal'}],
  10:[{t:'Holiday storyboard', tag:'video'}],
  11:[{t:'Diego — PTO', tag:'leave'}],
  12:[{t:'FR/DE email', tag:'loc'},{t:'Diego — PTO', tag:'leave'}],
  14:[{t:'Trademark clearance', tag:'legal'}],
  16:[{t:'A11y audit', tag:'web'}],
  18:[{t:'Newsletter template', tag:'social'}],
  19:[{t:'Maya — PTO', tag:'leave'}],
  23:[{t:'Q3 Campaign launch', tag:'campaign'}],
};

// Content workspace — collections / folders
const FOLDERS = [
  {id:'f1', name:'Q3 Brand Campaign', updated:'Jun 5', files:42, size:'3.8 GB', types:'MP4, AE, PDF', color:'#0073E6', fav:true,  owner:'lena'},
  {id:'f2', name:'Acme Rebrand', updated:'Jun 4', files:28, size:'1.2 GB', types:'AI, PDF, PNG', color:'#B5851C', fav:true,  owner:'maya'},
  {id:'f3', name:'Spring Social Pack', updated:'Jun 3', files:64, size:'2.1 GB', types:'MP4, JPG', color:'#0EA5E9', fav:false, owner:'diego'},
  {id:'f4', name:'Investor Materials', updated:'Jun 2', files:16, size:'240 MB', types:'KEY, PDF', color:'#1D3557', fav:false, owner:'sam'},
  {id:'f5', name:'Press Kit', updated:'May 30', files:38, size:'4.6 GB', types:'JPG, RAW', color:'#16A34A', fav:true,  owner:'maya'},
  {id:'f6', name:'Web Refresh', updated:'Jun 4', files:22, size:'180 MB', types:'Figma, PNG', color:'#0073E6', fav:false, owner:'noah'},
  {id:'f7', name:'Holiday Teaser', updated:'Jun 6', files:12, size:'1.9 GB', types:'MP4, AE', color:'#475569', fav:false, owner:'diego'},
  {id:'f8', name:'Localization Hub', updated:'Jun 1', files:31, size:'96 MB', types:'DOCX, SRT', color:'#16A34A', fav:false, owner:'priya'},
];
// Devices — phones, laptops, drives & media ingested into the ecosystem
const DEVICE_TYPE = {
  phone:   {label:'Phone',   icon:'phone'},
  laptop:  {label:'Laptop',  icon:'laptop'},
  tablet:  {label:'Tablet',  icon:'tablet'},
  drive:   {label:'Drive',   icon:'harddrive'},
  desktop: {label:'Desktop', icon:'desktop'},
  camera:  {label:'Camera',  icon:'image'},
};
const DEVICE_STATUS = {
  extracted: {label:'Extracted',  color:'#16A34A', tint:'#F0FDF4'},
  processing:{label:'Processing',  color:'#0073E6', tint:'#EBF4FF'},
  review:    {label:'Needs Review',color:'#B5851C', tint:'#FFFBEB'},
  locked:    {label:'Locked',      color:'#DC2626', tint:'#FEF2F2'},
};
const DEVICES = [
  {id:'d1', name:'iPhone 15 Pro',      type:'phone',  ev:'EV‑2041', status:'extracted',  files:4820,  size:'182 GB', cap:'256 GB', used:71, os:'iOS 18.2',          custodian:'sam',   acquired:'Jun 2', last:'4m ago',  loc:'Field Office — Austin', encrypted:true,  serial:'F2LXK9PQ7M', color:'#0073E6', apps:48, model:'A3102 · Space Black'},
  {id:'d2', name:'MacBook Pro 16"',    type:'laptop', ev:'EV‑2038', status:'processing', files:38402, size:'441 GB', cap:'1 TB',   used:43, os:'macOS 15.3 Sequoia', custodian:'diego', acquired:'Jun 4', last:'12m ago', loc:'Studio NAS Intake',     encrypted:true,  serial:'C02XR4HJ1WF', color:'#475569', apps:122, model:'M3 Max · 36 GB'},
  {id:'d3', name:'Galaxy S24 Ultra',   type:'phone',  ev:'EV‑2044', status:'locked',     files:0,     size:'—',      cap:'512 GB', used:0,  os:'Android 14',         custodian:'priya', acquired:'Jun 5', last:'1h ago',  loc:'Evidence Locker B',     encrypted:true,  serial:'RZ8W21A3PKD', color:'#DC2626', apps:0,  model:'SM‑S928 · Titanium'},
  {id:'d4', name:'SanDisk Ultra USB',  type:'drive',  ev:'EV‑2031', status:'extracted',  files:1204,  size:'71 GB',  cap:'256 GB', used:28, os:'exFAT',              custodian:'maya',  acquired:'May 30',last:'2h ago',  loc:'Shared Drive Intake',   encrypted:false, serial:'SDX256‑88B2', color:'#16A34A', apps:0,  model:'256 GB · 3.2 Gen 1'},
  {id:'d5', name:'iPad Air (5th gen)', type:'tablet', ev:'EV‑2029', status:'extracted',  files:2611,  size:'96 GB',  cap:'128 GB', used:75, os:'iPadOS 17.6',        custodian:'noah',  acquired:'May 28',last:'5h ago',  loc:'Field Office — Denver', encrypted:true,  serial:'DMPVH2K4Q1', color:'#0073E6', apps:36, model:'A2589 · Wi‑Fi'},
  {id:'d6', name:'Dell Latitude 7440', type:'laptop', ev:'EV‑2025', status:'review',     files:51203, size:'612 GB', cap:'1 TB',   used:60, os:'Windows 11 Pro',     custodian:'aria',  acquired:'May 26',last:'1d ago',  loc:'Studio NAS Intake',     encrypted:false, serial:'7K2LMN0093', color:'#B5851C', apps:204, model:'i7‑1365U · 32 GB'},
  {id:'d7', name:'Seagate Backup HDD', type:'drive',  ev:'EV‑2018', status:'extracted',  files:18950, size:'1.8 TB', cap:'4 TB',   used:46, os:'NTFS',               custodian:'lena',  acquired:'May 22',last:'2d ago',  loc:'On‑prem Archive',       encrypted:true,  serial:'NA9F3KX7TT', color:'#1D3557', apps:0,  model:'4 TB · USB 3.0'},
  {id:'d8', name:'Pixel 8 Pro',        type:'phone',  ev:'EV‑2012', status:'extracted',  files:3344,  size:'108 GB', cap:'128 GB', used:84, os:'Android 14',         custodian:'tyler', acquired:'May 20',last:'3d ago',  loc:'Field Office — SF',     encrypted:true,  serial:'GP8P2024XQ', color:'#0EA5E9', apps:41, model:'GA04..  · Obsidian'},
];

// Topics — thematic lens over content, devices & people
const TOPICS = [
  {id:'t_q3',     name:'Q3 Brand Launch',    desc:'Campaign assets, hero cuts & launch communications',  color:'#0073E6', icon:'megaphone', items:86,  collections:['f1','f4'],      devices:['d2'],            people:['lena','diego','noah','sam'], updated:'Jun 5', trend:'up'},
  {id:'t_mar',    name:'Maritime Logistics', desc:'Port activity, shipping lanes & convoy intelligence', color:'#16A34A', icon:'globe',     items:412, collections:[],              devices:['d1','d3','d8'],  people:['tyler','sam'],               updated:'Jun 5', trend:'up'},
  {id:'t_field',  name:'Field Operations',   desc:'On‑site captures, seized devices & field reports',    color:'#B5851C', icon:'pin_loc',   items:218, collections:['f5'],          devices:['d1','d6','d8'],  people:['tyler','aria'],              updated:'Jun 4', trend:'up'},
  {id:'t_social', name:'Social Campaigns',   desc:'Reels, short‑form video & social posts',              color:'#0EA5E9', icon:'image',     items:64,  collections:['f3'],          devices:['d5'],            people:['diego','noah'],              updated:'Jun 3', trend:'flat'},
  {id:'t_legal',  name:'Legal & Clearance',  desc:'Trademark, licensing & approval sign‑off',            color:'#DC2626', icon:'shield',    items:24,  collections:[],              devices:[],                people:['sam','aria'],                updated:'Jun 3', trend:'up'},
  {id:'t_loc',    name:'Localization (EU)',  desc:'FR/DE adaptation & regional quality assurance',       color:'#16A34A', icon:'route',     items:31,  collections:['f8'],          devices:[],                people:['priya','noah'],              updated:'Jun 1', trend:'flat'},
  {id:'t_img',    name:'Product Imagery',    desc:'Press kit, photography & raw capture sets',           color:'#475569', icon:'image',     items:102, collections:['f5','f2'],      devices:['d4'],            people:['maya','diego'],              updated:'May 30',trend:'flat'},
  {id:'t_inv',    name:'Investor Relations', desc:'Decks, financial narrative & board materials',        color:'#1D3557', icon:'chart',     items:16,  collections:['f4'],          devices:[],                people:['sam','lena'],                updated:'Jun 2', trend:'up'},
];

// derived per-person stats from tasks / folders / workload
function personStats(id){
  const tasks = TASKS.filter(t=>t.assignees.includes(id));
  const active = tasks.filter(t=>t.col!=='complete').length;
  const owned = FOLDERS.filter(f=>f.owner===id);
  const files = owned.reduce((s,f)=>s+f.files,0);
  const devices = DEVICES.filter(d=>d.custodian===id);
  const wl = WORKLOAD.find(w=>w.who===id);
  return {tasks, active, total:tasks.length, owned, files, collections:owned.length,
    devices, load: wl?wl.load:null};
}

Object.assign(window, {
  PEOPLE, PL, PERSON_STATUS, REL_STATUS, daysUntil, TAGS, STATUS, PRIORITY, COLUMNS, TASKS, REQUESTS, REQ_STATUS, REQ_TYPE,
  ACTIVITY, ACT_KIND, KPIS, WORKLOAD, WORKSPACES, CONTENT_WS, CAL_EVENTS, FOLDERS,
  DEVICES, DEVICE_TYPE, DEVICE_STATUS, personStats, TOPICS
});
