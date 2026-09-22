import { NextResponse } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { initData } = await request.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

    const validation = validateTelegramInitData(initData, botToken);

    return NextResponse.json({
      success: validation.isValid,
      user: validation.user,
    });
  } catch (error) {
    console.error('[API:auth/verify] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
