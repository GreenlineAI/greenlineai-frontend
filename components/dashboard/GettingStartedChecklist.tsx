'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Phone,
  Settings,
  Calendar,
  Headphones,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  isComplete: boolean;
}

interface GettingStartedChecklistProps {
  hasCompletedOnboarding?: boolean;
  hasConfiguredVoiceAI?: boolean;
  hasConnectedCalendar?: boolean;
  hasMadeTestCall?: boolean;
  onDismiss?: () => void;
}

export function GettingStartedChecklist({
  hasCompletedOnboarding = false,
  hasConfiguredVoiceAI = false,
  hasConnectedCalendar = false,
  hasMadeTestCall = false,
  onDismiss,
}: GettingStartedChecklistProps) {
  const [dismissed, setDismissed] = useState(false);

  // Check localStorage for dismissed state
  useEffect(() => {
    const isDismissed = localStorage.getItem('gettingStartedDismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'onboarding',
      title: 'Complete your business profile',
      description: 'Tell us about your business so the AI knows how to answer calls',
      href: '/get-started',
      icon: Settings,
      isComplete: hasCompletedOnboarding,
    },
    {
      id: 'voice-ai',
      title: 'Configure your AI receptionist',
      description: 'Customize the greeting, voice, and how calls are handled',
      href: '/dashboard/settings',
      icon: Headphones,
      isComplete: hasConfiguredVoiceAI,
    },
    {
      id: 'calendar',
      title: 'Connect your calendar',
      description: 'Let the AI book appointments directly to your calendar',
      href: '/dashboard/settings?tab=integrations',
      icon: Calendar,
      isComplete: hasConnectedCalendar,
    },
    {
      id: 'test-call',
      title: 'Make a test call',
      description: 'Try out your AI receptionist to hear how it sounds',
      href: '/#demo',
      icon: Phone,
      isComplete: hasMadeTestCall,
    },
  ];

  const completedCount = checklistItems.filter((item) => item.isComplete).length;
  const progressPercent = (completedCount / checklistItems.length) * 100;
  const allComplete = completedCount === checklistItems.length;

  const handleDismiss = () => {
    localStorage.setItem('gettingStartedDismissed', 'true');
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed || allComplete) {
    return null;
  }

  return (
    <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Get Started with GreenLine AI</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete these steps to start receiving AI-answered calls
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Setup progress</span>
            <span className="font-medium">{completedCount} of {checklistItems.length} complete</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.isComplete
                    ? 'bg-white/50 border-green-200'
                    : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.isComplete ? 'bg-green-100' : 'bg-primary-100'
                  }`}
                >
                  {item.isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      item.isComplete ? 'text-muted-foreground line-through' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </p>
                  {!item.isComplete && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                </div>
                {!item.isComplete && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
