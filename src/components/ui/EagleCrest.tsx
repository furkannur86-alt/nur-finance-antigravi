"use client";

interface EagleCrestProps {
  size?: number;
  animate?: boolean;
  className?: string;
  showMottoBadge?: boolean;
}

export default function EagleCrest({
  size = 48,
  className = "",
}: EagleCrestProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      title="NUR Finance"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle cx="50" cy="50" r="47" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Shield */}
        <path
          d="M50 8 C68 8 82 22 82 42 C82 65 68 85 50 94 C32 85 18 65 18 42 C18 22 32 8 50 8Z"
          fill="url(#shield-grad)"
          stroke="#d4af37"
          strokeWidth="2"
        />

        {/* Left wing */}
        <path
          d="M38 44 C28 32 14 22 16 42 C18 55 28 58 38 52Z"
          fill="url(#wing-grad-l)"
        />
        {/* Left feather lines */}
        <line x1="36" y1="42" x2="20" y2="28" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="34" y1="44" x2="18" y2="33" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="32" y1="46" x2="17" y2="38" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />

        {/* Right wing */}
        <path
          d="M62 44 C72 32 86 22 84 42 C82 55 72 58 62 52Z"
          fill="url(#wing-grad-r)"
        />
        {/* Right feather lines */}
        <line x1="64" y1="42" x2="80" y2="28" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="66" y1="44" x2="82" y2="33" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />
        <line x1="68" y1="46" x2="83" y2="38" stroke="#462d05" strokeWidth="0.8" strokeOpacity="0.7" />

        {/* Body */}
        <ellipse cx="50" cy="48" rx="8" ry="16" fill="url(#body-grad)" />

        {/* Left head */}
        <ellipse cx="40" cy="30" rx="5" ry="6" fill="#d4af37" transform="rotate(-14 40 30)" />
        <polygon points="34,28 28,31 34,33" fill="#f59e0b" />
        <circle cx="38" cy="29" r="1.5" fill="#ff2e63" fillOpacity="0.85" />

        {/* Right head */}
        <ellipse cx="60" cy="30" rx="5" ry="6" fill="#d4af37" transform="rotate(14 60 30)" />
        <polygon points="66,28 72,31 66,33" fill="#f59e0b" />
        <circle cx="62" cy="29" r="1.5" fill="#ff2e63" fillOpacity="0.85" />

        {/* Crown */}
        <polygon
          points="38,24 42,14 46,21 50,10 54,21 58,14 62,24"
          fill="#fbbf24"
          stroke="#92400e"
          strokeWidth="0.6"
        />

        {/* Tail feathers */}
        <polygon
          points="42,62 38,76 44,72 50,80 56,72 62,76 58,62"
          fill="#8b6914"
        />

        {/* Central medallion */}
        <circle cx="50" cy="52" r="7" fill="#0c131f" stroke="#d4af37" strokeWidth="1" />
        <text
          x="50"
          y="53"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#00d4aa"
          fontFamily="monospace"
          fontWeight="bold"
          fontSize="7"
        >
          NF
        </text>

        {/* Gradients */}
        <defs>
          <linearGradient id="shield-grad" x1="50" y1="8" x2="50" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#161b26" />
            <stop offset="0.5" stopColor="#0b0f17" />
            <stop offset="1" stopColor="#05070a" />
          </linearGradient>
          <linearGradient id="body-grad" x1="50" y1="32" x2="50" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f3e5ab" />
            <stop offset="0.3" stopColor="#d4af37" />
            <stop offset="1" stopColor="#8b6914" />
          </linearGradient>
          <linearGradient id="wing-grad-l" x1="14" y1="22" x2="38" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f3e5ab" />
            <stop offset="0.5" stopColor="#d4af37" />
            <stop offset="1" stopColor="#996515" />
          </linearGradient>
          <linearGradient id="wing-grad-r" x1="86" y1="22" x2="62" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f3e5ab" />
            <stop offset="0.5" stopColor="#d4af37" />
            <stop offset="1" stopColor="#996515" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
