import { useEffect } from "react";

import { useProduct } from "../../controllers/catalog/useProduct";
import { ROUTES } from "../../controllers/router/navigation";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "../home/home.css";
import { DetalleGallery } from "./DetalleGallery";
import { DetalleInfo } from "./DetalleInfo";
import { DetalleRelated } from "./DetalleRelated";
import { DetalleReviews } from "./DetalleReviews";
import { DetalleSpecs } from "./DetalleSpecs";
import { DetalleTabs } from "./DetalleTabs";
import "./detalle.css";

const TITLE = "Ficha de producto · KULT STUDIO";
const DESCRIPTION =
  "Ficha técnica del Drop 04 de KULT STUDIO: algodón peinado, gramaje pesado y siluetas oversized seriadas.";

/** Página de detalle: breadcrumb, galería, compra, información y relacionados. */
export function DetallePage({ idProducto }) {
  const { product, isLoading, error } = useProduct(idProducto);

  useEffect(() => {
    const tituloAnterior = document.title;
    const description = document.querySelector('meta[name="description"]');
    const descripcionAnterior = description?.getAttribute("content");

    document.title = product?.nombre ? `${product.nombre} · KULT STUDIO` : TITLE;
    description?.setAttribute("content", product?.descripcion || DESCRIPTION);

    return () => {
      document.title = tituloAnterior;
      if (description && descripcionAnterior !== null) {
        description.setAttribute("content", descripcionAnterior);
      }
    };
  }, [product]);

  return (
    <div className="detalle-page">
      <HomeHeader />
      <main>
        <nav className="det-breadcrumb wrap mono" aria-label="Ruta de navegación">
          <Link to={ROUTES.HOME}>Inicio</Link>
          <span>/</span>
          <Link to={ROUTES.CATALOGO}>Colección</Link>
          <span>/</span>
          <span>{product?.categoria?.nombre ?? "Productos"}</span>
          <span>/</span>
          <b>{product?.nombre ?? "Ficha"}</b>
        </nav>

        {isLoading && <p className="det-status mono wrap">Cargando ficha del producto…</p>}

        {!isLoading && (error || !product) && (
          <div className="det-status wrap">
            <p className="mono">{error || "Producto no encontrado."}</p>
            <Link className="btn lime" to={ROUTES.HOME}>
              Volver a la tienda
            </Link>
          </div>
        )}

        {!isLoading && product && (
          <>
            <section className="det-hero">
              <div className="wrap det-hero-grid">
                <DetalleGallery key={`galeria-${product.idProducto}`} product={product} />
                <DetalleInfo key={`info-${product.idProducto}`} product={product} />
              </div>
            </section>

            <DetalleSpecs product={product} />
            <DetalleTabs />
            <DetalleRelated idProducto={product.idProducto} />
            <DetalleReviews />
            <SubscribeSection />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
