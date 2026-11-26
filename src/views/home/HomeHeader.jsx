import { useEffect, useRef, useState } from "react";

import { useCart } from "../../controllers/cart/useCart";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { ROUTES, navigate, useRoute } from "../../controllers/router/navigation";
import { useWishlist } from "../../controllers/wishlist/useWishlist";
import { openCartDrawer } from "../../models/cart/cart";
import { openWishlistDrawer } from "../../models/wishlist/wishlist";
import { CartDrawer } from "../carrito/CartDrawer";
import { BurgerIcon, CartIcon, HeartIcon, SearchIcon } from "../icons";
import { Link } from "../Link";
import { WishlistDrawer } from "../wishlist/WishlistDrawer";

const NAV_ITEMS = [
  { to: ROUTES.CATALOGO, label: "Colección" },
  { to: ROUTES.NOVEDADES, label: "Novedades" },
  { to: ROUTES.GRAFICAS, label: "Gráficas" },
  { to: ROUTES.OVERSIZED, label: "Oversized" },
  { to: ROUTES.TIENDA, label: "Tienda" },
  { to: ROUTES.EDITORIAL, label: "Editorial" },
];

/** Cabecera global fiel a las referencias con búsqueda ⌘K, divisa, favoritos y carrito drawer. */
export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const route = useRoute();
  const { count } = useCart();
  const wishlist = useWishlist();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const q = searchValue.trim();
    setMenuOpen(false);
    navigate(q ? `${ROUTES.CATALOGO}?q=${encodeURIComponent(q)}` : ROUTES.CATALOGO);
  }

  return (
    <>
      <div className="ticker mono">
        <div className="wrap">
          <span>
            <b>■</b> System // Online
          </span>
          <span className="mid">
            Drop 04 / Online Exclusive • Envíos a todo Colombia • Unidades Limitadas
          </span>
          <span className="loc">
            Loc: BOG / MDE // Colombia &nbsp; <b>V.4.02</b>
          </span>
        </div>
      </div>

      <header className="site">
        <div className="wrap">
          <Link className="brand" to={ROUTES.HOME} aria-label="Ir al inicio de KULT">
            <span className="logo" aria-hidden="true">
              KULT
            </span>
            <span>
              <b>KULT</b>
              <small>Studio // Lab</small>
            </span>
          </Link>

          <nav
            className={`main${menuOpen ? " open" : ""}`}
            id="nav"
            aria-label="Navegación principal"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={route === item.to ? "on" : undefined}
                aria-current={route === item.to ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={ROUTES.LOGIN}
              className={`nav-account${route === ROUTES.LOGIN ? " on" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Acceso
            </Link>
            <Link
              to={ROUTES.ADMIN_LOGIN}
              className="nav-account"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>

          <div className="tools">
            <form className="search" onSubmit={handleSearchSubmit} role="search">
              <SearchIcon />
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar prendas..."
                aria-label="Buscar prendas en la tienda"
              />
              <kbd>⌘K</kbd>
            </form>

            <div className="cur" role="group" aria-label="Selector de moneda">
              <button
                type="button"
                className={currency === "COP" ? "on" : undefined}
                onClick={() => setCurrency("COP")}
                aria-pressed={currency === "COP"}
              >
                COP
              </button>
              <button
                type="button"
                className={currency === "USD" ? "on" : undefined}
                onClick={() => setCurrency("USD")}
                aria-pressed={currency === "USD"}
              >
                USD
              </button>
            </div>

            <button
              type="button"
              className="icon-btn"
              onClick={openWishlistDrawer}
              aria-label={`Ver favoritos (${wishlist.count})`}
            >
              <HeartIcon />
              <i className={wishlist.count > 0 ? "has-items" : undefined}>{wishlist.count}</i>
            </button>

            <button
              type="button"
              className="cart"
              onClick={openCartDrawer}
              aria-label={`Abrir carrito (${count} artículos)`}
            >
              <CartIcon />
              <span className="mono" style={{ fontSize: ".65rem" }}>
                Cart
              </span>
              <b>{String(count).padStart(2, "0")}</b>
            </button>

            <button
              type="button"
              className="burger"
              id="burger"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}
