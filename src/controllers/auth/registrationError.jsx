export const REGISTRATION_MESSAGES = Object.freeze({
  invalid: "Revisa los datos resaltados.",
  success: "Cuenta creada. Ya puedes iniciar sesión con tu correo.",
  duplicate: "Ese correo ya está registrado. Inicia sesión o usa otro correo.",
  duplicateIdentification:
    "Ese número de identificación ya está registrado. Revisa el dato o contacta soporte.",
  invalidData: "Algunos datos no cumplieron las reglas del servidor.",
  unavailable: "No fue posible conectar con el servicio de registro.",
});

const CONFLICT = 409;
const BAD_REQUEST = 400;

/**
 * Traduce un error técnico (axios/ProblemDetail) a un mensaje de usuario.
 * @param {unknown} error
 */
export function toRegistrationMessage(error) {
  const response = /** @type { { response?: { status?: number, data?: { detail?: string, message?: string } } } } */ (error)
    ?.response;
  const detail = String(response?.data?.detail ?? "").toLowerCase();

  if (response?.status === CONFLICT) {
    return detail.includes("identificac")
      ? REGISTRATION_MESSAGES.duplicateIdentification
      : REGISTRATION_MESSAGES.duplicate;
  }
  if (response?.status === BAD_REQUEST) {
    return response.data?.detail || REGISTRATION_MESSAGES.invalidData;
  }

  return REGISTRATION_MESSAGES.unavailable;
}
