import React from "react";

interface KiteConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  colorType: "saffron" | "tricolor" | "emerald" | "gold";
  animationClass: string;
  opacity: number;
  rotation: number;
}

const KITES: KiteConfig[] = [
  {
    id: 1,
    top: "12%",
    left: "6%",
    size: 44,
    colorType: "saffron",
    animationClass: "animate-kite-1",
    opacity: 0.85,
    rotation: -14,
  },
  {
    id: 2,
    top: "22%",
    left: "88%",
    size: 52,
    colorType: "tricolor",
    animationClass: "animate-kite-2",
    opacity: 0.9,
    rotation: 18,
  },
  {
    id: 3,
    top: "48%",
    left: "3%",
    size: 38,
    colorType: "emerald",
    animationClass: "animate-kite-3",
    opacity: 0.8,
    rotation: 8,
  },
  {
    id: 4,
    top: "65%",
    left: "92%",
    size: 42,
    colorType: "gold",
    animationClass: "animate-kite-1",
    opacity: 0.75,
    rotation: -12,
  },
  {
    id: 5,
    top: "82%",
    left: "8%",
    size: 48,
    colorType: "tricolor",
    animationClass: "animate-kite-2",
    opacity: 0.82,
    rotation: 15,
  },
];

export const FloatingKites: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {KITES.map((k) => (
        <div
          key={k.id}
          className={`absolute transition-transform duration-700 ${k.animationClass}`}
          style={{
            top: k.top,
            left: k.left,
            width: k.size,
            height: k.size * 1.6,
            opacity: k.opacity,
            transform: `rotate(${k.rotation}deg)`,
          }}
        >
          {/* Indian Fighter Kite (Patang) SVG */}
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`kite-saffron-${k.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>

              <linearGradient id={`kite-emerald-${k.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E7D32" />
                <stop offset="100%" stopColor="#0B3C1D" />
              </linearGradient>

              <linearGradient id={`kite-tricolor-${k.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF7700" />
                <stop offset="33%" stopColor="#FF9933" />
                <stop offset="34%" stopColor="#FFFFFF" />
                <stop offset="66%" stopColor="#F5F5F5" />
                <stop offset="67%" stopColor="#138808" />
                <stop offset="100%" stopColor="#0E6406" />
              </linearGradient>

              <linearGradient id={`kite-gold-${k.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* Main Diamond Kite Body */}
            <polygon
              points="50,4 94,48 50,92 6,48"
              fill={
                k.colorType === "saffron"
                  ? `url(#kite-saffron-${k.id})`
                  : k.colorType === "emerald"
                  ? `url(#kite-emerald-${k.id})`
                  : k.colorType === "gold"
                  ? `url(#kite-gold-${k.id})`
                  : `url(#kite-tricolor-${k.id})`
              }
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />

            {/* Spine (Central Bamboo Stick) */}
            <line x1="50" y1="4" x2="50" y2="92" stroke="#422006" strokeWidth="1.5" />

            {/* Bow (Curved Cross Spar) */}
            <path
              d="M 6 48 Q 50 14 94 48"
              stroke="#5C2D0C"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Subtle Center Emblem on Tricolor Kites */}
            {k.colorType === "tricolor" && (
              <circle cx="50" cy="48" r="7" stroke="#000080" strokeWidth="1.2" fill="#FFFFFF" />
            )}

            {/* Bottom Tail Triangle */}
            <polygon
              points="50,92 64,108 36,108"
              fill={k.colorType === "emerald" ? "#FF9933" : "#138808"}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />

            {/* Flowing String (Manja) */}
            <path
              d="M 50 108 Q 42 126 54 138 T 48 160"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Small Paper Bows on String */}
            <polygon points="52,126 56,128 56,124" fill="#FF9933" />
            <polygon points="46,144 42,146 42,142" fill="#138808" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingKites;
