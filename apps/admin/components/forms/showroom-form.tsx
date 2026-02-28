'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { upsertShowroom } from '@/lib/actions/showrooms';
import { showroomSchema, type ShowroomInput } from '@/lib/validations/showrooms';

import { Button } from '@repo/ui/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/ui/form';
import { Input } from '@repo/ui/ui/input';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';

import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import { type Showroom } from '@repo/shared';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';

import { useState } from 'react';

interface ShowroomFormProps {
  initialData?: Showroom;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ShowroomForm({ initialData, onSuccess, onCancel }: ShowroomFormProps) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.image?.url);

  const form = useForm<ShowroomInput>({
    resolver: zodResolver(showroomSchema) as unknown as Resolver<ShowroomInput>,
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || '',
      titleVi: initialData?.titleVi || '',
      subtitle: initialData?.subtitle || '',
      subtitleVi: initialData?.subtitleVi || '',
      type: (initialData?.type as 'showroom' | 'factory') || 'showroom',
      contentHtml: initialData?.contentHtml || '',
      contentHtmlVi: initialData?.contentHtmlVi || '',
      imageId: initialData?.imageId || '',
      position: initialData?.position || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  function onSubmit(data: ShowroomInput) {
    startTransition(async () => {
      const result = await upsertShowroom(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData?.id ? 'Showroom updated' : 'Showroom created');
        if (onSuccess) onSuccess();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='showroom'>Showroom</SelectItem>
                  <SelectItem value='factory'>Factory</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='imageId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <SingleImageUpload
                    url={imageUrl}
                    onChange={(assetId, url) => {
                      field.onChange(assetId);
                      if (url) setImageUrl(url);
                    }}
                    folder='showrooms'
                    label='Upload Banner'
                  />
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

          <TabsContent value='en' className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subtitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contentHtml'
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor {...fieldProps} value={value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value='vi' className='space-y-4'>
            <FormField
              control={form.control}
              name='titleVi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (VI)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subtitleVi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (VI)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contentHtmlVi'
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

        <div className='flex justify-end gap-2 pt-4 border-t'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Showroom'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
