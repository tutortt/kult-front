const DEFAULT_API_URL = "http://localhost:8080";

/**
 * Resuelve la URL base de la API desde la configuración del entorno.
 * Centralizarla evita valores hardcoded repartidos por la aplicación.
 *
 * @returns {string}
 */
export function getApiUrl() {
  return import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;
}
