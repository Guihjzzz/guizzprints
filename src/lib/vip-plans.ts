export const vipPlans = [
  { id: 'daily', days: 1, priceCents: 199 },
  { id: 'weekly', days: 7, priceCents: 670 },
  { id: 'monthly', days: 30, priceCents: 1990 },
] as const;

export type VipPlanId = (typeof vipPlans)[number]['id'];

export function getVipPlan(id: unknown) {
  return vipPlans.find((plan) => plan.id === id) ?? vipPlans[2];
}

export function formatVipPrice(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency', currency: 'BRL',
  }).format(cents / 100);
}
