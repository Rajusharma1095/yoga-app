'use client';

import { Home } from '@/components/Home';
import { Onboarding } from '@/components/Onboarding';
import { useProfile } from '@/lib/useProfile';

export default function Page() {
  const { profile, setProfile, loading } = useProfile();

  if (loading) return <Loading />;
  if (!profile) return <Onboarding onDone={setProfile} />;
  return <Home profile={profile} />;
}

function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <p className="muted">…</p>
    </main>
  );
}
