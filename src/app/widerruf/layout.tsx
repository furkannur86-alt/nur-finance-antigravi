import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy — Nur Finance",
  description: "On-chain settlement finality, subscription management, and key revocation policy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
