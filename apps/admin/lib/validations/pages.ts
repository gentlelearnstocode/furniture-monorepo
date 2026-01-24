import { z } from 'zod';

export const customPageSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  titleVi: z.string().optional(),
  content: z.object({
    header: z.object({
      introHtml: z.string().min(1, 'Header intro is required'),
      introHtmlVi: z.string().optional(),
      buttonText: z.string().optional(),
      buttonTextVi: z.string().optional(),
      buttonLink: z.string().optional(),
    }),
    body: z.object({
      introHtml: z.string().optional(),
      introHtmlVi: z.string().optional(),
      paragraphHtml: z.string().min(1, 'Body paragraph is required'),
      paragraphHtmlVi: z.string().optional(),
      images: z
        .array(
          z.object({
            assetId: z.string().uuid(),
            url: z.string().url(),
            isPrimary: z.boolean(),
            focusPoint: z.object({ x: z.number(), y: z.number() }).optional(),
            aspectRatio: z.enum(['original', '1:1', '3:4', '4:3', '16:9']).optional(),
            objectFit: z.enum(['cover', 'contain']).optional(),
          }),
        )
        .min(1, 'At least one body image is required'),
    }),
    footer: z.object({
      textHtml: z.string().min(1, 'Footer text is required'),
      textHtmlVi: z.string().optional(),
      imageId: z.string().uuid().optional().nullable(),
      imageUrl: z.string().url().optional().nullable(), // For preview
    }),
  }),
  isActive: z.boolean(),
});

export type CustomPageInput = z.infer<typeof customPageSchema>;
