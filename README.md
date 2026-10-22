# Personal Growth Garden

A calmer, browser-local productivity garden: plant a task, let it grow in a 3D garden, complete it to discover one of
15 imaginary plants. Built jointly by Claude and Codex (see [docs/TEAM.md](docs/TEAM.md)).

**Live:** https://productivity-garden-nine.vercel.app (React app) · `/classic` (original standalone 3D app)

## What it does (MVP 0.2)

- **One meaningful step.** Choose one growing task, optionally add a smallest first step, press *Start* and leave the
  app to do it. Start records intent only: no timer, no reward. *Later* clears the choice; nothing is lost.
- **Garden.** Five-slot seed bank, click the 3D island (or the 2D view) to plant, five time-based growth stages,
  complete any time. Growth shows elapsed time, not work done.
- **Collection.** 15 plants in basic / rare / extinct tiers; silhouettes until discovered; Arabic and English lore.
- **Rewards (unchanged).** Basic → 50% basic / 50% rare. Rare → 25% basic / 50% rare / 25% extinct.
  Extinct → 50% rare / 50% extinct in the React app (the classic app uses the rare table; kept as-is on purpose).
- **Gentle extras** (ideas from angelabauer/productivity-garden, reimplemented): archive/restore grown plants,
  rename tasks, next-stage indicator, saved language and 2D/3D view, a 3-second glow on the newly rewarded seed,
  and an **opt-in** plant reveal animation (off by default; Your data → toggle).
- **Arabic / English** with RTL; Arabic is the default.
- **No** streaks, notifications, mood tracking, leaderboards or AI calls. Not a therapy tool — see Help in the app.

## Run, test, build

```bash
npm install
npm run dev -- --port 5173   # React: /react.html · classic: /index.html
npm test                     # Node test runner: shared engine, persistence, selection, i18n, reveal
npm run build                # builds both entries into dist/
```

Deployment: Vercel project `productivity-garden`, linked to this repo; every push to `main` deploys.
`vercel.json` makes the React app the site root and serves the classic app at `/classic`.

## Code map

| Path | What |
|---|---|
| `shared/game/` | The one game engine (stages, rewards, transitions) with a compatibility profile per app |
| `shared/meaningfulStep/`, `shared/persistence/` | Selection model; protected local saves (backup before first write, Web Locks, export) |
| `src/` | React app: components, hooks, i18n, SVG art (`src/art`), catalogue |
| `garden3d.js` | Shared Three.js scene used by both apps |
| `app.js`, `index.html`, `style.css`, `data.js` | Classic standalone app (uses `shared/game/`) |
| `tests/` | `npm test` suites (+ `tests/browser/text-zoom.html` manual harness) |
| `docs/` | Research, product spec, audits, trial template, agent chat |

## Data

Everything stays in this browser's localStorage, per site address (localhost and the Vercel URL are separate
gardens). The two apps keep separate saves and never merge. *Your data → Export* downloads a private JSON copy.

## Status

Engineering for MVP 0.2 is done and verified (see `docs/product/RELEASE_AUDIT.md`). Next step is not more features:
it is a real week of use following `docs/product/VALIDATION_PLAN.md` with `docs/trial/TRIAL_LOG_TEMPLATE.md`.
Not yet verified: pinch-zoom on a physical phone, real browser back/forward-cache restore.

Three.js (MIT) is the 3D foundation; all models and art are made for this project.
