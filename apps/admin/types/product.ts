export interface ProductImage {
  assetId: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  basePrice: number | string;
  catalogId: string | null;
  isActive: boolean;
  dimensions: unknown;
  images?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}
