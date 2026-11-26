export const LOGIN_MESSAGES = Object.freeze({
  invalid: "Revisa los datos resaltados.",
  success: "Identificación aceptada. Acceso autorizado.",
  unauthorized: "Correo o contraseña incorrectos.",
  unavailable: "No fue posible conectar con el servicio de autenticación.",
});

const UNAUTHORIZED_STATUS = 401;

/**
 * Traduce un error técnico a un mensaje comprensible para el usuario.
 * @param {unknown} error
 */
export function toLoginMessage(error) {
  const status =
    /** @type { { response?: { status?: number } } } */ (error)?.response?.status;

  return status === UNAUTHORIZED_STATUS
    ? LOGIN_MESSAGES.unauthorized
    : LOGIN_MESSAGES.unavailable;
}
