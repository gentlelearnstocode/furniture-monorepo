'use client';

import { slugify } from '@/lib/utils/slugify';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCatalog, updateCatalog } from '@/lib/actions/catalogs';
import { createCatalogSchema, type CreateCatalogInput } from '@/lib/validations/catalogs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { useState } from 'react';
import { SingleImageUpload } from '../../collections/components/single-image-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';

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
import { Textarea } from '@repo/ui/ui/textarea';

interface CatalogFormProps {
  initialData?: {
    id: string;
    name: string;
    nameVi?: string | null;
    slug: string;
    description: string | null;
    descriptionVi?: string | null;
    parentId: string | null;
    imageId?: string | null;
    image?: {
      url: string;
    } | null;
    productImageRatio?: string | null;
  };
  hasChildren?: boolean;
  parentCatalogs?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function CatalogForm({
  initialData,
  parentCatalogs = [],
  hasChildren = false,
}: CatalogFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateCatalogInput>({
    resolver: zodResolver(createCatalogSchema),
    defaultValues: {
      name: initialData?.name || '',
      nameVi: initialData?.nameVi || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      descriptionVi: initialData?.descriptionVi || '',
      parentId: initialData?.parentId || null,
      level: initialData?.parentId ? 2 : 1,
      imageId: initialData?.imageId || null,
      productImageRatio: initialData?.productImageRatio || '4:5',
    },
  });

  const [banner, setBanner] = useState<{ assetId: string; url: string } | null>(
    initialData?.image
      ? { assetId: initialData.imageId as string, url: initialData.image.url }
      : null,
  );

  function onSubmit(data: CreateCatalogInput) {
    // Transform "none" back to null for the server and compute level
    const parentId = data.parentId === 'none' ? null : data.parentId;
    const processedData = {
      ...data,
      parentId,
      level: parentId ? 2 : 1,
    };

    startTransition(async () => {
      const result = initialData
        ? await updateCatalog(initialData.id, processedData)
        : await createCatalog(processedData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? 'Catalog updated' : 'Catalog created');
        router.push('/catalogs');
        router.refresh();
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
                <FormLabel>Catalog Name (English) *</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. Living Room'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Simple slug generation only if not editing or slug is empty
                      if (!initialData) {
                        const parentId = form.getValues('parentId');
                        let slug = slugify(e.target.value);

                        // If parent is selected, prefix slug with parent slug
                        if (parentId && parentId !== 'none') {
                          const parent = parentCatalogs.find((c) => c.id === parentId);
                          if (parent) {
                            slug = `${parent.slug}-${slug}`;
                          }
                        }

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
                <FormLabel>Catalog Name (Vietnamese)</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Phòng Khách' {...field} />
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
                  placeholder='e.g. living-room'
                  {...field}
                  className='font-mono text-sm'
                  disabled={!!initialData} // Usually slug shouldn't change for SEO after creation
                />
              </FormControl>
              <FormDescription className='text-xs'>
                URL-friendly unique identifier.{' '}
                {initialData && '(Slug cannot be changed after creation)'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='parentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Catalog</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === 'none' ? null : val)}
                defaultValue={field.value || 'none'}
                value={field.value || 'none'}
                disabled={hasChildren}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a parent catalog (optional)' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='none'>None (Root Category)</SelectItem>
                  {parentCatalogs.map((catalog) => (
                    <SelectItem key={catalog.id} value={catalog.id}>
                      {catalog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className='text-xs'>
                {hasChildren
                  ? 'This catalog has subcategories and must remain a Level 1 catalog.'
                  : 'Select a parent category if this is a subcategory (e.g., "Tables" under "Living Room").'}
              </FormDescription>
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
                      <Textarea
                        placeholder='Describe this catalog category...'
                        className='min-h-[120px] resize-none'
                        {...field}
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
                      <Textarea
                        placeholder='Mô tả danh mục...'
                        className='min-h-[120px] resize-none'
                        {...field}
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

        <FormField
          control={form.control}
          name='productImageRatio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image Ratio</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || '4:5'}
                value={field.value || '4:5'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an image ratio' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='original'>Original</SelectItem>
                  <SelectItem value='1:1'>1:1 (Square)</SelectItem>
                  <SelectItem value='3:4'>3:4 (Portrait)</SelectItem>
                  <SelectItem value='4:3'>4:3 (Landscape)</SelectItem>
                  <SelectItem value='4:5'>4:5 (Standard)</SelectItem>
                  <SelectItem value='16:9'>16:9 (Wide)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className='text-xs'>
                This ratio will be applied to product cards in the catalog product listing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='text-sm font-medium'>Catalog Image</h3>
          <FormField
            control={form.control}
            name='imageId'
            render={() => (
              <FormItem>
                <FormControl>
                  <SingleImageUpload
                    value={banner}
                    onChange={(val) => {
                      setBanner(val);
                      form.setValue('imageId', val?.assetId || null);
                    }}
                    folder={`catalogs/${form.getValues('slug') || 'general'}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
                ? 'Update Catalog'
                : 'Create Catalog'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
