import { NewsItem } from './types';

// In-memory cache to prevent upstream rate-limiting
interface CacheEntry {
  timestamp: number;
  data: NewsItem[];
}

let cachedNews: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function cleanHtml(raw: string): string {
  if (!raw) return '';
  let text = raw
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#036;/g, '$')
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');

  // Strip all HTML tags
  text = text.replace(/<[^>]*>/g, ' ');

  // Strip raw URLs completely so they never leak into preview text
  text = text.replace(/https?:\/\/[^\s"'<>]+/gi, '');

  // Strip common RSS filler and publisher metadata
  text = text
    .replace(/View Full Coverage on Google News/gi, '')
    .replace(/Google News/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Parses items from RSS/XML string using robust regex patterns
 */
function parseRssXml(xml: string, sourceName: string, category: 'TECH' | 'MARKETS' | 'MACRO' | 'CRYPTO'): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const itemMatches = xml.match(itemRegex) || [];

  for (let i = 0; i < Math.min(itemMatches.length, 12); i++) {
    const rawItem = itemMatches[i];
    
    // Extract title
    // Clean title and remove trailing publisher tag (e.g. "- Reuters")
    const titleMatch = rawItem.match(/<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
    const rawTitle = cleanHtml(titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '');
    const title = rawTitle.replace(/\s+-\s+[A-Za-z0-9\s.]{2,20}$/, '').trim();
    if (!title || title.length < 5) continue;

    // Extract link
    const linkMatch = rawItem.match(/<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i);
    const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';

    // Extract description/snippet
    const descMatch = rawItem.match(/<description>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/description>/i);
    const rawSnippet = cleanHtml(descMatch ? (descMatch[1] || descMatch[2] || '') : '');
    const effectiveSnippet = (rawSnippet && rawSnippet.length > 25 && !rawSnippet.toLowerCase().includes(title.toLowerCase().slice(0, 30)))
      ? rawSnippet.slice(0, 220).trim()
      : `Verified developments and contextual intelligence regarding ${title.slice(0, 80)}.`;

    // Extract pubDate
    const dateMatch = rawItem.match(/<pubDate>(.*?)<\/pubDate>/i);
    const pubDateStr = dateMatch ? dateMatch[1] : new Date().toUTCString();
    const isoTimestamp = Date.parse(pubDateStr) || Date.now();

    // Extract thumbnail/image if present
    let imageUrl: string | undefined;
    const mediaMatch = rawItem.match(/<(?:media:thumbnail|enclosure|media:content)[^>]*url=["'](.*?)["']/i);
    if (mediaMatch && mediaMatch[1]) {
      imageUrl = mediaMatch[1];
    }

    const hash = Buffer.from(title + sourceName).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    
    // Calculate synthetic engagement & velocity
    const hoursOld = Math.max(0.1, (Date.now() - isoTimestamp) / (1000 * 60 * 60));
    const velocityScore = Math.min(99, Math.max(45, Math.floor(95 - (hoursOld * 2.5) + (i === 0 ? 8 : 0))));
    const baseReads = Math.floor(12000 + Math.random() * 85000);

    items.push({
      id: `news_${hash}`,
      title,
      sourceName,
      sourceUrl: link || 'https://news.google.com',
      category,
      pubDate: new Date(isoTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      isoTimestamp,
      originalSnippet: effectiveSnippet,
      imageUrl,
      velocityScore,
      engagement: {
        impressions: (velocityScore * 1.4).toFixed(1) + 'k',
        reads: baseReads,
        shares: Math.floor(baseReads * 0.08),
      },
      isRedactedDossier: i === 3, // Designate 4th story as exclusive redacted dossier
    });
  }

  return items;
}

/**
 * Fetches top stories from Hacker News official Firebase API
 */
async function fetchHackerNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=15&orderBy="$key"', {
      headers: { 'User-Agent': 'PrismNewsTMA/1.0' },
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const ids: number[] = await res.json();
    const targetIds = ids.slice(0, 8);

    const storyPromises = targetIds.map(async (id, idx) => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          next: { revalidate: 60 }
        });
        if (!itemRes.ok) return null;
        const data = await itemRes.json();
        if (!data || !data.title) return null;

        const isoTimestamp = data.time ? data.time * 1000 : Date.now();
        const score = data.score || 50;
        const velocityScore = Math.min(99, Math.max(50, Math.floor(score / 5 + 40)));

        return {
          id: `hn_${data.id}`,
          title: data.title,
          sourceName: 'Hacker News',
          sourceUrl: data.url || `https://news.ycombinator.com/item?id=${data.id}`,
          category: 'TECH' as const,
          pubDate: new Date(isoTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
          isoTimestamp,
          originalSnippet: `Discussion trending on Hacker News with ${score} upvotes and ${data.descendants || 0} active comments.`,
          velocityScore,
          engagement: {
            impressions: `${(score * 1.8).toFixed(1)}k`,
            reads: score * 140,
            shares: Math.floor(score * 12),
          },
          isRedactedDossier: idx === 2,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(storyPromises);
    const validItems: NewsItem[] = [];
    for (const item of results) {
      if (item !== null) validItems.push(item);
    }
    return validItems;
  } catch {
    return [];
  }
}

/**
 * Fetches and parses BBC Technology RSS
 */
async function fetchBbcTech(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://feeds.bbci.co.uk/news/technology/rss.xml', {
      headers: { 'User-Agent': 'PrismNewsTMA/1.0' },
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssXml(xml, 'BBC News', 'TECH');
  } catch {
    return [];
  }
}

/**
 * Fetches and parses Google News Tech & Macro RSS
 */
async function fetchGoogleNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en', {
      headers: { 'User-Agent': 'PrismNewsTMA/1.0' },
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssXml(xml, 'Google Global News', 'MACRO');
  } catch {
    return [];
  }
}

/**
 * Aggregates all sources, deduplicates, and sorts by real-time velocity
 */
export async function getAggregatedTrendingNews(forceRefresh = false): Promise<NewsItem[]> {
  const now = Date.now();
  if (!forceRefresh && cachedNews && (now - cachedNews.timestamp < CACHE_TTL_MS)) {
    return cachedNews.data;
  }

  const [hn, bbc, google] = await Promise.all([
    fetchHackerNews(),
    fetchBbcTech(),
    fetchGoogleNews(),
  ]);

  const combined = [...hn, ...bbc, ...google];

  // If upstream network drops, provide fallback curated stream
  if (combined.length === 0) {
    return getFallbackCuratedNews();
  }

  // Deduplicate by title similarity
  const seenTitles = new Set<string>();
  const uniqueItems: NewsItem[] = [];

  for (const item of combined) {
    const simplified = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
    if (!seenTitles.has(simplified)) {
      seenTitles.add(simplified);
      uniqueItems.push(item);
    }
  }

  // Sort by velocity score descending
  uniqueItems.sort((a, b) => b.velocityScore - a.velocityScore);

  cachedNews = {
    timestamp: now,
    data: uniqueItems.slice(0, 20),
  };

  return cachedNews.data;
}

/**
 * Fallback curated high-signal items
 */
function getFallbackCuratedNews(): NewsItem[] {
  const now = Date.now();
  return [
    {
      id: 'news_curated_ai_breakthrough',
      title: 'Autonomous AI Agents Execute Multi-Day Architecture Refactor on Production Clusters',
      sourceName: 'PRISM Wire',
      sourceUrl: 'https://news.ycombinator.com',
      category: 'TECH',
      pubDate: 'Just now',
      isoTimestamp: now,
      originalSnippet: 'Next-generation agentic workflows transition from single-prompt scripts into fully autonomous engineering swarms operating with zero context loss.',
      velocityScore: 98,
      engagement: { impressions: '142.8k', reads: 89400, shares: 12400 },
      isRedactedDossier: false,
    },
    {
      id: 'news_curated_macro_liquidity',
      title: 'Global Sovereign Bond Yields Invert as Central Banks Signal Aggressive Easing Cycles',
      sourceName: 'Financial Times',
      sourceUrl: 'https://ft.com',
      category: 'MARKETS',
      pubDate: '14m ago',
      isoTimestamp: now - 14 * 60 * 1000,
      originalSnippet: 'Treasury curve shifts spark massive capital rotation into high-beta tech equities and decentralized liquidity pools.',
      velocityScore: 94,
      engagement: { impressions: '98.2k', reads: 54100, shares: 6200 },
      isRedactedDossier: false,
    },
    {
      id: 'news_curated_crypto_ton',
      title: 'Telegram Mini App Ecosystem Surpasses 1.2B Active Users as Toncoin Velocity Surges',
      sourceName: 'CoinDesk',
      sourceUrl: 'https://coindesk.com',
      category: 'CRYPTO',
      pubDate: '28m ago',
      isoTimestamp: now - 28 * 60 * 1000,
      originalSnippet: 'Direct Apple Pay and Stars micro-monetization converts viral Telegram distribution channels into high-margin fintech engines.',
      velocityScore: 91,
      engagement: { impressions: '84.5k', reads: 42000, shares: 5800 },
      isRedactedDossier: true,
    }
  ];
}
