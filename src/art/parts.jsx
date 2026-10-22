import { useId } from 'react';

// Shared SVG building blocks for the art components.

export function useUid() {
  return useId().replace(/[^a-zA-Z0-9]/g, '');
}

// n petals (ellipses) radiating from (cx, cy)
export function Petals({ cx, cy, n, len, w, fill, stroke, start = 0, offset = 0 }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - offset - len / 2}
          rx={w / 2}
          ry={len / 2}
          fill={Array.isArray(fill) ? fill[i % fill.length] : fill}
          stroke={stroke}
          strokeWidth={stroke ? 0.8 : 0}
          transform={`rotate(${start + (360 / n) * i} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

// 4-point sparkle star
export function Sparkle({ x, y, r = 4, fill = '#fff6b0' }) {
  const k = r * 0.28;
  return (
    <path
      d={`M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`}
      fill={fill}
    />
  );
}

// leaf shape from base (x,y) pointing at angle (deg, 0 = up)
export function Leaf({ x, y, len = 14, w = 7, angle = 0, fill = '#4caf50', vein }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        d={`M0 0 C ${w} ${-len * 0.3}, ${w} ${-len * 0.8}, 0 ${-len} C ${-w} ${-len * 0.8}, ${-w} ${-len * 0.3}, 0 0 Z`}
        fill={fill}
      />
      {vein && <path d={`M0 0 L0 ${-len * 0.85}`} stroke={vein} strokeWidth="0.8" fill="none" />}
    </g>
  );
}

export function Glow({ id, color, opacity = 0.55 }) {
  return (
    <radialGradient id={id}>
      <stop offset="0%" stopColor={color} stopOpacity={opacity} />
      <stop offset="100%" stopColor={color} stopOpacity="0" />
    </radialGradient>
  );
}

// Wraps content in the standard 100x100 svg. silhouette => solid black.
export function Svg({ size, silhouette, children, label }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      style={silhouette ? { filter: 'brightness(0)' } : undefined}
    >
      {children}
    </svg>
  );
}
