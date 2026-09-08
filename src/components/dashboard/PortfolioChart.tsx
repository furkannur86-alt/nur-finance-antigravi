"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PortfolioItem } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  portfolio: PortfolioItem[];
}

export default function PortfolioChart({ portfolio }: Props) {
  const data = {
    labels: portfolio.map((p) => p.symbol),
    datasets: [
      {
        data: portfolio.map((p) => p.currentPrice * p.quantity),
        backgroundColor: [
          "#00d4aa",
          "#6366f1",
          "#f59e0b",
          "#ef4444",
          "#3b82f6",
          "#8b5cf6",
          "#f472b6",
        ],
        borderColor: "#0a0e17",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#64748b",
          font: { size: 10 },
          padding: 8,
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        borderColor: "#1e293b",
        borderWidth: 1,
        titleColor: "#e0e6f0",
        bodyColor: "#e0e6f0",
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => {
            const val = ctx.raw as number;
            return ` ${ctx.label}: $${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div style={{ height: 180 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
