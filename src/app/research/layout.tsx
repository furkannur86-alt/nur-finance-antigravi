import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFS Equity Research — Nur Financial Services",
  description: "Analyst coverage, ratings, and equity research from Nur Financial Services.",
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-y-auto">{children}</div>;
}
