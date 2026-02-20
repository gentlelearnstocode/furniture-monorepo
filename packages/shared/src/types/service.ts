import { EntityBase, LocalizedFields } from './common';

export interface Service extends EntityBase, LocalizedFields {
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image: {
    url: string;
    altText?: string | null;
  } | null;
  isActive: boolean;
}
