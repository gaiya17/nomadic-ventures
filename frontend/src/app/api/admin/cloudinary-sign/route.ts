import { NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { folder } = await request.json();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const safeFolder = folder ? folder.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
    const folderPath = `nomadic-ventures/${safeFolder}`;

    const paramsToSign = {
      timestamp,
      folder: folderPath,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return Response.json({
      signature,
      timestamp,
      folder: folderPath,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error('Signature error:', err);
    return Response.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
