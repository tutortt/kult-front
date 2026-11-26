/**
 * Crea el caso de uso para listar categorías.
 * @param {import('../../models/catalog/categoryRepository').CategoryRepository} repository
 */
export function createGetCategories(repository) {
  if (typeof repository?.getAll !== "function") {
    throw new TypeError(
      "Se requiere un repositorio de categorías con el método getAll.",
    );
  }

  return async function getCategories() {
    return repository.getAll();
  };
}
