import 'server-only';

import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { verifyFirebaseIdToken } from '@/lib/firebase-token';

function allowedFirebaseAdmins() {
  return new Set(
    (process.env.FIREBASE_ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isAllowedAdminEmail(email: string | null | undefined) {
  return Boolean(email && allowedFirebaseAdmins().has(email.toLowerCase()));
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length).trim();
  return token || null;
}

export async function isFirebaseAdmin(request: NextRequest) {
  const token = bearerToken(request);
  if (!token) return false;
  const firebaseUser = await verifyFirebaseIdToken(token);
  return Boolean(firebaseUser && isAllowedAdminEmail(firebaseUser.email));
}

export async function requireAdmin(request: NextRequest) {
  const token = bearerToken(request);
  if (!token) return null;

  // Firebase ID tokens are verified against Google's published keys and are
  // restricted to the configured Firebase project before the e-mail allowlist
  // is consulted. The Supabase branch below keeps existing administrator
  // accounts working during the authentication migration.
  const firebaseUser = await verifyFirebaseIdToken(token);
  if (firebaseUser && isAllowedAdminEmail(firebaseUser.email)) {
    return { supabase: getSupabaseAdmin(), user: { id: firebaseUser.uid, email: firebaseUser.email } };
  }

  // Do not turn an unauthenticated request into a 500 when a local or
  // partially configured deployment does not have the server-only Supabase
  // credentials yet. Firebase administrators have already returned above;
  // the fallback is only for the legacy Supabase session path.
  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return null;
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) return null;

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError || !admin || !isAllowedAdminEmail(user.email)) return null;

  return { supabase, user };
}
