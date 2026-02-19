'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export type AspectRatio = 'original' | '1:1' | '3:4' | '4:3' | '16:9' | '4:5';
export type ObjectFit = 'cover' | 'contain';

// Type definitions matching the database schema
export interface ImageDisplaySettings {
  focusPoint?: { x: number; y: number };
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

interface StyledImageProps {
  src: string;
  alt: string;
  displaySettings?: ImageDisplaySettings;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
}

// Map aspect ratio strings to CSS aspect-ratio values
const ASPECT_RATIO_MAP: Record<string, string> = {
  original: 'auto',
  '1:1': '1 / 1',
  '3:4': '3 / 4',
  '4:3': '4 / 3',
  '16:9': '16 / 9',
  '4:5': '4 / 5',
};

/**
 * StyledImage Component
 *
 * A reusable image component that applies display settings (focus point, aspect ratio, object fit)
 * from the admin panel. Use this component on the storefront to render images with customized
 * display behavior.
 *
 * @example
 * <StyledImage
 *   src={product.gallery[0].asset.url}
 *   alt={product.name}
 *   displaySettings={{
 *     focusPoint: { x: 30, y: 20 },
 *     aspectRatio: '3:4',
 *     objectFit: 'cover',
 *   }}
 *   sizes="(max-width: 768px) 50vw, 25vw"
 * />
 */
export function StyledImage({
  src,
  alt,
  displaySettings,
  className,
  containerClassName,
  sizes,
  priority = false,
  fill = true,
  width,
  height,
  quality = 85,
}: StyledImageProps) {
  const focusPoint = displaySettings?.focusPoint || { x: 50, y: 50 };
  const objectFit = displaySettings?.objectFit || 'cover';
  const aspectRatio = displaySettings?.aspectRatio || 'original';

  // Calculate object-position from focus point
  const objectPosition = `${focusPoint.x}% ${focusPoint.y}%`;

  // Get CSS aspect ratio value
  const cssAspectRatio = ASPECT_RATIO_MAP[aspectRatio] || 'auto';

  // Determine if we should use a wrapper with aspect ratio
  const useAspectRatioWrapper = aspectRatio !== 'original' && fill;

  if (useAspectRatioWrapper) {
    return (
      <div
        className={cn('relative overflow-hidden', containerClassName)}
        style={{ aspectRatio: cssAspectRatio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain', className)}
          style={{ objectPosition }}
          sizes={sizes}
          priority={priority}
          quality={quality}
        />
      </div>
    );
  }

  // When fill is true but no aspect ratio wrapper needed
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain', className)}
        style={{ objectPosition }}
        sizes={sizes}
        priority={priority}
        quality={quality}
      />
    );
  }

  // When using explicit width/height
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(objectFit === 'cover' ? 'object-cover' : 'object-contain', className)}
      style={{ objectPosition }}
      sizes={sizes}
      priority={priority}
      quality={quality}
    />
  );
}

/**
 * Helper function to extract display settings from a gallery asset
 * Use this when passing data from the API to the StyledImage component
 */
export function getDisplaySettings(galleryItem: {
  focusPoint?: { x: number; y: number } | null;
  aspectRatio?: string | null;
  objectFit?: string | null;
}): ImageDisplaySettings {
  return {
    focusPoint: galleryItem.focusPoint || undefined,
    aspectRatio: (galleryItem.aspectRatio as ImageDisplaySettings['aspectRatio']) || undefined,
    objectFit: (galleryItem.objectFit as ImageDisplaySettings['objectFit']) || undefined,
  };
}
