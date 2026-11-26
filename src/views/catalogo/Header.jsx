import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

export function Header() {
  return (
    <header className="site">
      <div className="wrap">
        <Link className="brand" to={ROUTES.HOME} aria-label="Ir al inicio de KULT">
          <span className="logo" aria-hidden="true">
            KULT
          </span>
          <span>
            <b>KULT E-Commerce</b>
            <small>Studio // Lab</small>
          </span>
        </Link>

        <nav className="main" aria-label="Navegación principal">
          <Link to={ROUTES.CATEGORIES}>Catálogo</Link>
          <a href="/disenos">Diseños</a>
          <a href="/sedes">Sedes</a>
        </nav>
      </div>
    </header>
  );
}
