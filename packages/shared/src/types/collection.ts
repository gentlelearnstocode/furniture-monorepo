import { EntityBase, LocalizedFields } from './common';
import { Product } from './product';

export interface Collection extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description: string | null;
  bannerId: string | null;
  bannerUrl?: string | null;
  isActive: boolean;
  showOnHome?: boolean;
  homeLayout?: 'full' | 'half' | 'third';
}

export interface CollectionWithRelations extends Collection {
  products?: {
    productId: string;
    collectionId: string;
    product?: Product;
  }[];
}
