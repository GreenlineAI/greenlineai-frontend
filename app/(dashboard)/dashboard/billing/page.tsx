'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, Loader2, ExternalLink, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { useUser } from '@/lib/supabase/hooks';
import { toast } from 'sonner';
import { PLAN_FEATURES } from '@/lib/stripe/config';

interface SubscriptionData {
  plan: 'leads' | 'outreach' | 'whitelabel';
  status: string | null;
  periodEnd: string | null;
  stripeCustomerId: string | null;
}

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  leads: 'Starter',
  outreach: 'Professional',
  whitelabel: 'Business',
};

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();

    // Check for success message in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success('Subscription updated successfully!');
      window.history.replaceState({}, '', '/dashboard/billing');
    }
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to start checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
    }
  };

  const currentPlan = subscription?.plan || 'leads';
  const planName = PLAN_DISPLAY_NAMES[currentPlan];
  const planFeatures = PLAN_FEATURES[currentPlan === 'leads' ? 'starter' : currentPlan === 'outreach' ? 'professional' : 'business'];

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-600">Trial</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'canceling':
        return <Badge variant="secondary">Canceling</Badge>;
      case 'canceled':
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
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
      <div className="border-b bg-card px-6 py-4">
        <PageHeader
          title="Billing"
          description="Manage your subscription and billing details"
        />
      </div>

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your current subscription details
                </CardDescription>
              </div>
              {getStatusBadge(subscription?.status || null)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{planName}</h3>
                <p className="text-muted-foreground">
                  ${planFeatures.price.monthly}/month
                </p>
              </div>
              {subscription?.stripeCustomerId && (
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  Manage Billing
                </Button>
              )}
            </div>

            {subscription?.periodEnd && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {subscription.status === 'canceling' ? (
                  <span>Access until {new Date(subscription.periodEnd).toLocaleDateString()}</span>
                ) : (
                  <span>Next billing date: {new Date(subscription.periodEnd).toLocaleDateString()}</span>
                )}
              </div>
            )}

            {subscription?.status === 'past_due' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Payment Failed</p>
                  <p className="text-sm">Please update your payment method to continue your subscription.</p>
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Plan Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {planFeatures.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {currentPlan !== 'whitelabel' && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Get more features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPlan === 'leads' && (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Professional</h4>
                      <p className="text-sm text-muted-foreground">
                        500 minutes, 2 numbers, custom AI voice
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">$297/mo</span>
                      <Button onClick={() => handleUpgrade('price_professional_monthly')}>
                        Upgrade
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Business</h4>
                      <p className="text-sm text-muted-foreground">
                        Unlimited minutes, 5 numbers, dedicated support
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">$497/mo</span>
                      <Button onClick={() => handleUpgrade('price_business_monthly')}>
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {currentPlan === 'outreach' && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Business</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlimited minutes, 5 numbers, dedicated support
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">$497/mo</span>
                    <Button onClick={() => handleUpgrade('price_business_monthly')}>
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about billing or need to make changes to your subscription?
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:support@greenline-ai.com">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/pricing" target="_blank">View Pricing</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
