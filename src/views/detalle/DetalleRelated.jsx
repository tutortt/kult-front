import { useProducts } from "../../controllers/catalog/useProducts";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { productPath } from "../../controllers/router/navigation";
import { addToCart } from "../../models/cart/cart";
import { getMainImage } from "../../models/catalog/product";
import { ProductVisual } from "../catalogo/ProductVisual";
import { Link } from "../Link";

/** "Completa la pinta": productos coordinados con botón funcional AGREGAR AL LOOK +. */
export function DetalleRelated({ idProducto }) {
  const { products, isLoading, error } = useProducts();
  const { format } = useCurrency();
  const relacionados = products.filter((producto) => producto.idProducto !== idProducto).slice(0, 3);

  function addLookPiece(producto) {
    const variante = (producto.variantes ?? []).find((v) => Number(v.stock) > 0);
    if (!variante) return;
    const imagen = getMainImage(producto);
    addToCart(
      {
        idProducto: producto.idProducto,
        idVariante: variante.idVariante,
        nombre: producto.nombre,
        sku: producto.skuCode,
        talla: variante.talla,
        color: variante.color,
        gramajeGsm: producto.gramajeGsm,
        badge: producto.badge,
        precio: Number(producto.precio) || 0,
        stock: Number(variante.stock) || 0,
        imagenUrl: imagen?.url ?? "",
        cantidad: 1,
      },
      { openDrawer: true },
    );
  }

  return (
    <section className="det-related" aria-label="Estilismo coordinado">
      <div className="wrap">
        <div className="det-section-head">
          <div>
            <p className="eyebrow mono">[ Estilismo coordinado // SS25 ]</p>
            <h2>Completa la pinta</h2>
          </div>
          <p className="mono det-section-note">Prendas y accesorios diseñados bajo la misma paleta textil</p>
        </div>

        {isLoading && <p className="det-status mono">Cargando prendas…</p>}
        {!isLoading && error && <p className="det-status mono">{error}</p>}
        {!isLoading && !error && relacionados.length === 0 && (
          <p className="det-status mono">No hay prendas adicionales en este drop.</p>
        )}

        {!isLoading && !error && relacionados.length > 0 && (
          <div className="det-related-grid">
            {relacionados.map((producto) => (
              <article key={producto.idProducto} className="det-related-card">
                <Link to={productPath(producto.idProducto)} className="det-related-media" style={{ padding: 0 }}>
                  <ProductVisual product={producto} />
                </Link>
                <div className="det-related-body">
                  <span className="mono det-related-stock">
                    Stock disponible: {producto.stock ?? 0}/150 · {producto.gramajeGsm} GSM
                  </span>
                  <h3>
                    <Link to={productPath(producto.idProducto)}>{producto.nombre}</Link>
                  </h3>
                  <strong className="mono">{format(producto.precio)}</strong>
                  <button
                    type="button"
                    className="det-look-btn mono"
                    style={{ background: "none", width: "100%" }}
                    disabled={!(Number(producto.stock) > 0)}
                    onClick={() => addLookPiece(producto)}
                  >
                    {Number(producto.stock) > 0 ? "Agregar al look +" : "Agotado"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
