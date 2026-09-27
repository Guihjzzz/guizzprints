# Auth rollout — status 2026-09-17

## Verified provider configuration

- Custom Resend SMTP enabled; `guizz.xyz` sending domain verified.
- Email limit 30/hour for the whole project, per-user minimum interval 60s.
- Sign-in/sign-up limit 5 requests/5min/IP. Keep these provider limits alongside CAPTCHA.
- Confirm email is ON for new password signups; Google is enabled independently; Turnstile CAPTCHA is enabled in Supabase Attack Protection.
- Site URL is `https://www.guizz.xyz`; the allowlist contains official callback paths and the stable test alias, without unrestricted random Preview hosts.
- Recovery email was OTP-only. Updated in the dashboard to add a blue reset link and retain OTP for old clients; reviewed in Preview before saving. Copy: `docs/auth-recovery-email.html`.

## Local changes

- Email login/register/reset use safe localized errors, selected locale and allowlisted VIP return paths.
- Recovery now requests a reset **link**, not an OTP-only form.
- Confirmation resend and same-email 60s client cooldown; this is UX, not a security boundary.
- Password update is disabled until `getUser` validation and revalidates on submission.
- Google PKCE remains visible on login and registration; Supabase validates the provider at authorization time and the app shows a generic message if it is unavailable.
- Optional Turnstile widget forwards one-use tokens for login/signup/reset/resend and clears after attempts.
- Turnstile widget `Guizz Mods Login` created in Cloudflare, managed mode, restricted to `guizz.xyz`, pre-clearance OFF.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is the public site key. Its secret belongs only in Supabase and is intentionally not recorded here.
- Auth callback uses `getAll`/`setAll` cookies, no-store responses, safe destinations and locale-aware failures.

## Rollout checklist

1. DONE — Prepare Google Auth branding + web client in the dedicated `guizz-mods-login` project.
   Only basic profile/email/OpenID; no Gmail/Drive access or Google refresh-token storage.
   Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback` (the project host is configured in the dashboard and intentionally omitted here).
   Create credentials only with action-time confirmation. User enters the new client secret into Supabase.
2. DONE — Create Turnstile managed widget restricted to the official domains.
   Do not permit every Vercel tenant. Public site key in Vercel; user enters secret into Supabase.
3. DONE — Add exact app callback URLs for the official domain and stable test alias.
   Never add unrestricted `https://*.vercel.app/**`. Inspect actual redirect matching before changing access.
4. DONE — Reset link added to the email template while preserving OTP compatibility.
5. DONE — Deploy repaired login UI with the public site key and generic errors.
6. DONE — Verify the confirmation template/callback, then enable Google and Confirm email.
7. DONE — Enable provider CAPTCHA after the deployed email-auth client accepted one-use tokens.
   Otherwise existing login/signup/reset will be locked out.
8. DONE — Controlled test account verified sign-in, signup confirmation, recovery link delivery/opening, user-entered password reset and return to authenticated VIP; no bulk mail or payment was used.

## Limits and follow-up

Increasing the project-wide email quota cannot make only verified users consume it: first-time confirmation
must necessarily reach unverified addresses. Google login avoids confirmation mail. CAPTCHA and the provider's
rate limits are the first defense; a client cooldown alone can be bypassed.
Further distributed per-IP/email gating or a supported provider hook requires separate implementation/testing.
Accounts auto-confirmed before Confirm email is enabled do not become retroactively verified.
Do not treat `email_confirmed_at` on old auto-confirmed accounts as proof of mailbox ownership.
Payment and VIP systems are separate from this auth policy; keep the Mercado Pago live checkout gate disabled unless a supervised payment test is explicitly authorized.

## Original recovery template (for restoration)

```html
<h2>Recuperação de Acesso</h2>
<p>Utilize o código de segurança abaixo para redefinir sua senha:</p>
<h1 style="letter-spacing: 4px;">{{ .Token }}</h1>
<p>Se não foi você, ignore este e-mail.</p>
```
