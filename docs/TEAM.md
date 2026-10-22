# Team: Claude + Codex

Single source of truth for who works on what. Replaces `CONTRACT.md` and `COORDINATION-3D.md` (kept as pointers).
Day-to-day messages go in [AGENT_CHAT.md](AGENT_CHAT.md), append-only and signed.

Current runtime: one React + Three.js application at `/`; `react.html` and `/classic` are compatibility redirects. The standalone UI (`app.js`, `style.css`, `data.js`) is retired. Its data remains accessible through explicit import in Your data. Legacy profiles are retained for validation/regression only. This supersedes references to a live classic app below.

## How we split work

| Area | Lead | Reviewer |
|---|---|---|
| Shared engine `shared/**`, persistence, tests for them | Codex | Claude |
| React UI `src/components/**`, `src/meaningfulStep/**`, `src/i18n/**`, `src/App.jsx` | Codex | Claude |
| Art and catalogue `src/art/**`, `src/data/catalogue.js` | Claude | Codex |
| 3D scene `garden3d.js`, classic app `app.js`, `index.html`, `style.css`, `data.js` | Codex | Claude |
| Research / product docs `docs/research/**`, `docs/product/**` | shared | the other agent |
| Trial kit `docs/trial/**`, help copy | Claude | Codex |
| Release: build, browser verification, GitHub push, Vercel deploy | Claude | Codex |

Rules:
1. One writer per file at a time. If the other agent touched a file in the last few minutes, wait or post in the chat.
2. Small fixes in the other lead's files are fine when they are idle; say so in the chat with file list and test result.
3. Game math lives only in `shared/game/` (guarded by `tests/no-duplicate-rules.test.js`).
4. Scope changes (economy, new systems, deleting data) go to Taha, not decided between agents.
5. Done = `npm test` green + `npm run build` + a browser check, reported honestly (what was *not* checked too).

## History (short)

- Claude: React app, SVG art (via an art session), first research/spec drafts, reviews, help copy, trial kit,
  release (GitHub + Vercel), seed glow, opt-in reveal.
- Codex: 3D scene and classic app, shared engine (Milestone A), One Meaningful Step (Milestone B), protected saves,
  i18n/RTL, archive/rename/progress/preferences; used Claude Code CLI for two source reviews.

## 3D scene contract

`garden3d.js` exports `createGarden3D(container, { onGroundClick, onPlantClick, onError })` returning
`{ setPlants, resetView, dispose }`. Plant props: `{ id, x, y, done, stage, tier, variant }`; `x`/`y` are 0..100
ground coordinates, `stage` 1..5, `variant` 0..4 within the tier. React uses it through `src/components/Garden3D.jsx`.

## Fixed plant ids

basic `b1`..`b5` · rare `r1`..`r5` · extinct `e1`..`e5` (React). The classic app keeps its own species ids.
