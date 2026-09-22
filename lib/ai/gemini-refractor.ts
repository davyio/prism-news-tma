import { SpectrumPOV, VoiceTone, GlobalLanguage, RefractedPerspective, NewsItem } from '../news/types';
import { buildSystemPrompt, POV_DEFINITIONS } from './prompts';
import { generateHeuristicPerspective } from './heuristic-refractor';

/**
 * Refracts a news item using Gemini 3.8 Flash via @google/genai SDK.
 * Dynamically imports @google/genai to remain resilient and automatically falls back
 * to the deterministic heuristic refractor if GEMINI_API_KEY is unset, if the SDK is unavailable,
 * or on any network/rate-limit error.
 */
export async function refractNewsWithGemini(
  news: NewsItem,
  pov: SpectrumPOV,
  voice: VoiceTone = 'EXECUTIVE',
  lang: GlobalLanguage = 'en'
): Promise<RefractedPerspective> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    // Zero-config heuristic fallback
    return generateHeuristicPerspective(news, pov, voice, lang);
  }

  try {
    // Dynamic import with webpackIgnore to prevent bundler errors if package is absent
    const packageName = '@google/genai';
    const genaiMod = await import(/* webpackIgnore: true */ packageName).catch(() => null);
    if (!genaiMod || !genaiMod.GoogleGenAI) {
      return generateHeuristicPerspective(news, pov, voice, lang);
    }

    const ai = new genaiMod.GoogleGenAI({ apiKey });
    const systemInstruction = buildSystemPrompt(pov, voice, lang);
    const userPrompt = `ORIGINAL DISPATCH:
Headline: ${news.title}
Source: ${news.sourceName} (${news.sourceUrl})
Published: ${news.pubDate}
Snippet: ${news.originalSnippet}

Refract this dispatch now according to your system instructions.`;

    const interaction = await ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: `${systemInstruction}\n\n${userPrompt}`,
    });

    const outputText = interaction.output_text || '';
    
    // Parse JSON safely
    const cleanJson = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const meta = POV_DEFINITIONS[pov];

    return {
      pov,
      label: meta.label,
      tagline: meta.tagline,
      badgeColor: meta.badgeColor,
      headline: parsed.headline || news.title,
      summary: parsed.summary || news.originalSnippet,
      keyTakeaways: Array.isArray(parsed.keyTakeaways) && parsed.keyTakeaways.length > 0 ? parsed.keyTakeaways.slice(0, 3) : [
        'High-velocity structural market realignments underway.',
        'Asymmetric variance across operational benchmarks.',
        'Primary documentation registered with official verification stamp.'
      ],
      bullCase: parsed.bullCase,
      bearCase: parsed.bearCase,
      sentimentScore: typeof parsed.sentimentScore === 'number' ? parsed.sentimentScore : 0,
    };
  } catch (err) {
    console.warn(`[GeminiRefractor] Fallback triggered:`, err instanceof Error ? err.message : err);
    return generateHeuristicPerspective(news, pov, voice, lang);
  }
}
