import { PageHeader } from '@/components/shared/PageHeader';
import OnboardingList from '@/components/admin/OnboardingList';

export default function OnboardingListPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Business Onboarding"
          description="Manage new business signups and AI agent setup"
        />
      </div>

      <main className="p-6">
        <OnboardingList />
      </main>
    </div>
  );
}
