import { getMainImage, resolveImageUrl } from "../../models/catalog/product";

const THEME_PALETTES = {
  "obsidian-lime": { bg1: "#1c1e22", bg2: "#0a0b0d", garment: "#141519", stroke: "#2d3038", accent: "#c6f500", ink: "#e8e8ea" },
  "chalk-ink": { bg1: "#d9d7d0", bg2: "#b7b5ae", garment: "#f1efe8", stroke: "#c6c3ba", accent: "#121316", ink: "#121316" },
  "mineral-acid": { bg1: "#292c30", bg2: "#121316", garment: "#33373d", stroke: "#4c525b", accent: "#c6f500", ink: "#e8e8ea" },
  "obsidian-crest": { bg1: "#181a1d", bg2: "#090a0c", garment: "#111215", stroke: "#2c2f36", accent: "#c6f500", ink: "#ffffff" },
  "heavy-backprint": { bg1: "#202226", bg2: "#0b0c0e", garment: "#16181c", stroke: "#343740", accent: "#c6f500", ink: "#e8e8ea" },
  "codex-grid": { bg1: "#25262a", bg2: "#0e0f12", garment: "#191b1f", stroke: "#383b44", accent: "#c6f500", ink: "#d8dadf" },
  "neotokyo-acid": { bg1: "#2a2e33", bg2: "#101215", garment: "#2f333a", stroke: "#4b515b", accent: "#c6f500", ink: "#f0f1f4" },
  "cyber-neon": { bg1: "#141812", bg2: "#08090a", garment: "#121417", stroke: "#2c3424", accent: "#c6f500", ink: "#c6f500" },
  "raw-sand": { bg1: "#35332d", bg2: "#181714", garment: "#d8d1c2", stroke: "#a8a08e", accent: "#16171a", ink: "#16171a" },
  "metropolis-concrete": { bg1: "#2c2e31", bg2: "#131417", garment: "#46494f", stroke: "#63676f", accent: "#c6f500", ink: "#f2f3f5" },
  "obsidian-minimal": { bg1: "#1d1e22", bg2: "#0a0b0d", garment: "#111216", stroke: "#282a30", accent: "#8a8c93", ink: "#c9cbd0" },
  "hoodie-wash": { bg1: "#24272b", bg2: "#0c0e10", garment: "#2a2e34", stroke: "#454b54", accent: "#c6f500", ink: "#e8e8ea" },
  "cargo-tactical": { bg1: "#1b1c1f", bg2: "#090a0c", garment: "#15161a", stroke: "#34373f", accent: "#c6f500", ink: "#d4d6da" },
  "beanie-knit": { bg1: "#202226", bg2: "#0c0d10", garment: "#181a1f", stroke: "#343842", accent: "#c6f500", ink: "#0c0d10" },
  "socks-duo": { bg1: "#25272b", bg2: "#0e0f12", garment: "#141519", stroke: "#33363e", accent: "#c6f500", ink: "#c6f500" },
};

/**
 * Renderiza la fotografía real del producto si existe, o una ilustración
 * brutalista de estudio fiel al catálogo KULT STUDIO para productos sin imagen cargada.
 */
export function ProductVisual({ product, imageOverride = null, className = "" }) {
  const mainImage = imageOverride ?? getMainImage(product);
  const imageUrl = mainImage ? resolveImageUrl(mainImage.url ?? mainImage) : "";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={product?.nombre || "Prenda KULT STUDIO"}
        loading="lazy"
        className={className}
      />
    );
  }

  const palette = THEME_PALETTES[product?.visualTheme] ?? THEME_PALETTES["obsidian-lime"];
  const type = product?.visualType || "tee-back";
  const label = (product?.visualTag || product?.nombre || "KULT").slice(0, 18).toUpperCase();
  const gsm = `${product?.gramajeGsm || 280} GSM`;
  const uid = `kv-${product?.idProducto || "x"}-${type}`;

  return (
    <svg
      className={`kult-visual ${className}`}
      viewBox="0 0 360 440"
      role="img"
      aria-label={product?.nombre || "Prenda KULT STUDIO"}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor={palette.bg1} />
          <stop offset="100%" stopColor={palette.bg2} />
        </radialGradient>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="360" height="440" fill={`url(#${uid}-bg)`} />
      <rect width="360" height="440" fill={`url(#${uid}-grid)`} />

      {/* Floor studio glow */}
      <ellipse cx="180" cy="378" rx="110" ry="18" fill="rgba(0,0,0,0.45)" />

      {type === "hoodie" && (
        <g>
          <path
            d="M135 88 C145 58 215 58 225 88 L268 112 L310 218 L264 236 L248 180 L248 354 L112 354 L112 180 L96 236 L50 218 L92 112 Z"
            fill={palette.garment}
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          <path d="M142 94 Q180 128 218 94" fill="none" stroke={palette.stroke} strokeWidth="2.5" />
          <rect x="136" y="254" width="88" height="58" rx="4" fill="rgba(0,0,0,0.22)" stroke={palette.stroke} strokeWidth="1.5" />
          <text x="180" y="182" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontWeight="700" fontSize="14" letterSpacing="2">
            KULT // LAB
          </text>
          <text x="180" y="202" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontSize="9" letterSpacing="3" opacity="0.75">
            {label}
          </text>
        </g>
      )}

      {type === "cargo" && (
        <g>
          <path
            d="M116 74 L244 74 L264 364 L196 364 L180 198 L164 364 L96 364 Z"
            fill={palette.garment}
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          <rect x="102" y="176" width="34" height="62" fill="rgba(255,255,255,0.03)" stroke={palette.stroke} strokeWidth="1.8" />
          <rect x="224" y="176" width="34" height="62" fill="rgba(255,255,255,0.03)" stroke={palette.stroke} strokeWidth="1.8" />
          <line x1="116" y1="96" x2="244" y2="96" stroke={palette.accent} strokeWidth="2" strokeDasharray="6 4" />
          <text x="180" y="138" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontWeight="700" fontSize="11" letterSpacing="2">
            RIPSTOP V.2
          </text>
        </g>
      )}

      {type === "beanie" && (
        <g>
          <path
            d="M96 244 C96 144 264 144 264 244 L268 302 L92 302 Z"
            fill={palette.garment}
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          <line x1="92" y1="248" x2="268" y2="248" stroke={palette.stroke} strokeWidth="2.5" />
          {[118, 142, 166, 194, 218, 242].map((x) => (
            <line key={x} x1={x} y1="168" x2={x} y2="298" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          ))}
          <rect x="144" y="256" width="72" height="34" fill={palette.accent} />
          <text x="180" y="278" textAnchor="middle" fill={palette.ink} fontFamily="sans-serif" fontWeight="800" fontSize="14" letterSpacing="1.5">
            KULT
          </text>
        </g>
      )}

      {type === "socks" && (
        <g>
          <rect x="108" y="92" width="144" height="244" rx="2" fill="#181a1e" stroke={palette.stroke} strokeWidth="2" />
          <rect x="128" y="138" width="104" height="58" fill={palette.garment} stroke={palette.accent} strokeWidth="1.5" />
          <rect x="128" y="220" width="104" height="58" fill={palette.garment} stroke={palette.accent} strokeWidth="1.5" />
          <text x="180" y="172" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontWeight="700" fontSize="12" letterSpacing="1.5">
            CYBER // KULT
          </text>
          <text x="180" y="254" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontWeight="700" fontSize="12" letterSpacing="1.5">
            STREETHREADS
          </text>
          <text x="180" y="118" textAnchor="middle" fill="#8a8c93" fontFamily="monospace" fontSize="9" letterSpacing="2">
            DUO PACK · 02
          </text>
        </g>
      )}

      {(type === "tee-back" || type === "tee-front" || type === "tee-wash" || type === "tee-puff" || type === "tee-minimal") && (
        <g>
          {/* Heavyweight Boxy Tee Silhouette */}
          <path
            d="M134 92 L152 108 C168 118 192 118 208 108 L226 92 L286 118 L314 196 L262 214 L248 176 L248 352 L112 352 L112 176 L98 214 L46 196 L74 118 Z"
            fill={palette.garment}
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
          {/* Reinforced 1.2" rib collar */}
          <path d="M136 93 Q180 124 224 93" fill="none" stroke={palette.stroke} strokeWidth="5" />
          {/* Drop shoulder stitch lines */}
          <line x1="112" y1="138" x2="112" y2="178" stroke={palette.stroke} strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="248" y1="138" x2="248" y2="178" stroke={palette.stroke} strokeWidth="1.5" strokeDasharray="3 3" />

          {type === "tee-minimal" ? (
            <g>
              <rect x="158" y="138" width="44" height="12" fill="none" stroke={palette.accent} strokeWidth="1.2" opacity="0.7" />
              <text x="180" y="147" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontSize="7" letterSpacing="1.5">
                KULT LAB
              </text>
              <line x1="120" y1="336" x2="240" y2="336" stroke={palette.stroke} strokeWidth="1" strokeDasharray="4 4" />
            </g>
          ) : type === "tee-puff" ? (
            <g>
              <polygon points="180,146 226,184 210,248 150,248 134,184" fill="none" stroke={palette.accent} strokeWidth="3" />
              <polygon points="180,162 212,188 200,236 160,236 148,188" fill={palette.accent} fillOpacity="0.14" stroke={palette.accent} strokeWidth="1.5" />
              <text x="180" y="206" textAnchor="middle" fill={palette.accent} fontFamily="sans-serif" fontWeight="800" fontSize="20" letterSpacing="2">
                KULT
              </text>
              <text x="180" y="224" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontSize="8" letterSpacing="2">
                PUFF 3D // DROP 04
              </text>
            </g>
          ) : type === "tee-wash" ? (
            <g>
              <rect x="136" y="148" width="88" height="124" fill="none" stroke={palette.accent} strokeWidth="1.5" />
              <text x="180" y="182" textAnchor="middle" fill={palette.accent} fontFamily="sans-serif" fontWeight="800" fontSize="18" letterSpacing="1">
                ネオ東京
              </text>
              <line x1="146" y1="196" x2="214" y2="196" stroke={palette.accent} strokeWidth="1.5" />
              <text x="180" y="218" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontWeight="700" fontSize="11" letterSpacing="2">
                ACID WASH
              </text>
              <text x="180" y="238" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontSize="9" letterSpacing="1.5">
                {label}
              </text>
              <text x="180" y="260" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontSize="8" opacity="0.65">
                SERIALIZED // 150
              </text>
            </g>
          ) : (
            <g>
              <rect x="134" y="150" width="92" height="118" fill="rgba(0,0,0,0.12)" stroke={palette.stroke} strokeWidth="1.2" />
              <text x="180" y="182" textAnchor="middle" fill={palette.accent} fontFamily="sans-serif" fontWeight="800" fontSize="19" letterSpacing="2">
                KULT
              </text>
              <text x="180" y="200" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontWeight="700" fontSize="9" letterSpacing="2">
                STUDIO // ARCHIVE
              </text>
              <line x1="148" y1="214" x2="212" y2="214" stroke={palette.accent} strokeWidth="2" />
              <text x="180" y="234" textAnchor="middle" fill={palette.ink} fontFamily="monospace" fontSize="8.5" letterSpacing="1.4" opacity="0.85">
                {label}
              </text>
              <text x="180" y="254" textAnchor="middle" fill={palette.accent} fontFamily="monospace" fontSize="8" letterSpacing="2">
                {gsm} · BOG // MDE
              </text>
            </g>
          )}
        </g>
      )}

      {/* Subtle corner technical reticle */}
      <text x="16" y="424" fill={palette.ink} opacity="0.45" fontFamily="monospace" fontSize="9" letterSpacing="2">
        SPEC // {gsm}
      </text>
      <text x="344" y="424" textAnchor="end" fill={palette.accent} opacity="0.7" fontFamily="monospace" fontSize="9" letterSpacing="2">
        DROP 04
      </text>
    </svg>
  );
}
