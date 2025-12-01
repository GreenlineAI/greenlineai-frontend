'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  SkipForward,
  Settings,
  Star,
  MapPin,
  Globe,
  ExternalLink,
  Clock,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Voicemail,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LeadScoreBadge } from '@/components/shared/StatusBadge';
import { useLeads, useLead, useUpdateLead } from '@/hooks/use-leads';
import { useCreateCall, useUpdateCall } from '@/hooks/use-calls';
import { useCampaigns } from '@/hooks/use-campaigns';
import type { Lead, CallDisposition, TranscriptEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type CallStatus = 'idle' | 'ringing' | 'connected' | 'ended';

function DialerContent() {
  const searchParams = useSearchParams();
  const leadIdFromUrl = searchParams.get('leadId');
  const campaignIdFromUrl = searchParams.get('campaignId');

  // State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(campaignIdFromUrl);
  const [callQueue, setCallQueue] = useState<Lead[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoDialing, setIsAutoDialing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showSetupWarning, setShowSetupWarning] = useState(false);

  // Hooks
  const { data: leadsData } = useLeads({ page: 1, pageSize: 100, filters: { status: 'new', score: 'all', industry: 'all', state: 'all', search: '', minRating: null, maxRating: null } });
  const { data: singleLead } = useLead(leadIdFromUrl || '');
  const { data: campaigns } = useCampaigns();
  const createCall = useCreateCall();
  const updateCall = useUpdateCall();
  const updateLead = useUpdateLead();

  // Initialize queue
  useEffect(() => {
    if (leadIdFromUrl && singleLead) {
      setCallQueue([singleLead]);
      setCurrentIndex(0);
    } else if (leadsData?.leads) {
      setCallQueue(leadsData.leads.filter(l => l.status === 'new' || l.status === 'no_answer'));
    }
  }, [leadIdFromUrl, singleLead, leadsData]);

  const currentLead = callQueue[currentIndex];

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = useCallback(async () => {
    if (!currentLead || !currentLead.phone) return;

    try {
      // Create call record in database
      const call = await createCall.mutateAsync({
        leadId: currentLead.id,
        campaignId: selectedCampaignId || undefined,
      });
      setCurrentCallId(call.id);
      setCallStatus('ringing');
      setCallDuration(0);
      setTranscript([]);

      // Initiate real phone call via Stammer AI/Bland AI
      const response = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: currentLead.phone,
          leadId: currentLead.id,
          campaignId: selectedCampaignId,
          prompt: `You are calling ${currentLead.businessName}. Introduce yourself as an AI assistant from a marketing agency specializing in lead generation for home services businesses.`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Check if it's a setup issue
        if (response.status === 503) {
          setShowSetupWarning(true);
          toast.error('Voice AI not configured. Please add your API key.');
        }
        throw new Error(data.error || 'Failed to initiate call');
      }

      // Update call record with external call ID
      await updateCall.mutateAsync({
        id: call.id,
        updates: {
          vapiCallId: data.callId,
          status: 'in_progress',
        },
      });

      // Start polling for call status (webhook will also update)
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/calls/${call.id}/status`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            if (statusData.status === 'completed' || statusData.status === 'failed') {
              clearInterval(pollInterval);
              setCallStatus('ended');
              if (statusData.transcript) {
                // Parse transcript if available
                const transcriptLines = statusData.transcript.split('\n');
                setTranscript(transcriptLines.map((line: string, idx: number) => ({
                  speaker: line.toLowerCase().includes('user') ? 'human' : 'ai',
                  text: line,
                  timestamp: idx * 10,
                })));
              }
            }
          }
        } catch (error) {
          console.error('Error polling call status:', error);
        }
      }, 5000); // Poll every 5 seconds

      // Clean up polling after 10 minutes max
      setTimeout(() => clearInterval(pollInterval), 600000);

      // Simulate connection UI update (actual status comes from webhook)
      setTimeout(() => {
        if (callStatus === 'ringing') {
          setCallStatus('connected');
          toast.success('Call connected');
        }
      }, 3000);

      toast.success('Calling ' + currentLead.business_name);
    } catch (error) {
      console.error('Call error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start call');
      setCallStatus('idle');
    }
  }, [currentLead, selectedCampaignId, createCall, updateCall, callStatus]);

  const endCall = useCallback(async () => {
    setCallStatus('ended');

    if (currentCallId) {
      await updateCall.mutateAsync({
        id: currentCallId,
        updates: {
          status: 'completed',
          duration: callDuration,
          transcript: transcript.map(t => `${t.speaker}: ${t.text}`).join('\n'),
        },
      });
    }
  }, [currentCallId, callDuration, transcript, updateCall]);

  const handleDisposition = async (disposition: CallDisposition) => {
    if (!currentLead || !currentCallId) return;

    const statusMap: Record<CallDisposition, { leadStatus: Lead['status']; meetingBooked: boolean }> = {
      meeting_booked: { leadStatus: 'meeting_scheduled', meetingBooked: true },
      interested_follow_up: { leadStatus: 'interested', meetingBooked: false },
      not_interested: { leadStatus: 'not_interested', meetingBooked: false },
      no_answer: { leadStatus: 'no_answer', meetingBooked: false },
      wrong_number: { leadStatus: 'invalid', meetingBooked: false },
      call_back_later: { leadStatus: 'contacted', meetingBooked: false },
      voicemail: { leadStatus: 'no_answer', meetingBooked: false },
    };

    const { leadStatus, meetingBooked } = statusMap[disposition];

    try {
      // Update call record
      await updateCall.mutateAsync({
        id: currentCallId,
        updates: { meetingBooked },
      });

      // Update lead status
      await updateLead.mutateAsync({
        id: currentLead.id,
        updates: {
          status: leadStatus,
          lastContacted: new Date().toISOString(),
          notes: notes || currentLead.notes,
        },
      });

      toast.success(`Marked as: ${disposition.replace('_', ' ')}`);

      // Reset state
      setCallStatus('idle');
      setCurrentCallId(null);
      setNotes('');

      // Move to next lead if auto-dialing
      if (isAutoDialing && !isPaused && currentIndex < callQueue.length - 1) {
        setCurrentIndex(i => i + 1);
        setTimeout(startCall, 2000); // 2 second delay before next call
      } else {
        setCurrentIndex(i => Math.min(i + 1, callQueue.length - 1));
      }
    } catch {
      toast.error('Failed to save disposition');
    }
  };

  const skipLead = () => {
    if (currentIndex < callQueue.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Unmuted' : 'Muted');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Dialing resumed' : 'Dialing paused');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Setup Warning Banner */}
      {showSetupWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  Voice AI Calling Not Configured
                </p>
                <p className="text-xs text-yellow-700">
                  To make real phone calls, add your Bland AI or Stammer AI API key to .env.local
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.bland.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-yellow-700 hover:text-yellow-900 underline"
              >
                Get Bland AI Key →
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSetupWarning(false)}
                className="h-6 text-yellow-700 hover:text-yellow-900"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">{/* Left Panel - Call Queue */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Call Queue</h2>
          <p className="text-sm text-muted-foreground">
            {callQueue.length - currentIndex} leads remaining
          </p>
        </div>

        {/* Campaign selector */}
        <div className="p-4 border-b">
          <Label className="text-xs text-muted-foreground">Campaign</Label>
          <select
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={selectedCampaignId || ''}
            onChange={(e) => setSelectedCampaignId(e.target.value || null)}
          >
            <option value="">All Leads</option>
            {campaigns?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Queue stats */}
        <div className="p-4 border-b flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today</span>
          <div className="flex items-center gap-4">
            <span>{currentIndex} calls</span>
            <span className="text-green-600">0 meetings</span>
          </div>
        </div>

        {/* Queue list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {callQueue.map((lead, index) => (
              <div
                key={lead.id}
                className={cn(
                  'rounded-lg p-3 cursor-pointer transition-colors',
                  index === currentIndex
                    ? 'bg-primary/10 border border-primary'
                    : 'hover:bg-muted'
                )}
                onClick={() => {
                  if (callStatus === 'idle') {
                    setCurrentIndex(index);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">{lead.businessName}</p>
                  <LeadScoreBadge score={lead.score} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {lead.city}, {lead.state}
                </p>
              </div>
            ))}
            {callQueue.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No leads in queue
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Center Panel - Active Call */}
      <div className="flex-1 flex flex-col">
        {/* Call controls header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={isAutoDialing}
                onCheckedChange={setIsAutoDialing}
                disabled={callStatus !== 'idle'}
              />
              <Label className="text-sm">Auto-dial</Label>
            </div>
            {isAutoDialing && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
              >
                {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>

        {/* Current lead & call UI */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {currentLead ? (
            <>
              {/* Business name */}
              <h1 className="text-3xl font-bold mb-2">{currentLead.businessName}</h1>
              <p className="text-xl font-mono text-muted-foreground mb-6">{currentLead.phone}</p>

              {/* Call status indicator */}
              <div className="mb-8">
                {callStatus === 'idle' && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Ready to call
                  </Badge>
                )}
                {callStatus === 'ringing' && (
                  <Badge className="text-lg px-4 py-2 bg-amber-500 animate-pulse">
                    Ringing...
                  </Badge>
                )}
                {callStatus === 'connected' && (
                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-green-500 mb-2">
                      Connected
                    </Badge>
                    <p className="text-2xl font-mono">{formatDuration(callDuration)}</p>
                  </div>
                )}
                {callStatus === 'ended' && (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Call Ended - Select Disposition
                  </Badge>
                )}
              </div>

              {/* Call controls */}
              <div className="flex items-center gap-4 mb-8">
                {callStatus === 'idle' && (
                  <>
                    <Button
                      size="lg"
                      className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
                      onClick={startCall}
                      disabled={createCall.isPending}
                    >
                      <Phone className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={skipLead}
                      disabled={currentIndex >= callQueue.length - 1}
                    >
                      <SkipForward className="h-5 w-5 mr-2" />
                      Skip
                    </Button>
                  </>
                )}
                {(callStatus === 'ringing' || callStatus === 'connected') && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 w-14 rounded-full"
                      onClick={toggleMute}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="lg"
                      className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                      onClick={endCall}
                    >
                      <PhoneOff className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Disposition buttons (shown after call ends) */}
              {callStatus === 'ended' && (
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Call Disposition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 border-green-200 hover:bg-green-50 hover:border-green-300"
                        onClick={() => handleDisposition('meeting_booked')}
                      >
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span>Meeting Booked</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleDisposition('interested_follow_up')}
                      >
                        <ThumbsUp className="h-5 w-5 text-blue-600" />
                        <span>Interested - Follow Up</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 border-red-200 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleDisposition('not_interested')}
                      >
                        <ThumbsDown className="h-5 w-5 text-red-600" />
                        <span>Not Interested</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => handleDisposition('no_answer')}
                      >
                        <PhoneOff className="h-5 w-5 text-muted-foreground" />
                        <span>No Answer</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => handleDisposition('voicemail')}
                      >
                        <Voicemail className="h-5 w-5 text-muted-foreground" />
                        <span>Voicemail</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => handleDisposition('call_back_later')}
                      >
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span>Call Back Later</span>
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Add notes about this call..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Live transcript */}
              {callStatus === 'connected' && transcript.length > 0 && (
                <Card className="w-full max-w-2xl mt-4">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Live Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {transcript.map((entry, i) => (
                          <div key={i} className={cn(
                            'text-sm p-2 rounded',
                            entry.speaker === 'ai' ? 'bg-blue-50 ml-4' : 'bg-muted mr-4'
                          )}>
                            <span className="font-medium text-xs text-muted-foreground">
                              {entry.speaker === 'ai' ? 'AI' : 'Customer'}:
                            </span>
                            <p>{entry.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center">
              <Phone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No leads in queue</h2>
              <p className="text-muted-foreground">
                Import leads or select a campaign to start dialing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Lead Context */}
      <div className="w-80 border-l flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Lead Details</h2>
        </div>

        {currentLead ? (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Business Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{currentLead.city}, {currentLead.state}</span>
                </div>
                {currentLead.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={currentLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {currentLead.googleRating !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {currentLead.googleRating} ({currentLead.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Suggested talking points */}
              <div>
                <h3 className="text-sm font-medium mb-2">Talking Points</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {currentLead.googleRating && currentLead.googleRating < 4 && (
                    <p>- Low Google rating ({currentLead.googleRating}) - opportunity to improve reputation</p>
                  )}
                  {currentLead.reviewCount && currentLead.reviewCount < 50 && (
                    <p>- Few reviews ({currentLead.reviewCount}) - could use more customer feedback</p>
                  )}
                  <p>- Voice AI can handle after-hours calls 24/7</p>
                  <p>- Never miss a potential customer again</p>
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <Textarea
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Previous calls */}
              <div>
                <h3 className="text-sm font-medium mb-2">Call History</h3>
                <p className="text-sm text-muted-foreground">No previous calls</p>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a lead to view details</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default function DialerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <DialerContent />
    </Suspense>
  );
}
