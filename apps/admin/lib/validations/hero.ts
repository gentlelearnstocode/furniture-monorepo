import { z } from 'zod';

export const heroSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  backgroundType: z.enum(['image', 'video']),
  backgroundImageId: z.string().uuid().nullable().optional(),
  backgroundVideoId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
});

export type HeroInput = z.infer<typeof heroSchema>;
