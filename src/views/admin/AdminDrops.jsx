import { useEffect, useState } from "react";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { formatPrice } from "../../models/catalog/product";
import { AdminLayout } from "./AdminLayout";

export function AdminDrops() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { httpProductRepository.getAll().then(setProducts).finally(() => setLoading(false)); }, []);

  const recientes = [...products].sort((a,b)=>(b.idProducto||0)-(a.idProducto||0));
  const destacados = recientes.slice(0, 6);

  return (
    <AdminLayout title="Drops & Novedades" eyebrow="[ Lanzamientos ]">
      {loading ? <p className="admin-empty">Cargando...</p> : (
        <div className="admin-grid">
          <section className="admin-card">
            <h2>Novedades (ultimos productos)</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Producto</th><th>Categoria</th><th>Precio</th><th>Stock</th></tr></thead>
                <tbody>
                  {destacados.map(p => (
                    <tr key={p.idProducto}>
                      <td>#{p.idProducto}</td><td>{p.nombre}</td><td>{p.categoria?.nombre || "-"}</td>
                      <td>{formatPrice(p.precio)}</td><td>{p.stock}</td>
                    </tr>
                  ))}
                  {destacados.length===0 && <tr><td colSpan="5" className="admin-empty">No hay productos.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
          <section className="admin-card">
            <h2>Planificacion de drops</h2>
            <p className="admin-empty" style={{marginBottom:12}}>Vista operativa basada en el catalogo actual. Para drops avanzados (fecha/publicacion), se requiere extender el modelo backend.</p>
            <ul className="admin-list">
              {destacados.map(p => (
                <li key={p.idProducto}><span><b>{p.nombre}</b> <span className="mono" style={{color:"var(--muted)"}}>#{p.idProducto}</span></span><span className={Number(p.stock)>0?"txt-ok":"txt-bad"}>{Number(p.stock)>0?"Listo":"Sin stock"}</span></li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
