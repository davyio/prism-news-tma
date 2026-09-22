export interface SubscriptionTier {
  id: 'prism-pass-weekly' | 'prism-black-monthly';
  name: string;
  starsPrice: number;
  durationDays: number;
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  'prism-pass-weekly': {
    id: 'prism-pass-weekly',
    name: 'PRISM Weekly Pass',
    starsPrice: 45,
    durationDays: 7,
    features: [
      'Full Multi-Spectrum Ingestion',
      'All 6 Political & Market POVs',
      'Instant 8-Language Refraction',
      'Removal of Native Ad Capsules',
    ]
  },
  'prism-black-monthly': {
    id: 'prism-black-monthly',
    name: 'PRISM Black Inner Circle',
    starsPrice: 150,
    durationDays: 30,
    features: [
      'Everything in Weekly Pass',
      'Unrestricted Redacted Dossiers',
      'Custom Agenda Architect (Custom Bias Sliders)',
      'High-Definition Audio Briefings',
      'Priority Gemini 3.8 Pro Processing',
      'Direct Telegram Story Card Watermark Scrub',
    ]
  }
};

export async function createStarsInvoiceLink(
  userId: string,
  tierId: string,
  botToken?: string
): Promise<{ invoiceLink: string; starsPrice: number; durationDays: number }> {
  const tier = SUBSCRIPTION_TIERS[tierId] || SUBSCRIPTION_TIERS['prism-black-monthly'];

  if (botToken && botToken.trim().length > 0) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `PRISM Intelligence: ${tier.name}`,
          description: `Unlock ${tier.durationDays}-day full multi-spectrum intelligence access with zero-latency AI refraction.`,
          payload: `prism_sub_${userId}_${Date.now()}`,
          provider_token: '', // Empty string for Telegram Stars digital goods
          currency: 'XTR',
          prices: [{ label: tier.name, amount: tier.starsPrice }],
        })
      });
      const data = await res.json();
      if (data.ok && data.result) {
        return { invoiceLink: data.result, starsPrice: tier.starsPrice, durationDays: tier.durationDays };
      }
    } catch (err) {
      console.warn('[TelegramStars] Upstream invoice link failure:', err);
    }
  }

  // Deterministic fallback invoice link
  return {
    invoiceLink: `https://t.me/$prism_sub_${userId}_${Date.now()}?start=invoice_simulated`,
    starsPrice: tier.starsPrice,
    durationDays: tier.durationDays,
  };
}
