import React from "react";

interface RedFortProps {
  className?: string;
  flagAnimate?: boolean;
}

export const RedFortSilhouette: React.FC<RedFortProps> = ({
  className = "",
  flagAnimate = true,
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_-8px_20px_rgba(255,103,31,0.12)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="redFortFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1409" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#1a0a04" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#050811" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="redFortStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#138808" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Outer Fort Rampart Base Outline */}
        <path
          d="
            M 0 240
            L 0 170
            L 120 170
            L 120 155
            L 180 155
            L 180 170
            L 320 170
            L 320 140
            L 340 140
            L 340 110
            L 350 110
            L 350 90
            Q 360 70 370 90
            L 370 110
            L 380 110
            L 380 140
            L 420 140
            L 420 170
            L 500 170
            L 500 120
            L 520 120
            L 520 80
            Q 530 60 540 80
            L 540 120
            L 550 120
            L 550 100
            Q 600 40 650 100
            L 650 120
            L 660 120
            L 660 80
            Q 670 60 680 80
            L 680 120
            L 700 120
            L 700 170
            L 780 170
            L 780 140
            L 820 140
            L 820 110
            L 830 110
            L 830 90
            Q 840 70 850 90
            L 850 110
            L 860 110
            L 860 140
            L 880 140
            L 880 170
            L 1020 170
            L 1020 155
            L 1080 155
            L 1080 170
            L 1200 170
            L 1200 240
            Z
          "
          fill="url(#redFortFill)"
          stroke="url(#redFortStroke)"
          strokeWidth="1.5"
        />

        {/* Central Flagpole at Ramparts */}
        <line x1="600" y1="45" x2="600" y2="10" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="600" cy="8" r="3" fill="#D4AF37" />

        {/* Fluttering Indian Flag atop the Red Fort */}
        <g
          className={flagAnimate ? "animate-[bounce_3s_ease-in-out_infinite]" : ""}
          style={{ transformOrigin: "600px 15px" }}
        >
          {/* Saffron Band */}
          <path
            d="M 602 12 Q 622 8 642 14 L 642 20 Q 622 14 602 18 Z"
            fill="#FF9933"
          />
          {/* White Band */}
          <path
            d="M 602 18 Q 622 14 642 20 L 642 26 Q 622 20 602 24 Z"
            fill="#FFFFFF"
          />
          {/* Chakra in White Band */}
          <circle cx="622" cy="18" r="2.2" fill="#000080" />
          {/* Green Band */}
          <path
            d="M 602 24 Q 622 20 642 26 L 642 32 Q 622 26 602 30 Z"
            fill="#138808"
          />
        </g>

        {/* Archway Cutouts */}
        <path
          d="M 580 170 Q 600 145 620 170 Z"
          fill="#050811"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <path
          d="M 535 170 Q 550 150 565 170 Z"
          fill="#050811"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <path
          d="M 635 170 Q 650 150 665 170 Z"
          fill="#050811"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default RedFortSilhouette;
