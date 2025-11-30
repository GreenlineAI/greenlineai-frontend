'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyCallStats } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface CallsLineChartProps {
  data: DailyCallStats[];
  isLoading?: boolean;
  title?: string;
}

export function CallsLineChart({
  data,
  isLoading,
  title = 'Calls per Day',
}: CallsLineChartProps) {
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
    formattedDate: format(parseISO(item.date), 'MMM d'),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Total Calls"
            />
            <Line
              type="monotone"
              dataKey="connected"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Connected"
            />
            <Line
              type="monotone"
              dataKey="meetings"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              name="Meetings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
