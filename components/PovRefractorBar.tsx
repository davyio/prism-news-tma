'use client';

import React from 'react';
import { SpectrumPOV } from '@/lib/news/types';
import { POV_DEFINITIONS } from '@/lib/ai/prompts';
import { triggerHaptic } from '@/lib/telegram/haptics';

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
    <div className="w-full px-4 py-2 border-b border-white/[0.04] bg-neutral-950/60 sticky top-[53px] z-30 apple-glass">
      <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
        <span>REFRACTIVE SPECTRUM LENS:</span>
        <span className="text-white font-medium">{POV_DEFINITIONS[activePov].label}</span>
      </div>

      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {povList.map((pov) => {
          const info = POV_DEFINITIONS[pov];
          const isSelected = activePov === pov;

          return (
            <button
              key={pov}
              onClick={() => {
                triggerHaptic('light');
                onSelectPov(pov);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-tight whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                isSelected
                  ? 'bg-white/15 text-white border border-white/30 shadow-sm'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-neutral-200 border border-white/[0.04]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
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
