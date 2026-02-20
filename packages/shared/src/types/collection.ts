import { EntityBase, LocalizedFields } from './common';
import { Product } from './product';
import { Catalog } from './catalog';
import { User } from './user';

export interface Collection<T = Product> extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description?: string | null;
  bannerId?: string | null;
  bannerUrl?: string | null;
  isActive?: boolean;
  showOnHome?: boolean;
  homeLayout?: 'full' | 'half' | 'third';
  products?: T[];
  createdById?: string | null;
  createdBy?: User | null;
}

export interface CollectionProductRelation {
  productId: string;
  collectionId: string;
  product?: Product;
}

export interface CollectionWithRelations extends Collection<CollectionProductRelation> {
  banner?: {
    id: string;
    url: string;
    alt?: string | null;
  } | null;
  catalogs?: {
    catalogId: string;
    collectionId: string;
    catalog?: Catalog;
  }[];
}
