# AS-IS audit

> **Historical snapshot (before MVP 0.2).** Several rows below are now outdated (tests exist, React opens in 3D,
> One Meaningful Step, Arabic/RTL and export are implemented). For the current state see the
> [README](../../README.md) and [RELEASE_AUDIT.md](RELEASE_AUDIT.md).

Date: 2026-10-22. Basis: repository inspection and previously recorded browser checks. No new browser session or tests were run for this documentation pass. WORKING indicates implementation with prior basic verification, not exhaustive correctness.

## Stack and boundaries

Vite 5, React 18 and Three.js are installed. `vite.config.js` builds two entries. `index.html` loads imperative `app.js`, `data.js`, `style.css` and shared `garden3d.js`. `react.html` loads `src/main.jsx`, `src/App.jsx`, React components, reducer/rules and a separate catalogue. `src/components/Garden3D.jsx` adapts the shared scene; React initially selects 2D mode. Existing ownership is documented in `CONTRACT.md` and `COORDINATION-3D.md`.

| Area | Status | Observation / limitation |
|---|---|---|
| Interactive 3D and orbit camera | WORKING | Shared Three.js renderer; ground/plant raycast, zoom/reset. Mobile gestures and back-cache fixes lack full device verification. |
| Five-slot bank and task planting | WORKING | Cancelling consumes nothing; nonempty title required. Standalone seed is a species ID; React seed is a tier. |
| Task lifecycle | WORKING | Completion permitted before final timed stage. Completion reveals plant, updates count, returns seed once. React also supports uprooting/restart. |
| Five growth stages | PARTIALLY WORKING | Standalone advances every 300,000 ms, stage 5 at 20 min; React every 30,000 ms, stage 5 at 2 min. It is elapsed time, not verified focus or learning. |
| Reward consistency | PARTIALLY WORKING | Basic and rare tier distributions align; extinct distributions differ. React orders rare outcomes differently, relevant to deterministic tests. |
| Collection | WORKING | 15 species per entry; names/IDs/catalogues differ. Standalone grayscale emoji; React custom SVG artwork. No objective mastery implied. |
| Local persistence | PARTIALLY WORKING | Independent keys and schemas; limited validation and no safe recovery/export workflow. React silently ignores failed writes. |
| Automated tests | MISSING | No project tests or test script found outside dependencies/build output. Build success is not state-transition coverage. |
| Language/accessibility | PARTIALLY WORKING | English UI; some keyboard controls/dialogs; Arabic input possible. No full Arabic localization/RTL or complete accessibility audit. |
| One meaningful step | MISSING | All standalone task chips displayed; no selected-task state or start action. |
| Mood/reflection/recovery/weekly review | MISSING | No implemented psychological tools. Deferred, not hidden capabilities. |
| Privacy controls | MISSING | No in-app export/delete/import for personal data. Local storage is not encrypted or a backup. |
| Clinical efficacy / starting-friction benefit | UNVERIFIED | No study or personal baseline/experiment. |

No current graphic is represented here as evidence of psychological or learning progress. There is no verified clinical functionality.

## Behavior differences that must not be silently normalized

| Property | Standalone / `index.html` | React / `react.html` |
|---|---|---|
| Storage key | `productivity-garden-v1` | `productivity-garden:v2` |
| Stored shape | seeds, garden, counts | bank, plants, matured, nextId |
| Task ID | UUID string | Incrementing integer |
| Seed identity | Species selected when seed issued | Species selected at completion |
| Basic reward | 50% basic / 50% rare | Same tier probabilities |
| Rare reward | 25% basic / 50% rare / 25% extinct | Same probabilities; different outcome ordering |
| Extinct reward | 25% basic / 50% rare / 25% extinct | 0% basic / 50% rare / 50% extinct |
| Stage duration | 5 minutes | 30 seconds |

All tier differences above are observations, not newly approved economy decisions. Existing stored plants, counts, species identities, timestamps and positions must remain unchanged. Data from one version must never be treated as a duplicate of the other without an explicit later decision.
