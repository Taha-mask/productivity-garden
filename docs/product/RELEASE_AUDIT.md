# MVP 0.2 engineering acceptance audit

Date: 2026-10-22. Approved scope: One Meaningful Step in React, shared rules for both entries, protected local data, no deferred psychological systems. The experiment and its outcome are not completed by engineering tests.

## Requirement-by-requirement evidence

| Requirement | Authoritative implementation/evidence | Result |
|---|---|---|
| One selected task; optional editable first step; one-action Start on return | shared selection model, MeaningfulStepPanel, browser create/edit/start/reload paths on isolated origin | Verified |
| Change/cancel/Later preserve seeds and plants | pure model tests, no game dependency guard, browser Later and cancellation with unchanged bank | Verified |
| No auto-choice after completion/date rollover; missing references safe | model tests and completion browser path; references now match entry, typed ID and creation timestamp | Verified |
| Rest of tasks in one secondary drawer; garden interactive | TaskDrawer and browser choose/change paths; shared canvas and 2D retained | Verified |
| Start is intent, no timer/reward; duplicate is harmless | model idempotence test, source dependency guard, browser Start without seed return | Verified |
| Independent stores; reload; no ID collisions or implicit merge | historical parity, snapshot/isolation tests, typed IDs and timestamp-reuse tests; two-tab browser checks | Verified |
| Arabic/English, RTL, keyboard, mobile, recoverable storage errors | language completeness tests, 360px Arabic/English checks; focus/escape/cancel/reopen browser checks; injected quota/conflict/corrupt-state tests | Verified within stated coverage |
| Export and confirmed feature-only deletion | browser download inspected: both raw garden namespaces, selection and historical-selection snapshot; fake-storage scoped-delete tests; UI confirmation checked and cancelled | Verified; no real user data deleted |
| No mood/reflection/chatbot/streak/notifications or economy changes | source scope inspection; shared legacy oracle parity tests for both compatibility profiles | Verified |
| Preserve existing 3D, bank, collection, five stages, tiers/species | historical engine parity; both entries build; prior scene/browser checks and unchanged scene module | Verified; physical-device limits below |
| Eight requested research/product documents | all required Markdown files exist; relative links checked; evidence review explicitly preliminary; Implementation Intentions attribution corrected | Verified |
| Missing Angela Yu workbooks treated as pending | EVIDENCE_REVIEW.md and feature scope; no workbook exercises attributed or required | Verified |
| Trial strategy measures starting friction and app pressure | VALIDATION_PLAN.md: three optional baseline days + seven calendar trial days; missing answers allowed; stop/simplify rules | Plan delivered; actual user observations pending |

## Claude collaboration and corrections

Claude Code CLI performed two actual read-only source reviews. First review identified default replacement from the drawer, inappropriate game-error gating of Start, keyboard focus loss, whitespace-only steps and task-ID reuse after restore. Each was fixed and checked in source/tests/browser where applicable. The second review found no blocking bugs in the files it covered; its additional reopen-focus and no-op-save observations were also addressed. Claude did not review the entire repository and its source review is not a substitute for runtime verification.

Current behavior: only planting initiated from the empty primary panel defaults the primary checkbox on; Change/Other tasks do not. Valid external garden updates reload the garden without blocking independent Start. Step-store conflicts still pause selection writes. No-op game transitions return failure to UI callers. Focus is restored through editing, Escape, hiding/reopening and selection changes. Whitespace steps normalize to empty.

Legacy selection records lack a creation-time fingerprint. They are preserved and presented for explicit reselection, not matched by ID alone. The first historical raw selection is saved and verified before replacement, is included in export, and is removed only by confirmed feature-data deletion. No legacy garden key/schema is migrated.

## Commands and browser verification

Final verification: `npm test` passed 49 tests with 0 failures; `npm run build` built both entries successfully. All eight required document paths and relative documentation links were checked. Browser tests used port 5174 so no fixture tasks were introduced into the real port-5173 gardens. Test tabs and server are temporary. Real preview stays at `http://localhost:5173/react.html`; standalone remains at `/index.html`.

Additional text-resize harness: `tests/browser/text-zoom.html`, served through Vite, snapshots actual computed text sizes and doubles them. It verified no horizontal page overflow at desktop and 360px widths, plus no horizontal overflow in the data dialog. It is an approximation of text-only resizing, not proof for every browser's native zoom setting. It is not included among production build entries. Load it on a disposable origin; click its test button or press F8 after opening a dialog.

## Limits and trial gate

Physical-device pinch/assistive-technology testing and native browser Back-cache/zoom behavior were not exhaustively verified. Earlier fixes and accessible alternatives remain, but these specific devices are not claimed tested. The existing Three.js chunk-size warning remains non-blocking for this local prototype.

No personal baseline, week of use, clinical evaluation, learning assessment or evidence of reduced pressure has been fabricated. No reminders, monitoring automation or automatic experiment collection is installed. The next activity is actual optional use and feedback, not implementing the deferred feature list. If use increases guilt, repetitive checking or distracts from Flutter, stop or simplify. The engineering release can be ready while its personal usefulness is still unknown.
