import type { MetadataRoute } from 'next';

// Needed so the manifest is emitted as a file under `output: export`.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Yoga',
    short_name: 'Daily Yoga',
    description: 'Ten minutes of yoga a day, matched to your body.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d9488',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
