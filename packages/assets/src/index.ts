import { put, del } from "@vercel/blob";
import { db, assets } from "@repo/database";
import { eq } from "drizzle-orm";

export async function uploadAsset(file: File | Blob, filename: string, prefix?: string) {
  try {
    const pathname = prefix ? `${prefix}/${filename}` : filename;

    // 1. Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
    });

    // 2. Create database record
    const [asset] = await db.insert(assets).values({
      url: blob.url,
      filename: filename,
      mimeType: file.type,
      size: file.size,
    }).returning();

    return asset;
  } catch (error) {
    console.error("Failed to upload asset:", error);
    throw new Error("Failed to upload asset");
  }
}

export async function deleteAsset(id: string) {
  try {
    // 1. Get asset details from DB
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));

    if (!asset) {
      throw new Error("Asset not found");
    }

    // 2. Delete from Vercel Blob
    await del(asset.url);

    // 3. Delete from DB
    await db.delete(assets).where(eq(assets.id, id));

    return { success: true };
  } catch (error) {
    console.error("Failed to delete asset:", error);
    throw new Error("Failed to delete asset");
  }
}
