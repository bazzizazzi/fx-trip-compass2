type Props = {
  pct: number; // signed % move, positive = home currency stronger now
  size?: "sm" | "lg";
};

// Clamp the visual scale so a wild outlier (e.g. ARS) doesn't flatten the rest
// Typical moves in the dataset are 2-12%; a handful of outliers (ARS, TRY, EGP)
// run much higher. ±20 keeps the common case readable while still clamping
// extreme outliers so they don't just peg the bar at 100%.
const SCALE = 20;
const MIN_VISIBLE_PCT = 4; // never render a sliver so thin it reads as a dot

export default function FxMeter({ pct, size = "sm" }: Props) {
  const clamped = Math.max(-SCALE, Math.min(SCALE, pct));
  const posPct = ((clamped + SCALE) / (2 * SCALE)) * 100;
  const positive = pct >= 0;
  const height = size === "lg" ? "h-3" : "h-2";
  const color = positive ? "bg-emerald" : "bg-coral";
  const rawWidth = Math.abs(posPct - 50);
  const width = rawWidth === 0 ? 0 : Math.max(rawWidth, MIN_VISIBLE_PCT);

  return (
    <div className="w-full">
      <div className={`relative w-full ${height} rounded-full bg-ink/10 overflow-hidden`}>
        {/* center line = "no change" */}
        <div className="absolute inset-y-0 right-1/2 w-px bg-ink/25 z-10" />
        {width > 0 && (
          <div
            className={`absolute inset-y-0 ${color} rounded-full transition-all`}
            style={
              positive
                ? { right: "50%", width: `${width}%` }
                : { left: "50%", width: `${width}%` }
            }
          />
        )}
      </div>
    </div>
  );
}
