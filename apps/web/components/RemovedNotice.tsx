'use client';

import { useState } from 'react';
import type { Session } from '@yoga/engine';
import { poseBySlug } from '@yoga/content';
import { CONDITION_LABELS, t, type Lang } from '@/lib/i18n';

/**
 * Tells the user what the engine took out and why. This is the screen that
 * earns trust: the app shows that it did something for them, and names it.
 */
function poseName(slug: string, lang: Lang): string {
  const pose = poseBySlug(slug);
  if (!pose) return slug;
  return lang === 'hi' ? pose.name.hi : pose.name.en;
}

export function RemovedNotice({ session, lang }: { session: Session; lang: Lang }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-calm-200 bg-calm-50 p-3 text-calm-900">
      <p className="font-semibold">
        ✅ {t('removedNote', lang, { n: session.removed.length })}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-1 text-sm underline"
      >
        {t('removedWhy', lang)} {open ? '▴' : '▾'}
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-sm">
          {session.removed.map((r) => (
            <li key={r.slug} className="border-t border-calm-200 pt-2">
              <span className="font-medium">{lang === 'hi' ? r.nameHi : r.nameEn}</span>
              <span className="muted"> — {CONDITION_LABELS[r.condition]?.[lang] ?? r.condition}</span>
              <p lang="hi" className="muted">{r.reasonHi}</p>
              <p className="text-calm-700">
                {r.replacedWith
                  ? `${t('replacedWith', lang)}: ${poseName(r.replacedWith, lang)}`
                  : t('noReplacement', lang)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
