import { downloadFromGridFS, deleteFromGridFS } from '@/lib/db/gridfs';
import { corsHeaders, handle, jres, notFound, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

// Public — serves stored files (project images, resumes, etc.)
export const GET = handle(async (req, ctx) => {
  const { id } = await ctx.params;
  const resFile = await downloadFromGridFS(id);
  if (!resFile || !resFile.buffer) return notFound(req, 'File not found');
  return new Response(resFile.buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Content-Type': resFile.meta.mimeType || 'application/octet-stream',
      'Content-Length': resFile.meta.size.toString(),
    },
  });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const success = await deleteFromGridFS(id);
  return jres(req, { success });
});
