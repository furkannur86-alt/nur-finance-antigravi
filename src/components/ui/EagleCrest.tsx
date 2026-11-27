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
      >
        {/* Outer circle border */}
        <circle cx="100" cy="100" r="96" stroke="#cc0000" strokeWidth="2" strokeOpacity="0.6" />
        <circle cx="100" cy="100" r="92" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.15" />

        {/* Dark background shield */}
        <circle cx="100" cy="100" r="90" fill={`url(#${id}-bg)`} />

        {/* === LEFT WING (spread, 5 primary feathers) === */}
        <path d="M80 95 L60 60 L50 65 L40 45 L35 55 L22 30 L28 58 L18 42 L26 68 L15 58 L28 82 L35 78 L30 90 L45 82 L55 88 L65 92Z" fill={`url(#${id}-wing-l)`} stroke="#1a0000" strokeWidth="0.5" />
        {/* Left wing feather details */}
        <line x1="75" y1="90" x2="30" y2="40" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="72" y1="92" x2="25" y2="52" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="68" y1="93" x2="22" y2="62" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="62" y1="92" x2="28" y2="78" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.4" />

        {/* === RIGHT WING (mirror) === */}
        <path d="M120 95 L140 60 L150 65 L160 45 L165 55 L178 30 L172 58 L182 42 L174 68 L185 58 L172 82 L165 78 L170 90 L155 82 L145 88 L135 92Z" fill={`url(#${id}-wing-r)`} stroke="#1a0000" strokeWidth="0.5" />
        {/* Right wing feather details */}
        <line x1="125" y1="90" x2="170" y2="40" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="128" y1="92" x2="175" y2="52" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="132" y1="93" x2="178" y2="62" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.5" />
        <line x1="138" y1="92" x2="172" y2="78" stroke="#330000" strokeWidth="0.4" strokeOpacity="0.4" />

        {/* === BODY (central torso) === */}
        <path d="M88 80 C88 70 92 62 100 60 C108 62 112 70 112 80 L112 120 C112 130 108 138 100 140 C92 138 88 130 88 120Z" fill={`url(#${id}-body)`} stroke="#1a0000" strokeWidth="0.6" />

        {/* Body armor lines */}
        <path d="M92 85 C96 83 104 83 108 85" stroke="#330000" strokeWidth="0.4" fill="none" />
        <path d="M91 92 C96 90 104 90 109 92" stroke="#330000" strokeWidth="0.4" fill="none" />
        <path d="M91 99 C96 97 104 97 109 99" stroke="#330000" strokeWidth="0.4" fill="none" />

        {/* === LEFT HEAD === */}
        <path d="M80 62 C74 56 70 48 72 42 C74 38 78 36 82 38 C86 40 88 46 88 52 C88 56 86 60 82 64Z" fill="#cc0000" stroke="#1a0000" strokeWidth="0.6" />
        {/* Left beak */}
        <polygon points="70,42 58,46 70,50" fill="#ffffff" stroke="#1a0000" strokeWidth="0.4" />
        {/* Left eye */}
        <circle cx="77" cy="46" r="2.5" fill="#ffffff" />
        <circle cx="77" cy="46" r="1.2" fill="#0a0a0a" />

        {/* === RIGHT HEAD === */}
        <path d="M120 62 C126 56 130 48 128 42 C126 38 122 36 118 38 C114 40 112 46 112 52 C112 56 114 60 118 64Z" fill="#cc0000" stroke="#1a0000" strokeWidth="0.6" />
        {/* Right beak */}
        <polygon points="130,42 142,46 130,50" fill="#ffffff" stroke="#1a0000" strokeWidth="0.4" />
        {/* Right eye */}
        <circle cx="123" cy="46" r="2.5" fill="#ffffff" />
        <circle cx="123" cy="46" r="1.2" fill="#0a0a0a" />

        {/* === CROWN (between heads) === */}
        <polygon points="84,36 88,22 93,30 97,18 100,14 103,18 107,30 112,22 116,36" fill="#cc0000" stroke="#ffffff" strokeWidth="0.5" />
        {/* Crown jewels */}
        <circle cx="100" cy="22" r="2" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="92" cy="28" r="1.2" fill="#ffffff" fillOpacity="0.7" />
        <circle cx="108" cy="28" r="1.2" fill="#ffffff" fillOpacity="0.7" />

        {/* === TAIL FEATHERS === */}
        <path d="M90 130 L82 158 L88 152 L92 164 L96 154 L100 170 L104 154 L108 164 L112 152 L118 158 L110 130Z" fill={`url(#${id}-tail)`} stroke="#1a0000" strokeWidth="0.4" />

        {/* === LEFT TALON === */}
        <path d="M88 130 L78 142 L74 148 M78 142 L82 150 M78 142 L72 144" stroke="#cc0000" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* === RIGHT TALON === */}
        <path d="M112 130 L122 142 L126 148 M122 142 L118 150 M122 142 L128 144" stroke="#cc0000" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* === CENTRAL SHIELD / MEDALLION === */}
        <circle cx="100" cy="105" r="14" fill="#0a0a0a" stroke="#cc0000" strokeWidth="1.5" />
        <circle cx="100" cy="105" r="11" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeOpacity="0.3" />
        {/* NF monogram */}
        <text
          x="100"
          y="106"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontFamily="'Georgia', serif"
          fontWeight="bold"
          fontSize="12"
        >
          NF
        </text>

        {/* === GRADIENTS === */}
        <defs>
          <radialGradient id={`${id}-bg`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#1a1a1a" />
            <stop offset="0.7" stopColor="#0d0d0d" />
            <stop offset="1" stopColor="#050505" />
          </radialGradient>
          <linearGradient id={`${id}-body`} x1="100" y1="60" x2="100" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dd2222" />
            <stop offset="0.3" stopColor="#cc0000" />
            <stop offset="0.7" stopColor="#990000" />
            <stop offset="1" stopColor="#660000" />
          </linearGradient>
          <linearGradient id={`${id}-wing-l`} x1="15" y1="30" x2="80" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dd2222" />
            <stop offset="0.4" stopColor="#cc0000" />
            <stop offset="1" stopColor="#770000" />
          </linearGradient>
          <linearGradient id={`${id}-wing-r`} x1="185" y1="30" x2="120" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dd2222" />
            <stop offset="0.4" stopColor="#cc0000" />
            <stop offset="1" stopColor="#770000" />
          </linearGradient>
          <linearGradient id={`${id}-tail`} x1="100" y1="130" x2="100" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#cc0000" />
            <stop offset="1" stopColor="#550000" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
