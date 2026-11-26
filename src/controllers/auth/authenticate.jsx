import { createCredentials } from "../../models/auth/credentials";

/**
 * Crea el caso de uso de autenticación.
 * El repositorio se inyecta: el caso de uso no sabe nada de HTTP.
 *
 * @param {import('../../models/auth/authRepository').AuthRepository} repository
 */
export function createAuthenticate(repository) {
  if (typeof repository?.login !== "function") {
    throw new TypeError(
      "Se requiere un repositorio de autenticación con el método login.",
    );
  }

  return async function authenticate(rawCredentials) {
    return repository.login(createCredentials(rawCredentials));
  };
}
