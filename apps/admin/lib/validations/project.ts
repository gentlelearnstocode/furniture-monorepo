import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
  contentHtml: z.string().min(1, 'Content is required'),
  isActive: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  images: z.array(
    z.object({
      assetId: z.string().uuid(),
      url: z.string().url(),
      isPrimary: z.boolean(),
    })
  ),
});

export type ProjectInput = {
  title: string;
  slug: string;
  contentHtml: string;
  isActive: boolean;
  images: {
    assetId: string;
    url: string;
    isPrimary: boolean;
  }[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
};
