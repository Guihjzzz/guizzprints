import 'server-only';

type EdgeResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

function functionUrl() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error('O catálogo Supabase não está configurado.');
  return new URL('/functions/v1/guizz-catalog', base).toString();
}

export function hasGuizzCatalogConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function invokeGuizzCatalog<T>(payload: Record<string, unknown>, firebaseToken?: string): Promise<EdgeResult<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (firebaseToken) headers.Authorization = `Bearer ${firebaseToken}`;

  const response = await fetch(functionUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const raw = await response.text();
  let body: unknown = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }
  const message = body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string'
    ? (body as { error: string }).error : null;
  return { ok: response.ok, status: response.status, data: response.ok ? body as T : null, error: message };
}
