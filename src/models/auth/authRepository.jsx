/**
 * Puerto de autenticación.
 *
 * Define el contrato que la capa de aplicación necesita, sin importar
 * si la implementación usa axios, fetch u otro mecanismo.
 *
 * @typedef {import('./credentials').Credentials} Credentials
 * @typedef {Record<string, unknown>} AuthSession
 * @typedef {object} AuthRepository
 * @property {(credentials: Credentials) => Promise<AuthSession>} login
 */

export {};
