# Milestone A result

Date: 2026-10-22. Scope: shared game algorithms and protected persistence only. No priority UI, mood tracking, reflection, reward revision or schema migration.

## Changes and rationale

- `shared/game/profiles.js`, `rules.js`, `transitions.js`: one pure transition/calculation engine. Entry profiles preserve stage duration, outcome ordering, species-assignment timing and full-bank edge behavior. Storage-field translation is confined to adapters. React retains its public facade to avoid rewriting components.
- `shared/persistence/gardenStores.js`: validation, zero-write loading, immutable first raw snapshot, verified writes, conflict rejection, Web Locks serialization and export of both independent namespaces.
- `app.js`, React rule/reducer/hook facades: compute proposed state first and show committed gameplay changes only after successful persistence. Invalid data stays untouched while changes are paused; fallback visuals are not a replacement save. Retry reloads the selected namespace.
- `index.html`, `style.css`, `src/App.jsx`, `ui/backup.js`: small export/error/retry controls necessary for recoverability, without a new dashboard.
- `package.json`, tests and frozen synthetic legacy fixtures: Node test runner, behavioral parity and data-protection regression coverage.

## Actual validation

`npm test`: 32 passed, 0 failed. `npm run build`: succeeded for both entries, with the existing large Three.js chunk warning. Automated coverage includes historical RNG boundary/output order, immutable transitions, stage differences, duplicate completion, metadata preservation and both profiles' edge behaviors. Persistence cases cover exact raw backups, no writes on load, corrupt saves/backups, quota and dropped writes, namespace isolation, export without mutation, stale-tab rejection and async lock coordination. Shared-engine import checks discourage local rule duplication.

Production build completed for both entries. Browser checks: existing standalone task/count/seed state loaded with no validation warning; opening a draft worked; React bank/catalogue rendered and switching to the shared 3D scene succeeded. No test data was deliberately committed into the user's real gardens during these checks. Cancellation was checked: closing the standalone planting draft preserved the visible seed inventory and task list.

## Limits and manual verification

- Actual device pinch/Back-cache and simulated browser quota/lock failures were not re-tested end to end; storage failures are covered with injected in-memory fixtures.
- Web Locks protects upgraded cooperating tabs. Reload any older already-open version before editing; external scripts and manual storage edits cannot be serialized by this application.
- No automatic merge, import or restore. Both legacy saves and original snapshots retain their own keys. A failed verified read after a successful browser write may require reloading; the original snapshot remains available. Local backup does not survive clearing all site data; export provides the portable copy.
- Failed persistence pauses mutations; Retry intentionally loads the latest saved state. Drafts not saved to the garden remain drafts.
- Existing Three.js production chunk size warning remains; bundling/performance redesign is outside this refactor.
- Future timestamp stage behavior remains entry-specific to avoid an unapproved behavior fix; a separate decision can normalize it later.

Optional manual verification on disposable data: export first; plant and complete once in each entry; reload; confirm reward/counts; open a second tab and change the same namespace; verify the stale tab pauses; verify other namespace remains untouched. Do not clear real browser data for testing.

## Next milestone

The approved goal remains reducing decisions before starting without increased app pressure. This milestone only prepares a shared foundation. The product documents currently describe React as the proposed visible MVP entry; no priority behavior has been implemented in either entry here. Preserve any concurrent work on the remaining product scope and coordinate before changing its UI.
