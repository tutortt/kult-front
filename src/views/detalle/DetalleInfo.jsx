import { useState } from "react";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { useWishlist } from "../../controllers/wishlist/useWishlist";
import { addToCart } from "../../models/cart/cart";
import { getMainImage, isAvailable } from "../../models/catalog/product";
import { toggleWishlist } from "../../models/wishlist/wishlist";
import { HeartIcon } from "../icons";

const SWATCHES = [
  { match: /negro|black/i, color: "#111216" },
  { match: /blanco|white|roto|crudo/i, color: "#e6e3d9" },
  { match: /grafito|gris|grey|plata|mineral/i, color: "#4b4f55" },
  { match: /ne[oó]n|lime|verde|[aá]cido/i, color: "#c6f500" },
  { match: /azul|blue/i, color: "#2c4a7a" },
  { match: /rojo|red/i, color: "#a32b2b" },
];

function colorFor(nombre) {
  const texto = String(nombre ?? "").toLowerCase().trim();
  const partes = texto.split("/").map((parte) => parte.trim());
  const resolver = (parte) =>
    SWATCHES.find((entrada) => entrada.match.test(parte))?.color ??
    `hsl(${(parte.length * 47) % 360} 16% 42%)`;

  if (partes.length > 1) {
    return `linear-gradient(135deg, ${resolver(partes[0])} 50%, ${resolver(partes[1])} 50%)`;
  }
  return resolver(texto);
}

/** Bloque de compra de la ficha: precio, variantes, favoritos, stock y agregar al carrito. */
export function DetalleInfo({ product }) {
  const { formatParts } = useCurrency();
  const wishlist = useWishlist();
  const tallas = Array.isArray(product.tallas) ? product.tallas : [];
  const colores = Array.isArray(product.colores) ? product.colores : [];
  const variantes = Array.isArray(product.variantes) ? product.variantes : [];
  const disponible = isAvailable(product.stock);
  const saved = wishlist.has(product.idProducto);

  const [talla, setTalla] = useState(tallas[0] ?? "");
  const [color, setColor] = useState(colores[0] ?? "");
  const [agregado, setAgregado] = useState(false);
  const [msg, setMsg] = useState("");

  const varianteSeleccionada =
    variantes.find((v) => (!talla || v.talla === talla) && (!color || v.color === color)) ??
    variantes.find((v) => !talla || v.talla === talla) ??
    variantes[0] ??
    null;

  const stockVariante = varianteSeleccionada ? Number(varianteSeleccionada.stock) || 0 : Number(product.stock) || 0;
  const sinStock = !varianteSeleccionada ? !disponible : stockVariante < 1;
  const price = formatParts(product.precio);

  function handleAdd() {
    if (sinStock) return;
    if (!varianteSeleccionada) {
      setMsg("Selecciona una combinación disponible.");
      return;
    }
    const imagen = getMainImage(product);
    const result = addToCart(
      {
        idProducto: product.idProducto,
        idVariante: varianteSeleccionada.idVariante,
        nombre: product.nombre,
        sku: product.skuCode,
        talla: varianteSeleccionada.talla,
        color: varianteSeleccionada.color,
        gramajeGsm: product.gramajeGsm,
        badge: product.badge,
        precio: Number(product.precio) || 0,
        stock: stockVariante,
        imagenUrl: imagen?.url ?? "",
        cantidad: 1,
      },
      { openDrawer: true },
    );
    if (!result.ok) {
      setMsg(result.message || "No se pudo agregar al carrito.");
      return;
    }
    setMsg("");
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1400);
  }

  return (
    <div className="det-info">
      <div className="det-info-top mono">
        <span>Serie cyber-archive // {product.skuCode || "SS25"}</span>
        <span className="det-rating">★ 4.9 (142)</span>
      </div>

      <h1 className="det-title">{product.nombre}</h1>
      <p className="det-subtitle">{product.fit || "Acid wash special edition"} · {product.gramajeGsm || 280} GSM</p>

      <div className="det-price">
        <strong>{price.amount}</strong>
        <span className="mono">{price.code} · IVA INCLUIDO</span>
      </div>

      <p className="det-shipping mono">Envío gratis a toda Colombia // Entrega 24-48h</p>

      <div className="det-variant">
        <p className="det-variant-label mono">Color {color && <b>{color}</b>}</p>
        {colores.length > 0 ? (
          <div className="det-colors" role="group" aria-label="Color">
            {colores.map((nombre) => (
              <button
                key={nombre}
                type="button"
                className={`det-color${nombre === color ? " active" : ""}`}
                style={{ "--swatch": colorFor(nombre) }}
                onClick={() => {
                  setColor(nombre);
                  setMsg("");
                }}
                aria-label={`Color ${nombre}`}
                aria-pressed={nombre === color}
                title={nombre}
              >
                <span />
              </button>
            ))}
          </div>
        ) : (
          <p className="det-variant-empty mono">Color único</p>
        )}
      </div>

      <div className="det-variant">
        <p className="det-variant-label mono">
          Talla seleccionada: <b>{talla || "única"}</b>
          <a href="#detalle-tabs" className="det-size-guide">Guía de tallas y medidas ↗</a>
        </p>
        {tallas.length > 0 ? (
          <div className="det-sizes" role="group" aria-label="Talla">
            {tallas.map((nombre) => {
              const hasSizeStock = variantes.some((v) => v.talla === nombre && Number(v.stock) > 0);
              return (
                <button
                  key={nombre}
                  type="button"
                  className={`det-size${nombre === talla ? " active" : ""}`}
                  style={!hasSizeStock ? { opacity: 0.35, textDecoration: "line-through" } : undefined}
                  onClick={() => {
                    setTalla(nombre);
                    setMsg("");
                  }}
                  aria-pressed={nombre === talla}
                >
                  {nombre}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="det-variant-empty mono">Talla única</p>
        )}
        <p className="det-fit-note">
          Recomendamos tu talla habitual para un fit marcadamente oversized. Elige una talla menos si prefieres un
          corte regular.
        </p>
        <p className="det-model-note mono">El modelo mide 1.84 m y usa talla L (fit oversized)</p>
      </div>

      <p className={`det-stock mono${!sinStock ? "" : " out"}`}>
        Stock disponible: {stockVariante} unidades
      </p>
      {msg && <p className="msg err" role="status" style={{ marginTop: 8 }}>{msg}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginTop: 12 }}>
        <button
          className="btn lime det-add"
          style={{ marginTop: 0 }}
          type="button"
          disabled={sinStock || agregado}
          onClick={handleAdd}
        >
          {sinStock
            ? "Agotado — sin stock disponible"
            : agregado
              ? "Agregado al carrito ✓"
              : `Agregar al carrito (${price.amount} ${price.code})`}
        </button>
        <button
          type="button"
          className="btn dark"
          style={{
            minWidth: 52,
            padding: 0,
            border: `1px solid ${saved ? "var(--lime)" : "var(--line)"}`,
            color: saved ? "var(--lime)" : "var(--text)",
          }}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.idProducto)}
        >
          <HeartIcon />
        </button>
      </div>

      <p className="det-detail-copy">{product.descripcion || "Pieza seriada del Drop 04 de KULT Studio."}</p>
    </div>
  );
}
