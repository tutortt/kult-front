import { useRef } from "react";

import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

const CATEGORIES = [
  {
    n: "Cat 01",
    label: "Patrón drop shoulder",
    title: "Oversized silhouette",
    count: "18 modelos",
    to: ROUTES.OVERSIZED,
    bg: "linear-gradient(155deg, #272a30 0%, #101114 70%)",
    glyph: "350 GSM",
  },
  {
    n: "Cat 02",
    label: "Serigrafías craqueladas",
    title: "Vintage graphic tees",
    count: "24 modelos",
    to: ROUTES.GRAFICAS,
    bg: "linear-gradient(155deg, #242b1c 0%, #0e100d 70%)",
    glyph: "PUFF 3D",
  },
  {
    n: "Cat 03",
    label: "Arquitectura pura",
    title: "Minimal essentials",
    count: "12 modelos",
    to: ROUTES.CATALOGO,
    bg: "linear-gradient(155deg, #2b2c30 0%, #0d0e11 70%)",
    glyph: "CORE LAB",
  },
  {
    n: "Cat 04",
    label: "Tiradas numeradas",
    title: "Collab editions",
    count: "6 modelos",
    to: ROUTES.NOVEDADES,
    colab: true,
    bg: "linear-gradient(155deg, #323620 0%, #0d0e10 70%)",
    glyph: "DROP 04",
  },
];

/** Carrusel de categorías de silueta conectado al flujo de vistas. */
export function CategoryCarousel() {
  const trackRef = useRef(null);

  function scroll(direction) {
    trackRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  return (
    <section id="categorias">
      <div className="wrap">
        <div className="home-head">
          <div>
            <p className="eyebrow mono" style={{ color: "var(--muted)" }}>
              [ Explorar por clasificación ]
            </p>
            <h2>Categorías de silueta</h2>
          </div>
          <div className="arrows">
            <button type="button" onClick={() => scroll(-1)} aria-label="Categoría anterior">
              ‹
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Categoría siguiente">
              ›
            </button>
          </div>
        </div>

        <div className="cats" id="cats" ref={trackRef}>
          {CATEGORIES.map((category) => (
            <Link className="cat" to={category.to} key={category.n} style={{ background: category.bg, border: "1px solid var(--line)" }}>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--display)",
                  fontWeight: 800,
                  fontSize: "2.4rem",
                  color: "rgba(198,245,0,0.09)",
                  letterSpacing: "0.08em",
                  zIndex: 0,
                }}
              >
                {category.glyph}
              </div>
              <div className="top mono">
                <span className={category.colab ? "colab" : undefined}>{category.n}</span>
                <span>↗</span>
              </div>
              <small className="mono">{category.label}</small>
              <h3>{category.title}</h3>
              <span className="n mono">{category.count} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
