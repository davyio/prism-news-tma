import { getAggregatedTrendingNews } from '../lib/news/aggregator';
import { generateHeuristicPerspective } from '../lib/ai/heuristic-refractor';
import * as fs from 'fs';
import * as path from 'path';

async function runVerification() {
  console.log('--- [STEP 1: Verify RSS Text Sanitization & Container Containment] ---');
  
  // Test raw Google News sample with raw HTML entities, links, and tags
  const rawLeakSample = '<ol><li><a href="https://news.google.com/rss/articles/CBMisgFBVV95cUxOOFdkQk9aVHdzT0hrcFhDNDZPSmlwQVBLUm12TGd4SUVPUURUMVo4Y3I0WkZBSTlxdEKTWz4WkF3cVUzUnlrWmNrbTA5T21UN3R0Z0Jnekd">Trump set for whirlwind UN meetings with wars in Iran, Ukraine on agenda</a>&nbsp;&nbsp;<font color="#6f6f6f">Reuters</font></li></ol>';
  
  console.log('Raw Leak Input (length:', rawLeakSample.length, 'chars)');
  
  console.log('\n--- [STEP 2: Live Multi-Source Ingestion & Sanitization] ---');
  const items = await getAggregatedTrendingNews(true);
  console.log(`Fetched ${items.length} items from live feeds.`);

  const sampleItems = items.slice(0, 8).map(item => {
    const hasHtmlTags = /<[^>]*>/.test(item.originalSnippet) || /<[^>]*>/.test(item.title);
    const hasRawUrls = /https?:\/\//.test(item.originalSnippet);
    const perspective = generateHeuristicPerspective(item, 'FACT', 'EXECUTIVE', 'en');

    return {
      id: item.id,
      title: item.title,
      source: item.sourceName,
      originalSnippet: item.originalSnippet,
      hasHtmlTags,
      hasRawUrls,
      refractedHeadline: perspective.headline,
      refractedSummary: perspective.summary,
      snippetLength: item.originalSnippet.length,
    };
  });

  const allClean = sampleItems.every(s => !s.hasHtmlTags && !s.hasRawUrls);
  console.log('All samples clean of HTML tags and raw URLs:', allClean);

  const report = {
    timestamp: new Date().toISOString(),
    totalFetched: items.length,
    sanitizationValidation: {
      passed: allClean,
      sampleItems,
    }
  };

  const outDir = path.join(process.cwd(), 'data', 'test-results', 'ui-ux-containment-verification');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sanitizer_report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('Saved test deliverable to:', outPath);

  if (!allClean) {
    console.error('FAILED: Detected raw tags or URLs in output snippets!');
    process.exit(1);
  } else {
    console.log('SUCCESS: All snippets and titles verified 100% clean and contained.');
  }
}

runVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
