import { useEffect, useState } from "react";

import { FALLBACK_CATEGORIES } from "../../models/catalog/catalogFallback";
import { getCategories } from "./catalogService";

export const CATEGORY_STATUS = Object.freeze({
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
});

const initialState = {
  status: CATEGORY_STATUS.LOADING,
  categories: [],
  message: "",
};

/**
 * Obtiene las categorías al montar el componente, con fallback si el backend no responde.
 */
export function useCategories(loadCategories = getCategories) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isActive = true;

    loadCategories()
      .then((categories) => {
        if (isActive) {
          setState({
            status: CATEGORY_STATUS.READY,
            categories: categories.length > 0 ? categories : [...FALLBACK_CATEGORIES],
            message: "",
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            status: CATEGORY_STATUS.READY,
            categories: [...FALLBACK_CATEGORIES],
            message: "",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [loadCategories]);

  return state;
}
