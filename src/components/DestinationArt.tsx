type Props = {
  theme: string;
  seed: string; // destination id, used only to pick a stable accent variant
};

// Three accent rotations so cards don't all look identical, picked deterministically per id.
const PALETTES = [
  { sky: "#f3ecda", far: "#e3d5b8", near: "#c89b3c", accent: "#16233b" },
  { sky: "#eef2ec", far: "#cfe0d3", near: "#2f8f6b", accent: "#16233b" },
  { sky: "#f6e9e3", far: "#e8c9bb", near: "#c8503f", accent: "#16233b" },
];

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return PALETTES[hash % PALETTES.length];
}

export default function DestinationArt({ theme, seed }: Props) {
  const p = pickPalette(seed);
  const common = { viewBox: "0 0 320 180", xmlns: "http://www.w3.org/2000/svg", className: "w-full h-full" };

  switch (theme) {
    case "mountain":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <circle cx="250" cy="45" r="22" fill={p.near} opacity="0.5" />
          <polygon points="0,140 70,55 130,140" fill={p.far} />
          <polygon points="90,140 170,40 250,140" fill={p.near} />
          <polygon points="60,140 100,90 140,140" fill={p.accent} opacity="0.15" />
          <rect y="140" width="320" height="40" fill={p.accent} opacity="0.08" />
        </svg>
      );
    case "coast":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <circle cx="260" cy="40" r="20" fill={p.near} opacity="0.55" />
          <polygon points="0,120 90,85 180,120" fill={p.far} opacity="0.7" />
          <rect y="125" width="320" height="55" fill={p.near} opacity="0.85" />
          <rect y="150" width="320" height="30" fill={p.accent} opacity="0.12" />
        </svg>
      );
    case "lake":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <polygon points="20,120 90,60 160,120" fill={p.far} />
          <polygon points="140,120 220,50 300,120" fill={p.near} opacity="0.8" />
          <rect y="120" width="320" height="60" fill={p.accent} opacity="0.1" />
          <ellipse cx="160" cy="150" rx="140" ry="6" fill={p.accent} opacity="0.15" />
        </svg>
      );
    case "island":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <rect y="110" width="320" height="70" fill={p.near} opacity="0.5" />
          <polygon points="120,110 160,70 200,110" fill={p.far} />
          <circle cx="160" cy="85" r="10" fill={p.accent} opacity="0.3" />
          <rect y="140" width="320" height="40" fill={p.accent} opacity="0.12" />
        </svg>
      );
    case "desert":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <circle cx="250" cy="50" r="26" fill={p.near} opacity="0.5" />
          <path d="M0,140 Q80,100 160,135 T320,120 V180 H0 Z" fill={p.far} />
          <path d="M0,160 Q100,130 200,160 T320,150 V180 H0 Z" fill={p.near} opacity="0.6" />
        </svg>
      );
    case "historic":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <rect y="130" width="320" height="50" fill={p.accent} opacity="0.08" />
          {[40, 90, 140, 190, 240].map((x, i) => (
            <rect key={i} x={x} y={i % 2 === 0 ? 70 : 90} width="26" height={i % 2 === 0 ? 70 : 50} fill={i % 2 === 0 ? p.near : p.far} />
          ))}
        </svg>
      );
    case "city":
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <rect y="140" width="320" height="40" fill={p.accent} opacity="0.08" />
          {[20, 55, 90, 130, 170, 210, 250, 285].map((x, i) => (
            <rect key={i} x={x} y={180 - (40 + (i % 4) * 22)} width="24" height={40 + (i % 4) * 22} fill={i % 2 === 0 ? p.near : p.far} opacity="0.9" />
          ))}
        </svg>
      );
    case "village":
    default:
      return (
        <svg {...common}>
          <rect width="320" height="180" fill={p.sky} />
          <polygon points="0,130 60,75 120,130" fill={p.far} opacity="0.6" />
          <rect y="130" width="320" height="50" fill={p.accent} opacity="0.07" />
          {[70, 110, 150, 190].map((x, i) => (
            <g key={i}>
              <rect x={x} y="95" width="34" height="45" fill={i % 2 === 0 ? p.near : p.far} />
              <polygon points={`${x - 4},95 ${x + 17},72 ${x + 38},95`} fill={p.accent} opacity="0.4" />
            </g>
          ))}
        </svg>
      );
  }
}
