import { navigate } from "../controllers/router/navigation";

/** Enlace que usa el router interno en vez de recargar el documento. */
export function Link({ to, children, onClick, ...props }) {
  function handleClick(event) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  }

  return (
    <a {...props} href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
