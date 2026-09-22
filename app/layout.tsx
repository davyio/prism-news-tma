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
    <html lang="en" className="dark">
      <head>
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
      <body className="min-h-screen bg-[#050508] text-slate-100 flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen flex flex-col relative pb-12 shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
