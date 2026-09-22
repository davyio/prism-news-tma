'use client';

import React from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { playTactileFeedback } from '@/lib/telegram/haptics';

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
    <div className="w-full px-4 pt-3 pb-2.5 flex flex-col space-y-2 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 transition-colors">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[var(--text-primary)] font-medium">DISCOVERY STREAM</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[var(--text-secondary)]">{totalStories} DISPATCHES</span>
        </div>

        <button
          onClick={() => {
            playTactileFeedback('pop');
            onRefresh();
          }}
          disabled={isRefreshing}
          className="flex items-center space-x-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[var(--text-primary)]' : ''}`} />
          <span className="font-mono">{isRefreshing ? 'SYNCING...' : 'SYNC'}</span>
        </button>
      </div>

      {/* Category Pills (Apple / X Style Discovery) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                playTactileFeedback('tap');
                onSelectCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                  : 'bg-[var(--bg-pill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)]'
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

