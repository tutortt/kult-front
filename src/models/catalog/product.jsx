import { getApiUrl } from "../../config/environment";
import { formatMoney } from "../currency/currency";

/** Formatea un precio usando la divisa activa (COP o USD). */
export function formatPrice(amount, currency) {
  return formatMoney(amount, currency);
}

/** @param {number} stock */
export function isAvailable(stock) {
  return Number(stock) > 0;
}

/** Resuelve una ruta relativa del backend contra la URL base configurada. */
export function resolveImageUrl(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:|\/assets\/)/i.test(url)) return url;
  if (url.startsWith("/src/") || url.includes(".webp") || url.includes(".png") || url.includes(".jpg")) {
    if (!url.startsWith("/api/")) return url;
  }
  return `${getApiUrl().replace(/\/$/, "")}/${String(url).replace(/^\//, "")}`;
}

/** Devuelve la imagen principal, o la primera disponible. */
export function getMainImage(producto) {
  const imagenes = Array.isArray(producto?.imagenes) ? producto.imagenes : [];
  return imagenes.find((imagen) => imagen.principal) ?? imagenes[0] ?? null;
}

/** Etiqueta corta de tallas para las tarjetas del catálogo. */
export function formatTallas(producto) {
  const tallas = Array.isArray(producto?.tallas) ? producto.tallas : [];
  return tallas.join(" ");
}

export const PIGMENT_OPTIONS = Object.freeze([
  { id: "negro", label: "Negro Obsidiana", swatch: "#111216", border: "#33353b", match: /negro|black|obsidiana/i },
  { id: "blanco", label: "Blanco Roto Natural", swatch: "#f2efe8", border: "#d6d2c8", match: /blanco|white|roto|crudo|crema/i },
  { id: "gris", label: "Gris Lavado Mineral", swatch: "#4b4f55", border: "#666a72", match: /gris|grafito|mineral|grey|acid|lavado/i },
  { id: "verde", label: "Verde Ácido Cyber", swatch: "#c6f500", border: "#c6f500", match: /verde|ne[oó]n|lime|cyber|[aá]cido/i },
]);

export const FIT_OPTIONS = Object.freeze([
  "Oversized Silhouette",
  "Boxy Fit Estructurado",
  "Drop Shoulder Pesado",
  "Regular Fit Clásico",
]);

export const GSM_OPTIONS = Object.freeze([
  { id: "heavyweight", label: "Heavyweight (280+ GSM)", tag: "CORE", match: (gsm) => gsm >= 280 && gsm < 350 },
  { id: "ultra-heavy", label: "Ultra-Heavy (350+ GSM Raw)", tag: "SPEC", match: (gsm) => gsm >= 350 },
  { id: "midweight", label: "Midweight (220 GSM Summer)", tag: "LIGHT", match: (gsm) => gsm > 0 && gsm < 280 },
]);

export const SIZE_OPTIONS = Object.freeze(["XS", "S", "M", "L", "XL", "XXL"]);

export function getColorHex(colorName) {
  const str = String(colorName || "");
  const found = PIGMENT_OPTIONS.find((p) => p.match.test(str));
  return found ? found.swatch : "#1b1c1f";
}

export function extractPigmentIds(producto) {
  const colors = Array.isArray(producto?.colores) ? producto.colores : [];
  const variantColors = (producto?.variantes ?? []).map((v) => v.color).filter(Boolean);
  const all = [...colors, ...variantColors, producto?.nombre || "", producto?.descripcion || ""];
  const ids = new Set();
  for (const pigment of PIGMENT_OPTIONS) {
    if (all.some((text) => pigment.match.test(String(text)))) {
      ids.add(pigment.id);
    }
  }
  if (ids.size === 0) ids.add("negro");
  return [...ids];
}

function inferFit(p) {
  if (p.fit) return p.fit;
  const text = `${p.nombre || ""} ${p.descripcion || ""} ${p.categoria?.nombre || ""}`.toLowerCase();
  if (/drop\s*shoulder|hombro\s*ca/i.test(text)) return "Drop Shoulder Pesado";
  if (/boxy|cuadrad/i.test(text)) return "Boxy Fit Estructurado";
  if (/regular|cl[aá]sic|slim/i.test(text)) return "Regular Fit Clásico";
  return "Oversized Silhouette";
}

function inferTechnique(p) {
  if (p.technique) return p.technique;
  const text = `${p.nombre || ""} ${p.descripcion || ""}`.toLowerCase();
  if (/puff|3d|relieve/i.test(text)) return "Puff 3D";
  if (/acid|lavado|mineral|degrad/i.test(text)) return "Acid Wash & Degradé";
  if (/minimal|blank|crudo|esencial/i.test(text)) return "Minimal Core";
  return "Serigrafía Alta Densidad";
}

function inferBadge(p, realStock) {
  if (realStock <= 0) return { badge: "AGOTADO", badgeVariant: "red" };
  if (realStock <= 5) return { badge: `ÚLTIMAS ${realStock} UDS`, badgeVariant: "red" };
  if (p.badge) return { badge: p.badge, badgeVariant: p.badgeVariant || "lime" };
  const gsm = Number(p.gramajeGsm) || 280;
  if (gsm >= 350) return { badge: "EDICIÓN LIMITADA", badgeVariant: "lime" };
  if (Number(p.idProducto) % 2 === 1) return { badge: "NUEVO DROP", badgeVariant: "lime" };
  return { badge: "TOP VENTAS", badgeVariant: "dark" };
}

/**
 * Enriquece cualquier producto (del backend Spring Boot o del catálogo fallback)
 * con metadatos normalizados para las tarjetas y filtros técnicos de KULT STUDIO,
 * respetando siempre las variantes y el stock reales de la base de datos.
 */
export function enrichProduct(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const id = Number(raw.idProducto) || 0;
  const gsm = Number(raw.gramajeGsm) || 280;
  const fit = inferFit(raw);
  const technique = inferTechnique(raw);

  const variantes = Array.isArray(raw.variantes)
    ? raw.variantes.map((v) => ({
        ...v,
        idVariante: Number(v.idVariante),
        stock: Math.max(0, Number(v.stock) || 0),
      }))
    : [];

  const stock =
    variantes.length > 0
      ? variantes.reduce((sum, v) => sum + v.stock, 0)
      : Math.max(0, Number(raw.stock) || 0);

  const tallas =
    Array.isArray(raw.tallas) && raw.tallas.length > 0
      ? raw.tallas
      : [...new Set(variantes.map((v) => v.talla).filter(Boolean))];
  const colores =
    Array.isArray(raw.colores) && raw.colores.length > 0
      ? raw.colores
      : [...new Set(variantes.map((v) => v.color).filter(Boolean))];

  const { badge, badgeVariant } = inferBadge(raw, stock);
  const catName = String(raw.categoria?.nombre || "").toLowerCase();
  const text = `${raw.nombre || ""} ${raw.descripcion || ""} ${catName}`.toLowerCase();

  return {
    ...raw,
    idProducto: id,
    gramajeGsm: gsm,
    stock,
    tallas,
    colores: colores.length ? colores : ["Negro Obsidiana"],
    variantes,
    skuCode: raw.skuCode || `KULT // SS25-${String(id).padStart(2, "0")}`,
    skuShort: raw.skuShort || `KLT-04-${String(id).padStart(3, "0")}`,
    fit,
    fitShort: raw.fitShort || (gsm >= 350 ? "ULTRA-HEAVY" : fit.split(" ").slice(0, 2).join(" ").toUpperCase()),
    technique,
    badge,
    badgeVariant,
    pigmentIds: extractPigmentIds({ ...raw, colores, variantes }),
    releaseStatus: stock > 0 ? raw.releaseStatus || "in-stock" : "out-of-stock",
    isNew: raw.isNew !== undefined ? raw.isNew : true,
    isGraphic: raw.isGraphic !== undefined ? raw.isGraphic : /gr[aá]fic|serigraf|puff|acid|override|tokyo|cyber|codex|metropolis/i.test(text),
    isOversized: raw.isOversized !== undefined ? raw.isOversized : /oversiz|boxy|drop|heavy|tee|camiseta|hoodie/i.test(text),
    visualTheme: raw.visualTheme || (id % 3 === 0 ? "mineral-acid" : id % 2 === 0 ? "chalk-ink" : "obsidian-lime"),
    visualTag: raw.visualTag || `KULT // ${gsm}G`,
    visualType: raw.visualType || (/hoodie|buzo/i.test(text) ? "hoodie" : /cargo|pantal/i.test(text) ? "cargo" : /beanie|gorro/i.test(text) ? "beanie" : /sock|media/i.test(text) ? "socks" : "tee-back"),
  };
}
