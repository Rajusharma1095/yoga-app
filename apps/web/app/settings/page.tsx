'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ALLOW_DRAFT_CONTENT, APPROVED_COUNT, POSES } from '@yoga/content';
import { CONDITION_LABELS, t } from '@/lib/i18n';
import { clearAll, saveProfile } from '@/lib/store';
import { useProfile } from '@/lib/useProfile';
import { Button, Pill } from '@/components/ui';

export default function SettingsPage() {
  const { profile, setProfile, loading } = useProfile();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (loading || !profile) {
    return <main className="grid min-h-dvh place-items-center"><p className="muted">…</p></main>;
  }
  // Captured after the guard above so the callbacks keep the non-null type.
  const current = profile;
  const { lang } = current;

  function switchLang() {
    const next = { ...current, lang: lang === 'hi' ? ('en' as const) : ('hi' as const) };
    saveProfile(next);
    setProfile(next);
  }

  function wipe() {
    clearAll();
    router.push('/');
    router.refresh();
  }

  return (
    <main lang={lang} className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('settings', lang)}</h1>
        <Link href="/" className="text-sm underline">{t('home', lang)}</Link>
      </header>

      <section className="card rounded-xl p-4">
        <p className="font-semibold">{t('editProfile', lang)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill>{t(`goal_${current.goal}` as 'goal_back', lang)}</Pill>
          <Pill>{t(`level_${current.level}` as 'level_1', lang)}</Pill>
        </div>
        {current.conditions.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm muted">
            {current.conditions.map((c) => (
              <li key={c}>• {CONDITION_LABELS[c]?.[lang] ?? c}</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-sm muted">
          {lang === 'hi'
            ? 'बदलने के लिए डेटा मिटाकर दोबारा शुरू करें (जल्द ही सीधे बदल पाएँगे)।'
            : 'To change these, clear your data and start again (direct editing coming soon).'}
        </p>
      </section>

      <div className="mt-4">
        <Button variant="ghost" onClick={switchLang}>
          {t('language', lang)}: {lang === 'hi' ? 'हिंदी → English' : 'English → हिंदी'}
        </Button>
      </div>

      <section className="mt-6 text-sm muted">
        <p>{t('dataLocal', lang)}</p>
        <p className="mt-2">
          {POSES.length} poses · {APPROVED_COUNT} approved
          {ALLOW_DRAFT_CONTENT ? ' · DRAFT content visible' : ''}
        </p>
      </section>

      <div className="mt-8">
        {confirming ? (
          <div className="rounded-xl border-2 border-warn-200 bg-warn-50 p-4">
            <p className="mb-3 text-slate-900">{t('deleteConfirm', lang)}</p>
            <div className="space-y-2">
              <Button variant="danger" onClick={wipe}>{t('deleteData', lang)}</Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>{t('back', lang)}</Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirming(true)}>{t('deleteData', lang)}</Button>
        )}
      </div>
    </main>
  );
}
