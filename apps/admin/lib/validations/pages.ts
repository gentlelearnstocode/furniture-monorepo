import { z } from 'zod';

export const customPageSchema = z
  .object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().min(1, 'Title is required'),
    titleVi: z.string().optional(),
    content: z.object({
      header: z.object({
        introHtml: z.string().optional(),
        introHtmlVi: z.string().optional(),
        buttonText: z.string().optional(),
        buttonTextVi: z.string().optional(),
        buttonLink: z.string().optional(),
        button2Text: z.string().optional(),
        button2TextVi: z.string().optional(),
        button2Link: z.string().optional(),
      }),
      body: z.object({
        introHtml: z.string().optional(),
        introHtmlVi: z.string().optional(),
        paragraphHtml: z.string().optional(),
        paragraphHtmlVi: z.string().optional(),
        images: z
          .array(
            z.object({
              assetId: z.string(),
              url: z.string(),
              isPrimary: z.boolean().optional(),
              focusPoint: z.object({ x: z.number(), y: z.number() }).optional(),
              aspectRatio: z.enum(['original', '1:1', '3:4', '4:3', '16:9']).optional(),
              objectFit: z.enum(['cover', 'contain']).optional(),
            }),
          )
          .optional(),
      }),
      footer: z.object({
        textHtml: z.string().optional(),
        textHtmlVi: z.string().optional(),
        imageId: z.string().uuid().optional().nullable(),
        imageUrl: z.string().url().optional().nullable(),
      }),
      bannerId: z.string().uuid().optional().nullable(),
      bannerUrl: z.string().url().optional().nullable(),
      pdfId: z.string().uuid().optional().nullable(),
      pdfUrl: z.string().url().optional().nullable(),
    }),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // About Us and new simple pages don't require standard content fields
    if (['about-us', 'construction-manufacturing', 'manufacturing-services'].includes(data.slug))
      return;

    // Enforce requirements for other pages
    if (!data.content.header.introHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Header intro is required',
        path: ['content', 'header', 'introHtml'],
      });
    }

    if (!data.content.body.paragraphHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Body paragraph is required',
        path: ['content', 'body', 'paragraphHtml'],
      });
    }

    if (!data.content.body.images || data.content.body.images.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one body image is required',
        path: ['content', 'body', 'images'],
      });
    }

    if (!data.content.footer.textHtml) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Footer text is required',
        path: ['content', 'footer', 'textHtml'],
      });
    }
  });

export type CustomPageInput = z.infer<typeof customPageSchema>;
