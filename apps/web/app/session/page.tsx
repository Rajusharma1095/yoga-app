'use client';

import { redirect } from 'next/navigation';
import { Player } from '@/components/Player';
import { useProfile } from '@/lib/useProfile';

export default function SessionPage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="muted">…</p>
      </main>
    );
  }
  if (!profile) redirect('/');
  return <Player profile={profile} />;
}
