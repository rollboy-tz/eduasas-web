import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";

import "./globals.css";

import { ReactQueryProvider, ThemeProvider } from "@/providers";
import GlobalSystemWatcher from "@/lib/utils/global-system.watcher";
import { AppFeedbackModal, AppConfirmModal } from "@/components/modals";

// 1. METADATA - AI-Ready & Industrial Branding
export const metadata: Metadata = {
  metadataBase: new URL('https://app.eduasas.co.tz'),
  title: {
    template: "%s | EduAsas",
    default: "EduAsas - Intelligent Multi-School Management System",
  },
  description: "The ultimate AI-driven multi-school management ecosystem. Engineered for high-performance, EduAsas provides an industrial-grade, end-to-end digital infrastructure for modern educational institutions in Tanzania. Secure, scalable, and lightning-fast.",
  manifest: "/manifest.json",
  // Ongeza hii kwa ajili ya muonekano wa browser kwenye simu
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EduAsas",
  },
  icons: {
    icon: [
      { url: "/icons/logo-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/logo-256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/icons/logo-256.png",
    apple: [
      { url: "/icons/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  // Hii ni muhimu kwa ajili ya WhatsApp/Social Media preview
  openGraph: {
    title: "EduAsas",
    description: "The ultimate AI-driven multi-school management ecosystem.",
    url: "https://app.eduasas.co.tz",
    siteName: "EduAsas",
    images: [
      {
        url: "/icons/logo-512.png", // Au picha yoyote nzuri ya dashboard
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  category: "Education Technology",
  authors: [{ name: "EduAsas Team" }, { name: "Rollboy Services" }, { name: "Rollboy Tech" }],
};

// 2. VIEWPORT - Optimized for 2026 OLED & High-Refresh Displays
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sw"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className={`
          min-h-screen bg-background text-foreground 
          selection:bg-primary/20 selection:text-primary
          overflow-x-hidden font-sans
        `}
        suppressHydrationWarning={true}
      >
        <GlobalSystemWatcher /> {/* Hii ni lazima */}
        <ThemeProvider
          attribute="class"        // Inatumia class="dark" kwenye html tag
          defaultTheme="system"    // Inaanza na kile OS inachotaka
          enableSystem={true}      // Inaruhusu kusoma settings za PC/Simu
          disableTransitionOnChange // Inazuia rangi "kuteleza" wakati wa kubadili (fastest load)
        >
          {/* HAPA NDIPO TUNAFUNGA SECURITY GUARD WETU */}
          <ReactQueryProvider>
            {children}
            <AppFeedbackModal />
            <AppConfirmModal />
            <Toaster
              position="top-center"
              richColors
              theme="system"
              toastOptions={{
                style: { borderRadius: 'var(--radius)' },
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}