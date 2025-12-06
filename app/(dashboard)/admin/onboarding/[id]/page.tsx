import OnboardingDetail from '@/components/admin/OnboardingDetail';

// Required for static export with dynamic routes
// Empty array means no pages are pre-rendered, they're generated on-demand
export function generateStaticParams() {
  return [];
}

// Allow dynamic params not returned by generateStaticParams
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OnboardingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OnboardingDetail id={id} />;
}
