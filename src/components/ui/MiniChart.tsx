"use client";

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
}

export default function MiniChart({ data, width = 120, height = 32, color = "#00d4aa", showArea = true }: MiniChartProps) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const lineD = `M${points.join(" L")}`;
  const areaD = `${lineD} L${pad + w},${pad + h} L${pad},${pad + h} Z`;

  const isUp = data[data.length - 1] >= data[0];
  const autoColor = color === "auto" ? (isUp ? "#10b981" : "#ef4444") : color;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {showArea && (
        <path d={areaD} fill={`${autoColor}15`} />
      )}
      <path d={lineD} fill="none" stroke={autoColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
