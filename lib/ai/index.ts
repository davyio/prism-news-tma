import { SpectrumPOV, VoiceTone, GlobalLanguage, RefractedPerspective, RefractedStory, NewsItem } from '../news/types';
import { refractNewsWithGemini } from './gemini-refractor';
import { generateAllHeuristicPerspectives } from './heuristic-refractor';

/**
 * High-performance multi-spectrum refractor interface
 */
export async function refractSinglePerspective(
  news: NewsItem,
  pov: SpectrumPOV,
  voice: VoiceTone = 'EXECUTIVE',
  lang: GlobalLanguage = 'en'
): Promise<RefractedPerspective> {
  return refractNewsWithGemini(news, pov, voice, lang);
}

export async function refractFullSpectrumStory(
  news: NewsItem,
  voice: VoiceTone = 'EXECUTIVE',
  lang: GlobalLanguage = 'en'
): Promise<RefractedStory> {
  const povs: SpectrumPOV[] = ['OPTIMIST', 'CYNIC', 'DEGEN', 'REALIST', 'TABLOID', 'FACT'];
  const results = await Promise.all(
    povs.map(p => refractNewsWithGemini(news, p, voice, lang))
  );

  const perspectives = {} as Record<SpectrumPOV, RefractedPerspective>;
  results.forEach(r => {
    perspectives[r.pov] = r;
  });

  return {
    newsId: news.id,
    originalTitle: news.title,
    language: lang,
    voice,
    activePov: 'FACT',
    perspectives,
  };
}

export { generateAllHeuristicPerspectives };
