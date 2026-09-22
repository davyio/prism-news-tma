import { NextResponse } from 'next/server';
import { refractSinglePerspective, refractFullSpectrumStory } from '@/lib/ai/index';
import { SpectrumPOV, VoiceTone, GlobalLanguage, NewsItem } from '@/lib/news/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { news, pov, voice, language, fullSpectrum } = body as {
      news: NewsItem;
      pov?: SpectrumPOV;
      voice?: VoiceTone;
      language?: GlobalLanguage;
      fullSpectrum?: boolean;
    };

    if (!news || !news.title) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: news item is required' },
        { status: 400 }
      );
    }

    const targetVoice: VoiceTone = voice || 'EXECUTIVE';
    const targetLang: GlobalLanguage = language || 'en';

    if (fullSpectrum) {
      const story = await refractFullSpectrumStory(news, targetVoice, targetLang);
      return NextResponse.json({
        success: true,
        story,
      });
    }

    const targetPov: SpectrumPOV = pov || 'FACT';
    const perspective = await refractSinglePerspective(news, targetPov, targetVoice, targetLang);

    return NextResponse.json({
      success: true,
      perspective,
    });
  } catch (error) {
    console.error('[API:news/refract] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute news refraction' },
      { status: 500 }
    );
  }
}
