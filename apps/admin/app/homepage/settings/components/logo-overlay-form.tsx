'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/ui/form';
import { Switch } from '@repo/ui/ui/switch';
import { Button } from '@repo/ui/ui/button';
import { Slider } from '@repo/ui/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import {
  updateLogoOverlaySettings,
  type LogoOverlaySettings,
} from '@/lib/actions/logo-overlay-settings';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const formSchema = z.object({
  enabled: z.boolean(),
  logoAssetId: z.string().nullable(),
  logoUrl: z.string().nullable(),
  position: z.enum(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center']),
  sizePercent: z.number().min(5).max(30),
  opacity: z.number().min(0).max(100),
  padding: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface LogoOverlayFormProps {
  initialData: LogoOverlaySettings;
}

const POSITION_OPTIONS = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'center', label: 'Center' },
] as const;

export function LogoOverlayForm({ initialData }: LogoOverlayFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: initialData.enabled,
      logoAssetId: initialData.logoAssetId,
      logoUrl: initialData.logoUrl,
      position: initialData.position,
      sizePercent: initialData.sizePercent,
      opacity: initialData.opacity,
      padding: initialData.padding,
    },
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = await updateLogoOverlaySettings(data);
      if (result.success) {
        toast.success('Logo overlay settings saved');
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    });
  };

  const handleLogoChange = (assetId: string | null, url?: string | null) => {
    form.setValue('logoAssetId', assetId);
    form.setValue('logoUrl', url ?? null);
  };

  const logoUrl = form.watch('logoUrl');
  const isEnabled = form.watch('enabled');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* Enable/Disable Toggle */}
        <FormField
          control={form.control}
          name='enabled'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Enable Logo Overlay</FormLabel>
                <FormDescription>
                  Automatically add your logo to product images when uploading
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Settings Section - Only show when enabled */}
        <div className={`space-y-6 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Logo Upload */}
          <FormField
            control={form.control}
            name='logoAssetId'
            render={() => (
              <FormItem>
                <FormLabel>Logo Image</FormLabel>
                <FormDescription>
                  Upload the logo/watermark image to apply on product images (PNG with transparency
                  recommended)
                </FormDescription>
                <FormControl>
                  <SingleImageUpload
                    url={logoUrl}
                    onChange={handleLogoChange}
                    folder='logo-overlay'
                    label='Upload Logo'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Position */}
          <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormDescription>Where to place the logo on product images</FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select position' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POSITION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name='sizePercent'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size ({field.value}%)</FormLabel>
                <FormDescription>Logo width as percentage of image width (5-30%)</FormDescription>
                <FormControl>
                  <Slider
                    min={5}
                    max={30}
                    step={1}
                    value={[field.value]}
                    onValueChange={(values: number[]) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opacity */}
          <FormField
            control={form.control}
            name='opacity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opacity ({field.value}%)</FormLabel>
                <FormDescription>Logo transparency (0 = invisible, 100 = solid)</FormDescription>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={(values: number[]) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Padding */}
          <FormField
            control={form.control}
            name='padding'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Padding ({field.value}px)</FormLabel>
                <FormDescription>Distance from image edge in pixels</FormDescription>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={(values: number[]) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preview Placeholder */}
        {isEnabled && logoUrl && (
          <div className='rounded-lg border p-4 bg-gray-50'>
            <div className='flex items-center gap-2 text-sm text-gray-600 mb-3'>
              <ImageIcon className='h-4 w-4' />
              <span>Logo Preview</span>
            </div>
            <div className='relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden'>
              {/* Sample background */}
              <div className='absolute inset-0 flex items-center justify-center text-gray-400 text-xs'>
                Sample Product Image
              </div>
              {/* Logo preview positioned based on settings */}
              <div
                className='absolute'
                style={{
                  width: `${form.watch('sizePercent')}%`,
                  opacity: form.watch('opacity') / 100,
                  ...(form.watch('position') === 'top-right' && {
                    top: form.watch('padding'),
                    right: form.watch('padding'),
                  }),
                  ...(form.watch('position') === 'top-left' && {
                    top: form.watch('padding'),
                    left: form.watch('padding'),
                  }),
                  ...(form.watch('position') === 'bottom-right' && {
                    bottom: form.watch('padding'),
                    right: form.watch('padding'),
                  }),
                  ...(form.watch('position') === 'bottom-left' && {
                    bottom: form.watch('padding'),
                    left: form.watch('padding'),
                  }),
                  ...(form.watch('position') === 'center' && {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt='Logo preview' className='w-full h-auto' />
              </div>
            </div>
          </div>
        )}

        <Button type='submit' disabled={isPending}>
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
