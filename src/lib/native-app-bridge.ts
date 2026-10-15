export type NativeGoogleSignInResult = { idToken: string };

type NativeAppBridge = {
  version?: () => Promise<string>;
  listSavedMods?: () => Promise<unknown>;
  isSaved?: (key: string) => Promise<boolean>;
  openSavedMod?: (key: string) => Promise<boolean>;
  signInWithGoogle?: (hashedNonce: string) => Promise<NativeGoogleSignInResult>;
};

declare global {
  interface Window {
    GuizzPrintsApp?: NativeAppBridge;
    GuizzPrintsNative?: unknown;
    GuizzPrints?: NativeAppBridge;
    GuizzMods?: NativeAppBridge;
  }
}

export function getNativeGoogleSignIn() {
  if (typeof window === 'undefined') return undefined;
  return window.GuizzPrintsApp?.signInWithGoogle
    ?? window.GuizzPrints?.signInWithGoogle
    ?? window.GuizzMods?.signInWithGoogle;
}

export function isNativeApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.GuizzPrintsApp || window.GuizzPrintsNative || window.GuizzMods
    || navigator.userAgent.includes('GuizzPrintsAndroid'));
}
