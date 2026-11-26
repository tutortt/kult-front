import { ShieldIcon } from "../icons";
import { RegisterForm } from "./RegisterForm";

/** Panel de admisión + formulario de registro. */
export function RegisterMain() {
  return (
    <main className="auth-main">
      <div className="auth-grid reg-grid">
        <section className="auth-card">
          <span className="tag mono">
            Sistema de admisión // Protocolo CO-2024
          </span>
          <h1>Crear tu cuenta</h1>
          <p className="auth-sub">// Registro exclusivo drop list</p>
          <p className="lead">
            Únete a la lista privada de KULT STUDIO para adquirir drops
            limitados con despacho express en Colombia antes de cada
            lanzamiento global.
          </p>

          <div
            className="visual wide"
            role="img"
            aria-label="Espacio industrial KULT"
          >
            <div className="mock" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="cap mono">
              <span>
                Bogotá, Colombia // 04.6097° N, 74.0817° W
                <br />
                Edición serial limitada // Run 08
              </span>
              <span className="alpha">[Acceso alpha]</span>
            </div>
          </div>

          <div className="quota">
            <div className="row mono">
              <span>Disponibilidad de cupo mensual</span>
              <b>87% asignado</b>
            </div>
            <div
              className="meter"
              role="progressbar"
              aria-valuenow="87"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span style={{ width: "87%" }} />
            </div>
            <p className="mono">
              <ShieldIcon />
              <span>
                100% datos privados // cero spam comercial // sistema v.4.02
              </span>
            </p>
          </div>
        </section>

        <RegisterForm />
      </div>
    </main>
  );
}
