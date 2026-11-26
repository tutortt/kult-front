import { useState } from "react";

import { httpProductImageRepository } from "../../models/catalog/httpProductImageRepository";

const INITIAL_FORM = {
  productId: "",
  file: null,
  principal: true,
  orden: 0,
};

function toErrorMessage(error, action) {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  if (detail) return detail;
  if (status === 404) return "El producto o la imagen indicada no existe.";
  if (status === 413) return "La imagen supera el tamaño máximo de 5 MB.";
  return `No fue posible ${action} la imagen. Intenta de nuevo.`;
}

/** Controlador de la pantalla de administración de imágenes. */
export function useProductImageUpload(repository = httpProductImageRepository) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value, checked, type, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] ?? null : value,
    }));
    setError("");
    setMessage("");
  }

  async function submit(event, onSuccess) {
    event.preventDefault();
    if (!form.productId || !form.file) {
      setError("Selecciona un producto y un archivo de imagen.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await repository.upload(Number(form.productId), {
        file: form.file,
        principal: form.principal,
        orden: Number(form.orden) || 0,
      });
      setMessage("Imagen cargada correctamente.");
      setForm((current) => ({ ...current, file: null, orden: 0 }));
      onSuccess?.();
    } catch (uploadError) {
      setError(toErrorMessage(uploadError, "cargar"));
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(imageId, onSuccess) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await repository.remove(imageId);
      setMessage("Imagen eliminada correctamente.");
      onSuccess?.();
    } catch (removeError) {
      setError(toErrorMessage(removeError, "eliminar"));
    } finally {
      setIsSaving(false);
    }
  }

  return { form, isSaving, message, error, updateField, submit, remove };
}
