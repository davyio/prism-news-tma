'use client';

import React from 'react';
import { SpectrumPOV } from '@/lib/news/types';
import { POV_DEFINITIONS } from '@/lib/ai/prompts';
import { playTactileFeedback } from '@/lib/telegram/haptics';

interface PovRefractorBarProps {
  activePov: SpectrumPOV;
  onSelectPov: (pov: SpectrumPOV) => void;
}

export const PovRefractorBar: React.FC<PovRefractorBarProps> = ({
  activePov,
  onSelectPov,
}) => {
  const povList: SpectrumPOV[] = ['FACT', 'OPTIMIST', 'CYNIC', 'DEGEN', 'REALIST', 'TABLOID'];

  return (
    <div className="w-full px-4 py-2 border-b border-[var(--border-subtle)] sticky top-[49px] z-30 apple-glass transition-colors">
      <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-1.5 flex items-center justify-between">
        <span>REFRACTIVE SPECTRUM LENS:</span>
        <span className="text-[var(--text-primary)] font-semibold">{POV_DEFINITIONS[activePov].label}</span>
      </div>

      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {povList.map((pov) => {
          const info = POV_DEFINITIONS[pov];
          const isSelected = activePov === pov;

          return (
            <button
              key={pov}
              onClick={() => {
                playTactileFeedback('pop');
                onSelectPov(pov);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-tight whitespace-nowrap flex items-center space-x-1.5 transition-all shadow-sm ${
                isSelected
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold border-transparent shadow'
                  : 'bg-[var(--bg-pill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: info.badgeColor }}
              />
              <span>{info.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

