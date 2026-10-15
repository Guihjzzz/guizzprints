'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';

const COPY = {
  pt: { title: 'Não foi possível abrir esta página', body: 'Tente novamente. Se o problema continuar, volte ao catálogo.', retry: 'Tentar novamente', home: 'Ir ao catálogo' },
  en: { title: 'This page could not be opened', body: 'Try again. If the problem continues, return to the catalog.', retry: 'Try again', home: 'Open catalog' },
  es: { title: 'No fue posible abrir esta página', body: 'Inténtalo de nuevo. Si el problema continúa, vuelve al catálogo.', retry: 'Intentar de nuevo', home: 'Ir al catálogo' },
  fr: { title: 'Impossible d’ouvrir cette page', body: 'Réessayez. Si le problème persiste, retournez au catalogue.', retry: 'Réessayer', home: 'Ouvrir le catalogue' },
  de: { title: 'Diese Seite konnte nicht geöffnet werden', body: 'Versuche es erneut. Wenn das Problem weiterhin besteht, kehre zum Katalog zurück.', retry: 'Erneut versuchen', home: 'Katalog öffnen' },
  it: { title: 'Impossibile aprire questa pagina', body: 'Riprova. Se il problema persiste, torna al catalogo.', retry: 'Riprova', home: 'Apri il catalogo' },
  pl: { title: 'Nie udało się otworzyć tej strony', body: 'Spróbuj ponownie. Jeśli problem nie ustąpi, wróć do katalogu.', retry: 'Spróbuj ponownie', home: 'Otwórz katalog' },
  id: { title: 'Halaman ini tidak dapat dibuka', body: 'Coba lagi. Jika masalah berlanjut, kembali ke katalog.', retry: 'Coba lagi', home: 'Buka katalog' },
  hi: { title: 'यह पेज नहीं खुल सका', body: 'फिर कोशिश करें। समस्या बनी रहे तो कैटलॉग पर वापस जाएँ।', retry: 'फिर कोशिश करें', home: 'कैटलॉग खोलें' },
  ja: { title: 'このページを開けませんでした', body: 'もう一度お試しください。問題が続く場合はカタログに戻ってください。', retry: '再試行', home: 'カタログを開く' },
  ko: { title: '페이지를 열 수 없습니다', body: '다시 시도하세요. 문제가 계속되면 카탈로그로 돌아가세요.', retry: '다시 시도', home: '카탈로그 열기' },
  vi: { title: 'Không thể mở trang này', body: 'Hãy thử lại. Nếu sự cố vẫn tiếp diễn, hãy quay lại danh mục.', retry: 'Thử lại', home: 'Mở danh mục' },
  th: { title: 'เปิดหน้านี้ไม่ได้', body: 'ลองอีกครั้ง หากปัญหายังคงอยู่ ให้กลับไปที่แคตตาล็อก', retry: 'ลองอีกครั้ง', home: 'เปิดแคตตาล็อก' },
};

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale || 'en';
  const copy = COPY[locale as keyof typeof COPY] || COPY.en;

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center p-6 text-center">
      <section className="w-full rounded-3xl border border-red-500/25 bg-[#111318] p-7 shadow-2xl sm:p-10">
        <span className="mx-auto inline-flex rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-red-300"><AlertTriangle size={30} aria-hidden="true" /></span>
        <h1 className="mt-5 text-2xl font-black text-white">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">{copy.body}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <RefreshCw size={17} aria-hidden="true" /> {copy.retry}
          </button>
          <Link href={`/${locale}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#334155] px-5 py-3 text-sm font-black text-zinc-200 transition hover:border-blue-400/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            {copy.home}
          </Link>
        </div>
      </section>
    </div>
  );
}
