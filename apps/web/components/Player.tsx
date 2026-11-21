'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@yoga/engine';
import { CONDITION_LABELS, t } from '@/lib/i18n';
import { currentStreak, dateKey, getLogs, saveLog, type Profile, type SessionLog } from '@/lib/store';
import { sessionFor } from '@/lib/session';
import { AvoidBox, Button } from './ui';

type Phase = 'playing' | 'done';

export function Player({ profile }: { profile: Profile }) {
  const { lang } = profile;
  const today = dateKey();
  const session: Session = useMemo(() => sessionFor(profile, today), [profile, today]);

  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(session.items[0]?.seconds ?? 0);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>(session.items.length > 0 ? 'playing' : 'done');
  const [skipped, setSkipped] = useState<string[]>([]);
  const [felt, setFelt] = useState<SessionLog['felt']>();

  const item = session.items[index];
  const isLast = index >= session.items.length - 1;

  const finish = useCallback(
    (completed: boolean, usedSkipped: string[]) => {
      saveLog({
        date: today,
        slugs: session.items.map((i) => i.pose.slug),
        skipped: usedSkipped,
        completed,
        seconds: session.totalSeconds,
      });
      setPhase('done');
    },
    [session, today],
  );

  const advance = useCallback(() => {
    if (isLast) {
      finish(true, skipped);
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast, finish, skipped]);

  // Hold time for the slot the user just moved to.
  useEffect(() => {
    if (phase !== 'playing') return;
    setRemaining(session.items[index]?.seconds ?? 0);
  }, [index, phase, session.items]);

  useEffect(() => {
    if (phase !== 'playing' || paused) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        advance();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paused, advance]);

  // Phones lock mid-pose with your hands on the mat. Not available everywhere,
  // and it throws when the tab is hidden, so every call is guarded.
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    if (phase !== 'playing') return;
    let released = false;
    const request = async () => {
      try {
        wakeLock.current = await navigator.wakeLock?.request('screen');
      } catch {
        // No wake lock on this browser. The timer still runs.
      }
    };
    void request();
    return () => {
      released = true;
      void wakeLock.current?.release().catch(() => {});
      if (released) wakeLock.current = null;
    };
  }, [phase]);

  function skipCurrent(hurt: boolean) {
    if (item) setSkipped((s) => [...s, item.pose.slug]);
    if (hurt && isLast) {
      finish(true, item ? [...skipped, item.pose.slug] : skipped);
      return;
    }
    advance();
  }

  if (phase === 'done') {
    return <Done profile={profile} session={session} felt={felt} setFelt={setFelt} skipped={skipped} />;
  }

  if (!item) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 text-center">
        <p>{t('pendingReview', lang)}</p>
        <div className="mt-6"><Button variant="ghost"><Link href="/">{t('home', lang)}</Link></Button></div>
      </main>
    );
  }

  const pose = item.pose;
  const progress = ((index + 1) / session.items.length) * 100;

  return (
    <main lang={lang} className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-4">
      <div className="mb-3 flex items-center justify-between text-sm muted">
        <Link href="/" className="underline">{t('quit', lang)}</Link>
        <span>{index + 1} / {session.items.length}</span>
      </div>
      <div className="mb-4 h-1.5 w-full rounded-full bg-[var(--border)]">
        <div className="h-1.5 rounded-full bg-calm-600 transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Pose clip goes here once the shoot is done — poses.csv.clip_url. */}
      <div className="card grid aspect-[4/5] max-h-[40dvh] w-full place-items-center rounded-2xl text-center">
        {pose.clipUrl ? (
          <video src={pose.clipUrl} autoPlay loop muted playsInline className="size-full rounded-2xl object-cover" />
        ) : (
          <div className="p-6">
            <p className="text-4xl" aria-hidden>🧘</p>
            <p className="mt-2 text-sm muted">clip pending · {pose.shootBlock}{pose.id}</p>
          </div>
        )}
      </div>

      <h1 className="mt-4 text-2xl font-bold">
        {lang === 'hi' ? pose.name.hi : pose.name.en}
      </h1>
      <p className="text-sm muted">{pose.name.sa}{pose.perSide ? ` · ${t('perSide', lang)}` : ''}</p>

      <p className="my-3 text-center text-5xl font-bold tabular-nums" aria-live="off">
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </p>

      {item.cautions.length > 0 && (
        <div className="mb-3">
          <AvoidBox title={t('cautionBox', lang)}>
            <ul className="space-y-1 text-sm">
              {item.cautions.map((c) => (
                <li key={c.condition}>
                  <strong>{CONDITION_LABELS[c.condition]?.[lang] ?? c.condition}:</strong>{' '}
                  <span lang="hi">{c.reasonHi}</span>
                </li>
              ))}
            </ul>
          </AvoidBox>
        </div>
      )}

      {pose.steps && (
        <ol className="mb-4 space-y-1.5 text-[15px]">
          {(lang === 'hi' ? pose.steps.hi : pose.steps.en).map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 muted">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-auto space-y-2 pt-4">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} className="flex-1">
            {t('prev', lang)}
          </Button>
          <Button variant="ghost" onClick={() => setPaused((p) => !p)} className="flex-1">
            {paused ? t('resume', lang) : t('pause', lang)}
          </Button>
          <Button onClick={advance} className="flex-1">{t('next', lang)}</Button>
        </div>
        {/* The stop button is always the biggest thing on screen after the timer.
            Tapping it is also data: a pose many users stop on goes back to the
            therapist. */}
        <Button variant="danger" onClick={() => skipCurrent(true)}>
          🛑 {t('stopIfPain', lang)}
        </Button>
      </div>
    </main>
  );
}

function Done({
  profile, session, felt, setFelt, skipped,
}: {
  profile: Profile;
  session: Session;
  felt: SessionLog['felt'];
  setFelt: (f: SessionLog['felt']) => void;
  skipped: string[];
}) {
  const { lang } = profile;
  const today = dateKey();
  const streak = currentStreak(getLogs(), today);
  const minutes = Math.round(session.totalSeconds / 60);

  function record(value: NonNullable<SessionLog['felt']>) {
    setFelt(value);
    saveLog({
      date: today,
      slugs: session.items.map((i) => i.pose.slug),
      skipped,
      completed: true,
      seconds: session.totalSeconds,
      felt: value,
    });
  }

  async function share() {
    const text =
      lang === 'hi'
        ? `मैंने ${streak} दिन लगातार योग किया 🔥 रोज़ 10 मिनट।`
        : `${streak} days of yoga in a row 🔥 Ten minutes a day.`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // User dismissed the share sheet, or neither API is available.
    }
  }

  return (
    <main lang={lang} className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-4 py-10 text-center">
      <p className="text-6xl" aria-hidden>✅</p>
      <h1 className="mt-4 text-2xl font-bold">{t('doneTitle', lang)}</h1>
      {streak > 0 && <p className="mt-2 text-lg">🔥 {t('doneStreak', lang, { n: streak })}</p>}
      <p className="mt-1 muted">{minutes} {t('minutes', lang)} · {session.items.length} {t('poses', lang)}</p>

      <p className="mt-8 mb-3 font-semibold">{t('howWasIt', lang)}</p>
      <div className="flex w-full gap-2">
        {(['hard', 'ok', 'good'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => record(f)}
            aria-pressed={felt === f}
            className={`tap flex-1 rounded-xl border-2 px-3 py-3 font-medium ${
              felt === f ? 'border-calm-600 bg-calm-50 text-calm-900' : 'card'
            }`}
          >
            {f === 'hard' ? '😣' : f === 'ok' ? '😐' : '🙂'}
            <span className="mt-1 block text-sm">{t(`felt_${f}` as 'felt_ok', lang)}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto w-full space-y-2 pt-10">
        <Button onClick={share}>{t('share', lang)}</Button>
        <Button variant="ghost"><Link href="/" className="block">{t('home', lang)}</Link></Button>
      </div>
    </main>
  );
}
