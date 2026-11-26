import { httpClient } from "../http/httpClient";

const ENDPOINT = "/api/variante/";

export const httpVarianteRepository = {
  async getAll() {
    const response = await httpClient.get(ENDPOINT);
    return Array.isArray(response.data) ? response.data : [];
  },
  async create(payload) {
    const response = await httpClient.post(ENDPOINT, payload);
    return response.data;
  },
  async update(id, payload) {
    const response = await httpClient.put(`${ENDPOINT}${id}`, payload);
    return response.data;
  },
  async remove(id) {
    await httpClient.delete(`${ENDPOINT}${id}`);
  },
};
