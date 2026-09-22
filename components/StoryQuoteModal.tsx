'use client';

import React, { useState } from 'react';
import { X, Send, Copy, Check } from 'lucide-react';
import { NewsItem, RefractedPerspective } from '@/lib/news/types';
import { getTelegramWebApp } from '@/lib/telegram/webapp-sdk';
import { triggerHaptic, triggerHapticNotification, playTactileFeedback } from '@/lib/telegram/haptics';

interface StoryQuoteModalProps {
  news: NewsItem | null;
  perspective: RefractedPerspective | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryQuoteModal: React.FC<StoryQuoteModalProps> = ({
  news,
  perspective,
  isOpen,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !news || !perspective) return null;

  const quoteText = `"${perspective.headline}"\n\n— PRISM News [${perspective.label}]\n${perspective.keyTakeaways[0] || ''}\n\nhttps://t.me/PrismNewsAppBot`;

  const handleShareStory = () => {
    playTactileFeedback('chime');
    const tg = getTelegramWebApp();

    if (tg && typeof tg.shareToStory === 'function') {
      tg.shareToStory('https://prism-news-tma.vercel.app/icons/prism-monolith.png', {
        text: perspective.headline,
        widget_link: {
          url: 'https://t.me/PrismNewsAppBot',
          name: 'PRISM News',
        }
      });
    } else if (tg && typeof tg.openTelegramLink === 'function') {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/PrismNewsAppBot')}&text=${encodeURIComponent(quoteText)}`;
      tg.openTelegramLink(shareUrl);
    } else {
      navigator.clipboard.writeText(quoteText);
      setIsCopied(true);
      triggerHapticNotification('success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-sm apple-glass rounded-3xl p-5 border border-[var(--border-subtle)] flex flex-col space-y-4 shadow-2xl relative text-break-boundary">
        <button
          onClick={() => {
            playTactileFeedback('tap');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[var(--bg-pill)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-1">
          <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
            STORY SPECIMEN CARD
          </span>
          <h3 className="font-semibold text-sm text-[var(--text-primary)] tracking-tight">Export to Telegram Stories</h3>
        </div>

        {/* Visual Card Mockup */}
        <div className="w-full rounded-2xl p-5 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-white/15 shadow-xl space-y-3 relative overflow-hidden text-break-boundary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded-md bg-white text-black font-bold font-mono text-[9px] flex items-center justify-center">
                P
              </div>
              <span className="font-mono text-[10px] text-white font-semibold tracking-wider">PRISM INTELLIGENCE</span>
            </div>
            <span
              className="px-1.5 py-0.5 rounded font-mono text-[9px] font-medium"
              style={{ color: perspective.badgeColor, backgroundColor: `${perspective.badgeColor}20` }}
            >
              {perspective.label}
            </span>
          </div>

          <p className="font-bold text-sm text-white leading-snug font-sans text-break-boundary">
            &quot;{perspective.headline}&quot;
          </p>

          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed border-l-2 border-white/20 pl-2.5 my-2 text-break-boundary">
            {perspective.keyTakeaways[0]}
          </p>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between font-mono text-[9px] text-neutral-500">
            <span>VERIFIED DISPATCH</span>
            <span>t.me/PrismNewsAppBot</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleShareStory}
            className="w-full py-2.5 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-xs flex items-center justify-center space-x-2 shadow-md hover:opacity-90 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SHARE TO TELEGRAM STORY</span>
          </button>

          <button
            onClick={() => {
              playTactileFeedback('tap');
              navigator.clipboard.writeText(quoteText);
              setIsCopied(true);
              triggerHapticNotification('success');
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[var(--bg-pill)] hover:bg-[var(--bg-pill-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-[11px] flex items-center justify-center space-x-1.5 transition-all"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'COPIED TO CLIPBOARD' : 'COPY DISPATCH TEXT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
