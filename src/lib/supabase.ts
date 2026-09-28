import { createBrowserClient } from '@supabase/ssr';

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!configuredUrl || !configuredAnonKey)) {
  throw new Error('Faltam as variáveis de ambiente do Supabase');
}

// The bundled Warden demo is fully local. Keep it available during development
// even before a Supabase project has been connected; database-backed screens
// will simply receive the normal network error from this unreachable endpoint.
const supabaseUrl = configuredUrl || 'http://127.0.0.1:54321';
const supabaseAnonKey = configuredAnonKey || 'local-demo-anon-key';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
