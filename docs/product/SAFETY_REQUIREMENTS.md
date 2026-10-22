# Safety and privacy requirements

Applies to MVP 0.2 and subsequent work. This is a personal productivity tool, not a validated treatment or crisis service. Product-safety requirements do not imply a diagnosis or a current crisis for Taha.

## Mandatory product behavior

- No diagnosis, medication/treatment advice, cure promises, AI therapist or automatic interpretation of distress.
- No punitive streaks, plant death from rest, urgency, comparative leaderboards, lost progress for deferral, excessive work encouragement or new engagement notifications.
- Mood and reflection remain absent in 0.2. No hidden monitoring, mood inference, Discord/private-message access or automated profiling.
- Optional experiment questions assess **app-related pressure**, not mental-health symptoms, and can be skipped without explanation.
- Rest, hobbies and AI-assisted work must never be labeled worthless. Do not require proof of productivity for enjoyment.
- Existing random rewards remain unchanged by profile; do not add purchases, scarcity, reroll prompts, odds manipulation or rewards for using the app repeatedly.

## Local data and recovery

Task text and optional smallest step are personal data. Store locally by default. Do not send them to Claude, analytics, external AI or a backend without explicit informed consent naming the data and destination. Research/design documents must not reproduce private reflections. Local storage is neither encrypted storage nor reliable permanent backup.

Backup validation, failure handling, export, scoped deletion and conflict protection in PERSONALIZED_PRODUCT_SPEC are release requirements. No auto merge, deletion or schema replacement of either garden. External fonts currently create network requests; they do not carry task text by design, but “local data” must not be marketed as “zero network requests.” No new third-party resources required for 0.2.

## Appropriate help and immediate-danger flow

Provide a small user-initiated Help/About route with plain text: if distress persists or materially disrupts daily life, consider a qualified mental-health professional. Do not show personalized clinical recommendations based on task performance.

For an explicit user request for immediate safety help, show a short static action flow: if there is immediate danger, contact local emergency services or go to a nearby emergency department; reach a trusted person who can stay with the user; do not wait for the app or an AI reply. No chatbot risk assessment, claim of human monitoring, or statement that help has been contacted. Do not send contacts/messages automatically. Locale-specific service numbers require an authoritative verified source before release; do not guess. No silent keyword scanning of private task text. Future free-text wellbeing input would require a separate safety design and review.

## Harm monitoring and stop conditions

If the user finds the app increases guilt, anxiety, compulsive checking or delays chosen real-world work, stop the experiment immediately if desired, disable the selection panel and optional measurement, retain all garden data, and review before adding features. Never tell the user to push through distress for a valid experiment. Skipped days and missing feedback are not failure. No clinical risk or identity score.

## Release review

Review both languages and all empty/error/completed states for blame, false reassurance or therapeutic claims. Confirm no mood payload, telemetry, reward changes or notification hooks were added. Test export/deletion and storage failures. Mark unverified device behaviors honestly in the release note.
