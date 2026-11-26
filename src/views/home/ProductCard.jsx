import { useState } from "react";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { productPath } from "../../controllers/router/navigation";
import { useWishlist } from "../../controllers/wishlist/useWishlist";
import { addToCart } from "../../models/cart/cart";
import { getMainImage, isAvailable } from "../../models/catalog/product";
import { toggleWishlist } from "../../models/wishlist/wishlist";
import { ProductVisual } from "../catalogo/ProductVisual";
import { HeartIcon } from "../icons";
import { Link } from "../Link";

/** Tarjeta de producto destacada del Drop 04 en el Home (fiel a Home.png). */
export function ProductCard({ product }) {
  const { format } = useCurrency();
  const wishlist = useWishlist();
  const [addedSize, setAddedSize] = useState("");

  const image = getMainImage(product);
  const disponible = isAvailable(product.stock);
  const saved = wishlist.has(product.idProducto);
  const gramaje = product.gramajeGsm ? `${product.gramajeGsm} GSM` : "280 GSM";
  const fit = product.fitShort || product.categoria?.nombre || "BOXY FIT";
  const tallas = Array.isArray(product.tallas) ? product.tallas : [];

  function quickAdd(e, sizePref = "") {
    e.preventDefault();
    e.stopPropagation();
    if (!disponible) return;
    const variantes = product.variantes ?? [];
    const variante =
      (sizePref ? variantes.find((v) => v.talla === sizePref && Number(v.stock) > 0) : null) ??
      variantes.find((v) => Number(v.stock) > 0);
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
        imagenUrl: image?.url ?? "",
        cantidad: 1,
      },
      { openDrawer: true },
    );
    if (res.ok) {
      setAddedSize(variante.talla);
      window.setTimeout(() => setAddedSize(""), 1300);
    }
  }

  return (
    <article className={`prod${!disponible ? " prod--soldout" : ""}`}>
      <div className="img">
        <div className="badges mono">
          <span className={!disponible || product.badgeVariant === "red" ? "red" : "hot"}>
            {!disponible ? "AGOTADO" : `${product.stock} EN STOCK`}
          </span>
          <span>{gramaje}</span>
        </div>

        <button
          type="button"
          className={`prod-wish${saved ? " on" : ""}`}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.idProducto);
          }}
        >
          <HeartIcon />
        </button>

        <Link to={productPath(product.idProducto)} className="prod-img-link" aria-label={`Ver ficha de ${product.nombre}`}>
          <ProductVisual product={product} />
        </Link>
      </div>

      <div className="info">
        <div className="sku mono">
          <span>SKU: {product.skuShort || `KLT-04-${String(product.idProducto).padStart(3, "0")}`}</span>
          <b>{fit}</b>
        </div>
        <h3>
          <Link to={productPath(product.idProducto)}>{product.nombre}</Link>
        </h3>
        <div className="pr">
          <strong>{format(product.precio)}</strong>
          <div className="pr-sizes" aria-label="Tallas con agregado rápido">
            {tallas.slice(0, 4).map((t) => {
              const hasSizeStock = (product.variantes ?? []).some((v) => v.talla === t && Number(v.stock) > 0);
              return (
                <button
                  key={t}
                  type="button"
                  className={addedSize === t ? "on" : undefined}
                  title={hasSizeStock ? `Agregar talla ${t} al carrito` : `Talla ${t} agotada`}
                  onClick={(e) => quickAdd(e, t)}
                  disabled={!hasSizeStock}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="btn lime prod-quick-btn"
          disabled={!disponible}
          onClick={(e) => quickAdd(e)}
        >
          {!disponible ? "AGOTADO" : addedSize ? `TALLA ${addedSize} AÑADIDA ✓` : "COMPRAR AHORA →"}
        </button>
      </div>
    </article>
  );
}
