import { useEffect, useState } from "react";
import { httpCategoryRepository } from "../../models/catalog/httpCategoryRepository";
import { AdminLayout } from "./AdminLayout";

const EMPTY = { nombre: "", descripcion: "" };

export function AdminCategories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setItems(await httpCategoryRepository.getAll()); }
    catch { setMsg({ type: "error", text: "No se pudieron cargar las categorias." }); }
    finally { setLoading(false); }
  }
  useEffect(() => { Promise.resolve().then(load); }, []);

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      if (editing) await httpCategoryRepository.update(editing, form);
      else await httpCategoryRepository.create(form);
      setForm(EMPTY); setEditing(null);
      setMsg({ type: "ok", text: editing ? "Categoria actualizada." : "Categoria creada." });
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.detail || "Error al guardar categoria." });
    }
  }

  async function onDelete(id) {
    if (!confirm("Eliminar categoria?")) return;
    try { await httpCategoryRepository.remove(id); setMsg({ type: "ok", text: "Categoria eliminada." }); await load(); }
    catch (err) { setMsg({ type: "error", text: err?.response?.data?.detail || "No se pudo eliminar (puede tener productos asociados)." }); }
  }

  function startEdit(c) { setEditing(c.idCategoria); setForm({ nombre: c.nombre || "", descripcion: c.descripcion || "" }); }

  return (
    <AdminLayout title="Categorias & Colecciones" eyebrow="[ Gestion de categorias ]">
      <div className="admin-grid">
        <section className="admin-card">
          <h2>{editing ? `Editar #${editing}` : "Nueva categoria"}</h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={onChange} required /></div>
            <div className="admin-field"><label>Descripcion</label><textarea name="descripcion" value={form.descripcion} onChange={onChange} rows="4" /></div>
            {msg.text && <p className={`admin-msg ${msg.type === "error" ? "error" : ""}`}>{msg.text}</p>}
            <div className="admin-actions">
              <button className="btn lime" type="submit">{editing ? "Actualizar" : "Crear"}</button>
              {editing && <button type="button" className="btn dark" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancelar</button>}
            </div>
          </form>
        </section>
        <section className="admin-card">
          <h2>Categorias registradas</h2>
          {loading ? <p className="admin-empty">Cargando...</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map(c => (
                    <tr key={c.idCategoria}>
                      <td>#{c.idCategoria}</td><td>{c.nombre}</td><td>{c.descripcion || "-"}</td>
                      <td className="admin-row-actions">
                        <button type="button" className="btn dark btn-sm" onClick={() => startEdit(c)}>Editar</button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(c.idCategoria)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && <tr><td colSpan="4" className="admin-empty">Sin categorias.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
