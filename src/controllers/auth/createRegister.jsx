import { createRegistrationPayload } from "../../models/auth/registration";

/**
 * Crea el caso de uso de registro con el repositorio inyectado.
 * @param {import('../../models/auth/registrationRepository').RegistrationRepository} repository
 */
export function createRegister(repository) {
  if (typeof repository?.register !== "function") {
    throw new TypeError(
      "Se requiere un repositorio de registro con el método register.",
    );
  }

  return async function register(values) {
    return repository.register(createRegistrationPayload(values));
  };
}
