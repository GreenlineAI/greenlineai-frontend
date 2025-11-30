'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadStatusBadge, LeadScoreBadge, CallStatusBadge } from '@/components/shared/StatusBadge';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Star,
  Calendar,
  Clock,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';
import type { Lead, LeadStatus, LeadScore, OutreachCall } from '@/lib/types';
import { useLeadCalls } from '@/hooks/use-calls';
import { useUpdateLead } from '@/hooks/use-leads';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCallNow?: (lead: Lead) => void;
}

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  onCallNow,
}: LeadDetailSheetProps) {
  const [notes, setNotes] = useState(lead?.notes || '');
  const { data: callHistory = [] } = useLeadCalls(lead?.id || '');
  const updateLead = useUpdateLead();

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    try {
      await updateLead.mutateAsync({ id: lead.id, updates: { status } });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleScoreChange = async (score: LeadScore) => {
    if (!lead) return;
    try {
      await updateLead.mutateAsync({ id: lead.id, updates: { score } });
      toast.success('Score updated');
    } catch {
      toast.error('Failed to update score');
    }
  };

  const handleSaveNotes = async () => {
    if (!lead) return;
    try {
      await updateLead.mutateAsync({ id: lead.id, updates: { notes } });
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{lead.businessName}</SheetTitle>
          <SheetDescription>
            {lead.city}, {lead.state}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="mt-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => onCallNow?.(lead)}>
                <PhoneCall className="h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </div>

            {/* Status & Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={lead.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                    <SelectItem value="not_interested">Not Interested</SelectItem>
                    <SelectItem value="no_answer">No Answer</SelectItem>
                    <SelectItem value="invalid">Invalid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Score</label>
                <Select value={lead.score} onValueChange={handleScoreChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">
                      {lead.email}
                    </a>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {lead.address}, {lead.city}, {lead.state} {lead.zip}
                    </span>
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      {lead.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Business Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Business Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {lead.googleRating !== null && (
                  <div>
                    <span className="text-muted-foreground">Google Rating</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{lead.googleRating}</span>
                      {lead.reviewCount !== null && (
                        <span className="text-muted-foreground">
                          ({lead.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Industry</span>
                  <p className="font-medium mt-1 capitalize">{lead.industry}</p>
                </div>
                {lead.yearEstablished && (
                  <div>
                    <span className="text-muted-foreground">Established</span>
                    <p className="font-medium mt-1">{lead.yearEstablished}</p>
                  </div>
                )}
                {lead.employeeCount && (
                  <div>
                    <span className="text-muted-foreground">Employees</span>
                    <p className="font-medium mt-1">{lead.employeeCount}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Notes</h4>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                rows={4}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveNotes}
                disabled={notes === lead.notes}
              >
                Save Notes
              </Button>
            </div>

            <Separator />

            {/* Call History */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Call History</h4>
              {callHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No calls yet</p>
              ) : (
                <div className="space-y-2">
                  {callHistory.map((call: OutreachCall) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CallStatusBadge status={call.status} />
                          {call.meetingBooked && (
                            <span className="text-xs text-green-600 font-medium">
                              Meeting Booked
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(call.createdAt), 'MMM d, yyyy h:mm a')}
                          {call.duration && (
                            <span>
                              ({Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
