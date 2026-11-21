import type { Pose } from '@yoga/engine';
import { POSES } from './poses.generated.ts';

export { POSES };

/**
 * Content is DRAFT until the yoga therapist approves each row. Production
 * refuses to render DRAFT rows; development shows them so the app can be built
 * and tested before the review lands.
 *
 * Set NEXT_PUBLIC_ALLOW_DRAFT_CONTENT=false to see exactly what users will get.
 */
export const ALLOW_DRAFT_CONTENT =
  // Explicit opt-in, for a staging or demo deploy before the review lands.
  // The app shows a loud banner whenever this is on.
  process.env.NEXT_PUBLIC_ALLOW_DRAFT_CONTENT === 'true' ||
  // Otherwise: on in development, off in production.
  (process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_ALLOW_DRAFT_CONTENT !== 'false');

export const APPROVED_COUNT = POSES.filter((p) => p.status === 'APPROVED').length;

export function poseBySlug(slug: string): Pose | undefined {
  return POSES.find((p) => p.slug === slug);
}

/** Poses a user may browse in the library, newest content rules applied. */
export function visiblePoses(allowDraft = ALLOW_DRAFT_CONTENT): Pose[] {
  return POSES.filter((p) => allowDraft || p.status === 'APPROVED');
}
