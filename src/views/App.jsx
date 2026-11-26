import { ROUTES, useProductRoute, useRoute } from "../controllers/router/navigation";
import { AdminCategories } from "./admin/AdminCategories";
import { AdminDashboard } from "./admin/AdminDashboard";
import { AdminDrops } from "./admin/AdminDrops";
import { AdminInventory } from "./admin/AdminInventory";
import { AdminLoginPage } from "./admin/AdminLoginPage";
import { AdminRoute } from "./admin/AdminRoute";
import { AdminProducts } from "./admin/AdminProducts";
import { ProductImagesAdmin } from "./admin/ProductImagesAdmin";
import { CarritoPage } from "./carrito/CarritoPage";
import { CategoriasPage } from "./catalogo/CategoriasPage";
import { Catalogo } from "./catalogo/Catalogo";
import { DetallePage } from "./detalle/DetallePage";
import { HomePage } from "./home/HomePage";
import { LoginPage } from "./login/LoginPage";
import { RegisterPage } from "./registro/RegisterPage";
import { EditorialPage } from "./storefront/EditorialPage";
import { GraficasPage } from "./storefront/GraficasPage";
import { MantenimientoPage } from "./storefront/MantenimientoPage";
import { NovedadesPage } from "./storefront/NovedadesPage";
import { OversizedPage } from "./storefront/OversizedPage";
import { TiendaPage } from "./storefront/TiendaPage";
import "./App.css";

/** Composición raíz: resuelve la ruta y ensambla la vista correspondiente. */
export function App() {
  const route = useRoute();
  const productId = useProductRoute();

  if (productId !== null) {
    return <DetallePage idProducto={productId} />;
  }

  if (route === ROUTES.LOGIN) return <LoginPage />;
  if (route === ROUTES.REGISTER) return <RegisterPage />;
  if (route === ROUTES.CATEGORIES) return <CategoriasPage />;
  if (route === ROUTES.CATALOGO) return <Catalogo />;
  if (route === ROUTES.NOVEDADES) return <NovedadesPage />;
  if (route === ROUTES.GRAFICAS) return <GraficasPage />;
  if (route === ROUTES.OVERSIZED) return <OversizedPage />;
  if (route === ROUTES.TIENDA) return <TiendaPage />;
  if (route === ROUTES.EDITORIAL) return <EditorialPage />;
  if (route === ROUTES.MAINTENANCE) return <MantenimientoPage />;
  if (route === ROUTES.CART) return <CarritoPage />;

  if (route === ROUTES.ADMIN_LOGIN) return <AdminLoginPage />;
  if (route === ROUTES.ADMIN || route === ROUTES.ADMIN_DASHBOARD) return <AdminRoute><AdminDashboard /></AdminRoute>;
  if (route === ROUTES.ADMIN_PRODUCTS) return <AdminRoute><AdminProducts /></AdminRoute>;
  if (route === ROUTES.ADMIN_CATEGORIES) return <AdminRoute><AdminCategories /></AdminRoute>;
  if (route === ROUTES.ADMIN_DROPS) return <AdminRoute><AdminDrops /></AdminRoute>;
  if (route === ROUTES.ADMIN_INVENTORY) return <AdminRoute><AdminInventory /></AdminRoute>;
  if (route === ROUTES.ADMIN_IMAGES) return <AdminRoute><ProductImagesAdmin /></AdminRoute>;

  return <HomePage />;
}

export default App;
