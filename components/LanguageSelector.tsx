'use client';

import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { GlobalLanguage } from '@/lib/news/types';
import { LANGUAGE_NAMES } from '@/lib/ai/prompts';
import { playTactileFeedback } from '@/lib/telegram/haptics';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeLanguage: GlobalLanguage;
  onSelectLanguage: (lang: GlobalLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onClose,
  activeLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const languages: GlobalLanguage[] = ['en', 'es', 'fr', 'zh', 'ru', 'ar', 'ja', 'de'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-md apple-glass rounded-3xl p-5 border border-[var(--border-subtle)] flex flex-col space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">GLOBAL SYNTHESIS LANGUAGE</h3>
          </div>
          <button
            onClick={() => {
              playTactileFeedback('tap');
              onClose();
            }}
            className="p-1 rounded-full bg-[var(--bg-pill)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto no-scrollbar py-1">
          {languages.map((lang) => {
            const isSelected = activeLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  playTactileFeedback('pop');
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between shadow-sm ${
                  isSelected
                    ? 'bg-[var(--bg-card)] border-[var(--border-specular)] text-[var(--text-primary)] font-medium'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-pill-hover)]'
                }`}
              >
                <div>
                  <div className="font-mono text-xs uppercase text-[var(--text-primary)]">{lang}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{LANGUAGE_NAMES[lang]}</div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
