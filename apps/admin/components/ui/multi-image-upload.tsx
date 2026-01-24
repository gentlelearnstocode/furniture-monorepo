'use client';

import { useState } from 'react';
import { ImagePlus, X, Star, Check, Loader2, Settings2 } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { createAssetAction } from '@/lib/actions/assets';
import { upload } from '@vercel/blob/client';
import { toast } from 'sonner';
import Image from 'next/image';
import { Progress } from '@repo/ui/ui/progress';
import { ImageDisplaySettingsDialog, type ImageDisplaySettings } from './image-display-settings';

// Extended image data type with display settings
export interface ImageWithSettings {
  assetId: string;
  url: string;
  isPrimary: boolean;
  focusPoint?: { x: number; y: number };
  aspectRatio?: 'original' | '1:1' | '3:4' | '4:3' | '16:9';
  objectFit?: 'cover' | 'contain';
}

interface MultiImageUploadProps {
  value: ImageWithSettings[];
  onChange: (value: ImageWithSettings[]) => void;
  folder?: string;
  useLogoOverlay?: boolean;
}

interface UploadProgress {
  [fileName: string]: number;
}

export function MultiImageUpload({
  value,
  onChange,
  folder = 'general',
  useLogoOverlay = true,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages = [...value];

    try {
      for (const file of Array.from(files)) {
        const filename = folder ? `${folder}/${file.name}` : file.name;

        // Step 1: Upload original to Vercel Blob
        const blob = await upload(filename, file, {
          access: 'public',
          handleUploadUrl: '/api/assets/upload',
          onUploadProgress: (progressEvent) => {
            setProgress((prev) => ({
              ...prev,
              [file.name]: Math.round(progressEvent.percentage * 0.8), // First 80% is upload
            }));
          },
        });

        // Step 2: Process with logo overlay (if enabled)
        let finalUrl = blob.url;
        if (useLogoOverlay) {
          try {
            // Start simulated progress for processing
            const processingInterval = setInterval(() => {
              setProgress((prev) => {
                const current = prev[file.name] || 80;
                if (current >= 95) return prev;
                return { ...prev, [file.name]: current + 1 };
              });
            }, 500); // Increment every 500ms

            const formData = new FormData();
            formData.append('imageUrl', blob.url);
            formData.append('filename', file.name);

            const overlayResponse = await fetch('/api/process-logo-overlay', {
              method: 'POST',
              body: formData,
            });

            clearInterval(processingInterval);

            if (overlayResponse.ok) {
              const overlayResult = await overlayResponse.json();
              if (overlayResult.processed && overlayResult.url) {
                finalUrl = overlayResult.url;
              }
            }
          } catch (overlayError) {
            // If overlay processing fails, continue with original image
            console.warn('Logo overlay processing failed, using original:', overlayError);
          }
        }

        setProgress((prev) => ({ ...prev, [file.name]: 100 })); // Done

        // Step 3: Create asset record with the final URL
        const asset = await createAssetAction(finalUrl, file.name, file.type, file.size);

        if (asset) {
          uploadedImages.push({
            assetId: asset.id,
            url: asset.url,
            isPrimary: uploadedImages.length === 0,
            // Default display settings
            focusPoint: { x: 50, y: 50 },
            aspectRatio: 'original',
            objectFit: 'cover',
          });
        }

        // Clear progress for this file
        setProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
      onChange(uploadedImages);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setIsUploading(false);
      setProgress({});
    }
  };

  const onRemove = (id: string) => {
    const newValue = value.filter((img) => img.assetId !== id);
    const removedImage = value.find((img) => img.assetId === id);

    if (removedImage?.isPrimary && newValue.length > 0) {
      const updatedValue = newValue.map((img, index) =>
        index === 0 ? { ...img, isPrimary: true } : img,
      );
      onChange(updatedValue);
    } else {
      onChange(newValue);
    }
  };

  const onSetPrimary = (id: string) => {
    const newValue = value.map((img) => ({
      ...img,
      isPrimary: img.assetId === id,
    }));
    onChange(newValue);
  };

  const onUpdateDisplaySettings = (id: string, settings: ImageDisplaySettings) => {
    const newValue = value.map((img) =>
      img.assetId === id
        ? {
            ...img,
            focusPoint: settings.focusPoint,
            aspectRatio: settings.aspectRatio,
            objectFit: settings.objectFit,
          }
        : img,
    );
    onChange(newValue);
  };

  // Check if an image has custom display settings
  const hasCustomSettings = (image: ImageWithSettings) => {
    return (
      (image.focusPoint && (image.focusPoint.x !== 50 || image.focusPoint.y !== 50)) ||
      (image.aspectRatio && image.aspectRatio !== 'original') ||
      (image.objectFit && image.objectFit !== 'cover')
    );
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {value.map((image) => (
          <div
            key={image.assetId}
            className='relative aspect-square rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center group'
          >
            <Image
              src={image.url}
              alt='Uploaded Image'
              fill
              className='object-cover'
              style={{
                objectPosition: image.focusPoint
                  ? `${image.focusPoint.x}% ${image.focusPoint.y}%`
                  : '50% 50%',
              }}
            />
            {/* Top buttons: Primary, Settings, Delete */}
            <div className='absolute top-1 right-1 flex gap-1'>
              <Button
                type='button'
                variant={image.isPrimary ? 'default' : 'secondary'}
                size='icon'
                className='h-6 w-6'
                onClick={() => onSetPrimary(image.assetId)}
              >
                <Star className={`h-3 w-3 ${image.isPrimary ? 'fill-white' : ''}`} />
              </Button>
              <ImageDisplaySettingsDialog
                imageUrl={image.url}
                value={{
                  focusPoint: image.focusPoint,
                  aspectRatio: image.aspectRatio,
                  objectFit: image.objectFit,
                }}
                onChange={(settings) => onUpdateDisplaySettings(image.assetId, settings)}
                trigger={
                  <Button
                    type='button'
                    variant={hasCustomSettings(image) ? 'default' : 'secondary'}
                    size='icon'
                    className='h-6 w-6'
                  >
                    <Settings2 className='h-3 w-3' />
                  </Button>
                }
              />
              <Button
                type='button'
                variant='destructive'
                size='icon'
                className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={() => onRemove(image.assetId)}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
            {/* Bottom badges */}
            <div className='absolute bottom-1 left-1 flex gap-1'>
              {image.isPrimary && (
                <div className='bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 leading-none'>
                  <Check className='h-2 w-2' /> Primary
                </div>
              )}
              {hasCustomSettings(image) && (
                <div className='bg-primary/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 leading-none'>
                  <Settings2 className='h-2 w-2' /> Custom
                </div>
              )}
            </div>
          </div>
        ))}

        {Object.entries(progress).map(([fileName, percent]) => (
          <div
            key={fileName}
            className='relative aspect-square rounded-md border bg-gray-50 flex flex-col items-center justify-center p-2'
          >
            <Loader2 className='h-6 w-6 text-gray-400 animate-spin mb-2' />
            <div className='w-full space-y-1'>
              <Progress value={percent} className='h-1' />
              <div className='flex justify-between items-center px-1'>
                <p className='text-[10px] text-gray-400 truncate max-w-[70%]'>
                  {percent < 80
                    ? 'Uploading...'
                    : percent < 95
                      ? 'Processing Logo...'
                      : 'Finalizing...'}
                </p>
                <p className='text-[10px] text-gray-500 font-medium'>{percent}%</p>
              </div>
            </div>
          </div>
        ))}

        <label className='aspect-square rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50'>
          <input
            type='file'
            multiple
            accept='image/*'
            className='hidden'
            onChange={onUpload}
            disabled={isUploading}
          />
          <ImagePlus className='h-6 w-6 text-gray-400 mb-2' />
          <span className='text-xs text-gray-500 font-medium'>
            {isUploading ? 'Uploading...' : 'Add Images'}
          </span>
        </label>
      </div>
    </div>
  );
}
