import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional().nullable(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
  descriptionHtml: z.string().min(1, 'Description is required'),
  descriptionHtmlVi: z.string().optional().nullable(),
  isActive: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoTitleVi: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoDescriptionVi: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoKeywordsVi: z.string().optional().nullable(),
  images: z.array(
    z.object({
      assetId: z.string().uuid(),
      url: z.string().url(),
      isPrimary: z.boolean(),
    }),
  ),
});

export type ServiceInput = {
  title: string;
  titleVi?: string | null;
  slug: string;
  descriptionHtml: string;
  descriptionHtmlVi?: string | null;
  isActive: boolean;
  images: {
    assetId: string;
    url: string;
    isPrimary: boolean;
  }[];
  seoTitle?: string | null;
  seoTitleVi?: string | null;
  seoDescription?: string | null;
  seoDescriptionVi?: string | null;
  seoKeywords?: string | null;
  seoKeywordsVi?: string | null;
};
