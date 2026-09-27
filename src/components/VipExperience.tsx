'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, BadgeCheck, Check, ChevronDown, Crown, Gift, LockKeyhole, ReceiptText, ShieldCheck, Smartphone, Timer, X } from 'lucide-react';
import { InstallAppButton } from '@/components/InstallAppButton';
import { getVipCopy } from '@/lib/vip-copy';
import { getVipCheckoutCopy } from '@/lib/vip-checkout-copy';
import { supabase } from '@/lib/supabase';
import { formatVipPrice, getVipPlan, vipPlans, type VipPlanId } from '@/lib/vip-plans';
import styles from './VipExperience.module.css';

const benefitIcons = [ShieldCheck, Timer, BadgeCheck];

function subscribeToPlan(change: () => void) {
  window.addEventListener('popstate', change);
  window.addEventListener('pageshow', change);
  window.addEventListener('guizz:vip-plan', change);
  return () => {
    window.removeEventListener('popstate', change);
    window.removeEventListener('pageshow', change);
    window.removeEventListener('guizz:vip-plan', change);
  };
}

function currentPlan() {
  return getVipPlan(new URL(window.location.href).searchParams.get('plan')).id;
}

export function VipExperience({ locale, initialPlan, checkoutMode = null, returnedFromCheckout = false }: { locale: string; initialPlan: VipPlanId; checkoutMode?: 'test' | 'live' | null; returnedFromCheckout?: boolean }) {
  const copy = getVipCopy(locale, checkoutMode === 'live' ? 'live' : 'prelaunch');
  const checkoutCopy = getVipCheckoutCopy(locale, checkoutMode === 'live' ? 'live' : 'test');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const checkoutBusy = useRef(false);
  const selected = useSyncExternalStore(subscribeToPlan, currentPlan, () => initialPlan);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [vipEntitlement, setVipEntitlement] = useState<{ planId: string; expiresAt: string } | null>(null);
  const summary = useRef<HTMLDialogElement>(null);
  const plan = getVipPlan(selected);
  const loginPath = `/${locale}/login?next=${encodeURIComponent(`/${locale}/vip?plan=${selected}`)}`;

  const formatExpiry = (value: string) => {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    const language = locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(language, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  useEffect(() => {
    let active = true;
    let requestId = 0;
    const loadEntitlement = async (accessToken: string | undefined) => {
      const currentRequest = ++requestId;
      if (!accessToken) { if (active) setVipEntitlement(null); return; }
      try {
        const response = await fetch('/api/vip/status', { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' });
        const data = await response.json() as { vip?: boolean; planId?: string; expiresAt?: string };
        if (!active || currentRequest !== requestId) return;
        setVipEntitlement(data.vip && typeof data.planId === 'string' && typeof data.expiresAt === 'string' ? { planId: data.planId, expiresAt: data.expiresAt } : null);
      } catch { if (active && currentRequest === requestId) setVipEntitlement(null); }
    };
    const refreshSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!active) return;
        setSignedIn(Boolean(session?.user));
        void loadEntitlement(session?.access_token);
      } catch {
        if (active) {
          setSignedIn(false);
          void loadEntitlement(undefined);
        }
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedIn(Boolean(session?.user));
      void loadEntitlement(session?.access_token);
    });
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') void refreshSession(); };
    void refreshSession();
    window.addEventListener('pageshow', refreshSession);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
      window.removeEventListener('pageshow', refreshSession);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const activeExpiry = vipEntitlement ? formatExpiry(vipEntitlement.expiresAt) : null;
  const activePlan = vipEntitlement ? vipPlans.find(item => item.id === vipEntitlement.planId) : null;

  function choosePlan(id: VipPlanId) {
    setCheckoutError('');
    const url = new URL(window.location.href);
    url.searchParams.set('plan', id);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event('guizz:vip-plan'));
    summary.current?.showModal();
  }

  async function openCheckout() {
    if (checkoutBusy.current) return;
    checkoutBusy.current = true;
    setCheckingOut(true);
    setCheckoutError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setCheckoutError(checkoutCopy.login); return; }
      const response = await fetch('/api/vip/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ planId: selected, locale }), signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.error === 'tester_only' ? checkoutCopy.tester
          : data.error === 'login_required' ? checkoutCopy.login
            : data.error === 'provider_auth' ? checkoutCopy.providerAuth
              : data.error === 'provider_permission' ? checkoutCopy.providerPermission
                : data.error === 'provider_request' ? checkoutCopy.providerRequest : checkoutCopy.error;
        setCheckoutError(message);
        return;
      }
      const url = new URL(data.url);
      const validHost = url.hostname === 'www.mercadopago.com.br' || url.hostname === 'mercadopago.com.br';
      if (data.testMode !== (checkoutMode === 'test') || data.provider !== 'mercadopago'
        || url.protocol !== 'https:' || !validHost || url.username || url.password) throw new Error();
      window.location.assign(url.href);
    } catch { setCheckoutError(checkoutCopy.error); }
    finally { checkoutBusy.current = false; setCheckingOut(false); }
  }

  return (
    <div className={styles.page}>
      {returnedFromCheckout && <p className={styles.notice} role="status">{checkoutMode ? checkoutCopy.returned : copy.returnNotice}</p>}
      <section className={styles.hero} aria-labelledby="vip-title">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><Crown size={16} aria-hidden="true" />{copy.eyebrow}<span className={styles.status} data-active={Boolean(vipEntitlement)}>{vipEntitlement ? copy.activeStatus : copy.status}</span></div>
          <h1 id="vip-title">{copy.title}<br /><span>{copy.titleAccent}</span></h1>
          <p className={styles.intro}>{copy.intro}</p>
          {vipEntitlement && <div className={styles.activeCard} role="status">
            <div className={styles.activeCardIcon}><Crown size={20} aria-hidden="true" /></div>
            <div className={styles.activeCardCopy}><strong>{copy.activeTitle}</strong><p>{copy.activeBody}</p><span>{activePlan ? copy.planNames[activePlan.id] : ''}{activePlan && activeExpiry ? ' · ' : ''}{activeExpiry ? `${copy.activeUntil} ${activeExpiry}` : ''}</span></div>
            <Link href={`/${locale}/settings`} className={styles.activeCardLink}>{copy.activeAccount}<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>}
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#plans">{copy.explore}<ArrowDown size={17} aria-hidden="true" /></a>
            <Link className={styles.textLink} href={`/${locale}`}>{copy.freeLink}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <p className={styles.heroNote}>{vipEntitlement ? copy.activeHeroNote : checkoutMode ? checkoutCopy.heroNote : copy.heroNote}</p>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.memberCard}>
            <div className={styles.cardTop}><Image src="/logo.jpg" width={38} height={38} alt="" /><span>GUIZZ<span className={styles.cardPlus}>+</span></span><Crown size={22} /></div>
            <div className={styles.cardCrown}><Crown size={76} strokeWidth={1.3} /></div>
            <span className={styles.cardEyebrow}>{copy.badgeLabel}</span>
            <strong>{copy.badgeTitle}</strong>
            <p>{copy.badgeText}</p>
            <div className={styles.cardFoot}><span className={styles.dot} />{copy.badgeFoot}</div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="benefits-title">
        <div className={styles.sectionHeader}><p className={styles.kicker}>{copy.benefitsEyebrow}</p><h2 id="benefits-title">{copy.benefitsTitle}</h2><p>{copy.benefitsIntro}</p></div>
        <div className={styles.benefits}>{copy.benefits.map((benefit, index) => {
          const Icon = benefitIcons[index];
          return <article className={styles.benefit} key={benefit.title}><div className={styles.iconBox}><Icon size={24} aria-hidden="true" /></div><h3>{benefit.title}</h3><p>{benefit.body}</p></article>;
        })}</div>
      </section>

      <section className={styles.section} id="plans" aria-labelledby="plans-title">
        <div className={styles.sectionHeader}><p className={styles.kicker}>{copy.plansEyebrow}</p><h2 id="plans-title">{copy.plansTitle}</h2><p>{copy.plansIntro}</p></div>
        <div className={styles.plans}>{vipPlans.map((item) => (
          <article className={`${styles.plan} ${selected === item.id ? styles.planSelected : ''}`} key={item.id}>
            <div className={styles.planHeading}><h3>{copy.planNames[item.id]}</h3><Crown size={19} aria-hidden="true" /></div>
            <p className={styles.duration}>{item.days} {copy.days}</p>
            <p className={styles.price}>{formatVipPrice(item.priceCents, locale)}</p>
            <span className={styles.priceNote}>{copy.total}</span>
            <p className={styles.daily}>{formatVipPrice(item.priceCents / item.days, locale)}{copy.perDay}</p>
            <div className={styles.planDivider} />
            <p className={styles.planBenefit}><Check size={16} aria-hidden="true" />{copy.periodBenefit}</p>
            <button type="button" className={selected === item.id ? styles.primary : styles.secondary} onClick={() => choosePlan(item.id)} aria-label={`${copy.select} ${copy.planNames[item.id]}`}>
              {copy.select}<ArrowRight size={16} aria-hidden="true" />
            </button>
            <span className={styles.selectedLabel}>{selected === item.id ? copy.selected : '\u00a0'}</span>
          </article>
        ))}</div>
        <p className={styles.notice}><ShieldCheck size={18} aria-hidden="true" />{vipEntitlement ? copy.activePlansNote : checkoutMode ? checkoutCopy.plansNote : copy.plansNote}</p>
      </section>

      <section className={styles.freeSection} aria-labelledby="free-title">
        <div><p className={styles.kicker}>{copy.freeEyebrow}</p><h2 id="free-title">{copy.freeTitle}</h2><p>{copy.freeIntro}</p></div>
        <ul>{copy.freeItems.map((text) => <li key={text}><Check size={19} aria-hidden="true" />{text}</li>)}</ul>
      </section>

      <section className={styles.section} aria-labelledby="account-title">
        <div className={styles.sectionHeader}><h2 id="account-title">{copy.accountTitle}</h2><p>{copy.accountIntro}</p></div>
        <div className={styles.accountGrid}>
          <article className={styles.accountCard}><ReceiptText size={25} aria-hidden="true" /><div><h3>{copy.historyTitle}</h3><p>{copy.historyBody}</p><span className={styles.comingSoon}>{copy.soon}</span></div></article>
          <article className={styles.accountCard}><Gift size={25} aria-hidden="true" /><div><h3>{copy.codeTitle}</h3><p>{copy.codeBody}</p><span className={styles.comingSoon}>{copy.soon}</span></div></article>
        </div>
      </section>

      <section className={styles.installSection} aria-labelledby="install-title">
        <div className={styles.installIcon}><Smartphone size={35} aria-hidden="true" /></div>
        <div><h2 id="install-title">{copy.installTitle}</h2><p>{copy.installBody}</p></div>
        <InstallAppButton className={styles.secondary} />
      </section>

      <section className={`${styles.section} ${styles.faq}`} aria-labelledby="faq-title">
        <div className={styles.sectionHeader}><p className={styles.kicker}>{copy.faqEyebrow}</p><h2 id="faq-title">{copy.faqTitle}</h2></div>
        <div>{copy.faq.map(({ q, a }) => <details key={q}><summary>{q}<ChevronDown size={19} aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
        <p className={styles.contact}>{copy.contactTitle} <Link href={`/${locale}/contact`}>{copy.contact}<ArrowRight size={15} aria-hidden="true" /></Link></p>
      </section>

      <dialog className={styles.dialog} ref={summary} aria-labelledby="vip-summary-title" aria-describedby="vip-summary-intro">
        <button type="button" className={styles.close} onClick={() => summary.current?.close()} aria-label={copy.close}><X size={22} aria-hidden="true" /></button>
        <div className={styles.iconBox}><Crown size={28} aria-hidden="true" /></div>
        <h2 id="vip-summary-title">{copy.summary}</h2><p id="vip-summary-intro">{copy.summaryIntro}</p>
        <div className={styles.summaryPlan}><strong>{copy.planNames[plan.id]}</strong><dl><div><dt>{copy.period}</dt><dd>{plan.days} {copy.days}</dd></div><div><dt>{copy.price}</dt><dd>{formatVipPrice(plan.priceCents, locale)}</dd></div></dl></div>
        <div className={styles.paymentNotice}><LockKeyhole size={22} aria-hidden="true" /><div><h3>{vipEntitlement ? copy.activeStatus : checkoutMode ? checkoutCopy.notice : copy.paymentStatus}</h3><p>{vipEntitlement ? copy.activePlansNote : checkoutMode ? checkoutCopy.note : copy.paymentNote}</p></div></div>
        <div className={styles.summaryActions}>
          {checkoutMode && signedIn && !vipEntitlement && <button type="button" className={styles.primary} disabled={checkingOut} aria-busy={checkingOut} onClick={openCheckout}>{checkingOut ? checkoutCopy.loading : checkoutCopy.action}<ArrowRight size={17} aria-hidden="true" /></button>}
          {checkoutError && <p className={styles.checkoutError} role="alert">{checkoutError}</p>}
          {signedIn !== null && <a href={signedIn ? `/${locale}/settings` : loginPath} className={signedIn ? styles.secondary : styles.primary}>{signedIn ? copy.accountLink : copy.login}<ArrowRight size={17} aria-hidden="true" /></a>}
        </div>
        <p className={styles.loginNote}>{copy.loginNote}</p>
        <button type="button" className={styles.secondary} onClick={() => summary.current?.close()}>{copy.change}</button>
      </dialog>
    </div>
  );
}
