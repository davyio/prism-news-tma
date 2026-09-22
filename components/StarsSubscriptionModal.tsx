'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Zap, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/monetization/telegram-stars';
import { getTelegramWebApp } from '@/lib/telegram/webapp-sdk';
import { triggerHaptic, triggerHapticNotification, playTactileFeedback } from '@/lib/telegram/haptics';

interface StarsSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribedSuccess: () => void;
}

export const StarsSubscriptionModal: React.FC<StarsSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribedSuccess,
}) => {
  const [selectedTier, setSelectedTier] = useState<'prism-pass-weekly' | 'prism-black-monthly'>('prism-black-monthly');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    playTactileFeedback('chime');
    setIsLoading(true);

    try {
      const tg = getTelegramWebApp();
      const userId = tg?.initDataUnsafe?.user?.id?.toString() || 'web_preview_user';

      const res = await fetch('/api/stars/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tierId: selectedTier }),
      });

      const data = await res.json();

      if (data.success && data.invoiceLink) {
        if (tg && typeof tg.openInvoice === 'function') {
          tg.openInvoice(data.invoiceLink, (status) => {
            if (status === 'paid') {
              triggerHapticNotification('success');
              onSubscribedSuccess();
              onClose();
            } else {
              triggerHapticNotification('warning');
            }
          });
        } else {
          // Web fallback simulation
          setTimeout(() => {
            triggerHapticNotification('success');
            onSubscribedSuccess();
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      console.error('[StarsCheckout] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTier = SUBSCRIPTION_TIERS[selectedTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-sm apple-glass rounded-3xl p-6 border border-[var(--border-subtle)] flex flex-col space-y-4 shadow-2xl relative text-break-boundary">
        <button
          onClick={() => {
            playTactileFeedback('tap');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[var(--bg-pill)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg border border-amber-300/40">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-base tracking-tight text-[var(--text-primary)]">PRISM BLACK INNER CIRCLE</h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
              Unrestricted access to unredacted dossiers, custom bias sliders, and high-frequency refractions.
            </p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              playTactileFeedback('pop');
              setSelectedTier('prism-pass-weekly');
            }}
            className={`p-3 rounded-2xl border text-left transition-all shadow-sm ${
              selectedTier === 'prism-pass-weekly'
                ? 'bg-[var(--bg-card)] border-[var(--border-specular)] text-[var(--text-primary)] font-medium'
                : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-pill-hover)]'
            }`}
          >
            <span className="font-mono text-[10px] text-[var(--text-muted)] block uppercase">7-DAY PASS</span>
            <span className="font-bold text-sm text-[var(--text-primary)] block mt-0.5">45 STARS</span>
            <span className="text-[10px] text-[var(--text-muted)] block">6.4 XTR / day</span>
          </button>

          <button
            onClick={() => {
              playTactileFeedback('pop');
              setSelectedTier('prism-black-monthly');
            }}
            className={`p-3 rounded-2xl border text-left transition-all relative shadow-sm ${
              selectedTier === 'prism-black-monthly'
                ? 'bg-amber-500/10 border-amber-500/50 text-[var(--text-primary)] font-medium'
                : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-pill-hover)]'
            }`}
          >
            <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[8px] font-bold shadow-sm">
              BEST VALUE
            </span>
            <span className="font-mono text-[10px] text-amber-500 dark:text-amber-400 block uppercase">30-DAY BLACK</span>
            <span className="font-bold text-sm text-[var(--text-primary)] block mt-0.5">150 STARS</span>
            <span className="text-[10px] text-[var(--text-muted)] block">5.0 XTR / day</span>
          </button>
        </div>

        {/* Feature List */}
        <div className="p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2">
          <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] tracking-wider block">
            MEMBERSHIP PRIVILEGES:
          </span>
          <ul className="space-y-1.5">
            {currentTier.features.map((feat, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-xs text-[var(--text-primary)]">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Telegram Stars Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>{isLoading ? 'INITIATING STARS...' : `UNLOCK WITH ${currentTier.starsPrice} STARS`}</span>
        </button>

        <p className="text-center font-mono text-[10px] text-[var(--text-muted)]">
          Instant activation • Backed by Telegram native Stars billing
        </p>
      </div>
    </div>
  );
};
