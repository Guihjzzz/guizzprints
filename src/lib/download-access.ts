import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const DOWNLOAD_ACCESS_COOKIE = 'guizz_download_access';
export const DOWNLOAD_WAIT_MS = 20_000;
export const DOWNLOAD_ACCESS_TTL_SECONDS = 10 * 60;

// One mod must not replace another mod's pending verification in a second tab.
export function downloadAccessCookie(modId: string) {
  return `${DOWNLOAD_ACCESS_COOKIE}_${createHash('sha256').update(modId).digest('hex').slice(0, 24)}`;
}

type DownloadAccessPayload = {
  modId: string;
  readyAt: number;
  expiresAt: number;
  nonce: string;
  vip?: boolean;
};

function getSigningSecret() {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('DOWNLOAD_TOKEN_SECRET must contain at least 32 characters.');
  }

  return secret;
}

function sign(value: string) {
  return createHmac('sha256', getSigningSecret()).update(value).digest('base64url');
}

export function createDownloadAccessToken(payload: DownloadAccessPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readDownloadAccessToken(token: string | undefined): DownloadAccessPayload | null {
  if (!token) return null;

  const [encodedPayload, signature, ...rest] = token.split('.');
  if (!encodedPayload || !signature || rest.length > 0) return null;

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof (payload as DownloadAccessPayload).modId !== 'string' ||
      typeof (payload as DownloadAccessPayload).readyAt !== 'number' ||
      typeof (payload as DownloadAccessPayload).expiresAt !== 'number' ||
      typeof (payload as DownloadAccessPayload).nonce !== 'string' ||
      ('vip' in payload && typeof (payload as DownloadAccessPayload).vip !== 'boolean')
    ) {
      return null;
    }

    const access = payload as DownloadAccessPayload;
    if (!access.modId || access.modId.length > 200
      || !Number.isSafeInteger(access.readyAt) || !Number.isSafeInteger(access.expiresAt)
      || access.readyAt < 0 || access.expiresAt <= access.readyAt
      || !access.nonce || access.nonce.length > 128) return null;

    return access;
  } catch {
    return null;
  }
}
