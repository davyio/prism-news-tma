import { getTelegramWebApp } from './webapp-sdk';

export function triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
  try {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(style === 'heavy' ? 25 : 10);
    }
  } catch {
    // Graceful no-op on unsupported platforms
  }
}

export function triggerHapticNotification(type: 'error' | 'success' | 'warning') {
  try {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  } catch {
    // Graceful no-op
  }
}
