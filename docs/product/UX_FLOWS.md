# UX flows — MVP 0.2

Status: implemented for MVP 0.2; see RELEASE_AUDIT.md for verified paths and limits. Existing garden identity, camera and plant interactions are retained. Research support is preliminary; usefulness remains a design hypothesis.

## Main path

Open garden → selected task and optional step, if present → **Start** → neutral “You can leave the garden and begin / تقدر تبدأ دلوقتي” → actual task outside the app.

No selection → **Choose one thing** → drawer of unfinished tasks → select → optional step can be skipped → return to garden. Existing tasks require no repeated naming, seed selection or position decision.

No suitable task → **Plant something new** → existing title/plant placement interaction → successful planting → select new task → garden. Cancelling at any point leaves inventory and prior selection untouched. No requirement to rearrange the scene to start an existing task.

## Secondary paths

| Action | Result | Must not happen |
|---|---|---|
| Edit step | Save optional text or clear it | Require completing a form to begin |
| Change | Open task drawer; current choice stays until replacement confirmed | Clear old choice on cancellation |
| Later / Clear | Remove primary reference; retain plant/task/counts | Deadline, rescheduling questionnaire, lost reward |
| Complete chosen task | Existing completion transition; neutral done state | Auto-choose another task or bonus reward |
| Reopen next day | Same choice unless user changed it | Missed-day badge or dead plant |
| Open other tasks | Reveal drawer; select/change freely | Expose whole backlog on default home view |
| No available seeds | Choose an existing unfinished task; if none, explain current game state | Mint seeds or change reward economy |
| Corrupt storage / backup failure | Explain save limit, offer local export/retry | Reset or overwrite original |
| Decline experiment | Normal product experience | Lose feature access or receive repeated prompts |

## Accessibility and language

Arabic and English strings belong to one small message dictionary. Apply `lang` and document `dir`; support mixed-script task titles with `dir=auto`. No implicit RTL reversal of world coordinates or OrbitControls. Use logical CSS properties for panel/drawer layout. Avoid clinical or guilt-inducing language in either language.

Buttons, drawer and dialogs must work by keyboard; Escape cancels and focus returns to the opener. Start and change have distinct labels. Optional step has a visible label and optional marker. Screen-reader feedback reports saved choice without announcing every garden frame. Mobile layout keeps the selected step and Start visible without covering the canvas controls; no horizontal scroll at 360px width or 200% text zoom. Verify touch and keyboard alternatives to ground placement. Respect reduced motion in any new transitions.

## Decision-friction budget

Returning with a saved selection: one start action, no required new fields. Existing task selection: one choice, no forced step text. No interposed energy/mood questionnaire, timer setup, daily review or reward animation. These are acceptance limits, not guaranteed proof of reduced cognitive effort.
