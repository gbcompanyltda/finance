export function Sparkline({ data, height = 56 }: { data: number[]; height?: number }) {
  if (data.length < 2) return null;

  const w = 340;
  const h = 60;
  const pad = 5;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });

  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="block"
      aria-hidden
    >
      <polyline
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#0b2545"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r={4} fill="#2a78d6" />
    </svg>
  );
}
