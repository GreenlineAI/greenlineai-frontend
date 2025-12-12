'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'call' | 'appointment' | 'alert' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  className?: string;
}

const notificationIcons = {
  call: Phone,
  appointment: Calendar,
  alert: AlertCircle,
  success: CheckCircle,
};

const notificationColors = {
  call: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  appointment: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
  },
  alert: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
  },
  success: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
  },
};

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'call',
    title: 'Missed Call',
    message: 'Call from +1 (555) 123-4567 went to voicemail',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/dashboard/calls',
  },
  {
    id: '2',
    type: 'appointment',
    title: 'New Appointment',
    message: 'Sarah Johnson booked a consultation for tomorrow at 2 PM',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/dashboard/meetings',
  },
  {
    id: '3',
    type: 'success',
    title: 'AI Updated',
    message: 'Your voice AI settings have been saved successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export function NotificationBell({ notifications = sampleNotifications, className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('relative h-9 w-9 p-0', className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[320px]">
          {localNotifications.length > 0 ? (
            <div className="divide-y">
              {localNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colors = notificationColors[notification.type];

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-3 p-3 transition-colors hover:bg-muted/50',
                      !notification.read && 'bg-primary-50/50'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={cn('rounded-full p-2 flex-shrink-0', colors.bg)}>
                      <Icon className={cn('h-4 w-4', colors.icon)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm', !notification.read && 'font-medium')}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="inline-flex items-center gap-1 text-xs text-primary mt-1.5 hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          View details
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="mr-1.5 h-3.5 w-3.5" />
              Notification settings
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
