const ALLOWED_DOWNLOAD_HOSTS = ['terabox.com', 'terabox.app', '1024terabox.com'] as const;

export function parseAllowedDownloadUrl(value: string) {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase();
  const isAllowedHost = ALLOWED_DOWNLOAD_HOSTS.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );

  if (url.protocol !== 'https:' || !isAllowedHost || url.username || url.password || url.port) {
    throw new Error('Only secure Terabox links are allowed.');
  }

  return url;
}
