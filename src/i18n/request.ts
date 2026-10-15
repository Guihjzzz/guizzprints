import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isAppLocale } from './routing';
import { AUTH_COPY } from './auth-copy';
import { AUTH_EXTRA } from './auth-extra';
import { MOD_COPY } from './mod-copy';
import { MOD_EXTRA } from './mod-extra';
import { REPORT_COPY } from './report-copy';

type Messages = Record<string, unknown>;

function mergeMessages(base: Messages, overrides: Messages): Messages {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    const fallback = merged[key];
    merged[key] = value && fallback && typeof value === 'object' && typeof fallback === 'object'
      ? mergeMessages(fallback as Messages, value as Messages)
      : value;
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = isAppLocale(requestedLocale) ? requestedLocale : defaultLocale;
  
  const messages = (await import(`../messages/${locale}.json`)).default as Messages;
  const english = locale === defaultLocale
    ? messages
    : (await import(`../messages/${defaultLocale}.json`)).default as Messages;

  const auth = AUTH_COPY[locale];
  const authExtra = AUTH_EXTRA[locale];
  const mod = MOD_COPY[locale];
  const modExtra = MOD_EXTRA[locale];
  const reportCopy = REPORT_COPY[locale];
  const report = reportCopy
    ? {
        ...Object.fromEntries(Object.entries(reportCopy).filter(([key]) => !key.startsWith('reasons.'))),
        reasons: Object.fromEntries(Object.entries(reportCopy).filter(([key]) => key.startsWith('reasons.')).map(([key, value]) => [key.slice('reasons.'.length), value])),
      }
    : undefined;
  const overrides = mergeMessages(messages, {
    ...(auth || authExtra ? { Auth: { ...auth, ...authExtra } } : {}),
    ...(mod || modExtra ? { Mod: { ...mod, ...modExtra } } : {}),
    ...(report ? { Report: report } : {}),
  });

  return {
    locale,
    // New locales can add reviewed translations incrementally while keeping
    // every untranslated message readable in English instead of exposing keys.
    messages: locale === defaultLocale ? overrides : mergeMessages(english, overrides),
  };
});
