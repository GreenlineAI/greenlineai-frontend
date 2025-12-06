'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Bot,
  Eye,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  useOnboardings,
  useOnboardingStats,
  type OnboardingStatus,
  type BusinessOnboarding,
} from '@/hooks/use-onboarding';
import { format } from 'date-fns';

function StatusBadge({ status }: { status: OnboardingStatus }) {
  const config: Record<OnboardingStatus, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
    in_review: { label: 'In Review', className: 'bg-blue-100 text-blue-700', icon: AlertCircle },
    agent_created: { label: 'Agent Created', className: 'bg-purple-100 text-purple-700', icon: Bot },
    active: { label: 'Active', className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    paused: { label: 'Paused', className: 'bg-slate-100 text-slate-700', icon: Pause },
  };

  const { label, className, icon: Icon } = config[status];

  return (
    <Badge variant="secondary" className={`${className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function formatBusinessType(type: string, other?: string | null): string {
  if (type === 'other' && other) return other;
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function OnboardingCard({ onboarding }: { onboarding: BusinessOnboarding }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Building className="h-5 w-5 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">{onboarding.business_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatBusinessType(onboarding.business_type, onboarding.business_type_other)}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{onboarding.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{onboarding.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {onboarding.city}, {onboarding.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(onboarding.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {onboarding.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {onboarding.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{onboarding.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={onboarding.status} />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/onboarding/${onboarding.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OnboardingListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'all'>('all');

  const { data: onboardings, isLoading } = useOnboardings({
    status: statusFilter,
    search: search || undefined,
  });
  const { data: stats, isLoading: statsLoading } = useOnboardingStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Business Onboarding"
          description="Manage new business signups and AI agent setup"
        />
      </div>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{stats?.pending || 0}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{stats?.in_review || 0}</p>
                  <p className="text-xs text-blue-600">In Review</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">{stats?.agent_created || 0}</p>
                  <p className="text-xs text-purple-600">Agent Created</p>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{stats?.active || 0}</p>
                  <p className="text-xs text-green-600">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-600">{stats?.paused || 0}</p>
                  <p className="text-xs text-muted-foreground">Paused</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by business name, email, or owner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as OnboardingStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="agent_created">Agent Created</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : onboardings && onboardings.length > 0 ? (
          <div className="space-y-4">
            {onboardings.map((onboarding) => (
              <OnboardingCard key={onboarding.id} onboarding={onboarding} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No onboarding submissions</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {search || statusFilter !== 'all'
                  ? 'No results match your filters. Try adjusting your search.'
                  : 'New business signups will appear here when they complete the onboarding form.'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
