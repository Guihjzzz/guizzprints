import Link from 'next/link';
import { footerCopy, toSiteLocale } from '@/lib/site-pages';

export function SiteFooter({ locale }: { locale: string }) {
  const safeLocale = toSiteLocale(locale);
  const copy = footerCopy[safeLocale];

  return (
    <footer className="border-t border-[#1D2433] bg-[#090B10] px-5 py-8 text-center text-xs text-zinc-500">
      <nav aria-label="Legal and site information" className="mb-5 flex flex-wrap justify-center gap-x-5 gap-y-3">
        <Link className="font-semibold text-zinc-300 hover:text-white" href={`/${safeLocale}/about`}>{copy.about}</Link>
        <Link className="font-semibold text-zinc-300 hover:text-white" href={`/${safeLocale}/privacy`}>{copy.privacy}</Link>
        <Link className="font-semibold text-zinc-300 hover:text-white" href={`/${safeLocale}/terms`}>{copy.terms}</Link>
        <Link className="font-semibold text-zinc-300 hover:text-white" href={`/${safeLocale}/contact`}>{copy.contact}</Link>
      </nav>
      <p className="mx-auto max-w-3xl font-semibold uppercase tracking-wide text-zinc-400">{copy.disclaimer}</p>
      <p className="mt-3">© {new Date().getFullYear()} Guizzprints · www.guizz.xyz. {copy.rights}</p>
    </footer>
  );
}
