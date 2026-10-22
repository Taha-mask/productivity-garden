# Productivity Garden

## One Meaningful Step (MVP 0.2, React)

Visit `http://localhost:5173/react.html` after starting Vite. Choose one growing task, optionally add a first step, then Start and leave the garden to do the task. Start does not complete a task or grant rewards. Later clears the choice without losing a plant. Other tasks, collection, help and data controls stay available on demand. Arabic/English and RTL are supported; Arabic is the initial language.

Selection data is local and separate from both garden stores. The React data dialog exports both gardens plus selection data; its delete control removes selection data only after confirmation. No background measurement, mood tracking or AI transmission is included. The standalone entry remains a separate compatible garden and is not automatically imported into React.

See `docs/product/MILESTONE_B_RESULT.md` and `docs/product/VALIDATION_PLAN.md`. This feature is a usability hypothesis, not a clinically validated treatment; a week of actual use is the next step, rather than adding more features.

## Shared mechanics and safe saves (milestone A)

Both entries now use `shared/game/` for growth, reward rolls and task transitions. Compatibility profiles deliberately preserve each entry's existing timing, species selection and extinct rewards. Existing storage keys and schemas remain separate; neither entry imports or merges the other's progress.

Run `npm test` for legacy behavior parity, protected-save and shared-engine checks. Run `npm run build` for both app entries. No production save is made merely by loading either page. Before the first mutation of an existing save, its exact original text is stored under `<legacy-key>:backup:pre-shared-v1` and verified. Failed backups or invalid data block mutations and expose Retry and Export controls. Export includes raw saves from both entries and their backups; keep this file private.

Writes use the browser Web Locks API to serialize cooperating tabs and reject stale sessions. Reload older open app tabs after upgrading: previously loaded code does not participate in these locks. Browsers without Web Locks can view/export but cannot commit changes. Browser storage can still be cleared by the browser or user; local snapshots are not a substitute for an exported backup. Cross-origin restore/import is not implemented.

See `docs/product/MILESTONE_A_RESULT.md` for validation and remaining checks. The One Meaningful Step UI is not included in milestone A.

A browser-local productivity game with an interactive Three.js garden. Run `npm install`, then `npm run dev -- --port 5173` and visit http://localhost:5173/index.html. Drag to rotate the island, scroll/pinch to zoom, and click grass to plant. Click a plant or a task chip to see its task. Keyboard users can use “Plant a task”.

Choose one of five mystery seeds, click a garden spot, and name your task. Five growth stages advance every five minutes; stage 5 is reached after 20 minutes. Completing a task at any time reveals the mature plant, updates the collection, and returns one seed. There are fifteen plants across basic, rare, and extinct tiers. Progress persists in browser localStorage; clearing site data removes it.

Basic rewards: 50% basic / 50% rare. Rare rewards: 25% basic / 50% rare / 25% extinct. For this prototype, extinct rewards use the rare distribution. No automatic seed replenishment. Mature plants remain in the garden. Desktop and mobile layouts supported.

Run `npm run build` to build both the 3D app (`index.html`) and the separate React app (`react.html`). Three.js is the MIT-licensed open-source foundation: https://github.com/mrdoob/three.js. Garden and plant meshes are created procedurally for this project; catalogue icons remain emoji. Optional Google Fonts fall back to system fonts when offline. Existing standalone progress is retained under the same localStorage key. A WebGL failure leaves keyboard planting and task chips usable. See COORDINATION-3D.md for the Claude integration boundary.
