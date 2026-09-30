import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getAuthCallbackFailurePath, getAuthCallbackReturnPath, getSafeReturnPath } from '../src/lib/auth-return.ts';

test('login preserves only recognized local catalogue destinations', () => {
  const destinations = [
    '/pt',
    '/en/search?edition=java&sort=downloads',
    '/es/favorites',
    '/pt/category/bedrock',
    '/en/category/java',
    '/pt/mod/3334cd28-7029-4ea8-a09a-64dd33a6e641?source=login',
  ];
  for (const destination of destinations) {
    assert.equal(getSafeReturnPath(destination), destination);
  }
});

test('auth callback keeps valid catalogue returns and recovery on the password form', () => {
  for (const locale of ['en', 'pt', 'es']) {
    const search = `/${locale}/search?edition=java`;
    assert.equal(getAuthCallbackReturnPath(search, null), search);
    assert.equal(getAuthCallbackReturnPath(`/${locale}`, 'signup'), `/${locale}`);
    const recovery = `/${locale}/login/update-password`;
    assert.equal(getAuthCallbackReturnPath(recovery, 'recovery'), recovery);
    assert.equal(getAuthCallbackReturnPath(recovery, null), recovery);
    assert.equal(getAuthCallbackReturnPath(search, 'recovery'), '/en/login/update-password');
  }
  for (const invalid of [null, '//evil.test', '/en/../admin', '/en\n']) {
    assert.equal(getAuthCallbackReturnPath(invalid, null), '/en');
  }
});

test('login rejects external, ambiguous and unsupported destinations', () => {
  for (const value of [null, undefined, '', 'https://evil.test', '//evil.test',
    '/\\evil.test', '/en/search/../admin', '/en/search#anything', '/fr/search',
    '/en/admin/publisher', '/en/mod/not-an-id', ' /en/search', '/en/search\n',
    '/en/search%0a', '/en/login/update-password']) {
    assert.equal(getSafeReturnPath(value), null, String(value));
  }
});

test('failed callbacks retain only safe catalogue destinations', () => {
  const safe = new URL(getAuthCallbackFailurePath('/pt/search?edition=bedrock', 'pt'), 'https://example.test');
  assert.equal(safe.pathname, '/pt/login');
  assert.equal(safe.searchParams.get('next'), '/pt/search?edition=bedrock');
  const unsafe = new URL(getAuthCallbackFailurePath('https://evil.test', 'pt', true), 'https://example.test');
  assert.equal(unsafe.searchParams.get('next'), null);
  assert.equal(unsafe.searchParams.get('mode'), 'reset');
});
