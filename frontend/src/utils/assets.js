/** Public URL for a file stored under `backend/uploads` (proxied in dev). */
export function menuImageUrl(filename) {
  if (!filename) return null;
  return `/uploads/${encodeURIComponent(filename)}`;
}
