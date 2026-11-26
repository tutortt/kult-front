import axios from "axios";

import { getApiUrl } from "../../config/environment";

const REQUEST_TIMEOUT_MS = 10_000;

/** Cliente HTTP compartido por todos los repositorios de infraestructura. */
export const httpClient = axios.create({
  baseURL: getApiUrl(),
  timeout: REQUEST_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});
