'use client';

import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type TimePeriod = '7d' | '30d' | '90d' | 'mtd' | 'ytd';

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
  className?: string;
  variant?: 'buttons' | 'select';
}

const periods: { value: TimePeriod; label: string; shortLabel: string }[] = [
  { value: '7d', label: 'Last 7 days', shortLabel: '7D' },
  { value: '30d', label: 'Last 30 days', shortLabel: '30D' },
  { value: '90d', label: 'Last 90 days', shortLabel: '90D' },
  { value: 'mtd', label: 'Month to date', shortLabel: 'MTD' },
  { value: 'ytd', label: 'Year to date', shortLabel: 'YTD' },
];

export function TimePeriodSelector({
  value,
  onChange,
  className,
  variant = 'buttons',
}: TimePeriodSelectorProps) {
  if (variant === 'select') {
    return (
      <Select value={value} onValueChange={(v) => onChange(v as TimePeriod)}>
        <SelectTrigger className={cn('w-[140px]', className)}>
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
      {periods.slice(0, 4).map((period) => (
        <Button
          key={period.value}
          variant={value === period.value ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'h-7 px-3 text-xs font-medium',
            value === period.value
              ? 'bg-white shadow-sm text-foreground hover:bg-white'
              : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
          )}
          onClick={() => onChange(period.value)}
        >
          {period.shortLabel}
        </Button>
      ))}
    </div>
  );
}
