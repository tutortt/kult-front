import { useProducts } from "../../controllers/catalog/useProducts";
import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";
import { ProductCard } from "./ProductCard";

/** Grilla de productos destacados del Drop 04 en el Home (fiel a Home.png). */
export function ProductGrid() {
  const { products, isLoading, error } = useProducts();

  const featured = products.slice(0, 8);
  const totalStock = products.reduce((total, product) => total + (Number(product.stock) || 0), 0);

  return (
    <section id="piezas">
      <div className="wrap">
        <div className="home-head">
          <div>
            <p className="eyebrow mono" style={{ color: "var(--muted)" }}>
              [ Nuevos lanzamientos ]
            </p>
            <h2>Piezas del Drop 04</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p className="meta mono">
              <b>{totalStock} artifacts en stock</b>
              Camisetas con horma oversized
            </p>
            <Link to={ROUTES.CATALOGO} className="btn dark" style={{ minHeight: 38, padding: "8px 14px", fontSize: ".64rem" }}>
              Ver colección ({products.length}) →
            </Link>
          </div>
        </div>

        {isLoading && <p className="catalog-status mono">Cargando catálogo…</p>}

        {!isLoading && error && <p className="catalog-status error mono">{error}</p>}

        {!isLoading && !error && featured.length === 0 && (
          <p className="catalog-status mono">No hay productos disponibles en este momento.</p>
        )}

        {!isLoading && !error && featured.length > 0 && (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.idProducto} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
