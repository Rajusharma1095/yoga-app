'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { visiblePoses } from '@yoga/content';
import { avoidRulesFor } from '@yoga/engine';
import { t } from '@/lib/i18n';
import { useProfile } from '@/lib/useProfile';

export default function PosesPage() {
  const { profile, loading } = useProfile();
  const [query, setQuery] = useState('');
  const poses = useMemo(() => visiblePoses(), []);

  if (loading) return <main className="grid min-h-dvh place-items-center"><p className="muted">…</p></main>;
  const lang = profile?.lang ?? 'hi';
  const conditions = profile?.conditions ?? [];

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? poses.filter((p) =>
        [p.name.en, p.name.hi, p.name.sa, p.slug].some((n) => n.toLowerCase().includes(needle)),
      )
    : poses;

  return (
    <main lang={lang} className="mx-auto max-w-md px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('library', lang)}</h1>
        <Link href="/" className="text-sm underline">{t('home', lang)}</Link>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lang === 'hi' ? 'पोज़ खोजें' : 'Search poses'}
        className="tap mb-4 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
      />

      <ul className="space-y-2">
        {shown.map((pose) => {
          const unsafe = avoidRulesFor(pose, conditions).length > 0;
          return (
            <li key={pose.slug}>
              <Link
                href={`/poses/${pose.slug}`}
                className="card tap flex items-center gap-3 rounded-xl px-4 py-3 hover:border-calm-400"
              >
                <span className="w-7 shrink-0 text-sm muted">{pose.id}</span>
                <span className="flex-1">
                  <span className="block font-medium">
                    {lang === 'hi' ? pose.name.hi : pose.name.en}
                  </span>
                  <span className="block text-sm muted">
                    {pose.name.sa} · {t('difficulty', lang)} {pose.difficulty}
                  </span>
                </span>
                {unsafe && (
                  <span className="text-warn-600" title={lang === 'hi' ? 'आपके लिए नहीं' : 'Not for you'}>
                    🔴
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="mt-6 text-center muted">—</p>}
    </main>
  );
}
