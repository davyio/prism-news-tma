'use client';

import React, { useState } from 'react';
import { NewsItem, SpectrumPOV, RefractedPerspective } from '@/lib/news/types';
import { POV_DEFINITIONS } from '@/lib/ai/prompts';
import { generateHeuristicPerspective } from '@/lib/ai/heuristic-refractor';
import { ExternalLink, Share2, Volume2, Lock, ChevronDown, ChevronUp, Eye, Zap } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram/haptics';

interface NewsDispatchCardProps {
  news: NewsItem;
  activePov: SpectrumPOV;
  currentVoice: any;
  currentLang: any;
  isSubscribed: boolean;
  onOpenRedactedDossier: (news: NewsItem) => void;
  onOpenStoryShare: (news: NewsItem, perspective: RefractedPerspective) => void;
}

export const NewsDispatchCard: React.FC<NewsDispatchCardProps> = ({
  news,
  activePov,
  currentVoice,
  currentLang,
  isSubscribed,
  onOpenRedactedDossier,
  onOpenStoryShare,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Generate perspective on the fly
  const perspective = generateHeuristicPerspective(news, activePov, currentVoice, currentLang);
  const povMeta = POV_DEFINITIONS[activePov];

  const handleAudioPreview = () => {
    triggerHaptic('medium');
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  // Redacted dossier lock
  if (news.isRedactedDossier && !isSubscribed) {
    return (
      <div className="w-full apple-card rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-neutral-950/40 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] tracking-wider uppercase">
            RESTRICTED DOSSIER
          </span>
          <span className="text-[11px] font-mono text-neutral-500">{news.pubDate}</span>
        </div>

        <h3 className="font-medium text-sm text-neutral-200 line-clamp-1 mb-2">
          {news.title}
        </h3>

        {/* Redacted Bar Overlay */}
        <div className="space-y-1.5 my-3 select-none">
          <div className="h-3 bg-neutral-800/80 rounded w-full filter blur-[2px]" />
          <div className="h-3 bg-neutral-800/80 rounded w-5/6 filter blur-[2px]" />
          <div className="h-3 bg-neutral-800/80 rounded w-3/4 filter blur-[2px]" />
        </div>

        <button
          onClick={() => {
            triggerHaptic('heavy');
            onOpenRedactedDossier(news);
          }}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 flex items-center justify-center space-x-2 text-xs text-amber-300 font-medium transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Unlock Investigation (Watch 15s Ad or VIP)</span>
        </button>
      </div>
    );
  }

  return (
    <article className="w-full apple-card rounded-2xl p-4 border border-white/[0.06] hover:border-white/20 transition-all flex flex-col space-y-3 relative">
      {/* Header Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white font-medium text-[10px]">
            {news.sourceName}
          </span>
          <span className="text-neutral-500">•</span>
          <span>{news.pubDate}</span>
        </div>

        {/* Velocity Index */}
        <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20">
          <Zap className="w-3 h-3" />
          <span>{news.velocityScore} VEL</span>
        </div>
      </div>

      {/* Dynamic Refracted Headline */}
      <h3 className="font-semibold text-base tracking-tight text-white leading-snug">
        {perspective.headline}
      </h3>

      {/* Quick-Skim Summary */}
      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
        {perspective.summary}
      </p>

      {/* 3 Bullet Key Takeaways */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span>SPECTRUM TAKEAWAYS ({perspective.label}):</span>
          <span
            className="text-[10px] font-mono font-medium"
            style={{ color: perspective.badgeColor }}
          >
            {perspective.sentimentScore > 0 ? `+${perspective.sentimentScore}` : perspective.sentimentScore} SENTIMENT
          </span>
        </div>

        <ul className="space-y-1.5">
          {perspective.keyTakeaways.map((bullet, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-xs text-neutral-200">
              <span className="text-neutral-500 text-[10px] mt-0.5">0{idx + 1}</span>
              <span className="leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible Bull / Bear Detail */}
      {isExpanded && (
        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-white/[0.06]">
          <div className="p-2.5 rounded-lg bg-emerald-950/10 border border-emerald-500/20">
            <span className="text-emerald-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
              BULL THESIS:
            </span>
            <span className="text-neutral-300 leading-tight block">
              {perspective.bullCase || 'Asymmetric upside momentum compounding.'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-950/10 border border-rose-500/20">
            <span className="text-rose-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
              BEAR RISK:
            </span>
            <span className="text-neutral-300 leading-tight block">
              {perspective.bearCase || 'Multiple compression and regulatory drag.'}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="pt-2 flex items-center justify-between border-t border-white/[0.04] text-xs">
        <div className="flex items-center space-x-2">
          {/* Audio read-aloud button */}
          <button
            onClick={handleAudioPreview}
            className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
              isPlayingAudio
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 animate-pulse'
                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-neutral-400 hover:text-white'
            }`}
            title="Listen to dispatch"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">
              {isPlayingAudio ? 'VOICE AI...' : 'AUDIO'}
            </span>
          </button>

          {/* Share Story Card */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenStoryShare(news, perspective);
            }}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-neutral-400 hover:text-white transition-all flex items-center space-x-1"
            title="Create Story Card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">STORY</span>
          </button>

          {/* Original Source Link */}
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-neutral-400 hover:text-white transition-all flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">SOURCE</span>
          </a>
        </div>

        {/* Expand / Collapse toggle */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsExpanded(!isExpanded);
          }}
          className="text-neutral-400 hover:text-white font-mono text-[11px] flex items-center space-x-1 transition-colors"
        >
          <span>{isExpanded ? 'LESS' : 'DETAILS'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
    </article>
  );
};
