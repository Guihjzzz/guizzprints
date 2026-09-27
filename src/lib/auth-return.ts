/** Paid destinations were removed. Authentication now returns only to known catalog pages. */
export function getSafeReturnPath(value: string | null | undefined): null {
  void value;
  return null;
}

export function getAuthCallbackReturnPath(value: string | null, type: string | null, locale = 'en'): string {
  const safeLocale = ['en', 'pt', 'es'].includes(locale) ? locale : 'en';
  const recoveryPath = /^\/(en|pt|es)\/login\/update-password$/;
  if (type === 'recovery') {
    return value && recoveryPath.exec(value)?.[0] === value ? value : `/${safeLocale}/login/update-password`;
  }
  if (value && recoveryPath.exec(value)?.[0] === value) return value;
  if (value && /^\/(en|pt|es)$/.exec(value)?.[0] === value) return value;
  return `/${safeLocale}`;
}

export function getAuthCallbackFailurePath(_next: string | null, locale: string, recovery = false): string {
  const safeLocale = ['en', 'pt', 'es'].includes(locale) ? locale : 'en';
  const query = new URLSearchParams({ error: 'invalid_token' });
  if (recovery) query.set('mode', 'reset');
  return `/${safeLocale}/login?${query}`;
}
