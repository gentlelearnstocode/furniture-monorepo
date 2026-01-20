import { z } from 'zod';

export const introSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleVi: z.string().optional(),
  contentHtml: z.string().min(1, 'Content is required'),
  contentHtmlVi: z.string().optional(),
  introImageId: z.string().uuid().optional().nullable(),
  backgroundImageId: z.string().uuid().optional().nullable(),
  isActive: z.boolean(),
});

export type IntroInput = z.infer<typeof introSchema>;
