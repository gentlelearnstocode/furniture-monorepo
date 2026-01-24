'use client';

import { slugify } from '@/lib/utils/slugify';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { createProductSchema, type CreateProductInput } from '@/lib/validations/products';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';

import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface CatalogOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  catalogs: CatalogOption[];
  initialData?: CreateProductInput & { id: string };
}

export function ProductForm({ catalogs, initialData }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          basePrice: parseFloat(initialData.basePrice as any),
          discountPrice: initialData.discountPrice
            ? parseFloat(initialData.discountPrice as any)
            : undefined,
          showPrice: initialData.showPrice ?? true,
          description: initialData.description || '',
          descriptionVi: initialData.descriptionVi || '',
          shortDescription: initialData.shortDescription || '',
          shortDescriptionVi: initialData.shortDescriptionVi || '',
          nameVi: initialData.nameVi || '',
        }
      : {
          name: '',
          nameVi: '',
          slug: '',
          description: '',
          descriptionVi: '',
          shortDescription: '',
          shortDescriptionVi: '',
          basePrice: 0,
          discountPrice: undefined,
          showPrice: true,
          isActive: true,
          catalogId: undefined,
          dimensions: {
            width: 0,
            height: 0,
            depth: 0,
            unit: 'cm',
          },
          images: [],
        },
  });

  const basePrice = form.watch('basePrice') as number | undefined;
  const isDiscountDisabled = (basePrice ?? 0) <= 0;

  function onSubmit(data: CreateProductInput) {
    startTransition(async () => {
      const result = initialData
        ? await updateProduct(initialData.id, data)
        : await createProduct(data);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(
          initialData ? 'Product updated successfully' : 'Product created successfully',
        );
        router.push('/products');
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
                <FormLabel>Product Name (English) *</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. Modern Sofa'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const slug = slugify(e.target.value);
                      form.setValue('slug', slug);
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
                <FormLabel>Product Name (Vietnamese)</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Ghế Sofa Hiện Đại' {...field} />
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
                <Input placeholder='e.g. modern-sofa' {...field} className='font-mono text-sm' />
              </FormControl>
              <FormDescription className='text-xs'>URL-friendly unique identifier.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='basePrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    min='0'
                    placeholder='0.00'
                    {...field}
                    value={field.value as any}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='discountPrice'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel className={isDiscountDisabled ? 'text-muted-foreground' : ''}>
                    Discount Price ($)
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    min='0'
                    disabled={isDiscountDisabled}
                    placeholder={
                      isDiscountDisabled ? 'Set base price first' : 'Leave empty for no discount'
                    }
                    {...field}
                    value={(field.value as any) ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseFloat(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormDescription className='text-xs'>
                  {isDiscountDisabled
                    ? 'Discount cannot be applied to a product with $0 price.'
                    : 'If set, this will be shown as the current price.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='catalogId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catalog</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a catalog' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {catalogs.map((catalog) => (
                      <SelectItem key={catalog.id} value={catalog.id}>
                        {catalog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='showPrice'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-full'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Show Price on Storefront</FormLabel>
                    <FormDescription className='text-xs'>
                      If unchecked, the price will be hidden on the product details page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='text-sm font-medium'>Short Description</h3>
          <Tabs defaultValue='en' className='w-full'>
            <TabsList className='grid w-full max-w-[200px] grid-cols-2'>
              <TabsTrigger value='en'>English</TabsTrigger>
              <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
            </TabsList>
            <TabsContent value='en'>
              <FormField
                control={form.control}
                name='shortDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='A brief summary of the product...'
                        className='min-h-[80px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Displayed in product lists and previews.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value='vi'>
              <FormField
                control={form.control}
                name='shortDescriptionVi'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Mô tả ngắn về sản phẩm...'
                        className='min-h-[80px] resize-none'
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

        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='text-sm font-medium'>Full Description</h3>
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
                        placeholder='Comprehensive product details...'
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription className='text-xs'>
                      Detailed information shown on the product page. Supports rich text formatting.
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
                        placeholder='Thông tin chi tiết về sản phẩm...'
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

        <div className='space-y-4'>
          <h3 className='text-sm font-medium'>Dimensions</h3>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <FormField
              control={form.control}
              name='dimensions.width'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Width</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      placeholder='0.0'
                      {...field}
                      value={field.value as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dimensions.height'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Height</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      placeholder='0.0'
                      {...field}
                      value={field.value as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dimensions.depth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Depth</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      placeholder='0.0'
                      {...field}
                      value={field.value as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dimensions.unit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Unit' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='cm'>cm</SelectItem>
                      <SelectItem value='mm'>mm</SelectItem>
                      <SelectItem value='inch'>inch</SelectItem>
                      <SelectItem value='m'>m</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='text-sm font-medium'>Product Images</h3>
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUpload
                    value={field.value as any}
                    onChange={field.onChange}
                    folder={`products/${form.getValues('slug') || 'general'}`}
                  />
                </FormControl>
                <FormDescription className='text-xs'>
                  Upload product images. The star icon marks the primary image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Active Status</FormLabel>
                <FormDescription className='text-xs'>
                  This product will be visible in the store.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending
              ? initialData
                ? 'Updating Product...'
                : 'Creating Product...'
              : initialData
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
