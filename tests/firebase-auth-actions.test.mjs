// Isolated Firebase fixtures: no provider windows, account creation, or e-mail deliveries.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import * as returns from '../src/lib/auth-return.ts';

function load(path, modules) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  return exports;
}

function firebaseFixture({ popupError = null } = {}) {
  const calls = [];
  class GoogleAuthProvider {
    setCustomParameters(value) { calls.push({ name: 'parameters', value }); }
  }
  const auth = { currentUser: null };
  const api = load('src/lib/firebase-auth-actions.ts', {
    'firebase/auth': {
      GoogleAuthProvider,
      signInWithPopup: async () => {
        calls.push({ name: 'popup' });
        if (popupError) throw popupError;
      },
      signInWithRedirect: async () => { calls.push({ name: 'redirect' }); },
    },
    './firebase-client': { getPreparedFirebaseAuth: async () => auth },
    './auth-return': returns,
    './auth-actions': { normalizeAuthEmail: value => value, normalizeAuthUsername: value => value },
  });
  return { api, calls };
}

const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
function browser(userAgent, platform = 'Win32', maxTouchPoints = 0) {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { userAgent, platform, maxTouchPoints },
  });
}
function restoreNavigator() {
  if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
  else Reflect.deleteProperty(globalThis, 'navigator');
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
  else Reflect.deleteProperty(globalThis, 'window');
}

function browserWindow() {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: globalThis });
}

test('desktop Google sign-in uses a popup and returns to the safe catalogue page', async (t) => {
  t.after(restoreNavigator);
  browser('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  browserWindow();
  const { api, calls } = firebaseFixture();
  assert.deepEqual(await api.signInWithFirebaseGoogle({ locale: 'pt', next: '/pt/search?edition=java' }), {
    redirect: '/pt/search?edition=java',
  });
  assert.deepEqual(calls.map(call => call.name), ['parameters', 'popup']);
});

test('mobile Google sign-in uses Firebase redirect', async (t) => {
  t.after(restoreNavigator);
  browser('Mozilla/5.0 (Linux; Android 14)');
  browserWindow();
  const { api, calls } = firebaseFixture();
  assert.deepEqual(await api.signInWithFirebaseGoogle({ locale: 'pt', next: '/pt' }), { redirectStarted: true });
  assert.deepEqual(calls.map(call => call.name), ['parameters', 'redirect']);
});

test('a blocked desktop popup falls back to redirect, while a cancelled popup stays on the form', async (t) => {
  t.after(restoreNavigator);
  browser('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  browserWindow();
  const blocked = firebaseFixture({ popupError: { code: 'auth/popup-blocked' } });
  assert.deepEqual(await blocked.api.signInWithFirebaseGoogle({ locale: 'pt', next: '/pt' }), { redirectStarted: true });
  assert.deepEqual(blocked.calls.map(call => call.name), ['parameters', 'popup', 'redirect']);
  const cancelled = firebaseFixture({ popupError: { code: 'auth/popup-closed-by-user' } });
  assert.deepEqual(await cancelled.api.signInWithFirebaseGoogle({ locale: 'pt', next: '/pt' }), {
    key: 'authUnavailable', success: false,
  });
  assert.deepEqual(cancelled.calls.map(call => call.name), ['parameters', 'popup']);
});
