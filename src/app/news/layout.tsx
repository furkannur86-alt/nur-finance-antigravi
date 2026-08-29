import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFS Market Briefs — Nur Financial Services",
  description: "Real-time market intelligence and analysis from Nur Financial Services.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-y-auto">{children}</div>;
}
