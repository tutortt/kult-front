const RESEÑAS = [
  {
    nombre: "Marcos G.",
    ciudad: "Bogotá D.C.",
    talla: "L",
    cuando: "Hace 2 días",
    texto:
      "Llevo tiempo buscando una camiseta que no se deforme en el cuello tras 2 lavados. El corte boxy cae perfecto y el estampado neón de la espalda resalta brutal en persona.",
  },
  {
    nombre: "David R.",
    ciudad: "Medellín",
    talla: "L",
    cuando: "Hace 1 semana",
    texto:
      "Mido 1,82 m, pillé la L tal como recomiendan y el drop de hombros es impecable. El tratamiento acid-wash le da un rollo noventero futurista tremendo.",
  },
  {
    nombre: "Alex S.",
    ciudad: "Cali",
    talla: "M",
    cuando: "Hace 2 semanas",
    texto:
      "Llegó en bolsa sellada con tarjeta seriada y pegatinas exclusivas. Se siente como coleccionismo más que comprar ropa común.",
  },
];

/** Bloque de prueba social de la ficha. */
export function DetalleReviews() {
  return (
    <section className="det-reviews" aria-label="Valoraciones">
      <div className="wrap">
        <div className="det-reviews-head">
          <div>
            <p className="eyebrow mono">[ Calidad comprobada ]</p>
            <h2>El 98% de los compradores destaca los 280 GSM y el corte boxy</h2>
          </div>
          <div className="det-score">
            <strong>4.9</strong>
            <span className="mono">★★★★★</span>
            <span className="mono">142 valoraciones</span>
          </div>
        </div>

        <div className="det-reviews-grid">
          {RESEÑAS.map((reseña) => (
            <article key={reseña.nombre} className="det-review">
              <div className="det-review-meta mono">
                <span>{reseña.cuando}</span>
                <span>★★★★★</span>
              </div>
              <p>“{reseña.texto}”</p>
              <footer className="mono">
                <b>{reseña.nombre}</b> // {reseña.ciudad}
                <span>Compra verificada (talla {reseña.talla})</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
