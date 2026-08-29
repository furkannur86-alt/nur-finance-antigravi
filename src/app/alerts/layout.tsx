import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFS Risk Alerts — Nur Financial Services",
  description: "Active risk alerts and threat monitoring from Nur Financial Services.",
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-y-auto">{children}</div>;
}
