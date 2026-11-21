import type { Condition, Pose, AvoidRule, UserLevel, ContentStatus } from './types.ts';

/**
 * Poses that carry no avoid rule at all. The engine must never be able to
 * return an empty session, so these are the guaranteed fallback: whatever a
 * user ticks on the health screen, these stay available.
 */
export const ALWAYS_SAFE = ['tadasana', 'shoulder-rolls', 'joint-rotations'];

export function maxDifficultyFor(level: UserLevel): 1 | 2 | 3 {
  return level;
}

/** Rules for this user that take the pose out of the plan entirely. */
export function avoidRulesFor(pose: Pose, conditions: Condition[]): AvoidRule[] {
  return pose.avoid.filter((r) => r.level === 'AVOID' && conditions.includes(r.condition));
}

/** Rules for this user that keep the pose but show a warning and a modification. */
export function cautionRulesFor(pose: Pose, conditions: Condition[]): AvoidRule[] {
  return pose.avoid.filter((r) => r.level === 'CAUTION' && conditions.includes(r.condition));
}

export function isUsable(pose: Pose, conditions: Condition[]): boolean {
  return avoidRulesFor(pose, conditions).length === 0;
}

export function statusOk(status: ContentStatus, allowDraft: boolean): boolean {
  return status === 'APPROVED' || allowDraft;
}

/**
 * Poses this user may be shown: approved content, within their level, with
 * every step written, and not AVOID for any condition they ticked.
 */
export function eligiblePoses(
  poses: Pose[],
  conditions: Condition[],
  level: UserLevel,
  allowDraft = false,
): Pose[] {
  const maxDifficulty = maxDifficultyFor(level);
  return poses.filter(
    (p) =>
      statusOk(p.status, allowDraft) &&
      p.steps !== null &&
      p.difficulty <= maxDifficulty &&
      isUsable(p, conditions),
  );
}

/**
 * The replacement named by the avoid rule, if that pose is itself usable for
 * this user. Returns null when there is nothing safe to swap in.
 */
export function resolveAlternative(
  rules: AvoidRule[],
  all: Pose[],
  conditions: Condition[],
  level: UserLevel,
  allowDraft = false,
  taken: Set<string> = new Set(),
): Pose | null {
  for (const rule of rules) {
    if (!rule.alternative) continue;
    const alt = all.find((p) => p.slug === rule.alternative);
    if (!alt || taken.has(alt.slug)) continue;
    if (
      statusOk(alt.status, allowDraft) &&
      alt.steps !== null &&
      alt.difficulty <= maxDifficultyFor(level) &&
      isUsable(alt, conditions)
    ) {
      return alt;
    }
  }
  return null;
}
