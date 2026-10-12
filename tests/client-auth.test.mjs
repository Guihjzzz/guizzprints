import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

function loadClientAuth(firebaseUser) {
  const supabaseUser = { id: 'old-supabase-user', email: 'old@example.com', user_metadata: { username: 'Old account' } };
  const supabaseSession = { user: supabaseUser, access_token: 'old-supabase-token' };
  const modules = {
    'firebase/auth': { onAuthStateChanged: () => () => undefined },
    './supabase': { supabase: { auth: {
      getSession: async () => ({ data: { session: supabaseSession } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    } } },
    './firebase-client': {
      getFirebaseAuth: () => ({ currentUser: firebaseUser }),
      getFirebaseUser: async () => firebaseUser,
    },
  };
  const code = ts.transpileModule(readFileSync('src/lib/client-auth.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', code)(name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  return exports;
}

test('restored Firebase identity takes precedence over a stale Supabase session', async () => {
  const firebaseUser = {
    uid: 'google-user',
    email: 'google@example.com',
    displayName: 'Google account',
    getIdToken: async () => 'firebase-id-token',
  };
  const auth = loadClientAuth(firebaseUser);

  assert.deepEqual(await auth.getClientAuthUser(), {
    id: 'google-user', email: 'google@example.com', displayName: 'Google account',
  });
  assert.equal(await auth.getClientAuthToken(), 'firebase-id-token');
});
