'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Settings2, Move, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@repo/ui/ui/dialog';
import { Label } from '@repo/ui/ui/label';
import { RadioGroup, RadioGroupItem } from '@repo/ui/ui/radio-group';
import { cn } from '@repo/ui/lib/utils';

// Type definitions matching schema
export interface ImageDisplaySettings {
  focusPoint?: { x: number; y: number };
  aspectRatio?: 'original' | '1:1' | '3:4' | '4:3' | '16:9';
  objectFit?: 'cover' | 'contain';
}

interface ImageDisplaySettingsDialogProps {
  imageUrl: string;
  value: ImageDisplaySettings;
  onChange: (settings: ImageDisplaySettings) => void;
  trigger?: React.ReactNode;
}

const ASPECT_RATIOS = [
  { value: 'original', label: 'Original', icon: Square, ratio: null },
  { value: '1:1', label: '1:1', icon: Square, ratio: 1 },
  { value: '3:4', label: '3:4', icon: RectangleVertical, ratio: 3 / 4 },
  { value: '4:3', label: '4:3', icon: RectangleHorizontal, ratio: 4 / 3 },
  { value: '16:9', label: '16:9', icon: RectangleHorizontal, ratio: 16 / 9 },
] as const;

export function ImageDisplaySettingsDialog({
  imageUrl,
  value,
  onChange,
  trigger,
}: ImageDisplaySettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ImageDisplaySettings>(value);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle focus point selection by clicking on the image
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Clamp values to 0-100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setLocalSettings((prev) => ({
      ...prev,
      focusPoint: { x: clampedX, y: clampedY },
    }));
  }, []);

  const handleAspectRatioChange = (value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      aspectRatio: value as ImageDisplaySettings['aspectRatio'],
    }));
  };

  const handleObjectFitChange = (value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      objectFit: value as ImageDisplaySettings['objectFit'],
    }));
  };

  const handleSave = () => {
    onChange(localSettings);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to current value when opening
      setLocalSettings(value);
    }
  };

  const focusPoint = localSettings.focusPoint || { x: 50, y: 50 };
  const aspectRatio = localSettings.aspectRatio || 'original';
  const objectFit = localSettings.objectFit || 'cover';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type='button' variant='secondary' size='icon' className='h-6 w-6'>
            <Settings2 className='h-3 w-3' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Settings2 className='h-4 w-4' />
            Image Display Settings
          </DialogTitle>
          <DialogDescription>
            Customize how this image appears on the storefront. Click on the image to set the focus
            point.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 py-4'>
          {/* Focus Point Picker */}
          <div className='space-y-3'>
            <Label className='flex items-center gap-2'>
              <Move className='h-4 w-4' />
              Focus Point
              <span className='text-xs text-muted-foreground font-normal'>
                (Click on the image to set)
              </span>
            </Label>
            <div
              ref={imageContainerRef}
              className='relative w-full max-h-[300px] overflow-hidden rounded-lg border bg-gray-100 cursor-crosshair'
              onClick={handleImageClick}
              style={{ aspectRatio: '16/10' }}
            >
              <Image
                src={imageUrl}
                alt='Preview'
                fill
                className='object-contain'
                sizes='(max-width: 640px) 100vw, 640px'
              />
              {/* Focus Point Indicator */}
              <div
                className='absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10'
                style={{ left: `${focusPoint.x}%`, top: `${focusPoint.y}%` }}
              >
                <div className='w-full h-full rounded-full border-2 border-white shadow-lg bg-primary/50 animate-pulse' />
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-2 h-2 rounded-full bg-white shadow' />
                </div>
              </div>
              {/* Crosshair guides */}
              <div
                className='absolute top-0 bottom-0 w-px bg-white/50 pointer-events-none'
                style={{ left: `${focusPoint.x}%` }}
              />
              <div
                className='absolute left-0 right-0 h-px bg-white/50 pointer-events-none'
                style={{ top: `${focusPoint.y}%` }}
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              Focus point:{' '}
              <span className='font-mono'>
                {focusPoint.x}% x {focusPoint.y}%
              </span>
            </p>
          </div>

          {/* Aspect Ratio Selection */}
          <div className='space-y-3'>
            <Label>Aspect Ratio</Label>
            <RadioGroup
              value={aspectRatio}
              onValueChange={handleAspectRatioChange}
              className='grid grid-cols-5 gap-2'
            >
              {ASPECT_RATIOS.map((ratio) => {
                const Icon = ratio.icon;
                return (
                  <Label
                    key={ratio.value}
                    htmlFor={`ratio-${ratio.value}`}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 cursor-pointer transition-all',
                      aspectRatio === ratio.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <RadioGroupItem
                      value={ratio.value}
                      id={`ratio-${ratio.value}`}
                      className='sr-only'
                    />
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        aspectRatio === ratio.value ? 'text-primary' : 'text-gray-400'
                      )}
                    />
                    <span className='text-xs font-medium'>{ratio.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          {/* Object Fit Selection */}
          <div className='space-y-3'>
            <Label>Object Fit</Label>
            <RadioGroup
              value={objectFit}
              onValueChange={handleObjectFitChange}
              className='grid grid-cols-2 gap-2'
            >
              <Label
                htmlFor='fit-cover'
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  objectFit === 'cover'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <RadioGroupItem value='cover' id='fit-cover' className='sr-only' />
                <div className='w-12 h-8 bg-gray-300 rounded overflow-hidden relative'>
                  <div className='absolute inset-[-4px] bg-gradient-to-br from-gray-400 to-gray-500' />
                </div>
                <div className='text-center'>
                  <p className='text-sm font-medium'>Cover</p>
                  <p className='text-xs text-muted-foreground'>Fill entire space, may crop</p>
                </div>
              </Label>
              <Label
                htmlFor='fit-contain'
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  objectFit === 'contain'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <RadioGroupItem value='contain' id='fit-contain' className='sr-only' />
                <div className='w-12 h-8 bg-gray-100 rounded flex items-center justify-center'>
                  <div className='w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm' />
                </div>
                <div className='text-center'>
                  <p className='text-sm font-medium'>Contain</p>
                  <p className='text-xs text-muted-foreground'>Show full image, may letterbox</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Live Preview */}
          <div className='space-y-3'>
            <Label>Live Preview</Label>
            <div className='flex gap-4'>
              {/* Card Preview */}
              <div className='flex-1 space-y-1'>
                <p className='text-xs text-muted-foreground'>Product Card (3:4)</p>
                <div
                  className='relative rounded-lg border overflow-hidden bg-gray-100'
                  style={{ aspectRatio: '3/4', maxWidth: '150px' }}
                >
                  <Image
                    src={imageUrl}
                    alt='Card Preview'
                    fill
                    className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain')}
                    style={{
                      objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
                    }}
                    sizes='150px'
                  />
                </div>
              </div>
              {/* Square Preview */}
              <div className='flex-1 space-y-1'>
                <p className='text-xs text-muted-foreground'>Thumbnail (1:1)</p>
                <div
                  className='relative rounded-lg border overflow-hidden bg-gray-100'
                  style={{ aspectRatio: '1/1', maxWidth: '120px' }}
                >
                  <Image
                    src={imageUrl}
                    alt='Square Preview'
                    fill
                    className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain')}
                    style={{
                      objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
                    }}
                    sizes='120px'
                  />
                </div>
              </div>
              {/* Wide Preview */}
              <div className='flex-1 space-y-1'>
                <p className='text-xs text-muted-foreground'>Banner (16:9)</p>
                <div
                  className='relative rounded-lg border overflow-hidden bg-gray-100'
                  style={{ aspectRatio: '16/9', maxWidth: '200px' }}
                >
                  <Image
                    src={imageUrl}
                    alt='Wide Preview'
                    fill
                    className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain')}
                    style={{
                      objectPosition: `${focusPoint.x}% ${focusPoint.y}%`,
                    }}
                    sizes='200px'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type='button' onClick={handleSave}>
            Apply Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
