import { httpCategoryRepository } from "../../models/catalog/httpCategoryRepository";
import { createGetCategories } from "./getCategories";

/** Punto de composición del feature de catálogo. */
export const getCategories = createGetCategories(httpCategoryRepository);
