import {
  CATEGORY_STATUS,
  useCategories,
} from "../../controllers/catalog/useCategories";
import "./catalogo.css";
import { CategoriaCard } from "./CategoriaCard";

export function Categoria() {
  const { status, categories, message } = useCategories();

  if (status === CATEGORY_STATUS.LOADING) {
    return (
      <p className="mono" role="status">
        Cargando categorías…
      </p>
    );
  }

  if (status === CATEGORY_STATUS.ERROR) {
    return (
      <p className="msg err" role="alert">
        {message}
      </p>
    );
  }

  if (categories.length === 0) {
    return <p className="mono">No hay categorías disponibles.</p>;
  }

  return (
    <section className="grid" aria-label="Categorías de la tienda">
      {categories.map((categoria) => (
        <CategoriaCard key={categoria.idCategoria} categoria={categoria} />
      ))}
    </section>
  );
}
