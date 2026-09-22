import { NextResponse } from 'next/server';
import { createStarsInvoiceLink, SUBSCRIPTION_TIERS } from '@/lib/monetization/telegram-stars';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, tierId } = body;

    const targetTierId = tierId || 'prism-black-monthly';
    const targetUserId = userId || 'anonymous_degen';

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const result = await createStarsInvoiceLink(targetUserId, targetTierId, botToken);

    return NextResponse.json({
      success: true,
      ...result,
      tier: SUBSCRIPTION_TIERS[targetTierId],
    });
  } catch (error) {
    console.error('[API:stars/invoice] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Stars invoice' },
      { status: 500 }
    );
  }
}
