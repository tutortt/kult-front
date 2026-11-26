import { useState } from "react";
import { ROUTES, navigate } from "../../controllers/router/navigation";
import { setAdminSession } from "../../models/auth/adminSession";
import { httpClient } from "../../models/http/httpClient";
import { ArrowRightIcon, EyeIcon, LockIcon, MailIcon, ShieldIcon } from "../icons";
import { Link } from "../Link";
import "../login/auth.css";
import "./admin.css";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await httpClient.post("/api/auth/admin/login", { email, password });
      if (data?.rol !== "ADMIN") throw new Error("No autorizado");
      setAdminSession(data);
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "No se pudo iniciar sesión admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <header className="bar">
        <Link className="brand" to={ROUTES.HOME} aria-label="Volver a KULT STUDIO">
          <span className="logo" aria-hidden="true">KULT</span>
          <span>
            <b>KULT // STUDIO</b>
            <small>Admin Sys V4.02</small>
          </span>
        </Link>
        <nav className="mono">
          <span style={{ color: "var(--muted)" }}>NODO: BOG-01</span>
          <Link className="back" to={ROUTES.HOME}>
            [VOLVER A LA TIENDA]
          </Link>
        </nav>
      </header>

      <main className="admin-login-main">
        <section className="admin-login-card" aria-label="Acceso administrador">
          <div className="term mono">
            <span>TERMINAL // KULT-ADMIN 4.02</span>
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>

          <div className="admin-login-head">
            <span className="tag mono">ROOT ACCESS // ACCESO SEGURO</span>
            <h1>Panel Administrador</h1>
            <p className="admin-login-lead">
              Ingresa con tu cuenta autorizada. Si aún no existe un administrador registrado, la primera cuenta válida
              será promovida a <b>ADMIN</b>.
            </p>
          </div>

          <form className="admin-form" onSubmit={onSubmit} noValidate>
            <div className="admin-field">
              <div className="admin-label-row mono">
                <label htmlFor="admin-email">Identificador / Correo</label>
                <span>[COLOMBIA REG.]</span>
              </div>
              <div className="admin-input-wrap">
                <span className="admin-input-ic" aria-hidden="true">
                  <MailIcon />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@kultstudio.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-field">
              <div className="admin-label-row mono">
                <label htmlFor="admin-password">Contraseña cifrada</label>
                <span>TLS 1.3</span>
              </div>
              <div className="admin-input-wrap">
                <span className="admin-input-ic" aria-hidden="true">
                  <LockIcon />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon />
                </button>
              </div>
            </div>

            {error && (
              <p className="admin-msg error" role="alert">
                {error}
              </p>
            )}

            <button className="btn lime admin-login-submit" type="submit" disabled={loading}>
              <span>{loading ? "Verificando credenciales..." : "Ingresar al admin"}</span>
              {!loading && <ArrowRightIcon />}
            </button>
          </form>

          <div className="admin-login-foot mono">
            <span className="admin-sec-badge">
              <ShieldIcon />
              <span>SEC PROTOCOL: TLS 1.3 // LOCKED</span>
            </span>
            <Link className="lime-link" to={ROUTES.HOME}>
              ← Volver a la tienda
            </Link>
          </div>
        </section>
      </main>

      <footer className="auth-foot mono">
        <span>© 2026 KULT STUDIO INC. PANEL OPERATIVO // BOGOTÁ, COLOMBIA</span>
        <span className="ok">● SISTEMA ACTIVO · ROOT GATEWAY</span>
      </footer>
    </div>
  );
}
