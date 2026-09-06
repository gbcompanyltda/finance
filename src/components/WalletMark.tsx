interface WalletMarkProps {
  /** Rendered pixel size (square). */
  size?: number;
  /** Stroke color of the wallet body. */
  color?: string;
  /** Fill of the clasp dot (the single accent element). */
  dotColor?: string;
  /**
   * Force the reduced construction (no flap, no clasp dot, heavier stroke).
   * Defaults on automatically at 26px and below.
   */
  minimal?: boolean;
  title?: string;
  className?: string;
}

/**
 * Finance brand mark — continuous-stroke geometric wallet.
 * Paths and scale rules come from design_handoff_finance_app/README.md ("A marca").
 * At 24px and below the flap and clasp dot drop and the stroke thickens;
 * the body + clasp aperture carry the read.
 */
export function WalletMark({
  size = 40,
  color = "currentColor",
  dotColor = "#2a78d6",
  minimal,
  title,
  className,
}: WalletMarkProps) {
  const reduced = minimal ?? size <= 26;
  const stroke = reduced
    ? size <= 16
      ? 5.6
      : size <= 20
        ? 5
        : 4.6
    : size >= 40
      ? 3
      : 3.4;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ color, display: "block", flex: "none" }}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {!reduced && (
        <path
          d="M12.5 13V10.2C12.5 8.3 14.2 6.9 16.1 7.3L33.6 11"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      )}
      <path
        d="M12 13H36C39.3 13 42 15.7 42 19V35C42 38.3 39.3 41 36 41H12C8.7 41 6 38.3 6 35V19C6 15.7 8.7 13 12 13Z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path
        d="M42 23H33C30.8 23 29 24.8 29 27C29 29.2 30.8 31 33 31H42"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      {!reduced && <circle cx="34.6" cy="27" r="2.1" fill={dotColor} />}
    </svg>
  );
}
