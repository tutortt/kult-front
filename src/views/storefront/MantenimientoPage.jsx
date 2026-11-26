import { useEffect, useState } from "react";
import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";
import "./storefront.css";

export function MantenimientoPage() {
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 45 * 60 + 12);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="maint-page">
      <header className="bar mono">
        <Link className="brand" to={ROUTES.HOME}>
          <span className="logo" aria-hidden="true">KULT</span>
          <span><b>KULT</b><small>Studio // Protocolo</small></span>
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: ".62rem" }}>
          <span style={{ color: "var(--muted)" }}>
            CANAL EMERGENCIAS: <b style={{ color: "var(--lime)" }}>SOPORTE@KULTSTUDIO.CO</b>
          </span>
          <Link to={ROUTES.HOME} className="back">
            [VOLVER A LA TIENDA]
          </Link>
        </div>
      </header>

      <main className="wrap maint-main">
        <span className="tag mono">CÓDIGO // 503 SERVICE UNAVAILABLE · [CIERRE TEMPORAL]</span>
        <h1>
          MODO MANTENIMIENTO
          <br />
          // SISTEMA OFFLINE
        </h1>
        <p style={{ maxWidth: "56ch", color: "#b4b6bd" }}>
          Estamos optimizando los servidores y preparando el próximo Drop 05. Nuestra tienda online se reabrirá en breve
          con la nueva colección bajo nuevos parámetros de inventario serializado.
        </p>

        <div className="maint-telemetry mono">
          <div className="maint-cell">
            <span>ESTADO OPERATIVO:</span>
            <b>EN REVISIÓN TÉCNICA</b>
          </div>
          <div className="maint-cell">
            <span>MOTIVO:</span>
            <b style={{ color: "var(--text)" }}>DESPLIEGUE DROP 05</b>
          </div>
          <div className="maint-cell">
            <span>ESTIMADO DE REAPERTURA:</span>
            <b>{h}H : {m}M : {s}S</b>
          </div>
          <div className="maint-cell">
            <span>SOPORTE DE PEDIDOS:</span>
            <b style={{ color: "var(--text)" }}>SOPORTE@KULTSTUDIO.CO</b>
          </div>
        </div>

        <form
          className="panel"
          style={{ width: "min(100%, 560px)", display: "grid", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setNotified(true);
          }}
        >
          <span className="mono" style={{ color: "var(--lime)", fontSize: ".64rem" }}>
            NOTIFICACIÓN INMEDIATA AL ABRIR
          </span>
          <p style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            Ingresa tu correo para ser notificado de inmediato cuando la tienda y el próximo lanzamiento estén disponibles.
          </p>
          <div className="vip-form">
            <input
              type="email"
              required
              placeholder="TU CORREO ELECTRÓNICO..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNotified(false);
              }}
            />
            <button type="submit" className="btn lime">
              {notified ? "[ ALERTA ACTIVADA ✓ ]" : "[ NOTIFICARME REAPERTURA ]"}
            </button>
          </div>
        </form>
      </main>

      <footer className="auth-foot mono">
        <span>© 2026 KULT STUDIO INC. TIENDA OFICIAL COLOMBIA // BOGOTÁ</span>
        <span className="ok">● ESTADO: MANTENIMIENTO ACTIVO · SHA-256 ENCRYPTED</span>
      </footer>
    </div>
  );
}
