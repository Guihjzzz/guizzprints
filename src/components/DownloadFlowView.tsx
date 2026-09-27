'use client';

import Link from 'next/link';
import { ArrowRight, Check, Download, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { OptimizedImage } from '@/components/OptimizedImage';
import styles from './DownloadFlowView.module.css';

interface Props {
  vip: boolean;
  step: number;
  stepTimer: number;
  showFinalModal: boolean;
  finalTimer: number;
  modTitle: string;
  modImage: string;
  titleId: string;
  advance: () => void;
  cancel: () => void;
}

/** Presentation only: all authorization and timing remain in DownloadFlow. */
export default function DownloadFlowView({ vip, step, stepTimer, showFinalModal, finalTimer, modTitle, modImage, titleId, advance, cancel }: Props) {
  const t = useTranslations('Download');
  const locale = useLocale();
  const adLabel = useTranslations('Category')('advertisement');
  const ready = stepTimer <= 0;
  const stageRefreshKey = showFinalModal ? 0 : Math.max(0, step - 1);
  const [showVipPromo, setShowVipPromo] = useState(!vip);

  const vipPromo = !vip && showVipPromo ? <aside className={styles.vipPromo} role="status" aria-live="polite">
    <span className={styles.vipPromoIcon} aria-hidden="true">✦</span>
    <div className={styles.vipPromoText}>
      <strong>{t('vipPromoTitle')}</strong>
      <span>{t('vipPromoBody')}</span>
    </div>
    <Link className={styles.vipPromoLink} href={`/${locale}/vip?plan=monthly`}>{t('vipPromoCta')}<ArrowRight size={14} aria-hidden="true" /></Link>
    <button type="button" className={styles.vipPromoDismiss} onClick={() => setShowVipPromo(false)} aria-label={t('vipPromoDismiss')}><X size={15} aria-hidden="true" /></button>
  </aside> : null;
  const banner = () => vip ? null : <div className={`${styles.banner} ${showFinalModal ? styles.finalBanner : ''}`}>
    <AdPlaceholder
      key={`download-${showFinalModal ? 'final' : `stage-${step}`}-banner`}
      format={showFinalModal ? 'download-banner' : 'leaderboard'}
      refreshKey={stageRefreshKey}
      className={styles.bannerPlaceholder}
    >{adLabel}</AdPlaceholder>
  </div>;

  return <div className={`${styles.experience} ${showFinalModal ? styles.final : ''}`}>
    {vipPromo}
    <header className={styles.header}>
      <span className={styles.brand}><OptimizedImage src="/logo.jpg" optimizeWidth={52} optimizeHeight={52} alt="" width={26} height={26}/>GuizzMods</span>
      <button onClick={cancel} aria-label={t('cancel')} className={styles.close}><X size={18}/></button>
    </header>
    {!showFinalModal && <div className={styles.steps} aria-label={t('stepCounter', { step })}>
      {[1, 2, 3].map(value => <span key={value} data-active={value <= step}/>) }
    </div>}
    {banner()}
    <section className={`${styles.card} ${showFinalModal ? styles.finalCard : ''}`}>
      {!showFinalModal ? <>
        <div key={step} className={styles.enter}>
          <p className={styles.eyebrow}>{t('stepCounter', { step })}</p>
          <h2 id={titleId} className={styles.title}>{t(`step${step}Title`)}</h2>
          <p className={styles.description}>{t(`step${step}Description`)}</p>
        </div>
        {!vip && <div className={styles.rectangle}>
          <AdPlaceholder key={`download-stage-${step}-rectangle`} refreshKey={stageRefreshKey} format="rectangle" className={styles.rectanglePlaceholder}>{adLabel} · 300 × 250</AdPlaceholder>
        </div>}
        <button onClick={advance} disabled={!ready} className={`${styles.skip} ${ready ? styles.ready : ''}`}>
          <span className={styles.count}>{ready ? <ArrowRight size={16}/> : stepTimer}</span>
          {t(`step${step}Button`)}
        </button>
        <p className={styles.note}>{t('noAdClick')}</p>
      </> : <>
        <h2 id={titleId} className={styles.modTitle}>{modTitle}</h2>
        <div className={styles.cover}>
          <OptimizedImage src={modImage} optimizeWidth={640} optimizeHeight={360} optimizeQuality={72} alt={modTitle} fill sizes="(max-width: 400px) 260px, 300px" className={styles.coverImage} />
          <span className={styles.coverShade}/>
          <span className={styles.downloadIcon}>{finalTimer > 0 ? <Download size={38}/> : <Check size={38}/>}</span>
        </div>
        <span className={styles.finalCount} aria-live="off">{finalTimer > 0 ? `${finalTimer}s` : <Check size={14}/>}</span>
        <h3 className={styles.finalHeading}>{t('openingTerabox')}</h3>
        <p className={styles.finalDescription}>{t('sameTab')}</p>
        <div role="progressbar" aria-label={t('openingTerabox')} aria-valuemin={0} aria-valuemax={5} aria-valuenow={Math.max(0, 5 - finalTimer)} className={styles.progress}>
          <span style={{ width: `${Math.max(0, 5 - finalTimer) * 20}%` }}/>
        </div>
        <button onClick={cancel} className={styles.cancel}>{t('cancel')}</button>
      </>}
    </section>
    {banner()}
  </div>;
}
