import { EntityBase, LocalizedFields } from './common';

export interface BlogPost extends EntityBase, LocalizedFields {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: {
    url: string;
    altText?: string | null;
  } | null;
  isActive: boolean;
  publishedAt: Date | string | null;
  categoryId: string | null;
}

export interface BlogCategory extends EntityBase, LocalizedFields {
  name: string;
  slug: string;
}
