'use client';

import { useState, useEffect } from 'react';
import { ImagePlus, X, Loader2, Check } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { uploadAssetAction } from '@/lib/actions/assets';
import { toast } from 'sonner';
import Image from 'next/image';

interface SingleImageUploadProps {
  url?: string | null;
  onChange: (assetId: string | null) => void;
  folder?: string;
  label?: string;
}

export function SingleImageUpload({
  url: initialUrl,
  onChange,
  folder = 'general',
  label = 'Upload Image',
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  // Sync state when initialUrl changes (e.g. after a save and refresh)
  useEffect(() => {
    setUploadedUrl(null);
    setIsRemoved(false);
  }, [initialUrl]);

  const previewUrl = isRemoved ? null : uploadedUrl || initialUrl;

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
        onChange(asset.id);
        setUploadedUrl(asset.url);
        setIsRemoved(false);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = () => {
    onChange(null);
    setUploadedUrl(null);
    setIsRemoved(true);
  };

  return (
    <div className='space-y-2'>
      {previewUrl ? (
        <div className='relative aspect-square rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center group max-w-sm'>
          <Image src={previewUrl} alt='Upload Preview' fill className='object-cover' unoptimized />
          <div className='absolute top-1 right-1 z-10'>
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm'
              onClick={onRemove}
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
          <div className='absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm'>
            <Check className='h-3 w-3' /> Image
          </div>
        </div>
      ) : (
        <label className='w-full aspect-square max-w-sm rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50'>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={onUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className='h-6 w-6 text-gray-400 animate-spin mb-2' />
          ) : (
            <ImagePlus className='h-6 w-6 text-gray-400 mb-2' />
          )}
          <span className='text-xs text-gray-500 font-medium'>
            {isUploading ? 'Uploading...' : label}
          </span>
        </label>
      )}
    </div>
  );
}
