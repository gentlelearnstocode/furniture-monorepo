import { z } from 'zod';

export const navMenuItemSchema = z.object({
  id: z.string().uuid().optional(),
  itemType: z.enum(['catalog', 'subcatalog', 'service']),
  catalogId: z.string().uuid().nullable().optional(),
  serviceId: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

export const saveNavMenuItemsSchema = z.object({
  items: z.array(navMenuItemSchema),
});

export type NavMenuItemInput = z.infer<typeof navMenuItemSchema>;
export type SaveNavMenuItemsInput = z.infer<typeof saveNavMenuItemsSchema>;
