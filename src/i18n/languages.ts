import type { AppLocale } from './routing';

export const LANGUAGE_OPTIONS: Array<{ locale: AppLocale; label: string; compact: string }> = [
  { locale: 'en', label: 'English', compact: 'EN' },
  { locale: 'es', label: 'Español', compact: 'ES' },
  { locale: 'pt', label: 'Português (Brasil)', compact: 'PT' },
  { locale: 'fr', label: 'Français', compact: 'FR' },
  { locale: 'de', label: 'Deutsch', compact: 'DE' },
  { locale: 'it', label: 'Italiano', compact: 'IT' },
  { locale: 'pl', label: 'Polski', compact: 'PL' },
  { locale: 'id', label: 'Bahasa Indonesia', compact: 'ID' },
  { locale: 'hi', label: 'हिन्दी', compact: 'हि' },
  { locale: 'ja', label: '日本語', compact: '日本' },
  { locale: 'ko', label: '한국어', compact: '한국' },
  { locale: 'vi', label: 'Tiếng Việt', compact: 'VI' },
  { locale: 'th', label: 'ไทย', compact: 'TH' },
];
