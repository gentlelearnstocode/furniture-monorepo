import { z } from 'zod';

export const footerAddressSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, 'Label is required'),
  labelVi: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  addressVi: z.string().optional(),
  position: z.number(),
});

export const footerContactSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['phone', 'email']),
  label: z.string().optional(),
  labelVi: z.string().optional(),
  value: z.string().min(1, 'Value is required'),
  position: z.number(),
});

export const footerSocialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  platform: z.enum(['facebook', 'instagram', 'youtube', 'zalo', 'tiktok', 'linkedin', 'twitter']),
  url: z.string().min(1, 'URL is required'),
  isActive: z.boolean(),
  position: z.number(),
});

export const footerSettingsSchema = z.object({
  intro: z.string().min(1, 'Intro is required'),
  introVi: z.string().optional(),
  description: z.string().optional(),
  descriptionVi: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  addresses: z.array(footerAddressSchema),
  contacts: z.array(footerContactSchema),
  socialLinks: z.array(footerSocialLinkSchema),
});

export type FooterAddressInput = z.infer<typeof footerAddressSchema>;
export type FooterContactInput = z.infer<typeof footerContactSchema>;
export type FooterSocialLinkInput = z.infer<typeof footerSocialLinkSchema>;
export type FooterSettingsInput = z.infer<typeof footerSettingsSchema>;
