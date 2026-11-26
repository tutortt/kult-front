const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Valida las credenciales sin producir efectos secundarios.
 * Las reglas de negocio viven aquí, separadas del formulario.
 *
 * @param {import('./credentials').Credentials} credentials
 * @returns {{ email?: string, password?: string }}
 */
export function validateCredentials(credentials) {
  const errors = {};
  const email = String(credentials.email ?? "").trim();
  const password = String(credentials.password ?? "");

  if (!email) {
    errors.email = "Ingresa tu correo electrónico.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!password) {
    errors.password = "Ingresa tu contraseña.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  return errors;
}

/** @param {object} errors */
export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
