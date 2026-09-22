'use client';

import React from 'react';
import { Flame, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram/haptics';

interface VelocityTickerProps {
  totalStories: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const VelocityTicker: React.FC<VelocityTickerProps> = ({
  totalStories,
  activeCategory,
  onSelectCategory,
  onRefresh,
  isRefreshing,
}) => {
  const categories = ['ALL', 'TECH', 'MARKETS', 'MACRO', 'CRYPTO'];

  return (
    <div className="w-full px-4 pt-3 pb-2 flex flex-col space-y-2.5 border-b border-white/[0.04] bg-neutral-950/40">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-neutral-400 font-mono text-[11px]">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white font-medium">DISCOVERY STREAM</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400">{totalStories} DISPATCHES</span>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onRefresh();
          }}
          disabled={isRefreshing}
          className="flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-neutral-200' : ''}`} />
          <span className="font-mono">{isRefreshing ? 'PULSING...' : 'SYNC'}</span>
        </button>
      </div>

      {/* Category Pills (X Style Discovery) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('light');
                onSelectCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.08] border border-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
