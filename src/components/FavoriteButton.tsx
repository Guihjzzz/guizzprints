'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type MouseEvent } from 'react';
import { changeClientFavorite, loadClientFavoriteIds } from '@/lib/favorite-client';
import { listenToClientAuth } from '@/lib/client-auth';

type FavoriteCache = {
  userId: string;
  ids: Set<string>;
  pending: PromiseLike<Set<string>> | null;
};

let favoriteCache: FavoriteCache | null = null;
let authListenerReady = false;

function ensureFavoriteAuthListener() {
  if (authListenerReady || typeof window === 'undefined') return;
  authListenerReady = true;
  listenToClientAuth(() => {
    favoriteCache = null;
    window.dispatchEvent(new Event('guizz-favorites-auth'));
  });
}

async function loadFavoriteIds() {
  const state = await loadClientFavoriteIds();
  if (!state) {
    favoriteCache = null;
    return null;
  }

  if (favoriteCache?.userId === state.userId && favoriteCache.ids && !favoriteCache.pending) return favoriteCache.ids;

  const pending = favoriteCache?.userId === state.userId && favoriteCache.pending
    ? favoriteCache.pending
    : Promise.resolve(state.ids).then((ids) => {
      favoriteCache = { userId: state.userId, ids, pending: null };
      return ids;
    });

  favoriteCache = { userId: state.userId, ids: favoriteCache?.userId === state.userId ? favoriteCache.ids : new Set(), pending };
  return pending;
}

export function FavoriteButton({ modId, className = '', wide = false, disabled = false, title }: { modId: string; className?: string; wide?: boolean; disabled?: boolean; title?: string }) {
  const t = useTranslations('Mod');
  const [isFavorited, setIsFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    ensureFavoriteAuthListener();

    const sync = () => {
      void loadFavoriteIds().then(ids => {
        if (active) setIsFavorited(Boolean(ids?.has(modId)));
      });
    };

    void loadFavoriteIds().then(ids => {
      if (active && ids) setIsFavorited(ids.has(modId));
    });
    window.addEventListener('guizz-favorites-auth', sync);

    return () => {
      active = false;
      window.removeEventListener('guizz-favorites-auth', sync);
    };
  }, [modId]);

  const toggleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;

    setBusy(true);
    const nextValue = !isFavorited;
    const result = await changeClientFavorite(modId, nextValue);
    if (!result.authenticated) {
      alert(t('loginToFavorite'));
      setBusy(false);
      return;
    }

    if (!result.ok) {
      alert(nextValue
        ? t('favoriteAddError')
        : t('favoriteRemoveError'));
    } else {
      setIsFavorited(nextValue);
      const state = await loadClientFavoriteIds();
      if (state && favoriteCache?.userId === state.userId) {
        if (nextValue) favoriteCache.ids.add(modId);
        else favoriteCache.ids.delete(modId);
      }
      window.dispatchEvent(new Event('guizz-favorites-auth'));
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={busy || disabled}
      aria-label={t('favorite')}
      aria-pressed={isFavorited}
      title={title || t('favorite')}
      className={wide
        ? `group flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2A3448] bg-[#090d15] px-3 py-2.5 text-xs font-black text-zinc-200 transition hover:border-red-400/50 hover:bg-red-500/10 disabled:cursor-default disabled:opacity-45 ${isFavorited ? 'text-red-400' : ''} ${className}`
        : `z-20 inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/75 text-zinc-300 shadow-lg backdrop-blur-sm transition hover:border-red-400/70 hover:bg-black hover:text-red-400 disabled:cursor-wait disabled:opacity-60 ${isFavorited ? 'text-red-400' : ''} ${className}`}
    >
      <Heart size={wide ? 16 : 15} className={`${isFavorited ? 'fill-current text-red-500' : wide ? 'group-hover:text-red-400' : ''}`} aria-hidden="true" />
      {wide && t('favorite')}
    </button>
  );
}
