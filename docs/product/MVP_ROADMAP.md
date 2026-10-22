# MVP 0.2 implementation plan and delivery status

The plan below was authorized incrementally and milestones A/B are implemented. See RELEASE_AUDIT.md for final engineering acceptance evidence. Milestone C is the user's voluntary personal trial and has not run; it is not automated or inferred from test results. Preliminary evidence and unproven feature efficacy remain explicit.

## Milestone A: shared mechanics and data protection

Existing: two rule implementations, separate stores, differing growth/reward behavior. Desired: shared pure algorithms and adapters, preserving each entry's behavior with explicit compatibility profiles. No priority UI yet.

| Proposed file | Change |
|---|---|
| `shared/game/profiles.js` (new) | Versioned standalone-v1 and react-v2 timing, outcome ordering, reward tables and identity policies |
| `shared/game/rules.js` (new) | One implementation of weighted rewards, stage calculation and species selection; injectable clock/RNG |
| `shared/game/transitions.js` (new) | Canonical plant/complete operations; adapters translate schemas, no DOM/React |
| `shared/persistence/gardenStores.js` (new) | Namespace registry, validation, raw backups, verified writes, export, conflict detection |
| `app.js` | Replace inline game math/transitions with shared imports; preserve existing storage/scene wiring |
| `src/game/rules.js`, `src/game/reducer.js`, `src/game/useGarden.js` | Thin compatibility adapters using same engine; preserve React store and UI |
| `tests/game-compatibility.test.js`, `tests/persistence.test.js` (new) | Golden fixtures and storage-failure coverage using Node test runner |
| `package.json` | Add test script; no new test framework required |

Acceptance: both entries build and play; current probabilities, RNG outcome order, stage boundaries, IDs, counts, timestamps and planting semantics preserved; no legacy key merge/rename/delete; invalid stores never overwritten; both raw snapshots recoverable; shared functions used by both entries. No new gameplay fix that changes semantics can be slipped into this refactor. Golden fixtures must come from current behavior before extraction, including different species-assignment timing. Discuss any current behavior that cannot be preserved safely before changing it.

Tests: basic/rare/extinct boundaries per profile; old/new outputs over deterministic RNG sequences; time boundaries, negative elapsed and capped stages; cancellation, empty title, empty slot, completion twice, full bank and React uproot/restart; IDs and counts preserved. Snapshot raw legacy strings before/after load: no write on load; when mutation occurs only the targeted store changes. Backup failure, quota error, invalid JSON, unknown species, tab conflict and export/recovery fixtures. The non-targeted store remains byte-for-byte unchanged. Do not load real browser data into committed fixtures.

Risks: adapters may alter species identity or consume RNG differently; storage refactor may overwrite corrupt data; multiple tabs may race. Mitigation: representative legacy fixtures, deterministic transition parity, read-back backups and stale-write rejection. Roll back UI/version by retaining untouched raw originals and exporting the current state first; never auto-restore an old snapshot over newer progress.

## Milestone B: one shared selection model, one trial interface

Existing: React shows every plant in the garden and has no current-step state; 2D is the default view. Desired: one chosen task, optional smallest step, one Start action; other tasks in a drawer; 3D (`garden3d.js`) as the default garden view; garden and rewards unchanged.

Decision (Taha, 2026-10-22): the visible feature lives in **React only** (`react.html`). The standalone entry (`index.html`) gets the shared mechanics from Milestone A and nothing else; it gets no priority UI.

| Proposed file | Change |
|---|---|
| `shared/meaningfulStep/model.js` (new) | Pure choose/edit/start/clear/reference validation; at most one active task |
| `shared/persistence/meaningfulStepStore.js` (new) | Separate versioned feature/optional experiment data, export and scoped deletion |
| `src/meaningfulStep/useMeaningfulStep.js` (new) | React hook binding the shared model/store to the React garden state; no domain logic |
| `src/components/MeaningfulStepPanel.jsx` (new) | Selected task, optional step, Start, Change, Later |
| `src/components/TaskDrawer.jsx` (new) | Collapsed list of unfinished tasks for choosing/changing |
| `src/components/HelpPage.jsx`, `src/components/DataControls.jsx` (new) | Static help route; export and scoped deletion |
| `src/i18n/messages.js` (new) | Arabic/English UI dictionary; no domain logic |
| `src/App.jsx`, `src/components/Garden.jsx`, `src/styles.css` | Mount panel and drawer; 3D default with 2D toggle; RTL/`dir` handling |
| `src/components/Garden3D.jsx` | Optional highlight of the selected plant, only if `garden3d.js` already supports it; otherwise no change |
| `tests/meaningfulStep.test.js` (new) | Pure state and reference tests |
| `tests/no-duplicate-rules.test.js` (new) | Import guard: no game math/tables inside `app.js` or `src/components/**`; not a substitute for parity tests |

Not touched in this milestone: `index.html`, `style.css` (standalone UI), `garden3d.js`. Reuse `garden3d.js` unchanged unless a verified regression demands a separate scoped fix, coordinated with its owner. Before coding, update `CONTRACT.md` with file ownership so the two agents do not edit the same files.

Acceptance criteria:

1. At most one main task, optional step; returning user can activate Start in one action.
2. Change/cancel/clear/defer never consumes a seed, completes a task, changes reward odds or removes a plant.
3. No auto-selection after completion/date rollover; missing reference fails safely.
4. Other tasks reachable through one secondary drawer action; plants remain visible and clickable.
5. Start records intent only; duplicate activation grants no reward and creates no mandatory timer.
6. Reload preserves choice and garden, independently for each namespace; no ID collisions.
7. Arabic/English, RTL, keyboard, mobile and storage-error states work; no new required questionnaire.
8. New feature data export/delete works without affecting either garden or backup. Experiment opt-in is independent of feature access.
9. No mood/reflection/chatbot/streak/notification features and no behavior normalization.

Tests: choose → edit optional step → start → clear; replacing choice and cancelling; namespace/type-distinct IDs; deletion/completion elsewhere; reload, storage conflicts/failures; blank/long input; duplicate Start; no change to reward state on any priority operation. Manual browser checks: ground planting, cancel, completion/reward once, collection, camera rotate/zoom/reset, tab hide/show, keyboard planting, both app entries and two tabs. Back-cache and pinch checks need a supported browser/device; report any remaining gap.

## Milestone C: one-week trial, not another build phase

Use the plan in VALIDATION_PLAN. Prefer manual voluntary feedback over instrumenting a dashboard. No new features during the seven-day period unless a data/safety defect prevents use. At the end: keep, simplify, remove or repeat only for a specific unresolved question. Do not treat completed tasks or an attractive screenshot as proof of success.

## Time limit and stop rule

Proposed cap: two focused engineering sessions, approximately four hours total, plus a short verification/release review. This is a planning limit, not a promise. If compatibility or data safety exceeds it, stop before touching data and report the blocker; do not spend the Flutter learning week building this tool. Do not ship unsafe shortcuts to meet the cap. Limit optional experiment logging to about 20 seconds per used day and weekly review to 10 minutes.

## Decisions requested before code

- Preserve both behavior profiles; defer unifying timing/extinct rewards.
- Deliver visible MVP in React only; keep standalone as compatibility target (decided by Taha, 2026-10-22).
- Keep choice across midnight until user changes it; no forced daily task.
- Use verified raw snapshot backups, targeted writes and user-controlled export; no automatic import/merge.
- Keep experiment feedback manual initially, with optional local storage only if needed.

## Delivery evidence

At each milestone report changed files, actual tests/run results, remaining risks and manual steps. Build both entries; explicitly confirm original garden behavior through browser checks. Approval of these documents does not itself mean the experiment succeeded.
