'use client';

import { useState } from 'react';
import { ImagePlus, X, Check } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { uploadAssetAction } from '@/lib/actions/assets';
import { toast } from 'sonner';
import Image from 'next/image';

interface SingleImageUploadProps {
  value?: { assetId: string; url: string } | null;
  onChange: (value: { assetId: string; url: string } | null) => void;
  folder?: string;
}

export function SingleImageUpload({
  value,
  onChange,
  folder = 'collections',
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }
      const asset = await uploadAssetAction(formData);

      if (asset) {
        onChange({
          assetId: asset.id,
          url: asset.url,
        });
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = () => {
    onChange(null);
  };

  return (
    <div className='space-y-4'>
      {value ? (
        <div className='relative aspect-[21/9] rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center group max-w-2xl'>
          <Image src={value.url} alt='Banner Image' fill className='object-cover' />
          <div className='absolute top-2 right-2'>
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm'
              onClick={onRemove}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <div className='absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm'>
            <Check className='h-3 w-3' /> Banner Image
          </div>
        </div>
      ) : (
        <label className='aspect-[21/9] rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50 max-w-2xl'>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={onUpload}
            disabled={isUploading}
          />
          <ImagePlus className='h-8 w-8 text-gray-400 mb-2' />
          <span className='text-sm text-gray-500 font-medium'>
            {isUploading ? 'Uploading...' : 'Upload Banner Image'}
          </span>
          <span className='text-xs text-gray-400 mt-1'>Recommended ratio 21:9</span>
        </label>
      )}
    </div>
  );
}
