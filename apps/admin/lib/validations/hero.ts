import { z } from 'zod';

export const heroSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().optional(),
    titleVi: z.string().optional(),
    subtitle: z.string().optional(),
    subtitleVi: z.string().optional(),
    buttonText: z.string().optional(),
    buttonTextVi: z.string().optional(),
    buttonLink: z.string().optional(),
    backgroundType: z.enum(['image', 'video']),
    backgroundImageId: z.string().uuid().nullable().optional(),
    backgroundVideoId: z.string().uuid().nullable().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.backgroundType === 'image') {
        return !!data.backgroundImageId;
      }
      if (data.backgroundType === 'video') {
        return !!data.backgroundVideoId;
      }
      return true;
    },
    {
      message: 'Background media is required',
      path: ['backgroundImageId'], // This is a bit tricky, but it will show up
    },
  );

export type HeroInput = z.infer<typeof heroSchema>;
