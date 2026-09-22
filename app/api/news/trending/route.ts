import { NextResponse } from 'next/server';
import { getAggregatedTrendingNews } from '@/lib/news/aggregator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const items = await getAggregatedTrendingNews(forceRefresh);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('[API:news/trending] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate trending news stream' },
      { status: 500 }
    );
  }
}
