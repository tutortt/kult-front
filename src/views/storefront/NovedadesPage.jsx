import { useEffect, useMemo, useState } from "react";
import { useProducts } from "../../controllers/catalog/useProducts";
import { ROUTES } from "../../controllers/router/navigation";
import { SIZE_OPTIONS } from "../../models/catalog/product";
import { CatalogCard } from "../catalogo/CatalogCard";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./storefront.css";

const NOV_TABS = [
  { id: "all", label: "Todos los lanzamientos" },
  { id: "tees", label: "Tees & Camisetas" },
  { id: "graphic", label: "Graphic Archive" },
  { id: "hoodies", label: "Hoodies & Buzos" },
  { id: "gear", label: "Pantalones & Accesorios" },
];

export function NovedadesPage() {
  const { products, isLoading } = useProducts();
  const [tab, setTab] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [whatsapp, setWhatsapp] = useState("");
  const [vipJoined, setVipJoined] = useState(false);
  const [tick, setTick] = useState(4 * 86400 + 18 * 3600 + 22 * 60 + 44);

  useEffect(() => {
    const id = setInterval(() => setTick((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(tick / 86400);
  const hours = Math.floor((tick % 86400) / 3600);
  const mins = Math.floor((tick % 3600) / 60);
  const secs = tick % 60;

  const filtered = useMemo(() => {
    let list = [...products];
    if (tab === "tees") {
      list = list.filter((p) => /tee|camiseta|longsleeve/i.test(`${p.nombre} ${p.categoria?.nombre}`));
    } else if (tab === "graphic") {
      list = list.filter((p) => p.isGraphic);
    } else if (tab === "hoodies") {
      list = list.filter((p) => /hoodie|buzo/i.test(`${p.nombre} ${p.categoria?.nombre}`));
    } else if (tab === "gear") {
      list = list.filter((p) => /cargo|beanie|sock|accesorio|pantal/i.test(`${p.nombre} ${p.categoria?.nombre}`));
    }
    if (sizeFilter) {
      list = list.filter((p) => (p.tallas ?? []).includes(sizeFilter));
    }
    if (sortBy === "price-asc") list.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (sortBy === "price-desc") list.sort((a, b) => Number(b.precio) - Number(a.precio));
    else if (sortBy === "gsm-desc") list.sort((a, b) => Number(b.gramajeGsm) - Number(a.gramajeGsm));
    return list;
  }, [products, tab, sizeFilter, sortBy]);

  return (
    <div className="sf-page">
      <HomeHeader />

      <div className="wrap sf-crumb mono">
        <span>
          <Link to={ROUTES.HOME}>INICIO</Link> / <b>NOVEDADES</b> / LANZAMIENTOS RECIENTES &amp; DROPS ACTUALES
        </span>
        <span className="lime">● ACTUALIZACIÓN EN TIEMPO REAL // NUEVOS MODELOS EN STOCK</span>
      </div>

      <section className="sf-hero">
        <div className="wrap sf-hero-row">
          <div>
            <p className="eyebrow mono">[ NUEVOS LANZAMIENTOS // DROP 04 ]</p>
            <h1>
              NOVEDADES
              <br />
              <em>RECIÉN LLEGADOS</em>
            </h1>
            <p className="lead">
              Las últimas incorporaciones, tiradas limitadas y cápsulas colaborativas confeccionadas en algodón peinado de
              alto gramaje (280–420 GSM). Stock limitado con despacho express en toda Colombia.
            </p>
          </div>
          <div className="sf-kpi-row">
            <div className="sf-kpi">
              <span className="mono">PIEZAS ACTIVAS</span>
              <strong>{filtered.length} PIEZAS</strong>
            </div>
            <div className="sf-kpi">
              <span className="mono">DESPACHO COLOMBIA</span>
              <strong>24H / 48H</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros funcionales */}
      <div className="sf-filter-bar">
        <div className="wrap sf-filter-inner">
          <div className="sf-pills" role="tablist" aria-label="Filtrar novedades">
            {NOV_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? "active" : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="sf-filter-right">
            <div className="sf-size-bar" role="group" aria-label="Filtrar por talla">
              {SIZE_OPTIONS.slice(1).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={sizeFilter === sz ? "active" : undefined}
                  onClick={() => setSizeFilter((prev) => (prev === sz ? "" : sz))}
                  aria-pressed={sizeFilter === sz}
                >
                  {sz}
                </button>
              ))}
            </div>
            <select
              className="sf-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ordenar novedades"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="gsm-desc">Mayor gramaje</option>
            </select>
          </div>
        </div>
      </div>

      <main className="wrap sf-section">
        {isLoading ? (
          <p className="mono" style={{ color: "var(--muted)" }}>Cargando novedades…</p>
        ) : filtered.length === 0 ? (
          <div className="col-empty">
            <p className="mono">NO HAY NOVEDADES CON ESOS FILTROS</p>
            <button
              type="button"
              className="btn lime"
              onClick={() => {
                setTab("all");
                setSizeFilter("");
              }}
            >
              VER TODOS LOS LANZAMIENTOS
            </button>
          </div>
        ) : (
          <div className="sf-grid-3">
            {filtered.map((p) => (
              <CatalogCard key={p.idProducto} product={p} variant="novedades" />
            ))}
          </div>
        )}
      </main>

      {/* Próximo Drop 05 Countdown */}
      <section className="wrap sf-section" style={{ paddingTop: 0 }}>
        <div className="drop-banner">
          <div>
            <p className="eyebrow mono">[ PRÓXIMO LANZAMIENTO // CÁPSULA SERIAL ]</p>
            <h2>DROP 05 // CYBER-DISTORTION</h2>
            <p>
              Segunda fase de nuestra serie industrial. 300 prendas numeradas a mano con serigrafía fotoluminiscente,
              ripstop técnico y certificado criptográfico.
            </p>
            <div className="drop-timer mono" aria-label="Cuenta regresiva Drop 05">
              <div>
                <strong>{String(days).padStart(2, "0")}</strong>
                <span>DÍAS</span>
              </div>
              <div>
                <strong>{String(hours).padStart(2, "0")}</strong>
                <span>HORAS</span>
              </div>
              <div>
                <strong>{String(mins).padStart(2, "0")}</strong>
                <span>MIN</span>
              </div>
              <div>
                <strong>{String(secs).padStart(2, "0")}</strong>
                <span>SEG</span>
              </div>
            </div>
            <a href="#vip-whatsapp" className="btn lime">
              ACTIVAR RECORDATORIO POR WHATSAPP / SMS →
            </a>
          </div>
          <div className="drop-blueprint">
            <svg viewBox="0 0 320 220" width="100%" aria-hidden="true">
              <rect x="10" y="10" width="300" height="200" fill="none" stroke="#33353b" strokeDasharray="4 4" />
              <path
                d="M115 44 L140 58 C154 66 166 66 180 58 L205 44 L250 70 L272 130 L232 142 L220 108 L220 192 L100 192 L100 108 L88 142 L48 130 L70 70 Z"
                fill="#15171b"
                stroke="#c6f500"
                strokeWidth="2"
              />
              <text x="160" y="120" textAnchor="middle" fill="#c6f500" fontFamily="monospace" fontWeight="700" fontSize="12">
                DROP 05 // 420 GSM
              </text>
              <text x="160" y="140" textAnchor="middle" fill="#8a8c93" fontFamily="monospace" fontSize="9">
                300 UDS NUMERADAS · BOGOTÁ
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Beneficios Colombia */}
      <section className="sf-section alt">
        <div className="wrap sf-grid-4">
          <article className="sf-card">
            <span className="sf-num">01</span>
            <h3>Envíos Express Colombia</h3>
            <p>Despacho inmediato desde Bogotá y Medellín vía Servientrega y Coordinadora.</p>
            <div className="sf-card-foot mono"><span>TIEMPO</span><b>24H - 48H</b></div>
          </article>
          <article className="sf-card">
            <span className="sf-num">02</span>
            <h3>Cambios Fáciles 30 Días</h3>
            <p>¿Necesitas otra talla? Cambia sin trámites en nuestras sedes físicas o por guía nacional.</p>
            <div className="sf-card-foot mono"><span>GARANTÍA</span><b>SIN COSTO</b></div>
          </article>
          <article className="sf-card">
            <span className="sf-num">03</span>
            <h3>Métodos Nacionales</h3>
            <p>PSE, Nequi, Daviplata, tarjetas de crédito/débito y 3 cuotas sin interés con Addi.</p>
            <div className="sf-card-foot mono"><span>PASARELA</span><b>SSL 256-BIT</b></div>
          </article>
          <article className="sf-card">
            <span className="sf-num">04</span>
            <h3>Gramaje Certificado</h3>
            <p>Algodón orgánico peinado de alto calibre 280–420 GSM pre-encogido en taller.</p>
            <div className="sf-card-foot mono"><span>ESTÁNDAR</span><b>GOTS LAB</b></div>
          </article>
        </div>
      </section>

      {/* Alerta VIP WhatsApp */}
      <section className="wrap sf-section" id="vip-whatsapp">
        <div className="vip-box">
          <p className="eyebrow mono">■ ALERTA VIP // PRIORIDAD COLOMBIA</p>
          <h2>NUNCA TE QUEDES SIN TU TALLA EN UN DROP</h2>
          <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>
            Únete a nuestra lista de difusión privada por WhatsApp. Recibe el enlace secreto 15 minutos antes de cada
            lanzamiento limitado.
          </p>
          <form
            className="vip-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (whatsapp.trim()) setVipJoined(true);
            }}
          >
            <input
              type="tel"
              placeholder="+57 310 000 0000"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                setVipJoined(false);
              }}
              required
              aria-label="Número de WhatsApp"
            />
            <button type="submit" className="btn lime">
              {vipJoined ? "REGISTRADO EN LISTA VIP ✓" : "UNIRME A LA LISTA VIP →"}
            </button>
          </form>
        </div>
      </section>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
