import type { Metadata } from 'next';
import { VipExperience } from '@/components/VipExperience';
import { getVipCopy } from '@/lib/vip-copy';
import { getVipPlan } from '@/lib/vip-plans';
import { mercadoPagoLiveCheckoutEnabled, mercadoPagoTestCheckoutEnabled } from '@/lib/mercadopago-checkout';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string | string[]; checkout?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copyMode = mercadoPagoLiveCheckoutEnabled() ? 'live' : 'prelaunch';
  return {
    title: 'Guizz VIP | GuizzMods',
    description: getVipCopy(locale, copyMode).metadata,
    alternates: {
      canonical: `/${locale}/vip`,
      languages: { en: '/en/vip', pt: '/pt/vip', es: '/es/vip' },
    },
  };
}

export default async function VipPage({ params, searchParams }: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const checkoutMode = mercadoPagoTestCheckoutEnabled()
    ? 'test' : mercadoPagoLiveCheckoutEnabled() ? 'live' : null;
  return <VipExperience locale={locale} initialPlan={getVipPlan(query.plan).id} checkoutMode={checkoutMode} returnedFromCheckout={query.checkout === 'test-return' || query.checkout === 'return'} />;
}
