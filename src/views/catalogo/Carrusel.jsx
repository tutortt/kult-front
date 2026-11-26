export function Carrusel({ titulo, children }) {
  return (
    <section className="carrusel" aria-label={titulo}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
