import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zero-PII Privacy Policy — Nur Finance",
  description: "NUR Finance cryptographic Zero-PII privacy standard. No personal data collection, multi-chain settlement only.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
