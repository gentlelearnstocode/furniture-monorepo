'use client';

import { useState } from 'react';
import { ImagePlus, X, Star, Check, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { createAssetAction } from '@/lib/actions/assets';
import { upload } from '@vercel/blob/client';
import { toast } from 'sonner';
import Image from 'next/image';
import { Progress } from '@repo/ui/ui/progress';
import { compressImage } from '@/lib/utils/compress-image';

interface MultiImageUploadProps {
  value: { assetId: string; url: string; isPrimary: boolean }[];
  onChange: (value: { assetId: string; url: string; isPrimary: boolean }[]) => void;
  folder?: string;
}

interface UploadProgress {
  [fileName: string]: number;
}

export function MultiImageUpload({ value, onChange, folder = 'general' }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages = [...value];

    try {
      for (const file of Array.from(files)) {
        // Compress image before upload to reduce storage and bandwidth
        const compressedFile = await compressImage(file);
        const filename = folder ? `${folder}/${compressedFile.name}` : compressedFile.name;

        const blob = await upload(filename, compressedFile, {
          access: 'public',
          handleUploadUrl: '/api/assets/upload',
          onUploadProgress: (progressEvent) => {
            setProgress((prev) => ({
              ...prev,
              [file.name]: progressEvent.percentage,
            }));
          },
        });

        const asset = await createAssetAction(blob.url, file.name, file.type, file.size);

        if (asset) {
          uploadedImages.push({
            assetId: asset.id,
            url: asset.url,
            isPrimary: uploadedImages.length === 0,
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
        index === 0 ? { ...img, isPrimary: true } : img
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

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {value.map((image) => (
          <div
            key={image.assetId}
            className='relative aspect-square rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center group'
          >
            <Image src={image.url} alt='Uploaded Image' fill className='object-cover' />
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
            {image.isPrimary && (
              <div className='absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 leading-none'>
                <Check className='h-2 w-2' /> Primary
              </div>
            )}
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
              <p className='text-[10px] text-gray-500 text-center truncate w-full'>{percent}%</p>
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
