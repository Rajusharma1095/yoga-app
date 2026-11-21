'use client';

import { useState } from 'react';
import { ALL_CONDITIONS, type Condition, type Goal, type UserLevel } from '@yoga/engine';
import { CONDITION_LABELS, t, type Lang } from '@/lib/i18n';
import { dateKey, saveProfile, type Profile } from '@/lib/store';
import { Button, Choice } from './ui';

const GOALS: Goal[] = ['back', 'flexibility', 'stress', 'weightloss', 'energy'];
const LEVELS: UserLevel[] = [1, 2, 3];

type Step = 'lang' | 'goal' | 'level' | 'health' | 'disclaimer';
const STEPS: Step[] = ['lang', 'goal', 'level', 'health', 'disclaimer'];

export function Onboarding({ onDone }: { onDone: (profile: Profile) => void }) {
  const [step, setStep] = useState<Step>('lang');
  const [lang, setLang] = useState<Lang>('hi');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [noneTicked, setNoneTicked] = useState(false);

  const index = STEPS.indexOf(step);
  const go = (next: Step) => setStep(next);

  function toggleCondition(condition: Condition) {
    setNoneTicked(false);
    setConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  }

  function finish() {
    if (!goal || !level) return;
    const profile: Profile = {
      lang, goal, level, conditions,
      acceptedDisclaimerAt: new Date().toISOString(),
      createdAt: dateKey(),
    };
    saveProfile(profile);
    onDone(profile);
  }

  return (
    <main lang={lang} className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-6">
      <div className="mb-6 flex gap-1.5" role="progressbar" aria-valuenow={index + 1} aria-valuemax={STEPS.length}>
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-calm-600' : 'bg-[var(--border)]'}`}
          />
        ))}
      </div>

      {step === 'lang' && (
        <>
          <h1 className="text-3xl font-bold">{t('appName', lang)}</h1>
          <p className="mt-2 mb-8 muted">{t('tagline', lang)}</p>
          <h2 className="mb-3 font-semibold">{t('chooseLang', lang)}</h2>
          <div className="space-y-3">
            <Choice selected={lang === 'hi'} onClick={() => setLang('hi')}>
              <span lang="hi">हिंदी</span>
            </Choice>
            <Choice selected={lang === 'en'} onClick={() => setLang('en')}>
              English
            </Choice>
          </div>
          <div className="mt-auto pt-8">
            <Button onClick={() => go('goal')}>{t('continue', lang)}</Button>
          </div>
        </>
      )}

      {step === 'goal' && (
        <>
          <h1 className="text-2xl font-bold">{t('goalTitle', lang)}</h1>
          <p className="mt-1 mb-6 text-sm muted">{t('goalHelp', lang)}</p>
          <div className="space-y-3">
            {GOALS.map((g) => (
              <Choice key={g} selected={goal === g} onClick={() => setGoal(g)}>
                {t(`goal_${g}` as 'goal_back', lang)}
              </Choice>
            ))}
          </div>
          <div className="mt-auto space-y-2 pt-8">
            <Button onClick={() => go('level')} disabled={!goal}>{t('continue', lang)}</Button>
            <Button variant="ghost" onClick={() => go('lang')}>{t('back', lang)}</Button>
          </div>
        </>
      )}

      {step === 'level' && (
        <>
          <h1 className="mb-6 text-2xl font-bold">{t('levelTitle', lang)}</h1>
          <div className="space-y-3">
            {LEVELS.map((l) => (
              <Choice key={l} selected={level === l} onClick={() => setLevel(l)}>
                {t(`level_${l}` as 'level_1', lang)}
              </Choice>
            ))}
          </div>
          <div className="mt-auto space-y-2 pt-8">
            <Button onClick={() => go('health')} disabled={!level}>{t('continue', lang)}</Button>
            <Button variant="ghost" onClick={() => go('goal')}>{t('back', lang)}</Button>
          </div>
        </>
      )}

      {step === 'health' && (
        <>
          <h1 className="text-2xl font-bold">{t('healthTitle', lang)}</h1>
          <p className="mt-1 mb-6 text-sm muted">{t('healthHelp', lang)}</p>
          <div className="space-y-2">
            <Choice
              selected={noneTicked}
              onClick={() => { setNoneTicked(true); setConditions([]); }}
            >
              {t('healthNone', lang)}
            </Choice>
            <div className="my-3 h-px bg-[var(--border)]" />
            {ALL_CONDITIONS.map((c) => (
              <Choice key={c} selected={conditions.includes(c)} onClick={() => toggleCondition(c)}>
                {CONDITION_LABELS[c][lang]}
              </Choice>
            ))}
          </div>
          <div className="mt-auto space-y-2 pt-8">
            <Button onClick={() => go('disclaimer')} disabled={!noneTicked && conditions.length === 0}>
              {t('continue', lang)}
            </Button>
            <Button variant="ghost" onClick={() => go('level')}>{t('back', lang)}</Button>
          </div>
        </>
      )}

      {step === 'disclaimer' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">{t('disclaimerTitle', lang)}</h1>
          <div className="card rounded-xl p-4 leading-relaxed">{t('disclaimer', lang)}</div>
          <p className="mt-4 text-sm muted">{t('dataLocal', lang)}</p>
          <div className="mt-auto space-y-2 pt-8">
            <Button onClick={finish}>{t('accept', lang)}</Button>
            <Button variant="ghost" onClick={() => go('health')}>{t('back', lang)}</Button>
          </div>
        </>
      )}
    </main>
  );
}
