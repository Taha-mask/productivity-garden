# Milestone B — One Meaningful Step

Date: 2026-10-22. Scope: React-only trial interface backed by a shared pure selection model and isolated local persistence. No mood tracking, Reality Check, chatbot, notification, timer, reward change or new game economy. Feature efficacy remains unproven.

## Delivered behavior

React opens in the existing shared 3D garden with an optional panel for one current task. Existing growing tasks are selected from a secondary native-dialog task drawer. A task created through that drawer can be selected without choosing its seed or location again. A smallest step is optional, editable and limited to 240 characters. Start records intention only, remains idempotent, and has no effect on plant completion, counts or rewards. The user leaves the app to work.

Change, cancel and Later preserve every plant and seed. Completion uses the existing game engine, shows a neutral completed state and never chooses the next task automatically. A choice survives midnight and reload. Not now hides the panel for the current visit, with a visible way to reopen it. All plants remain individually interactive. The 2D view remains available.

Arabic/English interface, RTL logical layout, mixed-script titles, native modal focus handling, keyboard-accessible central planting, local export and explicit scoped-deletion confirmation are implemented. Existing English fictional catalogue content has Arabic display translations; original art/catalogue and IDs remain intact. Help is static, user-initiated and does not scan private text or contact anyone.

## Files and data boundary

- `shared/meaningfulStep/model.js`: one selection model, namespaced references, optional step, idempotent start and safe lookup of completed/missing tasks.
- `shared/persistence/meaningfulStepStore.js`: versioned feature key `personal-growth-garden:meaningful-step:v1`, read-only loading, validation, Web Locks serialization, stale-write rejection, readback and scoped deletion.
- `src/meaningfulStep/useMeaningfulStep.js`: React binding, read-only error state, explicit reload and storage-change handling.
- `src/components/MeaningfulStepPanel.jsx`, `TaskDrawer.jsx`, `Dialog.jsx`, `HelpPage.jsx`, `DataControls.jsx`: compact optional flow, secondary access and privacy/help controls.
- `src/App.jsx`, `Garden.jsx`, `Garden3D.jsx`, `SeedBank.jsx`, `Catalogue.jsx`, `src/styles.css`, `src/i18n/*`: integration and localization. The React garden hook returns successful persisted state so new tasks are selected only after planting is saved.
- Tests cover selection/persistence, language completeness and absence of game algorithms in UI components; previous game/persistence tests remain.

Standalone `index.html`, standalone styles and `garden3d.js` were not modified for this milestone. Garden stores remain separate and are never merged. Export from React includes both raw garden stores and backups plus raw selection data. Deletion removes only the new selection key after an explicit confirmation in the data dialog. It does not touch garden stores/backups. No experiment store or telemetry was added; voluntary evaluation stays manual.

## Automated verification

`npm test`: 46 passed, 0 failed. `npm run build`: both entries built successfully; the existing Three.js chunk-size warning remains.

## Actual browser checks

Tests used a separate origin on port 5174 to avoid modifying real gardens on port 5173. Verified: create and select a plant, edit optional step, Start without receiving a seed, reload retaining choice/text/start, Later without losing the plant, select the existing task again, complete with one original reward, and no automatic replacement. Tested two open tabs: an external selection change paused the stale tab, and Retry loaded the newer step. Verified the scoped-deletion confirmation and cancelled it; final delete behavior is covered in automated storage tests, not performed against real user data. Arabic RTL and English LTR had no horizontal overflow at 360px viewport width. Temporary viewport overrides and test tabs were cleaned up.

## Verification limits and known tradeoffs

- No personal baseline or week-long experiment has run. Start is not proof of actual work and the app is not a validated treatment.
- Actual touch pinch, back-cache and 200% text zoom have not been reverified in this milestone. Mobile layout was tested through viewport resizing, not a physical device.
- Storage failure cases and scoped deletion are verified with isolated fake storage, not destructive tests against real data. Web Locks requires a supported browser; older pre-upgrade tabs should be reloaded.
- Garden planting and selecting a new primary task use two independent stores rather than an unsafe cross-store transaction. If the plant saves but selection fails, the UI explicitly reports partial success and offers to select the already-saved task, without planting another one.
- Language resets to Arabic on reload; task text and selection are retained. Language preference persistence can wait unless it obstructs use.
- Main app task data remains origin-specific. The trial React garden does not automatically display standalone tasks. Access the older garden through `index.html`; no migration/import is silently performed.
- Existing large Three.js bundle warning remains. No visual effect was added to the shared renderer solely for this milestone.

## First trial

Use VALIDATION_PLAN: three optional baseline days, then seven calendar days with this feature when useful. At most two voluntary daily answers: ease of beginning (1–5, N/A allowed), and pressure added by the app (0–4). Stop or simplify if the app increases guilt, checking or time spent managing a productivity tool. No new features are required to finish the week. There are no automatic reminders, daily quotas or clinical ratings.
