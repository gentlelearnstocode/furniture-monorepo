'use client';

import { slugify } from '@/lib/utils/slugify';

import { CollectionWithRelations, Product, Catalog } from '@/types';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition, useState } from 'react';
import { createCollection, updateCollection } from '@/lib/actions/collections';
import { createCollectionSchema, type CreateCollectionInput } from '@/lib/validations/collections';

import { Button } from '@repo/ui/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/ui/form';
import { Input } from '@repo/ui/ui/input';
import { Switch } from '@repo/ui/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';
import { SingleImageUpload } from './single-image-upload';
import { ProductSelector } from './product-selector';
import { CatalogSelector } from './catalog-selector';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface CollectionFormProps {
  initialData?: CollectionWithRelations;
  availableProducts: Product[];
  availableCatalogs: Catalog[];
}

export function CollectionForm({
  initialData,
  availableProducts,
  availableCatalogs,
}: CollectionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [banner, setBanner] = useState<{ assetId: string; url: string } | null>(
    initialData?.banner ? { assetId: initialData.banner.id, url: initialData.banner.url } : null,
  );
  const form = useForm<CreateCollectionInput>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: initialData?.name || '',
      nameVi: initialData?.nameVi || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      descriptionVi: initialData?.descriptionVi || '',
      bannerId: initialData?.bannerId || null,
      isActive: initialData?.isActive ?? true,
      productIds: initialData?.products?.map((p) => p.productId) || [],
      catalogIds: initialData?.catalogs?.map((c) => c.catalogId) || [],
    },
  });

  function onSubmit(data: CreateCollectionInput) {
    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updateCollection(initialData.id, data);
      } else {
        result = await createCollection(data);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          initialData ? 'Collection updated successfully' : 'Collection created successfully',
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Name (English) *</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. Summer Sale 2024'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!initialData) {
                        // Simple slug generation only on create
                        const slug = slugify(e.target.value);
                        form.setValue('slug', slug);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='nameVi'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Name (Vietnamese)</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Khuyến Mãi Hè 2024' {...field} />
                </FormControl>
                <FormDescription className='text-xs'>
                  Optional Vietnamese translation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. summer-sale-2024'
                  {...field}
                  className='font-mono text-sm'
                />
              </FormControl>
              <FormDescription className='text-xs'>URL-friendly unique identifier.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='text-sm font-medium'>Description</h3>
          <Tabs defaultValue='en' className='w-full'>
            <TabsList className='grid w-full max-w-[200px] grid-cols-2'>
              <TabsTrigger value='en'>English</TabsTrigger>
              <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
            </TabsList>
            <TabsContent value='en'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        placeholder='Describe this collection...'
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Optional description for internal reference or SEO.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value='vi'>
              <FormField
                control={form.control}
                name='descriptionVi'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        placeholder='Mô tả bộ sưu tập...'
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Vietnamese translation (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='text-sm font-medium'>Collection Banner</h3>
          <FormField
            control={form.control}
            name='bannerId'
            render={() => (
              <FormItem>
                <FormControl>
                  <SingleImageUpload
                    value={banner}
                    onChange={(val) => {
                      setBanner(val);
                      form.setValue('bannerId', val?.assetId || null);
                    }}
                    folder={`collections/${form.getValues('slug') || 'general'}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4 pt-4 border-t'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Catalogs for this Collection</h3>
          </div>

          <FormField
            control={form.control}
            name='catalogIds'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CatalogSelector
                    availableCatalogs={availableCatalogs}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className='text-xs'>
                  Choose which catalogs this collection belongs to. (Optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4 pt-4 border-t'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Products in Collection</h3>
          </div>

          <FormField
            control={form.control}
            name='productIds'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProductSelector
                    availableProducts={availableProducts}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
              <div className='space-y-0.5'>
                <FormLabel>Active Status</FormLabel>
                <FormDescription>Make this collection visible on the storefront.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4 border-t gap-3'>
          <Button
            variant='outline'
            type='button'
            onClick={() => window.history.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isPending} className='min-w-[150px]'>
            {isPending
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
                ? 'Update Collection'
                : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
