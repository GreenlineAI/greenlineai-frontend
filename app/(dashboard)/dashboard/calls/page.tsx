'use client';

import { useState } from 'react';
import { Phone, Clock, Calendar, Play, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { PageHeader } from '@/components/shared/PageHeader';
import { CallStatusBadge, MeetingBookedBadge } from '@/components/shared/StatusBadge';
import { useCalls, useCall } from '@/hooks/use-calls';
import type { OutreachCall, CallStatus } from '@/lib/types';
import { format } from 'date-fns';

export default function CallHistoryPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [statusFilter, setStatusFilter] = useState<CallStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data, isLoading } = useCalls({
    page,
    pageSize,
    filters: {
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined,
    },
  });

  const { data: selectedCall } = useCall(selectedCallId || '');

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const columns: Column<OutreachCall>[] = [
    {
      key: 'date',
      header: 'Date & Time',
      cell: (call) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(call.createdAt), 'MMM d, yyyy h:mm a')}</span>
        </div>
      ),
    },
    {
      key: 'business',
      header: 'Business',
      cell: (call) => (
        <div>
          <p className="font-medium">{call.lead?.businessName || 'Unknown'}</p>
          <p className="text-sm text-muted-foreground">{call.lead?.phone || '-'}</p>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      cell: (call) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatDuration(call.duration)}</span>
        </div>
      ),
      className: 'w-[100px]',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (call) => <CallStatusBadge status={call.status} />,
      className: 'w-[120px]',
    },
    {
      key: 'outcome',
      header: 'Meeting',
      cell: (call) => <MeetingBookedBadge booked={call.meetingBooked} />,
      className: 'w-[130px]',
    },
    {
      key: 'actions',
      header: '',
      cell: (call) => (
        <div className="flex items-center gap-2">
          {call.recordingUrl && (
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCallId(call.id);
              setShowDetailDialog(true);
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-[100px]',
    },
  ];

  const handleRowClick = (call: OutreachCall) => {
    setSelectedCallId(call.id);
    setShowDetailDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Call History"
          description="Review all past calls with transcripts and recordings"
        />
      </div>

      <main className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by business name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as CallStatus | 'all')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="no_answer">No Answer</SelectItem>
              <SelectItem value="voicemail">Voicemail</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{data?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Total Calls</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {data?.calls.filter(c => c.status === 'completed').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {data?.calls.filter(c => c.meetingBooked).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Meetings Booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {data?.calls.length
                  ? Math.round(
                      data.calls.reduce((acc, c) => acc + (c.duration || 0), 0) /
                        data.calls.filter(c => c.duration).length
                    ) || 0
                  : 0}s
              </p>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={data?.calls || []}
              isLoading={isLoading}
              getRowId={(call) => call.id}
              onRowClick={handleRowClick}
              emptyMessage="No calls yet. Start dialing to see your call history."
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
            onPageSizeChange={setPageSize}
          />
        )}
      </main>

      {/* Call Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-4">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business</p>
                  <p className="font-medium">{selectedCall.lead?.businessName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCall.lead?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedCall.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <CallStatusBadge status={selectedCall.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meeting</p>
                  <MeetingBookedBadge booked={selectedCall.meetingBooked} />
                </div>
              </div>

              <Separator />

              {/* Recording */}
              {selectedCall.recordingUrl && (
                <>
                  <div>
                    <p className="text-sm font-medium mb-2">Recording</p>
                    <audio controls className="w-full">
                      <source src={selectedCall.recordingUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <Separator />
                </>
              )}

              {/* Summary */}
              {selectedCall.summary && (
                <>
                  <div>
                    <p className="text-sm font-medium mb-2">AI Summary</p>
                    <p className="text-sm text-muted-foreground">{selectedCall.summary}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Transcript */}
              <div>
                <p className="text-sm font-medium mb-2">Transcript</p>
                {selectedCall.transcript ? (
                  <ScrollArea className="h-[200px] rounded border p-4">
                    <pre className="text-sm whitespace-pre-wrap">{selectedCall.transcript}</pre>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No transcript available</p>
                )}
              </div>

              {/* Sentiment */}
              {selectedCall.sentiment && (
                <div>
                  <p className="text-sm font-medium mb-2">Sentiment</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedCall.sentiment === 'positive'
                        ? 'bg-green-100 text-green-700'
                        : selectedCall.sentiment === 'negative'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedCall.sentiment.charAt(0).toUpperCase() + selectedCall.sentiment.slice(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
