import { z } from 'zod';

export const createCatalogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameVi: z.string().optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
  description: z.string().optional(),
  descriptionVi: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  level: z.number().int().min(1).max(2).optional(),
  imageId: z.string().uuid().optional().nullable(),
  productImageRatio: z.string().optional(),
});

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>;
