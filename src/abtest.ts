const AB_STORAGE_KEY = 'ridrunk-ab-variant';

export type ABVariant = 'hq' | 'build';

export function getVariant(): ABVariant {
  const stored = localStorage.getItem(AB_STORAGE_KEY);
  if (stored === 'hq' || stored === 'build') return stored;
  const variant: ABVariant = Math.random() < 0.5 ? 'hq' : 'build';
  localStorage.setItem(AB_STORAGE_KEY, variant);
  return variant;
}

export function trackClick(placement: 'banner' | 'interstitial' | 'homepage', variant: ABVariant) {
  (window as any)?.gtag?.('event', 'ridrunkulous_click', {
    event_category: 'ab_test',
    event_label: `${variant}_${placement}`,
    variant,
    placement,
  });
}
