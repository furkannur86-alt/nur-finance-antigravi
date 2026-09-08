"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { ChartDataPoint } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  data: ChartDataPoint[];
}

export default function PriceChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: "#00d4aa",
        backgroundColor: (context: { chart: ChartJS }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(0,212,170,0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(0,212,170,0.3)");
          gradient.addColorStop(1, "rgba(0,212,170,0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#00d4aa",
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#111827",
        borderColor: "#1e293b",
        borderWidth: 1,
        titleColor: "#e0e6f0",
        bodyColor: "#00d4aa",
        callbacks: {
          label: (ctx: { raw: unknown }) => ` $${(ctx.raw as number).toFixed(2)}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        display: true,
        ticks: { color: "#334155", font: { size: 9 }, maxTicksLimit: 8 },
        grid: { color: "#1e293b20" },
      },
      y: {
        display: true,
        ticks: {
          color: "#334155",
          font: { size: 9 },
          callback: (v: string | number) => `$${v}`,
        },
        grid: { color: "#1e293b40" },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <div style={{ height: 180 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
