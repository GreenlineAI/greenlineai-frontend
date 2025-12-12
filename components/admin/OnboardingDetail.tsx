'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Bot,
  Copy,
  Check,
  Save,
  Clipboard,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useOnboarding,
  useUpdateOnboarding,
  type OnboardingStatus,
} from '@/hooks/use-onboarding';
import { format } from 'date-fns';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(label ? `${label} copied!` : 'Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function DetailRow({ label, value, copyable = false }: { label: string; value: string | null | undefined; copyable?: boolean }) {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm text-muted-foreground w-40 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="text-sm font-medium text-right">{value}</span>
        {copyable && <CopyButton text={value} label={label} />}
      </div>
    </div>
  );
}

function formatBusinessType(type: string, other?: string | null): string {
  if (type === 'other' && other) return other;
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatPhonePreference(pref: string | null): string {
  if (!pref) return 'Not specified';
  const labels: Record<string, string> = {
    new: 'Get a new local number',
    forward: 'Forward existing number',
    port: 'Port existing number',
  };
  return labels[pref] || pref;
}

interface OnboardingDetailProps {
  id: string;
}

export default function OnboardingDetail({ id }: OnboardingDetailProps) {
  const { data: onboarding, isLoading } = useOnboarding(id);
  const updateMutation = useUpdateOnboarding();

  const [status, setStatus] = useState<OnboardingStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when data loads
  useEffect(() => {
    if (onboarding) {
      setStatus(onboarding.status || '');
      setNotes(onboarding.notes || '');
    }
  }, [onboarding]);

  const handleStatusChange = (newStatus: OnboardingStatus) => {
    setStatus(newStatus);
    setHasChanges(true);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!onboarding) return;

    try {
      await updateMutation.mutateAsync({
        id: onboarding.id,
        updates: {
          status: status as OnboardingStatus,
          notes,
        },
      });
      toast.success('Changes saved successfully');
      setHasChanges(false);
    } catch {
      toast.error('Failed to save changes');
    }
  };

  const generateFlowChartPrompt = () => {
    if (!onboarding) return '';

    const hours = [
      `Monday: ${onboarding.hours_monday || 'Not specified'}`,
      `Tuesday: ${onboarding.hours_tuesday || 'Not specified'}`,
      `Wednesday: ${onboarding.hours_wednesday || 'Not specified'}`,
      `Thursday: ${onboarding.hours_thursday || 'Not specified'}`,
      `Friday: ${onboarding.hours_friday || 'Not specified'}`,
      `Saturday: ${onboarding.hours_saturday || 'Not specified'}`,
      `Sunday: ${onboarding.hours_sunday || 'Not specified'}`,
    ].join('\n');

    return `Create a Retell AI voice agent flow chart for the following business:

BUSINESS: ${onboarding.business_name}
TYPE: ${formatBusinessType(onboarding.business_type, onboarding.business_type_other)}
LOCATION: ${onboarding.city}, ${onboarding.state}
SERVICE RADIUS: ${onboarding.service_radius_miles} miles

SERVICES OFFERED:
${onboarding.services.map((s) => `- ${s}`).join('\n')}

BUSINESS HOURS:
${hours}

AI GREETING: "Thank you for calling ${onboarding.greeting_name || onboarding.business_name}..."

APPOINTMENT DURATION: ${onboarding.appointment_duration} minutes
${onboarding.calendar_link ? `CALENDAR: ${onboarding.calendar_link}` : ''}

${onboarding.pricing_info ? `PRICING INFO:\n${onboarding.pricing_info}` : ''}

${onboarding.special_instructions ? `SPECIAL INSTRUCTIONS:\n${onboarding.special_instructions}` : ''}

The agent should:
1. Greet callers professionally
2. Ask how they can help
3. Answer questions about services and availability
4. Collect caller information (name, phone, address)
5. Check if caller is within service area (${onboarding.service_radius_miles} miles of ${onboarding.city}, ${onboarding.state})
6. Book appointments during business hours
7. Handle common objections and questions
8. End calls professionally`;
  };

  const handleCopyFlowChartPrompt = async () => {
    const prompt = generateFlowChartPrompt();
    await navigator.clipboard.writeText(prompt);
    toast.success('Flow chart prompt copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-60 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!onboarding) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Onboarding not found</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin/onboarding">Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/onboarding">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">{onboarding.business_name}</h1>
              <p className="text-sm text-muted-foreground">
                Submitted {onboarding.created_at ? format(new Date(onboarding.created_at), 'MMMM d, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      <main className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <DetailRow label="Business Name" value={onboarding.business_name} copyable />
                <DetailRow
                  label="Business Type"
                  value={formatBusinessType(onboarding.business_type, onboarding.business_type_other)}
                />
                <DetailRow label="Owner Name" value={onboarding.owner_name} copyable />
                <DetailRow label="Email" value={onboarding.email} copyable />
                <DetailRow label="Phone" value={onboarding.phone} copyable />
                {onboarding.website && (
                  <div className="flex items-start justify-between py-2">
                    <span className="text-sm text-muted-foreground w-40">Website</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={onboarding.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        {onboarding.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <CopyButton text={onboarding.website} label="Website" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Service Area
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <DetailRow
                  label="Location"
                  value={`${onboarding.city}, ${onboarding.state}${onboarding.zip ? ` ${onboarding.zip}` : ''}`}
                  copyable
                />
                <DetailRow label="Service Radius" value={`${onboarding.service_radius_miles} miles`} />
              </CardContent>
            </Card>

            {/* Phone Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <DetailRow label="Preference" value={formatPhonePreference(onboarding.phone_preference)} />
                {onboarding.existing_phone_number && (
                  <DetailRow label="Existing Number" value={onboarding.existing_phone_number} copyable />
                )}
                {onboarding.current_phone_provider && (
                  <DetailRow label="Current Provider" value={onboarding.current_phone_provider} />
                )}
                {onboarding.retell_phone_number && (
                  <DetailRow label="Retell Number" value={onboarding.retell_phone_number} copyable />
                )}
                {onboarding.retell_agent_id && (
                  <DetailRow label="Retell Agent ID" value={onboarding.retell_agent_id} copyable />
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered ({onboarding.services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {onboarding.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { day: 'Monday', hours: onboarding.hours_monday },
                    { day: 'Tuesday', hours: onboarding.hours_tuesday },
                    { day: 'Wednesday', hours: onboarding.hours_wednesday },
                    { day: 'Thursday', hours: onboarding.hours_thursday },
                    { day: 'Friday', hours: onboarding.hours_friday },
                    { day: 'Saturday', hours: onboarding.hours_saturday },
                    { day: 'Sunday', hours: onboarding.hours_sunday },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between py-1 border-b last:border-0">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground">{hours || 'Not specified'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <DetailRow
                  label="Greeting Name"
                  value={onboarding.greeting_name || onboarding.business_name}
                  copyable
                />
                <DetailRow label="Appointment Duration" value={`${onboarding.appointment_duration} minutes`} />
                {onboarding.calendar_link && (
                  <div className="flex items-start justify-between py-2">
                    <span className="text-sm text-muted-foreground w-40">Calendar Link</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={onboarding.calendar_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Open Calendar
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <CopyButton text={onboarding.calendar_link} label="Calendar link" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Info */}
            {onboarding.pricing_info && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{onboarding.pricing_info}</p>
                </CardContent>
              </Card>
            )}

            {/* Special Instructions */}
            {onboarding.special_instructions && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-800">Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-900 whitespace-pre-wrap">
                    {onboarding.special_instructions}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={status || onboarding.status || ''}
                  onValueChange={(v) => handleStatusChange(v as OnboardingStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="agent_created">Agent Created</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>

                <div>
                  <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                  <Textarea
                    placeholder="Add notes about this onboarding..."
                    value={notes || onboarding.notes || ''}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCopyFlowChartPrompt}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy Flow Chart Prompt
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${onboarding.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Business
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${onboarding.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Business
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{onboarding.created_at ? format(new Date(onboarding.created_at), 'MMM d, yyyy h:mm a') : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{onboarding.updated_at ? format(new Date(onboarding.updated_at), 'MMM d, yyyy h:mm a') : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
