import 'server-only';

import { createRemoteJWKSet, jwtVerify } from 'jose';

type FirebaseIdentity = { uid: string; email: string | null };

let publicKeys: ReturnType<typeof createRemoteJWKSet> | null = null;

function firebaseProjectId() {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';
}

export async function verifyFirebaseIdToken(token: string): Promise<FirebaseIdentity | null> {
  const projectId = firebaseProjectId();
  if (!projectId || !token || token.length > 12_000) return null;
  try {
    publicKeys ??= createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
    const { payload } = await jwtVerify(token, publicKeys, {
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      algorithms: ['RS256'],
    });
    if (typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128) return null;
    return { uid: payload.sub, email: typeof payload.email === 'string' ? payload.email.toLowerCase() : null };
  } catch {
    return null;
  }
}
