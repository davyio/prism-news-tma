import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM News — Multi-Spectrum Intelligence",
  description: "AI-powered trending news refracted across agendas, voices, and languages with Jony Ive precision.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('prism_theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Telegram WebApp JavaScript SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        {/* Adsgram Monetization Script */}
        <Script
          src="https://sad.adsgram.ai/js/sad.min.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-start transition-colors overflow-x-hidden antialiased">
        <div className="w-full max-w-md min-h-screen flex flex-col relative pb-12 transition-all sm:my-6 sm:rounded-[38px] sm:border sm:border-[var(--border-subtle)] sm:shadow-[0_32px_80px_rgba(0,0,0,0.3)] sm:overflow-hidden bg-[var(--bg-primary)]">
          {children}
        </div>
      </body>
    </html>
  );
}
