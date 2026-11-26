import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";
import "./HeaderLogin.css";
import "./auth.css";

export function HeaderLogin() {
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

      <nav aria-label="Navegación de acceso">
        <span className="cur mono">CUR: COP ($)</span>
        <Link className="back mono" to={ROUTES.CATEGORIES}>
          [Ver categorías]
        </Link>
      </nav>
    </header>
  );
}
