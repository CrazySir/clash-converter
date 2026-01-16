'use client';

import Script from 'next/script';

export function GoogleAdSense({ adsenseId }: { adsenseId: string }) {
  if (!adsenseId) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      onError={(e) => {
        console.error('AdSense script failed to load:', e);
      }}
    />
  );
}
