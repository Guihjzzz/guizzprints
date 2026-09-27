import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseAllowedDownloadUrl } from '../src/lib/download-url.ts';
import { validateModVersion, normalizeModVersion } from '../src/lib/mod-version.ts';

test('Terabox aliases work without allowing lookalikes, credentials or insecure links', () => {
  for (const host of ['terabox.com', 'www.terabox.com', 'terabox.app', '1024terabox.com', 'www.1024terabox.com']) {
    assert.equal(parseAllowedDownloadUrl(`https://${host}/s/example?pwd=1234`).hostname, host);
  }
  for (const url of [
    'http://1024terabox.com/s/example', 'https://1024terabox.com.evil.test/s/example',
    'https://evil1024terabox.com/s/example', 'https://1024terabox.com@evil.test/s/example',
    'https://name:password@1024terabox.com/s/example', 'https://1024terabox.com:8080/s/example',
    'javascript:alert(1)', 'not a url',
  ]) assert.throws(() => parseAllowedDownloadUrl(url), url);
});

test('Version prefix is normalized once and release identifiers support prereleases', () => {
  assert.equal(validateModVersion('# v1.0.8'), '1.0.8');
  assert.equal(validateModVersion('v1.0.8'), '1.0.8');
  assert.equal(validateModVersion('1.0.8-beta.2+build3'), '1.0.8-beta.2+build3');
  assert.equal(validateModVersion('beta'), 'beta');
  assert.equal(normalizeModVersion('# vBeta'), 'Beta');
  for (const version of ['', '# v', '<script>', '1 2', 'a'.repeat(51)]) {
    assert.throws(() => validateModVersion(version), version);
  }
});
