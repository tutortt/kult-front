const listeners = new Set();

/** Notifica a todas las vistas del catálogo que el stock cambió en la base de datos. */
export function notifyCatalogUpdated() {
  for (const listener of listeners) {
    listener();
  }
}

/** Suscribe una vista o hook a las actualizaciones de inventario. */
export function subscribeCatalogUpdated(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
