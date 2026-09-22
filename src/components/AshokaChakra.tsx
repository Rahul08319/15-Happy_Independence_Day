import React from "react";

interface AshokaChakraProps {
  size?: number;
  className?: string;
  animate?: boolean;
  color?: string;
}

export const AshokaChakra: React.FC<AshokaChakraProps> = ({
  size = 64,
  className = "",
  animate = true,
  color = "#000080",
}) => {
  const radius = 90;
  const cx = 100;
  const cy = 100;
  const spokesCount = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${animate ? "animate-[spin_40s_linear_infinite]" : ""} ${className}`}
      aria-label="Ashoka Chakra"
      role="img"
    >
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth="6" />
      <circle cx={cx} cy={cy} r="18" fill={color} />
      <circle cx={cx} cy={cy} r="6" fill="#ffffff" />
      {Array.from({ length: spokesCount }).map((_, i) => {
        const angle = (i * 360) / spokesCount;
        const rad = (angle * Math.PI) / 180;
        const x2 = cx + radius * Math.cos(rad);
        const y2 = cy + radius * Math.sin(rad);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: spokesCount }).map((_, i) => {
        const angle = ((i + 0.5) * 360) / spokesCount;
        const rad = (angle * Math.PI) / 180;
        const dotRadius = radius - 10;
        const x = cx + dotRadius * Math.cos(rad);
        const y = cy + dotRadius * Math.sin(rad);
        return <circle key={`dot-${i}`} cx={x} cy={y} r="2.5" fill={color} />;
      })}
    </svg>
  );
};

export default AshokaChakra;
