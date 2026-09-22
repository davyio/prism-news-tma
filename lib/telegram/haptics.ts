import { getTelegramWebApp } from './webapp-sdk';
import { playMicrosound, MicrosoundType } from '../audio/microsounds';

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

  // Synchronized Apple-style acoustic microsound
  const soundMap: Record<string, MicrosoundType> = {
    light: 'click',
    medium: 'pop',
    heavy: 'warning',
    rigid: 'click',
    soft: 'toggle',
  };
  playMicrosound(soundMap[style] || 'click');
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

  if (type === 'success') {
    playMicrosound('chime');
  } else {
    playMicrosound('warning');
  }
}

/**
 * Universal tactile feedback: combines Telegram haptics with Web Audio microsounds
 */
export function playTactileFeedback(type: 'tap' | 'toggle' | 'pop' | 'chime' | 'sheet' | 'warning' = 'tap') {
  switch (type) {
    case 'tap':
      triggerHaptic('light');
      break;
    case 'toggle':
      triggerHaptic('soft');
      break;
    case 'pop':
      triggerHaptic('medium');
      break;
    case 'chime':
      triggerHapticNotification('success');
      break;
    case 'sheet':
      playMicrosound('sheet');
      triggerHaptic('light');
      break;
    case 'warning':
      triggerHapticNotification('warning');
      break;
  }
}

