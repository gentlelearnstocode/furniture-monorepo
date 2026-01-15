import { Card } from '@repo/ui/ui/card';

interface StatsCardProps {
  label: string;
  value: number | string;
  className?: string;
}

/**
 * Reusable stats card component
 * Used to display metrics on listing pages
 */
export function StatsCard({ label, value, className }: StatsCardProps) {
  return (
    <Card className={`p-4 flex flex-col justify-between ${className || ''}`}>
      <span className='text-sm font-medium text-gray-500'>{label}</span>
      <span className='text-2xl font-bold'>{value}</span>
    </Card>
  );
}
