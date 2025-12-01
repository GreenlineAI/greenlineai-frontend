'use client';

import { useState, useRef } from 'react';
import { User, Mic, Bell, Key, Link, Users, Upload } from 'lucide-react';
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

  // Voice AI state
  const [voiceSettings, setVoiceSettings] = useState({
    vapiApiKey: '',
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',
    phoneNumberId: '',
    voiceGender: 'female',
    recordingEnabled: true,
    openingScript: 'Hi, this is Sarah from Revues AI. Is this the owner of the business?',
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
                  Configure your Vapi voice AI settings for outbound calls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vapi-key">Vapi API Key</Label>
                    <Input
                      id="vapi-key"
                      type="password"
                      value={voiceSettings.vapiApiKey}
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, vapiApiKey: e.target.value })}
                      placeholder="sk-..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assistant-id">Assistant ID</Label>
                    <Input
                      id="assistant-id"
                      value={voiceSettings.assistantId}
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, assistantId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number-id">Phone Number ID</Label>
                  <Input
                    id="phone-number-id"
                    value={voiceSettings.phoneNumberId}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, phoneNumberId: e.target.value })}
                    placeholder="Your Vapi phone number ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-gender">Voice Gender</Label>
                    <Select
                      value={voiceSettings.voiceGender}
                      onValueChange={(v) => setVoiceSettings({ ...voiceSettings, voiceGender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between space-y-2">
                    <div>
                      <Label>Call Recording</Label>
                      <p className="text-sm text-muted-foreground">
                        Record all outbound calls
                      </p>
                    </div>
                    <Switch
                      checked={voiceSettings.recordingEnabled}
                      onCheckedChange={(v) => setVoiceSettings({ ...voiceSettings, recordingEnabled: v })}
                    />
                  </div>
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">G</span>
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Sync booked meetings to your calendar
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <span className="font-bold text-purple-600">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-muted-foreground">
                        Get real-time notifications in Slack
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="font-bold text-green-600">H</span>
                    </div>
                    <div>
                      <p className="font-medium">HubSpot</p>
                      <p className="text-sm text-muted-foreground">
                        Sync leads and activities to HubSpot
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">SF</span>
                    </div>
                    <div>
                      <p className="font-medium">Salesforce</p>
                      <p className="text-sm text-muted-foreground">
                        Sync leads and activities to Salesforce
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">
                        Use this key for production integrations
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk_live_placeholder_key_here"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={() => toast.success('Copied!')}>
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Test API Key</p>
                      <p className="text-sm text-muted-foreground">
                        Use this key for testing and development
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={() => toast.success('Copied!')}>
                      Copy
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Webhook Endpoints</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Vapi Webhook URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/vapi/webhook`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm" onClick={() => toast.success('Copied!')}>
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure this URL in your Vapi dashboard to receive call events.
                      </p>
                    </div>
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
