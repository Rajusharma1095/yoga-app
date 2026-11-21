import { POSES } from '@yoga/content';
import { PoseDetail } from '@/components/PoseDetail';

/** All 40 pose pages are prerendered; anything else is a 404. */
export function generateStaticParams() {
  return POSES.map((pose) => ({ slug: pose.slug }));
}

export const dynamicParams = false;

export default async function PoseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PoseDetail slug={slug} />;
}
