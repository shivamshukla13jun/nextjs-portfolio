import { uploadToGridFS } from '@/lib/db/gridfs';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const POST = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const rawFilename = decodeURIComponent(req.headers.get('x-filename') || `upload-${Date.now()}`);
  const mimeType = req.headers.get('x-mimetype') || 'application/octet-stream';
  const category = (req.headers.get('x-category') || 'general') as any;
  const buffer = Buffer.from(await req.arrayBuffer());
  const fileRecord = await uploadToGridFS(buffer, rawFilename, mimeType, category);
  return jres(req, { success: true, file: fileRecord });
});
