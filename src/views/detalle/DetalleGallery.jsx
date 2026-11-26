import { useState } from "react";
import { getMainImage, resolveImageUrl } from "../../models/catalog/product";
import { ProductVisual } from "../catalogo/ProductVisual";

/** Galería principal de la ficha: imagen destacada, miniaturas y visual de respaldo. */
export function DetalleGallery({ product }) {
  const imagenes = Array.isArray(product.imagenes) ? product.imagenes : [];
  const principal = getMainImage(product);
  const initialIndex = Math.max(0, imagenes.findIndex((imagen) => imagen === principal));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const activa = imagenes[activeIndex] ?? principal;
  const numeroVista = String(activeIndex + 1).padStart(2, "0");
  const etiquetaVista = activeIndex === 0 ? "FRONTAL" : "SERIGRAFÍA TRASERA";

  return (
    <div className="det-gallery">
      <div className="det-gallery-stage" style={{ padding: activa ? undefined : 0 }}>
        <span className="det-gallery-badge mono">Drop 04 // Limited 150 pcs</span>
        <span className="det-gallery-edition mono">{product.badge || "Edición limitada"}</span>
        {activa ? (
          <img src={resolveImageUrl(activa.url)} alt={`${product.nombre} · vista ${numeroVista}`} />
        ) : (
          <ProductVisual product={product} />
        )}
      </div>

      <div className="det-gallery-caption mono">
        <span>Vista {numeroVista} // {etiquetaVista}</span>
        <span>{imagenes.length > 0 ? `${imagenes.length} vista${imagenes.length > 1 ? "s" : ""}` : `${product.gramajeGsm || 280} GSM SPEC`}</span>
      </div>

      {imagenes.length > 1 && (
        <div className="det-thumbs" aria-label="Vistas del producto">
          {imagenes.map((imagen, index) => (
            <button
              key={imagen.idImagen ?? index}
              type="button"
              className={`det-thumb${index === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver vista ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={resolveImageUrl(imagen.url)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
