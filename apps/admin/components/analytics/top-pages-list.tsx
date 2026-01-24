import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/ui/card';
import { Progress } from '@repo/ui/ui/progress';

import { cn } from '@repo/ui/lib/utils';

type TopPagesListProps = {
  data: {
    path: string;
    visits: number;
  }[];
  className?: string;
  title?: string;
  description?: string;
};

export function TopPagesList({
  data,
  className,
  title = 'Top Pages',
  description = 'Most visited pages this month',
}: TopPagesListProps) {
  // Find max visits to calculate percentage
  const maxVisits = Math.max(...data.map((p) => p.visits), 0);

  const colors = [
    '!bg-blue-500',
    '!bg-purple-500',
    '!bg-emerald-500',
    '!bg-amber-500',
    '!bg-rose-500',
    '!bg-cyan-500',
    '!bg-indigo-500',
    '!bg-lime-500',
  ];

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='space-y-4 h-full'>
          {data.length === 0 ? (
            <div className='flex h-full items-center justify-center text-sm text-muted-foreground min-h-[200px]'>
              No data available
            </div>
          ) : (
            data.map((page, index) => {
              const colorClass = colors[index % colors.length];
              return (
                <div key={page.path} className='flex flex-col gap-1'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium truncate max-w-[250px]' title={page.path}>
                      {page.path}
                    </span>
                    <span className='text-muted-foreground'>{page.visits}</span>
                  </div>
                  <Progress
                    value={(page.visits / maxVisits) * 100}
                    className='h-2'
                    indicatorClassName={colorClass}
                  />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
