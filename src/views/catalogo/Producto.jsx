import { formatPrice, isAvailable } from "../../models/catalog/product";

export function Producto({ producto, onAgregar = () => {} }) {
  const { nombre, categoria, talla, precio, stock, imagen } = producto;
  const disponible = isAvailable(stock);

  return (
    <article className="card">
      {imagen ? (
        <img className="card-image" src={imagen} alt={nombre} loading="lazy" />
      ) : (
        <div
          className="card-image ph"
          role="img"
          aria-label={`Imagen de ${nombre}`}
        />
      )}

      <span className="bagge">{categoria}</span>
      <h2>{nombre}</h2>
      {talla && <p className="muted">Talla {talla}</p>}
      <p>Precio: {formatPrice(precio)}</p>
      <span className={`stock ${disponible ? "on" : "off"}`}>
        {disponible ? "Disponible" : "Agotado"}
      </span>
      <button type="button" onClick={() => onAgregar(producto)} disabled={!disponible}>
        Agregar camisa
      </button>
    </article>
  );
}
