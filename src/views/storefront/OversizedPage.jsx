import { useMemo, useState } from "react";
import { useProducts } from "../../controllers/catalog/useProducts";
import { ROUTES } from "../../controllers/router/navigation";
import { PIGMENT_OPTIONS, SIZE_OPTIONS } from "../../models/catalog/product";
import { CatalogCard } from "../catalogo/CatalogCard";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./storefront.css";

const GSM_CARDS = [
  {
    id: "280",
    tier: "TIER 01 // DAILY HEAVY",
    title: "BOX FIT SÓLIDO",
    gsm: "280",
    desc: "Caída limpia para uso diario todo el año. Estructura ligera pero firme sin perder la silueta cuadrada.",
    match: (g) => g >= 220 && g < 310,
  },
  {
    id: "320-350",
    tier: "TIER 02 // FAVORITO COLOMBIA",
    title: "HEAVYWEIGHT SIGNATURE",
    gsm: "320-350",
    desc: "El equilibrio icónico de KULT STUDIO. Cuerpo grueso con hombro desplazado y tacto de algodón crudo premium.",
    match: (g) => g >= 310 && g <= 360,
  },
  {
    id: "380-420",
    tier: "TIER 03 // ARMOR SPEC",
    title: "ULTRA HEAVY TANK",
    gsm: "380-420",
    desc: "Gramaje extremo de colección. Caída escultural rígida pensada como pieza de arquitectura textil.",
    match: (g) => g > 360,
  },
];

const MEASURES = [
  { talla: "S", pecho: 57, largo: 72, hombro: 53, manga: 22, ref: "1.65 - 1.74 m / 58 - 68 kg" },
  { talla: "M", pecho: 60, largo: 75, hombro: 56, manga: 23.5, ref: "1.72 - 1.80 m / 68 - 78 kg", pop: true },
  { talla: "L", pecho: 63, largo: 78, hombro: 59, manga: 25, ref: "1.78 - 1.86 m / 78 - 90 kg" },
  { talla: "XL", pecho: 66, largo: 81, hombro: 62, manga: 26.5, ref: "1.84 - 1.92 m / 90 - 105 kg" },
  { talla: "XXL", pecho: 69, largo: 84, hombro: 65, manga: 28, ref: "1.90 m+ / Fit ultra amplio" },
];

const TESTIMONIALS = [
  {
    author: "CAMILO R. // BOGOTÁ",
    quote: "La caída de la 350 GSM es absurda. Después de 20 lavadas el cuello sigue exactamente igual que el primer día.",
    meta: "COMPRA VERIFICADA · TALLA L",
  },
  {
    author: "VALENTINA M. // MEDELLÍN",
    quote: "Me encanta que no sea solo una talla grande, sino un patrón boxy real. El largo es perfecto y el envío llegó en 24h.",
    meta: "COMPRA VERIFICADA · TALLA M",
  },
  {
    author: "SANTIAGO G. // CALI",
    quote: "Pedí la 280 GSM para clima cálido y la 380 GSM para la noche. Calidad de taller internacional hecha en Colombia.",
    meta: "COMPRA VERIFICADA · TALLA XL",
  },
];

export function OversizedPage() {
  const { products, isLoading } = useProducts();
  const [gsmFilter, setGsmFilter] = useState("");
  const [pigmentFilter, setPigmentFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [unit, setUnit] = useState("cm");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isOversized);
    if (gsmFilter) {
      const card = GSM_CARDS.find((c) => c.id === gsmFilter);
      if (card) list = list.filter((p) => card.match(Number(p.gramajeGsm) || 280));
    }
    if (pigmentFilter) {
      list = list.filter((p) => p.pigmentIds?.includes(pigmentFilter));
    }
    if (sizeFilter) {
      list = list.filter((p) => (p.tallas ?? []).includes(sizeFilter));
    }
    return list;
  }, [products, gsmFilter, pigmentFilter, sizeFilter]);

  const fmtMeasure = (cm) => (unit === "cm" ? `${cm} cm` : `${(cm / 2.54).toFixed(1)} in`);

  return (
    <div className="sf-page">
      <HomeHeader />

      <div className="wrap sf-crumb mono">
        <span>
          <Link to={ROUTES.HOME}>INICIO</Link> / <Link to={ROUTES.CATALOGO}>COLECCIÓN</Link> /{" "}
          <b>SILUETA OVERSIZED &amp; BOXY FIT</b>
        </span>
        <span className="lime">PATRONAJE ARQUITECTÓNICO // 280–420 GSM</span>
      </div>

      {/* Hero Oversized con Diagrama Técnico */}
      <section className="sf-hero">
        <div className="wrap ov-hero-grid">
          <div>
            <p className="eyebrow mono">[ INGENIERÍA DE SILUETA // SERIE 04 ]</p>
            <h1>
              SILUETA OVERSIZED
              <br />
              <em>// PATRONAJE DE CAÍDA PESADA</em>
            </h1>
            <p className="lead">
              Diseñada desde cero en nuestros talleres con hombros desplazados (drop shoulder), manga amplia al codo y
              cuello canalé 1.2&quot; reforzado en calibres de 280 a 420 GSM.
            </p>
            <div className="sf-kpi-row" style={{ marginTop: 22 }}>
              <div className="sf-kpi">
                <span className="mono">GRAMAJE DESDE</span>
                <strong>280 GSM</strong>
              </div>
              <div className="sf-kpi">
                <span className="mono">CUELLO CANALÉ</span>
                <strong>1.2&quot; RIB</strong>
              </div>
              <div className="sf-kpi">
                <span className="mono">CALIBRE MAX</span>
                <strong>420 GSM</strong>
              </div>
            </div>
            <div className="cta-row" style={{ marginTop: 20 }}>
              <a href="#catalogo-oversized" className="btn lime">
                VER CATÁLOGO OVERSIZED →
              </a>
              <a href="#tabla-medidas" className="btn dark">
                TABLA DE MEDIDAS
              </a>
            </div>
          </div>

          <div className="ov-diagram">
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: ".58rem", color: "var(--lime)" }}>
              <span>SPEC // PATRÓN BOXY V.4</span>
              <span>TOLERANCIA ±0.5 CM</span>
            </div>
            <svg viewBox="0 0 360 230" width="100%" aria-label="Diagrama técnico de silueta oversized">
              <rect width="360" height="230" fill="#0c0d0f" />
              <path
                d="M126 36 L152 50 C168 58 192 58 208 50 L234 36 L296 66 L322 134 L274 148 L260 112 L260 202 L100 202 L100 112 L86 148 L38 134 L64 66 Z"
                fill="#16181c"
                stroke="#c6f500"
                strokeWidth="2"
              />
              <line x1="100" y1="146" x2="260" y2="146" stroke="#c6f500" strokeDasharray="4 4" />
              <text x="180" y="138" textAnchor="middle" fill="#c6f500" fontFamily="monospace" fontSize="10">
                ANCHO BOXY (60 CM · M)
              </text>
              <text x="180" y="28" textAnchor="middle" fill="#e8e8ea" fontFamily="monospace" fontSize="9">
                CUELLO CANALÉ 1.2&quot; ANTI-STRETCH
              </text>
              <text x="310" y="102" textAnchor="middle" fill="#8a8c93" fontFamily="monospace" fontSize="8">
                DROP
              </text>
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: ".72rem", color: "var(--muted)" }}>
              <div>
                <b className="mono" style={{ color: "var(--text)", fontSize: ".58rem" }}>CORTE REGULAR</b>
                <p>Hombro pegado, tela 160 GSM que cede al 3er lavado.</p>
              </div>
              <div>
                <b className="mono" style={{ color: "var(--lime)", fontSize: ".58rem" }}>KULT FIT OVERSIZED</b>
                <p>Hombro caído arquitectónico y cuerpo pesado pre-encogido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El calibre define la caída (tarjetas clickeables que filtran) */}
      <section className="sf-section alt">
        <div className="wrap">
          <div className="sf-head">
            <div>
              <p className="eyebrow mono">[ SELECCIONA TU CALIBRE TEXTIL ]</p>
              <h2>EL CALIBRE DEFINE LA CAÍDA</h2>
            </div>
            {gsmFilter && (
              <button type="button" className="btn dark" onClick={() => setGsmFilter("")}>
                MOSTRAR TODOS LOS CALIBRES ×
              </button>
            )}
          </div>
          <div className="sf-grid-3">
            {GSM_CARDS.map((card) => {
              const active = gsmFilter === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`gsm-card${active ? " active" : ""}`}
                  onClick={() => setGsmFilter((prev) => (prev === card.id ? "" : card.id))}
                  aria-pressed={active}
                >
                  <span className="mono" style={{ fontSize: ".58rem", color: "var(--muted)" }}>{card.tier}</span>
                  <h3>{card.title}</h3>
                  <div className="big">
                    {card.gsm} <span>GSM</span>
                  </div>
                  <p>{card.desc}</p>
                  <span className="mono" style={{ color: "var(--lime)", fontSize: ".6rem", marginTop: "auto" }}>
                    {active ? "✓ FILTRO ACTIVO (PULSA PARA QUITAR)" : "FILTRAR ESTE CALIBRE →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Barra rápida Color + Talla */}
      <div className="sf-filter-bar" id="catalogo-oversized">
        <div className="wrap sf-filter-inner">
          <div className="sf-pills" role="group" aria-label="Filtrar por color">
            <button
              type="button"
              className={pigmentFilter === "" ? "active" : undefined}
              onClick={() => setPigmentFilter("")}
            >
              Todos los colores
            </button>
            {PIGMENT_OPTIONS.map((pig) => (
              <button
                key={pig.id}
                type="button"
                className={pigmentFilter === pig.id ? "active" : undefined}
                onClick={() => setPigmentFilter((prev) => (prev === pig.id ? "" : pig.id))}
              >
                {pig.label}
              </button>
            ))}
          </div>
          <div className="sf-size-bar" role="group" aria-label="Filtrar por talla">
            {SIZE_OPTIONS.slice(1).map((sz) => (
              <button
                key={sz}
                type="button"
                className={sizeFilter === sz ? "active" : undefined}
                onClick={() => setSizeFilter((prev) => (prev === sz ? "" : sz))}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catálogo Oversized */}
      <main className="wrap sf-section">
        <div className="sf-head">
          <div>
            <p className="eyebrow mono">[ SILUETAS PESADAS EN STOCK ]</p>
            <h2>CATÁLOGO OVERSIZED / DROP 04</h2>
          </div>
          <span className="mono" style={{ color: "var(--lime)", fontSize: ".68rem" }}>
            {filtered.length} MODELOS DISPONIBLES
          </span>
        </div>

        {isLoading ? (
          <p className="mono" style={{ color: "var(--muted)" }}>Cargando siluetas oversized…</p>
        ) : filtered.length === 0 ? (
          <div className="col-empty">
            <p className="mono">SIN COINCIDENCIAS PARA ESTE CALIBRE / COLOR</p>
            <button
              type="button"
              className="btn lime"
              onClick={() => {
                setGsmFilter("");
                setPigmentFilter("");
                setSizeFilter("");
              }}
            >
              MOSTRAR TODAS LAS OVERSIZED
            </button>
          </div>
        ) : (
          <div className="sf-grid-3">
            {filtered.map((p) => (
              <CatalogCard key={p.idProducto} product={p} variant="oversized" />
            ))}
          </div>
        )}
      </main>

      {/* Tabla de medidas & Horma Colombiana */}
      <section className="sf-section alt" id="tabla-medidas">
        <div className="wrap">
          <div className="sf-head">
            <div>
              <p className="eyebrow mono">[ ESPECIFICACIÓN TÉCNICA // GUÍA DE FIT ]</p>
              <h2>TABLA DE MEDIDAS &amp; HORMA COLOMBIANA</h2>
            </div>
            <div className="sf-pills">
              <button type="button" className={unit === "cm" ? "active" : undefined} onClick={() => setUnit("cm")}>
                CENTÍMETROS (CM)
              </button>
              <button type="button" className={unit === "in" ? "active" : undefined} onClick={() => setUnit("in")}>
                PULGADAS (IN)
              </button>
            </div>
          </div>

          <div className="modal-table-wrap">
            <table className="size-table mono">
              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Ancho pecho</th>
                  <th>Largo total</th>
                  <th>Ancho hombro</th>
                  <th>Largo manga</th>
                  <th>Referencia corporal</th>
                </tr>
              </thead>
              <tbody>
                {MEASURES.map((row) => (
                  <tr key={row.talla} className={row.pop ? "hi" : undefined}>
                    <td>
                      <b>Talla {row.talla}</b> {row.pop && <span className="pill">POPULAR</span>}
                    </td>
                    <td>{fmtMeasure(row.pecho)}</td>
                    <td>{fmtMeasure(row.largo)}</td>
                    <td>{fmtMeasure(row.hombro)}</td>
                    <td>{fmtMeasure(row.manga)}</td>
                    <td>{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonios en Colombia */}
      <section className="wrap sf-section">
        <div className="sf-head">
          <div>
            <p className="eyebrow mono">[ COMUNIDAD VERIFICADA ]</p>
            <h2>TESTIMONIOS EN COLOMBIA</h2>
          </div>
          <span className="mono" style={{ color: "var(--lime)" }}>★★★★★ 4.9 / 5.0 (420+ RESEÑAS)</span>
        </div>
        <div className="sf-grid-3">
          {TESTIMONIALS.map((t) => (
            <article className="sf-card" key={t.author}>
              <small className="mono" style={{ color: "var(--lime)" }}>{t.author}</small>
              <p style={{ fontStyle: "italic", color: "var(--text)" }}>&ldquo;{t.quote}&rdquo;</p>
              <div className="sf-card-foot mono">
                <span>{t.meta}</span>
                <b>★★★★★</b>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
