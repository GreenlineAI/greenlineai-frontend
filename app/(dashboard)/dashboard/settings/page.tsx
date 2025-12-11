'use client';

import { useState, useEffect } from 'react';
import { User, Mic, Bell, Link, Key, Check, Loader2, ExternalLink, Clock, Building2, MapPin, Calendar } from 'lucide-react';
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
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const BUSINESS_TYPES = [
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'lawn_care', label: 'Lawn Care' },
  { value: 'tree_service', label: 'Tree Service' },
  { value: 'hardscaping', label: 'Hardscaping' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'snow_removal', label: 'Snow Removal' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'pool_service', label: 'Pool Service' },
  { value: 'other', label: 'Other' },
];

type BusinessType = 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other';

interface BusinessSettings {
  id?: string;
  business_name: string;
  business_type: BusinessType;
  business_type_other: string;
  owner_name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  zip: string;
  service_radius_miles: number;
  services: string[];
  hours_monday: string;
  hours_tuesday: string;
  hours_wednesday: string;
  hours_thursday: string;
  hours_friday: string;
  hours_saturday: string;
  hours_sunday: string;
  greeting_name: string;
  appointment_duration: number;
  calendar_link: string;
  pricing_info: string;
  special_instructions: string;
  status: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  // Business settings state
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: '',
    business_type: 'landscaping',
    business_type_other: '',
    owner_name: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    state: '',
    zip: '',
    service_radius_miles: 25,
    services: [],
    hours_monday: '9:00 AM - 5:00 PM',
    hours_tuesday: '9:00 AM - 5:00 PM',
    hours_wednesday: '9:00 AM - 5:00 PM',
    hours_thursday: '9:00 AM - 5:00 PM',
    hours_friday: '9:00 AM - 5:00 PM',
    hours_saturday: '',
    hours_sunday: '',
    greeting_name: '',
    appointment_duration: 30,
    calendar_link: '',
    pricing_info: '',
    special_instructions: '',
    status: 'pending',
  });

  const [servicesInput, setServicesInput] = useState('');

  // Notification state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    meetingBooked: true,
    dailySummary: true,
    weeklyReport: true,
    slackWebhook: '',
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

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const supabase = createClient();

    // Load profile
    setProfile({
      name: user.user_metadata?.name || '',
      email: user.email || '',
      company: user.user_metadata?.company || '',
      phone: '',
    });

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setIsAdmin(adminData?.role === 'super_admin' || adminData?.role === 'admin');

    // Load business settings
    const { data: businessData } = await supabase
      .from('business_onboarding')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (businessData) {
      setBusinessSettings({
        id: businessData.id,
        business_name: businessData.business_name || '',
        business_type: businessData.business_type || 'landscaping',
        business_type_other: businessData.business_type_other || '',
        owner_name: businessData.owner_name || '',
        email: businessData.email || '',
        phone: businessData.phone || '',
        website: businessData.website || '',
        city: businessData.city || '',
        state: businessData.state || '',
        zip: businessData.zip || '',
        service_radius_miles: businessData.service_radius_miles || 25,
        services: businessData.services || [],
        hours_monday: businessData.hours_monday || '',
        hours_tuesday: businessData.hours_tuesday || '',
        hours_wednesday: businessData.hours_wednesday || '',
        hours_thursday: businessData.hours_thursday || '',
        hours_friday: businessData.hours_friday || '',
        hours_saturday: businessData.hours_saturday || '',
        hours_sunday: businessData.hours_sunday || '',
        greeting_name: businessData.greeting_name || '',
        appointment_duration: businessData.appointment_duration || 30,
        calendar_link: businessData.calendar_link || '',
        pricing_info: businessData.pricing_info || '',
        special_instructions: businessData.special_instructions || '',
        status: businessData.status || 'pending',
      });
      setServicesInput(businessData.services?.join(', ') || '');
    }

    // Load integrations
    fetchIntegrations();

    setLoading(false);
  };

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile saved');
    setSaving(false);
  };

  const handleSaveBusinessSettings = async () => {
    if (!user) return;

    setSaving(true);
    const supabase = createClient();

    // Parse services from comma-separated input
    const services = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Prepare data for database (exclude id for insert, include only changed fields)
    const { id: _id, status: _status, ...settingsWithoutId } = businessSettings;
    const settingsToSave = {
      ...settingsWithoutId,
      services,
      user_id: user.id,
    };

    try {
      if (businessSettings.id) {
        // Update existing
        const { error } = await supabase
          .from('business_onboarding')
          .update(settingsToSave)
          .eq('id', businessSettings.id);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('business_onboarding')
          .insert(settingsToSave)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBusinessSettings(prev => ({ ...prev, id: data.id }));
        }
      }

      toast.success('Business settings saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Notification settings saved');
    setSaving(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pending: { variant: 'secondary', label: 'Pending Setup' },
      in_review: { variant: 'outline', label: 'In Review' },
      agent_created: { variant: 'outline', label: 'Agent Created' },
      active: { variant: 'default', label: 'Active' },
      paused: { variant: 'destructive', label: 'Paused' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Settings"
          description="Manage your account and AI voice agent configuration"
        />
      </div>

      <main className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={`grid w-full max-w-2xl ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
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
            {isAdmin && (
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                API
              </TabsTrigger>
            )}
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

          {/* Business/Voice AI Tab */}
          <TabsContent value="business">
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Voice Agent Status</CardTitle>
                      <CardDescription>
                        Your AI agent configuration and setup status
                      </CardDescription>
                    </div>
                    {getStatusBadge(businessSettings.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {businessSettings.status === 'pending' && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Setup Required:</strong> Please complete your business information below.
                        Once submitted, our team will configure your AI voice agent and notify you when it&apos;s ready.
                      </p>
                    </div>
                  )}
                  {businessSettings.status === 'active' && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Active:</strong> Your AI voice agent is live and ready to take calls!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your business so we can train your AI agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name *</Label>
                      <Input
                        id="business_name"
                        value={businessSettings.business_name}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, business_name: e.target.value })}
                        placeholder="Mike's Landscaping"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="greeting_name">How should the AI greet callers?</Label>
                      <Input
                        id="greeting_name"
                        value={businessSettings.greeting_name}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, greeting_name: e.target.value })}
                        placeholder="Mike's Landscaping or just Mike"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Business Type *</Label>
                      <Select
                        value={businessSettings.business_type}
                        onValueChange={(value: BusinessType) => setBusinessSettings({ ...businessSettings, business_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {businessSettings.business_type === 'other' && (
                      <div className="space-y-2">
                        <Label htmlFor="business_type_other">Please specify</Label>
                        <Input
                          id="business_type_other"
                          value={businessSettings.business_type_other}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, business_type_other: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_name">Owner/Contact Name *</Label>
                      <Input
                        id="owner_name"
                        value={businessSettings.owner_name}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, owner_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_phone">Business Phone *</Label>
                      <Input
                        id="business_phone"
                        value={businessSettings.phone}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_email">Business Email *</Label>
                      <Input
                        id="business_email"
                        type="email"
                        value={businessSettings.email}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={businessSettings.website}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Service Area
                  </CardTitle>
                  <CardDescription>
                    Where does your business operate?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={businessSettings.city}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={businessSettings.state}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, state: e.target.value })}
                        placeholder="CA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={businessSettings.zip}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, zip: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service_radius">Service Radius (miles)</Label>
                    <Input
                      id="service_radius"
                      type="number"
                      min={1}
                      max={100}
                      value={businessSettings.service_radius_miles}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, service_radius_miles: parseInt(e.target.value) || 25 })}
                    />
                    <p className="text-xs text-muted-foreground">
                      How far will you travel to service customers?
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>
                    List the services you provide (the AI will use this to answer questions)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="services">Services (comma-separated) *</Label>
                    <Textarea
                      id="services"
                      value={servicesInput}
                      onChange={(e) => setServicesInput(e.target.value)}
                      placeholder="Lawn mowing, Leaf cleanup, Mulching, Spring cleanup, Fall cleanup, Hedge trimming"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: Lawn mowing, Leaf cleanup, Mulching, Spring cleanup
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricing_info">General Pricing Info</Label>
                    <Textarea
                      id="pricing_info"
                      value={businessSettings.pricing_info}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, pricing_info: e.target.value })}
                      placeholder="Starting at $50 for basic lawn care. Free estimates available."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: General pricing the AI can reference (not exact quotes)
                    </p>
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
                  <CardDescription>
                    When are you available for appointments?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'hours_monday', label: 'Monday' },
                      { key: 'hours_tuesday', label: 'Tuesday' },
                      { key: 'hours_wednesday', label: 'Wednesday' },
                      { key: 'hours_thursday', label: 'Thursday' },
                      { key: 'hours_friday', label: 'Friday' },
                      { key: 'hours_saturday', label: 'Saturday' },
                      { key: 'hours_sunday', label: 'Sunday' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Input
                          id={key}
                          value={businessSettings[key as keyof BusinessSettings] as string}
                          onChange={(e) => setBusinessSettings({ ...businessSettings, [key]: e.target.value })}
                          placeholder="9:00 AM - 5:00 PM or Closed"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how appointments are booked
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointment_duration">Default Appointment Duration (minutes)</Label>
                      <Select
                        value={businessSettings.appointment_duration.toString()}
                        onValueChange={(value) => setBusinessSettings({ ...businessSettings, appointment_duration: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calendar_link">Calendar Booking Link</Label>
                      <Input
                        id="calendar_link"
                        value={businessSettings.calendar_link}
                        onChange={(e) => setBusinessSettings({ ...businessSettings, calendar_link: e.target.value })}
                        placeholder="https://calendly.com/your-business"
                      />
                      <p className="text-xs text-muted-foreground">
                        Calendly, Cal.com, or Google Calendar link
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                  <CardDescription>
                    Any additional information for your AI agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={businessSettings.special_instructions}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, special_instructions: e.target.value })}
                    placeholder="Example: Always mention our 10% discount for first-time customers. We don't service commercial properties."
                    rows={4}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveBusinessSettings} disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Business Settings'
                  )}
                </Button>
              </div>
            </div>
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
                {/* Google Calendar */}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>Retell AI Configuration</CardTitle>
                  <CardDescription>
                    Webhook URLs and settings for Retell AI integration (Admin Only)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Admin Only:</strong> This section is only visible to administrators.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Webhook Endpoints</h3>
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
