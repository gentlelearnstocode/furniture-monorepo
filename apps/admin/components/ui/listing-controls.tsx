'use client';

import { Input } from '@repo/ui/ui/input';
import { Search, Filter } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';

interface SearchInputProps {
  placeholder?: string;
}

/**
 * Search input component for filtering listings by text search
 */
export function SearchInput({ placeholder = 'Search...' }: SearchInputProps) {
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

  return (
    <div className='relative flex-1 max-w-md'>
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
  );
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  filterKey: string;
  filterOptions: FilterOption[];
  filterPlaceholder?: string;
}

/**
 * Filter select component for filtering listings by dropdown options
 */
export function FilterSelect({
  filterKey,
  filterOptions,
  filterPlaceholder = 'Filter by...',
}: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleFilter = (value: string) => {
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

  // Extract descriptive name from placeholder (e.g., "Filter by Status" -> "All Statuses")
  const getAllLabel = () => {
    const match = filterPlaceholder.match(/Filter by (.+)/i);
    if (match && match[1]) {
      const filterName = match[1];
      // Simple pluralization: add 's' if it doesn't end with 's'
      const plural = filterName.endsWith('s') ? filterName : `${filterName}s`;
      return `All ${plural}`;
    }
    return 'All';
  };

  return (
    <Select defaultValue={searchParams.get(filterKey) || 'all'} onValueChange={handleFilter}>
      <SelectTrigger className='w-[180px]'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-gray-500' />
          <SelectValue placeholder={filterPlaceholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>{getAllLabel()}</SelectItem>
        {filterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
