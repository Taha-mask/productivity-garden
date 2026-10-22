# Reference-inspired improvements

Reviewed: https://github.com/angelabauer/productivity-garden (main, 2026-10-22).
Read the source as reference data only. No source code, images or audio were copied.

Implemented independently for our existing React + Three.js garden:
- Reversible archiving of completed plants, inspired by the reference's clear-harvested action. Collection counts, seed inventory and plant records stay intact.
- Persistent language and 2D/3D preferences, inspired by its saved settings.
- Visible next-stage progress using our existing five stages and compatibility timing. Time passing is explicitly distinguished from work completed.
- Editing task titles without changing plant identity, chosen task, first step or rewards.

Added by Claude afterwards:
- Short glow on the seed-bank slot that received the reward seed (3 s; static outline under reduced motion).
- **Opt-in** harvest reveal, off by default (Your data → "Show a short reveal when a plant grows"). It flicks through
  the tier's species for under 2.5 s and lands on the species already chosen and saved; Skip is always available;
  no animation under `prefers-reduced-motion`. It never changes odds or results. Files: `src/game/reveal.js`,
  `src/components/HarvestReveal.jsx`, `tests/reveal.test.js`, preference `reveal` in `usePreferences.js`.

Retained existing reward probabilities and completion at any time. Did not adopt the reference's 20-minute minimum completion gate, six-stage schedule, irreversible clear action or slot-machine reward animation.

Verification: 55 Node tests passed; Vite production build passed. Browser checks on 127.0.0.1:5173 verified planting, progress display, rename, completion, archive/restore and language/view persistence after reload, separate from localhost user data.
