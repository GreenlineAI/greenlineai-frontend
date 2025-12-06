'use client';

import Link from 'next/link';
import {
  Phone,
  Calendar,
  Settings,
  PlayCircle,
  ArrowRight,
  Headphones,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeEmptyStateProps {
  userName: string;
  type?: 'inbound' | 'outreach';
}

export function WelcomeEmptyState({ userName, type = 'inbound' }: WelcomeEmptyStateProps) {
  if (type === 'outreach') {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to start reaching out?</h3>
            <p className="text-muted-foreground mb-6">
              Import your leads and let the AI help you book more meetings. Get started in just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/dashboard/leads">
                  Import Leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/campaigns/new">Create Campaign</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2">
      <CardContent className="py-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <Headphones className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome, {userName}!</h3>
          <p className="text-muted-foreground mb-6">
            Your AI receptionist is almost ready. Complete the setup below to start answering calls 24/7.
          </p>

          {/* Quick setup steps */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6 text-left">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Configure AI</p>
                <p className="text-xs text-muted-foreground">Set your greeting & hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Connect Calendar</p>
                <p className="text-xs text-muted-foreground">Auto-book appointments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-600">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">Test Your AI</p>
                <p className="text-xs text-muted-foreground">Make a quick test call</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configure AI
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#demo">
                <PlayCircle className="mr-2 h-4 w-4" />
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: 'default' | 'subtle';
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  variant = 'default',
}: EmptyStateCardProps) {
  return (
    <div className={`text-center py-8 ${variant === 'subtle' ? 'py-6' : ''}`}>
      <div
        className={`mx-auto mb-3 flex items-center justify-center rounded-full ${
          variant === 'subtle' ? 'h-10 w-10 bg-muted' : 'h-12 w-12 bg-muted'
        }`}
      >
        <Icon
          className={`text-muted-foreground ${variant === 'subtle' ? 'h-5 w-5' : 'h-6 w-6'}`}
        />
      </div>
      <p className={`font-medium text-muted-foreground ${variant === 'subtle' ? 'text-sm' : ''}`}>
        {title}
      </p>
      <p className={`text-muted-foreground mt-1 ${variant === 'subtle' ? 'text-xs' : 'text-sm'}`}>
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button variant="link" size="sm" className="mt-2" asChild>
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      )}
    </div>
  );
}
