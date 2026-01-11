import { NextResponse } from 'next/server';
import { uploadAsset } from '@repo/assets';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | undefined;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    const asset = await uploadAsset(file, file.name, folder);
    return NextResponse.json(asset);
  } catch (error) {
    console.error('[ASSETS_UPLOAD_POST] Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
