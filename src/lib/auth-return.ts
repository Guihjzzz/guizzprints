const LOCALES = ['en', 'pt', 'es'];
const CATALOG_PATH = /^\/(en|pt|es)(?:\/(?:search|favorites|settings|about|privacy|terms|contact|category\/(?:bedrock|java)|mod\/[0-9a-f-]{8,64}))?$/i;

/**
 * Accept only local catalog destinations after authentication. This restores
 * the visitor to the page they were viewing without allowing an OAuth or
 * e-mail link to become an external redirect.
 */
export function getSafeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.length > 2048 || /\s|[\u0000-\u001f\u007f]/u.test(value) || value.includes('#')) return null;
  try {
    const url = new URL(value, 'https://guizzprints.invalid');
    if (url.origin !== 'https://guizzprints.invalid' || !CATALOG_PATH.test(url.pathname)) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export function getAuthCallbackReturnPath(value: string | null, type: string | null, locale = 'en'): string {
  const safeLocale = LOCALES.includes(locale) ? locale : 'en';
  const recoveryPath = /^\/(en|pt|es)\/login\/update-password$/;
  if (type === 'recovery') {
    return value && recoveryPath.exec(value)?.[0] === value ? value : `/${safeLocale}/login/update-password`;
  }
  if (value && recoveryPath.exec(value)?.[0] === value) return value;
  return getSafeReturnPath(value) ?? `/${safeLocale}`;
}

export function getAuthCallbackFailurePath(next: string | null, locale: string, recovery = false): string {
  const safeLocale = LOCALES.includes(locale) ? locale : 'en';
  const query = new URLSearchParams({ error: 'invalid_token' });
  if (recovery) query.set('mode', 'reset');
  const safeReturn = getSafeReturnPath(next);
  if (safeReturn) query.set('next', safeReturn);
  return `/${safeLocale}/login?${query}`;
}
