import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { SearchInput, FilterSelect } from '@/components/ui/listing-controls';
import { ReactNode } from 'react';

interface FilterConfig {
  key: string;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
}

interface ListingCardProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  children: ReactNode;
}

/**
 * Reusable listing card component
 * Wraps listing tables with consistent header, search, and filters
 */
export function ListingCard({
  title,
  description,
  searchPlaceholder,
  filters = [],
  children,
}: ListingCardProps) {
  return (
    <Card className='shadow-sm border-gray-200'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {(searchPlaceholder || filters.length > 0) && (
            <div className='flex flex-col sm:flex-row gap-2'>
              {searchPlaceholder && <SearchInput placeholder={searchPlaceholder} />}
              {filters.map((filter) => (
                <FilterSelect
                  key={filter.key}
                  filterKey={filter.key}
                  filterOptions={filter.options}
                  filterPlaceholder={filter.placeholder}
                />
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
