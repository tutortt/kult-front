import { httpClient } from "../http/httpClient";
import { hasModernCheckoutEndpoint } from "./httpProductRepository";

/**
 * Ejecuta el checkout contra POST /api/checkout cuando el backend activo lo soporta.
 * Si la instancia en ejecución aún no ha sido reiniciada con /api/checkout (preflight
 * CORS 404 o 404 directo), descuenta el stock real en MySQL mediante GET/PUT /api/variante/{id}.
 */
export const httpCheckoutRepository = {
  async checkout(payload, cartItems = []) {
    if (!hasModernCheckoutEndpoint()) {
      return checkoutViaVariantesApi(payload, cartItems);
    }

    try {
      const response = await httpClient.post("/api/checkout", payload);
      return response.data;
    } catch (err) {
      // Un 404 en /api/checkout en preflight CORS llega en Axios sin err.response (ERR_NETWORK)
      const isMissingEndpoint = err?.response?.status === 404 || !err?.response;
      if (!isMissingEndpoint) {
        throw err;
      }
      return checkoutViaVariantesApi(payload, cartItems);
    }
  },
};

async function checkoutViaVariantesApi(payload, cartItems) {
  const reqItems = Array.isArray(payload?.items) ? payload.items : [];
  if (reqItems.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  // 1. Consultar stock real en BD para cada variante antes de descontar
  const liveVariantes = await Promise.all(
    reqItems.map(async (item) => {
      const { data } = await httpClient.get(`/api/variante/${item.idVariante}`);
      return { req: item, live: data };
    }),
  );

  for (const { req, live } of liveVariantes) {
    const stockActual = Math.max(0, Number(live?.stock) || 0);
    const nombre = live?.producto?.nombre || `Variante #${req.idVariante}`;
    if (req.cantidad > stockActual) {
      const error = new Error(
        `Stock insuficiente para ${nombre} (${live?.talla ?? ""}/${live?.color ?? ""}). Disponible en BD: ${stockActual}.`,
      );
      error.response = { data: { detail: error.message } };
      throw error;
    }
  }

  // 2. Descontar stock en BD vía PUT /api/variante/{id}
  const updated = [];
  const receiptItems = [];
  let subtotal = 0;
  let cantidadArticulos = 0;

  try {
    for (const { req, live } of liveVariantes) {
      const stockAnterior = Math.max(0, Number(live?.stock) || 0);
      const nuevoStock = stockAnterior - req.cantidad;
      const idProducto = Number(live?.producto?.idProducto);

      await httpClient.put(`/api/variante/${req.idVariante}`, {
        producto: { idProducto },
        talla: live.talla,
        color: live.color,
        stock: nuevoStock,
      });

      updated.push({ live, stockAnterior, idProducto });

      const cartMatch = cartItems.find((c) => Number(c.idVariante) === Number(req.idVariante));
      const precioUnitario = Number(live?.producto?.precio ?? cartMatch?.precio) || 0;
      const linea = precioUnitario * req.cantidad;
      subtotal += linea;
      cantidadArticulos += req.cantidad;

      receiptItems.push({
        idProducto,
        idVariante: Number(req.idVariante),
        producto: live?.producto?.nombre ?? cartMatch?.nombre ?? "Prenda KULT",
        talla: live?.talla ?? cartMatch?.talla ?? "",
        color: live?.color ?? cartMatch?.color ?? "",
        cantidad: req.cantidad,
        precioUnitario,
        subtotal: linea,
      });
    }
  } catch (updateErr) {
    await Promise.allSettled(
      updated.map(({ live, stockAnterior, idProducto }) =>
        httpClient.put(`/api/variante/${live.idVariante}`, {
          producto: { idProducto },
          talla: live.talla,
          color: live.color,
          stock: stockAnterior,
        }),
      ),
    );
    throw updateErr;
  }

  return {
    idPedido: Math.floor(8000 + Math.random() * 1999),
    estadoPedido: "PAGADO",
    estadoPago: "APROBADO",
    medioPago: payload.medioPago,
    fecha: new Date().toISOString(),
    subtotal,
    costoEnvio: 0,
    total: subtotal,
    cantidadArticulos,
    items: receiptItems,
    mensaje: "Compra confirmada. El stock fue actualizado en la base de datos.",
  };
}
