import { useCallback, useEffect, useState } from "react";

import { syncCartWithProducts } from "../../models/cart/cart";
import { FALLBACK_PRODUCTS } from "../../models/catalog/catalogFallback";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { enrichProduct } from "../../models/catalog/product";
import { subscribeCatalogUpdated } from "./catalogEvents";

const ENRICHED_FALLBACK = FALLBACK_PRODUCTS.map(enrichProduct);

/**
 * Estado del catálogo conectado en vivo a GET /api/producto/ y /api/variante/.
 * Se recarga automáticamente cada vez que se confirma una compra o cambia el inventario.
 */
export function useProducts(repository = httpProductRepository) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const loadData = useCallback(() => {
    repository.getAll().then(
      (data) => {
        const normalized = Array.isArray(data) ? data.map(enrichProduct) : [];
        setProducts(normalized);
        setUsingFallback(false);
        setError("");
        setIsLoading(false);
        syncCartWithProducts(normalized);
      },
      () => {
        setProducts(ENRICHED_FALLBACK);
        setUsingFallback(true);
        setError("");
        setIsLoading(false);
      },
    );
  }, [repository]);

  useEffect(() => {
    loadData();
    return subscribeCatalogUpdated(loadData);
  }, [loadData]);

  const reload = useCallback(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  return { products, isLoading, error, reload, usingFallback };
}
