'use server';

import { db, siteSettings } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { revalidateStorefront } from '../revalidate-storefront';

// Logo overlay settings type
export interface LogoOverlaySettings {
  enabled: boolean;
  logoAssetId: string | null;
  logoUrl: string | null;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  sizePercent: number; // 5-30% of image width
  opacity: number; // 0-100
  padding: number; // pixels from edge
}

const DEFAULT_SETTINGS: LogoOverlaySettings = {
  enabled: false,
  logoAssetId: null,
  logoUrl: null,
  position: 'top-right',
  sizePercent: 15,
  opacity: 80,
  padding: 20,
};

const SETTINGS_KEY = 'logo_overlay';

export async function getLogoOverlaySettings(): Promise<LogoOverlaySettings> {
  try {
    const setting = await db.query.siteSettings.findFirst({
      where: (settings, { eq }) => eq(settings.key, SETTINGS_KEY),
    });

    if (!setting) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...(setting.value as Partial<LogoOverlaySettings>),
    };
  } catch (error) {
    console.error('[getLogoOverlaySettings] Error:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateLogoOverlaySettings(
  settings: Partial<LogoOverlaySettings>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await db.query.siteSettings.findFirst({
      where: (s, { eq }) => eq(s.key, SETTINGS_KEY),
    });

    const newSettings = {
      ...DEFAULT_SETTINGS,
      ...(existing?.value as Partial<LogoOverlaySettings>),
      ...settings,
    };

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          value: newSettings,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, SETTINGS_KEY));
    } else {
      await db.insert(siteSettings).values({
        key: SETTINGS_KEY,
        value: newSettings,
      });
    }

    revalidatePath('/homepage/settings');
    await revalidateStorefront(['settings']);
    return { success: true };
  } catch (error) {
    console.error('[updateLogoOverlaySettings] Error:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
