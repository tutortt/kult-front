import { useProductImageUpload } from "../../controllers/catalog/useProductImageUpload";
import { useProducts } from "../../controllers/catalog/useProducts";
import { resolveImageUrl } from "../../models/catalog/product";
import { AdminLayout } from "./AdminLayout";

export function ProductImagesAdmin() {
  const { products, isLoading, reload } = useProducts();
  const { form, isSaving, message, error, updateField, submit, remove } = useProductImageUpload();
  const selectedProduct = products.find((product) => String(product.idProducto) === String(form.productId));

  return (
    <AdminLayout title="Imagenes de Productos" eyebrow="[ Media / Catalogo ]">
      <p className="intro" style={{color:"var(--muted)", marginBottom:24}}>Carga imagenes por producto. Se almacenan como BLOB en MySQL y se sirven desde el endpoint <code>/api/producto/imagenes/{'{id}'}/contenido</code>.</p>
      <div className="admin-grid">
        <section className="admin-card">
          <h2>Cargar imagen</h2>
          <form className="admin-form" onSubmit={(event) => submit(event, reload)}>
            <div className="admin-field">
              <label htmlFor="admin-producto">Producto</label>
              <select id="admin-producto" name="productId" value={form.productId} onChange={updateField} required>
                <option value="">Selecciona un producto...</option>
                {products.map((product) => <option key={product.idProducto} value={product.idProducto}>#{product.idProducto} - {product.nombre}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="admin-archivo">Archivo (WebP, PNG, JPEG o GIF, max. 5 MB)</label>
              <input id="admin-archivo" name="file" type="file" accept="image/webp,image/png,image/jpeg,image/gif" onChange={updateField} required />
            </div>
            <div className="admin-field"><label htmlFor="admin-orden">Orden</label><input id="admin-orden" name="orden" type="number" min="0" value={form.orden} onChange={updateField} /></div>
            <div className="admin-field admin-check"><input id="admin-principal" name="principal" type="checkbox" checked={form.principal} onChange={updateField} /><label htmlFor="admin-principal">Marcar como imagen principal</label></div>
            {message && <p className="admin-msg">{message}</p>}
            {error && <p className="admin-msg error">{error}</p>}
            <div className="admin-actions"><button className="btn lime" type="submit" disabled={isSaving}>{isSaving ? "Procesando..." : "Subir imagen"}</button></div>
          </form>
        </section>
        <section className="admin-card">
          <h2>Imagenes actuales</h2>
          {isLoading && <p className="admin-empty">Cargando productos...</p>}
          {!isLoading && !selectedProduct && <p className="admin-empty">Selecciona un producto para ver sus imagenes.</p>}
          {!isLoading && selectedProduct && <ProductThumbnails product={selectedProduct} isSaving={isSaving} onRemove={(id) => remove(id, reload)} />}
        </section>
      </div>
    </AdminLayout>
  );
}

function ProductThumbnails({ product, isSaving, onRemove }) {
  if (!product.imagenes?.length) return <p className="admin-empty">Este producto aun no tiene imagenes cargadas.</p>;
  return (
    <div className="admin-thumbs">
      {product.imagenes.map((image) => (
        <div className="admin-thumb" key={image.idImagen}>
          <img src={resolveImageUrl(image.url)} alt={image.nombreArchivo} />
          <span className="mt">#{image.idImagen} · {image.nombreArchivo}<br />{image.principal && <b>PRINCIPAL</b>}</span>
          <button className="del" type="button" disabled={isSaving} onClick={() => onRemove(image.idImagen)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
