import { useSyncExternalStore } from "react";
import { ROUTES, navigate } from "../../controllers/router/navigation";
import { getAdminSession, isAdmin, subscribeAdminSession } from "../../models/auth/adminSession";

export function AdminRoute({ children }) {
  useSyncExternalStore(subscribeAdminSession, getAdminSession, getAdminSession);
  if (!isAdmin()) {
    if (typeof window !== "undefined") setTimeout(() => navigate(ROUTES.ADMIN_LOGIN), 0);
    return <main className="auth-main center-view"><p className="mono">Redirigiendo a acceso admin...</p></main>;
  }
  return children;
}
