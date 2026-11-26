import { httpClient } from "../http/httpClient";

const CATEGORIES_ENDPOINT = "/api/categoria/";

export const httpCategoryRepository = {
  async getAll() {
    const response = await httpClient.get(CATEGORIES_ENDPOINT);
    return Array.isArray(response.data) ? response.data : [];
  },
  async create(payload) {
    const response = await httpClient.post(CATEGORIES_ENDPOINT, payload);
    return response.data;
  },
  async update(id, payload) {
    const response = await httpClient.put(`${CATEGORIES_ENDPOINT}${id}`, payload);
    return response.data;
  },
  async remove(id) {
    await httpClient.delete(`${CATEGORIES_ENDPOINT}${id}`);
  },
};
