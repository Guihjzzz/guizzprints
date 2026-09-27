# Mercado Pago — Checkout Transparente via Orders

Mercado Pago is the only payment provider configured by the application. The
adapter uses Checkout Transparente via Orders and accepts PIX only.

## Preview/Sandbox configuration

Set these as Vercel **Preview** (and Development, if needed) variables:

- `MERCADOPAGO_ACCESS_TOKEN` — server-only Access Token for the selected Mercado
  Pago application; never add `NEXT_PUBLIC_` or commit it.
- `MERCADOPAGO_TEST_CHECKOUT_ENABLED=true`
- `MERCADOPAGO_TEST_USER_IDS` — comma-separated Supabase UUIDs allowed to open
  a test order. The existing allowlist can be reused.
- `MERCADOPAGO_TEST_PAYER_EMAIL` — the Mercado Pago test buyer email ending in
  `@testuser.com`.
- `MERCADOPAGO_TEST_SITE_URL` is optional when Vercel supplies `VERCEL_URL`.

The server creates `POST https://api.mercadopago.com/v1/orders` with
`processing_mode=automatic`, a single Pix bank-transfer payment, an exact
server-priced amount, and an idempotency key equal to the external order
reference. It returns only the validated Mercado Pago Pix ticket URL. Sandbox
events are recorded but can never grant VIP.

## Webhook

Configure the Mercado Pago application’s **Webhooks → Order** event to call:

`https://<official-domain>/api/vip/webhook/mercadopago`

Store the generated signing secret as `MERCADOPAGO_WEBHOOK_SECRET` in the same
Vercel environment as the Access Token. The endpoint validates `x-signature`
(`id`, `x-request-id`, and timestamp manifest), fetches the Order server-side,
checks its external reference, bound provider ID, amount, and PIX payment
method against `vip_orders`, then applies the checked idempotent entitlement
transaction. A production notification cannot grant access to a test order,
and a late completion cannot reactivate a refunded/cancelled order.

## Reconciliation after a provider timeout

An administrator can safely reconcile up to 20 live orders that were persisted
as `checkout_created` but may have missed their webhook. Sandbox rows are
skipped, and a 45-second safety deadline prevents a slow provider from
running the serverless function indefinitely:

`POST https://<official-domain>/api/admin/vip/reconcile`

The request must include the administrator's Supabase Bearer session. An
optional `?limit=1..20` controls the batch size. The endpoint fetches each
provider Order, rechecks its ID, external reference, amount, status, settled
amount (for paid orders), and exactly one PIX bank-transfer payment whose
amount matches the Order total. The provider checkout ID must remain bound to
the saved order. It then calls only the checked `apply_vip_payment_checked`
transaction and counts a row as reconciled only when the RPC reports
`applied=true`. It returns aggregate counts and never exposes provider
credentials or order identifiers. Orders still at `pending` have no provider
ID to query and remain recoverable by retrying checkout with the same
idempotency key.

## Production handoff

The commercial handoff is complete: `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true`
is scoped to Vercel Production, with a Production-scoped access token,
`MERCADOPAGO_SITE_URL=https://www.guizz.xyz`, and the official signed webhook.
A supervised weekly PIX payment of R$6.70 was settled and created the VIP
entitlement server-side through the webhook path. Do not create another real
charge just to repeat the same test; use reconciliation and automated fixtures
for maintenance cases.

Sandbox remains isolated to Preview and still needs a provider-signed event (or
an equivalent controlled fixture) if a full external MP-01–MP-27 record is
required. A Sandbox ticket or browser return is never evidence of settlement.
