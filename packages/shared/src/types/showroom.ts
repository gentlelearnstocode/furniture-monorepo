import { EntityBase, LocalizedFields } from './common';

export interface Showroom extends EntityBase, LocalizedFields {
  title: string;
  subtitle?: string | null;
  subtitleVi?: string | null;
  type: 'showroom' | 'factory';
  contentHtml?: string | null;
  contentHtmlVi?: string | null;
  imageId?: string | null;
  position: number;
  isActive: boolean;
  image?: { url: string } | null;
}
