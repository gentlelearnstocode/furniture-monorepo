'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@repo/ui/ui/button';
import { Input } from '@repo/ui/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/ui/card';
import { Switch } from '@repo/ui/ui/switch';
import { Label } from '@repo/ui/ui/label';
import { GripVertical, Trash2, Save, Loader2, PackageSearch } from 'lucide-react';
import { updateSaleSettings, reorderSaleProducts } from '@/lib/actions/sale';
import { SaleProductSelector } from './sale-product-selector';
import { cn } from '@repo/ui/lib/utils';

type Product = {
  id: string;
  name: string;
  shortDescription?: string | null;
  basePrice: string;
  discountPrice?: string | null;
  gallery: { asset: { url: string } }[];
};

type SaleProduct = {
  id: string;
  productId: string;
  position: number;
  product: Product;
};

interface SaleManagementProps {
  initialSettings: { title: string; isActive: boolean };
  initialSaleProducts: SaleProduct[];
  eligibleProducts: Product[];
}

function SortableProduct({
  saleProduct,
  onRemove,
}: {
  saleProduct: SaleProduct;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: saleProduct.productId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const primaryImage = saleProduct.product.gallery?.[0]?.asset?.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-blue-500/50 z-50',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className='cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors'
      >
        <GripVertical className='h-5 w-5 text-gray-400' />
      </button>

      <div className='relative h-12 w-12 rounded border overflow-hidden flex-shrink-0'>
        {primaryImage ? (
          <Image src={primaryImage} alt={saleProduct.product.name} fill className='object-cover' />
        ) : (
          <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
            <PackageSearch className='h-6 w-6 text-gray-400' />
          </div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <p className='font-medium text-sm truncate'>{saleProduct.product.name}</p>
        <p className='text-xs text-gray-500'>
          ${saleProduct.product.discountPrice}{' '}
          <span className='line-through text-gray-400 font-normal ml-1'>
            ${saleProduct.product.basePrice}
          </span>
        </p>
      </div>

      <Button
        variant='ghost'
        size='icon'
        onClick={onRemove}
        className='text-red-500 hover:text-red-700 hover:bg-red-50'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

export function SaleManagement({
  initialSettings,
  initialSaleProducts,
  eligibleProducts,
}: SaleManagementProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saleProducts, setSaleProducts] = useState(initialSaleProducts);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSaleProducts((items) => {
        const oldIndex = items.findIndex((i) => i.productId === active.id);
        const newIndex = items.findIndex((i) => i.productId === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, position: idx }));
      });
    }
  }

  function handleRemove(productId: string) {
    setSaleProducts((prev) => prev.filter((p) => p.productId !== productId));
  }

  function handleAdd(productId: string) {
    const product = eligibleProducts.find((p) => p.id === productId);
    if (!product) return;

    const newSaleProduct: SaleProduct = {
      id: `new-${Date.now()}`,
      productId,
      position: saleProducts.length,
      product,
    };
    setSaleProducts([...saleProducts, newSaleProduct]);
  }

  async function handleSave() {
    startTransition(async () => {
      try {
        const settingsResult = await updateSaleSettings(settings);
        if (settingsResult?.error) {
          toast.error(settingsResult.error);
          return;
        }

        const productsResult = await reorderSaleProducts(saleProducts.map((p) => p.productId));
        if (productsResult?.error) {
          toast.error(productsResult.error);
          return;
        }

        toast.success('Sale section updated successfully');
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  return (
    <div className='space-y-8'>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Section Settings</CardTitle>
            <CardDescription>
              Configure how the sale section appears on the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Section Title</Label>
              <Input
                id='title'
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder='e.g. SUMMER SALES'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='active'
                checked={settings.isActive}
                onCheckedChange={(val) => setSettings({ ...settings, isActive: val })}
              />
              <Label htmlFor='active'>Show section on homepage</Label>
            </div>
          </CardContent>
        </Card>

        <SaleProductSelector
          eligibleProducts={eligibleProducts}
          selectedIds={new Set(saleProducts.map((p) => p.productId))}
          onSelect={handleAdd}
        />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Display Products</CardTitle>
            <CardDescription>
              Drag to reorder products. These will appear in the homepage sale section (max 4).
            </CardDescription>
          </div>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <DndContext
            id='sale-management-dnd'
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={saleProducts.map((p) => p.productId)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3'>
                {saleProducts.length === 0 ? (
                  <div className='py-8 text-center border-2 border-dashed rounded-lg text-gray-500'>
                    No products selected for the sale section.
                  </div>
                ) : (
                  saleProducts.map((p) => (
                    <SortableProduct
                      key={p.productId}
                      saleProduct={p}
                      onRemove={() => handleRemove(p.productId)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
