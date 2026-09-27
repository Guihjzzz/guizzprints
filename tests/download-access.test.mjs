import assert from 'node:assert/strict';
import { test } from 'node:test';
import { downloadAccessCookie, createDownloadAccessToken, readDownloadAccessToken } from '../src/lib/download-access.ts';

test('parallel mods have independent signed cookies',()=>{
  process.env.DOWNLOAD_TOKEN_SECRET='isolated-test-secret-not-for-production-0123456789';
  const jar = new Map();
  for(const modId of ['mod-a','mod-b']) jar.set(downloadAccessCookie(modId),createDownloadAccessToken({modId,readyAt:20,expiresAt:600,nonce:modId}));
  assert.notEqual(downloadAccessCookie('mod-a'),downloadAccessCookie('mod-b'));
  for(const modId of ['mod-a','mod-b']) assert.equal(readDownloadAccessToken(jar.get(downloadAccessCookie(modId))).modId,modId);
  jar.delete(downloadAccessCookie('mod-a'));
  assert.equal(readDownloadAccessToken(jar.get(downloadAccessCookie('mod-b'))).modId,'mod-b');
  assert.equal(readDownloadAccessToken(jar.get(downloadAccessCookie('mod-b'))+'tampered'),null);
});

test('signed download sessions reject unsafe payload shapes', () => {
  process.env.DOWNLOAD_TOKEN_SECRET = 'isolated-test-secret-not-for-production-0123456789';
  const base = { modId: 'mod-a', readyAt: 20, expiresAt: 600, nonce: 'nonce-a' };
  assert.equal(readDownloadAccessToken(createDownloadAccessToken({ ...base, expiresAt: 10 })), null);
  assert.equal(readDownloadAccessToken(createDownloadAccessToken({ ...base, readyAt: Number.MAX_SAFE_INTEGER + 1 })), null);
  assert.equal(readDownloadAccessToken(createDownloadAccessToken({ ...base, modId: '' })), null);
  assert.equal(readDownloadAccessToken(createDownloadAccessToken({ ...base, nonce: 'x'.repeat(129) })), null);
});
