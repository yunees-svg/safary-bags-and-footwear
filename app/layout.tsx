import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { AppSplashScreen } from "@/components/app-splash-screen";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1f5fff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Safary Bags and Footwear — Catalog & Shop Console",
  description:
    "Browse premium daily slippers, orthopedic footwear, and travel bags. Direct WhatsApp ordering & shop management.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Safary Bags and Footwear",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('safary_theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppSplashScreen />
        {children}
      </body>
    </html>
  );
}
