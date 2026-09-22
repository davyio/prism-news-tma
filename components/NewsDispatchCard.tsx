'use client';

import React, { useState } from 'react';
import { NewsItem, SpectrumPOV, RefractedPerspective } from '@/lib/news/types';
import { POV_DEFINITIONS } from '@/lib/ai/prompts';
import { generateHeuristicPerspective } from '@/lib/ai/heuristic-refractor';
import { ExternalLink, Share2, Volume2, Lock, ChevronDown, ChevronUp, Eye, Zap } from 'lucide-react';
import { triggerHaptic, playTactileFeedback } from '@/lib/telegram/haptics';

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
  const [isDeepRefracting, setIsDeepRefracting] = useState(false);
  const [customPerspective, setCustomPerspective] = useState<RefractedPerspective | null>(null);

  // Generate baseline perspective on the fly, overridden if deep refracted
  const defaultPerspective = generateHeuristicPerspective(news, activePov, currentVoice, currentLang);
  const perspective = customPerspective || defaultPerspective;
  const povMeta = POV_DEFINITIONS[activePov];

  const handleDeepRefract = async () => {
    triggerHaptic('medium');
    setIsDeepRefracting(true);
    try {
      const res = await fetch('/api/news/refract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          news,
          pov: activePov,
          voice: currentVoice,
          language: currentLang,
        })
      });
      const data = await res.json();
      if (data.success && data.perspective) {
        setCustomPerspective(data.perspective);
      }
    } catch (err) {
      console.warn('[NewsDispatchCard] Deep refract fallback:', err);
    } finally {
      setIsDeepRefracting(false);
    }
  };

  const handleAudioPreview = () => {
    playTactileFeedback('pop');
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  // Redacted dossier lock
  if (news.isRedactedDossier && !isSubscribed) {
    return (
      <div className="w-full apple-card rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden text-break-boundary">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-mono text-[10px] tracking-wider uppercase">
            RESTRICTED DOSSIER
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">{news.pubDate}</span>
        </div>

        <h3 className="font-medium text-sm text-[var(--text-primary)] line-clamp-1 mb-2 text-break-boundary">
          {news.title}
        </h3>

        {/* Redacted Bar Overlay */}
        <div className="space-y-1.5 my-3 select-none">
          <div className="h-3 bg-neutral-300 dark:bg-neutral-800 rounded w-full filter blur-[2px] opacity-70" />
          <div className="h-3 bg-neutral-300 dark:bg-neutral-800 rounded w-5/6 filter blur-[2px] opacity-70" />
          <div className="h-3 bg-neutral-300 dark:bg-neutral-800 rounded w-3/4 filter blur-[2px] opacity-70" />
        </div>

        <button
          onClick={() => {
            playTactileFeedback('warning');
            onOpenRedactedDossier(news);
          }}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 flex items-center justify-center space-x-2 text-xs text-amber-600 dark:text-amber-300 font-medium transition-all shadow-sm"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Unlock Investigation (Watch 15s Ad or VIP)</span>
        </button>
      </div>
    );
  }

  return (
    <article className="w-full apple-card rounded-2xl p-4 border transition-all flex flex-col space-y-3 relative overflow-hidden text-break-boundary max-w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium text-[10px]">
            {news.sourceName}
          </span>
          <span>•</span>
          <span>{news.pubDate}</span>
        </div>

        {/* Velocity Index */}
        <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          <Zap className="w-3 h-3" />
          <span className="tabular-nums font-semibold">{news.velocityScore} VEL</span>
        </div>
      </div>

      {/* Dynamic Refracted Headline */}
      <h3 className="font-semibold text-base tracking-tight text-[var(--text-primary)] leading-snug text-break-boundary">
        {perspective.headline}
      </h3>

      {/* Quick-Skim Summary */}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans text-break-boundary">
        {perspective.summary}
      </p>

      {/* 3 Bullet Key Takeaways */}
      <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2 text-break-boundary">
        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
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
            <li key={idx} className="flex items-start space-x-2 text-xs text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)] font-mono text-[10px] mt-0.5">0{idx + 1}</span>
              <span className="leading-snug text-break-boundary">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible Bull / Bear Detail */}
      {isExpanded && (
        <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-[var(--border-subtle)]">
          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-break-boundary">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
              BULL THESIS:
            </span>
            <span className="text-[var(--text-secondary)] leading-tight block text-break-boundary">
              {perspective.bullCase || 'Asymmetric upside momentum compounding.'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-break-boundary">
            <span className="text-rose-600 dark:text-rose-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
              BEAR RISK:
            </span>
            <span className="text-[var(--text-secondary)] leading-tight block text-break-boundary">
              {perspective.bearCase || 'Multiple compression and regulatory drag.'}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)] text-xs">
        <div className="flex items-center space-x-2">
          {/* Audio read-aloud button */}
          <button
            onClick={handleAudioPreview}
            className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
              isPlayingAudio
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-600 dark:text-violet-300 animate-pulse'
                : 'bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              playTactileFeedback('pop');
              onOpenStoryShare(news, perspective);
            }}
            className="p-1.5 rounded-lg bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center space-x-1"
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
            onClick={() => playTactileFeedback('tap')}
            className="p-1.5 rounded-lg bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">SOURCE</span>
          </a>

          {/* Live AI Deep Refract Trigger */}
          <button
            onClick={handleDeepRefract}
            disabled={isDeepRefracting}
            className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
              customPerspective
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                : isDeepRefracting
                ? 'bg-[var(--bg-pill-hover)] border-[var(--border-specular)] text-[var(--text-primary)] animate-pulse'
                : 'bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Live AI Refract"
          >
            <Zap className={`w-3.5 h-3.5 ${isDeepRefracting ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-mono">
              {isDeepRefracting ? 'REFRACTING...' : customPerspective ? 'AI SYNTH' : 'AI'}
            </span>
          </button>
        </div>

        {/* Expand / Collapse toggle */}
        <button
          onClick={() => {
            playTactileFeedback('tap');
            setIsExpanded(!isExpanded);
          }}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-mono text-[11px] flex items-center space-x-1 transition-colors"
        >
          <span>{isExpanded ? 'LESS' : 'DETAILS'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
    </article>
  );
};
