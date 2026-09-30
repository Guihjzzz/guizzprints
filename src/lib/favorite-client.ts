'use client';

import { getClientAuthToken, getClientAuthUser } from '@/lib/client-auth';

type FavoriteAccess = { userId: string; token: string };
type FavoriteChange = { authenticated: boolean; ok: boolean; favorited: boolean };
type FavoriteListState = { userId: string; token: string; ids: Set<string> };

let favoriteListCache: FavoriteListState | null = null;
let favoriteListRequest: { key: string; promise: Promise<{ userId: string; ids: Set<string> } | null> } | null = null;

async function access(): Promise<FavoriteAccess | null> {
  const [user, token] = await Promise.all([getClientAuthUser(), getClientAuthToken()]);
  return user && token ? { userId: user.id, token } : null;
}

export async function loadClientFavoriteIds(): Promise<{ userId: string; ids: Set<string> } | null> {
  const credentials = await access();
  if (!credentials) {
    favoriteListCache = null;
    favoriteListRequest = null;
    return null;
  }

  if (favoriteListCache?.userId === credentials.userId && favoriteListCache.token === credentials.token) {
    return { userId: favoriteListCache.userId, ids: favoriteListCache.ids };
  }

  const key = `${credentials.userId}:${credentials.token}`;
  if (favoriteListRequest?.key === key) return favoriteListRequest.promise;

  const promise = (async () => {
    try {
      const response = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${credentials.token}` },
        cache: 'no-store',
      });
      if (!response.ok) return null;
      const body = await response.json() as { ids?: unknown };
      const ids = Array.isArray(body.ids) ? new Set(body.ids.filter((id): id is string => typeof id === 'string')) : new Set<string>();
      favoriteListCache = { userId: credentials.userId, token: credentials.token, ids };
      return { userId: credentials.userId, ids };
    } catch {
      return null;
    }
  })().finally(() => {
    if (favoriteListRequest?.promise === promise) favoriteListRequest = null;
  });
  favoriteListRequest = { key, promise };
  return promise;
}

export async function changeClientFavorite(modId: string, favorite: boolean): Promise<FavoriteChange> {
  const credentials = await access();
  if (!credentials) return { authenticated: false, ok: false, favorited: favorite };
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { Authorization: `Bearer ${credentials.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ modId, favorite }),
      cache: 'no-store',
    });
    if (!response.ok) return { authenticated: response.status !== 401, ok: false, favorited: favorite };
    const body = await response.json() as { favorited?: unknown };
    const ok = body.favorited === favorite;
    if (ok && favoriteListCache?.userId === credentials.userId && favoriteListCache.token === credentials.token) {
      if (favorite) favoriteListCache.ids.add(modId);
      else favoriteListCache.ids.delete(modId);
    }
    return { authenticated: true, ok, favorited: favorite };
  } catch {
    return { authenticated: true, ok: false, favorited: favorite };
  }
}
