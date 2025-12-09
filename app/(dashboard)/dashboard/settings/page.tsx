'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Mic, Bell, Key, Link, Users, Upload, Clock, Check, Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { useUser } from '@/lib/supabase/hooks';
import { toast } from 'sonner';
import Papa from 'papaparse';

export default function SettingsPage() {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    company: user?.user_metadata?.company || '',
    phone: '',
  });

  // Voice AI state (Retell AI)
  const [voiceSettings, setVoiceSettings] = useState({
    retellApiKey: '',
    agentId1: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_1 || '',
    agentId2: process.env.NEXT_PUBLIC_RETELL_AGENT_ID_2 || '',
    fromNumber: '',
    recordingEnabled: true,
    openingScript: 'Hi there! This is Alex calling from GreenLine AI, a marketing agency. I hope you\'re doing well today!',
    voicemailMessage: 'Hi, I was calling about your business. Please call us back at your convenience.',
  });

  // Notification state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    meetingBooked: true,
    dailySummary: true,
    weeklyReport: true,
    slackWebhook: '',
  });

  // Dialer state
  const [dialerSettings, setDialerSettings] = useState({
    autoDialDelay: 3,
    dailyLimit: 100,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  });

  // Integration state
  interface Integration {
    id: string;
    provider: string;
    provider_email: string;
    connected_at: string;
    metadata: {
      name?: string;
      picture?: string;
    };
  }

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null);

  // Fetch integrations on mount
  useEffect(() => {
    fetchIntegrations();

    // Check for success/error messages in URL
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');

    if (success === 'google_connected') {
      toast.success('Google Calendar connected successfully!');
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/settings?tab=integrations');
    } else if (error) {
      const errorMessages: Record<string, string> = {
        oauth_failed: 'Failed to start Google authentication',
        missing_params: 'Missing authentication parameters',
        invalid_state: 'Invalid authentication state. Please try again.',
        token_exchange_failed: 'Failed to complete authentication',
        callback_failed: 'Authentication callback failed',
        access_denied: 'Access was denied. Please try again.',
      };
      toast.error(errorMessages[error] || 'Authentication failed');
      window.history.replaceState({}, '', '/dashboard/settings?tab=integrations');
    }
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoadingIntegrations(false);
    }
  };

  const handleConnectGoogle = () => {
    setConnectingProvider('google_calendar');
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google';
  };

  const handleDisconnect = async (provider: string) => {
    setDisconnectingProvider(provider);
    try {
      const response = await fetch(`/api/integrations/${provider}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Integration disconnected');
        setIntegrations(integrations.filter(i => i.provider !== provider));
      } else {
        toast.error('Failed to disconnect integration');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect integration');
    } finally {
      setDisconnectingProvider(null);
    }
  };

  const getIntegration = (provider: string) => {
    return integrations.find(i => i.provider === provider);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile saved');
    setSaving(false);
  };

  const handleSaveVoiceSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Voice AI settings saved');
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Notification settings saved');
    setSaving(false);
  };

  const handleSaveDialerSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Dialer settings saved');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Settings"
          description="Manage your account and preferences"
        />
      </div>

      <main className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-2">
              <Mic className="h-4 w-4" />
              Voice AI
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Link className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice AI Tab */}
          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Voice AI Settings</CardTitle>
                <CardDescription>
                  Configure your Retell AI settings for outbound calls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Retell AI settings are configured via environment variables in Cloudflare Pages.
                    The settings below are for reference only.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retell-key">Retell API Key</Label>
                  <Input
                    id="retell-key"
                    type="password"
                    value={voiceSettings.retellApiKey}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, retellApiKey: e.target.value })}
                    placeholder="Configured in environment variables"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Set via RETELL_API_KEY environment variable
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-id-1">Primary Agent ID</Label>
                    <Input
                      id="agent-id-1"
                      value={voiceSettings.agentId1}
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, agentId1: e.target.value })}
                      placeholder="Configured in environment variables"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Set via RETELL_AGENT_ID_1
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-id-2">Secondary Agent ID</Label>
                    <Input
                      id="agent-id-2"
                      value={voiceSettings.agentId2}
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, agentId2: e.target.value })}
                      placeholder="Configured in environment variables"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Set via RETELL_AGENT_ID_2
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-number">From Phone Number</Label>
                  <Input
                    id="from-number"
                    value={voiceSettings.fromNumber}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, fromNumber: e.target.value })}
                    placeholder="Configured in environment variables"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Set via RETELL_FROM_NUMBER - Get this from your Retell dashboard
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Call Recording</Label>
                    <p className="text-sm text-muted-foreground">
                      Record all outbound calls (configured in Retell dashboard)
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.recordingEnabled}
                    onCheckedChange={(v) => setVoiceSettings({ ...voiceSettings, recordingEnabled: v })}
                    disabled
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="opening-script">Opening Script</Label>
                  <Textarea
                    id="opening-script"
                    value={voiceSettings.openingScript}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, openingScript: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    The AI will use this as the opening line when calling leads.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voicemail-message">Voicemail Message</Label>
                  <Textarea
                    id="voicemail-message"
                    value={voiceSettings.voicemailMessage}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, voicemailMessage: e.target.value })}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Dialer Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auto-dial-delay">Auto-dial Delay (seconds)</Label>
                      <Input
                        id="auto-dial-delay"
                        type="number"
                        min={1}
                        max={30}
                        value={dialerSettings.autoDialDelay}
                        onChange={(e) => setDialerSettings({ ...dialerSettings, autoDialDelay: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit">Daily Call Limit</Label>
                      <Input
                        id="daily-limit"
                        type="number"
                        min={1}
                        max={1000}
                        value={dialerSettings.dailyLimit}
                        onChange={(e) => setDialerSettings({ ...dialerSettings, dailyLimit: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="working-start">Working Hours Start</Label>
                      <Input
                        id="working-start"
                        type="time"
                        value={dialerSettings.workingHoursStart}
                        onChange={(e) => setDialerSettings({ ...dialerSettings, workingHoursStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="working-end">Working Hours End</Label>
                      <Input
                        id="working-end"
                        type="time"
                        value={dialerSettings.workingHoursEnd}
                        onChange={(e) => setDialerSettings({ ...dialerSettings, workingHoursEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveVoiceSettings} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Meeting Booked</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a meeting is booked
                      </p>
                    </div>
                    <Switch
                      checked={notifications.meetingBooked}
                      onCheckedChange={(v) => setNotifications({ ...notifications, meetingBooked: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily summary of your activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailySummary}
                      onCheckedChange={(v) => setNotifications({ ...notifications, dailySummary: v })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly performance report
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      value={notifications.slackWebhook}
                      onChange={(e) => setNotifications({ ...notifications, slackWebhook: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive notifications in your Slack workspace
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect your favorite tools and services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Calendar - Active Integration */}
                {(() => {
                  const googleIntegration = getIntegration('google_calendar');
                  const isConnected = !!googleIntegration;
                  const isConnecting = connectingProvider === 'google_calendar';
                  const isDisconnecting = disconnectingProvider === 'google_calendar';

                  return (
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${isConnected ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isConnected ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {isConnected ? (
                            <Check className="h-6 w-6 text-green-600" />
                          ) : (
                            <span className="font-bold text-blue-600">G</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Google Calendar</p>
                            {isConnected && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                          {isConnected ? (
                            <p className="text-sm text-muted-foreground">
                              Connected as {googleIntegration.provider_email}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Sync booked meetings to your calendar
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://calendar.google.com', '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open Calendar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDisconnect('google_calendar')}
                              disabled={isDisconnecting}
                            >
                              {isDisconnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Disconnect'
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={handleConnectGoogle}
                            disabled={isConnecting || loadingIntegrations}
                          >
                            {isConnecting || loadingIntegrations ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            {loadingIntegrations ? 'Loading...' : isConnecting ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Slack - Coming Soon */}
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <span className="font-bold text-purple-600">S</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Slack</p>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get real-time notifications in Slack
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Connect</Button>
                </div>

                {/* HubSpot - Coming Soon */}
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="font-bold text-green-600">H</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">HubSpot</p>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sync leads and activities to HubSpot
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Connect</Button>
                </div>

                {/* Salesforce - Coming Soon */}
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">SF</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Salesforce</p>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sync leads and activities to Salesforce
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Retell AI Configuration</CardTitle>
                <CardDescription>
                  Webhook URLs and settings for your Retell AI voice agent integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>About Retell AI:</strong> GreenLine AI uses Retell AI to power intelligent voice conversations with your leads. Configure the webhook URLs below in your Retell dashboard to enable real-time call tracking and analytics.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Webhook Endpoints</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add these URLs to your Retell AI dashboard under Agent Settings → Webhook URL to receive call events.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Webhook URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/retell/webhook`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/api/retell/webhook`);
                            toast.success('Copied!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receives all call lifecycle events including call_started, call_ended, and call_analyzed. Updates lead status and stores call recordings automatically.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Post-Call Analysis URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/retell/post-call`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/api/retell/post-call`);
                            toast.success('Copied!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Receives transcripts, sentiment analysis, and call summaries. Used to determine meeting bookings and update lead outcomes.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Setup Instructions:</strong>
                    </p>
                    <ol className="text-sm text-amber-800 dark:text-amber-200 mt-2 list-decimal list-inside space-y-1">
                      <li>Log in to your Retell AI dashboard at retellai.com</li>
                      <li>Navigate to your Agent → Settings → Webhook URL</li>
                      <li>Paste the Primary Webhook URL above</li>
                      <li>Save your changes and test with a sample call</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
