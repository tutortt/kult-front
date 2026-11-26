import { useEffect, useState } from "react";
import { httpCategoryRepository } from "../../models/catalog/httpCategoryRepository";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { httpVarianteRepository } from "../../models/catalog/httpVarianteRepository";
import { formatPrice } from "../../models/catalog/product";
import { AdminLayout } from "./AdminLayout";

const EMPTY = { nombre: "", descripcion: "", precio: "", gramajeGsm: "", idCategoria: "" };
const EMPTY_VAR = { talla: "", color: "", stock: "0" };

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [varForm, setVarForm] = useState(EMPTY_VAR);
  const [varProduct, setVarProduct] = useState(null);

  async function load() {
    const [p, c] = await Promise.all([httpProductRepository.getAll(), httpCategoryRepository.getAll()]);
    setProducts(p); setCategories(c);
  }
  useEffect(() => {
    Promise.resolve().then(() => load().catch(() => setMsg({ type: "error", text: "No se pudo cargar catalogo." })));
  }, []);

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    const payload = {
      nombre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio),
      gramajeGsm: form.gramajeGsm ? Number(form.gramajeGsm) : null,
      categoria: { idCategoria: Number(form.idCategoria) },
    };
    try {
      if (editing) await httpProductRepository.update(editing, payload);
      else await httpProductRepository.create(payload);
      setMsg({ type: "ok", text: editing ? "Producto actualizado." : "Producto creado." });
      setEditing(null); setForm(EMPTY); await load();
    } catch (err) { setMsg({ type: "error", text: err?.response?.data?.detail || "Error al guardar producto." }); }
  }

  function startEdit(p) {
    setEditing(p.idProducto);
    setForm({ nombre: p.nombre || "", descripcion: p.descripcion || "", precio: p.precio ?? "", gramajeGsm: p.gramajeGsm ?? "", idCategoria: String(p.categoria?.idCategoria ?? "") });
  }

  async function onDelete(id) {
    if (!confirm("Eliminar producto?")) return;
    try { await httpProductRepository.remove(id); setMsg({ type: "ok", text: "Producto eliminado." }); await load(); }
    catch (err) { setMsg({ type: "error", text: err?.response?.data?.detail || "No se pudo eliminar." }); }
  }

  async function addVariante(e) {
    e.preventDefault();
    if (!varProduct) return;
    try {
      await httpVarianteRepository.create({ producto: { idProducto: varProduct }, talla: varForm.talla, color: varForm.color, stock: Number(varForm.stock) || 0 });
      setMsg({ type: "ok", text: "Variante agregada." }); setVarForm(EMPTY_VAR); setVarProduct(null); await load();
    } catch (err) { setMsg({ type: "error", text: err?.response?.data?.detail || "Error al agregar variante." }); }
  }

  return (
    <AdminLayout title="Catalogo & Registro de Camisetas" eyebrow="[ Gestion de productos ]">
      <div className="admin-grid">
        <section className="admin-card">
          <h2>{editing ? `Editar producto #${editing}` : "Nuevo producto"}</h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={onChange} required /></div>
            <div className="admin-field"><label>Descripcion</label><textarea name="descripcion" value={form.descripcion} onChange={onChange} rows="3" /></div>
            <div className="admin-field"><label>Precio (COP)</label><input name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={onChange} required /></div>
            <div className="admin-field"><label>Gramaje GSM</label><input name="gramajeGsm" type="number" min="0" value={form.gramajeGsm} onChange={onChange} /></div>
            <div className="admin-field"><label>Categoria</label>
              <select name="idCategoria" value={form.idCategoria} onChange={onChange} required>
                <option value="">Selecciona...</option>
                {categories.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
              </select>
            </div>
            {msg.text && <p className={`admin-msg ${msg.type === "error" ? "error" : ""}`}>{msg.text}</p>}
            <div className="admin-actions">
              <button className="btn lime" type="submit">{editing ? "Actualizar" : "Crear producto"}</button>
              {editing && <button type="button" className="btn dark" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancelar</button>}
            </div>
          </form>

          {varProduct && (
            <form className="admin-form" onSubmit={addVariante} style={{marginTop:24, paddingTop:24, borderTop:"1px solid var(--line)"}}>
              <h3 style={{fontSize:"1rem"}}>Agregar variante a #{varProduct}</h3>
              <div className="admin-field"><label>Talla</label><input value={varForm.talla} onChange={e=>setVarForm(f=>({...f,talla:e.target.value}))} required /></div>
              <div className="admin-field"><label>Color</label><input value={varForm.color} onChange={e=>setVarForm(f=>({...f,color:e.target.value}))} required /></div>
              <div className="admin-field"><label>Stock</label><input type="number" min="0" value={varForm.stock} onChange={e=>setVarForm(f=>({...f,stock:e.target.value}))} required /></div>
              <div className="admin-actions">
                <button className="btn lime" type="submit">Guardar variante</button>
                <button type="button" className="btn dark" onClick={()=>setVarProduct(null)}>Cerrar</button>
              </div>
            </form>
          )}
        </section>

        <section className="admin-card">
          <h2>Productos</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Producto</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.idProducto}>
                    <td>#{p.idProducto}</td>
                    <td>{p.nombre}<div className="mono" style={{fontSize:'.62rem',color:'var(--muted)'}}>{(p.variantes||[]).map(v=>`${v.talla}/${v.color}:${v.stock}`).join(' · ') || 'Sin variantes'}</div></td>
                    <td>{p.categoria?.nombre || "-"}</td>
                    <td>{formatPrice(p.precio)}</td>
                    <td className={Number(p.stock)<=0?"txt-bad":Number(p.stock)<=5?"txt-warn":""}>{p.stock}</td>
                    <td className="admin-row-actions">
                      <button type="button" className="btn dark btn-sm" onClick={()=>startEdit(p)}>Editar</button>
                      <button type="button" className="btn dark btn-sm" onClick={()=>{setVarProduct(p.idProducto); setVarForm(EMPTY_VAR);}}>+ Variante</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={()=>onDelete(p.idProducto)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="6" className="admin-empty">Sin productos.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
