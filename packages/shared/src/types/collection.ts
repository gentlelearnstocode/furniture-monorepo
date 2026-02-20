import { EntityBase, LocalizedFields } from './common';
import { Product } from './product';
import { Catalog } from './catalog';

export interface Collection extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description?: string | null;
  bannerId?: string | null;
  bannerUrl?: string | null;
  isActive?: boolean;
  showOnHome?: boolean;
  homeLayout?: 'full' | 'half' | 'third';
  products?: Product[];
}

export interface CollectionWithRelations extends Collection {
  catalogs?: {
    catalogId: string;
    collectionId: string;
    catalog?: Catalog;
  }[];
}
