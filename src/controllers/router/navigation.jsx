import { useSyncExternalStore } from "react";

export const ROUTES = Object.freeze({
  HOME: "/",
  LOGIN: "/login",
  CATEGORIES: "/categoria",
  CATALOGO: "/catalogo",
  NOVEDADES: "/novedades",
  GRAFICAS: "/graficas",
  OVERSIZED: "/oversized",
  TIENDA: "/tienda",
  EDITORIAL: "/editorial",
  MAINTENANCE: "/mantenimiento",
  CART: "/carrito",
  REGISTER: "/registro",
  ADMIN_LOGIN: "/admin/login",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/productos",
  ADMIN_CATEGORIES: "/admin/categorias",
  ADMIN_DROPS: "/admin/drops",
  ADMIN_INVENTORY: "/admin/inventario",
  ADMIN_IMAGES: "/admin/imagenes",
  PRODUCT: "/producto",
});

/** Construye la ruta de detalle de un producto. */
export function productPath(id) {
  return `${ROUTES.PRODUCT}/${id}`;
}

const PRODUCT_PATTERN = /^\/producto\/(\d+)$/;

/** Extrae el id numérico de una ruta de detalle, o null si no coincide. */
export function getProductId(path) {
  const match = PRODUCT_PATTERN.exec(normalizePathname(path));
  return match ? Number(match[1]) : null;
}

const listeners = new Set();

function normalizePathname(raw) {
  const withoutQuery = String(raw || "/").split("?")[0].split("#")[0];
  return withoutQuery.replace(/\/+$/, "") || ROUTES.HOME;
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function getPathSnapshot() {
  return normalizePathname(window.location.pathname);
}

function getLocationSnapshot() {
  return `${normalizePathname(window.location.pathname)}${window.location.search}`;
}

/** Hook controlador: expone la ruta actual (sin query) y reacciona a adelante/atrás. */
export function useRoute() {
  return useSyncExternalStore(subscribe, getPathSnapshot, () => ROUTES.HOME);
}

/** Hook controlador: expone pathname + search para reaccionar a filtros por URL. */
export function useLocationSearch() {
  const full = useSyncExternalStore(subscribe, getLocationSnapshot, () => ROUTES.HOME);
  const idx = full.indexOf("?");
  return idx >= 0 ? full.slice(idx) : "";
}

/** Hook controlador: id del producto en la ruta de detalle, o null. */
export function useProductRoute() {
  return getProductId(useRoute());
}

/** Navega sin recargar la página, soportando query strings y scroll al inicio. */
export function navigate(path) {
  const raw = String(path || ROUTES.HOME);
  const [rawPath, rawSearch] = raw.split("?");
  const targetPath = normalizePathname(rawPath);
  const targetFull = rawSearch ? `${targetPath}?${rawSearch}` : targetPath;
  const currentFull = getLocationSnapshot();

  if (currentFull === targetFull) return;

  const pathChanged = getPathSnapshot() !== targetPath;
  window.history.pushState({}, "", targetFull);
  listeners.forEach((listener) => listener());
  if (pathChanged) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
