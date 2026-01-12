'use client';

import { Input } from '@repo/ui/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';

interface FilterOption {
  label: string;
  value: string;
}

interface ListingControlsProps {
  placeholder?: string;
  filterKey?: string;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
}

export function ListingControls({
  placeholder = 'Search...',
  filterKey,
  filterOptions,
  filterPlaceholder = 'Filter by...',
}: ListingControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleFilter = (value: string) => {
    if (!filterKey) return;
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(filterKey, value);
    } else {
      params.delete(filterKey);
    }
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-4 flex-1 max-w-2xl'>
      <div className='relative flex-1'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
        <Input
          placeholder={placeholder}
          className='pl-8'
          defaultValue={searchParams.get('search')?.toString()}
          onChange={(e) => {
            const val = e.target.value;
            // Debounce would be nice, but simple for now
            setTimeout(() => handleSearch(val), 300);
          }}
        />
      </div>
      {filterKey && filterOptions && (
        <Select defaultValue={searchParams.get(filterKey) || 'all'} onValueChange={handleFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
