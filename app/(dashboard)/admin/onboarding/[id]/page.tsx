import OnboardingDetail from '@/components/admin/OnboardingDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OnboardingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OnboardingDetail id={id} />;
}
