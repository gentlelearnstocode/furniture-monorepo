import { z } from 'zod';

export const showroomSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleVi: z.string().optional(),
  type: z.enum(['showroom', 'factory']).default('showroom'),
  contentHtml: z.string().optional(),
  contentHtmlVi: z.string().optional(),
  imageId: z.string().min(1, 'Image is required'),
  position: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type ShowroomInput = z.infer<typeof showroomSchema>;
