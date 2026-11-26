/**
 * @typedef {object} ProductRepository
 * @property {() => Promise<object[]>} getAll Obtiene el catálogo completo.
 * @property {(id: number) => Promise<object>} getById Obtiene un producto por su id.
 */
export {};
