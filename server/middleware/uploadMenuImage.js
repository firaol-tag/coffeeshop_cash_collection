import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import { UPLOADS_DIR, ensureUploadsDir } from '../config/uploads.js';

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
    const name = `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (allowedMime.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'));
    }
  },
});

/** Multer middleware: field name `image`. File is optional. */
export function uploadMenuImageOptional(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const message = err.message || 'Upload failed';
    return res.status(400).json({ error: message });
  });
}
