'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';

import { cn } from '@repo/ui/lib/utils';

type OverviewChartProps = {
  data: {
    name: string;
    total: number;
  }[];
  className?: string;
};

export function OverviewChart({ data, className }: OverviewChartProps) {
  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Total visits over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className='pl-2 flex-1 min-h-[350px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorTotal' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#000000' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#000000' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='name'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              minTickGap={30}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
            />
            <Area
              type='monotone'
              dataKey='total'
              stroke='#000000'
              strokeWidth={2}
              fillOpacity={1}
              fill='url(#colorTotal)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
