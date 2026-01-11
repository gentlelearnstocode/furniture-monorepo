'use server';

import { uploadAsset, deleteAsset } from '@repo/assets';

export async function uploadAssetAction(formData: FormData) {
  try {
    console.log('[uploadAssetAction] Start upload');
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | undefined;

    if (!file) {
      console.error('[uploadAssetAction] No file provided');
      throw new Error('No file provided');
    }

    console.log('[uploadAssetAction] File info:', {
      name: file.name,
      type: file.type,
      size: file.size,
      folder,
    });

    const result = await uploadAsset(file, file.name, folder);
    if (result) {
      console.log('[uploadAssetAction] Success:', result.id);
    } else {
      console.warn('[uploadAssetAction] uploadAsset returned null/undefined');
    }
    return result;
  } catch (error) {
    console.error('[uploadAssetAction] Error:', error);
    throw error;
  }
}

export async function deleteAssetAction(id: string) {
  return await deleteAsset(id);
}
