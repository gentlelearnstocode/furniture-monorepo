import { z } from 'zod';

export const createProductSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and kebab-case'),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    basePrice: z.coerce.number().min(0, 'Price must be a positive number'),
    discountPrice: z.coerce
      .number()
      .min(0, 'Discount price must be a positive number')
      .nullable()
      .optional(),
    showPrice: z.boolean().default(true),
    catalogId: z.string().uuid('Please select a valid catalog').optional(),
    isActive: z.boolean().default(true),
    dimensions: z
      .object({
        width: z.coerce.number().min(0),
        height: z.coerce.number().min(0),
        depth: z.coerce.number().min(0),
        unit: z.string().min(1, 'Unit is required'),
      })
      .optional(),
    images: z
      .array(
        z.object({
          assetId: z.string().uuid(),
          url: z.string().url(),
          isPrimary: z.boolean(),
          // Display settings - use nullish() to accept both null (from DB) and undefined
          focusPoint: z
            .object({
              x: z.number().min(0).max(100),
              y: z.number().min(0).max(100),
            })
            .nullish(),
          aspectRatio: z.enum(['original', '1:1', '3:4', '4:3', '16:9']).nullish(),
          objectFit: z.enum(['cover', 'contain']).nullish(),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== null &&
        data.discountPrice !== undefined &&
        data.discountPrice > 0
      ) {
        return data.discountPrice <= data.basePrice;
      }
      return true;
    },
    {
      message: 'Discount price cannot be larger than original price',
      path: ['discountPrice'],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
