'use client';

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
import { Switch } from '@repo/ui/ui/switch';

interface CatalogFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    imageId?: string | null;
    image?: {
      url: string;
    } | null;
    showOnHome?: boolean;
    displayOrder?: number;
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
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      parentId: initialData?.parentId || null,
      level: initialData?.parentId ? 2 : 1,
      imageId: initialData?.imageId || null,
      showOnHome: initialData?.showOnHome ?? false,
      displayOrder: initialData?.displayOrder ?? 0,
    },
  });

  const [banner, setBanner] = useState<{ assetId: string; url: string } | null>(
    initialData?.image
      ? { assetId: initialData.imageId as string, url: initialData.image.url }
      : null
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
                <FormLabel>Catalog Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. Living Room'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Simple slug generation only if not editing or slug is empty
                      if (!initialData) {
                        const parentId = form.getValues('parentId');
                        let slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');

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
        </div>

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

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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

        {/* Show on Home Settings - Only for Level 1 catalogs */}
        {!form.watch('parentId') && (
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium'>Homepage Display</h3>
            <FormField
              control={form.control}
              name='showOnHome'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Show on Home Page</FormLabel>
                    <FormDescription>
                      Display this catalog in the featured section on the home page.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('showOnHome') && (
              <FormField
                control={form.control}
                name='displayOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value ?? 0}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Lower numbers appear first on the homepage (0, 1, 2...).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

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
