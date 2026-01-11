'use client';

import { useState } from 'react';
import { ImagePlus, X, Star, Check } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { createAssetAction } from '@/lib/actions/assets';
import { upload } from '@vercel/blob/client';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  value: { assetId: string; url: string; isPrimary: boolean }[];
  onChange: (value: { assetId: string; url: string; isPrimary: boolean }[]) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = 'products' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadedImages = [...value];

    try {
      for (const file of Array.from(files)) {
        const filename = folder ? `${folder}/${file.name}` : file.name;

        const blob = await upload(filename, file, {
          access: 'public',
          handleUploadUrl: '/api/assets/upload',
        });

        const asset = await createAssetAction(blob.url, file.name, file.type, file.size);

        if (asset) {
          uploadedImages.push({
            assetId: asset.id,
            url: asset.url,
            isPrimary: uploadedImages.length === 0,
          });
        }
      }
      onChange(uploadedImages);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = (id: string) => {
    const newValue = value.filter((img) => img.assetId !== id);
    const removedImage = value.find((img) => img.assetId === id);
    // If we removed the primary, assign a new one
    const firstImage = newValue[0];
    if (removedImage?.isPrimary && firstImage) {
      firstImage.isPrimary = true;
    }
    onChange(newValue);
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
            <Image src={image.url} alt='Product Image' fill className='object-cover' />
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
              <div className='absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1'>
                <Check className='h-2 w-2' /> Primary
              </div>
            )}
          </div>
        ))}
        <label className='aspect-square rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50'>
          <InputFile onUpload={onUpload} disabled={isUploading} />
          <ImagePlus className='h-6 w-6 text-gray-400 mb-2' />
          <span className='text-xs text-gray-500 font-medium'>
            {isUploading ? 'Uploading...' : 'Add Images'}
          </span>
        </label>
      </div>
    </div>
  );
}

function InputFile({
  onUpload,
  disabled,
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type='file'
      multiple
      accept='image/*'
      className='hidden'
      onChange={onUpload}
      disabled={disabled}
    />
  );
}
