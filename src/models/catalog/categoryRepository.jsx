/**
 * Puerto de consulta de categorías.
 *
 * @typedef {object} Category
 * @property {number} idCategoria
 * @property {string} nombre
 * @property {string} [descripcion]
 * @typedef {object} CategoryRepository
 * @property {() => Promise<Category[]>} getAll
 */

export {};
