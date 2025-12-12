'use client';

import Link from 'next/link';
import {
  Phone,
  Settings,
  Calendar,
  Headphones,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  external?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'test-call',
    label: 'Test Call',
    description: 'Try your AI receptionist',
    href: '/#demo',
    icon: Phone,
    color: 'green',
  },
  {
    id: 'settings',
    label: 'AI Settings',
    description: 'Configure voice & responses',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'blue',
  },
  {
    id: 'recordings',
    label: 'Recordings',
    description: 'Listen to recent calls',
    href: '/dashboard/calls',
    icon: Headphones,
    color: 'purple',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'View appointments',
    href: '/dashboard/meetings',
    icon: Calendar,
    color: 'orange',
  },
];

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-100',
  },
  green: {
    bg: 'bg-green-50 hover:bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-100',
  },
  purple: {
    bg: 'bg-purple-50 hover:bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-100',
  },
  orange: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    icon: 'text-orange-600',
    border: 'border-orange-100',
  },
  pink: {
    bg: 'bg-pink-50 hover:bg-pink-100',
    icon: 'text-pink-600',
    border: 'border-pink-100',
  },
};

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colors = colorStyles[action.color];

            return (
              <Link
                key={action.id}
                href={action.href}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200',
                  colors.bg,
                  colors.border,
                  'hover:shadow-sm hover:scale-[1.02]'
                )}
              >
                <div className={cn('mb-2', colors.icon)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">{action.label}</span>
                <span className="text-xs text-muted-foreground text-center mt-0.5 hidden sm:block">
                  {action.description}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
