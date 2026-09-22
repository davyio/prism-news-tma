'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PrismHeader } from '@/components/PrismHeader';
import { VelocityTicker } from '@/components/VelocityTicker';
import { PovRefractorBar } from '@/components/PovRefractorBar';
import { NewsDispatchCard } from '@/components/NewsDispatchCard';
import { SponsoredCapsuleCard } from '@/components/SponsoredCapsuleCard';
import { ToneVoiceModal } from '@/components/ToneVoiceModal';
import { LanguageSelector } from '@/components/LanguageSelector';
import { StarsSubscriptionModal } from '@/components/StarsSubscriptionModal';
import { RewardedLeakGate } from '@/components/RewardedLeakGate';
import { StoryQuoteModal } from '@/components/StoryQuoteModal';
import { NewsItem, SpectrumPOV, VoiceTone, GlobalLanguage, RefractedPerspective } from '@/lib/news/types';
import { getTelegramWebApp } from '@/lib/telegram/webapp-sdk';
import { triggerHaptic } from '@/lib/telegram/haptics';

export default function Home() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activePov, setActivePov] = useState<SpectrumPOV>('FACT');
  const [activeVoice, setActiveVoice] = useState<VoiceTone>('EXECUTIVE');
  const [activeLanguage, setActiveLanguage] = useState<GlobalLanguage>('en');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Unlocked dossiers set
  const [unlockedDossierIds, setUnlockedDossierIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedRedactedNews, setSelectedRedactedNews] = useState<NewsItem | null>(null);
  const [isRedactedModalOpen, setIsRedactedModalOpen] = useState(false);
  const [selectedStoryNews, setSelectedStoryNews] = useState<NewsItem | null>(null);
  const [selectedStoryPerspective, setSelectedStoryPerspective] = useState<RefractedPerspective | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
    }

    // Load persisted subscription state
    if (typeof window !== 'undefined') {
      const savedSub = localStorage.getItem('prism_is_vip');
      if (savedSub === 'true') {
        setIsSubscribed(true);
      }
      const savedUnlocked = localStorage.getItem('prism_unlocked_dossiers');
      if (savedUnlocked) {
        try {
          setUnlockedDossierIds(new Set(JSON.parse(savedUnlocked)));
        } catch {
          // ignore
        }
      }
    }

    fetchNews();
  }, []);

  const fetchNews = async (force = false) => {
    if (force) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/news/trending${force ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setNewsList(data.items);
      }
    } catch (err) {
      console.error('[FetchNews] Error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSubscribeSuccess = () => {
    setIsSubscribed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('prism_is_vip', 'true');
    }
  };

  const handleDossierUnlocked = (newsId: string) => {
    setUnlockedDossierIds((prev) => {
      const updated = new Set(prev);
      updated.add(newsId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prism_unlocked_dossiers', JSON.stringify(Array.from(updated)));
      }
      return updated;
    });
  };

  // Filtered news items
  const filteredNews = useMemo(() => {
    if (activeCategory === 'ALL') return newsList;
    return newsList.filter((item) => item.category === activeCategory);
  }, [newsList, activeCategory]);

  return (
    <main className="flex-1 flex flex-col w-full bg-[#050508]">
      {/* Header */}
      <PrismHeader
        isSubscribed={isSubscribed}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenLang={() => setIsLangModalOpen(true)}
        currentLang={activeLanguage}
        currentVoice={activeVoice}
      />

      {/* Breaking Velocity Ticker */}
      <VelocityTicker
        totalStories={newsList.length}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onRefresh={() => fetchNews(true)}
        isRefreshing={isRefreshing}
      />

      {/* Refractive POV Bar */}
      <PovRefractorBar
        activePov={activePov}
        onSelectPov={setActivePov}
      />

      {/* Dispatches Feed */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="font-mono text-xs text-neutral-400">REFRACTING LIVE INTELLIGENCE...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 font-mono text-xs">
            NO DISPATCHES MATCH CATEGORY FILTER
          </div>
        ) : (
          filteredNews.map((news, index) => {
            const isUnlocked = isSubscribed || unlockedDossierIds.has(news.id);
            const displayNews: NewsItem = {
              ...news,
              isRedactedDossier: news.isRedactedDossier && !isUnlocked,
            };

            return (
              <React.Fragment key={news.id}>
                <NewsDispatchCard
                  news={displayNews}
                  activePov={activePov}
                  currentVoice={activeVoice}
                  currentLang={activeLanguage}
                  isSubscribed={isSubscribed}
                  onOpenRedactedDossier={(target) => {
                    setSelectedRedactedNews(target);
                    setIsRedactedModalOpen(true);
                  }}
                  onOpenStoryShare={(target, perspective) => {
                    setSelectedStoryNews(target);
                    setSelectedStoryPerspective(perspective);
                    setIsStoryModalOpen(true);
                  }}
                />

                {/* Periodic Curated Native Sponsored Capsule (Every 4 items) */}
                {index === 2 && !isSubscribed && (
                  <SponsoredCapsuleCard />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ToneVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        activeVoice={activeVoice}
        onSelectVoice={setActiveVoice}
      />

      <LanguageSelector
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        activeLanguage={activeLanguage}
        onSelectLanguage={setActiveLanguage}
      />

      <StarsSubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSubscribedSuccess={handleSubscribeSuccess}
      />

      <RewardedLeakGate
        news={selectedRedactedNews}
        isOpen={isRedactedModalOpen}
        onClose={() => setIsRedactedModalOpen(false)}
        onUnlocked={handleDossierUnlocked}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
      />

      <StoryQuoteModal
        news={selectedStoryNews}
        perspective={selectedStoryPerspective}
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </main>
  );
}
