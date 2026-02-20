import { EntityBase, LocalizedFields } from './common';

export type AspectRatio = 'original' | '1:1' | '3:4' | '4:3' | '16:9' | '4:5';
export type ObjectFit = 'cover' | 'contain';

export interface ImageDisplaySettings {
  focusPoint?: { x: number; y: number };
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
}

export interface ProductImage {
  assetId: string;
  url: string;
  isPrimary: boolean;
  displaySettings?: ImageDisplaySettings;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface Product extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  basePrice: number | string;
  discountPrice?: number | string | null;
  catalogId: string | null;
  isActive: boolean;
  showPrice?: boolean;
  dimensions?: ProductDimensions | unknown;
  images?: ProductImage[];
  gallery?: {
    isPrimary: boolean;
    asset: {
      url: string;
    };
    focusPoint?: { x: number; y: number } | null;
    aspectRatio?: string | null;
    objectFit?: string | null;
  }[];
}
