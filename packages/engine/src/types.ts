/** Health conditions a user can tick on the health screen. */
export type Condition =
  | 'pregnancy' | 'high_bp' | 'heart' | 'glaucoma' | 'hernia'
  | 'recent_surgery' | 'slipped_disc' | 'osteoporosis' | 'knee_arthritis'
  | 'vertigo' | 'neck_injury' | 'wrist_pain' | 'shoulder_injury';

export const ALL_CONDITIONS: Condition[] = [
  'pregnancy', 'high_bp', 'heart', 'glaucoma', 'hernia', 'recent_surgery',
  'slipped_disc', 'osteoporosis', 'knee_arthritis', 'vertigo', 'neck_injury',
  'wrist_pain', 'shoulder_injury',
];

/** What the user picks on the goal screen. */
export type Goal = 'flexibility' | 'weightloss' | 'stress' | 'back' | 'energy';

/** Goal tags on poses that each user goal should pull from. */
export const GOAL_TAGS: Record<Goal, string[]> = {
  flexibility: ['flexibility', 'hip'],
  weightloss: ['weightloss', 'core'],
  stress: ['stress', 'sleep'],
  back: ['back'],
  energy: ['energy'],
};

/** 1 = never done yoga, 2 = done a little, 3 = practises regularly. */
export type UserLevel = 1 | 2 | 3;

export type PoseCategory = 'warmup' | 'standing' | 'floor' | 'core' | 'cooldown' | 'breath';
export type AvoidLevel = 'AVOID' | 'CAUTION';
export type ContentStatus = 'DRAFT' | 'APPROVED';

export interface AvoidRule {
  condition: Condition;
  level: AvoidLevel;
  reasonHi: string;
  alternative: string | null;
  status: ContentStatus;
}

export interface Bilingual { hi: string; en: string }

export interface Pose {
  id: number;
  slug: string;
  name: { en: string; hi: string; sa: string };
  category: PoseCategory;
  difficulty: 1 | 2 | 3;
  goals: string[];
  defaultSeconds: number;
  perSide: boolean;
  flags: string[];
  shootBlock: string;
  status: ContentStatus;
  clipUrl: string | null;
  audio: { hi: string | null; en: string | null };
  steps: { hi: string[]; en: string[] } | null;
  mistake: Bilingual | null;
  easier: Bilingual | null;
  benefit: Bilingual | null;
  avoid: AvoidRule[];
}

export interface SessionItem {
  pose: Pose;
  /** Hold time for this slot, already doubled when the pose is done on both sides. */
  seconds: number;
  /** CAUTION rules that matched the user's conditions — shown as a warning, pose stays. */
  cautions: AvoidRule[];
}

export interface RemovedNote {
  slug: string;
  nameHi: string;
  nameEn: string;
  condition: Condition;
  reasonHi: string;
  /** Slug that was put in its place, when one was available. */
  replacedWith: string | null;
}

export interface Session {
  /** Stable id for the day, e.g. "2026-11-21". */
  dateKey: string;
  items: SessionItem[];
  totalSeconds: number;
  /** AVOID poses that were taken out, with the reason — the app shows this count. */
  removed: RemovedNote[];
  goal: Goal;
  level: UserLevel;
}

export interface BuildOptions {
  poses: Pose[];
  goal: Goal;
  level: UserLevel;
  conditions?: Condition[];
  /** Target length in seconds (default 600 = 10 minutes). */
  targetSeconds?: number;
  /** Slugs used in the last few days, avoided while the pool allows it. */
  recentSlugs?: string[];
  /** Day key — also seeds the shuffle, so one day always gives the same session. */
  dateKey: string;
  /** Pass true in development to use DRAFT content before the therapist signs off. */
  allowDraft?: boolean;
}
