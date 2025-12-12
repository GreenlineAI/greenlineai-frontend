'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneIncoming,
  PhoneOff,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Activity,
  Voicemail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'call_completed' | 'call_missed' | 'call_voicemail' | 'appointment_booked' | 'appointment_confirmed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    duration?: number;
    phoneNumber?: string;
    appointmentTime?: string;
  };
}

interface LiveActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  maxItems?: number;
}

const activityConfig = {
  call_completed: {
    icon: PhoneIncoming,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    badge: { label: 'Answered', className: 'bg-green-100 text-green-700' },
  },
  call_missed: {
    icon: PhoneOff,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badge: { label: 'Missed', className: 'bg-red-100 text-red-700' },
  },
  call_voicemail: {
    icon: Voicemail,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    badge: { label: 'Voicemail', className: 'bg-yellow-100 text-yellow-700' },
  },
  appointment_booked: {
    icon: Calendar,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: { label: 'Booked', className: 'bg-blue-100 text-blue-700' },
  },
  appointment_confirmed: {
    icon: CheckCircle,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badge: { label: 'Confirmed', className: 'bg-purple-100 text-purple-700' },
  },
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function ActivityItemRow({ activity }: { activity: ActivityItem }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className={cn('rounded-full p-2 flex-shrink-0', config.iconBg)}>
        <Icon className={cn('h-4 w-4', config.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
          </div>
          <Badge variant="secondary" className={cn('text-xs flex-shrink-0', config.badge.className)}>
            {config.badge.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </span>
          {activity.metadata?.duration && (
            <span>{formatDuration(activity.metadata.duration)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function LiveActivityFeed({ activities, isLoading, maxItems = 5 }: LiveActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Live Activity</CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/calls">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedActivities.length > 0 ? (
          <div className="divide-y">
            {displayedActivities.map((activity) => (
              <ActivityItemRow key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Activity will appear here as calls come in
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
