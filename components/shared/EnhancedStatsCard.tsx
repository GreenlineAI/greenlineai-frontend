'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SparklineData {
  value: number;
}

interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  sparklineData?: SparklineData[];
  accentColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
  onClick?: () => void;
}

// Simple sparkline component
function Sparkline({ data, color }: { data: SparklineData[]; color: string }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const width = 80;
  const height = 24;
  const padding = 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const accentColors = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    sparkline: '#3B82F6',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    sparkline: '#10B981',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
    sparkline: '#8B5CF6',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    iconBg: 'bg-orange-100',
    sparkline: '#F97316',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
    sparkline: '#EF4444',
  },
};

export function EnhancedStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  sparklineData,
  accentColor = 'blue',
  className,
  onClick,
}: EnhancedStatsCardProps) {
  const colors = accentColors[accentColor];

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:border-primary-300',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5',
                    trend.value === 0
                      ? 'text-muted-foreground bg-muted'
                      : trend.isPositive
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  )}
                >
                  {trend.value === 0 ? (
                    <Minus className="h-3 w-3" />
                  ) : trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn('rounded-xl p-2.5', colors.iconBg)}>
            <Icon className={cn('h-5 w-5', colors.icon)} />
          </div>
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last 7 days</span>
              <Sparkline data={sparklineData} color={colors.sparkline} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
