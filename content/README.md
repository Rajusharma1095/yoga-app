# Content — 40 Poses

Ye folder app ka **asli product** hai. Code sirf isko dikhaata hai.

| File | Kiske liye | Kaam |
|---|---|---|
| `poses.csv` | aap + teacher | 40 poses — naam, category, difficulty, goal, timing, flags |
| `avoid-rules.csv` | **teacher (sabse important)** | 106 rules — kaunsa pose kiske liye mana hai |
| `SHOOT-CHECKLIST.md` | aap | shoot ka din — block order, framing, naming, compress |
| `VOICE-SCRIPT.md` | aap | 120 Hindi + 120 English voice cues |
| `pose-steps.json` | aap + teacher | **har pose ke poore steps** (Hindi + English), common galti, aasaan version, fayda |
| `POSE-STEPS.md` | aap (shoot ke din) | upar wali file ka padhne-layak version — shoot block order mein, avoid-rules ke saath |
| `build.py` | code | CSVs + steps se `poses.json` aur `POSE-STEPS.md` banata hai |
| `poses.json` | code | auto-generate hota hai, app isko padhta hai — **ise haath se edit mat karo** |

---

## Ek rule, sabse zaroori

Har row ka `status` column hai:

```
DRAFT  →  app mein nahi dikhega
APPROVED  →  app mein dikhega
```

**App sirf APPROVED rows dikhayega. Ek bhi exception nahi.** Abhi saari rows DRAFT hain —
40 poses, 106 avoid-rules, 40 step-sets.

### Kisi bhi file ko edit karne ke baad ye chalao

```bash
python3 content/build.py
```

Ye `poses.json` aur `POSE-STEPS.md` dono dobara banata hai, aur galtiyan pakadta hai
(missing steps, galat condition level, alternative jo exist nahi karta).

---

## Teacher ko kya bhejna hai (ye message copy kar lo)

> Namaste. Main ek daily yoga app bana raha hoon — 10-minute sessions, Hindi mein, general fitness ke liye (therapy ya medical claim nahi).
>
> 2 sheets bhej raha hoon:
> 1. **poses.csv** — 40 poses, unki difficulty, timing aur category
> 2. **avoid-rules.csv** — 106 rules: kaunsa pose kis condition mein mana hai
> 3. **POSE-STEPS.md** — har pose ke step-by-step instructions jo app mein dikhenge
>
> Aapse 5 cheezein chahiye:
> 1. Koi pose jo is list mein nahi hona chahiye? (ya koi zaroori pose jo chhoot gaya?)
> 2. Timing aur difficulty sahi hai?
> 3. **Steps aur 'common galti' sahi likhe hain?** Koi galat cue?
> 4. **avoid-rules mein kuch galat ya missing hai?** — ye sabse important hai
> 5. Har row ke `status` ko `APPROVED` kar dein, aur apna naam + date daal dein
>
> Default safety jo main pehle se rakha hoon: koi Sirsasana, Sarvangasana, poora Padmasana, Kapalbhati ya Bhastrika nahi. Saari sequences difficulty 1–2 se shuru hoti hain. Pranayama mein saans rokna (kumbhaka) nahi hai.
>
> Ye ek paid review hai — apni fees bata dein. App mein aapka naam credit mein aayega: *"Reviewed by [naam], Certified Yoga Therapist"*.

### Teacher dhoondhne ki jagah
- Local yoga studio ka senior teacher (YCB Level 2/3 certified)
- S-VYASA ya Kaivalyadhama ka alumni (LinkedIn pe search karo)
- Ayush-registered yoga therapist
- Rate: **₹10,000–15,000** one-time review ke liye reasonable hai

---

## Conditions ki list (avoid-rules mein jo use hui hain)

Health check screen pe user yahi tick karega:

| Code | Hindi | English |
|---|---|---|
| `pregnancy` | गर्भावस्था | Pregnancy |
| `high_bp` | हाई ब्लड प्रेशर | High blood pressure |
| `heart` | दिल की बीमारी | Heart condition |
| `glaucoma` | आँख का दबाव / ग्लूकोमा | Glaucoma |
| `hernia` | हर्निया | Hernia |
| `recent_surgery` | 6 महीने में सर्जरी | Surgery in last 6 months |
| `slipped_disc` | स्लिप्ड डिस्क / साइटिका | Slipped disc / sciatica |
| `osteoporosis` | हड्डी कमज़ोरी | Osteoporosis |
| `knee_arthritis` | घुटने का दर्द / आर्थराइटिस | Knee arthritis |
| `vertigo` | चक्कर आना | Vertigo |
| `neck_injury` | गर्दन की चोट / सर्वाइकल | Neck injury / cervical |
| `wrist_pain` | कलाई का दर्द | Wrist pain / carpal tunnel |
| `shoulder_injury` | कंधे की चोट | Shoulder injury |

## Levels ka matlab

| Level | Engine kya karta hai | User ko kya dikhta hai |
|---|---|---|
| `AVOID` | pose session se **hata deta hai**, alternative daal deta hai | "Aapke profile ke hisaab se 3 poses hataye gaye" |
| `CAUTION` | pose rehta hai, par **warning + modification** dikhta hai | laal box mein modification |

---

## Numbers

| | |
|---|---|
| Poses | 40 |
| Avoid/caution rules | 106 |
| Step-sets likhe (Hindi + English) | 40 |
| Clips shoot karne hain | 160 (40 × 2 angle × 2 take) |
| Voice clips | 240 (40 × 3 cue × 2 bhasha) |
| Categories | warmup 6 · standing 13 · floor 13 · core 3 · cooldown 4 · breath 1 |
| Difficulty | level 1: 16 · level 2: 20 · level 3: 4 |
| Goals covered | flexibility · weightloss · stress/sleep · back/posture · energy · hip |

## Status tracker

| ☐ | Step |
|---|---|
| ☐ | 40 poses ki list final (ye ho gaya) |
| ☐ | Avoid-rules draft (ye ho gaya) |
| ☐ | Pose steps draft — Hindi + English (ye ho gaya) |
| ☐ | Teacher dhoondha + rate fix |
| ☐ | Teacher review → sab rows APPROVED |
| ☐ | Shoot (Block A–E) |
| ☐ | Clips trim + compress |
| ☐ | Voice record (Hindi) |
| ☐ | Voice record (English) |
| ☐ | `clip_url` + `audio_url` CSV mein bhare |
| ☐ | `poses.json` regenerate |

## 3 poses jinke koi avoid-rule nahi hain

`shoulder-rolls`, `joint-rotations`, `tadasana` — ye sabke liye safe hain, har condition mein. Engine inko **kabhi nahi hataega**, isliye ye har session ka base ban sakte hain (ek bhi pose na bache aisa kabhi nahi hoga).
