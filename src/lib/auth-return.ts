const VIP_RETURN_PATH = /^\/(en|pt|es)\/vip(?:\?plan=(daily|weekly|monthly))?$/;

/** Only known VIP destinations may override the normal post-login destination. */
export function getVipReturnPath(value: string | null | undefined): string | null {
  if (!value || VIP_RETURN_PATH.exec(value)?.[0] !== value) return null;
  return value;
}

/** Keep recovery links on the password form and all auth redirects on known routes. */
export function getAuthCallbackReturnPath(value: string | null, type: string | null, locale = 'en'): string {
  const safeLocale = ['en', 'pt', 'es'].includes(locale) ? locale : 'en';
  const recoveryPath = /^\/(en|pt|es)\/login\/update-password$/;
  if (type === 'recovery') {
    return value && recoveryPath.exec(value)?.[0] === value
      ? value
      : `/${safeLocale}/login/update-password`;
  }
  const vipPath = getVipReturnPath(value);
  if (vipPath) return vipPath;
  // PKCE recovery callbacks may carry a code without a type parameter.
  if (value && recoveryPath.exec(value)?.[0] === value) return value;
  if (value && /^\/(en|pt|es)$/.exec(value)?.[0] === value) return value;
  return `/${safeLocale}`;
}

export function getAuthCallbackFailurePath(next: string | null, locale: string, recovery = false): string {
  const safeLocale = ['en', 'pt', 'es'].includes(locale) ? locale : 'en';
  const query = new URLSearchParams({ error: 'invalid_token' });
  if (recovery) query.set('mode', 'reset');
  const vip = getVipReturnPath(next);
  if (vip) query.set('next', vip);
  return `/${safeLocale}/login?${query}`;
}
