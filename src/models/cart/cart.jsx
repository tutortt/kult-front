const CART_STORAGE_KEY = "kult_cart_v2";
const PROMO_STORAGE_KEY = "kult_cart_promo_v1";
const SHIPPING_STORAGE_KEY = "kult_cart_shipping_v1";

export const PROMO_CODES = Object.freeze({
  STREET10: { code: "STREET10", percent: 10, label: "-10% EXTRA DROP" },
  KULTVIP: { code: "KULTVIP", percent: 15, label: "-15% ACCESO VIP" },
  DROP04: { code: "DROP04", percent: 12, label: "-12% LANZAMIENTO 04" },
});

export const SHIPPING_OPTIONS = Object.freeze({
  standard: {
    id: "standard",
    name: "Envío Estándar Nacional (2-4 días hábiles)",
    carrier: "SERVIENTREGA / COORDINADORA",
    description: "Envío gratis a toda Colombia con guía de rastreo y firma electrónica de entrega.",
    price: 0,
    originalPrice: 18000,
  },
  express: {
    id: "express",
    name: "Courier Express Prioritario (Mismo día / 24h)",
    carrier: "BOGOTÁ & MEDELLÍN",
    description: "Entrega express prioritaria motorizada antes de las 19:00 garantizada.",
    price: 18000,
    originalPrice: 18000,
  },
});

const listeners = new Set();

function normalizeItem(item) {
  const idVariante = Number(item?.idVariante);
  const cantidad = Math.max(1, Number(item?.cantidad) || 1);
  if (!Number.isFinite(idVariante)) return null;
  return {
    idProducto: Number(item?.idProducto) || 0,
    idVariante,
    nombre: String(item?.nombre ?? ""),
    sku: String(item?.sku ?? ""),
    talla: String(item?.talla ?? "M"),
    color: String(item?.color ?? "Negro Obsidiana"),
    gramajeGsm: Number(item?.gramajeGsm) || 280,
    badge: String(item?.badge ?? ""),
    precio: Number(item?.precio) || 0,
    stock: Math.max(0, Number(item?.stock) || 0),
    imagenUrl: String(item?.imagenUrl ?? ""),
    cantidad,
  };
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem("kult_cart_v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean);
  } catch {
    return [];
  }
}

function readPromo() {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    return raw && PROMO_CODES[raw] ? PROMO_CODES[raw] : null;
  } catch {
    return null;
  }
}

function readShipping() {
  try {
    const raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return raw && SHIPPING_OPTIONS[raw] ? raw : "standard";
  } catch {
    return "standard";
  }
}

let state = {
  items: readCart(),
  drawerOpen: false,
  promo: readPromo(),
  shippingId: readShipping(),
  toast: null,
};

let toastTimer = null;

function persistAndEmit(nextState) {
  state = nextState;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    if (state.promo) {
      localStorage.setItem(PROMO_STORAGE_KEY, state.promo.code);
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
    localStorage.setItem(SHIPPING_STORAGE_KEY, state.shippingId);
  } catch {
    // ignore storage errors
  }
  for (const listener of listeners) listener();
}

export function subscribeCart(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartState() {
  return state;
}

export function getCart() {
  return state.items;
}

export function getCartCount() {
  return state.items.reduce((s, i) => s + i.cantidad, 0);
}

export function getCartSubtotal() {
  return state.items.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

export function getCartDiscount(subtotal = getCartSubtotal(), promo = state.promo) {
  if (!promo) return 0;
  return Math.round((subtotal * promo.percent) / 100);
}

export function getShippingCost(shippingId = state.shippingId, items = state.items) {
  if (items.length === 0) return 0;
  return SHIPPING_OPTIONS[shippingId]?.price ?? 0;
}

export function showCartToast(message, variant = "ok") {
  if (toastTimer) clearTimeout(toastTimer);
  state = { ...state, toast: { id: Date.now(), message, variant } };
  for (const listener of listeners) listener();
  toastTimer = setTimeout(() => {
    state = { ...state, toast: null };
    for (const listener of listeners) listener();
  }, 3200);
}

export function openCartDrawer() {
  if (state.drawerOpen) return;
  state = { ...state, drawerOpen: true };
  for (const listener of listeners) listener();
}

export function closeCartDrawer() {
  if (!state.drawerOpen) return;
  state = { ...state, drawerOpen: false };
  for (const listener of listeners) listener();
}

export function toggleCartDrawer() {
  state = { ...state, drawerOpen: !state.drawerOpen };
  for (const listener of listeners) listener();
}

export function applyPromoCode(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) return { ok: false, message: "Ingresa un código promocional." };
  const match = PROMO_CODES[code];
  if (!match) {
    return {
      ok: false,
      message: "Código no válido. Prueba STREET10, KULTVIP o DROP04.",
    };
  }
  persistAndEmit({ ...state, promo: match });
  return { ok: true, promo: match, message: `Cupón ${match.code} aplicado (${match.label}).` };
}

export function removePromoCode() {
  persistAndEmit({ ...state, promo: null });
}

export function setShippingMethod(shippingId) {
  if (!SHIPPING_OPTIONS[shippingId]) return;
  persistAndEmit({ ...state, shippingId });
}

export function addToCart(item, { openDrawer = false } = {}) {
  const next = normalizeItem(item);
  if (!next) return { ok: false, message: "Variante inválida." };

  const existing = state.items.find((i) => i.idVariante === next.idVariante);
  const max = next.stock || existing?.stock || 0;
  const currentQty = existing?.cantidad || 0;

  if (max > 0 && currentQty + next.cantidad > max) {
    const updatedItems = existing
      ? state.items.map((i) => (i.idVariante === next.idVariante ? { ...i, cantidad: max } : i))
      : state.items;
    persistAndEmit({ ...state, items: updatedItems });
    const message = `Solo hay ${max} unidades disponibles de esta talla.`;
    showCartToast(message, "warn");
    return { ok: false, message };
  }

  const updatedItems = existing
    ? state.items.map((i) =>
        i.idVariante === next.idVariante
          ? {
              ...i,
              cantidad: i.cantidad + next.cantidad,
              stock: next.stock || i.stock,
              precio: next.precio || i.precio,
              imagenUrl: next.imagenUrl || i.imagenUrl,
            }
          : i,
      )
    : [...state.items, next];

  persistAndEmit({
    ...state,
    items: updatedItems,
    drawerOpen: openDrawer ? true : state.drawerOpen,
  });
  showCartToast(`+ ${next.nombre} (${next.talla}) agregado a la bolsa`, "ok");
  return { ok: true };
}

export function addMultipleToCart(items, { openDrawer = true } = {}) {
  let addedCount = 0;
  for (const item of items) {
    const res = addToCart(item, { openDrawer: false });
    if (res.ok) addedCount += 1;
  }
  if (addedCount > 0) {
    if (openDrawer) openCartDrawer();
    showCartToast(`Look completo (${addedCount} prendas) añadido a tu bolsa`, "ok");
    return { ok: true, addedCount };
  }
  return { ok: false, addedCount: 0, message: "No se pudieron añadir las prendas del look." };
}

export function updateCartQuantity(idVariante, cantidad) {
  const id = Number(idVariante);
  const target = state.items.find((i) => i.idVariante === id);
  if (!target) return;
  const max = target.stock || 99;
  const nextQty = Math.max(1, Math.min(max, Number(cantidad) || 1));
  const updatedItems = state.items.map((i) =>
    i.idVariante === id ? { ...i, cantidad: nextQty } : i,
  );
  persistAndEmit({ ...state, items: updatedItems });
}

export function removeFromCart(idVariante) {
  const id = Number(idVariante);
  const updatedItems = state.items.filter((i) => i.idVariante !== id);
  persistAndEmit({ ...state, items: updatedItems });
}

export function clearCart() {
  persistAndEmit({ ...state, items: [], promo: null });
}

export function syncCartWithProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return;
  const variantMap = new Map();
  const productFallbackMap = new Map();
  for (const p of products) {
    const imgUrl = (p.imagenes?.find((i) => i.principal) ?? p.imagenes?.[0])?.url ?? "";
    const realVariantes = Array.isArray(p?.variantes) ? p.variantes : [];
    productFallbackMap.set(Number(p.idProducto), { product: p, imgUrl, realVariantes });
    for (const v of realVariantes) {
      variantMap.set(Number(v.idVariante), {
        idVariante: Number(v.idVariante),
        stock: Math.max(0, Number(v.stock) || 0),
        precio: Number(p.precio) || 0,
        nombre: p.nombre ?? "",
        talla: v.talla ?? "",
        color: v.color ?? "",
        imagenUrl: imgUrl,
      });
    }
  }
  let changed = false;
  const nextItems = state.items.flatMap((item) => {
    let fresh = variantMap.get(item.idVariante);
    if (!fresh) {
      // Si el carrito tenía un idVariante sintético anterior, enlazarlo a la variante real en BD
      const prodEntry = productFallbackMap.get(Number(item.idProducto));
      if (!prodEntry) {
        changed = true;
        return [];
      }
      const matched =
        prodEntry.realVariantes.find((v) => v.talla === item.talla) ??
        prodEntry.realVariantes.find((v) => Number(v.stock) > 0);
      if (!matched) {
        changed = true;
        return [];
      }
      changed = true;
      fresh = variantMap.get(Number(matched.idVariante));
    }
    if (!fresh || fresh.stock < 1) {
      changed = true;
      return [];
    }
    const qty = Math.min(item.cantidad, fresh.stock);
    if (
      qty !== item.cantidad ||
      fresh.stock !== item.stock ||
      fresh.precio !== item.precio ||
      fresh.idVariante !== item.idVariante
    ) {
      changed = true;
    }
    return [{ ...item, ...fresh, cantidad: qty }];
  });
  if (changed) {
    persistAndEmit({ ...state, items: nextItems });
  }
}
