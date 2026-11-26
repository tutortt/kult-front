/**
 * @typedef {object} Credentials
 * @property {string} email
 * @property {string} password
 * @property {boolean} rememberSession
 */

/** @type {Readonly<Credentials>} */
export const EMPTY_CREDENTIALS = Object.freeze({
  email: "",
  password: "",
  rememberSession: false,
});

/**
 * Normaliza los datos capturados en el formulario antes de enviarlos a la API.
 * Función pura: no depende de React ni de la red.
 *
 * @param {Credentials} rawCredentials
 * @returns {Credentials}
 */
export function createCredentials(rawCredentials) {
  return {
    email: String(rawCredentials.email ?? "").trim(),
    password: String(rawCredentials.password ?? ""),
    rememberSession: Boolean(rawCredentials.rememberSession),
  };
}
