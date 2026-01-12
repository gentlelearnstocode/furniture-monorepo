'use client';

import { Button } from '@repo/ui/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const onPageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-between px-2 py-4'>
      <div className='flex-1 text-sm text-muted-foreground'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
        >
          <span className='sr-only'>Go to first page</span>
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <span className='sr-only'>Go to last page</span>
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
