import React, { useEffect, useState } from "react";

interface KiteConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  colorType: "saffron" | "tricolor" | "emerald" | "gold";
  animationClass: string;
  opacity: number;
  rotation: number;
  depth: "near" | "mid" | "far";
}

const KITES: KiteConfig[] = [
  {
    id: 1,
    top: "10%",
    left: "5%",
    size: 46,
    colorType: "saffron",
    animationClass: "animate-kite-1",
    opacity: 0.88,
    rotation: -14,
    depth: "near",
  },
  {
    id: 2,
    top: "18%",
    left: "89%",
    size: 54,
    colorType: "tricolor",
    animationClass: "animate-kite-2",
    opacity: 0.92,
    rotation: 18,
    depth: "near",
  },
  {
    id: 3,
    top: "38%",
    left: "2%",
    size: 34,
    colorType: "emerald",
    animationClass: "animate-kite-3",
    opacity: 0.7,
    rotation: 8,
    depth: "far",
  },
  {
    id: 4,
    top: "56%",
    left: "93%",
    size: 40,
    colorType: "gold",
    animationClass: "animate-kite-1",
    opacity: 0.78,
    rotation: -12,
    depth: "mid",
  },
  {
    id: 5,
    top: "76%",
    left: "7%",
    size: 48,
    colorType: "tricolor",
    animationClass: "animate-kite-2",
    opacity: 0.85,
    rotation: 16,
    depth: "near",
  },
  {
    id: 6,
    top: "32%",
    left: "82%",
    size: 30,
    colorType: "saffron",
    animationClass: "animate-kite-3",
    opacity: 0.65,
    rotation: -8,
    depth: "far",
  },
];

export const FloatingKites: React.FC = () => {
  // Apple Fluid Physics: Pointer-reactive gentle wind drift
  const [windOffset, setWindOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Gentle subtle aerodynamic wind reaction
      targetX = ((e.clientX - centerX) / centerX) * 14;
      targetY = ((e.clientY - centerY) / centerY) * 10;
    };

    const updateWind = () => {
      // Damped lerp (mass + damping spring approximation)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setWindOffset({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updateWind);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateWind);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {KITES.map((k) => {
        // Multiplier based on optical depth
        const depthFactor = k.depth === "near" ? 1.2 : k.depth === "mid" ? 0.8 : 0.45;
        const offsetX = windOffset.x * depthFactor;
        const offsetY = windOffset.y * depthFactor;

        return (
          <div
            key={k.id}
            className={`absolute will-change-transform ${k.animationClass}`}
            style={{
              top: k.top,
              left: k.left,
              width: k.size,
              height: k.size * 1.6,
              opacity: k.opacity,
              filter: k.depth === "far" ? "blur(0.6px)" : "none",
              transform: `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${k.rotation}deg)`,
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Indian Fighter Kite (Patang) SVG */}
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
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
                  <stop offset="100%" stopColor="#1B5E20" />
                </linearGradient>

                <linearGradient id={`kite-gold-${k.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5E084" />
                  <stop offset="60%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#AA820A" />
                </linearGradient>
              </defs>

              {/* Diamond Kite Body */}
              {k.colorType === "saffron" && (
                <polygon
                  points="50,6 94,50 50,94 6,50"
                  fill={`url(#kite-saffron-${k.id})`}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="2"
                />
              )}

              {k.colorType === "emerald" && (
                <polygon
                  points="50,6 94,50 50,94 6,50"
                  fill={`url(#kite-emerald-${k.id})`}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="2"
                />
              )}

              {k.colorType === "gold" && (
                <polygon
                  points="50,6 94,50 50,94 6,50"
                  fill={`url(#kite-gold-${k.id})`}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2"
                />
              )}

              {k.colorType === "tricolor" && (
                <g>
                  {/* Top Saffron Triangle */}
                  <polygon
                    points="50,6 94,50 6,50"
                    fill="#FF9933"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.5"
                  />
                  {/* Middle White Band with Ashoka Chakra Blue dot */}
                  <polygon
                    points="6,50 94,50 72,72 28,72"
                    fill="#FFFFFF"
                  />
                  <circle cx="50" cy="61" r="5" fill="#000080" />
                  {/* Bottom Emerald Triangle */}
                  <polygon
                    points="28,72 72,72 50,94"
                    fill="#138808"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.5"
                  />
                  {/* Outer Diamond Outline */}
                  <polygon
                    points="50,6 94,50 50,94 6,50"
                    fill="none"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Central Bamboo Spine (Thattha) */}
              <line
                x1="50"
                y1="6"
                x2="50"
                y2="94"
                stroke="#3e2723"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Bow Bamboo Arc (Kampa) */}
              <path
                d="M 6 50 Q 50 14 94 50"
                stroke="#4e342e"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Lower Triangle Tail (Tukkal) */}
              <polygon
                points="50,94 66,114 34,114"
                fill={k.colorType === "saffron" ? "#138808" : "#FF9933"}
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />

              {/* Flowing Kite String (Manja) */}
              <path
                d="M 50 102 Q 38 125 54 140 T 46 160"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default FloatingKites;
