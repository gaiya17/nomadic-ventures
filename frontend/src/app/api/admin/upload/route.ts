import { NextRequest } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const folder = url.searchParams.get('folder') || 'general';

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return Response.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadToCloudinary(buffer, folder);
      urls.push(url);
    }

    return Response.json({ success: true, urls });
  } catch (err) {
    console.error('Upload error:', err);
    return Response.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}

// Allow large file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
