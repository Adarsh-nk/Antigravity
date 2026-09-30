import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_IMAGE_BYTES,
    files: 1,
  },
});

export const singleImageUpload = upload.single('image');

export function checkMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { mimeType: 'image/png', ext: 'png' };
  }

  // WebP: RIFF....WEBP
  const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  if (isRiff && isWebp) {
    return { mimeType: 'image/webp', ext: 'webp' };
  }

  return false;
}

export function validateUploadedImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  const detected = checkMagicBytes(req.file.buffer);
  if (!detected) {
    return next(new AppError('UNSUPPORTED_MEDIA_TYPE', 'Invalid image file format. Only JPEG, PNG, and WebP are allowed.', 415));
  }

  req.file.verifiedMimeType = detected.mimeType;
  req.file.verifiedExt = detected.ext;
  next();
}
