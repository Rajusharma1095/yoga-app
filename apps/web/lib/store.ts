'use client';

import type { Condition, Goal, UserLevel } from '@yoga/engine';
import type { Lang } from './i18n.ts';

const PROFILE_KEY = 'yoga.profile.v1';
const LOG_KEY = 'yoga.sessions.v1';

export interface Profile {
  lang: Lang;
  goal: Goal;
  level: UserLevel;
  conditions: Condition[];
  acceptedDisclaimerAt: string;
  createdAt: string;
}

export interface SessionLog {
  /** Local date, YYYY-MM-DD. */
  date: string;
  slugs: string[];
  /** Poses the user tapped "it hurts" or "skip" on — worth reviewing with the therapist. */
  skipped: string[];
  completed: boolean;
  seconds: number;
  felt?: 'hard' | 'ok' | 'good';
}

/**
 * Every read is wrapped: localStorage throws in private windows and comes back
 * empty when site data is cleared, so the app has to render without it.
 */
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked. The session still works for this visit.
  }
}

export function getProfile(): Profile | null {
  return read<Profile | null>(PROFILE_KEY, null);
}

export function saveProfile(profile: Profile): void {
  write(PROFILE_KEY, profile);
}

export function getLogs(): SessionLog[] {
  return read<SessionLog[]>(LOG_KEY, []);
}

export function saveLog(log: SessionLog): void {
  const logs = getLogs().filter((l) => l.date !== log.date);
  logs.push(log);
  logs.sort((a, b) => a.date.localeCompare(b.date));
  write(LOG_KEY, logs);
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(LOG_KEY);
  } catch {
    // Nothing to do — the data was unreachable anyway.
  }
}

/** Local date key, not UTC: a session at 11pm belongs to that day. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function shiftDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

/**
 * Current streak: consecutive completed days counting back from today. A
 * session done yesterday but not yet today keeps the streak alive — the user
 * has the rest of today to practise.
 */
export function currentStreak(logs: SessionLog[], today = dateKey()): number {
  const done = new Set(logs.filter((l) => l.completed).map((l) => l.date));
  let cursor = done.has(today) ? today : shiftDays(today, -1);
  if (!done.has(cursor)) return 0;
  let streak = 0;
  while (done.has(cursor)) {
    streak++;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(logs: SessionLog[]): number {
  const dates = logs.filter((l) => l.completed).map((l) => l.date).sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of dates) {
    run = previous && shiftDays(previous, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }
  return best;
}

/** Slugs used in the last `days` days, so the engine can keep sessions fresh. */
export function recentSlugs(logs: SessionLog[], days = 3, today = dateKey()): string[] {
  const window = new Set(
    Array.from({ length: days }, (_, i) => shiftDays(today, -(i + 1))),
  );
  return logs.filter((l) => window.has(l.date)).flatMap((l) => l.slugs);
}

export function weekStats(logs: SessionLog[], today = dateKey()) {
  const week = new Set(Array.from({ length: 7 }, (_, i) => shiftDays(today, -i)));
  const mine = logs.filter((l) => l.completed && week.has(l.date));
  return {
    sessions: mine.length,
    minutes: Math.round(mine.reduce((sum, l) => sum + l.seconds, 0) / 60),
  };
}
