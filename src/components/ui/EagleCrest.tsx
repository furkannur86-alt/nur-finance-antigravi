"use client";

interface EagleCrestProps {
  size?: number;
  animate?: boolean;
  className?: string;
  showMottoBadge?: boolean;
}

export default function EagleCrest({
  size = 48,
  animate = false,
  className = "",
}: EagleCrestProps) {
  const id = `ec-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      title="NUR Finance"
      style={animate ? {
        animation: "eagleSpin 8s linear infinite",
        transformStyle: "preserve-3d",
        perspective: "400px",
      } : undefined}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes eagleSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}} />
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        {/* Outer ring */}
        <circle cx="100" cy="100" r="96" stroke="#cc0000" strokeWidth="3" />
        <circle cx="100" cy="100" r="90" fill="#0a0a0a" />

        {/* LEFT WING — 5 bold feather blades */}
        <path d="M78 88 L22 28" stroke="#cc0000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M74 90 L18 44" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" />
        <path d="M70 92 L16 58" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M66 93 L20 70" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 93 L26 80" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
        {/* Left wing fill */}
        <path d="M82 86 L60 58 L40 42 L22 28 L26 54 L18 44 L24 66 L16 58 L28 78 L20 70 L36 86 L26 80 L50 90 L65 93Z" fill="#cc0000" />

        {/* RIGHT WING — mirror */}
        <path d="M122 88 L178 28" stroke="#cc0000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M126 90 L182 44" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" />
        <path d="M130 92 L184 58" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M134 93 L180 70" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M140 93 L174 80" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
        {/* Right wing fill */}
        <path d="M118 86 L140 58 L160 42 L178 28 L174 54 L182 44 L176 66 L184 58 L172 78 L180 70 L164 86 L174 80 L150 90 L135 93Z" fill="#cc0000" />

        {/* BODY — solid bold torso */}
        <path d="M86 78 C86 68 90 58 100 55 C110 58 114 68 114 78 L114 124 C114 134 110 142 100 145 C90 142 86 134 86 124Z" fill="#cc0000" stroke="#ffffff" strokeWidth="1" />

        {/* LEFT HEAD — bold */}
        <path d="M78 60 C72 52 68 44 71 38 C74 34 78 32 83 36 C87 40 88 48 87 54 C86 58 84 60 80 62Z" fill="#cc0000" stroke="#ffffff" strokeWidth="1" />
        {/* Left beak — sharp white triangle */}
        <polygon points="68,38 54,43 68,48" fill="#ffffff" />
        {/* Left eye */}
        <circle cx="76" cy="44" r="3" fill="#ffffff" />
        <circle cx="76" cy="44" r="1.5" fill="#0a0a0a" />

        {/* RIGHT HEAD — bold mirror */}
        <path d="M122 60 C128 52 132 44 129 38 C126 34 122 32 117 36 C113 40 112 48 113 54 C114 58 116 60 120 62Z" fill="#cc0000" stroke="#ffffff" strokeWidth="1" />
        {/* Right beak */}
        <polygon points="132,38 146,43 132,48" fill="#ffffff" />
        {/* Right eye */}
        <circle cx="124" cy="44" r="3" fill="#ffffff" />
        <circle cx="124" cy="44" r="1.5" fill="#0a0a0a" />

        {/* CROWN — sharp white-outlined spikes */}
        <polygon points="82,34 87,18 92,28 96,14 100,8 104,14 108,28 113,18 118,34" fill="#cc0000" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="miter" />
        {/* Crown jewels */}
        <circle cx="100" cy="18" r="2.5" fill="#ffffff" />
        <circle cx="92" cy="24" r="1.5" fill="#ffffff" />
        <circle cx="108" cy="24" r="1.5" fill="#ffffff" />

        {/* TAIL FEATHERS — bold pointed */}
        <path d="M90 134 L80 162 L88 154 L92 168 L96 156 L100 176 L104 156 L108 168 L112 154 L120 162 L110 134Z" fill="#cc0000" stroke="#ffffff" strokeWidth="0.8" />

        {/* LEFT TALON — thick */}
        <path d="M88 132 L76 146 L72 154" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M76 146 L80 154" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M76 146 L70 148" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* RIGHT TALON — thick */}
        <path d="M112 132 L124 146 L128 154" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M124 146 L120 154" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M124 146 L130 148" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* CENTRAL SHIELD */}
        <circle cx="100" cy="106" r="15" fill="#0a0a0a" stroke="#ffffff" strokeWidth="2" />
        <text
          x="100"
          y="107"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontFamily="'Georgia', serif"
          fontWeight="bold"
          fontSize="13"
        >
          NF
        </text>
      </svg>
    </div>
  );
}
