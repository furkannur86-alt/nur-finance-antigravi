"use client";

interface IconProps {
  size?: number;
  className?: string;
}

export function BullIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 3L2 7L5 6L7 10L5 18C5 18 6 21 12 21C18 21 19 18 19 18L17 10L19 6L22 7L20 3L17 5L14 4H10L7 5L4 3Z"
        fill="#22c55e"
        fillOpacity="0.9"
      />
      <circle cx="9" cy="11" r="1" fill="#0a0e17" />
      <circle cx="15" cy="11" r="1" fill="#0a0e17" />
    </svg>
  );
}

export function BearIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="5" cy="5" r="3" fill="#ef4444" fillOpacity="0.8" />
      <circle cx="19" cy="5" r="3" fill="#ef4444" fillOpacity="0.8" />
      <path
        d="M6 8C6 8 4 10 4 14C4 18 7 21 12 21C17 21 20 18 20 14C20 10 18 8 18 8C16 6 14 5 12 5C10 5 8 6 6 8Z"
        fill="#ef4444"
        fillOpacity="0.9"
      />
      <circle cx="9" cy="12" r="1.2" fill="#0a0e17" />
      <circle cx="15" cy="12" r="1.2" fill="#0a0e17" />
      <ellipse cx="12" cy="15" rx="2" ry="1.2" fill="#0a0e17" fillOpacity="0.5" />
    </svg>
  );
}
