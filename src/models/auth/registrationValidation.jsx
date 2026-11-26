import {
  CIUDADES,
  normalizeCelular,
  normalizeIdentificacion,
  TALLAS,
} from "./registration";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IDENTIFICACION_PATTERN = /^[A-Z0-9]{6,20}$/;
const CELULAR_PATTERN = /^[1-3]\d{9}$/;
const STRENGTH_LABELS = ["Vacío", "Débil", "Básica", "Buena", "Máxima"];

/**
 * Evalúa la contraseña con las mismas cuatro reglas que exige el backend.
 * @param {string} password
 */
export function getPasswordStrength(password) {
  const value = String(password ?? "");
  if (!value) return { level: 0, percent: 0, label: STRENGTH_LABELS[0] };

  const rules = [
    value.length >= 8,
    /[A-Za-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  const level = rules.filter(Boolean).length;

  return {
    level,
    percent: level * 25,
    label: STRENGTH_LABELS[level] ?? STRENGTH_LABELS[4],
  };
}

/**
 * Validación pura del formulario; no depende de React ni de la red.
 * @param {import('./registration').Registration} values
 */
export function validateRegistration(values) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!String(values.nombres ?? "").trim()) {
    errors.nombres = "Ingresa tus nombres.";
  }
  if (!String(values.apellidos ?? "").trim()) {
    errors.apellidos = "Ingresa tus apellidos.";
  }
  if (!IDENTIFICACION_PATTERN.test(normalizeIdentificacion(values.identificacion))) {
    errors.identificacion =
      "Ingresa entre 6 y 20 caracteres alfanuméricos (cédula o pasaporte).";
  }
  if (!EMAIL_PATTERN.test(String(values.correo ?? "").trim())) {
    errors.correo = "Ingresa un correo electrónico válido.";
  }
  if (!CELULAR_PATTERN.test(normalizeCelular(values.celular))) {
    errors.celular = "Ingresa 10 dígitos colombianos (ej. 300 000 0000).";
  }
  if (!CIUDADES.includes(values.ciudad)) {
    errors.ciudad = "Selecciona la ciudad de despacho.";
  }
  if (getPasswordStrength(values.password).level < 4) {
    errors.password =
      "Mínimo 8 caracteres, con letras, números y un carácter especial.";
  }
  if (!values.confirmacion || values.confirmacion !== values.password) {
    errors.confirmacion = "Las contraseñas no coinciden.";
  }
  if (!TALLAS.includes(values.talla)) {
    errors.talla = "Selecciona una talla.";
  }
  if (!values.aceptaTerminos) {
    errors.aceptaTerminos = "Debes aceptar los términos y la privacidad.";
  }

  return errors;
}

/** @param {Record<string, string>} errors */
export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
