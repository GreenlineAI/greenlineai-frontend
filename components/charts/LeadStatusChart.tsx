'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { LeadStatusDistribution } from '@/lib/types';

interface LeadStatusChartProps {
  data: LeadStatusDistribution[];
  isLoading?: boolean;
  title?: string;
}

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  meeting_scheduled: 'Meeting',
  not_interested: 'Not Interested',
  no_answer: 'No Answer',
  invalid: 'Invalid',
};

export function LeadStatusChart({
  data,
  isLoading,
  title = 'Lead Status Distribution',
}: LeadStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    label: statusLabels[item.status] || item.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
