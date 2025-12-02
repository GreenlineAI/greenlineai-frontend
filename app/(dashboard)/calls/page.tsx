'use client';

import { useState } from 'react';
import { useCalls } from '@/hooks/use-calls';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Clock, TrendingUp, Calendar, Play, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { OutreachCall, CallStatus } from '@/lib/types';

type Sentiment = 'positive' | 'neutral' | 'negative';

export default function CallLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CallStatus | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
  const [selectedCall, setSelectedCall] = useState<OutreachCall | null>(null);

  const { data: callsResponse, isLoading } = useCalls({
    filters: {
      status: statusFilter === 'all' ? undefined : statusFilter,
    },
  });

  const calls = callsResponse?.calls || [];

  // Filter calls
  const filteredCalls = calls.filter((call: OutreachCall) => {
    const matchesSearch =
      call.lead?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.lead?.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.transcript?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSentiment = sentimentFilter === 'all' || call.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  // Calculate stats
  const stats = {
    total: calls.length,
    completed: calls.filter((c: OutreachCall) => c.status === 'completed').length,
    meetingsBooked: calls.filter((c: OutreachCall) => c.meetingBooked).length,
    avgDuration: calls.reduce((acc: number, c: OutreachCall) => acc + (c.duration || 0), 0) / calls.length || 0,
  };

  const getStatusBadge = (status: CallStatus) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      no_answer: 'outline',
      voicemail: 'outline',
      failed: 'destructive',
      pending: 'secondary',
    } as const;
    
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getSentimentBadge = (sentiment: Sentiment) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-gray-100 text-gray-800',
      negative: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[sentiment]}>
        {sentiment}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call Logs"
        description="View and analyze all your outbound calls"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meetings Booked</p>
              <p className="text-2xl font-bold">{stats.meetingsBooked}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">{Math.round(stats.avgDuration / 60)}m</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search calls by business, contact, or transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CallStatus | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="no_answer">No Answer</SelectItem>
              <SelectItem value="voicemail">Voicemail</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sentimentFilter} onValueChange={(value) => setSentimentFilter(value as Sentiment | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Calls List */}
      <Card>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading calls...
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No calls found. Start calling leads to see logs here.
            </div>
          ) : (
            filteredCalls.map((call: OutreachCall) => (
              <div
                key={call.id}
                className="p-6 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {call.lead?.businessName || 'Unknown Business'}
                      </h3>
                      {getStatusBadge(call.status)}
                      {call.sentiment && getSentimentBadge(call.sentiment)}
                      {call.meetingBooked && (
                        <Badge className="bg-purple-100 text-purple-800">
                          📅 Meeting Booked
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{call.lead?.contactName}</span>
                      <span>{call.lead?.phone}</span>
                      {call.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(call.duration / 60)}m {call.duration % 60}s
                        </span>
                      )}
                      <span>{formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}</span>
                    </div>

                    {call.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {call.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {call.recordingUrl && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Call Detail Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Details - {selectedCall?.lead?.businessName}</DialogTitle>
            <DialogDescription>
              {selectedCall?.lead?.contactName} • {selectedCall?.lead?.phone}
            </DialogDescription>
          </DialogHeader>

          {selectedCall && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{getStatusBadge(selectedCall.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedCall.duration ? `${Math.floor(selectedCall.duration / 60)}m ${selectedCall.duration % 60}s` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sentiment</p>
                  <p className="font-medium">{selectedCall.sentiment && getSentimentBadge(selectedCall.sentiment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meeting Booked</p>
                  <p className="font-medium">{selectedCall.meetingBooked ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>

              {/* Summary */}
              {selectedCall.summary && (
                <div>
                  <h4 className="font-semibold mb-2">Call Summary</h4>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm">{selectedCall.summary}</p>
                  </Card>
                </div>
              )}

              {/* Transcript */}
              {selectedCall.transcript && (
                <div>
                  <h4 className="font-semibold mb-2">Full Transcript</h4>
                  <Card className="p-4 bg-muted/50 max-h-[300px] overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{selectedCall.transcript}</p>
                  </Card>
                </div>
              )}

              {/* Recording */}
              {selectedCall.recordingUrl && (
                <div>
                  <h4 className="font-semibold mb-2">Recording</h4>
                  <audio controls className="w-full">
                    <source src={selectedCall.recordingUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <a href={selectedCall.recordingUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download Recording
                    </a>
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={() => {
                  // Navigate to lead detail
                  window.location.href = `/dashboard/leads?id=${selectedCall.leadId}`;
                }}>
                  View Lead
                </Button>
                <Button variant="outline" onClick={() => setSelectedCall(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
