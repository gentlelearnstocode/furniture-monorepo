import { z } from 'zod';

// Schema for validating a single row from the Excel import
export const productImportRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, numbers and hyphens only'),
  catalog_name: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Price must be a positive number'),
  is_active: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      return val.toLowerCase() === 'true' || val === '1' || val.toLowerCase() === 'yes';
    })
    .default(true),
  dimensions_width: z.coerce.number().min(0).optional(),
  dimensions_height: z.coerce.number().min(0).optional(),
  dimensions_depth: z.coerce.number().min(0).optional(),
  dimensions_unit: z.string().optional(),
});

export type ProductImportRow = z.infer<typeof productImportRowSchema>;

// Validate dimensions: if any dimension field is provided, all must be provided
export function validateDimensions(row: ProductImportRow): string | null {
  const { dimensions_width, dimensions_height, dimensions_depth, dimensions_unit } = row;
  const hasAny = [dimensions_width, dimensions_height, dimensions_depth, dimensions_unit].some(
    (v) => v !== undefined && v !== null && v !== ''
  );
  const hasAll =
    dimensions_width !== undefined &&
    dimensions_height !== undefined &&
    dimensions_depth !== undefined &&
    dimensions_unit !== undefined &&
    dimensions_unit !== '';

  if (hasAny && !hasAll) {
    return 'If any dimension field is provided, all dimension fields (width, height, depth, unit) are required';
  }
  return null;
}
