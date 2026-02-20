'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { upsertCustomPage } from '@/lib/actions/pages';
import { Button } from '@repo/ui/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/ui/form';
import { Input } from '@repo/ui/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MultiImageUpload, type ImageWithSettings } from '@/components/ui/multi-image-upload';
import { type CustomPage, type ShowroomPageContent } from '@repo/shared';
import { type CustomPageInput } from '@/lib/validations/pages';

// Simplified schema without buttons
const showroomPageSchema = z.object({
  slug: z.string(),
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional(),
  isActive: z.boolean().default(true),
  content: z
    .object({
      header: z
        .object({
          introHtml: z.string().optional(),
          introHtmlVi: z.string().optional(),
          images: z.array(z.custom<ImageWithSettings>()).optional(), // For the collage
        })
        .optional(),
    })
    .optional(),
});

type ShowroomPageInput = z.infer<typeof showroomPageSchema>;

interface ShowroomPageFormProps {
  slug: string;
  initialData?: CustomPage;
}

export function ShowroomPageForm({ slug, initialData }: ShowroomPageFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialContent = initialData?.content as ShowroomPageContent | undefined;

  const form = useForm<ShowroomPageInput>({
    resolver: zodResolver(showroomPageSchema) as unknown as Resolver<ShowroomPageInput>,
    defaultValues: {
      slug,
      title: initialData?.title || '',
      titleVi: initialData?.titleVi || '',
      isActive: initialData?.isActive ?? true,
      content: {
        header: {
          introHtml: initialContent?.header?.introHtml || '',
          introHtmlVi: initialContent?.header?.introHtmlVi || '',
          images: (initialContent?.header?.images || []) as ImageWithSettings[],
        },
      },
    },
  });

  function onSubmit(data: ShowroomPageInput) {
    startTransition(async () => {
      // Ensure required structure for customPageSchema
      const payload = {
        ...data,
        content: {
          header: {
            ...data.content?.header,
            images: data.content?.header?.images || [],
          },
          body: { images: [] }, // Satisfy schema requirements
          footer: {},
        },
      };

      const result = await upsertCustomPage(payload as CustomPageInput);
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
            <CardTitle>Page Header & Intro</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
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

            <Tabs defaultValue='en'>
              <TabsList className='mb-4'>
                <TabsTrigger value='en'>English</TabsTrigger>
                <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
              </TabsList>

              <TabsContent value='en'>
                <FormField
                  control={form.control}
                  name='content.header.introHtml'
                  render={({ field: { value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Intro Description (EN)</FormLabel>
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
                  name='content.header.introHtmlVi'
                  render={({ field: { value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Intro Description (VI)</FormLabel>
                      <FormControl>
                        <RichTextEditor {...fieldProps} value={value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Header Images (Collage) */}
            <FormField
              control={form.control}
              name='content.header.images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Header Images (Collage)</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value as ImageWithSettings[]}
                      onChange={field.onChange}
                      folder={`pages/${slug}/header`}
                      useLogoOverlay={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
