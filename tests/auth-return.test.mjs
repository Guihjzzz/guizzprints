import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getVipReturnPath, getAuthCallbackReturnPath } from '../src/lib/auth-return.ts';

test('login returns to the localized VIP page and preserves a known plan', () => {
  for (const locale of ['en', 'pt', 'es']) {
    const pathname = `/${locale}/vip`;
    assert.equal(getVipReturnPath(pathname), pathname);
    for (const plan of ['daily', 'weekly', 'monthly']) {
      const destination = `${pathname}?plan=${plan}`;
      assert.equal(getVipReturnPath(destination), destination);
    }
  }
});

test('auth callback allows known VIP returns and keeps recovery on the password form', () => {
  for (const locale of ['en', 'pt', 'es']) {
    const vip = `/${locale}/vip?plan=monthly`;
    assert.equal(getAuthCallbackReturnPath(vip, null), vip);
    assert.equal(getAuthCallbackReturnPath(`/${locale}`, 'signup'), `/${locale}`);
    const recovery = `/${locale}/login/update-password`;
    assert.equal(getAuthCallbackReturnPath(recovery, 'recovery'), recovery);
    assert.equal(getAuthCallbackReturnPath(recovery, null), recovery);
    assert.equal(getAuthCallbackReturnPath(vip, 'recovery'), '/en/login/update-password');
  }
  for (const invalid of [null, '//evil.test', '/en/../admin', '/en\n']) {
    assert.equal(getAuthCallbackReturnPath(invalid, null), '/en');
  }
});

test('login rejects external, ambiguous and unsupported destinations', () => {
  for (const value of [null, undefined, '', 'https://evil.test', '//evil.test',
    '/\\evil.test', '/en/vip/../settings', '/en/vip#anything', '/fr/vip',
    '/en/vip?plan=unknown', '/en/vip?plan=monthly&next=https://evil.test',
    '/en/vip?plan=monthly&plan=weekly', '/en/vip?plan=%6donthly',
    ' /en/vip', '/en/vip\n', '/en/vip%0a', '/en/login/update-password']) {
    assert.equal(getVipReturnPath(value), null, String(value));
  }
});
