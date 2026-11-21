# Daily Yoga

Ten minutes of yoga a day, in Hindi and English, with the poses that are unsafe
for a given body taken out before the session is built.

Web first; the mobile app comes later and reuses the same engine and content.

## What it does

The user answers four questions once — language, goal, experience level, health
conditions — and from then on the home screen shows one thing: today's session
and a play button. No library to browse, no class to choose.

The session is built, not filmed. Forty poses and a sequencer produce a
different plan every day, filtered against the user's health profile:

```
health profile  ─┐
goal + level     ├─→  sequencer  ─→  today's 10-minute session
40 poses         │                   + "3 poses removed, here's why"
106 avoid rules ─┘
```

## Layout

| Path | What it is |
|---|---|
| `content/` | The product: 40 poses, 106 avoid rules, step-by-step instructions, shoot and voice scripts. See `content/README.md` |
| `packages/engine/` | Pure TypeScript sequencer and safety filter. No React, no Next — the mobile app imports the same code |
| `packages/content/` | Generated typed content module (`poses.generated.ts`) plus the DRAFT/APPROVED gate |
| `apps/web/` | Next.js app: onboarding, home, session player, progress, pose library, settings |
| `apps/mobile/` | Not built yet. Expo, once the web numbers justify it |

## Running it

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # engine tests
npm run build     # production build
npm run content   # rebuild content after editing content/*.csv or pose-steps.json
```

### Static export

Everything in the app runs client-side, so it can also be emitted as a plain
folder of HTML and assets for a host that serves static files only:

```bash
STATIC_EXPORT=1 npm run build   # output in apps/web/out
```

All 40 pose pages are prerendered by `generateStaticParams`. Two notes if you
publish the folder somewhere that reserves names beginning with an underscore:
rename `_next` and `_not-found` and rewrite the references, and escape the
literal U+FFFD characters that appear inside one Next.js chunk as `\ufffd`.

## The safety rules

These are invariants, not preferences. `packages/engine/test/sequence.test.ts`
asserts each one, and the suite is the gate on any change to the sequencer.

1. **A pose marked AVOID for a condition the user ticked never reaches a plan.**
   Tested for every condition individually and for all thirteen at once.
2. **Every AVOID rule names an alternative**, and a substituted alternative is
   itself checked against the same profile before it goes in. A filtered plan
   is replaced, not shortened.
3. **A session is never empty.** `tadasana`, `shoulder-rolls` and
   `joint-rotations` carry no avoid rules and act as the floor.
4. **CAUTION keeps the pose and shows the warning** with its modification. The
   red box is never collapsed and never shortened.
5. **Nothing renders until the therapist approves it.** Every content row is
   `DRAFT` until reviewed; a production build refuses DRAFT rows and shows an
   empty state instead. `NEXT_PUBLIC_ALLOW_DRAFT_CONTENT=true` overrides this
   for a staging deploy and puts an amber banner on every screen.
6. **Excluded by default, in content:** Sirsasana, Sarvangasana, full
   Padmasana, Kapalbhati, Bhastrika, and any breath retention.

## State

No login and no server. Profile, session log and streak live in
`localStorage`, wrapped so the app still renders when storage is blocked or
cleared. The date seeds the sequencer, so a day's plan is stable across
reloads and cannot be rerolled for an easier one.

## Status

| | |
|---|---|
| Content written | 40 poses, 106 avoid rules, 40 step-sets, Hindi + English |
| Therapist review | **not started** — every row is DRAFT |
| Pose clips | **not shot** — see `content/SHOOT-CHECKLIST.md` |
| Voice recordings | **not recorded** — see `content/VOICE-SCRIPT.md` |
| Engine | done, 20 tests passing |
| Web app | onboarding, home, player, progress, library, settings |
| Mobile app | not started |

Once clips and audio exist, fill `clip_url` and the audio columns in
`content/poses.csv`, run `npm run content`, and the app picks them up — no code
change needed.
