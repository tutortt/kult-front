const KEY = "kult_admin_session";
const listeners = new Set();

function read() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
let session = read();
function emit() {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    // Almacenamiento no disponible: la sesión sigue viva en memoria.
  }
  for (const l of listeners) l();
}

export function subscribeAdminSession(l) { listeners.add(l); return () => listeners.delete(l); }
export function getAdminSession() { return session; }
export function setAdminSession(data) { session = data; emit(); }
export function clearAdminSession() { session = null; emit(); }
export function isAdmin() { return session?.rol === "ADMIN"; }
