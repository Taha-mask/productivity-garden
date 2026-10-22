# 3D integration handoff

User requested a 3D upgrade and collaboration with Claude. Direct contact with the existing Claude sessions is unavailable, but Claude Code CLI was discovered and used for a real read-only review. This shared-workspace note documents the integration boundary.

- Codex owns root `garden3d.js`, `app.js`, `index.html`, `style.css` for this upgrade.
- Existing Claude ART/CORE ownership in `CONTRACT.md` remains respected; no `src/**` edits.
- Shared tooling: `three` dependency installed; Vite build now includes both `index.html` and `react.html`.
- `garden3d.js` exports `createGarden3D(container, {onGroundClick, onPlantClick, onError})` and returns `setPlants`, `resetView`, `dispose`.
- Plant props: `{id,x,y,done,stage,tier,variant}`. x/y are 0..100 ground coordinates; stage is 1..5; variant is 0..4 within a tier.
- The React version may reuse this scene through a ref/effect adapter without duplicating the renderer.
- Keep localStorage keys separate; standalone key remains `productivity-garden-v1`.

Open-source foundation: https://github.com/mrdoob/three.js (MIT). Scene models are created procedurally for this project, without downloaded third-party art.

## Claude review implemented

Claude Code reviewed the 3D integration using its Read tool. Codex applied its findings: retain scene on persisted pagehide, ignore non-primary/mismatched pointer taps, skip rendering when hidden, and update static shadow maps only when plant meshes change. Codex also caches the plant render signature to avoid recreating geometry during unrelated UI updates. Source verification: syntax checks and production build; browser verification tracked separately.
