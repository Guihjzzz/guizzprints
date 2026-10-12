import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

function loadFirebaseClient(host) {
  const calls = [];
  const app = { name: '[DEFAULT]' };
  const auth = { currentUser: null, authStateReady: async () => undefined };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { host, hostname: host.split(':')[0] }, setTimeout, clearTimeout },
  });
  const modules = {
    'firebase/app': {
      getApp: () => app,
      getApps: () => [],
      initializeApp: config => { calls.push({ name: 'initializeApp', config }); return app; },
    },
    'firebase/auth': {
      browserLocalPersistence: 'local',
      browserSessionPersistence: 'session',
      getAuth: () => auth,
      onAuthStateChanged: () => () => {},
      setPersistence: async (_auth, persistence) => {
        calls.push({ name: 'setPersistence', persistence });
        if (persistence === 'local') throw new Error('local storage is unavailable');
      },
    },
  };
  const source = readFileSync('src/lib/firebase-client.ts', 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', 'process', code)(
    name => {
      if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
      return modules[name];
    },
    exports,
    { env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: 'fixture-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'ghuizz-hololab.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'ghuizz-hololab',
      NEXT_PUBLIC_FIREBASE_APP_ID: 'fixture-app',
    } },
  );
  return { api: exports, auth, calls };
}

test('Firebase uses the canonical site as its auth domain and falls back to session persistence when local storage is blocked', async t => {
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  });
  const fixture = loadFirebaseClient('guizzprints.xyz');
  assert.equal(await fixture.api.getPreparedFirebaseAuth(), fixture.auth);
  const appConfig = fixture.calls.find(call => call.name === 'initializeApp').config;
  assert.equal(appConfig.authDomain, 'guizzprints.xyz');
  assert.deepEqual(fixture.calls.filter(call => call.name === 'setPersistence').map(call => call.persistence), [
    'local', 'session',
  ]);
});

test('Firebase keeps the configured auth domain on preview and local hosts', async t => {
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  });
  const fixture = loadFirebaseClient('localhost:5180');
  fixture.api.getFirebaseAuth();
  const appConfig = fixture.calls.find(call => call.name === 'initializeApp').config;
  assert.equal(appConfig.authDomain, 'ghuizz-hololab.firebaseapp.com');
});

test('Firebase waits for a delayed mobile auth restoration instead of reporting signed out', async t => {
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  });
  const fixture = loadFirebaseClient('guizzprints.xyz');
  let resolveAuth;
  fixture.auth.authStateReady = () => new Promise(resolve => { resolveAuth = resolve; });
  fixture.auth.currentUser = null;
  const pendingUser = fixture.api.getFirebaseUser();
  await new Promise(resolve => setTimeout(resolve, 20));
  const user = { uid: 'google-user', email: 'player@example.com' };
  fixture.auth.currentUser = user;
  resolveAuth();
  assert.equal(await pendingUser, user);
});
