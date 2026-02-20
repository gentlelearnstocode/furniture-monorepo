'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import { Button } from '@repo/ui/ui/button';
import { Search, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import { type Product } from '@repo/shared';

interface SaleProductSelectorProps {
  eligibleProducts: Product[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
}

export function SaleProductSelector({
  eligibleProducts,
  selectedIds,
  onSelect,
}: SaleProductSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = eligibleProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader>
        <CardTitle>Select Products</CardTitle>
        <CardDescription>Only products with a &quot;Discount Price&quot; set can be added.</CardDescription>
        <div className='relative mt-2'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
          <Input
            placeholder='Search eligible products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8'
          />
        </div>
      </CardHeader>
      <CardContent className='flex-1 overflow-auto max-h-[300px]'>
        <div className='space-y-2'>
          {filtered.length === 0 ? (
            <p className='text-center py-4 text-sm text-gray-500'>
              {search ? 'No matching products found.' : 'No eligible products found.'}
            </p>
          ) : (
            filtered.map((product) => {
              const isSelected = selectedIds.has(product.id);
              const primaryImage = product.gallery?.[0]?.asset?.url;

              return (
                <div
                  key={product.id}
                  className='flex items-center gap-3 p-2 rounded-md border hover:bg-gray-50 transition-colors'
                >
                  <div className='relative h-10 w-10 rounded border overflow-hidden flex-shrink-0'>
                    {primaryImage ? (
                      <Image src={primaryImage} alt={product.name} fill className='object-cover' />
                    ) : (
                      <div className='w-full h-full bg-gray-100' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{product.name}</p>
                    <p className='text-xs text-green-600'>${String(product.discountPrice)}</p>
                  </div>
                  <Button
                    variant={isSelected ? 'secondary' : 'outline'}
                    size='sm'
                    disabled={isSelected}
                    onClick={() => onSelect(product.id)}
                    className='h-8 w-8 p-0'
                  >
                    {isSelected ? <Check className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
