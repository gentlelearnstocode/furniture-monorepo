'use server';

import { uploadAsset, deleteAsset } from '@repo/assets';

export async function uploadAssetAction(formData: FormData) {
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string | undefined;

  if (!file) throw new Error('No file provided');

  return await uploadAsset(file, file.name, folder);
}

export async function deleteAssetAction(id: string) {
  return await deleteAsset(id);
}
