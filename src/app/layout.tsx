import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AntiGravi IDE — Nur Finance",
    template: "%s | Nur Finance",
  },
  description: "Gravity-defying quantitative finance development environment by Nur Financial Services.",
  metadataBase: new URL("https://nurfinans.com"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "AntiGravi IDE — Nur Finance",
    description: "Web-based quantitative finance IDE with live market data, backtesting, NFS media channels, and smart mining compute access.",
    type: "website",
    siteName: "Nur Finance",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AntiGravi IDE — Nur Finance",
    description: "Quantitative finance IDE with live market data, backtesting, and NFS media.",
  },
  keywords: [
    "quantitative finance",
    "trading terminal",
    "market analysis",
    "backtesting",
    "Nur Finance",
    "AntiGravi",
    "crypto settlement",
    "smart mining",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
