/**
 * Campo de formulario reutilizable.
 * Mantiene en un solo lugar la estructura de etiqueta, icono, error y ayuda.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  icon,
  action,
  inputProps,
}) {
  return (
    <div className="f">
      <div className="lrow">
        <label htmlFor={id}>{label}</label>
        {hint && <small>{hint}</small>}
      </div>

      <div className={`field ${error ? "err" : ""}`}>
        {icon}
        <input
          {...inputProps}
          id={id}
          name={inputProps?.name ?? id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {action}
      </div>

      {error && (
        <span id={`${id}-error`} className="msg err" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
