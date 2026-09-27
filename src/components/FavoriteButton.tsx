'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type MouseEvent } from 'react';
import { supabase } from '@/lib/supabase';

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
  supabase.auth.onAuthStateChange(() => {
    favoriteCache = null;
    window.dispatchEvent(new Event('guizz-favorites-auth'));
  });
}

async function loadFavoriteIds() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    favoriteCache = null;
    return null;
  }

  if (favoriteCache?.userId === session.user.id && favoriteCache.ids && !favoriteCache.pending) return favoriteCache.ids;

  const pending = favoriteCache?.userId === session.user.id && favoriteCache.pending
    ? favoriteCache.pending
    : supabase.from('favorites').select('mod_id').eq('user_id', session.user.id).then(({ data }) => {
      const ids = new Set((data || []).map(row => row.mod_id as string));
      favoriteCache = { userId: session.user.id, ids, pending: null };
      return ids;
    });

  favoriteCache = { userId: session.user.id, ids: favoriteCache?.userId === session.user.id ? favoriteCache.ids : new Set(), pending };
  return pending;
}

export function FavoriteButton({ modId, className = '' }: { modId: string; className?: string }) {
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

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert(t('loginToFavorite'));
      return;
    }

    setBusy(true);
    const nextValue = !isFavorited;
    const result = nextValue
      ? await supabase.from('favorites').insert([{ mod_id: modId, user_id: session.user.id }])
      : await supabase.from('favorites').delete().eq('mod_id', modId).eq('user_id', session.user.id);

    if (result.error) {
      alert(nextValue
        ? t('favoriteAddError')
        : t('favoriteRemoveError'));
    } else {
      setIsFavorited(nextValue);
      if (favoriteCache?.userId === session.user.id) {
        if (nextValue) favoriteCache.ids.add(modId);
        else favoriteCache.ids.delete(modId);
      }
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={busy}
      aria-label={t('favorite')}
      aria-pressed={isFavorited}
      title={t('favorite')}
      className={`z-20 inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/75 text-zinc-300 shadow-lg backdrop-blur-sm transition hover:border-red-400/70 hover:bg-black hover:text-red-400 disabled:cursor-wait disabled:opacity-60 ${isFavorited ? 'text-red-400' : ''} ${className}`}
    >
      <Heart size={15} className={isFavorited ? 'fill-current' : ''} aria-hidden="true" />
    </button>
  );
}
