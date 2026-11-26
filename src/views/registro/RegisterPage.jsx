import { useEffect } from "react";

import "../App.css";
import "../login/HeaderLogin.css";
import "../login/auth.css";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterMain } from "./RegisterMain";
import "./registro.css";

const PAGE_TITLE = "Crear Cuenta · KULT STUDIO";
const PAGE_DESCRIPTION =
  "Registro privado en la lista exclusiva de KULT STUDIO Colombia. Acceso alpha a drops limitados y despachos preferenciales.";

/** Pantalla completa de creación de cuenta. */
export function RegisterPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = PAGE_TITLE;
    description?.setAttribute("content", PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <div className="auth-page registro-page">
      <RegisterHeader />
      <RegisterMain />

      <footer className="auth-foot">
        <span>© 2026 KULT STUDIO Inc. Protocolo seguro // Bogotá, Colombia</span>
        <span className="ok">Edición limitada • Seguridad activa</span>
      </footer>
    </div>
  );
}
