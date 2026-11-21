'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { poseBySlug, visiblePoses } from '@yoga/content';
import { avoidRulesFor } from '@yoga/engine';
import { CONDITION_LABELS, t } from '@/lib/i18n';
import { useProfile } from '@/lib/useProfile';
import { AvoidBox, Pill } from './ui';

export function PoseDetail({ slug }: { slug: string }) {
  const { profile, loading } = useProfile();
  const pose = poseBySlug(slug);

  if (loading) return <main className="grid min-h-dvh place-items-center"><p className="muted">…</p></main>;
  if (!pose || !visiblePoses().some((p) => p.slug === pose.slug)) notFound();

  const lang = profile?.lang ?? 'hi';
  const conditions = profile?.conditions ?? [];
  const blocking = avoidRulesFor(pose, conditions);
  const steps = pose.steps ? (lang === 'hi' ? pose.steps.hi : pose.steps.en) : [];

  return (
    <main lang={lang} className="mx-auto max-w-md px-4 py-6">
      <Link href="/poses" className="text-sm underline">← {t('library', lang)}</Link>

      <div className="card mt-4 grid aspect-[4/5] max-h-[40dvh] place-items-center rounded-2xl">
        {pose.clipUrl ? (
          <video src={pose.clipUrl} loop muted playsInline controls className="size-full rounded-2xl object-cover" />
        ) : (
          <div className="p-6 text-center">
            <p className="text-4xl" aria-hidden>🧘</p>
            <p className="mt-2 text-sm muted">clip pending · {pose.shootBlock}{pose.id}</p>
          </div>
        )}
      </div>

      <h1 className="mt-4 text-2xl font-bold">{lang === 'hi' ? pose.name.hi : pose.name.en}</h1>
      <p className="muted">{pose.name.sa} · {lang === 'hi' ? pose.name.en : pose.name.hi}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{t('difficulty', lang)} {pose.difficulty}</Pill>
        <Pill>{pose.defaultSeconds}s{pose.perSide ? ` × 2` : ''}</Pill>
        <Pill>{pose.category}</Pill>
        {pose.status === 'DRAFT' && <Pill>DRAFT</Pill>}
      </div>

      {blocking.length > 0 && (
        <div className="mt-5">
          <AvoidBox title={lang === 'hi' ? 'यह पोज़ आपके लिए नहीं है' : 'This pose is not for you'}>
            <ul className="space-y-2 text-sm">
              {blocking.map((rule) => (
                <li key={rule.condition}>
                  <strong>{CONDITION_LABELS[rule.condition]?.[lang] ?? rule.condition}</strong>
                  <p lang="hi">{rule.reasonHi}</p>
                  {rule.alternative && (
                    <Link href={`/poses/${rule.alternative}`} className="underline">
                      {t('saferOption', lang)}:{' '}
                      {(() => {
                        const alt = poseBySlug(rule.alternative);
                        return alt ? (lang === 'hi' ? alt.name.hi : alt.name.en) : rule.alternative;
                      })()}{' '}
                      →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </AvoidBox>
        </div>
      )}

      {steps.length > 0 && (
        <>
          <h2 className="mt-6 mb-2 font-semibold">{t('steps', lang)}</h2>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-semibold text-calm-600">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {pose.mistake && (
        <p className="mt-5 rounded-xl border border-[var(--border)] p-3">
          <strong>❌ {t('mistake', lang)}: </strong>
          {pose.mistake[lang]}
        </p>
      )}
      {pose.easier && (
        <p className="mt-2 rounded-xl border border-[var(--border)] p-3">
          <strong>🟢 {t('easier', lang)}: </strong>
          {pose.easier[lang]}
        </p>
      )}
      {pose.benefit && (
        <p className="mt-2 rounded-xl border border-[var(--border)] p-3">
          <strong>✅ {t('benefit', lang)}: </strong>
          {pose.benefit[lang]}
        </p>
      )}

      {/* Everyone sees every contraindication, not only the ones that match
          their own profile. Users trust an app that shows the whole rule. */}
      {pose.avoid.length > 0 && (
        <div className="mt-6">
          <AvoidBox title={t('avoidBox', lang)}>
            <ul className="space-y-1.5 text-sm">
              {pose.avoid.map((rule) => (
                <li key={`${rule.condition}-${rule.level}`}>
                  <strong>{CONDITION_LABELS[rule.condition]?.[lang] ?? rule.condition}</strong>
                  {' — '}
                  <span className={rule.level === 'AVOID' ? 'font-bold' : ''}>{rule.level}</span>
                  <span lang="hi"> · {rule.reasonHi}</span>
                </li>
              ))}
            </ul>
          </AvoidBox>
        </div>
      )}
    </main>
  );
}
