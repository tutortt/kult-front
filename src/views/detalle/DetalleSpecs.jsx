/** Tira técnica de la ficha, derivada de los datos del producto. */
export function DetalleSpecs({ product }) {
  const especificaciones = [
    ["Tejido", "100% algodón peinado"],
    ["Gramaje", product.gramajeGsm ? `${product.gramajeGsm} GSM Heavyweight` : "—"],
    ["Corte", "Boxy / Oversized fit"],
    ["Origen", "Hecho en Portugal"],
  ];

  return (
    <section className="det-specs" aria-label="Especificaciones técnicas">
      <div className="wrap det-specs-grid">
        {especificaciones.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="det-spec">
            <span className="mono">{etiqueta}</span>
            <strong>{valor}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
