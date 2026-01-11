'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertIntro } from '@/lib/actions/intro';
import { introSchema, type IntroInput } from '@/lib/validations/intro';

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

import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SingleImageUpload } from '@/components/ui/single-image-upload';

interface IntroFormProps {
  initialData?: IntroInput & {
    introImageUrl?: string | null;
    backgroundImageUrl?: string | null;
  };
}

export function IntroForm({ initialData }: IntroFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<IntroInput>({
    resolver: zodResolver(introSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          subtitle: initialData.subtitle || '',
          contentHtml: initialData.contentHtml,
          introImageId: initialData.introImageId,
          backgroundImageId: initialData.backgroundImageId,
          isActive: initialData.isActive ?? true,
        }
      : {
          title: '',
          subtitle: '',
          contentHtml: '',
          introImageId: null,
          backgroundImageId: null,
          isActive: true,
        },
  });

  function onSubmit(data: IntroInput) {
    startTransition(async () => {
      const result = await upsertIntro(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Intro section updated successfully');
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Main text and description for the intro section.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Khám Phá' {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Nội thất THIÊN ẤN' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contentHtml'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder='Tell the store story...'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        This content will be rendered on the landing page next to the image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>Control if this section is shown on the website.</CardDescription>
              </CardHeader>
              <CardContent>
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
                          When active, this section will appear between Hero and Collections.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Intro Image</CardTitle>
                <CardDescription>The main image displayed in the section.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='introImageId'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleImageUpload
                          url={initialData?.introImageUrl}
                          onChange={field.onChange}
                          folder='intro'
                          label='Upload Intro Image'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Pattern</CardTitle>
                <CardDescription>Optional background pattern or image.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='backgroundImageId'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SingleImageUpload
                          url={initialData?.backgroundImageUrl}
                          onChange={field.onChange}
                          folder='backgrounds'
                          label='Upload Background Pattern'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
