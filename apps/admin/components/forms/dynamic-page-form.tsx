'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertCustomPage } from '@/lib/actions/pages';
import { customPageSchema, type CustomPageInput } from '@/lib/validations/pages';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';

import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import { MultiImageUpload, type ImageWithSettings } from '@/components/ui/multi-image-upload';

interface DynamicPageFormProps {
  slug: string;
  title: string;
  initialData?: any;
}

export function DynamicPageForm({ slug, title, initialData }: DynamicPageFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Convert DB data to form data if needed
  const defaultValues: CustomPageInput = initialData
    ? {
        slug: initialData.slug,
        title: initialData.title,
        titleVi: initialData.titleVi || '',
        isActive: initialData.isActive ?? true,
        content: {
          header: {
            introHtml: initialData.content.header.introHtml || '',
            introHtmlVi: initialData.content.header.introHtmlVi || '',
            buttonText: initialData.content.header.buttonText || '',
            buttonTextVi: initialData.content.header.buttonTextVi || '',
            buttonLink: initialData.content.header.buttonLink || '',
          },
          body: {
            introHtml: initialData.content.body.introHtml || '',
            introHtmlVi: initialData.content.body.introHtmlVi || '',
            paragraphHtml: initialData.content.body.paragraphHtml || '',
            paragraphHtmlVi: initialData.content.body.paragraphHtmlVi || '',
            images: initialData.content.body.images || [],
          },
          footer: {
            textHtml: initialData.content.footer.textHtml || '',
            textHtmlVi: initialData.content.footer.textHtmlVi || '',
            imageId: initialData.content.footer.imageId || null,
            imageUrl: initialData.content.footer.imageUrl || null,
          },
        },
      }
    : {
        slug,
        title,
        titleVi: '',
        content: {
          header: {
            introHtml: '',
            introHtmlVi: '',
            buttonText: '',
            buttonTextVi: '',
            buttonLink: '',
          },
          body: {
            introHtml: '',
            introHtmlVi: '',
            paragraphHtml: '',
            paragraphHtmlVi: '',
            images: [],
          },
          footer: {
            textHtml: '',
            textHtmlVi: '',
            imageId: null,
            imageUrl: null,
          },
        },
        isActive: true,
      };

  const form = useForm<CustomPageInput>({
    resolver: zodResolver(customPageSchema),
    defaultValues,
  });

  function onSubmit(data: CustomPageInput) {
    startTransition(async () => {
      const result = await upsertCustomPage(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Page updated successfully');
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>{title} - Basic Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title (EN)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='titleVi'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title (VI)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
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
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Toggle visibility of this page on the storefront.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Header Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section (Header)</CardTitle>
            <CardDescription>Intro paragraph and button link.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Tabs defaultValue='en'>
              <TabsList>
                <TabsTrigger value='en'>English</TabsTrigger>
                <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
              </TabsList>
              <TabsContent value='en' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='content.header.introHtml'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intro Paragraph</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='content.header.buttonText'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value='vi' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='content.header.introHtmlVi'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intro Paragraph (VI)</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='content.header.buttonTextVi'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text (VI)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name='content.header.buttonLink'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Link</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Body Section */}
        <Card>
          <CardHeader>
            <CardTitle>Showcase Section (Body)</CardTitle>
            <CardDescription>Multiple images and body paragraph.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Tabs defaultValue='en'>
              <TabsList>
                <TabsTrigger value='en'>English</TabsTrigger>
                <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
              </TabsList>
              <TabsContent value='en'>
                <FormField
                  control={form.control}
                  name='content.body.paragraphHtml'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Body Intro Paragraph (Tables supported)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          {...field}
                          value={form.watch('content.body.introHtml') || ''}
                          onChange={(val) => form.setValue('content.body.introHtml', val)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='content.body.paragraphHtml'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Body Paragraph</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value='vi'>
                <FormField
                  control={form.control}
                  name='content.body.paragraphHtmlVi'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Body Intro Paragraph (VI)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          {...field}
                          value={form.watch('content.body.introHtmlVi') || ''}
                          onChange={(val) => form.setValue('content.body.introHtmlVi', val)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='content.body.paragraphHtmlVi'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Paragraph (VI)</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name='content.body.images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images Showcase</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value as ImageWithSettings[]}
                      onChange={field.onChange}
                      folder={`pages/${slug}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card>
          <CardHeader>
            <CardTitle>Closing Section (Footer)</CardTitle>
            <CardDescription>Single image and footer paragraph.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <Tabs defaultValue='en'>
                <TabsList>
                  <TabsTrigger value='en'>English</TabsTrigger>
                  <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
                </TabsList>
                <TabsContent value='en'>
                  <FormField
                    control={form.control}
                    name='content.footer.textHtml'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Text</FormLabel>
                        <FormControl>
                          <RichTextEditor {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value='vi'>
                  <FormField
                    control={form.control}
                    name='content.footer.textHtmlVi'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Text (VI)</FormLabel>
                        <FormControl>
                          <RichTextEditor {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <FormField
                control={form.control}
                name='content.footer.imageId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Image</FormLabel>
                    <FormControl>
                      <SingleImageUpload
                        url={form.watch('content.footer.imageUrl')}
                        onChange={(assetId, url) => {
                          form.setValue('content.footer.imageId', assetId);
                          form.setValue('content.footer.imageUrl', url);
                        }}
                        folder={`pages/${slug}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
