import { httpClient } from "../http/httpClient";

const PRODUCTS_ENDPOINT = "/api/producto/";
const VARIANTES_ENDPOINT = "/api/variante/";

let backendHasModernCheckout = true;

export function hasModernCheckoutEndpoint() {
  return backendHasModernCheckout;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function attachRealVariantes(products, allVariantes) {
  const byProduct = new Map();
  for (const v of allVariantes) {
    const pid = Number(v?.producto?.idProducto);
    if (!Number.isFinite(pid)) continue;
    if (!byProduct.has(pid)) byProduct.set(pid, []);
    byProduct.get(pid).push({
      idVariante: Number(v.idVariante),
      talla: v.talla ?? "",
      color: v.color ?? "",
      stock: Math.max(0, Number(v.stock) || 0),
    });
  }

  return products.map((p) => {
    if (Array.isArray(p.variantes)) return p;
    const pid = Number(p.idProducto);
    const matched = byProduct.get(pid) ?? [];
    const totalStock = matched.reduce((sum, v) => sum + v.stock, 0);
    const tallas = [...new Set(matched.map((v) => v.talla).filter(Boolean))];
    const colores = [...new Set(matched.map((v) => v.color).filter(Boolean))];
    return {
      ...p,
      variantes: matched,
      stock: totalStock,
      tallas: tallas.length > 0 ? tallas : Array.isArray(p.tallas) ? p.tallas : [],
      colores: colores.length > 0 ? colores : Array.isArray(p.colores) ? p.colores : [],
    };
  });
}

export const httpProductRepository = {
  async getAll() {
    const response = await httpClient.get(PRODUCTS_ENDPOINT);
    const list = Array.isArray(response.data) ? response.data : [];
    const missingVariantes = list.some((p) => !Array.isArray(p?.variantes));
    backendHasModernCheckout = !missingVariantes;
    if (!missingVariantes || list.length === 0) return list;

    try {
      const varRes = await httpClient.get(VARIANTES_ENDPOINT);
      const allVariantes = Array.isArray(varRes.data) ? varRes.data : [];
      return attachRealVariantes(list, allVariantes);
    } catch {
      return list;
    }
  },
  async getById(id) {
    const response = await httpClient.get(`${PRODUCTS_ENDPOINT}${id}`);
    if (!isRecord(response.data)) throw new Error("Respuesta de producto inválida");
    if (Array.isArray(response.data.variantes)) {
      backendHasModernCheckout = true;
      return response.data;
    }

    backendHasModernCheckout = false;
    try {
      const varRes = await httpClient.get(VARIANTES_ENDPOINT);
      const allVariantes = Array.isArray(varRes.data) ? varRes.data : [];
      return attachRealVariantes([response.data], allVariantes)[0];
    } catch {
      return response.data;
    }
  },
  async create(payload) {
    const response = await httpClient.post(PRODUCTS_ENDPOINT, payload);
    return response.data;
  },
  async update(id, payload) {
    const response = await httpClient.put(`${PRODUCTS_ENDPOINT}${id}`, payload);
    return response.data;
  },
  async remove(id) {
    await httpClient.delete(`${PRODUCTS_ENDPOINT}${id}`);
  },
};
