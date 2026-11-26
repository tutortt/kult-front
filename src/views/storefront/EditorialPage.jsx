import { useMemo, useState } from "react";
import { useProducts } from "../../controllers/catalog/useProducts";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { ROUTES, productPath } from "../../controllers/router/navigation";
import { addMultipleToCart, addToCart } from "../../models/cart/cart";
import { getMainImage } from "../../models/catalog/product";
import { ProductVisual } from "../catalogo/ProductVisual";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./storefront.css";

const HOTSPOT_COORDS = [
  { top: "14%", left: "48%", label: "01" },
  { top: "40%", left: "46%", label: "02" },
  { top: "70%", left: "54%", label: "03" },
];

export function EditorialPage() {
  const { products } = useProducts();
  const { format } = useCurrency();
  const [activeSpot, setActiveSpot] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});

  const lookPieces = useMemo(() => {
    const beanie = products.find((p) => /beanie/i.test(p.nombre)) ?? products[0];
    const tee = products.find((p) => /neo-tokyo|override/i.test(p.nombre)) ?? products[1];
    const cargo = products.find((p) => /cargo/i.test(p.nombre)) ?? products[2];
    return [beanie, tee, cargo].filter(Boolean);
  }, [products]);

  const lookTotal = lookPieces.reduce((sum, p) => sum + (Number(p.precio) || 0), 0);

  function getChosenSize(p) {
    return selectedSizes[p.idProducto] || p.tallas?.[1] || p.tallas?.[0] || "L";
  }

  function buildCartPayload(p) {
    const size = getChosenSize(p);
    const variante =
      (p.variantes ?? []).find((v) => v.talla === size && Number(v.stock) > 0) ??
      (p.variantes ?? []).find((v) => Number(v.stock) > 0);
    if (!variante || Number(variante.stock) < 1) return null;
    const img = getMainImage(p);
    return {
      idProducto: p.idProducto,
      idVariante: variante.idVariante,
      nombre: p.nombre,
      sku: p.skuCode,
      talla: variante.talla,
      color: variante.color,
      gramajeGsm: p.gramajeGsm,
      badge: "SHOP LOOK 01",
      precio: Number(p.precio) || 0,
      stock: Number(variante.stock) || 0,
      imagenUrl: img?.url ?? "",
      cantidad: 1,
    };
  }

  function handleAddFullLook() {
    const payloads = lookPieces.map(buildCartPayload).filter(Boolean);
    addMultipleToCart(payloads, { openDrawer: true });
  }

  function handleAddSingle(p) {
    const payload = buildCartPayload(p);
    if (payload) addToCart(payload, { openDrawer: true });
  }

  const activePiece = lookPieces[activeSpot] ?? lookPieces[0];

  return (
    <div className="sf-page">
      <HomeHeader />

      <div className="wrap sf-crumb mono">
        <span>
          <Link to={ROUTES.HOME}>INICIO</Link> / <b>EDITORIAL // ARCHIVO VISUAL</b>
        </span>
        <span className="lime">LOOKBOOK SS25 // METROLOGÍA TEXTIL</span>
      </div>

      <section className="sf-hero">
        <div className="wrap sf-hero-row">
          <div>
            <span className="tag mono">ARCHIVO VISUAL // EDICIÓN 04</span>
            <h1>
              DROP 04:
              <br />
              <em>HYPER-STRUCTURE</em>
            </h1>
            <p className="lead">
              Lookbook y manifiesto visual de arquitectura brutalista en concreto. Cada silueta ha sido calibrada entre
              280 y 420 GSM para desafiar el ritmo efímero de las temporadas.
            </p>
          </div>
          <div className="sf-card" style={{ maxWidth: 340 }}>
            <small className="mono" style={{ color: "var(--lime)" }}>NOTA CURATORIAL // 04</small>
            <p>
              Fotografiado en Bogotá y Medellín bajo iluminación industrial de sodio. Prendas confeccionadas en tiradas
              cerradas de 150 unidades numeradas.
            </p>
            <div className="sf-card-foot mono">
              <span>SERIE ACTIVA</span>
              <b>BOG // MDE</b>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP LOOK 01 Interactivo */}
      <main className="wrap sf-section">
        <div className="sf-head">
          <div>
            <p className="eyebrow mono">[ ESTILISMO INTERACTIVO // PULSA LOS PUNTOS ]</p>
            <h2>SHOP LOOK 01 : BRUTALISMO EN CONCRETO</h2>
          </div>
          <span className="mono" style={{ color: "var(--muted)", fontSize: ".62rem" }}>
            3 PIEZAS COORDINADAS · ENVÍO EXPRESS GRATIS
          </span>
        </div>

        <div className="look-grid">
          <div className="look-stage">
            {activePiece && <ProductVisual product={activePiece} />}
            {lookPieces.map((piece, idx) => (
              <button
                key={piece.idProducto}
                type="button"
                className={`hotspot${activeSpot === idx ? " active" : ""}`}
                style={{ top: HOTSPOT_COORDS[idx]?.top, left: HOTSPOT_COORDS[idx]?.left }}
                onClick={() => setActiveSpot(idx)}
                aria-label={`Inspeccionar ${piece.nombre}`}
              >
                {HOTSPOT_COORDS[idx]?.label}
              </button>
            ))}
            {activePiece && (
              <div className="hotspot-tip">
                <div>
                  <span className="mono" style={{ color: "var(--lime)", fontSize: ".56rem" }}>
                    PIEZA 0{activeSpot + 1} // {activePiece.gramajeGsm} GSM
                  </span>
                  <h3 style={{ fontSize: ".95rem" }}>{activePiece.nombre}</h3>
                </div>
                <strong className="mono" style={{ color: "var(--lime)" }}>{format(activePiece.precio)}</strong>
              </div>
            )}
          </div>

          <aside className="look-sidebar" aria-label="Prendas del Look 01">
            <div className="panel" style={{ padding: 16 }}>
              <small className="mono" style={{ color: "var(--lime)" }}>METROPOLIS DRIFT // LOOK 01</small>
              <p style={{ color: "var(--muted)", fontSize: ".8rem", marginTop: 6 }}>
                Selecciona tu talla en cada pieza y añade el conjunto completo a tu bolsa con un solo clic.
              </p>
            </div>

            {lookPieces.map((piece, idx) => {
              const chosen = getChosenSize(piece);
              return (
                <article
                  key={piece.idProducto}
                  className={`look-piece${activeSpot === idx ? " active" : ""}`}
                  onMouseEnter={() => setActiveSpot(idx)}
                >
                  <Link to={productPath(piece.idProducto)} className="look-piece-thumb">
                    <ProductVisual product={piece} />
                  </Link>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span className="mono" style={{ color: "var(--lime)", fontSize: ".54rem" }}>
                        0{idx + 1} // {piece.fitShort}
                      </span>
                      <strong className="mono" style={{ fontSize: ".7rem" }}>{format(piece.precio)}</strong>
                    </div>
                    <h3 style={{ fontSize: ".9rem", marginTop: 4 }}>
                      <Link to={productPath(piece.idProducto)}>{piece.nombre}</Link>
                    </h3>
                    <div className="look-piece-sizes" role="group" aria-label={`Talla para ${piece.nombre}`}>
                      {(piece.tallas ?? ["M", "L"]).slice(0, 4).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={chosen === t ? "active" : undefined}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [piece.idProducto]: t }))}
                        >
                          {t}
                        </button>
                      ))}
                      <button
                        type="button"
                        style={{ marginLeft: "auto", paddingInline: 8, color: "var(--lime)" }}
                        onClick={() => handleAddSingle(piece)}
                      >
                        + BOLSA
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="panel" style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: ".62rem", color: "var(--muted)" }}>TOTAL LOOK COMPLETO</span>
                <strong style={{ font: "800 1.4rem var(--display)", color: "var(--lime)" }}>
                  {format(lookTotal)}
                </strong>
              </div>
              <button type="button" className="btn lime" style={{ width: "100%" }} onClick={handleAddFullLook}>
                AÑADIR LOOK COMPLETO A LA BOLSA →
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Manifiesto */}
      <section className="wrap sf-section" style={{ paddingTop: 0 }}>
        <div className="manifesto-box">
          <div>
            <p className="eyebrow mono">[ MANIFIESTO KULT STUDIO ]</p>
            <blockquote>
              &ldquo;NO DISEÑAMOS ROPA PARA TEMPORADAS PASAJERAS. DISEÑAMOS ARTEFACTOS TEXTILES PARA LA METRÓPOLIS
              CONTEMPORÁNEA.&rdquo;
            </blockquote>
          </div>
          <Link to={ROUTES.CATALOGO} className="btn lime">
            EXPLORAR CATÁLOGO COMPLETO →
          </Link>
        </div>
      </section>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
