import { useEffect } from "react";
import { useProducts } from "../../controllers/catalog/useProducts";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { ROUTES, productPath } from "../../controllers/router/navigation";
import { useWishlist } from "../../controllers/wishlist/useWishlist";
import { addToCart, openCartDrawer } from "../../models/cart/cart";
import { getMainImage } from "../../models/catalog/product";
import { closeWishlistDrawer, toggleWishlist } from "../../models/wishlist/wishlist";
import { ProductVisual } from "../catalogo/ProductVisual";
import { Link } from "../Link";

export function WishlistDrawer() {
  const { ids, count, drawerOpen } = useWishlist();
  const { products } = useProducts();
  const { format } = useCurrency();

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeWishlistDrawer();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  const savedProducts = products.filter((p) => ids.includes(Number(p.idProducto)));

  function moveToCart(product) {
    const variante = (product.variantes ?? []).find((v) => Number(v.stock) > 0);
    if (!variante) return;
    const image = getMainImage(product);
    addToCart({
      idProducto: product.idProducto,
      idVariante: variante.idVariante,
      nombre: product.nombre,
      sku: product.skuCode,
      talla: variante.talla,
      color: variante.color,
      gramajeGsm: product.gramajeGsm,
      precio: Number(product.precio) || 0,
      stock: Number(variante.stock) || 0,
      imagenUrl: image?.url ?? "",
      cantidad: 1,
    });
    closeWishlistDrawer();
    openCartDrawer();
  }

  return (
    <div className="drawer-backdrop" onClick={closeWishlistDrawer} role="presentation">
      <aside
        className="drawer-panel"
        aria-label="Lista de favoritos"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-head">
          <div>
            <p className="mono drawer-eyebrow">■ ARCHIVO PERSONAL // GUARDADOS</p>
            <h2>
              FAVORITOS <span className="mono">[{String(count).padStart(2, "0")}]</span>
            </h2>
          </div>
          <button
            type="button"
            className="drawer-close mono"
            onClick={closeWishlistDrawer}
            aria-label="Cerrar favoritos"
          >
            ESC ×
          </button>
        </header>

        <div className="drawer-body">
          {savedProducts.length === 0 ? (
            <div className="drawer-empty">
              <p className="mono">AÚN NO TIENES PRENDAS GUARDADAS</p>
              <p className="drawer-empty-sub">
                Pulsa el ícono de corazón en cualquier pieza del Drop 04 para guardarla aquí.
              </p>
              <Link to={ROUTES.CATALOGO} className="btn lime" onClick={closeWishlistDrawer}>
                EXPLORAR CATÁLOGO →
              </Link>
            </div>
          ) : (
            <ul className="drawer-list">
              {savedProducts.map((product) => (
                <li key={product.idProducto} className="drawer-item">
                  <Link
                    to={productPath(product.idProducto)}
                    className="drawer-item-thumb"
                    onClick={closeWishlistDrawer}
                  >
                    <ProductVisual product={product} />
                  </Link>
                  <div className="drawer-item-info">
                    <div className="drawer-item-top">
                      <Link
                        to={productPath(product.idProducto)}
                        className="drawer-item-name"
                        onClick={closeWishlistDrawer}
                      >
                        {product.nombre}
                      </Link>
                      <button
                        type="button"
                        className="drawer-item-rm"
                        onClick={() => toggleWishlist(product.idProducto)}
                        aria-label={`Quitar ${product.nombre}`}
                      >
                        ×
                      </button>
                    </div>
                    <p className="mono drawer-item-meta">
                      {product.fitShort} · {product.gramajeGsm} GSM
                    </p>
                    <div className="drawer-item-bottom">
                      <strong className="mono drawer-item-price">{format(product.precio)}</strong>
                      <button
                        type="button"
                        className="btn lime drawer-mini-btn"
                        onClick={() => moveToCart(product)}
                      >
                        + BOLSA
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
