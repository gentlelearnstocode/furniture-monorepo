import { Product } from './product';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerId: string | null;
  isActive: boolean;
  showOnHome: boolean;
  homeLayout: 'full' | 'half' | 'third';
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionWithRelations extends Collection {
  banner?: {
    id: string;
    url: string;
    alt?: string | null;
  } | null;
  products?: {
    productId: string;
    collectionId: string;
    product?: Product;
  }[];
}
