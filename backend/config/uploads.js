import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to `backend/uploads` (stored files, not committed). */
export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

export function ensureUploadsDir() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
