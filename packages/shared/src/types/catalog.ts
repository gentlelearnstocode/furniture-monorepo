import { EntityBase, LocalizedFields } from './common';

export interface Catalog extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description: string | null;
  parentId?: string | null;
  image?: { url: string } | null;
}
