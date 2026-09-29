import type { NextRequest } from 'next/server';
import { handleApiRequest } from '@/server/api-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-filename, x-mimetype, x-category',
  };
}

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : Buffer.from(await req.arrayBuffer());

  const result = await handleApiRequest({
    method: req.method,
    url: url.pathname + url.search,
    headers: req.headers,
    body,
  });

  return new Response(result.body as BodyInit | null, {
    status: result.status,
    headers: { ...result.headers, ...corsHeaders(req.headers.get('origin')) },
  });
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as HEAD,
};
