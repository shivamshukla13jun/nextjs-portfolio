import type { NextRequest } from 'next/server';
import { AuthService } from './services/auth.service.ts';

// --- CORS: reflect request origin so any domain (incl. credentialed) can call the API ---

export function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-filename, x-mimetype, x-category',
  };
}

export function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

// --- Response helpers ---

export function jres(req: NextRequest, data: any, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, {
    status,
    headers: { ...corsHeaders(req.headers.get('origin')), ...headers },
  });
}

export function unauthorized(req: NextRequest) {
  return jres(req, { error: 'Unauthorized' }, 401);
}

export function badRequest(req: NextRequest, error: string) {
  return jres(req, { error }, 400);
}

export function notFound(req: NextRequest, error = 'Not found') {
  return jres(req, { error }, 404);
}

// --- Auth ---

export async function getAuthPayload(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieMatch = cookieHeader.match(/devfolio_admin_session=([^;]+)/);
  const bearerMatch = (req.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
  const token = cookieMatch?.[1] || bearerMatch?.[1];
  if (!token) return null;
  return AuthService.verifyToken(token);
}

/** Returns the JWT payload when a valid admin session exists, else null. */
export async function requireAuth(req: NextRequest) {
  const payload = await getAuthPayload(req);
  return payload && payload.role === 'ADMIN' ? payload : null;
}

// --- Error boundary: wraps a handler so uncaught errors become JSON 500s ---

type Ctx = { params: Promise<Record<string, string>> };

export function handle(fn: (req: NextRequest, ctx: Ctx) => Promise<Response>) {
  return async (req: NextRequest, ctx: Ctx) => {
    try {
      return await fn(req, ctx);
    } catch (error: any) {
      console.error('API Error:', error);
      return jres(req, { error: error.message || 'Internal Server Error' }, 500);
    }
  };
}
