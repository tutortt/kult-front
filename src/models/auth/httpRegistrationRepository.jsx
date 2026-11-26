import { httpClient } from "../http/httpClient";

const REGISTER_ENDPOINT = "/api/auth/registro";

/**
 * Implementación HTTP del puerto de registro.
 * Es el único lugar que conoce la ruta y el formato de la respuesta.
 *
 * @type {import('./registrationRepository').RegistrationRepository}
 */
export const httpRegistrationRepository = {
  async register(payload) {
    const response = await httpClient.post(REGISTER_ENDPOINT, payload);
    return response.data;
  },
};
