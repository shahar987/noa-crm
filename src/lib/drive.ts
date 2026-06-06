import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadPhoto(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ fileId: string; url: string }> {
  const result = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'noa-crm',
        resource_type: 'image',
        format: 'webp',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => {
        if (err || !result) reject(err ?? new Error('Upload failed'));
        else resolve(result as { public_id: string; secure_url: string });
      },
    ).end(buffer);
  });

  return { fileId: result.public_id, url: result.secure_url };
}

export async function deletePhoto(fileId: string): Promise<void> {
  await cloudinary.uploader.destroy(fileId);
}
