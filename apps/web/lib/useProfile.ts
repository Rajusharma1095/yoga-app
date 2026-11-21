'use client';

import { useEffect, useState } from 'react';
import { getProfile, type Profile } from './store.ts';

/**
 * Profile lives in localStorage, which the server cannot see, so the first
 * client render is the only place it can be read. `loading` keeps the UI from
 * flashing the onboarding screen at a user who already has a profile.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile(getProfile());
    setLoading(false);
  }, []);

  return { profile, setProfile, loading };
}
