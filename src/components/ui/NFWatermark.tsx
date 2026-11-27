"use client";

export default function NFWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        width="220"
        height="120"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.03 }}
        shapeRendering="geometricPrecision"
      >
        <text
          x="110"
          y="85"
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize="96"
          fontWeight="bold"
          letterSpacing="8"
          fill="white"
        >
          NF
        </text>
      </svg>
    </div>
  );
}
