import { EntityBase, LocalizedFields } from './common';
import { User } from './user';

export interface Catalog extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  level?: number;
  image?: { url: string } | null;
  children?: Catalog[];
  parent?: Catalog | null;
  createdById?: string | null;
  createdBy?: User | null;
}
