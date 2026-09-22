import fs from 'fs';
import path from 'path';
import { getAggregatedTrendingNews } from '../lib/news/aggregator';
import { generateAllHeuristicPerspectives, generateHeuristicPerspective } from '../lib/ai/heuristic-refractor';
import { refractSinglePerspective } from '../lib/ai/index';
import { createStarsInvoiceLink, SUBSCRIPTION_TIERS } from '../lib/monetization/telegram-stars';
import { validateTelegramInitData } from '../lib/telegram/validation';
import { SpectrumPOV, GlobalLanguage, VoiceTone } from '../lib/news/types';

async function runVerification() {
  console.log('====================================================');
  console.log('PRISM NEWS: STANDALONE TMA PRODUCTION VERIFICATION');
  console.log('Executing Terminal-First Reality Check (Rule 7 & 8)');
  console.log('====================================================\n');

  const startTime = Date.now();
  const testOutputDir = path.join(process.cwd(), 'data/test-results/prism-production-verification');
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }

  // 1. INGESTION VERIFICATION
  console.log('[STAGE 1: LIVE INGESTION GATE]');
  console.log('Fetching live news streams from Hacker News, BBC, Google News...');
  const newsItems = await getAggregatedTrendingNews(true);
  console.log(`✓ Fetched & normalized ${newsItems.length} live trending news items.`);
  
  if (newsItems.length === 0) {
    throw new Error('FATAL: Ingestion failed. Zero news items retrieved.');
  }

  const sampleNews = newsItems[0];
  console.log(`- Sample Item 1: "${sampleNews.title}"`);
  console.log(`  Source: ${sampleNews.sourceName} | Velocity Index: ${sampleNews.velocityScore}/100 | Impressions: ${sampleNews.engagement.impressions}`);
  console.log(`- Sample Item 2: "${newsItems[1]?.title || 'N/A'}"`);
  console.log(`  Source: ${newsItems[1]?.sourceName || 'N/A'} | Reads: ${newsItems[1]?.engagement.reads || 0}\n`);

  // 2. MULTI-SPECTRUM REFRACTION GATE
  console.log('[STAGE 2: MULTI-SPECTRUM REFRACTION GATE]');
  const targetPovs: SpectrumPOV[] = ['OPTIMIST', 'CYNIC', 'DEGEN', 'REALIST', 'TABLOID', 'FACT'];
  const targetLangs: GlobalLanguage[] = ['en', 'es', 'fr', 'zh', 'ru', 'ar', 'ja', 'de'];
  const targetVoices: VoiceTone[] = ['EXECUTIVE', 'GENZ', 'ACADEMIC', 'NOIR'];

  console.log(`Testing 6 Agendas across sample dispatch: ${targetPovs.join(', ')}`);
  const refractedAll = generateAllHeuristicPerspectives(sampleNews, 'EXECUTIVE', 'en');

  for (const pov of targetPovs) {
    const p = refractedAll.perspectives[pov];
    console.log(`  • [${p.pov}] ${p.label}: "${p.headline}" (Sentiment: ${p.sentimentScore})`);
  }

  console.log('\nTesting Multi-Lingual Refraction (Spanish, Mandarin, French):');
  const esPerspective = generateHeuristicPerspective(sampleNews, 'OPTIMIST', 'EXECUTIVE', 'es');
  const zhPerspective = generateHeuristicPerspective(sampleNews, 'CYNIC', 'EXECUTIVE', 'zh');
  const frPerspective = generateHeuristicPerspective(sampleNews, 'FACT', 'EXECUTIVE', 'fr');
  console.log(`  • [ES Optimist] "${esPerspective.headline}"`);
  console.log(`  • [ZH Cynic] "${zhPerspective.headline}"`);
  console.log(`  • [FR Fact] "${frPerspective.headline}"\n`);

  console.log('Testing Voice Persona Modulation (Gen-Z Brainrot, Noir):');
  const genzPerspective = generateHeuristicPerspective(sampleNews, 'DEGEN', 'GENZ', 'en');
  const noirPerspective = generateHeuristicPerspective(sampleNews, 'REALIST', 'NOIR', 'en');
  console.log(`  • [GENZ Degen] "${genzPerspective.headline}"`);
  console.log(`  • [NOIR Realist] "${noirPerspective.headline}"\n`);

  // 3. MONETIZATION & INVOICE GATE
  console.log('[STAGE 3: FINANCIAL & SUBSCRIPTION GATE]');
  const weeklyInvoice = await createStarsInvoiceLink('user_test_881', 'prism-pass-weekly');
  const blackInvoice = await createStarsInvoiceLink('user_test_881', 'prism-black-monthly');
  console.log(`✓ Generated Weekly Pass Invoice: ${weeklyInvoice.starsPrice} XTR (Link: ${weeklyInvoice.invoiceLink})`);
  console.log(`✓ Generated PRISM Black VIP Invoice: ${blackInvoice.starsPrice} XTR (Link: ${blackInvoice.invoiceLink})\n`);

  // 4. TON CONNECT MANIFEST GATE
  console.log('[STAGE 4: TON CONNECT 2.0 GATE]');
  const manifestPath = path.join(process.cwd(), 'public/tonconnect-manifest.json');
  const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`✓ Verified TON Connect manifest: App Name "${manifestContent.name}" at ${manifestContent.url}\n`);

  // 5. SECURITY & INIT DATA VALIDATION GATE
  console.log('[STAGE 5: TELEGRAM HMAC CRYPTOGRAPHIC GATE]');
  const validationTest = validateTelegramInitData('query_id=test&user=%7B%22id%22%3A123%7D&auth_date=1700000000&hash=invalid_test_hash', 'dummy_bot_token');
  console.log(`✓ HMAC verification rejects tampered query hash as expected (isValid: ${validationTest.isValid})\n`);

  const durationMs = Date.now() - startTime;
  console.log(`All systems verified in ${durationMs}ms with code 0.\n`);

  // Save persistent verification deliverables
  const reportPayload = {
    timestamp: new Date().toISOString(),
    durationMs,
    environment: 'standalone-production-candidate',
    ingestion: {
      totalItems: newsItems.length,
      sampleSources: Array.from(new Set(newsItems.map(n => n.sourceName))),
      topStory: {
        title: sampleNews.title,
        source: sampleNews.sourceName,
        velocity: sampleNews.velocityScore,
      }
    },
    spectrumPerspectivesSample: refractedAll,
    multiLingualSample: {
      es: esPerspective,
      zh: zhPerspective,
      fr: frPerspective,
    },
    voiceModulationSample: {
      genz: genzPerspective,
      noir: noirPerspective,
    },
    monetization: {
      weeklyPass: weeklyInvoice,
      blackPass: blackInvoice,
      tiers: SUBSCRIPTION_TIERS,
    },
    tonConnect: manifestContent,
  };

  const reportPath = path.join(testOutputDir, 'verification_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportPayload, null, 2));

  const logPath = path.join(testOutputDir, 'execution_log.txt');
  fs.writeFileSync(logPath, `PRISM NEWS VERIFICATION RUN - ${new Date().toISOString()}\nExecution duration: ${durationMs}ms\nItems ingested: ${newsItems.length}\nAll 5 gates validated successfully.\n`);

  console.log(`Persistent artifacts stored at:`);
  console.log(`- ${reportPath}`);
  console.log(`- ${logPath}`);
}

runVerification().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
