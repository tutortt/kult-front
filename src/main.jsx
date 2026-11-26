import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./views/App.jsx";
import "./styles/index.css";
import "./styles/components.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento #root en el documento.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
