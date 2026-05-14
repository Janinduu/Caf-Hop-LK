interface Props {
  size?: number;
  className?: string;
}

export function CupIcon({ size = 48, className = "" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 0 120 180"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(160, 0)"
      >
        <path d="M-40 145 L-40 105 Q-40 92 -28 92 L28 92 Q40 92 40 105 L40 145 Q40 158 22 165 L-22 165 Q-40 158 -40 145 Z" />
        <path d="M40 112 Q58 112 58 127 Q58 142 40 142" />
        <line x1="-50" y1="170" x2="50" y2="170" />
        <path d="M0 86 Q-6 68 0 52 Q6 36 0 20" className="logo-steam" />
        <path
          d="M14 84 Q9 70 14 58"
          opacity={0.6}
          className="logo-steam-2"
        />
      </g>
    </svg>
  );
}

export function FullLogo({
  size = 72,
  variant = "dark",
}: Props & { variant?: "dark" | "light" }) {
  const width = size * (320 / 280);
  const cupColor = variant === "light" ? "#f5efe4" : "#1a1a1a";
  const lkColor = variant === "light" ? "#e9b865" : "#3d2b1f";
  const lineColor = variant === "light" ? "#f5efe4" : "#1a1a1a";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 280"
      width={width}
      height={size}
      role="img"
      aria-label="CaféHop LK"
      className="shrink-0"
    >
      <g
        fill="none"
        stroke={cupColor}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(160, 0)"
      >
        <path d="M-40 145 L-40 105 Q-40 92 -28 92 L28 92 Q40 92 40 105 L40 145 Q40 158 22 165 L-22 165 Q-40 158 -40 145 Z" />
        <path d="M40 112 Q58 112 58 127 Q58 142 40 142" />
        <line x1="-50" y1="170" x2="50" y2="170" />
        <path d="M0 86 Q-6 68 0 52 Q6 36 0 20" className="logo-steam" />
        <path
          d="M14 84 Q9 70 14 58"
          opacity={0.55}
          className="logo-steam-2"
        />
      </g>
      {/* Wordmark — black */}
      <text
        fill={cupColor}
        x="160"
        y="225"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="38"
        fontWeight="400"
        letterSpacing="1.5"
      >
        CaféHop
      </text>
      <line
        x1="105"
        y1="235"
        x2="142"
        y2="235"
        stroke={lineColor}
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="178"
        y1="235"
        x2="215"
        y2="235"
        stroke={lineColor}
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* LK accent */}
      <text
        fill={lkColor}
        x="160"
        y="255"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        letterSpacing="10"
      >
        LK
      </text>
    </svg>
  );
}
