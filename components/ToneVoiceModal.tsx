'use client';

import React from 'react';
import { X, Check, Volume2 } from 'lucide-react';
import { VoiceTone } from '@/lib/news/types';
import { VOICE_PROMPTS } from '@/lib/ai/prompts';
import { playTactileFeedback } from '@/lib/telegram/haptics';

interface ToneVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeVoice: VoiceTone;
  onSelectVoice: (voice: VoiceTone) => void;
}

export const ToneVoiceModal: React.FC<ToneVoiceModalProps> = ({
  isOpen,
  onClose,
  activeVoice,
  onSelectVoice,
}) => {
  if (!isOpen) return null;

  const voices: { id: VoiceTone; name: string; desc: string; sample: string }[] = [
    {
      id: 'EXECUTIVE',
      name: 'Executive Memorandum',
      desc: 'C-suite summary, tabular takeaways, zero conversational fluff.',
      sample: 'Key inflection point: capital allocation shifting to high-conviction infrastructure.',
    },
    {
      id: 'GENZ',
      name: 'Gen-Z / Brainrot Slang',
      desc: 'High velocity internet vernacular: cooked, based, ratio, aura, no cap.',
      sample: 'Bro really thought he could short this without getting utterly mogged fr fr.',
    },
    {
      id: 'ACADEMIC',
      name: 'Scholarly Treatise',
      desc: 'Rigorous empirical discourse, philosophical framing, and systemic models.',
      sample: 'The macroeconomic bifurcation demonstrates systemic path dependency in capital formation.',
    },
    {
      id: 'NOIR',
      name: 'Hemingway / Noir Hardboiled',
      desc: 'Short punchy sentences, cynical observations, smoke-filled atmospheric grit.',
      sample: 'Rain hit the glass. The numbers were bad, and everybody in the room knew it.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-md apple-glass rounded-3xl p-5 border border-[var(--border-subtle)] flex flex-col space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">NARRATIVE VOICE PERSONA</h3>
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

        <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-1">
          {voices.map((v) => {
            const isSelected = activeVoice === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  playTactileFeedback('pop');
                  onSelectVoice(v.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-start justify-between shadow-sm ${
                  isSelected
                    ? 'bg-[var(--bg-card)] border-[var(--border-specular)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-pill-hover)]'
                }`}
              >
                <div className="space-y-1 pr-2 text-break-boundary">
                  <div className="font-semibold text-xs flex items-center space-x-1.5">
                    <span className="text-[var(--text-primary)]">{v.name}</span>
                    {isSelected && <span className="text-[10px] font-mono text-emerald-500 font-bold">ACTIVE</span>}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{v.desc}</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] italic mt-1">&quot;{v.sample}&quot;</p>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
