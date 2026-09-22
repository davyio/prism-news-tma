'use client';

import React, { useState } from 'react';
import { X, Lock, Play, Sparkles } from 'lucide-react';
import { NewsItem } from '@/lib/news/types';
import { showRewardedAd } from '@/lib/monetization/adsgram';
import { triggerHaptic, triggerHapticNotification } from '@/lib/telegram/haptics';

interface RewardedLeakGateProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: (newsId: string) => void;
  onOpenSubscribe: () => void;
}

export const RewardedLeakGate: React.FC<RewardedLeakGateProps> = ({
  news,
  isOpen,
  onClose,
  onUnlocked,
  onOpenSubscribe,
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  if (!isOpen || !news) return null;

  const handleWatchAd = async () => {
    triggerHaptic('heavy');
    setIsWatchingAd(true);

    const blockId = process.env.NEXT_PUBLIC_ADSGRAM_BLOCK_ID || 'int-rewarded-sample';
    const completed = await showRewardedAd(blockId);

    setIsWatchingAd(false);
    if (completed) {
      triggerHapticNotification('success');
      onUnlocked(news.id);
      onClose();
    } else {
      triggerHapticNotification('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="w-full max-w-sm apple-glass rounded-3xl p-6 border border-amber-500/30 flex flex-col space-y-4 shadow-2xl relative">
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.06] text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-mono text-[9px] uppercase tracking-wider text-amber-400">
              RESTRICTED INVESTIGATIVE LEAK
            </span>
            <h3 className="font-semibold text-sm text-white tracking-tight mt-1.5">
              {news.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              This intelligence brief contains sensitive insider disclosures and institutional source documents.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleWatchAd}
            disabled={isWatchingAd}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-neutral-200 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isWatchingAd ? 'STREAMING 15s SPONSOR...' : 'WATCH 15s AD TO UNREDACT'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              onClose();
              onOpenSubscribe();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>BYPASS WITH PRISM BLACK VIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
