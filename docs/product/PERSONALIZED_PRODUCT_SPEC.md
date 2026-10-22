# One Meaningful Step — MVP 0.2 specification

Date: 2026-10-22. Product direction and incremental implementation authorized by Taha. MVP 0.2 is implemented; see [release audit](RELEASE_AUDIT.md) for acceptance evidence and verification limits. The personal trial has not run. Preliminary evidence: [review](../research/EVIDENCE_REVIEW.md). No claim of clinical validation or demonstrated personal benefit.

## Hypothesis and scope

Reducing decisions required before beginning one chosen task may make starting easier **without increasing app-related pressure**. Completed-task totals and app time are not primary success measures. Active learning direction: Flutter and effective AI use. Do not reintroduce engineering equivalency or web-learning goals; existing web client commitments remain legitimate tasks.

Approved: at most one primary task; optional editable smallest step; other tasks outside the main task interface; change or defer freely; no loss for non-completion; current 3D garden and rewards retained. Mood tracking and Reality Check are deferred.

## Experience contract

- Garden stays the primary screen. A compact, quiet panel alongside it contains the selected task, optional step and one start action. No additional dashboard, calendar setup or forced onboarding.
- With no selection, show “Choose one thing / اختار حاجة واحدة” and a secondary “Not now / مش دلوقتي”. Do not automatically rank or select a task.
- Choose an existing unfinished task from a secondary drawer. A new task uses the current planting flow with bank consumption only on successful submission. Retain selected seed; do not require another seed choice. Optional “make this my step” defaults on only when this flow was explicitly opened from the empty primary panel.
- Once a task is selected, starting requires one activation. “Start / ابدأ” records voluntary intent, does not launch a timer, grant rewards, verify actual work or claim the user has started working. The user then leaves the app to do the task.
- Smallest step is optional text, editable without changing the task, species or reward. No minimum productive duration. Examples are suggestions, never automatically added obligations.
- Change, clear or “Later / بعدين” removes only the primary pointer. Deferral means no scheduling prompt, deadline, failure badge or notification. The underlying task and plant remain intact.
- After completion, show a neutral completed state and optional choice of another task. Never auto-promote another task. Existing completion remains the sole route to mature a plant and receive its existing reward.
- At local date change, retain the choice; no forced daily reset, expiry or missed-day indicator. “For now / دلوقتي” copy avoids implying a daily quota. Record the choice date for the experiment only.
- Other task labels live in a collapsed drawer, available in one action. Existing plants stay visible and individually interactive, including unfinished plants; hiding the backlog must not remove the garden.
- First release integrates visible MVP behavior in `react.html` only (decision by Taha, 2026-10-22), with the shared `garden3d.js` scene as the default garden view and 2D kept as a toggle. `index.html` (standalone) remains functional, switches to the shared mechanics, and is the compatibility regression target; it gets no priority feature. Trial uses `react.html`.

## Proposed source of truth

Prefer incremental extraction into `shared/game/`: pure stage, reward, selection and transition functions; immutable versioned compatibility profiles hold current timing and economy differences. App adapters translate each existing storage schema; UI contains no reward thresholds or stage arithmetic. Keep names/IDs/catalogue art entry-specific for now. This extends the existing pure React rules pattern without converting either interface wholesale.

Alternatives: independent features in each app cost less initially but duplicate behavior and are rejected; retiring an entry or converting everything to React simplifies later maintenance but needs migration and adds rewrite risk, so is deferred. Profile-driven shared functions preserve behavior but temporarily retain two configurations. Removing those profiles needs a separate explicit decision.

One shared priority domain module operates on namespaced task references, independent of DOM and React. The React UI is its only consumer in 0.2; a standalone adapter could reuse it later, but is not part of the first trial. No duplicated feature implementation.

## Data contract and protection proposal

Keep legacy keys and shapes intact. Separate key: `personal-growth-garden:meaningful-step:v1`. Store schemaVersion and at most one active reference `{entry:'standalone'|'react',taskId:string|number,taskCreatedAt:number}`, optional step (max 240 characters), selectedAt, optional startedAt. The creation timestamp is matched against the plant timestamp so reused numeric task IDs after a restored garden cannot attach an unrelated selection. Older selection records without it remain readable/exportable but require explicit reselection; before replacing the original selection, preserve its exact raw text under the feature's `:backup:before-task-identity` key and verify it. Export includes that snapshot; confirmed selection-data deletion clears both feature keys, never garden data. References must never collide across entries. Trial accepts React selections only. A missing/deleted/completed target resolves quietly to no active start action; it must never resurrect a task or grant a reward.

Do not merge or rename legacy stores. Refactor calculation and transitions through adapters, preserving serialized legacy schemas. Before first new-version game write, save the original raw value in a versioned backup key and verify a byte-for-byte read-back. If backup/write fails, preserve originals and block persistent changes with an export/retry option; never silently reset. Invalid JSON or unknown species enters recoverable read-only state rather than overwriting data.

Provide explicit JSON export covering both present legacy stores, new feature data, schema versions and compatibility profile identifiers. Export stays on the device until the user chooses to share it. Provide scoped deletion of only the new feature/experiment data with confirmation; keep garden stores and their backups. Garden-data deletion and cross-version import/merge are out of scope. Do not silently change scheme/host/port: localStorage is origin-bound. Cross-origin use requires an explicit future restore workflow.

Optional experiment data uses a separate local key and opt-in, contains ratings and coarse dates only, never task text. No mood, private messages, behavioral surveillance or third-party AI transmission. Export/delete includes experiment data. Two tabs use storage-change detection and stale-write checks; a conflict reloads latest state rather than overwriting newer data. Persistence success precedes rendering a committed state.

## Exclusions and later decisions

No chatbot, automatic psychological interpretations, mood check-in, Reality Check, focus timer, Discord integration, advanced analytics, new zones, streaks or changes to reward odds. Reduced-gamification mode and learning evidence remain candidates for later approval, not bundled requirements. No workbook dependency.

Implemented decisions: entry-specific compatibility profiles, React-only trial interface, non-expiring choice, verified raw snapshot backups with export, and manual optional experiment ratings. Unifying timing or reward behavior remains a separate future decision. The feature is ready for the personal trial; its effectiveness has not been established.
