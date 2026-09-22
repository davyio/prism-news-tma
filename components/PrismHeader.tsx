'use client';

import React from 'react';
import { Crown, Volume2, Globe, Sun, Moon } from 'lucide-react';
import { playTactileFeedback } from '@/lib/telegram/haptics';

interface PrismHeaderProps {
  isSubscribed: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSubscribe: () => void;
  onOpenVoice: () => void;
  onOpenLang: () => void;
  currentLang: string;
  currentVoice: string;
}

export const PrismHeader: React.FC<PrismHeaderProps> = ({
  isSubscribed,
  theme,
  onToggleTheme,
  onOpenSubscribe,
  onOpenVoice,
  onOpenLang,
  currentLang,
  currentVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b px-3.5 py-2.5 flex items-center justify-between transition-colors">
      {/* Brand & Monolith Hardware Emblem */}
      <div className="flex items-center space-x-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-700 flex items-center justify-center shadow-inner border border-white/20">
          <div className="w-2.5 h-2.5 bg-black rotate-45 rounded-[2px]" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">PRISM</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">NEWS</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-[var(--text-muted)] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-gentle" />
            <span>LIVE INTELLIGENCE</span>
          </div>
        </div>
      </div>

      {/* Action Switches */}
      <div className="flex items-center space-x-1.5">
        {/* Day / Night Palette Mode Switch */}
        <button
          onClick={() => {
            playTactileFeedback('toggle');
            onToggleTheme();
          }}
          className="p-1.5 rounded-lg bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center shadow-sm"
          title={theme === 'dark' ? 'Switch to Day Palette' : 'Switch to Night Palette'}
          aria-label="Toggle Day / Night Palette"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-500 animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        {/* Voice Selector */}
        <button
          onClick={() => {
            playTactileFeedback('sheet');
            onOpenVoice();
          }}
          className="px-2 py-1 rounded-lg bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] flex items-center space-x-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          <Volume2 className="w-3 h-3 opacity-70" />
          <span className="capitalize">{currentVoice.toLowerCase()}</span>
        </button>

        {/* Language Selector */}
        <button
          onClick={() => {
            playTactileFeedback('sheet');
            onOpenLang();
          }}
          className="px-2 py-1 rounded-lg bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] flex items-center space-x-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all uppercase"
        >
          <Globe className="w-3 h-3 opacity-70" />
          <span>{currentLang}</span>
        </button>

        {/* Subscription VIP Button */}
        <button
          onClick={() => {
            playTactileFeedback('chime');
            onOpenSubscribe();
          }}
          className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1 text-[11px] font-medium transition-all shadow-sm ${
            isSubscribed
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-300'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 border-transparent'
          }`}
        >
          <Crown className="w-3 h-3 text-amber-400" />
          <span>{isSubscribed ? 'BLACK' : 'VIP'}</span>
        </button>
      </div>
    </header>
  );
};

