"use client";

import { useState, useEffect, useCallback } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface CategoryData {
  id: string;
  name: string;
  description: string;
  frequency?: string;
  latest: { date: string; value: string } | null;
  recent: Array<{ date: string; value: string }>;
}

interface YieldPoint {
  maturity: string;
  yield: number;
}

const CATEGORIES = [
  { id: "rates", label: "Rates" },
  { id: "inflation", label: "Inflation" },
  { id: "growth", label: "Growth" },
  { id: "labor", label: "Labor" },
  { id: "manufacturing", label: "Mfg" },
  { id: "housing", label: "Housing" },
  { id: "consumer", label: "Consumer" },
  { id: "money", label: "Money" },
  { id: "credit", label: "Credit" },
];

export default function EconomicDataPanel() {
  const [category, setCategory] = useState("rates");
  const [data, setData] = useState<CategoryData[]>([]);
  const [yieldCurve, setYieldCurve] = useState<YieldPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [showYield, setShowYield] = useState(false);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/economic-data?type=category&category=${category}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  }, [category]);

  const fetchYieldCurve = useCallback(async () => {
    try {
      const res = await fetch("/api/economic-data?type=yield-curve");
      const json = await res.json();
      setYieldCurve(json.data || []);
    } catch {
      setYieldCurve([]);
    }
  }, []);

  useEffect(() => { fetchCategory(); }, [fetchCategory]);
  useEffect(() => { if (category === "rates") fetchYieldCurve(); }, [category, fetchYieldCurve]);

  const yieldChart = yieldCurve.length > 0
    ? {
        labels: yieldCurve.map((p) => p.maturity),
        datasets: [
          {
            label: "Yield Curve",
            data: yieldCurve.map((p) => p.yield),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#6366f1",
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Economic Indicators</h2>
        {category === "rates" && (
          <button
            onClick={() => setShowYield((v) => !v)}
            className="text-[10px] px-2 py-0.5 rounded border"
            style={{ borderColor: "var(--ag-border)", color: showYield ? "var(--ag-accent2)" : "var(--ag-muted)" }}
          >
            Yield Curve
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className="px-2 py-0.5 text-[10px] rounded border transition-colors"
            style={{
              background: category === c.id ? "rgba(99,102,241,0.15)" : "transparent",
              borderColor: category === c.id ? "var(--ag-accent2)" : "var(--ag-border)",
              color: category === c.id ? "var(--ag-accent2)" : "var(--ag-muted)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {showYield && yieldChart && (
        <div className="rounded border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>US Treasury Yield Curve</h3>
          <div style={{ height: 200 }}>
            <Line
              data={yieldChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    backgroundColor: "#111827",
                    borderColor: "#1e293b",
                    borderWidth: 1,
                    titleColor: "#e0e6f0",
                    bodyColor: "#6366f1",
                    callbacks: { label: (ctx) => ` ${(ctx.raw as number).toFixed(2)}%` },
                  },
                },
                scales: {
                  x: { ticks: { color: "#334155", font: { size: 9 } }, grid: { color: "#1e293b20" } },
                  y: { ticks: { color: "#334155", font: { size: 9 }, callback: (v) => `${v}%` }, grid: { color: "#1e293b40" } },
                },
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs" style={{ color: "var(--ag-muted)" }}>Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded border p-2.5"
              style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--ag-text)" }}>{item.name}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{item.description}</div>
                </div>
                {item.frequency && (
                  <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "var(--ag-accent2)" }}>
                    {item.frequency}
                  </span>
                )}
              </div>
              {item.latest ? (
                <div className="mt-2">
                  <div className="text-lg font-bold font-mono" style={{ color: "var(--ag-accent)" }}>
                    {parseFloat(item.latest.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{item.latest.date}</div>
                  {item.recent.length > 1 && (
                    <div className="flex items-center gap-1 mt-1">
                      {item.recent.slice(0, 5).map((r, i) => {
                        const val = parseFloat(r.value);
                        const prev = i < item.recent.length - 1 ? parseFloat(item.recent[i + 1].value) : val;
                        const up = val >= prev;
                        return (
                          <div key={i} className="text-[8px] font-mono" style={{ color: up ? "var(--ag-success)" : "var(--ag-danger)" }}>
                            {val.toFixed(1)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] mt-2" style={{ color: "var(--ag-muted)" }}>No data</div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
              No data available. Check FRED API configuration.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
