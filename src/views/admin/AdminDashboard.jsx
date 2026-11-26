import { useEffect, useState } from "react";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { httpCategoryRepository } from "../../models/catalog/httpCategoryRepository";
import { httpClient } from "../../models/http/httpClient";
import { formatPrice } from "../../models/catalog/product";
import { AdminLayout } from "./AdminLayout";

export function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "", products: [], categories: [], pedidos: [] });

  useEffect(() => {
    Promise.all([
      httpProductRepository.getAll(),
      httpCategoryRepository.getAll(),
      httpClient.get("/api/pedido/").then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    ]).then(([products, categories, pedidos]) => {
      setState({ loading: false, error: "", products, categories, pedidos });
    }).catch(() => setState(s => ({ ...s, loading: false, error: "No se pudo cargar el resumen." })));
  }, []);

  const { loading, error, products, categories, pedidos } = state;
  const totalStock = products.reduce((a, p) => a + (Number(p.stock) || 0), 0);
  const agotados = products.filter((p) => (Number(p.stock) || 0) <= 0).length;
  const totalVentas = pedidos.reduce((a, p) => a + (Number(p.total) || 0), 0);

  return (
    <AdminLayout title="Dashboard & Resumen Ejecutivo" eyebrow="[ Resumen Ejecutivo ]">
      {loading && <p className="admin-empty">Cargando...</p>}
      {error && <p className="admin-msg error">{error}</p>}
      {!loading && !error && (
        <>
          <div className="admin-stats">
            <div className="stat-card"><span className="mono">Productos</span><strong>{products.length}</strong></div>
            <div className="stat-card"><span className="mono">Categorias</span><strong>{categories.length}</strong></div>
            <div className="stat-card"><span className="mono">Stock total</span><strong>{totalStock}</strong></div>
            <div className="stat-card"><span className="mono">Agotados</span><strong>{agotados}</strong></div>
            <div className="stat-card"><span className="mono">Pedidos</span><strong>{pedidos.length}</strong></div>
            <div className="stat-card"><span className="mono">Ventas</span><strong>{formatPrice(totalVentas)}</strong></div>
          </div>

          <div className="admin-grid">
            <section className="admin-card">
              <h2>Productos con bajo stock</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Producto</th><th>Categoria</th><th>Stock</th><th>Precio</th></tr></thead>
                  <tbody>
                    {products.filter(p => Number(p.stock) <= 5).slice(0,8).map(p => (
                      <tr key={p.idProducto}>
                        <td>{p.nombre}</td>
                        <td>{p.categoria?.nombre || "-"}</td>
                        <td className={Number(p.stock) <= 0 ? "txt-bad" : "txt-warn"}>{p.stock}</td>
                        <td>{formatPrice(p.precio)}</td>
                      </tr>
                    ))}
                    {products.filter(p => Number(p.stock) <= 5).length === 0 && <tr><td colSpan="4" className="admin-empty">Sin alertas de stock.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="admin-card">
              <h2>Pedidos recientes</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Estado</th><th>Total</th></tr></thead>
                  <tbody>
                    {[...pedidos].reverse().slice(0,8).map(p => (
                      <tr key={p.idPedido}><td>#{p.idPedido}</td><td>{p.estado}</td><td>{formatPrice(p.total)}</td></tr>
                    ))}
                    {pedidos.length === 0 && <tr><td colSpan="3" className="admin-empty">No hay pedidos registrados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
