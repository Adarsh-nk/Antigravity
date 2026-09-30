import { logger } from '../lib/logger.js';

const BUCKET_NAME = 'crop-images';

export async function uploadCropImage(db, userId, fileBuffer, mimeType, ext) {
  const filename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { data, error } = await db.storage.from(BUCKET_NAME).upload(filename, fileBuffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    logger.error({ err: error, userId, filename }, 'Storage upload failed');
    throw error;
  }

  return data.path;
}

export async function getSignedImageUrl(db, imagePath) {
  if (!imagePath) return null;

  const { data, error } = await db.storage.from(BUCKET_NAME).createSignedUrl(imagePath, 60);

  if (error) {
    logger.warn({ err: error, imagePath }, 'Failed to create signed URL for image');
    return null;
  }

  return data.signedUrl;
}

export async function deleteCropImage(db, imagePath) {
  if (!imagePath) return;

  const { error } = await db.storage.from(BUCKET_NAME).remove([imagePath]);
  if (error) {
    logger.warn({ err: error, imagePath }, 'Failed to delete crop image from storage');
  }
}
