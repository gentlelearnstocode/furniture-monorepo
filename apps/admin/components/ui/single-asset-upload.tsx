'use client';

import { useState, useEffect } from 'react';
import { ImagePlus, X, Loader2, Check, Film, FileText } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@repo/ui/lib/utils';
import { Progress } from '@repo/ui/ui/progress';
import { upload } from '@vercel/blob/client';
import { createAssetAction } from '@/lib/actions/assets';

interface SingleAssetUploadProps {
  url?: string | null;
  type?: 'image' | 'video' | 'pdf';
  onChange: (assetId: string | null, url?: string | null) => void;
  folder?: string;
  label?: string;
}

export function SingleAssetUpload({
  url: initialUrl,
  type = 'image',
  onChange,
  folder = 'general',
  label = 'Upload Asset',
}: SingleAssetUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  // Sync state when initialUrl changes
  useEffect(() => {
    setUploadedUrl(null);
    setIsRemoved(false);
  }, [initialUrl]);

  const previewUrl = isRemoved ? null : uploadedUrl || initialUrl || null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 100MB limit
    const limit = 100 * 1024 * 1024;
    if (file.size > limit) {
      toast.error(`File size too large. Max 100MB`);
      return;
    }

    // Basic validation based on type
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const filename = folder ? `${folder}/${file.name}` : file.name;

      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/assets/upload',
        onUploadProgress: (progressEvent) => {
          setUploadProgress(progressEvent.percentage);
        },
      });

      const asset = await createAssetAction(blob.url, file.name, file.type, file.size);

      onChange(asset.id, asset.url);
      setUploadedUrl(asset.url);
      setIsRemoved(false);
      toast.success(
        `${type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'PDF'} uploaded successfully`,
      );
    } catch (error) {
      console.error(error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = () => {
    onChange(null, null);
    setUploadedUrl(null);
    setIsRemoved(true);
  };

  return (
    <div className='space-y-2'>
      {previewUrl ? (
        <div
          className={cn(
            'relative rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center group max-w-sm',
            type === 'image' ? 'aspect-square' : 'aspect-video',
          )}
        >
          {type === 'image' ? (
            <Image
              src={previewUrl}
              alt='Upload Preview'
              fill
              className='object-cover'
              unoptimized
            />
          ) : type === 'video' ? (
            <video src={previewUrl} className='w-full h-full object-cover' muted loop playsInline />
          ) : (
            <div className='flex flex-col items-center justify-center p-8 bg-white w-full h-full border rounded-md'>
              <FileText className='h-12 w-12 text-brand-primary-600 mb-2' />
              <span className='text-xs text-gray-500 font-medium truncate max-w-full px-4'>
                {previewUrl.split('/').pop()}
              </span>
            </div>
          )}

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
            {type === 'image' ? (
              <Check className='h-3 w-3' />
            ) : type === 'video' ? (
              <Film className='h-3 w-3' />
            ) : (
              <FileText className='h-3 w-3' />
            )}
            {type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'PDF'}
          </div>
        </div>
      ) : (
        <div className='space-y-4 max-w-sm'>
          <label className='w-full aspect-video rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50/50'>
            <input
              type='file'
              accept={
                type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'application/pdf'
              }
              className='hidden'
              onChange={onUpload}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className='h-6 w-6 text-gray-400 animate-spin mb-2' />
            ) : type === 'image' ? (
              <ImagePlus className='h-6 w-6 text-gray-400 mb-2' />
            ) : type === 'video' ? (
              <Film className='h-6 w-6 text-gray-400 mb-2' />
            ) : (
              <FileText className='h-6 w-6 text-gray-400 mb-2' />
            )}
            <span className='text-xs text-gray-500 font-medium'>
              {isUploading ? 'Uploading...' : label}
            </span>
          </label>

          {isUploading && (
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between text-[10px] text-gray-500 font-medium'>
                <span>Uploading {type}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className='h-1' />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
