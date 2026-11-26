import { useMemo, useState } from "react";
import { useCategories } from "../../controllers/catalog/useCategories";
import { useProducts } from "../../controllers/catalog/useProducts";
import { useLocationSearch } from "../../controllers/router/navigation";
import {
  FIT_OPTIONS,
  GSM_OPTIONS,
  PIGMENT_OPTIONS,
  SIZE_OPTIONS,
} from "../../models/catalog/product";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { CatalogCard } from "./CatalogCard";
import "./catalogo.css";

const RELEASE_OPTIONS = [
  { id: "all", label: "Todo el catálogo activo" },
  { id: "in-stock", label: "En Stock (Envío 24h Colombia / Ciudades principales)" },
  { id: "preorder", label: "Pre-order Drop 05" },
  { id: "online-lab", label: "Exclusivo Online Lab" },
];

const PAGE_STEP = 6;

const SIZE_GUIDE_ROWS = [
  { talla: "XS", ancho: "54 cm", largo: "69 cm", hombro: "50 cm", manga: "21 cm", ref: "1.60 - 1.68 m / 52 - 60 kg" },
  { talla: "S", ancho: "57 cm", largo: "72 cm", hombro: "53 cm", manga: "22 cm", ref: "1.65 - 1.74 m / 58 - 68 kg" },
  { talla: "M", ancho: "60 cm", largo: "75 cm", hombro: "56 cm", manga: "23.5 cm", ref: "1.72 - 1.80 m / 68 - 78 kg", pop: true },
  { talla: "L", ancho: "63 cm", largo: "78 cm", hombro: "59 cm", manga: "25 cm", ref: "1.78 - 1.86 m / 78 - 90 kg" },
  { talla: "XL", ancho: "66 cm", largo: "81 cm", hombro: "62 cm", manga: "26.5 cm", ref: "1.84 - 1.92 m / 90 - 105 kg" },
  { talla: "XXL", ancho: "69 cm", largo: "84 cm", hombro: "65 cm", manga: "28 cm", ref: "1.90 m+ / Fit ultra amplio" },
];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function Catalogo() {
  const locationSearch = useLocationSearch();
  return <CatalogoView key={locationSearch || "base"} locationSearch={locationSearch} />;
}

function CatalogoView({ locationSearch }) {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();

  const initialParams = new URLSearchParams(locationSearch);
  const [query, setQuery] = useState(() => initialParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(() => initialParams.get("cat") ?? "");
  const [selectedFits, setSelectedFits] = useState(() => {
    const fitParam = initialParams.get("fit");
    return fitParam ? [fitParam] : [];
  });
  const [selectedGsms, setSelectedGsms] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPigments, setSelectedPigments] = useState([]);
  const [releaseStatus, setReleaseStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Contadores dinámicos en vivo para el sidebar
  const counts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const byFit = {};
    for (const fit of FIT_OPTIONS) {
      byFit[fit] = list.filter((p) => p.fit === fit).length;
    }
    const byPigment = {};
    for (const pig of PIGMENT_OPTIONS) {
      byPigment[pig.id] = list.filter((p) => p.pigmentIds?.includes(pig.id)).length;
    }
    return { byFit, byPigment };
  }, [products]);

  const filtered = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    const qn = query.trim().toLowerCase();
    if (qn) {
      list = list.filter((p) => {
        const hay = `${p.nombre || ""} ${p.descripcion || ""} ${p.skuCode || ""} ${p.fit || ""} ${p.technique || ""} ${p.categoria?.nombre || ""}`.toLowerCase();
        return hay.includes(qn);
      });
    }

    if (selectedCategory) {
      list = list.filter((p) => String(p.categoria?.idCategoria ?? "") === selectedCategory);
    }

    if (selectedFits.length > 0) {
      list = list.filter((p) => selectedFits.includes(p.fit));
    }

    if (selectedGsms.length > 0) {
      list = list.filter((p) =>
        selectedGsms.some((gsmId) => {
          const opt = GSM_OPTIONS.find((g) => g.id === gsmId);
          return opt ? opt.match(Number(p.gramajeGsm) || 280) : true;
        }),
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        selectedSizes.some((size) =>
          (p.variantes ?? []).some((v) => v.talla === size && Number(v.stock) > 0) ||
          (p.tallas ?? []).includes(size),
        ),
      );
    }

    if (selectedPigments.length > 0) {
      list = list.filter((p) =>
        selectedPigments.some((pigId) => p.pigmentIds?.includes(pigId)),
      );
    }

    if (releaseStatus === "in-stock") {
      list = list.filter((p) => Number(p.stock) > 0 && p.releaseStatus === "in-stock");
    } else if (releaseStatus === "preorder") {
      list = list.filter((p) => p.releaseStatus === "preorder");
    } else if (releaseStatus === "online-lab") {
      list = list.filter((p) => p.releaseStatus === "online-lab");
    }

    const minN = minPrice === "" ? null : Number(minPrice);
    const maxN = maxPrice === "" ? null : Number(maxPrice);
    if (minN !== null && !Number.isNaN(minN)) {
      list = list.filter((p) => Number(p.precio) >= minN);
    }
    if (maxN !== null && !Number.isNaN(maxN)) {
      list = list.filter((p) => Number(p.precio) <= maxN);
    }

    if (sortBy === "price-asc") list.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (sortBy === "price-desc") list.sort((a, b) => Number(b.precio) - Number(a.precio));
    else if (sortBy === "gsm-desc") list.sort((a, b) => Number(b.gramajeGsm) - Number(a.gramajeGsm));
    else if (sortBy === "name") list.sort((a, b) => String(a.nombre).localeCompare(String(b.nombre)));

    return list;
  }, [
    products,
    query,
    selectedCategory,
    selectedFits,
    selectedGsms,
    selectedSizes,
    selectedPigments,
    releaseStatus,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (query.trim()) {
      chips.push({ key: "q", label: `Búsqueda: "${query.trim()}"`, onRemove: () => setQuery("") });
    }
    if (selectedCategory) {
      const cat = categories.find((c) => String(c.idCategoria) === selectedCategory);
      chips.push({
        key: "cat",
        label: cat ? cat.nombre : `Categoría #${selectedCategory}`,
        onRemove: () => setSelectedCategory(""),
      });
    }
    for (const fit of selectedFits) {
      chips.push({
        key: `fit-${fit}`,
        label: fit,
        onRemove: () => setSelectedFits((prev) => prev.filter((x) => x !== fit)),
      });
    }
    for (const gsmId of selectedGsms) {
      const opt = GSM_OPTIONS.find((g) => g.id === gsmId);
      chips.push({
        key: `gsm-${gsmId}`,
        label: opt?.label ?? gsmId,
        onRemove: () => setSelectedGsms((prev) => prev.filter((x) => x !== gsmId)),
      });
    }
    if (selectedSizes.length > 0) {
      chips.push({
        key: "sizes",
        label: `Tallas: ${selectedSizes.join(", ")}`,
        highlight: true,
        onRemove: () => setSelectedSizes([]),
      });
    }
    for (const pigId of selectedPigments) {
      const pig = PIGMENT_OPTIONS.find((p) => p.id === pigId);
      chips.push({
        key: `pig-${pigId}`,
        label: pig?.label ?? pigId,
        onRemove: () => setSelectedPigments((prev) => prev.filter((x) => x !== pigId)),
      });
    }
    if (releaseStatus !== "all") {
      const opt = RELEASE_OPTIONS.find((r) => r.id === releaseStatus);
      chips.push({
        key: "rel",
        label: opt?.label.split("(")[0].trim() ?? releaseStatus,
        onRemove: () => setReleaseStatus("all"),
      });
    }
    if (minPrice !== "" || maxPrice !== "") {
      chips.push({
        key: "price",
        label: `Precio: ${minPrice || "0"} - ${maxPrice || "∞"}`,
        onRemove: () => {
          setMinPrice("");
          setMaxPrice("");
        },
      });
    }
    return chips;
  }, [
    query,
    selectedCategory,
    categories,
    selectedFits,
    selectedGsms,
    selectedSizes,
    selectedPigments,
    releaseStatus,
    minPrice,
    maxPrice,
  ]);

  function clearAllFilters() {
    setQuery("");
    setSelectedCategory("");
    setSelectedFits([]);
    setSelectedGsms([]);
    setSelectedSizes([]);
    setSelectedPigments([]);
    setReleaseStatus("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("recent");
    setVisibleCount(PAGE_STEP);
  }

  const avgGsm = useMemo(() => {
    const source = filtered.length > 0 ? filtered : products;
    if (source.length === 0) return 310;
    const sum = source.reduce((acc, p) => acc + (Number(p.gramajeGsm) || 280), 0);
    return Math.round(sum / source.length);
  }, [filtered, products]);

  const displayed = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - displayed.length);
  const pct = filtered.length > 0 ? Math.min(100, Math.round((displayed.length / filtered.length) * 100)) : 100;

  return (
    <div className="catalog-page">
      <HomeHeader />

      {/* Encabezado técnico de Colección (fiel a Colección.png) */}
      <section className="phead">
        <div className="wrap">
          <div className="row">
            <div>
              <p className="eyebrow mono">Catálogo técnico SS25 // Serie 04</p>
              <h1>Colección / Camisetas gráficas &amp; oversized</h1>
            </div>
            <div className="ctrl">
              <div className="mono">
                Catálogo activo: <b>{filtered.length} productos disponibles</b>
              </div>
              <label className="mono">
                Ordenar:
                <select
                  aria-label="Ordenar productos"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="gsm-desc">Mayor gramaje (GSM)</option>
                  <option value="name">Nombre A–Z</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="strip mono">
          <div className="wrap">
            <span>
              <span className="a">Algodón orgánico peinado</span> &nbsp;•&nbsp; Serigrafía de alta densidad
              &nbsp;•&nbsp; Corte arquitectónico caído
            </span>
            <span>
              Producción limitada: <b>150 uds / modelo</b>
            </span>
          </div>
        </div>
      </section>

      <main className="wrap">
        <div className="col-layout">
          {/* Botón móvil de filtros */}
          <button
            type="button"
            className="fbtn"
            aria-expanded={mobileFiltersOpen}
            aria-controls="kult-filters"
            onClick={() => setMobileFiltersOpen((o) => !o)}
          >
            <span>☰ Filtros sistema</span>
            <span style={{ color: "var(--lime)" }}>
              [{String(activeFilterChips.length).padStart(2, "0")}]
            </span>
          </button>

          {/* Sidebar de Filtros Sistema */}
          <aside
            className={`col-filters${mobileFiltersOpen ? " open" : ""}`}
            id="kult-filters"
            aria-label="Filtros de catálogo"
          >
            <div className="fh">
              <h2 className="mono">☰ Filtros sistema</h2>
              <button type="button" onClick={clearAllFilters}>
                [Limpiar]
              </button>
            </div>

            {/* Buscador rápido + Categoría */}
            <div className="grp">
              <h3>
                Búsqueda &amp; Categoría <span>[LAB]</span>
              </h3>
              <div className="grp-fields">
                <input
                  type="search"
                  className="col-input"
                  placeholder="Buscar por nombre, SKU, técnica..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisibleCount(PAGE_STEP);
                  }}
                  aria-label="Filtrar por texto"
                />
                <select
                  className="col-input"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setVisibleCount(PAGE_STEP);
                  }}
                  aria-label="Filtrar por categoría"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.idCategoria} value={String(c.idCategoria)}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patrón & Corte */}
            <div className="grp">
              <h3>
                Patrón &amp; corte <span>[{String(FIT_OPTIONS.length).padStart(2, "0")}]</span>
              </h3>
              {FIT_OPTIONS.map((fit) => {
                const checked = selectedFits.includes(fit);
                return (
                  <label className="opt" key={fit}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedFits((prev) => toggleValue(prev, fit));
                        setVisibleCount(PAGE_STEP);
                      }}
                    />
                    <span>{fit}</span>
                    <em className={checked ? "l" : undefined}>
                      {String(counts.byFit[fit] ?? 0).padStart(2, "0")}
                    </em>
                  </label>
                );
              })}
            </div>

            {/* Gramaje Textil */}
            <div className="grp">
              <h3>
                Gramaje textil <span>GSM</span>
              </h3>
              {GSM_OPTIONS.map((opt) => {
                const checked = selectedGsms.includes(opt.id);
                return (
                  <label className="opt" key={opt.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedGsms((prev) => toggleValue(prev, opt.id));
                        setVisibleCount(PAGE_STEP);
                      }}
                    />
                    <span>{opt.label}</span>
                    <em className={opt.id === "heavyweight" || checked ? "l" : undefined}>{opt.tag}</em>
                  </label>
                );
              })}
            </div>

            {/* Dimensión // Talla */}
            <div className="grp">
              <h3>
                Dimensión // Talla
                <button
                  type="button"
                  className="guide-link mono"
                  onClick={() => setShowSizeGuide(true)}
                >
                  GUÍA
                </button>
              </h3>
              <div className="tallas" role="group" aria-label="Filtrar por talla">
                {SIZE_OPTIONS.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setSelectedSizes((prev) => toggleValue(prev, size));
                        setVisibleCount(PAGE_STEP);
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pigmento */}
            <div className="grp">
              <h3>Pigmento</h3>
              {PIGMENT_OPTIONS.map((pig) => {
                const active = selectedPigments.includes(pig.id);
                return (
                  <button
                    key={pig.id}
                    type="button"
                    className={`opt pig${active ? " on" : ""}`}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedPigments((prev) => toggleValue(prev, pig.id));
                      setVisibleCount(PAGE_STEP);
                    }}
                  >
                    <i
                      className="sw"
                      style={{ background: pig.swatch, border: `1px solid ${pig.border}` }}
                    />
                    <span>{pig.label}</span>
                    <em className={active || pig.id === "negro" ? "l" : undefined}>
                      {String(counts.byPigment[pig.id] ?? 0).padStart(2, "0")}
                    </em>
                  </button>
                );
              })}
            </div>

            {/* Estado de lanzamiento */}
            <div className="grp">
              <h3>Estado de lanzamiento</h3>
              {RELEASE_OPTIONS.map((opt) => (
                <label className="opt" key={opt.id}>
                  <input
                    type="radio"
                    name="release-status"
                    checked={releaseStatus === opt.id}
                    onChange={() => {
                      setReleaseStatus(opt.id);
                      setVisibleCount(PAGE_STEP);
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Rango de precio */}
            <div className="grp">
              <h3>
                Rango de precio <span>COP</span>
              </h3>
              <div className="price-row">
                <input
                  type="number"
                  min="0"
                  step="10000"
                  className="col-input"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  aria-label="Precio mínimo COP"
                />
                <input
                  type="number"
                  min="0"
                  step="10000"
                  className="col-input"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  aria-label="Precio máximo COP"
                />
              </div>
            </div>

            {/* Widget dinámico Densidad Media Drop */}
            <div className="col-dens">
              <div className="t mono">
                <span>Densidad media drop</span>
                <b>{avgGsm} GSM</b>
              </div>
              <div className="bar">
                <i style={{ width: `${Math.min(100, Math.round((avgGsm / 420) * 100))}%` }} />
              </div>
              <p>
                Nuestros tejidos resisten más de 200 lavados sin deformación de cuello o pérdida de opacidad.
              </p>
            </div>
          </aside>

          {/* Grilla de Productos */}
          <section className="col-results" aria-label="Resultados del catálogo">
            <div className="col-active mono">
              <span>Filtros activos:</span>
              {activeFilterChips.length === 0 ? (
                <span className="col-active-none">Ninguno · Mostrando toda la serie</span>
              ) : (
                <>
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      className={chip.highlight ? "l" : undefined}
                      onClick={chip.onRemove}
                    >
                      {chip.label} ×
                    </button>
                  ))}
                  <button type="button" className="col-clear-inline" onClick={clearAllFilters}>
                    Limpiar todo
                  </button>
                </>
              )}
            </div>

            {isLoading && <p className="catalog-status mono">Cargando catálogo técnico…</p>}
            {!isLoading && error && <p className="catalog-status error mono">{error}</p>}

            {!isLoading && !error && filtered.length === 0 && (
              <div className="col-empty">
                <p className="mono">SIN COINCIDENCIAS EN EL CATÁLOGO</p>
                <p>No encontramos prendas con esa combinación de filtros. Ajusta los criterios para explorar más piezas.</p>
                <button type="button" className="btn lime" onClick={clearAllFilters}>
                  RESTABLECER FILTROS
                </button>
              </div>
            )}

            {!isLoading && !error && displayed.length > 0 && (
              <>
                <div className="col-grid">
                  {displayed.map((product) => (
                    <CatalogCard key={product.idProducto} product={product} variant="coleccion" />
                  ))}
                </div>

                {/* Barra de Progreso y Paginación */}
                <div className="col-more mono">
                  <span>
                    Mostrando {displayed.length} de {filtered.length} productos disponibles •{" "}
                    <b>{pct}% completado</b>
                  </span>
                  <div className="bar">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  {remaining > 0 ? (
                    <button
                      className="btn lime"
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_STEP)}
                    >
                      Cargar más camisetas ({remaining} restantes) ⌄
                    </button>
                  ) : (
                    <span className="col-more-done">■ CATÁLOGO COMPLETO CARGADO</span>
                  )}
                  <span style={{ fontSize: ".58rem" }}>
                    Sistema de despacho inmediato // Disponibilidad en tiempo real
                  </span>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Especificaciones Técnicas */}
        <section className="col-specs" aria-label="Especificaciones técnicas">
          <article className="col-spec">
            <small className="mono">[Especificación 01]</small>
            <h3>Algodón 100% orgánico</h3>
            <p>
              Tejido tubular de punto grueso hilado en anillos con acabado pre-encogido para garantizar que las
              dimensiones originales se mantengan idénticas.
            </p>
          </article>

          <article className="col-spec">
            <small className="mono">[Especificación 02]</small>
            <h3>Serigrafía puff &amp; plastisol</h3>
            <p>
              Proceso manual de serigrafía en talleres de Bogotá y Medellín. Tintas al agua libres de PVC con
              tacto imperceptible o relieve 3D arquitectónico.
            </p>
          </article>

          <article className="col-spec">
            <small className="mono">[Especificación 03]</small>
            <h3>Corte oversized real</h3>
            <p>
              Patrones no basados en agrandar tallas estándar. Silueta cuadrada boxy construida desde cero con
              hombros desplazados y cuello cerrado no deformable.
            </p>
          </article>
        </section>
      </main>

      <SubscribeSection />
      <SiteFooter />

      {/* Modal Guía de Tallas */}
      {showSizeGuide && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Guía de tallas KULT STUDIO"
          onClick={() => setShowSizeGuide(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="mono" style={{ color: "var(--lime)", fontSize: ".6rem" }}>
                  ■ ESPECIFICACIÓN DE HORMA COLOMBIANA // OVERSIZED
                </p>
                <h2>Tabla de medidas (cm)</h2>
              </div>
              <button type="button" className="drawer-close mono" onClick={() => setShowSizeGuide(false)}>
                CERRAR ×
              </button>
            </div>
            <div className="modal-table-wrap">
              <table className="size-table mono">
                <thead>
                  <tr>
                    <th>Talla</th>
                    <th>Ancho pecho</th>
                    <th>Largo total</th>
                    <th>Hombro</th>
                    <th>Manga</th>
                    <th>Referencia corporal</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE_ROWS.map((r) => (
                    <tr key={r.talla} className={r.pop ? "hi" : undefined}>
                      <td>
                        <b>{r.talla}</b> {r.pop && <span className="pill">POPULAR</span>}
                      </td>
                      <td>{r.ancho}</td>
                      <td>{r.largo}</td>
                      <td>{r.hombro}</td>
                      <td>{r.manga}</td>
                      <td>{r.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
