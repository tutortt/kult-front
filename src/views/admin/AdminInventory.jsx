import { useEffect, useState } from "react";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { httpVarianteRepository } from "../../models/catalog/httpVarianteRepository";
import { httpClient } from "../../models/http/httpClient";
import { AdminLayout } from "./AdminLayout";

const EMPTY_SEDE = { nombre: "", ciudad: "", direccion: "", activa: true };

export function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [sedeForm, setSedeForm] = useState(EMPTY_SEDE);
  const [editingSede, setEditingSede] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  async function load() {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        httpProductRepository.getAll(),
        httpClient.get("/api/sede/").then((r) => (Array.isArray(r.data) ? r.data : [])).catch(() => []),
      ]);
      setProducts(p);
      setSedes(s);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { Promise.resolve().then(load); }, []);

  async function updateStock(variante, productoId, nextStock) {
    try {
      await httpVarianteRepository.update(variante.idVariante, {
        producto: { idProducto: productoId },
        talla: variante.talla,
        color: variante.color,
        stock: Math.max(0, Number(nextStock) || 0),
      });
      setMsg({ type: "ok", text: "Stock actualizado." });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.detail || "No se pudo actualizar stock." });
    }
  }

  async function saveSede(e) {
    e.preventDefault();
    try {
      if (editingSede) await httpClient.put(`/api/sede/${editingSede}`, sedeForm);
      else await httpClient.post("/api/sede/", sedeForm);
      setSedeForm(EMPTY_SEDE);
      setEditingSede(null);
      setMsg({ type: "ok", text: "Sede guardada." });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.detail || "Error al guardar sede." });
    }
  }

  async function deleteSede(id) {
    if (!confirm("Eliminar sede?")) return;
    try {
      await httpClient.delete(`/api/sede/${id}`);
      setMsg({ type: "ok", text: "Sede eliminada." });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.detail || "No se pudo eliminar sede." });
    }
  }

  const rows = products.flatMap((p) =>
    (p.variantes || []).map((v) => ({ ...v, productoId: p.idProducto, producto: p.nombre, categoria: p.categoria?.nombre || "-" })),
  );

  return (
    <AdminLayout title="Sedes & Inventario Multi-Punto" eyebrow="[ Inventario / Sedes ]">
      {msg.text && <p className={`admin-msg ${msg.type === "error" ? "error" : ""}`} style={{ marginBottom: 16 }}>{msg.text}</p>}
      <div className="admin-grid">
        <section className="admin-card">
          <h2>{editingSede ? `Editar sede #${editingSede}` : "Registrar sede"}</h2>
          <form className="admin-form" onSubmit={saveSede}>
            <div className="admin-field"><label>Nombre</label><input value={sedeForm.nombre} onChange={(e) => setSedeForm((f) => ({ ...f, nombre: e.target.value }))} required /></div>
            <div className="admin-field"><label>Ciudad</label><input value={sedeForm.ciudad} onChange={(e) => setSedeForm((f) => ({ ...f, ciudad: e.target.value }))} required /></div>
            <div className="admin-field"><label>Direccion</label><input value={sedeForm.direccion} onChange={(e) => setSedeForm((f) => ({ ...f, direccion: e.target.value }))} required /></div>
            <label className="admin-field admin-check"><input type="checkbox" checked={!!sedeForm.activa} onChange={(e) => setSedeForm((f) => ({ ...f, activa: e.target.checked }))} /><span>Activa</span></label>
            <div className="admin-actions">
              <button className="btn lime" type="submit">{editingSede ? "Actualizar sede" : "Crear sede"}</button>
              {editingSede && <button type="button" className="btn dark" onClick={() => { setEditingSede(null); setSedeForm(EMPTY_SEDE); }}>Cancelar</button>}
            </div>
          </form>
          <div className="admin-table-wrap" style={{ marginTop: 20 }}>
            <table className="admin-table">
              <thead><tr><th>Sede</th><th>Ciudad</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {sedes.map((s) => (
                  <tr key={s.idSede}>
                    <td>{s.nombre}<div className="mono" style={{ fontSize: ".62rem", color: "var(--muted)" }}>{s.direccion}</div></td>
                    <td>{s.ciudad}</td>
                    <td>{s.activa ? "Activa" : "Inactiva"}</td>
                    <td className="admin-row-actions">
                      <button type="button" className="btn dark btn-sm" onClick={() => { setEditingSede(s.idSede); setSedeForm({ nombre: s.nombre || "", ciudad: s.ciudad || "", direccion: s.direccion || "", activa: !!s.activa }); }}>Editar</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteSede(s.idSede)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {sedes.length === 0 && <tr><td colSpan="4" className="admin-empty">Sin sedes registradas.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <h2>Inventario por variante</h2>
          {loading ? <p className="admin-empty">Cargando...</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Producto</th><th>Talla</th><th>Color</th><th>Stock</th><th>Ajuste</th></tr></thead>
                <tbody>
                  {rows.map((v) => <StockRow key={v.idVariante} v={v} onSave={updateStock} />)}
                  {rows.length === 0 && <tr><td colSpan="5" className="admin-empty">Sin variantes registradas.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

function StockRow({ v, onSave }) {
  const [value, setValue] = useState(v.stock ?? 0);
  useEffect(() => { Promise.resolve().then(() => setValue(v.stock ?? 0)); }, [v.stock]);
  return (
    <tr>
      <td>{v.producto}</td><td>{v.talla}</td><td>{v.color}</td>
      <td className={Number(v.stock) <= 0 ? "txt-bad" : Number(v.stock) <= 5 ? "txt-warn" : ""}>{v.stock}</td>
      <td className="admin-row-actions">
        <input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: 90, minHeight: 34, background: "var(--input)", color: "var(--text)", border: "1px solid var(--line)", padding: "0 8px" }} />
        <button type="button" className="btn dark btn-sm" onClick={() => onSave(v, v.productoId, value)}>Guardar</button>
      </td>
    </tr>
  );
}
