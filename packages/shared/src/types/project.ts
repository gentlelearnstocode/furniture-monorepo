import { EntityBase, LocalizedFields } from './common';
import { User } from './user';

export interface Project extends EntityBase, LocalizedFields {
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  image: {
    url: string;
    altText?: string | null;
  } | null;
  isActive: boolean;
  createdById?: string | null;
  createdBy?: User | null;
}
