'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { APPROVED_COUNT, ALLOW_DRAFT_CONTENT } from '@yoga/content';
import { t } from '@/lib/i18n';
import { currentStreak, dateKey, getLogs, type Profile } from '@/lib/store';
import { sessionFor, tomorrowPreview } from '@/lib/session';
import { Button, Pill } from './ui';
import { RemovedNotice } from './RemovedNotice';

export function Home({ profile }: { profile: Profile }) {
  const { lang } = profile;
  const today = dateKey();

  const { session, tomorrow, streak, doneToday } = useMemo(() => {
    const logs = getLogs();
    return {
      session: sessionFor(profile, today),
      tomorrow: tomorrowPreview(profile, today),
      streak: currentStreak(logs, today),
      doneToday: logs.some((l) => l.date === today && l.completed),
    };
  }, [profile, today]);

  const minutes = Math.round(session.totalSeconds / 60);

  return (
    <main lang={lang} className="mx-auto max-w-md px-4 py-6">
      {ALLOW_DRAFT_CONTENT && (
        <p className="mb-4 rounded-lg border-2 border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">
          {t('draftBanner', lang)}
        </p>
      )}

      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('appName', lang)}</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/progress" className="underline">{t('progress', lang)}</Link>
          <Link href="/poses" className="underline">{t('library', lang)}</Link>
          <Link href="/settings" aria-label={t('settings', lang)}>⚙️</Link>
        </nav>
      </header>

      {streak > 0 && (
        <p className="mb-5 text-lg font-semibold">
          🔥 {streak} {t('streak', lang)}
        </p>
      )}

      {session.items.length === 0 ? (
        <section className="card rounded-2xl p-5">
          <p className="text-4xl" aria-hidden>🧘</p>
          <p className="mt-3 text-lg font-semibold">{t('noContentTitle', lang)}</p>
          <p className="mt-2 muted">{t('noContentBody', lang)}</p>
          <Link href="/poses" className="mt-4 inline-block underline">
            {t('library', lang)} →
          </Link>
        </section>
      ) : (
      <section className="card rounded-2xl p-5">
        <p className="text-sm font-medium uppercase tracking-wide muted">
          {t('todaySession', lang)}
        </p>
        <p className="mt-1 text-2xl font-bold">
          {minutes} {t('minutes', lang)} · {session.items.length} {t('poses', lang)}
        </p>

        {session.removed.length > 0 && (
          <div className="mt-4">
            <RemovedNotice session={session} lang={lang} />
          </div>
        )}

        <ol className="mt-4 space-y-2">
          {session.items.map((item, i) => (
            <li key={`${item.pose.slug}-${i}`} className="flex items-baseline gap-2">
              <span className="w-5 shrink-0 text-sm muted">{i + 1}.</span>
              <span className="flex-1">
                {lang === 'hi' ? item.pose.name.hi : item.pose.name.en}
                {item.cautions.length > 0 && (
                  <span className="ml-1 text-warn-600" title={item.cautions[0].reasonHi}>⚠</span>
                )}
              </span>
              <span className="text-sm muted">{item.seconds}s</span>
            </li>
          ))}
        </ol>

        <div className="mt-5">
          <Button>
            <Link href="/session" className="block">
              {doneToday ? '✓ ' : '▶ '}{t('startSession', lang)}
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-xs muted">
          {APPROVED_COUNT > 0
            ? `${t('reviewedBy', lang)}: ${APPROVED_COUNT} poses approved`
            : t('pendingReview', lang)}
        </p>
      </section>
      )}

      {session.items.length > 0 && (
      <p className="mt-5 text-sm muted">
        {t('tomorrow', lang)}: {Math.round(tomorrow.totalSeconds / 60)} {t('minutes', lang)} ·{' '}
        {tomorrow.items
          .slice(0, 3)
          .map((i) => (lang === 'hi' ? i.pose.name.hi : i.pose.name.en))
          .join(', ')}
        …
      </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Pill>{t(`goal_${profile.goal}` as 'goal_back', lang)}</Pill>
        <Pill>{t(`level_${profile.level}` as 'level_1', lang)}</Pill>
        {profile.conditions.length > 0 && <Pill>{profile.conditions.length} conditions</Pill>}
      </div>
    </main>
  );
}
