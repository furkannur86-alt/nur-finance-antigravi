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
    default: "NUR Finance Terminal",
    template: "%s | NUR Finance",
  },
  description: "Institutional financial data, analytics and trading terminal by NUR Finance. Real-time market data, risk analytics, and financial media.",
  metadataBase: new URL("https://nurfinans.com"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NUR Finance Terminal",
    description: "Institutional financial data, analytics and trading terminal. Real-time market data, risk analytics, and financial media.",
    type: "website",
    siteName: "NUR Finance",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUR Finance Terminal",
    description: "Institutional financial data, analytics and trading terminal by NUR Finance.",
  },
  keywords: [
    "financial terminal",
    "trading terminal",
    "market data",
    "risk analytics",
    "NUR Finance",
    "institutional analytics",
    "financial media",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
