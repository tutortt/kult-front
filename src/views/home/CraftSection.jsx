import { LeafIcon, RulerIcon, TruckIcon } from "../icons";

const FEATURES = [
  {
    icon: LeafIcon,
    number: "01 // Materia prima pura",
    title: "100% algodón orgánico",
    description:
      "Hilatura peinada de 280 GSM libre de pesticidas químicos. Densidad excepcional que ofrece cuerpo rígido, caída escultural y cero transparencia.",
    detail: "Certificado GOTS",
    symbol: "✓",
  },
  {
    icon: TruckIcon,
    number: "02 // Logística & despacho",
    title: "Envíos a todo el país",
    description:
      "Hub centralizado en Bogotá y Medellín con despachos express 24-48h a nivel nacional, empaque anti-manipulación sellado al vacío y rastreo en tiempo real.",
    detail: "Cobertura nacional total",
    symbol: "✓",
  },
  {
    icon: RulerIcon,
    number: "03 // Ingeniería textil",
    title: 'Cuello canalé reforzado 1.2"',
    description:
      "Canalé grueso 1x1 con elastano técnico preencogido y doble costura ciega que impide la deformación del cuello tras lavados intensivos.",
    detail: "Zero stretch out",
    symbol: "⤢",
  },
];

/** Sección de estándar industrial y confección. */
export function CraftSection() {
  return (
    <section className="craft">
      <div className="wrap">
        <div className="home-head">
          <div>
            <p className="eyebrow mono" style={{ color: "var(--muted)" }}>
              [ Estándar industrial y confección ]
            </p>
            <h2>
              Heavyweight fabric /
              <br />
              sustainable craft
            </h2>
          </div>
          <p>
            Prendas con calidad y confección nacional. Desarrollamos camisetas de alto gramaje diseñadas como piezas
            duraderas y de alta resistencia.
          </p>
        </div>

        <div className="feats">
          {FEATURES.map((feature) => (
            <article className="feat" key={feature.number}>
              <div className="ic">
                <feature.icon />
              </div>
              <small className="mono">{feature.number}</small>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="ft mono">
                <span>{feature.detail}</span>
                <span>{feature.symbol}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="dens">
          <div className="tx">
            <b>ÍNDICE DE DENSIDAD TEXTIL KULT</b>
            Comparativa frente al estándar convencional de mercado (140-160 GSM)
          </div>
          <div className="bar" role="img" aria-label="280 GSM, 85% más denso">
            <span />
          </div>
          <span className="v mono">280 GSM [+85%]</span>
        </div>
      </div>
    </section>
  );
}
