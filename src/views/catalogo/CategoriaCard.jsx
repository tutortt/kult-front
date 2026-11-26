export function CategoriaCard({ categoria }) {
  const { nombre, descripcion } = categoria;

  return (
    <article className="card">
      <h2>{nombre}</h2>
      {descripcion && <p className="muted">{descripcion}</p>}
    </article>
  );
}
