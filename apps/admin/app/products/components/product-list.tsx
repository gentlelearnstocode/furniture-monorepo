'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import Image from 'next/image';
import { ProductActions } from './product-actions';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeleteProducts } from '@/lib/actions/products';
import { Settings, Percent, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/ui/tooltip';

interface ProductListProps {
  products: any[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function ProductList({ products, meta }: ProductListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <>
      <div className='relative overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-gray-50/50'>
              <TableHead className='w-[40px]'>
                <Checkbox
                  checked={selectedIds.length === products.length && products.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='w-[80px]'>Image</TableHead>
              <TableHead className='w-[300px]'>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Catalog</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-48 text-center text-gray-500'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Settings className='h-8 w-8 text-gray-300' />
                    <p>No products found matched your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const primaryImage = product.gallery?.[0]?.asset?.url;

                return (
                  <TableRow key={product.id} className='group'>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className='h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-[10px] text-gray-400'>
                            No Image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium text-gray-900'>{product.name}</span>
                        <div className='md:hidden text-xs text-gray-500 truncate max-w-[150px]'>
                          {product.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${product.basePrice}</TableCell>
                    <TableCell>
                      {product.catalog ? (
                        <Badge variant='outline' className='font-normal text-xs'>
                          {product.catalog.name}
                        </Badge>
                      ) : (
                        <span className='text-gray-400 text-xs'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.createdBy ? (
                        <span className='text-sm text-gray-600'>
                          {product.createdBy.name || product.createdBy.email}
                        </span>
                      ) : (
                        <span className='text-gray-400 text-xs'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                          className={
                            product.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          }
                        >
                          {product.isActive ? 'Active' : 'Draft'}
                        </Badge>

                        {/* Sale indicator */}
                        {product.discountPrice && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='w-6 h-6 rounded-full bg-red-100 flex items-center justify-center'>
                                  <Percent className='h-3.5 w-3.5 text-red-600' />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>On Sale (${product.discountPrice})</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {/* Price hidden indicator */}
                        {product.showPrice === false && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center'>
                                  <EyeOff className='h-3.5 w-3.5 text-gray-500' />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Price Hidden</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <ProductActions product={product} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} />

      <BulkActions
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onDelete={bulkDeleteProducts}
        resourceName='Product'
      />
    </>
  );
}
