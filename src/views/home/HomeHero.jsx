import { useEffect, useState } from "react";
import camisa1 from "../../assets/img/camisa1.webp";
import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

const MARQUEE_ITEMS = [
  "Drop 04 online // Silueta reforzada 280GSM",
  "Algodón orgánico sin pesticidas",
  "Serigrafía textil alta densidad",
  "Patronaje boxy unisex",
];

/** Hero principal con contador en vivo y banner en movimiento (fiel a Home.png). */
export function HomeHero() {
  const [seconds, setSeconds] = useState(13 * 3600 + 40 * 60 + 51);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 13 * 3600)), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="tag mono">Edición limitada // 150 unidades</span>
            <p className="proto mono">
              [ Protocolo de lanzamiento ] • <b>Temporada 2026</b>
            </p>
            <h1>
              Drop 04 <em>Hyper-</em>structure
            </h1>
            <p className="lead">
              280–420 GSM Heavyweight French Terry &amp; Algodón Orgánico 100%. Patronaje arquitectónico de silueta
              oversized desarrollado en nuestros talleres experimentales de Bogotá y Medellín.
            </p>

            <div className="count" role="timer" aria-label="Cierre de acceso privado">
              <div className="top mono">
                <span>Cierre de acceso privado</span>
                <b>Status: Activo</b>
              </div>
              <div className="cells">
                <div className="cell">
                  <strong>{hh}</strong>
                  <span>HORAS</span>
                </div>
                <div className="cell">
                  <strong>{mm}</strong>
                  <span>MIN</span>
                </div>
                <div className="cell">
                  <strong>{ss}</strong>
                  <span>SEG</span>
                </div>
                <div className="cell">
                  <strong>04</strong>
                  <span>LOTE</span>
                </div>
              </div>
            </div>

            <div className="cta-row">
              <Link className="btn lime" to={ROUTES.CATALOGO}>
                Comprar ahora
                <svg width="14" height="10" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 6h13M9 1l5 5-5 5" />
                </svg>
              </Link>
              <Link className="btn dark" to={ROUTES.EDITORIAL}>
                Ver Lookbook
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <img
              src={camisa1}
              alt="Modelo con camiseta oversized negra Drop 04"
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                objectFit: "cover",
                border: "1px solid var(--line)",
                background: "var(--deep)",
              }}
            />
            <span className="spec mono" style={{ background: "rgba(12,13,15,.82)", padding: "4px 8px" }}>
              Spec: 300 GSM //
              <br />
              Architectural fit
            </span>
            <div className="cap">
              <span className="mono">[Peso pesado certificado]</span>
              Estructura rígida de caída recta que mantiene su silueta intacta tras lavado.
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </>
  );
}
