import { ROUTES, navigate } from "../../controllers/router/navigation";
import { clearAdminSession, getAdminSession } from "../../models/auth/adminSession";
import { Link } from "../Link";
import "./admin.css";

const NAV = [
  { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
  { to: ROUTES.ADMIN_PRODUCTS, label: "Catalogo" },
  { to: ROUTES.ADMIN_CATEGORIES, label: "Categorias" },
  { to: ROUTES.ADMIN_DROPS, label: "Drops / Novedades" },
  { to: ROUTES.ADMIN_INVENTORY, label: "Sedes / Inventario" },
  { to: ROUTES.ADMIN_IMAGES, label: "Imagenes" },
];

export function AdminLayout({ title, eyebrow = "[ KULT ADMIN ]", children }) {
  const path = window.location.pathname.replace(/\/+$/, "");
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="brand" to={ROUTES.HOME}>
          <span className="logo" aria-hidden="true">KULT</span>
          <span><b>KULT ADMIN</b><small>Studio // Lab</small></span>
        </Link>
        <nav aria-label="Admin" className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={path === item.to ? "active" : ""}>{item.label}</Link>
          ))}
        </nav>
        <div className="admin-side-foot" style={{display:"grid", gap:8}}>
          <div className="mono" style={{fontSize:".62rem", color:"var(--muted)"}}>{getAdminSession()?.correo || "admin"}</div>
          <button type="button" className="btn dark" style={{width:"100%"}} onClick={() => { clearAdminSession(); navigate(ROUTES.ADMIN_LOGIN); }}>Cerrar sesion</button>
          <Link to={ROUTES.HOME} className="btn dark" style={{width:"100%"}}>Ver tienda</Link>
        </div>
      </aside>
      <main className="admin-main">
        <p className="eyebrow mono" style={{ color: "var(--muted)" }}>{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
