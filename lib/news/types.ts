export type SpectrumPOV = 
  | 'OPTIMIST'    // Silicon Valley Tech Accelerationist
  | 'CYNIC'       // Wall Street Short-Seller & Bear
  | 'DEGEN'       // Crypto Maximalist & Speculator
  | 'REALIST'     // Geopolitical Statecraft & Hard Realism
  | 'TABLOID'     // BuzzFeed / Viral Sensationalist
  | 'FACT';       // Radical Truth / Zero-Adjective Fact Check

export type VoiceTone = 
  | 'EXECUTIVE'   // Concise C-suite memo
  | 'GENZ'        // Slang, brainrot, high-velocity meme terms
  | 'ACADEMIC'    // Formal scholarly treatise
  | 'NOIR';       // Raymond Chandler / Hemingway staccato

export type GlobalLanguage = 
  | 'en' // English
  | 'es' // Spanish (Español)
  | 'fr' // French (Français)
  | 'zh' // Mandarin (中文)
  | 'ru' // Russian (Русский)
  | 'ar' // Arabic (العربية)
  | 'ja' // Japanese (日本語)
  | 'de'; // German (Deutsch)

export interface NewsItem {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  category: 'TECH' | 'MARKETS' | 'MACRO' | 'CRYPTO';
  pubDate: string;
  isoTimestamp: number;
  originalSnippet: string;
  imageUrl?: string;
  velocityScore: number; // 0 - 100 trending index
  engagement: {
    impressions: string;
    reads: number;
    shares: number;
  };
  isRedactedDossier?: boolean; // Requires AdsGram or Stars unlock
}

export interface RefractedPerspective {
  pov: SpectrumPOV;
  label: string;
  tagline: string;
  badgeColor: string;
  headline: string;
  summary: string;
  keyTakeaways: string[];
  bullCase?: string;
  bearCase?: string;
  sentimentScore: number; // -100 to +100
}

export interface RefractedStory {
  newsId: string;
  originalTitle: string;
  language: GlobalLanguage;
  voice: VoiceTone;
  activePov: SpectrumPOV;
  perspectives: Record<SpectrumPOV, RefractedPerspective>;
}
