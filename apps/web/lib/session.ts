'use client';

import { buildSession, type Session } from '@yoga/engine';
import { ALLOW_DRAFT_CONTENT, POSES } from '@yoga/content';
import { dateKey, getLogs, recentSlugs, shiftDays, type Profile } from './store.ts';

/**
 * Today's session. The date seeds the engine, so the plan is the same on every
 * reload and the user cannot reroll for an easier day.
 */
export function sessionFor(profile: Profile, day: string = dateKey()): Session {
  return buildSession({
    poses: POSES,
    goal: profile.goal,
    level: profile.level,
    conditions: profile.conditions,
    dateKey: day,
    recentSlugs: recentSlugs(getLogs(), 3, day),
    allowDraft: ALLOW_DRAFT_CONTENT,
  });
}

/** Shown on the home screen as a nudge for what's coming. */
export function tomorrowPreview(profile: Profile, day: string = dateKey()): Session {
  return sessionFor(profile, shiftDays(day, 1));
}
