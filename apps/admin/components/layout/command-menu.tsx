'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  FolderTree,
  Layers,
  Briefcase,
  DraftingCompass,
  Newspaper,
  UserCog,
  Search,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/ui/command';
import { searchEntities, type SearchResult } from '@/lib/actions/search';
import { useDebounce } from '@repo/ui/hooks/use-debounce';
import { cn } from '@repo/ui/lib/utils';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const searchResults = await searchEntities(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const groups = React.useMemo(() => {
    const grouped = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type]!.push(result);
      return acc;
    }, {});
    return grouped;
  }, [results]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className='mr-2 h-4 w-4' />;
      case 'catalog':
        return <FolderTree className='mr-2 h-4 w-4' />;
      case 'collection':
        return <Layers className='mr-2 h-4 w-4' />;
      case 'service':
        return <Briefcase className='mr-2 h-4 w-4' />;
      case 'project':
        return <DraftingCompass className='mr-2 h-4 w-4' />;
      case 'blog':
        return <Newspaper className='mr-2 h-4 w-4' />;
      case 'user':
        return <UserCog className='mr-2 h-4 w-4' />;
      default:
        return <Search className='mr-2 h-4 w-4' />;
    }
  };

  const labels: Record<string, string> = {
    product: 'Products',
    catalog: 'Catalogs',
    collection: 'Collections',
    service: 'Services',
    project: 'Projects',
    blog: 'Blog Posts',
    user: 'Admin Users',
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='relative group inline-flex items-center justify-start h-10 w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm text-gray-500 font-medium shadow-sm transition-all hover:bg-gray-50 hover:border-brand-primary-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 disabled:pointer-events-none disabled:opacity-50 sm:pr-12'
      >
        <Search className='mr-2.5 h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand-primary-500 transition-colors' />
        <span className='inline-flex'>Search everything...</span>
        <kbd className='pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 font-mono text-[10px] font-bold text-gray-400 opacity-100 group-hover:bg-brand-primary-50 group-hover:text-brand-primary-600 group-hover:border-brand-primary-100 transition-all sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Type to search products, catalogs, services...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className='scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent'>
          {loading && results.length === 0 && (
            <div className='py-12 flex flex-col items-center justify-center text-sm text-gray-500 gap-3'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-brand-primary-100 border-t-brand-primary-600' />
              <p className='font-medium animate-pulse'>Searching the furniture realm...</p>
            </div>
          )}
          <CommandEmpty className='py-12 text-center text-sm flex flex-col items-center justify-center gap-2'>
            <div className='h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-2'>
              <Search className='h-6 w-6 text-gray-300' />
            </div>
            <p className='font-semibold text-gray-900'>No results found</p>
            <p className='text-gray-500'>Try searching for something else.</p>
          </CommandEmpty>
          {Object.entries(groups).map(([type, items]) => (
            <CommandGroup key={type} heading={labels[type] || type} className='px-2'>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.subtitle || ''}`}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  className='flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-brand-primary-50 aria-selected:text-brand-primary-900 transition-all group/item'
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white group-aria-selected/item:border-brand-primary-200 group-aria-selected/item:shadow-sm transition-all',
                      type === 'product' && 'text-blue-500 group-aria-selected/item:text-blue-600',
                      type === 'catalog' &&
                        'text-emerald-500 group-aria-selected/item:text-emerald-600',
                      type === 'collection' &&
                        'text-orange-500 group-aria-selected/item:text-orange-600',
                      type === 'service' &&
                        'text-purple-500 group-aria-selected/item:text-purple-600',
                      type === 'project' &&
                        'text-amber-500 group-aria-selected/item:text-amber-600',
                      type === 'blog' && 'text-rose-500 group-aria-selected/item:text-rose-600',
                      type === 'user' && 'text-indigo-500 group-aria-selected/item:text-indigo-600',
                    )}
                  >
                    {getIcon(item.type)}
                  </div>
                  <div className='flex flex-col gap-0.5 overflow-hidden'>
                    <span className='font-semibold text-gray-900 group-aria-selected/item:text-brand-primary-900 truncate'>
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className='text-xs text-gray-400 group-aria-selected/item:text-brand-primary-700/60 truncate'>
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  <div className='ml-auto opacity-0 group-aria-selected/item:opacity-100 transition-opacity'>
                    <kbd className='rounded bg-white/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-primary-600 border border-brand-primary-100'>
                      ⏎
                    </kbd>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
