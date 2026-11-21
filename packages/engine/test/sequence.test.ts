import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSession, ALL_CONDITIONS, ALWAYS_SAFE } from '../src/index.ts';
import type { Condition, Pose, Session } from '../src/types.ts';

const poses: Pose[] = JSON.parse(
  readFileSync(new URL('../../../content/poses.json', import.meta.url), 'utf8'),
).poses;

// Content is still DRAFT until the yoga therapist approves it, so every test
// runs with allowDraft. Flip this off once statuses are APPROVED and the suite
// should still pass.
const build = (over: Partial<Parameters<typeof buildSession>[0]> = {}): Session =>
  buildSession({
    poses, goal: 'back', level: 2, dateKey: '2026-11-21', allowDraft: true, ...over,
  });

const slugs = (s: Session) => s.items.map((i) => i.pose.slug);

test('content file loads with all 40 poses', () => {
  assert.equal(poses.length, 40);
  assert.ok(poses.every((p) => p.steps && p.steps.hi.length > 0));
});

test('builds a session close to ten minutes', () => {
  const session = build();
  assert.ok(session.items.length >= 6, `got ${session.items.length} poses`);
  assert.ok(session.totalSeconds >= 480 && session.totalSeconds <= 780,
    `got ${session.totalSeconds}s`);
});

test('same day and same answers give the same session', () => {
  assert.deepEqual(slugs(build()), slugs(build()));
});

test('a different day gives a different session', () => {
  const a = slugs(build({ dateKey: '2026-11-21' }));
  const b = slugs(build({ dateKey: '2026-11-22' }));
  assert.notDeepEqual(a, b);
});

test('poses run warm-up first and Shavasana last', () => {
  const session = build();
  assert.equal(session.items.at(-1)!.pose.slug, 'shavasana');
  const order = ['warmup', 'standing', 'floor', 'core', 'cooldown', 'breath'];
  const body = session.items.slice(0, -1).map((i) => order.indexOf(i.pose.category));
  assert.deepEqual(body, body.slice().sort((x, y) => x - y), 'categories out of order');
});

test('a level 1 user is never given a harder pose', () => {
  const session = build({ level: 1 });
  assert.ok(session.items.every((i) => i.pose.difficulty === 1));
});

// The safety invariant. If this ever fails, the app is unsafe to ship.
test('no AVOID pose reaches the plan, for any single condition', () => {
  for (const condition of ALL_CONDITIONS) {
    const session = build({ conditions: [condition], level: 3 });
    for (const item of session.items) {
      const banned = item.pose.avoid.some(
        (r) => r.level === 'AVOID' && r.condition === condition,
      );
      assert.ok(!banned, `${item.pose.slug} is AVOID for ${condition} but was planned`);
    }
  }
});

test('no AVOID pose reaches the plan when every condition is ticked', () => {
  const session = build({ conditions: ALL_CONDITIONS, level: 3 });
  for (const item of session.items) {
    for (const rule of item.pose.avoid) {
      assert.notEqual(rule.level, 'AVOID', `${item.pose.slug} planned despite ${rule.condition}`);
    }
  }
});

test('pregnancy removes every belly-down pose', () => {
  const session = build({ conditions: ['pregnancy'], level: 3 });
  for (const slug of ['bhujangasana', 'salabhasana', 'dhanurasana', 'navasana']) {
    assert.ok(!slugs(session).includes(slug), `${slug} should be removed in pregnancy`);
  }
});

test('high blood pressure removes the deep backbends', () => {
  const session = build({ conditions: ['high_bp'], level: 3 });
  assert.ok(!slugs(session).includes('ustrasana'));
  assert.ok(!slugs(session).includes('dhanurasana'));
});

test('glaucoma removes the head-below-heart poses', () => {
  const session = build({ conditions: ['glaucoma'], level: 3 });
  for (const slug of ['downward-dog', 'uttanasana', 'prasarita', 'viparita-karani']) {
    assert.ok(!slugs(session).includes(slug), `${slug} should be removed for glaucoma`);
  }
});

test('the session is never empty, whatever the user ticks', () => {
  for (const level of [1, 2, 3] as const) {
    const session = build({ conditions: ALL_CONDITIONS, level });
    assert.ok(session.items.length > 0, `empty session at level ${level}`);
  }
});

test('the always-safe poses survive every condition', () => {
  for (const slug of ALWAYS_SAFE) {
    const pose = poses.find((p) => p.slug === slug)!;
    assert.ok(pose, `${slug} missing from content`);
    assert.equal(pose.avoid.length, 0, `${slug} must carry no avoid rules`);
  }
});

test('removed poses are reported with a reason', () => {
  const session = build({ conditions: ['pregnancy'], level: 3 });
  assert.ok(session.removed.length > 0);
  for (const note of session.removed) {
    assert.ok(note.reasonHi.length > 0, `${note.slug} has no reason`);
    assert.ok(note.nameHi.length > 0);
  }
});

test('a substituted alternative is itself safe for the user', () => {
  const conditions: Condition[] = ['pregnancy', 'high_bp'];
  const session = build({ conditions, level: 3 });
  for (const note of session.removed) {
    if (!note.replacedWith) continue;
    const alt = poses.find((p) => p.slug === note.replacedWith)!;
    assert.ok(alt, `alternative ${note.replacedWith} not in content`);
    const banned = alt.avoid.some(
      (r) => r.level === 'AVOID' && conditions.includes(r.condition),
    );
    assert.ok(!banned, `${alt.slug} was offered as an alternative but is itself AVOID`);
  }
});

test('CAUTION poses stay in the plan and carry their warning', () => {
  const session = build({ conditions: ['knee_arthritis'], level: 3 });
  const withCaution = session.items.filter((i) => i.cautions.length > 0);
  assert.ok(withCaution.length > 0, 'expected at least one caution note');
  for (const item of withCaution) {
    assert.ok(item.cautions.every((c) => c.level === 'CAUTION'));
  }
});

test('poses used in the last few days are avoided', () => {
  const first = slugs(build({ dateKey: '2026-12-01' }));
  const second = slugs(build({ dateKey: '2026-12-02', recentSlugs: first }));
  const repeats = second.filter((s) => s !== 'shavasana' && first.includes(s));
  assert.ok(repeats.length <= 2, `too many repeats: ${repeats.join(', ')}`);
});

test('a stress session includes the breathing practice', () => {
  const session = build({ goal: 'stress', level: 2 });
  assert.ok(slugs(session).includes('anulom-vilom'));
});

test('per-side poses are given double the hold time', () => {
  const session = build({ level: 3 });
  for (const item of session.items) {
    const expected = item.pose.perSide
      ? item.pose.defaultSeconds * 2
      : item.pose.defaultSeconds;
    assert.equal(item.seconds, expected, `${item.pose.slug} hold time wrong`);
  }
});

test('nothing unapproved leaks out once DRAFT content is refused', () => {
  const session = buildSession({
    poses, goal: 'back', level: 2, dateKey: '2026-11-21', allowDraft: false,
  });
  assert.equal(session.items.length, 0, 'DRAFT content must not render in production');
  assert.equal(session.removed.length, 0);
});
