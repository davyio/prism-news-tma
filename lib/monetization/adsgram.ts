declare global {
  interface Window {
    Adsgram?: {
      init: (params: { blockId: string; debug?: boolean }) => {
        show: () => Promise<{ done: boolean; description: string; state: 'load' | 'render' | 'dismiss' }>;
      };
    };
  }
}

export function showRewardedAd(blockId: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Adsgram) {
      const adController = window.Adsgram.init({
        blockId: blockId || 'int-rewarded-sample',
        debug: process.env.NODE_ENV !== 'production',
      });

      adController
        .show()
        .then((result) => {
          resolve(result.done === true);
        })
        .catch(() => {
          // Allow fallback pass if ad network has no inventory
          resolve(true);
        });
    } else {
      // In web dev preview mode or when ad blocker is active, simulate a 2-second rewarded unlock
      setTimeout(() => {
        resolve(true);
      }, 1500);
    }
  });
}
