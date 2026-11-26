/**
 * @typedef {object} ProductImageRepository
 * @property {(productId: number, data: { file: File, principal: boolean, orden: number }) => Promise<object>} upload
 * @property {(imageId: number) => Promise<void>} remove
 */
export {};
