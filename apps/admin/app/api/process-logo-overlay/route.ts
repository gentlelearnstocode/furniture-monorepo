import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { getLogoOverlaySettings } from '@/lib/actions/logo-overlay-settings';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageUrl = formData.get('imageUrl') as string;
    const filename = formData.get('filename') as string;

    if (!imageUrl || !filename) {
      return NextResponse.json({ error: 'Missing imageUrl or filename' }, { status: 400 });
    }

    // Get logo overlay settings
    const settings = await getLogoOverlaySettings();

    // If overlay is disabled or no logo configured, return original URL
    if (!settings.enabled || !settings.logoUrl) {
      return NextResponse.json({ url: imageUrl, processed: false });
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch original image' }, { status: 500 });
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    // Fetch the logo image
    const logoResponse = await fetch(settings.logoUrl);
    if (!logoResponse.ok) {
      // If logo fetch fails, return original image
      return NextResponse.json({ url: imageUrl, processed: false });
    }
    const logoArrayBuffer = await logoResponse.arrayBuffer();
    const logoBuffer = Buffer.from(logoArrayBuffer);

    // Get base image dimensions
    const baseImage = sharp(imageBuffer);
    const metadata = await baseImage.metadata();
    const baseWidth = metadata.width || 1000;
    const baseHeight = metadata.height || 1000;

    // Calculate logo size based on percentage of image width
    const logoWidth = Math.round(baseWidth * (settings.sizePercent / 100));

    // Resize logo
    const resizedLogo = await sharp(logoBuffer)
      .resize({ width: logoWidth })
      .ensureAlpha()
      .toBuffer();

    // Apply opacity if needed
    let processedLogo = resizedLogo;
    if (settings.opacity < 100) {
      // Create an alpha mask to apply opacity
      const logoMeta = await sharp(resizedLogo).metadata();
      const logoW = logoMeta.width || logoWidth;
      const logoH = logoMeta.height || logoWidth;

      // Extract alpha channel and reduce its values
      const { data, info } = await sharp(resizedLogo).raw().toBuffer({ resolveWithObject: true });

      // Modify alpha values
      const opacityFactor = settings.opacity / 100;
      for (let i = 3; i < data.length; i += 4) {
        const alphaValue = data[i];
        if (alphaValue !== undefined) {
          data[i] = Math.round(alphaValue * opacityFactor);
        }
      }

      processedLogo = await sharp(data, {
        raw: { width: logoW, height: logoH, channels: info.channels as 1 | 2 | 3 | 4 },
      })
        .png()
        .toBuffer();
    }

    // Get processed logo dimensions
    const logoMeta = await sharp(processedLogo).metadata();
    const finalLogoWidth = logoMeta.width || logoWidth;
    const finalLogoHeight = logoMeta.height || logoWidth;

    // Calculate position based on setting
    const padding = settings.padding;
    let left: number;
    let top: number;

    switch (settings.position) {
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
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload the watermarked image to Vercel Blob
    const watermarkedFilename = `watermarked/${filename}`;
    const blob = await put(watermarkedFilename, result, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json({
      url: blob.url,
      processed: true,
    });
  } catch (error) {
    console.error('[process-logo-overlay] Error:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
