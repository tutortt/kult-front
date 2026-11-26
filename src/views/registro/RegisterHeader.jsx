import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

/** Cabecera minimalista de las pantallas de autenticación. */
export function RegisterHeader() {
  return (
    <header className="bar">
      <Link
        className="brand"
        to={ROUTES.HOME}
        aria-label="Ir al inicio de KULT"
      >
        <span className="logo" aria-hidden="true">
          KULT
        </span>
        <span>
          <b>KULT</b>
          <small>Studio // Lab</small>
        </span>
      </Link>

      <nav aria-label="Navegación de registro">
        <span className="cur mono">CUR: COP ($)</span>
        <Link className="back mono" to={ROUTES.HOME}>
          [Volver a la tienda]
        </Link>
      </nav>
    </header>
  );
}
