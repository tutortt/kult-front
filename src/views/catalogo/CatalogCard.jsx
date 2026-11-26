import { useState } from "react";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { productPath } from "../../controllers/router/navigation";
import { useWishlist } from "../../controllers/wishlist/useWishlist";
import { addToCart, openCartDrawer } from "../../models/cart/cart";
import { getColorHex, getMainImage, isAvailable } from "../../models/catalog/product";
import { toggleWishlist } from "../../models/wishlist/wishlist";
import { HeartIcon } from "../icons";
import { Link } from "../Link";
import { ProductVisual } from "./ProductVisual";

/**
 * Tarjeta de catálogo fiel a las referencias (Colección, Novedades, Gráficas, Oversized).
 * Soporta selección rápida de talla, favoritos y agregado directo al carrito con feedback.
 *
 * @param {{ product: any, variant?: "coleccion" | "novedades" | "graficas" | "oversized" }} props
 */
export function CatalogCard({ product, variant = "coleccion" }) {
  const { formatParts } = useCurrency();
  const wishlist = useWishlist();
  const [selectedSize, setSelectedSize] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const disponible = isAvailable(product.stock);
  const saved = wishlist.has(product.idProducto);
  const price = formatParts(product.precio);
  const mainImage = getMainImage(product);
  const tallas = Array.isArray(product.tallas) ? product.tallas : [];
  const colors = Array.isArray(product.colores) && product.colores.length > 0 ? product.colores : ["Negro Obsidiana"];

  function pickVariant(sizeOverride) {
    const variantes = Array.isArray(product.variantes) ? product.variantes : [];
    const targetSize = sizeOverride || selectedSize;
    if (targetSize) {
      const exact = variantes.find((v) => v.talla === targetSize && Number(v.stock) > 0);
      if (exact) return exact;
    }
    return variantes.find((v) => Number(v.stock) > 0) ?? null;
  }

  function handleBuy(e, sizeOverride = "") {
    e.preventDefault();
    e.stopPropagation();
    if (!disponible) return;
    const variante = pickVariant(sizeOverride);
    if (!variante || Number(variante.stock) < 1) return;
    const res = addToCart(
      {
        idProducto: product.idProducto,
        idVariante: variante.idVariante,
        nombre: product.nombre,
        sku: product.skuCode,
        talla: variante.talla,
        color: variante.color,
        gramajeGsm: product.gramajeGsm,
        badge: product.badge,
        precio: Number(product.precio) || 0,
        stock: Number(variante.stock) || 0,
        imagenUrl: mainImage?.url ?? "",
        cantidad: 1,
      },
      { openDrawer: true },
    );
    if (res.ok) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1200);
    } else {
      openCartDrawer();
    }
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.idProducto);
  }

  const badgeClass =
    !disponible || product.badgeVariant === "red"
      ? "kcard-bdg red"
      : product.badgeVariant === "dark"
        ? "kcard-bdg dark"
        : "kcard-bdg lime";

  return (
    <article className={`kcard kcard--${variant}${!disponible ? " kcard--soldout" : ""}`}>
      <div className="kcard-media">
        <Link to={productPath(product.idProducto)} className="kcard-media-link" aria-label={`Ver ${product.nombre}`}>
          <ProductVisual product={product} />
        </Link>

        <span className="kcard-code mono">
          {variant === "oversized" ? `${product.gramajeGsm} GSM` : product.skuCode}
        </span>

        {(product.badge || !disponible) && (
          <span className={`${badgeClass} mono`}>
            {!disponible ? "AGOTADO" : variant === "oversized" ? product.fitShort : product.badge}
          </span>
        )}

        <button
          type="button"
          className={`kcard-wish${saved ? " on" : ""}`}
          onClick={handleWishlist}
          aria-label={saved ? `Quitar ${product.nombre} de favoritos` : `Guardar ${product.nombre} en favoritos`}
          aria-pressed={saved}
        >
          <HeartIcon />
        </button>

        {disponible && (
          <div className="kcard-quick-sizes" aria-label="Agregar rápido por talla">
            <span className="mono">AGREGAR RÁPIDO:</span>
            <div>
              {tallas.slice(0, 5).map((t) => {
                const vStock = (product.variantes ?? []).some((v) => v.talla === t && Number(v.stock) > 0);
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={!vStock}
                    className={selectedSize === t ? "on" : undefined}
                    onClick={(e) => {
                      setSelectedSize(t);
                      handleBuy(e, t);
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="kcard-body">
        <div className="kcard-meta mono">
          <b>
            {variant === "graficas"
              ? `${product.technique} · ${product.gramajeGsm} GSM`
              : `${product.fitShort} · ${product.gramajeGsm} GSM`}
          </b>
          <span className="kcard-swatches" aria-label="Colores disponibles">
            {colors.slice(0, 3).map((c) => (
              <i
                key={c}
                title={c}
                style={{
                  background: getColorHex(c),
                  borderColor: /blanco|crudo|verde|ne[oó]n/i.test(c) ? getColorHex(c) : "#454852",
                }}
              />
            ))}
          </span>
        </div>

        <h3 className="kcard-title">
          <Link to={productPath(product.idProducto)}>{product.nombre}</Link>
        </h3>

        <p className="kcard-desc">
          {product.descripcion || "Algodón orgánico de alto gramaje con corte arquitectónico KULT STUDIO."}
        </p>

        <div className={`kcard-stock-line mono${!disponible ? " out" : product.stock <= 5 ? " low" : ""}`}>
          <span>{disponible ? `STOCK DISPONIBLE: ${product.stock} UDS` : "SIN UNIDADES DISPONIBLES"}</span>
          {tallas.length > 0 && <b>{tallas.join(" ")}</b>}
        </div>

        {variant === "oversized" ? (
          <div className="kcard-buy-stack">
            <div className="kcard-price-row">
              <span className="mono kcard-price-label">PRECIO OFICIAL</span>
              <strong>
                {price.amount} <span>{price.code}</span>
              </strong>
            </div>
            <button
              type="button"
              className="btn lime kcard-cta-full"
              disabled={!disponible}
              onClick={handleBuy}
            >
              {!disponible ? "AGOTADO" : justAdded ? "AÑADIDO A LA BOLSA ✓" : "COMPRAR AHORA →"}
            </button>
          </div>
        ) : (
          <div className="kcard-buy">
            <div className="kcard-price">
              <strong>{price.amount}</strong>
              <span className="mono">{price.code}</span>
            </div>
            <button
              type="button"
              className="btn lime kcard-cta"
              disabled={!disponible}
              onClick={handleBuy}
            >
              <span>{!disponible ? "AGOTADO" : justAdded ? "AÑADIDO ✓" : "COMPRAR AHORA"}</span>
              {disponible && !justAdded && <span aria-hidden="true">→</span>}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
