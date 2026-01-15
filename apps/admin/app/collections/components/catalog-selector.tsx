'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@repo/ui/ui/sheet';
import { Button } from '@repo/ui/ui/button';
import { Input } from '@repo/ui/ui/input';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { cn } from '@repo/ui/lib/utils';
import { Catalog } from '@/types';

interface CatalogSelectorProps {
  availableCatalogs: Catalog[];
  value: string[];
  onChange: (value: string[]) => void;
}

const ITEMS_PER_PAGE = 8;

export function CatalogSelector({ availableCatalogs, value, onChange }: CatalogSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Internal selection state to allow "Apply" behavior
  const [tempSelection, setTempSelection] = useState<string[]>(value);

  // Sync temp selection when opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempSelection(value);
      setSearchTerm('');
      setCurrentPage(1);
    }
  };

  const filteredCatalogs = useMemo(() => {
    return availableCatalogs.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableCatalogs, searchTerm]);

  const totalPages = Math.ceil(filteredCatalogs.length / ITEMS_PER_PAGE);
  const paginatedCatalogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCatalogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCatalogs, currentPage]);

  const toggleCatalog = (id: string) => {
    setTempSelection((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleApply = () => {
    onChange(tempSelection);
    setIsOpen(false);
  };

  const selectedCatalogsDisplay = useMemo(() => {
    return availableCatalogs.filter((c) => value.includes(c.id));
  }, [availableCatalogs, value]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-700'>{value.length} Catalogs Selected</span>
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' type='button'>
              <Plus className='h-4 w-4 mr-2' />
              Manage Catalogs
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='sm:max-w-xl flex flex-col h-full'>
            <SheetHeader className='pb-4'>
              <SheetTitle>Select Catalogs</SheetTitle>
              <SheetDescription>Search and add catalogs to this collection.</SheetDescription>
            </SheetHeader>

            <div className='flex-1 flex flex-col space-y-4 min-h-0'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search by name or slug...'
                  className='pl-9'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className='border rounded-md flex-1 overflow-auto'>
                <Table>
                  <TableHeader className='sticky top-0 bg-white z-10'>
                    <TableRow>
                      <TableHead className='w-[50px]'></TableHead>
                      <TableHead>Catalog</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCatalogs.length > 0 ? (
                      paginatedCatalogs.map((catalog) => (
                        <TableRow
                          key={catalog.id}
                          className={cn(
                            'cursor-pointer',
                            tempSelection.includes(catalog.id) && 'bg-brand-primary-50/50'
                          )}
                          onClick={() => toggleCatalog(catalog.id)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={tempSelection.includes(catalog.id)}
                              onCheckedChange={() => toggleCatalog(catalog.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col'>
                              <span className='font-medium text-sm'>{catalog.name}</span>
                              <span className='text-[10px] text-gray-400 font-mono'>
                                {catalog.slug}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className='text-center py-10 text-gray-500'>
                          No catalogs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className='flex items-center justify-between py-2'>
                  <p className='text-xs text-gray-500'>
                    Page {currentPage} of {totalPages} ({filteredCatalogs.length} items)
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <SheetFooter className='pt-4 border-t sm:justify-between flex-row items-center'>
              <div className='text-sm font-medium text-brand-primary-600'>
                {tempSelection.length} selected
              </div>
              <div className='flex gap-3'>
                <SheetClose asChild>
                  <Button variant='ghost' size='sm'>
                    Cancel
                  </Button>
                </SheetClose>
                <Button size='sm' onClick={handleApply}>
                  Apply Changes
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Selected Catalogs Grid/List */}
      <div className='border rounded-md bg-gray-50/50 min-h-[100px] p-2'>
        {selectedCatalogsDisplay.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {selectedCatalogsDisplay.map((catalog) => (
              <div
                key={catalog.id}
                className='flex items-center justify-between bg-white border rounded p-2 text-xs'
              >
                <div className='flex items-center gap-2 overflow-hidden'>
                  <LayoutGrid className='h-3 w-3 text-gray-400 flex-shrink-0' />
                  <Link
                    href={`/catalogs/${catalog.id}`}
                    className='truncate font-medium hover:text-brand-primary-600 hover:underline transition-colors'
                  >
                    {catalog.name}
                  </Link>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5 text-gray-400 hover:text-red-500'
                  onClick={() => onChange(value.filter((id) => id !== catalog.id))}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className='h-24 flex flex-col items-center justify-center text-gray-400 text-sm'>
            <LayoutGrid className='h-8 w-8 mb-1 opacity-20' />
            <p>No catalogs selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
