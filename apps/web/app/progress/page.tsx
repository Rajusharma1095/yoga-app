'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { t } from '@/lib/i18n';
import {
  currentStreak, dateKey, getLogs, longestStreak, shiftDays, weekStats,
} from '@/lib/store';
import { useProfile } from '@/lib/useProfile';

export default function ProgressPage() {
  const { profile, loading } = useProfile();
  const today = dateKey();

  const stats = useMemo(() => {
    const logs = getLogs();
    const done = new Set(logs.filter((l) => l.completed).map((l) => l.date));
    return {
      logs,
      done,
      streak: currentStreak(logs, today),
      longest: longestStreak(logs),
      week: weekStats(logs, today),
      totalMinutes: Math.round(
        logs.filter((l) => l.completed).reduce((sum, l) => sum + l.seconds, 0) / 60,
      ),
      sessions: logs.filter((l) => l.completed).length,
    };
  }, [today]);

  if (loading || !profile) {
    return <main className="grid min-h-dvh place-items-center"><p className="muted">…</p></main>;
  }
  const { lang } = profile;

  // Last 28 days, oldest first, as a calendar grid.
  const days = Array.from({ length: 28 }, (_, i) => shiftDays(today, -(27 - i)));

  return (
    <main lang={lang} className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('progress', lang)}</h1>
        <Link href="/" className="text-sm underline">{t('home', lang)}</Link>
      </header>

      {stats.sessions === 0 ? (
        <p className="card rounded-xl p-5 text-center muted">{t('noSessionsYet', lang)}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label={`🔥 ${t('streak', lang)}`} value={stats.streak} />
            <Stat label={t('longestStreak', lang)} value={stats.longest} />
            <Stat label={t('sessionsDone', lang)} value={stats.sessions} />
            <Stat label={t('totalMinutes', lang)} value={stats.totalMinutes} />
          </div>

          <h2 className="mt-7 mb-3 font-semibold">{t('thisWeek', lang)}</h2>
          <p className="muted">
            {stats.week.sessions} {t('sessionsDone', lang)} · {stats.week.minutes} {t('minutes', lang)}
          </p>

          <div className="mt-6 grid grid-cols-7 gap-1.5" aria-label="last 28 days">
            {days.map((day) => (
              <div
                key={day}
                title={day}
                className={`aspect-square rounded-md border ${
                  stats.done.has(day)
                    ? 'border-calm-600 bg-calm-500'
                    : 'border-[var(--border)] bg-[var(--card)]'
                } ${day === today ? 'ring-2 ring-calm-700' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card rounded-xl p-4">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm muted">{label}</p>
    </div>
  );
}
