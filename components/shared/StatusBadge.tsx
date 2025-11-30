'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeadStatus, LeadScore, CampaignStatus, CallStatus } from '@/lib/types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  contacted: { label: 'Contacted', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  interested: { label: 'Interested', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  meeting_scheduled: { label: 'Meeting Scheduled', className: 'bg-purple-100 text-purple-700 hover:bg-purple-100' },
  not_interested: { label: 'Not Interested', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  no_answer: { label: 'No Answer', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  invalid: { label: 'Invalid', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
};

const scoreConfig: Record<LeadScore, { label: string; className: string }> = {
  hot: { label: 'Hot', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  warm: { label: 'Warm', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  cold: { label: 'Cold', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
};

const campaignStatusConfig: Record<CampaignStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  paused: { label: 'Paused', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
};

const callStatusConfig: Record<CallStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  no_answer: { label: 'No Answer', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  voicemail: { label: 'Voicemail', className: 'bg-purple-100 text-purple-700 hover:bg-purple-100' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface LeadScoreBadgeProps {
  score: LeadScore;
  className?: string;
}

export function LeadScoreBadge({ score, className }: LeadScoreBadgeProps) {
  const config = scoreConfig[score];
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

export function CampaignStatusBadge({ status, className }: CampaignStatusBadgeProps) {
  const config = campaignStatusConfig[status];
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface CallStatusBadgeProps {
  status: CallStatus;
  className?: string;
}

export function CallStatusBadge({ status, className }: CallStatusBadgeProps) {
  const config = callStatusConfig[status];
  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface MeetingBookedBadgeProps {
  booked: boolean;
  className?: string;
}

export function MeetingBookedBadge({ booked, className }: MeetingBookedBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        booked
          ? 'bg-green-100 text-green-700 hover:bg-green-100'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-100',
        className
      )}
    >
      {booked ? 'Meeting Booked' : 'No Meeting'}
    </Badge>
  );
}
