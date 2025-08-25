import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { ThemeProvider } from "@/lib/themeContext";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import GlobalErrorHandler from "@/components/error/GlobalErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ModelArena - AI Model Comparison Platform",
  description: "Compare and chat with multiple AI models side-by-side. Experience real-time streaming, multi-model comparison, and open-source AI playground.",
  keywords: "AI, machine learning, model comparison, chat, OpenAI, Anthropic, Gemini, open source",
  authors: [{ name: "Xenonesis", url: "https://github.com/Xenonesis" }],
  creator: "Xenonesis",
  openGraph: {
    title: "ModelArena - AI Model Comparison Platform",
    description: "Compare and chat with multiple AI models side-by-side",
    url: "https://modelarena.dev",
    siteName: "ModelArena",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ModelArena - AI Model Comparison Platform",
    description: "Compare and chat with multiple AI models side-by-side",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: {
      url: '/apple-touch-icon.svg',
      sizes: '180x180',
      type: 'image/svg+xml',
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <GlobalErrorHandler>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </GlobalErrorHandler>
        </ErrorBoundary>
        
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1" && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
        <Script 
          src="https://js.puter.com/v2/" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
