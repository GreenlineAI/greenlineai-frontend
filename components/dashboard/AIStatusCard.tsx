'use client';

import Link from 'next/link';
import {
  Bot,
  CheckCircle,
  Phone,
  Settings,
  PlayCircle,
  Wifi,
  WifiOff,
  Clock,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AIStatusCardProps {
  isActive?: boolean;
  isOnCall?: boolean;
  todayCalls?: number;
  avgResponseTime?: number; // in seconds
  className?: string;
}

export function AIStatusCard({
  isActive = true,
  isOnCall = false,
  todayCalls = 0,
  avgResponseTime = 1.2,
  className,
}: AIStatusCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden',
        isActive
          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
        className
      )}
    >
      <CardContent className="p-0">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Status */}
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm',
                  isActive ? 'bg-green-600' : 'bg-slate-400'
                )}
              >
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">AI Receptionist</h3>
                  <Badge
                    className={cn(
                      'text-xs',
                      isOnCall
                        ? 'bg-blue-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-400 text-white'
                    )}
                  >
                    {isOnCall ? 'On Call' : isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isActive
                    ? 'Answering calls 24/7 and booking appointments'
                    : 'Your AI is currently offline'}
                </p>
              </div>
            </div>

            {/* Right: Quick Stats (desktop only) */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{todayCalls}</p>
                <p className="text-xs text-muted-foreground">Calls today</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{avgResponseTime}s</p>
                <p className="text-xs text-muted-foreground">Avg response</p>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-sm">
              {isActive ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Disconnected</span>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Available 24/7</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Instant pickup</span>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="flex items-center gap-4 mt-4 lg:hidden">
            <div className="flex-1 bg-white/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold">{todayCalls}</p>
              <p className="text-xs text-muted-foreground">Calls today</p>
            </div>
            <div className="flex-1 bg-white/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold">{avgResponseTime}s</p>
              <p className="text-xs text-muted-foreground">Avg response</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-4 sm:px-5 pb-4 sm:pb-5">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-white" asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-1.5 h-4 w-4" />
              Configure
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-white" asChild>
            <Link href="/#demo">
              <PlayCircle className="mr-1.5 h-4 w-4" />
              Test Call
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex bg-white" asChild>
            <Link href="/dashboard/calls">
              <Phone className="mr-1.5 h-4 w-4" />
              View Calls
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
