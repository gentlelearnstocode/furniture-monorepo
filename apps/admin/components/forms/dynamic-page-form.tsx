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
import { SingleAssetUpload } from '@/components/ui/single-asset-upload';
import { type CustomPage } from '@repo/shared';

interface DynamicPageFormProps {
  slug: string;
  title: string;
  initialData?: CustomPage;
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
            introHtml: initialData.content?.header?.introHtml || '',
            introHtmlVi: initialData.content?.header?.introHtmlVi || '',
            buttonText: initialData.content?.header?.buttonText || '',
            buttonTextVi: initialData.content?.header?.buttonTextVi || '',
            buttonLink: initialData.content?.header?.buttonLink || '',
            button2Text: initialData.content?.header?.button2Text || '',
            button2TextVi: initialData.content?.header?.button2TextVi || '',
            button2Link: initialData.content?.header?.button2Link || '',
          },
          body: {
            introHtml: initialData.content?.body?.introHtml || '',
            introHtmlVi: initialData.content?.body?.introHtmlVi || '',
            paragraphHtml: initialData.content?.body?.paragraphHtml || '',
            paragraphHtmlVi: initialData.content?.body?.paragraphHtmlVi || '',
            images: (initialData.content?.body?.images || []).map((img) => ({
              ...img,
              focusPoint: img.focusPoint || undefined,
            })),
          },
          footer: {
            textHtml: initialData.content?.footer?.textHtml || '',
            textHtmlVi: initialData.content?.footer?.textHtmlVi || '',
            imageId: initialData.content?.footer?.imageId || null,
            imageUrl: initialData.content?.footer?.imageUrl || null,
          },
          bannerId: initialData.content?.bannerId || null,
          bannerUrl: initialData.content?.bannerUrl || null,
          pdfId: initialData.content?.pdfId || null,
          pdfUrl: initialData.content?.pdfUrl || null,
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
            button2Text: '',
            button2TextVi: '',
            button2Link: '',
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
          bannerId: null,
          bannerUrl: null,
          pdfId: null,
          pdfUrl: null,
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
        {['about-us', 'construction-manufacturing', 'manufacturing-services'].includes(slug) && (
          <Card>
            <CardHeader>
              <CardTitle>Page Resources</CardTitle>
              <CardDescription>
                Manage the banner image{slug === 'about-us' && ' and PDF brochure'} for the page.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <FormField
                  control={form.control}
                  name='content.bannerId'
                  render={() => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormControl>
                        <SingleImageUpload
                          url={form.watch('content.bannerUrl')}
                          onChange={(assetId, url) => {
                            form.setValue('content.bannerId', assetId || '');
                            form.setValue('content.bannerUrl', url || '');
                          }}
                          folder={`pages/${slug}`}
                          label='Upload Banner'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {slug === 'about-us' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-6'>
                  <FormField
                    control={form.control}
                    name='content.pdfId'
                    render={() => (
                      <FormItem>
                        <FormLabel>PDF Brochure</FormLabel>
                        <FormControl>
                          <SingleAssetUpload
                            url={form.watch('content.pdfUrl')}
                            type='pdf'
                            onChange={(assetId, url) => {
                              form.setValue('content.pdfId', assetId);
                              form.setValue('content.pdfUrl', url || null);
                            }}
                            folder={`pages/${slug}`}
                            label='Upload PDF'
                          />
                        </FormControl>
                        <FormDescription>
                          Upload the PDF file to be displayed on the About Us page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className='border-t pt-6'>
                <h3 className='text-lg font-medium mb-4'>Page Content (Main Description)</h3>
                <Tabs defaultValue='en'>
                  <TabsList className='mb-4'>
                    <TabsTrigger value='en'>English</TabsTrigger>
                    <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
                  </TabsList>
                  <TabsContent value='en'>
                    <FormField
                      control={form.control}
                      name='content.body.paragraphHtml'
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Description (EN)</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
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
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Description (VI)</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        )}

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

        {!['about-us', 'construction-manufacturing', 'manufacturing-services'].includes(slug) && (
          <>
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
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Intro Paragraph</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
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

            <Card>
              <CardHeader>
                <CardTitle>Hero Section (Button 2)</CardTitle>
                <CardDescription>Second button settings (optional).</CardDescription>
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
                      name='content.header.button2Text'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button 2 Text</FormLabel>
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
                      name='content.header.button2TextVi'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button 2 Text (VI)</FormLabel>
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
                  name='content.header.button2Link'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button 2 Link</FormLabel>
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
                      name='content.body.introHtml'
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem className='mb-4'>
                          <FormLabel>Body Intro Paragraph (Tables supported)</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='content.body.paragraphHtml'
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Main Body Paragraph</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value='vi'>
                    <FormField
                      control={form.control}
                      name='content.body.introHtmlVi'
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem className='mb-4'>
                          <FormLabel>Body Intro Paragraph (VI)</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='content.body.paragraphHtmlVi'
                      render={({ field: { value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Body Paragraph (VI)</FormLabel>
                          <FormControl>
                            <RichTextEditor {...fieldProps} value={value || ''} />
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
                          useLogoOverlay={false}
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
                        render={({ field: { value, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel>Footer Text</FormLabel>
                            <FormControl>
                              <RichTextEditor {...fieldProps} value={value || ''} />
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
                        render={({ field: { value, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel>Footer Text (VI)</FormLabel>
                            <FormControl>
                              <RichTextEditor {...fieldProps} value={value || ''} />
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
                    render={() => (
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
          </>
        )}

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
