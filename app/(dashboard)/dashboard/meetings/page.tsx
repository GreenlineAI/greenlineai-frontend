'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Phone, Mail, Building, Search, Filter, Settings, PlayCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { format, parseISO, isFuture, isPast, isToday } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Meeting {
  id: string;
  scheduled_at: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  meeting_type: string;
  location: string | null;
  notes: string | null;
  lead: {
    id: string;
    business_name: string;
    contact_name: string | null;
    email: string | null;
    phone: string;
  };
}

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('upcoming');

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['meetings', statusFilter, timeFilter],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from('meetings')
        .select(`
          *,
          lead:leads(
            id,
            business_name,
            contact_name,
            email,
            phone
          )
        `)
        .order('scheduled_at', { ascending: true });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply time filter
      const now = new Date().toISOString();
      if (timeFilter === 'upcoming') {
        query = query.gte('scheduled_at', now);
      } else if (timeFilter === 'past') {
        query = query.lt('scheduled_at', now);
      } else if (timeFilter === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        query = query
          .gte('scheduled_at', startOfDay.toISOString())
          .lte('scheduled_at', endOfDay.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Meeting[];
    },
  });

  const filteredMeetings = meetings?.filter((meeting) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      meeting.lead.business_name.toLowerCase().includes(query) ||
      meeting.lead.contact_name?.toLowerCase().includes(query) ||
      meeting.lead.phone.includes(query)
    );
  });

  const getStatusBadge = (status: Meeting['status']) => {
    const config = {
      scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
      completed: { label: 'Completed', className: 'bg-slate-100 text-slate-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
      no_show: { label: 'No Show', className: 'bg-orange-100 text-orange-700' },
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  const stats = {
    total: meetings?.length || 0,
    upcoming: meetings?.filter(m => isFuture(parseISO(m.scheduled_at))).length || 0,
    today: meetings?.filter(m => isToday(parseISO(m.scheduled_at))).length || 0,
    completed: meetings?.filter(m => m.status === 'completed').length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Meetings"
          description={`${stats.total} total meetings scheduled`}
        />
      </div>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Meetings</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-slate-600">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by business name, contact, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading meetings...</p>
            </CardContent>
          </Card>
        ) : filteredMeetings && filteredMeetings.length > 0 ? (
          <div className="grid gap-4">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{meeting.lead.business_name}</h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(parseISO(meeting.scheduled_at), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(parseISO(meeting.scheduled_at), 'h:mm a')} ({meeting.duration} min)</span>
                        </div>
                        {meeting.lead.contact_name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>👤</span>
                            <span>{meeting.lead.contact_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{meeting.lead.phone}</span>
                        </div>
                        {meeting.lead.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{meeting.lead.email}</span>
                          </div>
                        )}
                        {meeting.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>

                      {meeting.notes && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          <p className="text-muted-foreground">{meeting.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {meeting.status === 'scheduled' && (
                        <Button variant="outline" size="sm">
                          Confirm
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No meetings found' : 'No meetings yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try adjusting your search filters'
                  : 'Meetings booked by your AI receptionist will appear here automatically.'}
              </p>
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/dashboard/settings?tab=integrations">
                      <Settings className="mr-2 h-4 w-4" />
                      Connect Calendar
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/#demo">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Try a Test Call
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
