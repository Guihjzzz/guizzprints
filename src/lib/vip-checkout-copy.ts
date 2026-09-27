const pt = {
  action: 'Abrir checkout de teste', loading: 'Preparando teste…',
  heroNote: 'Teste PIX disponível apenas para contas autorizadas; não ativa o VIP.',
  plansNote: 'Modo de teste: nenhuma transferência real deve ser feita e o teste não ativa benefícios.',
  notice: 'Teste PIX Mercado Pago · sem ativação VIP',
  note: 'Use apenas um Access Token de teste. Este teste não ativa benefícios nem confirma pagamentos. Não faça uma transferência real.',
  returned: 'Você voltou do checkout de teste. Nenhum benefício VIP foi ativado e este retorno não confirma pagamento.',
  error: 'Não foi possível abrir o teste. Confira a configuração do Mercado Pago e tente novamente.',
  providerAuth: 'O Mercado Pago rejeitou o Access Token. Confirme que é uma credencial de teste válida.',
  providerPermission: 'A credencial não tem permissão para criar pedidos. Confirme as permissões da aplicação no Mercado Pago.',
  providerRequest: 'O Mercado Pago rejeitou os dados do plano. Confirme o valor e o ambiente de teste.',
  tester: 'Checkout disponível apenas para as contas de teste autorizadas.',
  login: 'Entre na sua conta para testar.',
};
const en: typeof pt = {
  action: 'Open test checkout', loading: 'Preparing test…', heroNote: 'PIX test available only to authorized accounts; it does not activate VIP.', plansNote: 'Test mode: do not make a real transfer; the test does not activate benefits.', notice: 'Mercado Pago PIX test · no VIP activation',
  note: 'Use a test Access Token only. This test does not activate benefits or confirm payments. Do not make a real transfer.',
  returned: 'You returned from the test checkout. No VIP benefits were activated; this return does not confirm payment.',
  error: 'Could not open the test. Check the Mercado Pago configuration and try again.',
  providerAuth: 'Mercado Pago rejected the Access Token. Confirm it is a valid test credential.',
  providerPermission: 'The credential cannot create orders. Confirm the application permissions in Mercado Pago.',
  providerRequest: 'Mercado Pago rejected the plan data. Confirm the amount and test environment.',
  tester: 'Checkout is available only to authorized test accounts.', login: 'Sign in to test.',
};
const es: typeof pt = {
  action: 'Abrir checkout de prueba', loading: 'Preparando prueba…', heroNote: 'Prueba PIX disponible solo para cuentas autorizadas; no activa VIP.', plansNote: 'Modo de prueba: no hagas una transferencia real; la prueba no activa beneficios.', notice: 'Prueba PIX de Mercado Pago · sin activación VIP',
  note: 'Usa solo un Access Token de prueba. Esta prueba no activa beneficios ni confirma pagos. No hagas una transferencia real.',
  returned: 'Volviste del checkout de prueba. No se activaron beneficios VIP; este regreso no confirma el pago.',
  error: 'No se pudo abrir la prueba. Revisa la configuración de Mercado Pago e inténtalo de nuevo.',
  providerAuth: 'Mercado Pago rechazó el Access Token. Confirma que sea una credencial de prueba válida.',
  providerPermission: 'La credencial no puede crear pedidos. Confirma los permisos de la aplicación en Mercado Pago.',
  providerRequest: 'Mercado Pago rechazó los datos del plan. Confirma el importe y el entorno de prueba.',
  tester: 'Checkout disponible solo para cuentas de prueba autorizadas.', login: 'Inicia sesión para probar.',
};

const livePt: typeof pt = {
  action: 'Continuar para pagamento', loading: 'Preparando pagamento…',
  heroNote: 'Pagamento PIX seguro; o VIP é liberado somente após a confirmação.',
  plansNote: 'Escolha um período e continue para o checkout seguro do Mercado Pago.',
  notice: 'PIX · pagamento seguro',
  note: 'Você será levado ao checkout seguro do Mercado Pago. O VIP só é ativado após a confirmação do pagamento.',
  returned: 'Você voltou do checkout. O acesso VIP será liberado somente após a confirmação do pagamento.',
  error: 'Não foi possível abrir o pagamento. Tente novamente em instantes.',
  providerAuth: 'A configuração de pagamento precisa ser revisada.',
  providerPermission: 'A configuração de pagamento não tem permissão para criar pedidos.',
  providerRequest: 'Os dados do plano foram recusados pelo provedor de pagamento.',
  tester: '', login: 'Entre na sua conta para continuar.',
};
const liveEn: typeof pt = {
  action: 'Continue to payment', loading: 'Preparing payment…', notice: 'PIX · secure payment',
  heroNote: 'Secure PIX payment; VIP is released only after confirmation.',
  plansNote: 'Choose a period and continue to Mercado Pago’s secure checkout.',
  note: 'You will continue to Mercado Pago’s secure checkout. VIP activates only after payment is confirmed.',
  returned: 'You returned from checkout. VIP access is released only after payment is confirmed.',
  error: 'Could not open payment. Please try again in a moment.',
  providerAuth: 'The payment configuration needs review.',
  providerPermission: 'The payment configuration cannot create orders.',
  providerRequest: 'The plan data was rejected by the payment provider.',
  tester: '', login: 'Sign in to continue.',
};
const liveEs: typeof pt = {
  action: 'Continuar al pago', loading: 'Preparando pago…', notice: 'PIX · pago seguro',
  heroNote: 'Pago PIX seguro; el acceso VIP se libera solo después de la confirmación.',
  plansNote: 'Elige un período y continúa al checkout seguro de Mercado Pago.',
  note: 'Continuarás al checkout seguro de Mercado Pago. El VIP se activa solo después de confirmar el pago.',
  returned: 'Volviste del checkout. El acceso VIP se libera solo después de confirmar el pago.',
  error: 'No se pudo abrir el pago. Inténtalo de nuevo en un momento.',
  providerAuth: 'La configuración de pago necesita revisión.',
  providerPermission: 'La configuración de pago no puede crear pedidos.',
  providerRequest: 'El proveedor de pagos rechazó los datos del plan.',
  tester: '', login: 'Inicia sesión para continuar.',
};

export function getVipCheckoutCopy(locale: string, mode: 'test' | 'live' = 'test') {
  if (mode === 'live') return locale === 'pt' ? livePt : locale === 'es' ? liveEs : liveEn;
  return locale === 'pt' ? pt : locale === 'es' ? es : en;
}
