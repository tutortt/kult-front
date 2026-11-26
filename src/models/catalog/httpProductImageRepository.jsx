import axios from "axios";

import { getApiUrl } from "../../config/environment";

/** Cliente independiente: no fija Content-Type para no romper el boundary multipart. */
const uploadClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 30_000,
});

/**
 * @type {import('./productImageRepository').ProductImageRepository}
 */
export const httpProductImageRepository = {
  async upload(productId, { file, principal, orden }) {
    const body = new FormData();
    body.append("file", file);

    const response = await uploadClient.post(
      `/api/producto/${productId}/imagenes`,
      body,
      { params: { principal, orden } },
    );
    return response.data;
  },

  async remove(imageId) {
    await uploadClient.delete(`/api/producto/imagenes/${imageId}`);
  },
};
