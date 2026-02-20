import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameVi: z.string().optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
  description: z.string().optional(),
  descriptionVi: z.string().optional(),
  bannerId: z.string().uuid().optional().nullable(),
  isActive: z.boolean(),
  productIds: z.array(z.string().uuid()),
  catalogIds: z.array(z.string().uuid()),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
