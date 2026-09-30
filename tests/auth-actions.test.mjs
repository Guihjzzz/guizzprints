// Isolated Auth fixtures: no email deliveries, account creations or real credentials.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import * as returns from '../src/lib/auth-return.ts';

function load(path, modules, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'exports', ...Object.keys(globals), code)(name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports, ...Object.values(globals));
  return exports;
}
const api = load('src/lib/auth-actions.ts', { './auth-return': returns });
const input = { mode: 'register', email: ' Owner@Example.test ', password: 'isolated-only', username: ' Player ',
  locale: 'pt', origin: 'https://www.example.test', next: '/pt/search?edition=java', captchaToken: 'fixture-token' };
function auth(result = { data: { session: null }, error: null }) {
  const calls = [];
  const methods = Object.fromEntries(['signUp', 'signInWithPassword', 'resetPasswordForEmail', 'resend', 'signInWithOAuth']
    .map(name => [name, async (...args) => { calls.push({ name, args }); return result; }]));
  return { methods, calls };
}

test('signup normalizes email, preserves selected catalogue destination and forwards one-use CAPTCHA', async () => {
  const fixture = auth();
  assert.equal((await api.submitEmailAuth(fixture.methods, input)).key, 'confirmationSent');
  const body = fixture.calls[0].args[0];
  assert.equal(body.email, 'owner@example.test');
  assert.deepEqual(body.options.data, { username: 'Player', locale: 'pt' });
  assert.equal(body.options.captchaToken, 'fixture-token');
  const url = new URL(body.options.emailRedirectTo);
  assert.equal(url.pathname, '/auth/callback');
  assert.equal(url.searchParams.get('next'), input.next);
  assert.equal(url.searchParams.get('locale'), 'pt');
});
test('auth input validation rejects unsafe email and username shapes before contacting Auth', async () => {
  const invalidEmail = auth();
  const result = await api.submitEmailAuth(invalidEmail.methods, { ...input, email: ` ${'x'.repeat(250)}@example.test ` });
  assert.deepEqual(result, { key: 'emailInvalid', success: false });
  assert.equal(invalidEmail.calls.length, 0);

  const invalidUsername = auth();
  const usernameResult = await api.submitEmailAuth(invalidUsername.methods, { ...input, username: ' \u0000 ' });
  assert.deepEqual(usernameResult, { key: 'usernameInvalid', success: false });
  assert.equal(invalidUsername.calls.length, 0);

  const invalidResend = auth();
  assert.deepEqual(await api.resendConfirmation(invalidResend.methods, { ...input, email: 'not-an-email' }), { key: 'emailInvalid', success: false });
  assert.equal(invalidResend.calls.length, 0);
});
test('reset and confirmation resend forward CAPTCHA and use generic non-enumerating responses', async () => {
  const fixture = auth();
  assert.equal((await api.submitEmailAuth(fixture.methods, { ...input, mode: 'reset' })).key, 'resetLinkSent');
  const [email, options] = fixture.calls[0].args;
  assert.equal(email, 'owner@example.test');
  assert.equal(options.captchaToken, input.captchaToken);
  const url = new URL(options.redirectTo);
  assert.equal(url.searchParams.get('next'), '/pt/login/update-password');
  assert.equal(url.searchParams.get('returnTo'), input.next);
  assert.equal((await api.resendConfirmation(auth({ error: { code: 'user_not_found' } }).methods, input)).key, 'confirmationSent');
  const resend = auth();
  await api.resendConfirmation(resend.methods, input);
  assert.equal(resend.calls[0].args[0].options.captchaToken, input.captchaToken);
  assert.equal((await api.submitEmailAuth(auth({ data: { session: null }, error: { code: 'user_already_exists' } }).methods, input)).key, 'confirmationSent');
});
test('password sign-in preserves current locale, rejects unsafe destinations and requires confirmation when indicated', async () => {
  const fixture = auth();
  assert.deepEqual(await api.submitEmailAuth(fixture.methods, { ...input, mode: 'login' }), { redirect: input.next });
  assert.equal(fixture.calls[0].args[0].options.captchaToken, input.captchaToken);
  assert.deepEqual(await api.submitEmailAuth(fixture.methods, { ...input, mode: 'login', next: '//evil.test' }), { redirect: '/pt' });
  assert.deepEqual(await api.submitEmailAuth(fixture.methods, { ...input, mode: 'login', locale: '//evil.test', next: null }), { redirect: '/en' });
  assert.equal((await api.submitEmailAuth(auth({ error: { code: 'email_not_confirmed' } }).methods, { ...input, mode: 'login' })).confirmation, true);
  assert.equal(api.authErrorKey({ message: 'private information', status: 429 }), 'tooManyAttempts');
  assert.equal(api.authErrorKey({ message: 'private information' }), 'authUnavailable');
});
test('Google PKCE goes only through configured Supabase origin/provider and requests account selection', async () => {
  const googleInput = { ...input, supabaseUrl: 'https://project.supabase.co' };
  const fixture = auth({ data: { url: 'https://project.supabase.co/auth/v1/authorize?provider=google' }, error: null });
  assert.ok(await api.googleAuthUrl(fixture.methods, googleInput));
  const options = fixture.calls[0].args[0].options;
  assert.equal(options.skipBrowserRedirect, true);
  assert.deepEqual(options.queryParams, { prompt: 'select_account' });
  assert.equal(new URL(options.redirectTo).searchParams.get('next'), input.next);
  for (const url of ['https://evil.test/auth/v1/authorize?provider=google', 'javascript:alert(1)',
    'https://project.supabase.co/auth/v1/authorize?provider=github', 'https://project.supabase.co/other?provider=google']) {
    assert.equal(await api.googleAuthUrl(auth({ data: { url }, error: null }).methods, googleInput), null);
  }
});

function callback({ error = null, throws = false, env = {} } = {}) {
  const calls = [], writes = [];
  const fixture = load('src/app/auth/callback/route.ts', {
    '@/lib/auth-return': returns,
    '@/lib/server-observability': { logServerFailure: () => {} },
    'next/server': { NextResponse: { redirect: url => new Response(null, { status: 307, headers: { location: String(url) } }) } },
    'next/headers': { cookies: async () => ({ getAll: () => [{ name: 'pkce', value: 'fixture' }], set: (...args) => writes.push(args) }) },
    '@supabase/ssr': { createServerClient: (_url, _key, options) => ({ auth: Object.fromEntries(['exchangeCodeForSession', 'verifyOtp']
      .map(name => [name, async value => {
        calls.push({ name, value });
        assert.equal(options.cookies.getAll()[0].name, 'pkce');
        if (throws) throw Error('private upstream message');
        if (!error) options.cookies.setAll([{ name: 'session', value: 'fixture', options: { httpOnly: true } }]);
        return { error };
      }])) }) },
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://fixture.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fake-public', ...env } } });
  return { ...fixture, calls, writes };
}
test('callback exchanges PKCE using current cookies API and prevents auth response caching', async () => {
  const fixture = callback();
  const query = new URLSearchParams({ code: 'fixture', locale: 'pt', next: '/pt/login/update-password', returnTo: input.next });
  const response = await fixture.GET(new Request(`https://www.example.test/auth/callback?${query}`));
  const url = new URL(response.headers.get('location'));
  assert.equal(url.pathname, '/pt/login/update-password');
  assert.equal(url.searchParams.get('next'), input.next);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(fixture.calls[0].name, 'exchangeCodeForSession');
  assert.deepEqual(fixture.writes[0], ['session', 'fixture', { httpOnly: true }]);
});
test('invalid/expired callbacks retain language, recovery mode and safe catalogue return without leaking errors', async () => {
  for (const options of [{ error: { message: 'private upstream detail' } }, { throws: true }, { env: { NEXT_PUBLIC_SUPABASE_ANON_KEY: '' } }]) {
    const fixture = callback(options);
    const query = new URLSearchParams({ token_hash: 'fixture', type: 'recovery', locale: 'es', returnTo: '/es/search?edition=java' });
    const response = await fixture.GET(new Request(`https://www.example.test/auth/callback?${query}`));
    const url = new URL(response.headers.get('location'));
    assert.equal(url.pathname, '/es/login');
    assert.equal(url.searchParams.get('mode'), 'reset');
    assert.equal(url.searchParams.get('next'), '/es/search?edition=java');
    assert.equal(url.searchParams.get('error'), 'invalid_token');
    assert.ok(!String(url).includes('private'));
  }
});
test('callback rejects arbitrary OTP types, unsafe returns and provider denial before exchange', async () => {
  const fixture = callback();
  for (const query of ['token_hash=fixture&type=arbitrary', 'code=fixture&error=access_denied']) {
    const response = await fixture.GET(new Request(`https://www.example.test/auth/callback?${query}&next=https://evil.test&locale=pt`));
    assert.equal(new URL(response.headers.get('location')).pathname, '/pt/login');
  }
  assert.equal(fixture.calls.length, 0);
  const response = await fixture.GET(new Request('https://www.example.test/auth/callback?code=fixture&locale=pt&next=https://evil.test'));
  assert.equal(response.headers.get('location'), 'https://www.example.test/pt');
});
