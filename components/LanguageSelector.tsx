'use client';

import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { GlobalLanguage } from '@/lib/news/types';
import { LANGUAGE_NAMES } from '@/lib/ai/prompts';
import { triggerHaptic } from '@/lib/telegram/haptics';

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div className="w-full max-w-md apple-glass rounded-3xl p-5 border border-white/10 flex flex-col space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-white">GLOBAL SYNTHESIS LANGUAGE</h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1 rounded-full bg-white/[0.06] text-neutral-400 hover:text-white"
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
                  triggerHaptic('medium');
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white/15 border-white/30 text-white font-medium'
                    : 'bg-white/[0.02] border-white/[0.04] text-neutral-300 hover:bg-white/[0.06]'
                }`}
              >
                <div>
                  <div className="font-mono text-xs uppercase">{lang}</div>
                  <div className="text-[11px] text-neutral-400">{LANGUAGE_NAMES[lang]}</div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
