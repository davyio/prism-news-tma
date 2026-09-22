'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Zap, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/monetization/telegram-stars';
import { getTelegramWebApp } from '@/lib/telegram/webapp-sdk';
import { triggerHaptic, triggerHapticNotification } from '@/lib/telegram/haptics';

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
    triggerHaptic('heavy');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="w-full max-w-sm apple-glass rounded-3xl p-6 border border-white/10 flex flex-col space-y-4 shadow-2xl relative">
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.06] text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg border border-amber-300/40">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-base tracking-tight text-white">PRISM BLACK INNER CIRCLE</h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Unrestricted access to unredacted dossiers, custom bias sliders, and high-frequency refractions.
            </p>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedTier('prism-pass-weekly');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedTier === 'prism-pass-weekly'
                ? 'bg-white/15 border-white/40 text-white shadow-sm'
                : 'bg-white/[0.03] border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]'
            }`}
          >
            <span className="font-mono text-[10px] text-neutral-400 block uppercase">7-DAY PASS</span>
            <span className="font-bold text-sm text-white block mt-0.5">45 STARS</span>
            <span className="text-[10px] text-neutral-500 block">6.4 XTR / day</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedTier('prism-black-monthly');
            }}
            className={`p-3 rounded-2xl border text-left transition-all relative ${
              selectedTier === 'prism-black-monthly'
                ? 'bg-gradient-to-br from-amber-500/20 to-neutral-900 border-amber-500/50 text-white shadow-sm'
                : 'bg-white/[0.03] border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]'
            }`}
          >
            <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[8px] font-bold">
              BEST VALUE
            </span>
            <span className="font-mono text-[10px] text-amber-400 block uppercase">30-DAY BLACK</span>
            <span className="font-bold text-sm text-white block mt-0.5">150 STARS</span>
            <span className="text-[10px] text-neutral-400 block">5.0 XTR / day</span>
          </button>
        </div>

        {/* Feature List */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
          <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider block">
            MEMBERSHIP PRIVILEGES:
          </span>
          <ul className="space-y-1.5">
            {currentTier.features.map((feat, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-xs text-neutral-200">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{feat}</span>
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

        <p className="text-center font-mono text-[10px] text-neutral-500">
          Instant activation • Backed by Telegram native Stars billing
        </p>
      </div>
    </div>
  );
};
