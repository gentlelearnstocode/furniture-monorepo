'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, X, ChevronLeft, ChevronRight, Package } from 'lucide-react';
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

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: string | number;
}

interface ProductSelectorProps {
  availableProducts: Product[];
  value: string[];
  onChange: (value: string[]) => void;
}

const ITEMS_PER_PAGE = 8;

export function ProductSelector({ availableProducts, value, onChange }: ProductSelectorProps) {
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

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableProducts, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const toggleProduct = (id: string) => {
    setTempSelection((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleApply = () => {
    onChange(tempSelection);
    setIsOpen(false);
  };

  const selectedProductsDisplay = useMemo(() => {
    return availableProducts.filter((p) => value.includes(p.id));
  }, [availableProducts, value]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-gray-700'>{value.length} Products Selected</span>
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' type='button'>
              <Plus className='h-4 w-4 mr-2' />
              Manage Products
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='sm:max-w-xl flex flex-col h-full'>
            <SheetHeader className='pb-4'>
              <SheetTitle>Select Products</SheetTitle>
              <SheetDescription>Search and add products to this collection.</SheetDescription>
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
                      <TableHead>Product</TableHead>
                      <TableHead className='text-right'>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product) => (
                        <TableRow
                          key={product.id}
                          className={cn(
                            'cursor-pointer',
                            tempSelection.includes(product.id) && 'bg-brand-primary-50/50'
                          )}
                          onClick={() => toggleProduct(product.id)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={tempSelection.includes(product.id)}
                              onCheckedChange={() => toggleProduct(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col'>
                              <span className='font-medium text-sm'>{product.name}</span>
                              <span className='text-[10px] text-gray-400 font-mono'>
                                {product.slug}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='text-right text-sm'>
                            ${parseFloat(product.basePrice as any).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className='text-center py-10 text-gray-500'>
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className='flex items-center justify-between py-2'>
                  <p className='text-xs text-gray-500'>
                    Page {currentPage} of {totalPages} ({filteredProducts.length} items)
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

      {/* Selected Products Grid/List */}
      <div className='border rounded-md bg-gray-50/50 min-h-[100px] p-2'>
        {selectedProductsDisplay.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {selectedProductsDisplay.slice(0, 10).map((product) => (
              <div
                key={product.id}
                className='flex items-center justify-between bg-white border rounded p-2 text-xs'
              >
                <div className='flex items-center gap-2 overflow-hidden'>
                  <Package className='h-3 w-3 text-gray-400 flex-shrink-0' />
                  <span className='truncate font-medium'>{product.name}</span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5 text-gray-400 hover:text-red-500'
                  onClick={() => onChange(value.filter((id) => id !== product.id))}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
            {selectedProductsDisplay.length > 10 && (
              <div className='col-span-full text-center py-1 text-[10px] text-gray-400 italic'>
                ...and {selectedProductsDisplay.length - 10} more products
              </div>
            )}
          </div>
        ) : (
          <div className='h-24 flex flex-col items-center justify-center text-gray-400 text-sm'>
            <Package className='h-8 w-8 mb-1 opacity-20' />
            <p>No products selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
