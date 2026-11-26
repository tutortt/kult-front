import { useCallback, useEffect, useState } from "react";

import { FALLBACK_PRODUCTS } from "../../models/catalog/catalogFallback";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { enrichProduct } from "../../models/catalog/product";
import { subscribeCatalogUpdated } from "./catalogEvents";

/** Estado de la ficha de un producto consultada por id, reactivo a compras y cambios de stock. */
export function useProduct(id, repository = httpProductRepository) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loadedId, setLoadedId] = useState(null);

  const isLoading = loadedId !== id;

  const loadData = useCallback(() => {
    if (id === null || id === undefined) {
      return Promise.resolve().then(() => {
        setProduct(null);
        setError("Producto no encontrado.");
        setLoadedId(id);
      });
    }

    return repository.getById(id).then(
      (data) => {
        setProduct(enrichProduct(data));
        setError("");
        setLoadedId(id);
      },
      () => {
        const fallback = FALLBACK_PRODUCTS.find((p) => Number(p.idProducto) === Number(id));
        if (fallback) {
          setProduct(enrichProduct(fallback));
          setError("");
        } else {
          setProduct(null);
          setError("No fue posible cargar el producto.");
        }
        setLoadedId(id);
      },
    );
  }, [id, repository]);

  useEffect(() => {
    loadData();
    return subscribeCatalogUpdated(loadData);
  }, [loadData]);

  return { product, isLoading, error, reload: loadData };
}
