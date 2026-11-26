import { httpClient } from "../http/httpClient";

const LOGIN_ENDPOINT = "/api/auth/login";

/**
 * Implementación HTTP del puerto de autenticación.
 * Es el único lugar que conoce la ruta y el formato de la respuesta.
 *
 * @type {import('./authRepository').AuthRepository}
 */
export const httpAuthRepository = {
  async login(credentials) {
    const response = await httpClient.post(LOGIN_ENDPOINT, credentials);
    return response.data;
  },
};
