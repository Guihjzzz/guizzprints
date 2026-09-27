export function parseAllowedDownloadUrl(value: string) {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase();
  const isLocal = hostname === 'localhost' || hostname === '::1' || hostname === '0.0.0.0'
    || hostname.endsWith('.local') || /^(127\.|10\.|192\.168\.|169\.254\.)/.test(hostname)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);

  if (url.protocol !== 'https:' || isLocal || url.username || url.password || url.port) {
    throw new Error('Use a public HTTPS download link.');
  }

  return url;
}
