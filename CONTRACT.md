# Team contract (two Claude sessions, disjoint files)

## MVP 0.2 milestone B ownership (2026-10-22)

For the currently approved milestone, Codex root owns React integration, `src/meaningfulStep/**`, `src/i18n/**`, `src/components/MeaningfulStepPanel.jsx`, `TaskDrawer.jsx`, `HelpPage.jsx`, `DataControls.jsx`, and necessary existing React UI/hook edits. Its assigned domain agent owns ONLY `shared/meaningfulStep/**`, `shared/persistence/meaningfulStepStore.js`, and `tests/meaningfulStep.test.js`. Existing artwork/catalogue files and standalone UI are not part of this milestone. `garden3d.js` remains shared and unchanged. Do not modify another active owner's files concurrently; coordinate first.

## Ownership
- **ART session** owns ONLY: `src/art/**` and `src/data/catalogue.js`
- **CORE session (main)** owns everything else: `src/game/**`, `src/components/**`, `src/App.jsx`, `src/main.jsx`, `src/styles.css`

Never edit a file the other side owns. Message each other (SendMessage) for changes.

## Plant ids (fixed)
- basic: `b1`..`b5`   rare: `r1`..`r5`   extinct: `e1`..`e5`

## ART deliverables
1. `src/data/catalogue.js`
   ```js
   export const CATALOGUE = [
     { id: 'b1', tier: 'basic', name: '...', description: '...magical powers...' },
     // 15 entries total, tier is 'basic' | 'rare' | 'extinct'
   ];
   ```
2. `src/art/GrowthStage.jsx` — default export `<GrowthStage stage={1..5} size={64} />`
   Generic plant growth, 5 distinct SVG phases (1 = seed/sprout ... 5 = full unripe plant).
3. `src/art/MaturePlant.jsx` — default export `<MaturePlant id="b1" size={64} />`
   One distinct SVG per id (15). Rare = fancier than basic, extinct = most magical.
   Also accept `silhouette` boolean prop: when true render the same shape fully black
   (used for never-matured plants in the catalogue; CORE applies CSS grayscale as needed).

SVG rules: viewBox `0 0 100 100`, transparent background, no external assets,
bottom of plant sits at y≈90 so plants align on the ground. Plain React components, no libs.
