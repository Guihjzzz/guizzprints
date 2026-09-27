'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Download, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DownloadFlowView from '@/components/DownloadFlowView';
import { supabase } from '@/lib/supabase';

interface DownloadFlowProps {
  modId: string;
  modTitle?: string;
  modImage?: string;
  onModalStateChange?: (isOpen: boolean) => void;
}

export default function DownloadFlow({ modId, modTitle = 'GuizzMods', modImage = '/logo.jpg', onModalStateChange }: DownloadFlowProps) {
  const t = useTranslations('Download');
  const titleId = useId();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [step, setStep] = useState(0);
  const [stepTimer, setStepTimer] = useState(5);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [finalTimer, setFinalTimer] = useState(5);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const sessionRef = useRef<{ readyAt: number; expiresAt: number; vip: boolean } | null>(null);
  const stepDeadlineRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = step > 0 || showFinalModal;
  const resetFlow = useCallback(() => {
    sessionRef.current = null;
    stepDeadlineRef.current = null;
    setStep(0);
    setStepTimer(0);
    setShowFinalModal(false);
    setFinalTimer(0);
    setIsVerified(false);
    setIsVip(false);
    setFlowError(null);
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => { onModalStateChange?.(isOpen); }, [isOpen, onModalStateChange]);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const previousStyle = document.body.style.cssText;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') resetFlow();
      if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], iframe, [tabindex="0"]');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.cssText = previousStyle;
      window.scrollTo(0, scrollY);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen, resetFlow]);

  useEffect(() => {
    if (!step || stepTimer <= 0) return;
    const timer = setTimeout(() => setStepTimer(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, stepTimer]);

  useEffect(() => {
    const syncWhenVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const session = sessionRef.current;
      if (!session) return;

      const now = Date.now();
      if (now >= session.expiresAt) {
        resetFlow();
        setFlowError(t('sessionError'));
        return;
      }

      if (showFinalModal) {
        const remaining = Math.max(0, Math.ceil((session.readyAt - now) / 1000));
        setFinalTimer(remaining);
        return;
      }

      const stepDeadline = stepDeadlineRef.current;
      if (step > 0 && stepDeadline !== null) {
        setStepTimer(Math.max(0, Math.ceil((stepDeadline - now) / 1000)));
      }
    };

    window.addEventListener('pageshow', syncWhenVisible);
    document.addEventListener('visibilitychange', syncWhenVisible);
    return () => {
      window.removeEventListener('pageshow', syncWhenVisible);
      document.removeEventListener('visibilitychange', syncWhenVisible);
    };
  }, [resetFlow, showFinalModal, step, t]);

  useEffect(() => {
    if (!showFinalModal || hasTriggeredRef.current) return;
    if (finalTimer <= 0) {
      hasTriggeredRef.current = true;
      const controller = new AbortController();
      let disposed = false;
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const openUrl = `/api/download/open?mod=${encodeURIComponent(modId)}`;
      void (async () => {
        try {
          const response = await fetch(`${openUrl}&check=1`, {
            credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
          });
          if (!response.ok) throw new Error('Session unavailable');
          // Full navigation is intentional: the server validates the signed
          // session and then performs the final external redirect.
          if (!controller.signal.aborted) window.location.assign(new URL(openUrl, window.location.origin).toString());
        } catch {
          if (disposed) return;
          resetFlow();
          setFlowError(t('sessionError'));
        } finally { clearTimeout(timeout); }
      })();
      return () => { disposed = true; clearTimeout(timeout); controller.abort(); hasTriggeredRef.current = false; };
    }
    const timer = setTimeout(() => setFinalTimer(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [finalTimer, modId, resetFlow, showFinalModal, t]);

  const handleInitialClick = async () => {
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsPreparing(true);
    setFlowError(null);
    setIsVerified(false);
    setIsVip(false);
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authSession?.access_token) headers.Authorization = `Bearer ${authSession.access_token}`;
      const response = await fetch('/api/download/session', {
        method: 'POST', headers,
        credentials: 'same-origin', cache: 'no-store',
        body: JSON.stringify({ modId }), signal: controller.signal,
      });
      if (!response.ok) throw new Error('Download session unavailable');
      const apiSession = await response.json();
      if (![apiSession.readyAt, apiSession.expiresAt, apiSession.serverTime].every(Number.isFinite) || apiSession.expiresAt <= apiSession.readyAt) {
        throw new Error('Invalid session');
      }
      if (controller.signal.aborted) return;
      // Relative deadlines avoid assuming the visitor's clock matches the server.
      sessionRef.current = {
        readyAt: Date.now() + Math.max(0, apiSession.readyAt - apiSession.serverTime),
        expiresAt: Date.now() + apiSession.expiresAt - apiSession.serverTime - 5000,
        vip: apiSession.vip === true,
      };
      setIsVip(apiSession.vip === true);
      if (apiSession.vip === true) {
        stepDeadlineRef.current = null;
        setShowFinalModal(true);
        setFinalTimer(0);
        return;
      }
      stepDeadlineRef.current = Date.now() + 8_000;
      setStepTimer(8);
      setStep(1);
    } catch {
      if (timedOut || !controller.signal.aborted) setFlowError(t('sessionError'));
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
      if (timedOut || !controller.signal.aborted) setIsPreparing(false);
    }
  };
  const advance = () => {
    if (stepTimer > 0) return;
    if (!sessionRef.current || Date.now() >= sessionRef.current.expiresAt) {
      resetFlow();
      setFlowError(t('sessionError'));
      return;
    }
    if (step < 3) {
      stepDeadlineRef.current = Date.now() + 8_000;
      setStepTimer(8);
      setStep(step + 1);
    } else {
      stepDeadlineRef.current = null;
      setStep(0);
      setIsVerified(true);
    }
  };
  const cancel = resetFlow;
  const openFinal = () => {
    const session = sessionRef.current;
    if (!session || Date.now() + 5000 >= session.expiresAt) {
      resetFlow();
      setFlowError(t('sessionError'));
      return;
    }
    hasTriggeredRef.current = false;
    setFinalTimer(Math.max(5, Math.ceil((session.readyAt - Date.now()) / 1000)));
    setShowFinalModal(true);
  };

  return <>
    <div className="w-full rounded-2xl border border-blue-400/20 bg-[#111827] p-5 shadow-xl">
      {isVerified && <p className="mb-3 flex items-center justify-center gap-2 text-sm text-blue-300"><ShieldCheck size={16}/>{t('readyLink')}</p>}
      <button disabled={isPreparing} onClick={isVerified ? openFinal : handleInitialClick}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-4 font-bold text-white shadow-[0_6px_28px_#2563eb35] transition hover:bg-blue-500 active:translate-y-px disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
        {isPreparing ? <Loader2 size={19} className="motion-safe:animate-spin"/> : <Download size={19}/>}
        {t(isPreparing ? 'preparing' : 'download')}
      </button>
    </div>
    {flowError && <p role="alert" className="mt-3 text-center text-sm text-red-400">{flowError}</p>}
    {isOpen && createPortal(
      <div style={{ scrollbarWidth: 'none' }} className={`guizz-download-overlay fixed inset-0 z-[999999] h-[100dvh] overflow-y-auto overscroll-contain p-0 sm:p-5 ${showFinalModal ? 'bg-[#030712]/90 backdrop-blur-sm' : 'bg-[#030712]'}`}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
          className="relative mx-auto flex min-h-full w-full max-w-[960px] flex-col items-center gap-5 py-3 text-center outline-none sm:gap-6">
          <DownloadFlowView vip={isVip} step={step} stepTimer={stepTimer} showFinalModal={showFinalModal} finalTimer={finalTimer} modTitle={modTitle} modImage={modImage} titleId={titleId} advance={advance} cancel={cancel}/>
        </div>
      </div>, document.body
    )}
  </>;
}
