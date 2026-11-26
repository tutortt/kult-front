import { useMemo, useState } from "react";
import { useProducts } from "../../controllers/catalog/useProducts";
import { ROUTES } from "../../controllers/router/navigation";
import { CatalogCard } from "../catalogo/CatalogCard";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./storefront.css";

const TECHNIQUES = [
  "Todas las gráficas",
  "Puff 3D",
  "Acid Wash & Degradé",
  "Serigrafía Alta Densidad",
  "Minimal Core",
];

const ANATOMY = [
  {
    num: "01",
    tag: "RELIEVE 3D",
    title: "SERIGRAFÍA PUFF 3D",
    desc: "Tinta expansiva curada a 170°C para lograr un relieve arquitectónico tangible que no se cuartea ni pierde opacidad.",
    left: "RESISTENCIA AL LAVADO",
    right: "ALTA DENSIDAD",
  },
  {
    num: "02",
    tag: "10 PASADAS",
    title: "MULTICAPA PLASTISOL",
    desc: "Estampación manual capa por capa en talleres de Bogotá y Medellín con pigmentos mate de máxima saturación.",
    left: "BASE TEXTIL",
    right: "280-380 GSM",
  },
  {
    num: "03",
    tag: "ACABADO MINERAL",
    title: "DEGRADÉ ÁCIDO",
    desc: "Proceso artesanal de lavado mineral y corrosión controlada que convierte cada camiseta en una pieza irrepetible.",
    left: "IDENTIDAD POR PRENDA",
    right: "100% ÚNICA",
  },
];

const MACROS = [
  { id: "01 // RELIEVE PUFF 3D", desc: "Volumen neón de 1.8mm sobre algodón peinado." },
  { id: "02 // SERIGRAFÍA CRAQUELADA", desc: "Tinta pigmentada de acabado vintage industrial." },
  { id: "03 // ETIQUETA SERIADA", desc: "Numeración tejida 043 OF 150 en algodón negro." },
  { id: "04 // DOBLE PUNTADA", desc: "Costura reforzada anti-deformación en cuello y manga." },
];

export function GraficasPage() {
  const { products, isLoading } = useProducts();
  const [technique, setTechnique] = useState("Todas las gráficas");
  const [sortBy, setSortBy] = useState("recent");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isGraphic || p.categoria?.nombre?.toLowerCase().includes("gráfic"));
    if (technique !== "Todas las gráficas") {
      list = list.filter((p) => p.technique === technique);
    }
    if (sortBy === "price-asc") list.sort((a, b) => Number(a.precio) - Number(b.precio));
    if (sortBy === "price-desc") list.sort((a, b) => Number(b.precio) - Number(a.precio));
    return list;
  }, [products, technique, sortBy]);

  return (
    <div className="sf-page">
      <HomeHeader />

      <div className="wrap sf-crumb mono">
        <span>
          <Link to={ROUTES.HOME}>INICIO</Link> / <Link to={ROUTES.CATALOGO}>COLECCIÓN</Link> /{" "}
          <b>CAMISETAS GRÁFICAS &amp; ARTE SERIGRÁFICO</b>
        </span>
        <span className="lime">SERIGRAFÍA TEXTIL // ARCHIVO KULT</span>
      </div>

      <section className="sf-hero">
        <div className="wrap sf-hero-row">
          <div>
            <p className="eyebrow mono">[ ARCHIVO GRÁFICO // SERIE 04 ]</p>
            <h1>
              GRÁFICAS
              <br />
              <em>// ARTE &amp; SERIGRAFÍA</em>
            </h1>
            <p className="lead">
              Estampación de alta densidad, tintas Puff 3D reactivas y lavados ácidos manuales. Cada diseño nace como una
              edición limitada de taller que nunca se reimprime.
            </p>
          </div>
          <div className="sf-kpi-row">
            <div className="sf-kpi">
              <span className="mono">DISEÑOS ACTIVOS</span>
              <strong>{filtered.length} SKUS</strong>
            </div>
            <div className="sf-kpi">
              <span className="mono">TIRADA MÁXIMA</span>
              <strong>150 UDS</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="sf-filter-bar">
        <div className="wrap sf-filter-inner">
          <div className="sf-pills" role="tablist" aria-label="Filtrar por técnica de estampado">
            {TECHNIQUES.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={technique === t}
                className={technique === t ? "active" : undefined}
                onClick={() => setTechnique(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <select
            className="sf-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar gráficas"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Anatomía de la gráfica */}
      <section className="sf-section alt">
        <div className="wrap">
          <div className="sf-head">
            <div>
              <p className="eyebrow mono">[ PROCESO DE PRODUCCIÓN // TALLER BOGOTÁ ]</p>
              <h2>ANATOMÍA DE LA GRÁFICA</h2>
            </div>
            <p>Tres procesos textiles propios desarrollados para máxima durabilidad y textura táctil.</p>
          </div>
          <div className="sf-grid-3">
            {ANATOMY.map((item) => (
              <article className="sf-card" key={item.num}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="sf-num">{item.num}</span>
                  <span className="mono" style={{ fontSize: ".58rem", color: "var(--muted)" }}>{item.tag}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="sf-card-foot mono">
                  <span>{item.left}</span>
                  <b>{item.right}</b>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Archivados activos */}
      <main className="wrap sf-section">
        <div className="sf-head">
          <div>
            <p className="eyebrow mono">[ CATÁLOGO GRÁFICO ACTIVO ]</p>
            <h2>ARCHIVADOS ACTIVOS</h2>
          </div>
          <span className="mono" style={{ color: "var(--lime)", fontSize: ".68rem" }}>
            {filtered.length} REFERENCIAS FILTRADAS
          </span>
        </div>

        {isLoading ? (
          <p className="mono" style={{ color: "var(--muted)" }}>Cargando archivo gráfico…</p>
        ) : filtered.length === 0 ? (
          <div className="col-empty">
            <p className="mono">NO HAY PIEZAS CON ESTA TÉCNICA</p>
            <button type="button" className="btn lime" onClick={() => setTechnique("Todas las gráficas")}>
              VER TODAS LAS GRÁFICAS
            </button>
          </div>
        ) : (
          <div className="sf-grid-3">
            {filtered.map((p) => (
              <CatalogCard key={p.idProducto} product={p} variant="graficas" />
            ))}
          </div>
        )}
      </main>

      {/* Macro Archive */}
      <section className="sf-section alt">
        <div className="wrap">
          <div className="sf-head">
            <div>
              <p className="eyebrow mono">[ INSPECCIÓN DE ACABADOS // ZOOM 10X ]</p>
              <h2>MACRO ARCHIVE // DETALLES</h2>
            </div>
            <p>Detalles reales de tintas, etiquetas seriadas y costuras reforzadas en cada lote.</p>
          </div>
          <div className="sf-grid-4">
            {MACROS.map((m, idx) => (
              <article className="macro-card" key={m.id}>
                <div className="macro-art">
                  <svg viewBox="0 0 240 160" width="100%" aria-hidden="true">
                    <rect width="240" height="160" fill={idx % 2 === 0 ? "#121417" : "#181a1f"} />
                    <path d="M0 80 H240 M120 0 V160" stroke="rgba(255,255,255,0.06)" />
                    <rect x="44" y="42" width="152" height="76" fill="none" stroke="#c6f500" strokeWidth="1.5" strokeDasharray={idx === 3 ? "5 4" : undefined} />
                    <text x="120" y="84" textAnchor="middle" fill="#c6f500" fontFamily="monospace" fontWeight="700" fontSize="13">
                      KULT // 0{idx + 1}
                    </text>
                  </svg>
                </div>
                <div className="macro-body">
                  <small className="mono">{m.id}</small>
                  <p>{m.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
