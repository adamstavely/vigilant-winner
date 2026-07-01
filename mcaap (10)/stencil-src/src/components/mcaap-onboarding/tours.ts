/* tours.ts — content model for the MCAAP onboarding tours.
   Edit this file to add / reorder tours and steps. Each step targets a real
   [data-tour] element on the page named by `page`. Steps with no `target`
   render as a centered card (used only for the intro). */

export interface Step {
  title: string;
  body: string;
  illus: string;                 // key into ILLUS (illustrations.ts)
  target?: string;               // CSS selector to spotlight; omit for a centered card
  page?: string;                 // navigate the host app here before painting the step
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Tour {
  id: string;
  title: string;
  tagline: string;
  icon: string;                  // key into the component's ICONS map
  color: string;
  minutes: number;
  primary?: boolean;             // rendered full-width at the top of the menu
  steps: Step[];
}

const NAVY = '#1D3557', BLUE = '#0073E6', GOLD = '#B5851C', GREEN = '#16A34A';

export const TOURS: Tour[] = [
    {
      id: 'getting-started', title: 'Getting Started', tagline: 'The whole platform in six stops',
      icon: 'map', color: NAVY, minutes: 2, primary: true,
      steps: [
        { illus: 'welcome', title: 'Welcome to MCAAP', body: 'Your agency operations command center — tasks, clearance, memos, briefings and an AI agent fleet, all in one place. This quick tour shows where everything lives. Use the arrow keys or the buttons below to move; press Esc to leave anytime.', page: 'dashboard' },
        { illus: 'explore', target: '[data-tour="nav-explore"]', placement: 'bottom', title: 'Explore', page: 'dashboard', body: 'Browse and search every collection, device, topic and person that has been ingested into the ecosystem. This is your window into the underlying data.' },
        { illus: 'tasks', target: '[data-tour="nav-tasks"]', placement: 'bottom', title: 'Tasks', page: 'dashboard', body: 'The production board — every piece of work moving from Backlog to Done, plus the queue for your AI agent fleet.' },
        { illus: 'briefings', target: '[data-tour="nav-workspaces"]', placement: 'bottom', title: 'Workspaces', page: 'dashboard', body: 'Your specialized workflows live here: Clearance, Memos, Prep, Briefing Books, Language Exploitation, Triage and more. Open the menu to jump into any one.' },
        { illus: 'agents', target: '[data-tour="agents"]', placement: 'bottom', title: 'Your agent fleet', page: 'dashboard', body: 'Watch AI agents work in real time. The badge tells you how many runs are live and how many are paused waiting for your sign-off.' },
        { illus: 'help', target: '[data-tour="help"]', placement: 'bottom', title: 'Help is always here', page: 'dashboard', body: 'Reopen this tutorial anytime from the “?” button and pick any workflow tour. Ready to dive into a specific workflow? Choose one from the menu next.' }
      ]
    },
    {
      id: 'tasks-agents', title: 'Tasks & AI Agents', tagline: 'Run the board and delegate to your fleet',
      icon: 'check_square', color: BLUE, minutes: 3,
      steps: [
        { illus: 'tasks', target: '[data-tour="tasks-title"]', placement: 'bottom', page: 'tasks-board', title: 'This is Tasks', body: 'Every piece of production work, from press clearance to deposition prep, tracked in one place and moving from intake to done.' },
        { illus: 'tasks', target: '[data-tour="tasks-views"]', placement: 'bottom', title: 'Three views', body: 'See the work as a Board, a flat List, or a Calendar — switch here depending on how you want to plan.' },
        { illus: 'memos', target: '[data-tour="tasks-workflows"]', placement: 'bottom', title: 'Filter by pipeline', body: 'Each workflow — press clearance, relevance coding, brief review, privilege sign-off and more — has its own pipeline. Pick one to focus the board.' },
        { illus: 'tasks', target: '[data-tour="tasks-board"]', placement: 'top', title: 'Move work across columns', body: 'Drag a card from one column to the next to advance it. Whatever column it sits in is its status — no separate step needed.' },
        { illus: 'agents', target: '[data-tour="tasks-assignee"]', placement: 'bottom', title: 'People or agents', body: 'Split the board between People and AI Agents. Any card can be handed to an agent to run — look for “Run with…” on a card.' },
        { illus: 'agents', target: '[data-tour="agents"]', placement: 'bottom', title: 'Watch & approve your fleet', body: 'Your agent fleet lives up here. This shows how many runs are working now and how many are paused waiting for your sign-off — click to open any run.' }
      ]
    },
    {
      id: 'clearance', title: 'Clearance', tagline: 'Screen statements before they go public',
      icon: 'megaphone', color: GREEN, minutes: 3,
      steps: [
        { illus: 'clearance', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'clearance', title: 'This is Clearance', body: 'Clearance screens public statements — press releases, media statements, talking points — against privileged material and conduct rules before release.' },
        { illus: 'agents', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Screen or add a statement', body: 'Run VESTA to AI-screen a draft against the case’s confidential materials, or add a new statement to begin.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Your queue', body: 'Switch between Assigned to me, My team and All to control which statements you see.' },
        { illus: 'clearance', target: '[data-tour="ws-table"]', placement: 'top', title: 'Work a statement', body: 'Open any row to review the AI findings inline, apply suggested revisions, then route the statement to counsel for final clearance — with a full audit trail.' }
      ]
    },
    {
      id: 'memos', title: 'Memos', tagline: 'Concur and pass memos up the chain',
      icon: 'route', color: NAVY, minutes: 2,
      steps: [
        { illus: 'memos', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'memos', title: 'This is Memos', body: 'Memos move decision documents upward — each one is reviewed, concurred on, and passed to the next person in the chain.' },
        { illus: 'prep', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a memo', body: 'Create a new memo when you need to put a decision or recommendation in writing.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'What’s awaiting you', body: 'Your queue surfaces memos waiting on your concurrence, separate from what your team is handling.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Read, concur, track', body: 'Open a memo to read it, add your concurrence, or send it back with comments — and see exactly where it sits in the routing chain.' }
      ]
    },
    {
      id: 'prep', title: 'Prep', tagline: 'Draft memos & assessments from templates',
      icon: 'pen', color: GOLD, minutes: 2,
      steps: [
        { illus: 'prep', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'prep', title: 'This is Prep', body: 'Prep is your drafting workspace — start memos and assessments from proven templates instead of a blank page.' },
        { illus: 'prep', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a draft', body: 'Spin up a new draft from a template; the structure and boilerplate come pre-filled so you focus on substance.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Yours vs the team’s', body: 'Filter to the drafts you’re collaborating on, or see everything your team has in flight.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Write, then hand off', body: 'Open a draft to write with AI assist, then send it into Memos or Clearance to begin its review journey.' }
      ]
    },
    {
      id: 'briefings', title: 'Briefing Books', tagline: 'Build and collate briefing books',
      icon: 'book', color: GOLD, minutes: 2,
      steps: [
        { illus: 'briefings', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'briefings', title: 'This is Briefing Books', body: 'Assemble polished, multi-section books that pull together everything a principal needs for a meeting or event.' },
        { illus: 'briefings', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Start a new book', body: 'Create a book, then collate sections into it.' },
        { illus: 'explore', target: '[data-tour="brief-stats"]', placement: 'bottom', title: 'Track the pipeline', body: 'See your build queue, what’s been distributed, what’s awaiting feedback, and your average receiver rating.' },
        { illus: 'tasks', target: '[data-tour="brief-views"]', placement: 'bottom', title: 'Queue vs history', body: 'Flip between books you’re still building and the history of distributed books with reader feedback.' },
        { illus: 'briefings', target: '[data-tour="brief-grid"]', placement: 'top', title: 'Open a book', body: 'Open any book to add and reorder sections — memos, assessments, maps — then publish and share it.' }
      ]
    },
    {
      id: 'language', title: 'Language Exploitation', tagline: 'Turn what your team knows into shared knowledge',
      icon: 'bulb', color: GREEN, minutes: 3,
      steps: [
        { illus: 'language', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'knowledge', title: 'This is Language Exploitation', body: 'This workspace turns what your team knows — including knowledge that only lives in people’s heads — into shared, searchable, endorsed articles.' },
        { illus: 'help', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Capture knowledge', body: 'Start a capture from a source or a quick note whenever you learn something worth keeping.' },
        { illus: 'briefings', target: '[data-tour="lang-articles"]', placement: 'top', title: 'Knowledge articles', body: 'Documented know-how, endorsed by the team, so the next person doesn’t have to relearn it.' },
        { illus: 'upload', target: '[data-tour="lang-sources"]', placement: 'left', title: 'Connect the sources', body: 'Link the tools where notes already live so nothing gets stranded outside the ecosystem.' },
        { illus: 'search', target: '[data-tour="lang-capture"]', placement: 'left', title: 'Capture what’s stuck', body: 'The system surfaces knowledge trapped in one person’s notes — import it in a click.' }
      ]
    },
    {
      id: 'upload', title: 'Data Upload', tagline: 'Bring datasets into the ecosystem',
      icon: 'database', color: NAVY, minutes: 2,
      steps: [
        { illus: 'upload', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'upload', title: 'This is Data Upload', body: 'The front door for new material — datasets, device extractions and files entering the ecosystem.' },
        { illus: 'prep', target: '[data-tour="upload-details"]', placement: 'right', title: 'Describe the dataset', body: 'Name it and set the source, category and classification. Good intake metadata makes everything downstream findable and trusted.' },
        { illus: 'upload', target: '[data-tour="upload-files"]', placement: 'top', title: 'Add the files', body: 'Drag files onto the dropzone — TIFF, CSV, GeoJSON, PDF, ZIP — and watch each one upload.' },
        { illus: 'explore', target: '[data-tour="upload-checklist"]', placement: 'left', title: 'Submit to ingest', body: 'The intake checklist tracks what’s still required. When it’s complete, submit — the dataset is validated, indexed and appears in Explore.' }
      ]
    },
    {
      id: 'triage', title: 'Triage', tagline: 'First-pass coding & sign-offs',
      icon: 'eye', color: GREEN, minutes: 2,
      steps: [
        { illus: 'triage', target: '[data-tour="ws-header"]', placement: 'bottom', page: 'review', title: 'This is Triage', body: 'Triage gives new items their first pass — coded for relevance, signed off, and tracked with a full change history.' },
        { illus: 'clearance', target: '[data-tour="ws-action"]', placement: 'bottom', title: 'Jump in', body: 'Start review opens the first item in your queue so you can begin coding immediately.' },
        { illus: 'triage', target: '[data-tour="ws-scope"]', placement: 'bottom', title: 'Focus your queue', body: 'Work what’s assigned to you, or take on the whole team’s backlog.' },
        { illus: 'memos', target: '[data-tour="ws-table"]', placement: 'top', title: 'Code & sign off', body: 'Open an item to tag it, mark it relevant or not, and sign off. Every decision is recorded with who, what and when.' }
      ]
    },
    {
      id: 'explore', title: 'Explore & Search', tagline: 'Find anything in the ecosystem',
      icon: 'search', color: BLUE, minutes: 2,
      steps: [
        { illus: 'search', target: '[data-tour="explore-search"]', placement: 'bottom', page: 'explore', title: 'Search across everything', body: 'One search bar spans every source. Toggle AI Mode to ask in plain language instead of keywords.' },
        { illus: 'explore', target: '[data-tour="explore-browse"]', placement: 'bottom', title: 'Or browse', body: 'Don’t know the query yet? Browse by Collections, Topics, Devices and People — the graph is fully linked.' },
        { illus: 'agents', target: '[data-tour="explore-tabs"]', placement: 'bottom', title: 'Map & subscriptions', body: 'Switch to Map to draw a polygon and pull every geotagged item inside it, or Subscriptions for saved searches that auto-run and flag new results.' }
      ]
    }
  ];

export interface Role {
  id: string;
  label: string;
  icon: string;
  color: string;
  blurb: string;
  tours: string[];   // recommended tour ids, in order (Getting Started auto-pinned)
}

export const ROLES: Role[] = [
  { id: 'ops',       label: 'Operations Lead',    icon: 'map',       color: NAVY,  blurb: 'Run the board, delegate to agents, keep work moving.',        tours: ['tasks-agents', 'explore', 'clearance', 'briefings'] },
  { id: 'cmo',       label: 'Collection Manager', icon: 'database',  color: NAVY,  blurb: 'Bring data in and make it findable across the ecosystem.',    tours: ['upload', 'explore', 'tasks-agents'] },
  { id: 'exploiter', label: 'Language Exploiter', icon: 'bulb',      color: GREEN, blurb: 'Turn source material & tribal knowledge into shared intel.',  tours: ['language', 'upload', 'explore'] },
  { id: 'clearance', label: 'Clearance Officer',  icon: 'megaphone', color: GREEN, blurb: 'Screen statements and route decisions for sign-off.',        tours: ['clearance', 'memos', 'explore'] },
  { id: 'briefer',   label: 'Reports & Briefings',icon: 'book',      color: GOLD,  blurb: 'Draft, concur, and assemble briefing books.',                tours: ['prep', 'memos', 'briefings', 'explore'] },
  { id: 'reviewer',  label: 'Triage Reviewer',    icon: 'eye',       color: GREEN, blurb: 'First-pass coding, relevance calls and sign-offs.',           tours: ['triage', 'explore', 'tasks-agents'] },
];

