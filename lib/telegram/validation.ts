import crypto from 'crypto';

export interface ValidatedTelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  authDate: number;
}

/**
 * Cryptographically validates Telegram WebApp initData string using HMAC-SHA256
 */
export function validateTelegramInitData(initData: string, botToken: string): { isValid: boolean; user?: ValidatedTelegramUser } {
  if (!initData || !botToken) {
    return { isValid: false };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return { isValid: false };

    params.delete('hash');
    const sortedKeys = Array.from(params.keys()).sort();
    const dataCheckString = sortedKeys.map(key => `${key}=${params.get(key)}`).join('\n');

    // Secret key is HMAC-SHA256 of bot token with WebAppData key
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const isValid = computedHash === hash;
    if (!isValid) return { isValid: false };

    const rawUser = params.get('user');
    let user: ValidatedTelegramUser | undefined;
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      user = {
        id: parsed.id,
        firstName: parsed.first_name,
        lastName: parsed.last_name,
        username: parsed.username,
        authDate: parseInt(params.get('auth_date') || '0', 10),
      };
    }

    return { isValid, user };
  } catch {
    return { isValid: false };
  }
}
