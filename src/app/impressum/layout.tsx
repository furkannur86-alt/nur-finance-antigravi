import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Protocol Governance — Nur Finance",
  description: "NUR Finance Sovereign Network legal notice, settlement infrastructure, and protocol governance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
