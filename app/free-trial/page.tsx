'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Phone, 
  Users, 
  Calendar, 
  BarChart3, 
  Zap,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function FreeTrialDemoPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to your backend/CRM
    console.log('Trial request:', { email, phone });
    setSubmitted(true);
  };

  const features = [
    {
      icon: Users,
      title: '50 Verified Leads',
      description: 'High-quality, verified home services businesses in your target market',
      color: 'bg-blue-500',
    },
    {
      icon: Phone,
      title: '100 AI-Powered Calls',
      description: 'Our AI agent calls your leads, qualifies them, and books appointments',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      title: 'Automatic Booking',
      description: 'Interested prospects are sent directly to your Calendly to book demos',
      color: 'bg-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track call outcomes, listen to recordings, and see what\'s working',
      color: 'bg-orange-500',
    },
  ];

  const process = [
    {
      step: 1,
      title: 'Sign Up for Free Trial',
      description: 'Enter your email and phone number below. No credit card required.',
    },
    {
      step: 2,
      title: 'We Upload Your Leads',
      description: 'We provide 50 verified home services leads in your target industries.',
    },
    {
      step: 3,
      title: 'AI Starts Calling',
      description: 'Our AI agent begins calling leads, qualifying them, and booking appointments.',
    },
    {
      step: 4,
      title: 'You Close Deals',
      description: 'Qualified prospects book time on your calendar. You focus on closing.',
    },
  ];

  const results = [
    { label: 'Average Booking Rate', value: '8-12%', icon: Target },
    { label: 'Time to First Meeting', value: '24-48hrs', icon: Clock },
    { label: 'Cost Per Meeting', value: '$25-40', icon: BarChart3 },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Request Received! 🎉</h1>
          <p className="text-lg text-muted-foreground mb-6">
            We'll reach out within 24 hours to set up your 14-day free trial.
            Check your email at <strong>{email}</strong> for next steps.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            In the meantime, feel free to explore our platform or schedule a live demo.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo/voice">Talk to AI Assistant</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold">GreenLine AI</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30">
            Limited Time Offer
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Try GreenLine AI Free for 14 Days
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            See how AI-powered outreach can 2-3x your qualified meetings.
            No credit card required. No setup fees. Just results.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="h-5 w-5" />
            <span>Setup takes 5 minutes • Start getting bookings in 48 hours</span>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            What's Included in Your Free Trial
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-slate-900/50 border-slate-700">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Results */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Expected Results from Your Trial
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="p-6 text-center bg-slate-900/50 border-slate-700">
                <result.icon className="h-12 w-12 mx-auto mb-4 text-primary-500" />
                <div className="text-3xl font-bold mb-2">{result.value}</div>
                <div className="text-slate-400">{result.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Your Free Trial Works
          </h2>
          <div className="space-y-8">
            {process.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-slate-900/50 border-slate-700">
            <h2 className="text-3xl font-bold text-center mb-4">
              Start Your Free 14-Day Trial
            </h2>
            <p className="text-center text-slate-400 mb-8">
              No credit card required. Cancel anytime.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <Button type="submit" className="w-full text-lg py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-slate-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </Card>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Trusted by marketing agencies nationwide</p>
            <div className="flex items-center justify-center gap-8 text-slate-500">
              <div>
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm">Calls Made</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">8-12%</div>
                <div className="text-sm">Avg Booking Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
