import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param buffer  - The file contents as a Buffer
 * @param folder  - The Cloudinary folder to upload into (e.g. "tours", "resorts")
 * @returns       - The secure HTTPS URL of the uploaded image
 */
export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `nomadic-ventures/${safeFolder}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Deletes an image from Cloudinary given its secure URL.
 * @param url - The full Cloudinary URL
 */
export async function deleteFromCloudinary(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes('cloudinary.com')) return;

  try {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
    const parts = url.split('/upload/');
    if (parts.length !== 2) return;
    
    let publicIdWithVersion = parts[1];
    
    // Remove version prefix if exists (starts with v and numbers)
    if (publicIdWithVersion.match(/^v\d+\//)) {
      publicIdWithVersion = publicIdWithVersion.split('/').slice(1).join('/');
    }

    // Remove extension
    const publicId = publicIdWithVersion.split('.').slice(0, -1).join('.');

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary: Successfully deleted ${publicId}`);
    }
  } catch (error) {
    console.error("Cloudinary deletion failed for URL:", url, error);
  }
}

export default cloudinary;
