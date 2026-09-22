'use client';

import React from 'react';
import { Sparkles, Crown, Volume2, Globe } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram/haptics';

interface PrismHeaderProps {
  isSubscribed: boolean;
  onOpenSubscribe: () => void;
  onOpenVoice: () => void;
  onOpenLang: () => void;
  currentLang: string;
  currentVoice: string;
}

export const PrismHeader: React.FC<PrismHeaderProps> = ({
  isSubscribed,
  onOpenSubscribe,
  onOpenVoice,
  onOpenLang,
  currentLang,
  currentVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
      {/* Brand & Monolith Icon */}
      <div className="flex items-center space-x-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 flex items-center justify-center shadow-inner border border-white/20">
          <div className="w-2.5 h-2.5 bg-black rotate-45 rounded-[2px]" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-sm tracking-tight text-white">PRISM</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">NEWS</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-neutral-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-gentle" />
            <span>LIVE INTELLIGENCE</span>
          </div>
        </div>
      </div>

      {/* Action Switches */}
      <div className="flex items-center space-x-1.5">
        {/* Voice Selector */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenVoice();
          }}
          className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center space-x-1 text-[11px] font-mono text-neutral-300 transition-all"
        >
          <Volume2 className="w-3 h-3 text-neutral-400" />
          <span className="capitalize">{currentVoice.toLowerCase()}</span>
        </button>

        {/* Language Selector */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenLang();
          }}
          className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center space-x-1 text-[11px] font-mono text-neutral-300 transition-all uppercase"
        >
          <Globe className="w-3 h-3 text-neutral-400" />
          <span>{currentLang}</span>
        </button>

        {/* Subscription VIP Button */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenSubscribe();
          }}
          className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1 text-[11px] font-medium transition-all ${
            isSubscribed
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm'
              : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
          }`}
        >
          <Crown className="w-3 h-3 text-amber-400" />
          <span>{isSubscribed ? 'BLACK' : 'VIP'}</span>
        </button>
      </div>
    </header>
  );
};
