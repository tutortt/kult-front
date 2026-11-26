const SECCIONES = [
  {
    id: "detalle-composicion",
    titulo: "Detalles y composición",
    contenido: [
      "Serigrafía de alta densidad con tintas plastisol mate y acabado acid-wash especial.",
      "Confeccionada en algodón peinado de gramaje pesado con caída boxy y hombros arquitectónicos.",
      "Pieza seriada del Drop 04. Incluye bolsa coleccionable hermética antiestática y certificado de autenticidad numerado.",
    ],
  },
  {
    id: "detalle-cuidados",
    titulo: "Guía de cuidados",
    contenido: [
      "Lavar a máquina en frío, programa delicado y con el producto del revés.",
      "No usar blanqueadores. Secar al aire, evitando luz solar directa.",
      "Planchar a temperatura baja sin aplicar calor directo sobre la serigrafía.",
    ],
  },
  {
    id: "detalle-envios",
    titulo: "Envíos y devoluciones",
    contenido: [
      "Despachos nacionales inmediatos desde Bogotá D.C. con Servientrega y Coordinadora.",
      "Entregas en Bogotá y Medellín en 24h a 48h hábiles. Resto del país: 2 a 4 días hábiles.",
      "Cambios y devoluciones sin costo durante los primeros 30 días calendario tras la entrega.",
    ],
  },
];

/** Acordeón informativo de la ficha (nativo, sin estado adicional). */
export function DetalleTabs() {
  return (
    <section className="det-tabs wrap" id="detalle-tabs" aria-label="Información adicional">
      {SECCIONES.map((seccion, index) => (
        <details key={seccion.id} id={seccion.id} open={index === 0}>
          <summary className="mono">
            <span>{seccion.titulo}</span>
            <b aria-hidden="true" />
          </summary>
          <ul>
            {seccion.contenido.map((parrafo) => (
              <li key={parrafo}>{parrafo}</li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
