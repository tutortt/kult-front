const WISHLIST_STORAGE_KEY = "kult_wishlist_v1";
const listeners = new Set();

function readWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

let state = {
  ids: readWishlist(),
  drawerOpen: false,
};

function emit(next) {
  state = next;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // ignore storage errors
  }
  for (const listener of listeners) listener();
}

export function subscribeWishlist(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getWishlistState() {
  return state;
}

export function toggleWishlist(idProducto) {
  const id = Number(idProducto);
  if (!Number.isFinite(id)) return false;
  const exists = state.ids.includes(id);
  const nextIds = exists ? state.ids.filter((x) => x !== id) : [...state.ids, id];
  emit({ ...state, ids: nextIds });
  return !exists;
}

export function openWishlistDrawer() {
  if (state.drawerOpen) return;
  state = { ...state, drawerOpen: true };
  for (const listener of listeners) listener();
}

export function closeWishlistDrawer() {
  if (!state.drawerOpen) return;
  state = { ...state, drawerOpen: false };
  for (const listener of listeners) listener();
}
