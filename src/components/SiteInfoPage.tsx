import Link from 'next/link';
import type { SitePageContent } from '@/lib/site-pages';

export function SiteInfoPage({ locale, content }: { locale: string; content: SitePageContent }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 border-b border-[#1D2433] pb-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-blue-400">Guizzprints</p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{content.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">{content.intro}</p>
        {content.updated && <p className="mt-4 text-xs font-medium text-zinc-500">{content.updated}</p>}
      </header>

      <div className="space-y-5">
        {content.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-[#1D2433] bg-[#111318] p-5 shadow-lg sm:p-7">
            <h2 className="text-lg font-black text-white sm:text-xl">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.links && (
              <div className="mt-5 flex flex-wrap gap-3">
                {section.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/${locale}`} className="text-sm font-bold text-blue-400 hover:text-blue-300">← Guizzprints</Link>
      </div>
    </div>
  );
}
