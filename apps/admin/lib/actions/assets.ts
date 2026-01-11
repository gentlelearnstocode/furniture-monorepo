'use server';

import { deleteAsset, createAssetRecord } from '@repo/assets';

export async function deleteAssetAction(id: string) {
  return await deleteAsset(id);
}

export async function createAssetAction(
  url: string,
  filename: string,
  mimeType: string,
  size: number
) {
  try {
    const result = await createAssetRecord(url, filename, mimeType, size);
    return result;
  } catch (error) {
    console.error('[createAssetAction] Error:', error);
    throw error;
  }
}
