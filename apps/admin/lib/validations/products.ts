import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and kebab-case"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  basePrice: z.coerce.number().min(0, "Price must be a positive number"),
  catalogId: z.string().uuid("Please select a valid catalog").optional(),
  isActive: z.boolean().default(true),
  dimensions: z.object({
    width: z.coerce.number().min(0),
    height: z.coerce.number().min(0),
    depth: z.coerce.number().min(0),
    unit: z.string().min(1, "Unit is required"),
  }).optional(),
  images: z.array(z.object({
    assetId: z.string().uuid(),
    url: z.string().url(),
    isPrimary: z.boolean(),
  })).default([]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
