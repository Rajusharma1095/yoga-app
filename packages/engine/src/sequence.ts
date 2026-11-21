import type {
  BuildOptions, Pose, PoseCategory, RemovedNote, Session, SessionItem, Condition, UserLevel,
} from './types.ts';
import { GOAL_TAGS } from './types.ts';
import {
  ALWAYS_SAFE, avoidRulesFor, cautionRulesFor, eligiblePoses, maxDifficultyFor,
  resolveAlternative, statusOk,
} from './filter.ts';
import { mulberry32, seedFrom, shuffle } from './random.ts';

const CLOSING_SLUG = 'shavasana';
const BREATH_GOALS = new Set(['stress']);

interface Slot {
  category: PoseCategory;
  /** How many poses to try for. */
  want: number;
  /** How many of them must survive trimming. */
  keep: number;
}

function planFor(goal: string): Slot[] {
  return [
    { category: 'warmup', want: 2, keep: 1 },
    { category: 'standing', want: 3, keep: 1 },
    { category: 'floor', want: 3, keep: 1 },
    { category: 'core', want: 1, keep: 0 },
    { category: 'cooldown', want: 1, keep: 0 },
    // The breathing practice is the point of a stress session, so it is never
    // one of the picks that trimming is allowed to drop.
    { category: 'breath', want: BREATH_GOALS.has(goal) ? 1 : 0, keep: 1 },
  ];
}

function holdSeconds(pose: Pose): number {
  return pose.perSide ? pose.defaultSeconds * 2 : pose.defaultSeconds;
}

/**
 * Score decides which pose fills a slot. Goal match pulls a pose in, having
 * been used in the last few days pushes it out, and a seeded jitter keeps two
 * users with the same answers from getting an identical plan every day.
 */
function scorePose(pose: Pose, goalTags: string[], recent: Set<string>, rand: () => number): number {
  let score = rand();
  if (pose.goals.some((g) => goalTags.includes(g))) score += 2;
  if (recent.has(pose.slug)) score -= 3;
  return score;
}

/** AVOID poses that the user would otherwise have been eligible for. */
function removedFor(
  poses: Pose[], conditions: Condition[], level: UserLevel, allowDraft: boolean,
): { notes: RemovedNote[]; alternatives: Pose[] } {
  const notes: RemovedNote[] = [];
  const alternatives: Pose[] = [];
  const taken = new Set<string>();

  for (const pose of poses) {
    if (!statusOk(pose.status, allowDraft) || pose.steps === null) continue;
    if (pose.difficulty > maxDifficultyFor(level)) continue;
    const rules = avoidRulesFor(pose, conditions);
    if (rules.length === 0) continue;

    const alt = resolveAlternative(rules, poses, conditions, level, allowDraft, taken);
    if (alt) {
      taken.add(alt.slug);
      alternatives.push(alt);
    }
    notes.push({
      slug: pose.slug,
      nameHi: pose.name.hi,
      nameEn: pose.name.en,
      condition: rules[0].condition,
      reasonHi: rules[0].reasonHi,
      replacedWith: alt ? alt.slug : null,
    });
  }
  return { notes, alternatives };
}

/**
 * Build one day's session.
 *
 * Order is always warm-up, standing, floor, core, cool-down, breath, Shavasana,
 * so the body is warm before it is asked for anything and calm before the end.
 */
export function buildSession(options: BuildOptions): Session {
  const {
    poses, goal, level, conditions = [], targetSeconds = 600,
    recentSlugs = [], dateKey, allowDraft = false,
  } = options;

  const rand = mulberry32(seedFrom(`${dateKey}|${goal}|${level}|${conditions.slice().sort().join(',')}`));
  const goalTags = GOAL_TAGS[goal] ?? [goal];
  const recent = new Set(recentSlugs);

  const { notes: removed, alternatives } = removedFor(poses, conditions, level, allowDraft);

  // Alternatives named by avoid rules get a place in the pool even if the goal
  // would not have picked them, so a filtered plan is substituted not shortened.
  const pool = eligiblePoses(poses, conditions, level, allowDraft);
  const prioritised = new Set(alternatives.map((p) => p.slug));

  const byCategory = new Map<PoseCategory, Pose[]>();
  for (const pose of pool) {
    if (pose.slug === CLOSING_SLUG) continue;
    const list = byCategory.get(pose.category) ?? [];
    list.push(pose);
    byCategory.set(pose.category, list);
  }
  for (const [category, list] of byCategory) {
    const scored = shuffle(list, rand)
      .map((pose) => ({
        pose,
        score: scorePose(pose, goalTags, recent, rand) + (prioritised.has(pose.slug) ? 1.5 : 0),
      }))
      .sort((a, b) => b.score - a.score);
    byCategory.set(category, scored.map((s) => s.pose));
  }

  const chosen: { pose: Pose; optional: boolean }[] = [];
  for (const slot of planFor(goal)) {
    const available = byCategory.get(slot.category) ?? [];
    for (let i = 0; i < slot.want && i < available.length; i++) {
      chosen.push({ pose: available[i], optional: i >= slot.keep });
    }
  }

  // Shavasana closes every session, so its time is reserved before the body of
  // the plan is trimmed to fit.
  const closing = poses.find(
    (p) => p.slug === CLOSING_SLUG && statusOk(p.status, allowDraft) && p.steps !== null,
  );
  const closingSeconds = closing ? closing.defaultSeconds : 0;
  const budget = Math.max(targetSeconds - closingSeconds, 60);
  const total = () => chosen.reduce((sum, c) => sum + holdSeconds(c.pose), 0);

  // Too long: drop optional picks from the back.
  while (total() > Math.round(budget * 1.15)) {
    const index = chosen.map((c) => c.optional).lastIndexOf(true);
    if (index === -1) break;
    chosen.splice(index, 1);
  }

  // Too short (a level 1 user has a small pool): add more from the categories
  // that still have poses left, keeping the warm-up to floor order.
  const used = new Set(chosen.map((c) => c.pose.slug));
  const fillOrder: PoseCategory[] = ['warmup', 'standing', 'floor', 'cooldown'];
  let added = true;
  while (total() < Math.round(budget * 0.85) && added) {
    added = false;
    for (const category of fillOrder) {
      const next = (byCategory.get(category) ?? []).find((p) => !used.has(p.slug));
      if (!next) continue;
      let at = -1;
      for (let i = chosen.length - 1; i >= 0; i--) {
        if (chosen[i].pose.category === category) { at = i; break; }
      }
      chosen.splice(at === -1 ? chosen.length : at + 1, 0, { pose: next, optional: true });
      used.add(next.slug);
      added = true;
      if (total() >= Math.round(budget * 0.85)) break;
    }
  }

  const items: SessionItem[] = chosen.map(({ pose }) => ({
    pose,
    seconds: holdSeconds(pose),
    cautions: cautionRulesFor(pose, conditions),
  }));

  // If Shavasana is unavailable (content not approved yet) the session still
  // stands on the poses above.
  if (closing) {
    items.push({
      pose: closing,
      seconds: closing.defaultSeconds,
      cautions: cautionRulesFor(closing, conditions),
    });
  }

  // A session is never empty. If filtering left nothing, fall back to the poses
  // that carry no avoid rule at all.
  if (items.length === 0) {
    for (const slug of ALWAYS_SAFE) {
      const pose = poses.find(
        (p) => p.slug === slug && statusOk(p.status, allowDraft) && p.steps !== null,
      );
      if (pose) {
        items.push({ pose, seconds: holdSeconds(pose), cautions: cautionRulesFor(pose, conditions) });
      }
    }
  }

  return {
    dateKey,
    items,
    totalSeconds: items.reduce((sum, item) => sum + item.seconds, 0),
    removed,
    goal,
    level,
  };
}
