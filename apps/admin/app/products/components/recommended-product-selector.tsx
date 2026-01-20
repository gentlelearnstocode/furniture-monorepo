'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import { Button } from '@repo/ui/ui/button';
import { Search, Plus, X, GripVertical, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { updateRecommendedProducts } from '@/lib/actions/recommended-products';

type Product = {
  id: string;
  name: string;
  basePrice: string;
  discountPrice?: string | null;
  gallery: { asset: { url: string } }[];
};

interface RecommendedProductSelectorProps {
  productId: string;
  availableProducts: Product[];
  initialRecommended: Product[];
}

export function RecommendedProductSelector({
  productId,
  availableProducts,
  initialRecommended,
}: RecommendedProductSelectorProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product[]>(initialRecommended);
  const [isPending, startTransition] = useTransition();

  const selectedIds = new Set(selected.map((p) => p.id));

  const filtered = availableProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && !selectedIds.has(p.id),
  );

  const handleAdd = (product: Product) => {
    setSelected((prev) => [...prev, product]);
  };

  const handleRemove = (productId: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateRecommendedProducts(
        productId,
        selected.map((p) => p.id),
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Recommended products updated successfully');
      }
    });
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Available Products */}
      <Card className='flex flex-col h-full'>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
          <CardDescription>Search and add products to recommend</CardDescription>
          <div className='relative mt-2'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Search products...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-8'
            />
          </div>
        </CardHeader>
        <CardContent className='flex-1 overflow-auto max-h-[400px]'>
          <div className='space-y-2'>
            {filtered.length === 0 ? (
              <p className='text-center py-4 text-sm text-gray-500'>
                {search ? 'No matching products found.' : 'No available products.'}
              </p>
            ) : (
              filtered.slice(0, 20).map((product) => {
                const primaryImage = product.gallery?.[0]?.asset?.url;

                return (
                  <div
                    key={product.id}
                    className='flex items-center gap-3 p-2 rounded-md border hover:bg-gray-50 transition-colors'
                  >
                    <div className='relative h-10 w-10 rounded border overflow-hidden flex-shrink-0'>
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-100' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{product.name}</p>
                      <p className='text-xs text-gray-500'>${product.basePrice}</p>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleAdd(product)}
                      className='h-8 w-8 p-0'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Products */}
      <Card className='flex flex-col h-full'>
        <CardHeader>
          <CardTitle>Selected Recommendations</CardTitle>
          <CardDescription>
            {selected.length} product{selected.length !== 1 ? 's' : ''} selected
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 overflow-auto max-h-[400px]'>
          <div className='space-y-2'>
            {selected.length === 0 ? (
              <p className='text-center py-4 text-sm text-gray-500'>
                No products selected. Add products from the left panel.
              </p>
            ) : (
              selected.map((product, index) => {
                const primaryImage = product.gallery?.[0]?.asset?.url;

                return (
                  <div
                    key={product.id}
                    className='flex items-center gap-3 p-2 rounded-md border bg-gray-50'
                  >
                    <GripVertical className='h-4 w-4 text-gray-400 cursor-grab' />
                    <div className='relative h-10 w-10 rounded border overflow-hidden flex-shrink-0'>
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-100' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{product.name}</p>
                      <p className='text-xs text-gray-500'>Position: {index + 1}</p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRemove(product.id)}
                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
        <div className='p-4 border-t'>
          <Button onClick={handleSave} disabled={isPending} className='w-full'>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Check className='mr-2 h-4 w-4' />
                Save Recommendations
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
