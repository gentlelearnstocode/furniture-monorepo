'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertHero } from '@/lib/actions/hero';
import { heroSchema, type HeroInput } from '@/lib/validations/hero';

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
import { RadioGroup, RadioGroupItem } from '@repo/ui/ui/radio-group';
import { SingleAssetUpload } from '@/components/ui/single-asset-upload';

interface HeroFormProps {
  initialData?: HeroInput & {
    backgroundImageUrl?: string | null;
    backgroundVideoUrl?: string | null;
  };
}

export function HeroForm({ initialData }: HeroFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<HeroInput>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          title: initialData.title ?? '',
          subtitle: initialData.subtitle ?? '',
          buttonText: initialData.buttonText ?? '',
          buttonLink: initialData.buttonLink ?? '',
          backgroundType: initialData.backgroundType,
          backgroundImageId: initialData.backgroundImageId,
          backgroundVideoId: initialData.backgroundVideoId,
          isActive: initialData.isActive ?? true,
        }
      : {
          title: '',
          subtitle: '',
          buttonText: '',
          buttonLink: '',
          backgroundType: 'image',
          isActive: true,
          backgroundImageId: null,
          backgroundVideoId: null,
        },
  });

  const backgroundType = form.watch('backgroundType');

  async function onSubmit(data: HeroInput) {
    startTransition(async () => {
      const result = await upsertHero(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Hero section updated successfully');
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
                <CardTitle>Hero Content</CardTitle>
                <CardDescription>
                  Main heading and call to action for the hero section.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Excellence in Craftsmanship'
                          {...field}
                          value={field.value || ''}
                        />
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
                        <Input
                          placeholder='e.g. Timeless furniture for your home since 1997.'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='buttonText'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. Explore Collections'
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='buttonLink'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. /collections'
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Type</CardTitle>
                <CardDescription>Choose between an image or a video background.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='backgroundType'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-row space-x-4'
                        >
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='image' />
                            </FormControl>
                            <FormLabel className='font-normal'>Image</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='video' />
                            </FormControl>
                            <FormLabel className='font-normal'>Video</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>
                  Toggle the hero section visibility on the storefront.
                </CardDescription>
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
                          When active, the hero section will be the first thing users see.
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
                <CardTitle>Background {backgroundType === 'image' ? 'Image' : 'Video'}</CardTitle>
                <CardDescription>
                  {backgroundType === 'image'
                    ? 'Recommended: 1920x1080px, 16:9, < 2MB'
                    : 'Recommended: 1080p, MP4, H.264, < 100MB'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {backgroundType === 'image' ? (
                  <FormField
                    control={form.control}
                    name='backgroundImageId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SingleAssetUpload
                            type='image'
                            url={initialData?.backgroundImageUrl}
                            onChange={field.onChange}
                            folder='hero'
                            label='Upload Hero Image'
                          />
                        </FormControl>
                        {form.formState.errors.backgroundImageId && (
                          <p className='text-sm font-medium text-destructive'>
                            {form.formState.errors.backgroundImageId.message}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name='backgroundVideoId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SingleAssetUpload
                            type='video'
                            url={initialData?.backgroundVideoUrl}
                            onChange={field.onChange}
                            folder='hero'
                            label='Upload Hero Video'
                          />
                        </FormControl>
                        {form.formState.errors.backgroundVideoId && (
                          <p className='text-sm font-medium text-destructive'>
                            {form.formState.errors.backgroundVideoId.message}
                          </p>
                        )}
                        {/* If the refine error is on the root or other path, we might want to show it here too */}
                        {form.formState.errors.backgroundImageId && backgroundType === 'video' && (
                          <p className='text-sm font-medium text-destructive'>
                            {form.formState.errors.backgroundImageId.message}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending ? 'Saving...' : 'Save Hero Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
