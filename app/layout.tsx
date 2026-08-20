import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

import { EduToaster } from "@/components/ui/toaster";
import { ReactQueryProvider, ThemeProvider } from "@/providers";
//import GlobalSystemWatcher from "@/lib/utils/global-system.watcher";
import { AppFeedbackModal, AppConfirmModal } from "@/components/modals";
import { Providers } from "./providers";

// 1. Font ya maandishi ya kawaida / Aya (Body)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// 2. Font ya Headings (Modern Sans)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

// 3. Font ya Code / Mono
const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// 1. METADATA - AI-Ready & Industrial Branding
export const metadata: Metadata = {
  metadataBase: new URL('https://eduasas.co.tz'),
  title: {
    template: "%s | EduAsas",
    default: "EduAsas - AI-powered Multi-school Management System",
  },
  description: "The ultimate AI-driven multi-school management system. Engineered for high-performance, EduAsas provides an industrial-grade, end-to-end digital infrastructure for modern educational institutions in Tanzania. Secure, scalable, and lightning-fast.",
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
    url: "https://eduasas.co.tz",
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

  // useEffect(() => {
  //   const isProd = process.env.NEXT_PUBLIC_APP_STAGE === 'production';

  //   if ('serviceWorker' in navigator && isProd) {
  //     window.addEventListener('load', () => {
  //       navigator.serviceWorker
  //         .register('/sw.js')
  //         .then((registration) => {
  //           console.log('EduAsas Service Worker registered');
  //         });
  //     });
  //   }
  // }, []);

  return (
    <html
      lang="sw"
      className={`
        ${inter.className}
        ${jakarta.variable}
        ${firaCode.variable}
        antialiased scroll-smoot
    `}
      suppressHydrationWarning
    >
      <body
        className={`
          min-h-screen text-foreground 
          selection:bg-gray selection:text-primary-foreground
          overflow-x-hidden font-sans
        `}
        suppressHydrationWarning={true}
      >
        {/* <GlobalSystemWatcher /> Hii ni lazima */}
        <ThemeProvider
          attribute="class"        // Inatumia class="dark" kwenye html tag
          defaultTheme="light"    // Inaanza na kile OS inachotaka
          enableSystem={true}      // Inaruhusu kusoma settings za PC/Simu
          disableTransitionOnChange // Inazuia rangi "kuteleza" wakati wa kubadili (fastest load)
        >
          {/* HAPA NDIPO TUNAFUNGA SECURITY GUARD WETU */}
          <ReactQueryProvider>
            <Providers>
              {children}
            </Providers>
            <AppFeedbackModal />
            <AppConfirmModal />
            <EduToaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}