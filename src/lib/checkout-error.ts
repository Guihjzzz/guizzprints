export type CheckoutErrorCode =
  | 'disabled'
  | 'invalid_origin'
  | 'invalid_request'
  | 'login_required'
  | 'tester_only'
  | 'not_configured'
  | 'provider_auth'
  | 'provider_permission'
  | 'provider_request'
  | 'provider_invalid'
  | 'provider_unavailable';

/** Safe, user-facing checkout failure without leaking provider details. */
export class CheckoutError extends Error {
  readonly code: CheckoutErrorCode;
  readonly status: number;

  constructor(code: CheckoutErrorCode, status = code === 'invalid_origin' || code === 'tester_only' ? 403 : code === 'invalid_request' ? 400 : code === 'provider_invalid' || code === 'provider_auth' || code === 'provider_permission' || code === 'provider_request' || code === 'provider_unavailable' ? 502 : 503) {
    super(code);
    this.name = 'CheckoutError';
    this.code = code;
    this.status = status;
  }
}
