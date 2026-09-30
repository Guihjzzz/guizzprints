import 'server-only';

import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifyFirebaseIdToken } from '@/lib/firebase-token';

export type AuthenticatedUser = { id: string; email: string | null };

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length).trim();
  return token && token.length <= 12_000 ? token : null;
}

/**
 * Accept Firebase identities and preserve access for older Supabase accounts
 * during the authentication migration. The verified provider user id is the
 * only id that callers may use for account-owned data.
 */
export async function requireAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = bearerToken(request);
  if (!token) return null;

  const firebaseUser = await verifyFirebaseIdToken(token);
  if (firebaseUser) return { id: firebaseUser.uid, email: firebaseUser.email };

  try {
    const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !user) return null;
    return { id: user.id, email: user.email?.toLowerCase() ?? null };
  } catch {
    return null;
  }
}
