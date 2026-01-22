'use server';

import sharp from 'sharp';
import { getLogoOverlaySettings, type LogoOverlaySettings } from './logo-overlay-settings';

interface ProcessImageResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

/**
 * Apply logo overlay to an image buffer
 */
export async function applyLogoOverlay(
  imageBuffer: Buffer,
  settings?: LogoOverlaySettings,
): Promise<ProcessImageResult> {
  try {
    // Get settings if not provided
    const overlaySettings = settings || (await getLogoOverlaySettings());

    // Check if overlay is enabled and we have a logo
    if (!overlaySettings.enabled || !overlaySettings.logoUrl) {
      return { success: true, buffer: imageBuffer };
    }

    // Fetch the logo image
    const logoResponse = await fetch(overlaySettings.logoUrl);
    if (!logoResponse.ok) {
      console.error('[applyLogoOverlay] Failed to fetch logo:', overlaySettings.logoUrl);
      return { success: true, buffer: imageBuffer }; // Return original if logo fetch fails
    }
    const logoArrayBuffer = await logoResponse.arrayBuffer();
    const logoBuffer = Buffer.from(logoArrayBuffer);

    // Get base image dimensions
    const baseImage = sharp(imageBuffer);
    const metadata = await baseImage.metadata();
    const baseWidth = metadata.width || 1000;
    const baseHeight = metadata.height || 1000;

    // Calculate logo size based on percentage of image width
    const logoWidth = Math.round(baseWidth * (overlaySettings.sizePercent / 100));

    // Resize logo and apply opacity
    const processedLogo = await sharp(logoBuffer)
      .resize({ width: logoWidth })
      .ensureAlpha()
      .composite([
        {
          input: Buffer.from([0, 0, 0, Math.round((overlaySettings.opacity / 100) * 255)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();

    // Get processed logo dimensions
    const logoMeta = await sharp(processedLogo).metadata();
    const finalLogoWidth = logoMeta.width || logoWidth;
    const finalLogoHeight = logoMeta.height || logoWidth;

    // Calculate position based on setting
    const padding = overlaySettings.padding;
    let left: number;
    let top: number;

    switch (overlaySettings.position) {
      case 'top-left':
        left = padding;
        top = padding;
        break;
      case 'top-right':
        left = baseWidth - finalLogoWidth - padding;
        top = padding;
        break;
      case 'bottom-left':
        left = padding;
        top = baseHeight - finalLogoHeight - padding;
        break;
      case 'bottom-right':
        left = baseWidth - finalLogoWidth - padding;
        top = baseHeight - finalLogoHeight - padding;
        break;
      case 'center':
        left = Math.round((baseWidth - finalLogoWidth) / 2);
        top = Math.round((baseHeight - finalLogoHeight) / 2);
        break;
      default:
        left = baseWidth - finalLogoWidth - padding;
        top = padding;
    }

    // Ensure position is not negative
    left = Math.max(0, left);
    top = Math.max(0, top);

    // Composite logo onto base image
    const result = await baseImage
      .composite([
        {
          input: processedLogo,
          left,
          top,
        },
      ])
      .toBuffer();

    return { success: true, buffer: result };
  } catch (error) {
    console.error('[applyLogoOverlay] Error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Process an image from URL and return the watermarked image buffer
 */
export async function processImageWithLogoOverlay(imageUrl: string): Promise<ProcessImageResult> {
  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch image' };
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Apply logo overlay
    return applyLogoOverlay(imageBuffer);
  } catch (error) {
    console.error('[processImageWithLogoOverlay] Error:', error);
    return { success: false, error: String(error) };
  }
}
