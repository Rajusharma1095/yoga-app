export type Lang = 'hi' | 'en';

type Dict = Record<string, { hi: string; en: string }>;

export const DICT: Dict = {
  appName: { hi: 'रोज़ योग', en: 'Daily Yoga' },
  tagline: { hi: 'रोज़ 10 मिनट। आपके शरीर के हिसाब से।', en: 'Ten minutes a day, matched to your body.' },
  chooseLang: { hi: 'भाषा चुनें', en: 'Choose your language' },
  continue: { hi: 'आगे बढ़ें', en: 'Continue' },
  back: { hi: 'पीछे', en: 'Back' },
  skip: { hi: 'छोड़ें', en: 'Skip' },

  goalTitle: { hi: 'आप क्या चाहते हैं?', en: 'What do you want from this?' },
  goalHelp: { hi: 'बाद में बदल सकते हैं', en: 'You can change this later' },
  goal_flexibility: { hi: 'शरीर लचीला बनाना', en: 'Get more flexible' },
  goal_weightloss: { hi: 'वज़न कम करना', en: 'Lose weight' },
  goal_stress: { hi: 'तनाव कम करना, नींद अच्छी', en: 'Less stress, better sleep' },
  goal_back: { hi: 'कमर और posture ठीक करना', en: 'Fix my back and posture' },
  goal_energy: { hi: 'दिन की शुरुआत ऊर्जा से', en: 'Start the day with energy' },

  levelTitle: { hi: 'आपने पहले योग किया है?', en: 'Have you done yoga before?' },
  level_1: { hi: 'पहली बार कर रहा/रही हूँ', en: 'This is my first time' },
  level_2: { hi: 'थोड़ा-बहुत किया है', en: "I've done a little" },
  level_3: { hi: 'नियमित करता/करती हूँ', en: 'I practise regularly' },

  healthTitle: { hi: 'कुछ ज़रूरी बातें', en: 'A few important things' },
  healthHelp: {
    hi: 'जो लागू हो उस पर टैप करें। इनके हिसाब से हम असुरक्षित पोज़ हटा देंगे।',
    en: 'Tap whatever applies. We remove the poses that are unsafe for you.',
  },
  healthNone: { hi: 'इनमें से कुछ नहीं', en: 'None of these' },

  disclaimerTitle: { hi: 'पढ़ लें, फिर शुरू करें', en: 'Read this, then begin' },
  disclaimer: {
    hi: 'यह मेडिकल सलाह नहीं है। यह सामान्य फ़िटनेस के लिए है, किसी बीमारी का इलाज नहीं। हर पोज़ एक प्रमाणित योग थेरेपिस्ट ने जाँचा है। जिस पोज़ में दर्द हो, उसे तुरंत रोक दें। कोई चोट, बीमारी या गर्भावस्था हो तो पहले डॉक्टर से पूछें।',
    en: 'This is not medical advice. It is general fitness, not treatment for any condition. Every pose is reviewed by a certified yoga therapist. Stop any pose that hurts. If you have an injury, a medical condition or are pregnant, ask your doctor first.',
  },
  accept: { hi: 'समझ गया, शुरू करें', en: 'Understood, let’s start' },

  todaySession: { hi: 'आज का सेशन', en: "Today's session" },
  startSession: { hi: 'शुरू करें', en: 'Start session' },
  minutes: { hi: 'मिनट', en: 'min' },
  poses: { hi: 'पोज़', en: 'poses' },
  streak: { hi: 'दिन लगातार', en: 'day streak' },
  tomorrow: { hi: 'कल', en: 'Tomorrow' },
  removedNote: {
    hi: 'आपकी सेहत के हिसाब से {n} पोज़ हटाए गए',
    en: '{n} poses removed to match your health profile',
  },
  removedWhy: { hi: 'कौन-से और क्यों', en: 'Which ones, and why' },
  replacedWith: { hi: 'इसकी जगह', en: 'replaced with' },
  noReplacement: { hi: 'कोई विकल्प नहीं', en: 'no alternative' },
  reviewedBy: { hi: 'जाँचा गया', en: 'Reviewed by' },
  pendingReview: { hi: 'थेरेपिस्ट की जाँच बाकी है', en: 'Therapist review pending' },

  steps: { hi: 'कैसे करें', en: 'How to do it' },
  mistake: { hi: 'आम ग़लती', en: 'Common mistake' },
  easier: { hi: 'आसान तरीक़ा', en: 'Easier version' },
  benefit: { hi: 'फ़ायदा', en: 'Benefit' },
  avoidBox: { hi: 'यह पोज़ न करें अगर', en: 'Do NOT do this pose if' },
  cautionBox: { hi: 'आपके लिए सावधानी', en: 'Take care with this one' },
  perSide: { hi: 'दोनों तरफ़', en: 'Both sides' },

  stopIfPain: { hi: 'दर्द हो रहा है — रोकें', en: 'It hurts — stop' },
  next: { hi: 'अगला', en: 'Next' },
  prev: { hi: 'पिछला', en: 'Previous' },
  pause: { hi: 'रोकें', en: 'Pause' },
  resume: { hi: 'जारी रखें', en: 'Resume' },
  skipPose: { hi: 'यह पोज़ छोड़ें', en: 'Skip this pose' },
  quit: { hi: 'बाहर निकलें', en: 'Leave' },

  doneTitle: { hi: 'आज का सेशन पूरा', en: "Today's session is done" },
  doneStreak: { hi: 'लगातार {n} दिन', en: '{n} days in a row' },
  howWasIt: { hi: 'कैसा लगा?', en: 'How was that?' },
  felt_hard: { hi: 'मुश्किल', en: 'Hard' },
  felt_ok: { hi: 'ठीक', en: 'Okay' },
  felt_good: { hi: 'अच्छा', en: 'Good' },
  share: { hi: 'शेयर करें', en: 'Share' },
  home: { hi: 'होम', en: 'Home' },

  progress: { hi: 'प्रोगरेस', en: 'Progress' },
  thisWeek: { hi: 'इस हफ़्ते', en: 'This week' },
  totalMinutes: { hi: 'कुल मिनट', en: 'Total minutes' },
  longestStreak: { hi: 'सबसे लंबा streak', en: 'Longest streak' },
  sessionsDone: { hi: 'सेशन पूरे', en: 'Sessions done' },
  noSessionsYet: { hi: 'अभी कोई सेशन नहीं। आज पहला कर लें।', en: 'No sessions yet. Make today the first.' },

  library: { hi: 'सारे पोज़', en: 'All poses' },
  settings: { hi: 'सेटिंग', en: 'Settings' },
  editProfile: { hi: 'मेरी जानकारी बदलें', en: 'Edit my profile' },
  language: { hi: 'भाषा', en: 'Language' },
  deleteData: { hi: 'मेरा सारा डेटा मिटाएँ', en: 'Delete all my data' },
  deleteConfirm: {
    hi: 'सब कुछ मिट जाएगा — streak, सेशन, जानकारी। वापस नहीं आएगा।',
    en: 'Everything goes — streak, sessions, profile. This cannot be undone.',
  },
  dataLocal: {
    hi: 'आपका डेटा सिर्फ़ इस फ़ोन में है। कोई लॉगिन नहीं, कोई सर्वर नहीं।',
    en: 'Your data stays on this phone. No login, no server.',
  },
  difficulty: { hi: 'मुश्किल', en: 'Difficulty' },
  saferOption: { hi: 'सुरक्षित विकल्प', en: 'Safer option' },
  noContentTitle: {
    hi: 'अभी कोई सेशन नहीं बना',
    en: 'No session yet',
  },
  noContentBody: {
    hi: 'पोज़ अभी योग थेरेपिस्ट की जाँच में हैं। जाँच पूरी होते ही रोज़ का सेशन यहाँ आ जाएगा।',
    en: 'The poses are still with the yoga therapist for review. Your daily session appears here as soon as that is done.',
  },
  draftBanner: {
    hi: 'DRAFT कंटेंट — योग थेरेपिस्ट की जाँच बाकी है। अभी इसे असली सलाह न मानें।',
    en: 'DRAFT content — therapist review pending. Do not treat this as real guidance yet.',
  },
};

export function t(key: keyof typeof DICT, lang: Lang, vars?: Record<string, string | number>): string {
  let out = DICT[key]?.[lang] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
  }
  return out;
}

export const CONDITION_LABELS: Record<string, { hi: string; en: string }> = {
  pregnancy: { hi: 'गर्भावस्था', en: 'Pregnancy' },
  high_bp: { hi: 'हाई ब्लड प्रेशर', en: 'High blood pressure' },
  heart: { hi: 'दिल की बीमारी', en: 'Heart condition' },
  glaucoma: { hi: 'आँख का दबाव / ग्लूकोमा', en: 'Glaucoma' },
  hernia: { hi: 'हर्निया', en: 'Hernia' },
  recent_surgery: { hi: '6 महीने में सर्जरी', en: 'Surgery in last 6 months' },
  slipped_disc: { hi: 'स्लिप्ड डिस्क / साइटिका', en: 'Slipped disc / sciatica' },
  osteoporosis: { hi: 'हड्डी कमज़ोरी', en: 'Osteoporosis' },
  knee_arthritis: { hi: 'घुटने का दर्द', en: 'Knee pain / arthritis' },
  vertigo: { hi: 'चक्कर आना', en: 'Vertigo' },
  neck_injury: { hi: 'गर्दन की चोट / सर्वाइकल', en: 'Neck injury / cervical' },
  wrist_pain: { hi: 'कलाई का दर्द', en: 'Wrist pain' },
  shoulder_injury: { hi: 'कंधे की चोट', en: 'Shoulder injury' },
};
