import { httpAuthRepository } from "../../models/auth/httpAuthRepository";
import { createAuthenticate } from "./authenticate";

/**
 * Punto de composición del feature de autenticación.
 * Aquí se decide qué implementación concreta usa el caso de uso.
 */
export const authenticate = createAuthenticate(httpAuthRepository);
