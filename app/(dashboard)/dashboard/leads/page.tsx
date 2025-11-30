'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Phone, Star, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { PageHeader } from '@/components/shared/PageHeader';
import { LeadStatusBadge, LeadScoreBadge } from '@/components/shared/StatusBadge';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadDetailSheet } from '@/components/leads/LeadDetailSheet';
import { BulkActions } from '@/components/leads/BulkActions';
import { useLeads } from '@/hooks/use-leads';
import type { Lead, LeadFilters as LeadFiltersType } from '@/lib/types';
import { format } from 'date-fns';

const defaultFilters: LeadFiltersType = {
  search: '',
  status: 'all',
  score: 'all',
  industry: 'all',
  state: 'all',
  minRating: null,
  maxRating: null,
};

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<LeadFiltersType>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading } = useLeads({
    page,
    pageSize,
    filters,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const columns: Column<Lead>[] = [
    {
      key: 'businessName',
      header: 'Business',
      cell: (lead) => (
        <div>
          <p className="font-medium">{lead.businessName}</p>
          <p className="text-sm text-muted-foreground">
            {lead.city}, {lead.state}
          </p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (lead) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{lead.phone}</span>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      cell: (lead) => (
        lead.googleRating !== null ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{lead.googleRating}</span>
            {lead.reviewCount !== null && (
              <span className="text-muted-foreground">({lead.reviewCount})</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
      className: 'w-[120px]',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (lead) => <LeadStatusBadge status={lead.status} />,
      className: 'w-[140px]',
    },
    {
      key: 'score',
      header: 'Score',
      cell: (lead) => <LeadScoreBadge score={lead.score} />,
      className: 'w-[80px]',
    },
    {
      key: 'lastContacted',
      header: 'Last Contacted',
      cell: (lead) => (
        lead.lastContacted ? (
          <span className="text-sm">
            {format(new Date(lead.lastContacted), 'MMM d, yyyy')}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Never</span>
        )
      ),
      className: 'w-[130px]',
    },
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  const handleCallNow = (lead: Lead) => {
    router.push(`/dashboard/dialer?leadId=${lead.id}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Quick stats
  const leads = data?.leads || [];
  const hotCount = leads.filter((l) => l.score === 'hot').length;
  const warmCount = leads.filter((l) => l.score === 'warm').length;
  const coldCount = leads.filter((l) => l.score === 'cold').length;
  const meetingsCount = leads.filter((l) => l.status === 'meeting_scheduled').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Leads"
          description={`${data?.total || 0} total leads`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </div>
          }
        />
      </div>

      <main className="p-6 space-y-4">
        {/* Filters */}
        <LeadFilters filters={filters} onFiltersChange={setFilters} />

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Hot: {hotCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Warm: {warmCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Cold: {coldCount}</span>
          </div>
          <div className="text-muted-foreground">|</div>
          <div className="text-muted-foreground">
            {meetingsCount} meetings scheduled
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <BulkActions
            selectedCount={selectedIds.size}
            selectedIds={selectedIds}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={data?.leads || []}
              isLoading={isLoading}
              selectable
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              getRowId={(lead) => lead.id}
              onRowClick={handleRowClick}
              emptyMessage="No leads found. Import some leads to get started."
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && data.total > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data.total}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>

      {/* Lead Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onCallNow={handleCallNow}
      />
    </div>
  );
}
