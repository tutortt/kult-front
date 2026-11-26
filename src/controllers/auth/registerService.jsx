import { httpRegistrationRepository } from "../../models/auth/httpRegistrationRepository";
import { createRegister } from "./createRegister";

/** Punto de composición del feature de registro. */
export const register = createRegister(httpRegistrationRepository);
