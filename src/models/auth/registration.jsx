/** @typedef {object} Registration
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} identificacion
 * @property {string} correo
 * @property {string} celular
 * @property {string} ciudad
 * @property {string} password
 * @property {string} confirmacion
 * @property {string} talla
 * @property {boolean} aceptaSms
 * @property {boolean} aceptaTerminos
 */

export const CIUDADES = Object.freeze([
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Otra ciudad",
]);

export const TALLAS = Object.freeze(["S", "M", "L", "XL", "XXL"]);

/** @type {Readonly<Registration>} */
export const EMPTY_REGISTRATION = Object.freeze({
  nombres: "",
  apellidos: "",
  identificacion: "",
  correo: "",
  celular: "",
  ciudad: "",
  password: "",
  confirmacion: "",
  talla: "M",
  aceptaSms: true,
  aceptaTerminos: false,
});

/** Conserva letras y dígitos; omite espacios, puntos y guiones. */
export function normalizeIdentificacion(value) {
  return String(value ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/** Quita el indicativo +57, espacios y guiones; deja solo los 10 dígitos. */
export function normalizeCelular(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("57")
    ? digits.slice(2)
    : digits;
}

/**
 * Convierte el estado del formulario al contrato de `POST /api/auth/registro`.
 * @param {Registration} values
 */
export function createRegistrationPayload(values) {
  return {
    nombre: String(values.nombres ?? "").trim(),
    apellido: String(values.apellidos ?? "").trim(),
    identificacion: normalizeIdentificacion(values.identificacion),
    correo: String(values.correo ?? "").trim().toLowerCase(),
    celular: normalizeCelular(values.celular),
    ciudad: values.ciudad,
    password: values.password,
    confirmacionPassword: values.confirmacion,
    talla: values.talla,
    aceptaSms: Boolean(values.aceptaSms),
    aceptaTerminos: Boolean(values.aceptaTerminos),
  };
}
