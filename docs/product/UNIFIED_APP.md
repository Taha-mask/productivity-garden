# Unified application — 2026-10-22

The user approved combining both agents' work into one project. React is the only live app; Three.js and current features remain.

- `/` and `index.html` load React. `react.html` redirects to the same application. Vercel `/classic` redirects to `/`.
- Retired duplicate standalone UI: app.js, style.css and data.js. Their prior content remains in Git.
- React saves, preferences and selected-task references keep their existing keys and browser origin.
- Legacy copy is explicit in Your data, validates source, keeps original data and seeds, and prevents duplicate imports. Overflow seeds are retained until slots are available.
- Existing protected saves snapshot the React garden before changes. Failed imports report errors instead of success.
- Historical game profiles remain for compatibility tests and legacy validation.

Earlier two-interface architecture and ownership notes describe historical milestones. This decision supersedes those entry-point descriptions.
