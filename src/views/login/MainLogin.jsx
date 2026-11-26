import { ShieldIcon } from "../icons";
import { BENEFITS, NODE_STATUS, STATS } from "./loginContent";
import { LoginForm } from "./LoginForm";

export function MainLogin() {
  return (
    <main className="auth-main">
      <div className="auth-grid">
        <section className="auth-card">
          <div className="login-intro">
            <div className="auth-top mono">
              <span className="tag">Fase // 04 • Auth gateway</span>
              <span>BOG</span>
            </div>
            <p className="proto">Protocolo de acceso // Miembros KULT</p>
            <h1>Iniciar sesión en KULT STUDIO</h1>
            <p className="lead">
              Identificación requerida para consultar compras, pedidos, seriales
              adquiridos y activaciones clandestinas en Colombia.
            </p>
          </div>

          <div
            className="visual"
            role="img"
            aria-label="Colección oficial 2026 Bogotá"
          >
            <div className="frame" />
            <span className="cap mono">Colección oficial // 2026.BOG</span>
          </div>

          <div className="benefits">
            <h2>
              <span className="benefit-icon">
                <ShieldIcon />
              </span>
              Beneficios de identificación
            </h2>
            <ol>
              {BENEFITS.map((benefit, index) => (
                <li key={benefit}>
                  <b>{String(index + 1).padStart(2, "0")}.</b>
                  <span>{benefit}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="node mono">
            <span>
              {NODE_STATUS.label.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
            <span className="on">{NODE_STATUS.value}</span>
          </div>
        </section>

        <LoginForm />
      </div>

      <div className="stats mono" role="status">
        {STATS.map((stat) => (
          <span key={stat}>{stat}</span>
        ))}
      </div>
    </main>
  );
}
