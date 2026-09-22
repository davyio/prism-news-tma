'use client';

import React from 'react';
import { X, Check, Volume2 } from 'lucide-react';
import { VoiceTone } from '@/lib/news/types';
import { VOICE_PROMPTS } from '@/lib/ai/prompts';
import { triggerHaptic } from '@/lib/telegram/haptics';

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div className="w-full max-w-md apple-glass rounded-3xl p-5 border border-white/10 flex flex-col space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-white">NARRATIVE VOICE PERSONA</h3>
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

        <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-1">
          {voices.map((v) => {
            const isSelected = activeVoice === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectVoice(v.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-white/[0.02] border-white/[0.04] text-neutral-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className="space-y-1 pr-2">
                  <div className="font-semibold text-xs flex items-center space-x-1.5">
                    <span>{v.name}</span>
                    {isSelected && <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{v.desc}</p>
                  <p className="text-[10px] font-mono text-neutral-500 italic mt-1">&quot;{v.sample}&quot;</p>
                </div>

                {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
