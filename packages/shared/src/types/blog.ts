import { EntityBase, LocalizedFields } from './common';

import { User } from './user';

export interface BlogPost extends EntityBase, LocalizedFields {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  isActive: boolean;
  publishedAt?: Date | string | null;
  categoryId?: string | null;
  createdById?: string | null;
  createdBy?: User | null;
}

export interface BlogCategory extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
}
