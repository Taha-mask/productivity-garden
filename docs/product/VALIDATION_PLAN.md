# Personal usability experiment — One Meaningful Step

Status: proposed; not started. Preliminary evidence does not validate this feature. This is an individual usability experiment, not a clinical trial or mental-health assessment.

## Hypothesis

Fewer decisions before beginning a chosen task may make starting easier without increasing pressure from the app. The experiment tests usefulness for Taha in ordinary life, not universal efficacy or personal worth.

## Schedule and minimal measures

Baseline: three ordinary days using the current garden, with optional manual notes. No new feature needed for baseline. Intervention: seven calendar days using the reviewed 0.2 feature in `react.html`; days without use are allowed. Choose a start date after implementation and data checks, not now. Use comparable real tasks where practical, but do not manufacture tasks for the study.

At most one voluntary check per used day, after the chosen task attempt or end of day:

1. Starting ease: “How easy was it to begin the task you chose?” 1 very difficult to 5 very easy; N/A if no attempt.
2. App-related pressure: “How much pressure or guilt did the app itself add?” 0 none to 4 a lot; N/A if not used.

Optional one short note: did using/configuring the app delay the real task? Do not require a thought diary. Start button timestamps represent reported intention, not observed work; do not use them as proof of actual onset. No screen recording, Discord access, mood questionnaire or background telemetry. Missing data stays missing, never zero or failure.

## Weekly review (10 minutes maximum)

Compare median ease and pressure descriptively with baseline, along with number of answered/attempted days. Note task differences, exams, workload, novelty and limited sample. No significance tests or causal claim. A candidate keep decision is ease improving by at least one rating point with pressure not increasing and the user wanting to continue. This threshold is a pragmatic decision aid, not a validated cutoff. An easier week or missing ratings may leave the result inconclusive.

Ask only: did it help me begin; did it add pressure; did it take time away from the thing I wanted to do? Task completion counts can provide context, never override increased pressure or become a target. No target for daily use, streaks, screen time or number of plants.

## Stop or simplify

Stop immediately whenever the user wants. Also offer stopping if the app leads to guilt, anxiety, compulsive checking or displacement of Flutter/work/rest. Two used days with app pressure at 3–4, or a sustained increase over baseline, trigger a suggestion to pause; this is a conservative product heuristic, not clinical monitoring. No forced continued use to finish the week. Retain all garden data and allow hiding the feature. Persistent distress outside the app calls for appropriate real-world support, not more app experiments.

## Decision after one week

- Keep if it helps start, does not add pressure and feels worth its small overhead.
- Simplify if choosing/editing becomes more work than starting.
- Remove if burden rises or it mainly encourages managing the garden.
- Inconclusive is acceptable; repeat only if Taha wants and there is a narrow question, without adding features.

## Privacy

Manual notes are sufficient. If app logging is approved, use a separate opt-in local store of coarse date/ratings, never task titles or reflections, with export and scoped deletion. No transmission to AI or services. Do not include personal responses in repository docs or commits.
