'use client';

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 0.8, // Target ~800KB per image
  maxWidthOrHeight: 1920, // Max dimension (good for most displays)
  useWebWorker: true,
};

/**
 * Compresses an image file to reduce file size before upload.
 * This significantly reduces Vercel Blob storage and data transfer costs.
 *
 * @param file - The image file to compress
 * @param options - Compression options (optional)
 * @returns The compressed file, or original if compression fails
 */
export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
  // Skip non-image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip already small files (under 100KB)
  if (file.size < 100 * 1024) {
    console.log('[compressImage] Skipping small file:', file.name);
    return file;
  }

  // Skip GIFs and SVGs (compression may break them)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    console.log('[compressImage] Skipping GIF/SVG:', file.name);
    return file;
  }

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    console.log(`[compressImage] Original: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

    const compressedBlob = await imageCompression(file, compressionOptions);

    // Create a new File object with the original filename
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
    console.log(
      `[compressImage] Compressed: ${file.name} (${(compressedFile.size / 1024).toFixed(1)}KB, saved ${savings}%)`
    );

    return compressedFile;
  } catch (error) {
    console.error('[compressImage] Compression failed, using original:', error);
    return file;
  }
}
