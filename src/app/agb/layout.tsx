import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Nur Finance",
  description: "Protocol terms of service, institutional tier access, smart mining compute-for-access agreement, and algorithmic disclaimer.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
