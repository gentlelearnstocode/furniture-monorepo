import { z } from 'zod';

export const createCatalogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  imageId: z.string().uuid().optional().nullable(),
});

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>;
