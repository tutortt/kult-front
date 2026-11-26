import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";
import "./catalogo.css";
import { Categoria } from "./Categoria";
import { Header } from "./Header";

/** Pantalla que muestra las categorías devueltas por la API. */
export function CategoriasPage() {
  return (
    <>
      <Header />
      <main className="catalog-page">
        <div className="wrap catalog-head">
          <div>
            <p className="mono">KULT STUDIO // Catálogo</p>
            <h1>Categorías</h1>
            <p className="lead">
              Líneas oficiales de la colección. Consulta las familias de
              productos disponibles en KULT.
            </p>
          </div>
          <Link className="back mono" to={ROUTES.HOME}>
            [Volver al acceso]
          </Link>
        </div>

        <Categoria />
      </main>
    </>
  );
}
