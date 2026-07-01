# MCAAP Onboarding — Stencil source

Clean, buildable [Stencil](https://stenciljs.com/) source for the `<mcaap-onboarding>`
guided-tour web component. This is the "lift-out" version of the live tour running
in the prototype (`/onboarding.js` + `/onboarding-tours.js`) — same states, same
behaviour, authored as a proper Stencil component you can compile and drop into any
app (React, Angular, Vue, or plain HTML).

## What it does

A workflow-aware onboarding tutorial:

- **Welcome modal** on first visit (persisted, dismissible, "don't show again").
- **Tour menu** — a launcher with two modes: **By role** (curated learning paths — Operations Lead, Collection Manager, Language Exploiter, Clearance Officer, Reports & Briefings, Triage Reviewer) and **All tutorials** (pick any). Roles are defined in `tours.ts` (`ROLES`); Getting Started is auto-pinned to the top of every role path.
- **Spotlight coach-marks** — dims the app, cuts a hole around a real element, and
  points a tooltip at it. Steps with no target fall back to a centered card.
- **Deep-linking** — a step can navigate the host app to the right page before it paints.
- **Progress** bar + step counter, **keyboard nav** (← → Enter / Esc), **completion screen**.
- **Persistence** in `localStorage` (completed / skipped / never-show).

## Files

```
src/components/mcaap-onboarding/
  mcaap-onboarding.tsx     component (state machine + render + spotlight layout)
  mcaap-onboarding.css     styles (scoped via shadow DOM)
  tours.ts                 tour + step data model (edit this to change content)
  illustrations.ts         inline animated-SVG illustrations, keyed by name
```

## Install & build

```bash
npm install
npm start          # dev server with live reload
npm run build      # emits dist/ + loader/ (custom elements bundle)
```

`package.json` and `stencil.config.ts` here are minimal starters — merge them into
your project if you already have a Stencil setup.

## Use it

Load the component (from the built `loader`, or your framework bindings) and drop the
tag once, near the end of `<body>`:

```html
<mcaap-onboarding></mcaap-onboarding>
```

### Trigger it

The component listens on `window` so any part of your app can drive it:

```js
// open the tour menu (e.g. from a Help "?" button)
window.dispatchEvent(new CustomEvent('mcaap-tour:open'));

// jump straight into a specific tour
window.dispatchEvent(new CustomEvent('mcaap-tour:start', { detail: { id: 'clearance' } }));
```

It also auto-shows the welcome modal ~0.9s after first load, unless the user has
completed it or ticked "don't show again".

### Wire up deep-linking + anchors

Two integration points connect the tour to your app:

1. **Navigation** — `tours.ts` steps carry a `page` hint. Edit the `navigate()`
   function in `mcaap-onboarding.tsx` to call your router / page setter. In the
   prototype these map to `window.__setPage(...)`, `window.__openTasks(...)` and
   `window.__goAgents()`.

2. **Anchors** — spotlight steps target elements by CSS selector. Add
   `data-tour="..."` attributes to the elements you want to highlight (the prototype
   tags the header nav, the agent-fleet button, the help button, and the shared
   workspace header + scope tabs). If a target isn't found the step degrades
   gracefully to a centered card, so tours never break.

## Editing content

All copy, ordering, illustrations and targets live in `tours.ts`. Add a tour by
pushing a `Tour` onto `TOURS`; add a step with `{ title, body, illus, target?, page?,
placement? }`. Illustrations are keyed strings in `illustrations.ts` — add your own or
swap in real `<img>`/GIF markup.
