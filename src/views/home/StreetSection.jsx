import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

const SHOTS = [
  { id: "01", city: "BOGOTÁ // CHAPINERO", handle: "@MATEO.RAW", piece: "SYSTEM OVERRIDE 300G" },
  { id: "02", city: "MEDELLÍN // PROVENZA", handle: "@SARA.KULT", piece: "NEO-TOKYO ACID WASH" },
  { id: "03", city: "CALI // GRANADA", handle: "@ANDRES.V2", piece: "MANIFESTO 350G" },
  { id: "04", city: "BOGOTÁ // CENTRO", handle: "@KULT.ARCHIVE", piece: "CARGO V.2 + BEANIE" },
];

/** Comunidad y estilo callejero. */
export function StreetSection() {
  return (
    <section className="street" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="home-head">
          <div>
            <p className="eyebrow mono" style={{ color: "var(--muted)" }}>
              [ Comunidad &amp; calle ]
            </p>
            <h2>#KULTSTUDIO street style</h2>
          </div>
          <div className="r">
            <p>Etiqueta tu look en Instagram para entrar al archivo permanente.</p>
            <Link className="btn dark" to={ROUTES.EDITORIAL}>
              Ver Editorial Lookbook →
            </Link>
          </div>
        </div>

        <div className="shots">
          {SHOTS.map((shot) => (
            <Link
              to={ROUTES.EDITORIAL}
              key={shot.id}
              className="cat"
              style={{
                border: "1px solid var(--line)",
                background:
                  shot.id === "02"
                    ? "radial-gradient(60% 55% at 50% 40%, #2a3322, #0c0d0f)"
                    : "radial-gradient(60% 55% at 50% 40%, #2c2e34, #0c0d0f)",
              }}
            >
              <div className="top mono">
                <span>LOOK {shot.id}</span>
                <span>↗</span>
              </div>
              <small className="mono">{shot.city}</small>
              <h3 style={{ fontSize: "1rem" }}>{shot.piece}</h3>
              <span className="n mono">{shot.handle}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
