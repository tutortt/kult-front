import { useEffect, useState } from "react";
import { useCart } from "../../controllers/cart/useCart";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { ROUTES, navigate, productPath } from "../../controllers/router/navigation";
import {
  applyPromoCode,
  clearCart,
  closeCartDrawer,
  removeFromCart,
  removePromoCode,
  updateCartQuantity,
} from "../../models/cart/cart";
import { resolveImageUrl } from "../../models/catalog/product";
import { Link } from "../Link";
import "./drawers.css";

const FREE_SHIPPING_GOAL = 200000;

export function CartDrawer() {
  const { items, count, subtotal, discount, total, promo, drawerOpen, toast } = useCart();
  const { format } = useCurrency();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeCartDrawer();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  function handleApplyCoupon(e) {
    e.preventDefault();
    const res = applyPromoCode(couponInput);
    setCouponMsg({ type: res.ok ? "ok" : "err", text: res.message });
    if (res.ok) setCouponInput("");
  }

  const remaining = Math.max(0, FREE_SHIPPING_GOAL - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_GOAL) * 100));

  return (
    <>
      {toast && (
        <div className={`kult-toast mono ${toast.variant}`} role="status" aria-live="polite">
          <span className="dot" aria-hidden="true" />
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => {
              closeCartDrawer();
              navigate(ROUTES.CART);
            }}
          >
            VER BOLSA →
          </button>
        </div>
      )}

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={closeCartDrawer} role="presentation">
          <aside
            className="drawer-panel"
            aria-label="Carrito de compras"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="drawer-head">
              <div>
                <p className="mono drawer-eyebrow">■ BOLSA ACTIVA // KULT STUDIO</p>
                <h2>
                  CARRITO <span className="mono">[{String(count).padStart(2, "0")}]</span>
                </h2>
              </div>
              <button
                type="button"
                className="drawer-close mono"
                onClick={closeCartDrawer}
                aria-label="Cerrar carrito"
              >
                ESC ×
              </button>
            </header>

            <div className="drawer-shipping">
              <div className="mono drawer-ship-text">
                {remaining === 0 ? (
                  <span>
                    <b>✓ ENVÍO NACIONAL GRATIS DESBLOQUEADO</b> (SERVIENTREGA / COORDINADORA)
                  </span>
                ) : (
                  <span>
                    TE FALTAN <b>{format(remaining)}</b> PARA ENVÍO EXPRESS GRATIS
                  </span>
                )}
              </div>
              <div className="drawer-ship-bar">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="drawer-body">
              {items.length === 0 ? (
                <div className="drawer-empty">
                  <p className="mono">TU BOLSA ESTÁ VACÍA</p>
                  <p className="drawer-empty-sub">
                    Explora las siluetas 280-420 GSM del Drop 04 y agrega tu talla al carrito.
                  </p>
                  <Link
                    to={ROUTES.CATALOGO}
                    className="btn lime"
                    onClick={closeCartDrawer}
                  >
                    EXPLORAR COLECCIÓN →
                  </Link>
                </div>
              ) : (
                <ul className="drawer-list">
                  {items.map((item) => (
                    <li key={item.idVariante} className="drawer-item">
                      <Link
                        to={productPath(item.idProducto)}
                        className="drawer-item-thumb"
                        onClick={closeCartDrawer}
                      >
                        {item.imagenUrl ? (
                          <img src={resolveImageUrl(item.imagenUrl)} alt={item.nombre} />
                        ) : (
                          <span className="mono">{item.gramajeGsm}G</span>
                        )}
                      </Link>
                      <div className="drawer-item-info">
                        <div className="drawer-item-top">
                          <Link
                            to={productPath(item.idProducto)}
                            className="drawer-item-name"
                            onClick={closeCartDrawer}
                          >
                            {item.nombre}
                          </Link>
                          <button
                            type="button"
                            className="drawer-item-rm"
                            onClick={() => removeFromCart(item.idVariante)}
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            ×
                          </button>
                        </div>
                        <p className="mono drawer-item-meta">
                          TALLA: <b>{item.talla}</b> · COLOR: <b>{item.color}</b>
                        </p>
                        <div className="drawer-item-bottom">
                          <div className="qty-stepper" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                            <button
                              type="button"
                              onClick={() =>
                                item.cantidad <= 1
                                  ? removeFromCart(item.idVariante)
                                  : updateCartQuantity(item.idVariante, item.cantidad - 1)
                              }
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>
                            <span className="mono">{item.cantidad}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.idVariante, item.cantidad + 1)}
                              disabled={item.stock > 0 && item.cantidad >= item.stock}
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          <strong className="mono drawer-item-price">
                            {format(item.precio * item.cantidad)}
                          </strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="drawer-foot">
                <form className="drawer-coupon" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="CUPÓN (EJ: STREET10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    aria-label="Código promocional"
                  />
                  <button type="submit" className="mono">
                    APLICAR
                  </button>
                </form>

                {promo && (
                  <div className="drawer-promo-active mono">
                    <span>
                      ■ CÓDIGO ACTIVO: <b>{promo.code}</b> ({promo.label})
                    </span>
                    <button type="button" onClick={removePromoCode}>
                      QUITAR
                    </button>
                  </div>
                )}

                {couponMsg.text && (
                  <p className={`mono drawer-coupon-msg ${couponMsg.type}`}>{couponMsg.text}</p>
                )}

                <div className="drawer-totals mono">
                  <div>
                    <span>SUBTOTAL</span>
                    <b>{format(subtotal)}</b>
                  </div>
                  {discount > 0 && (
                    <div className="lime">
                      <span>DESCUENTO {promo?.code}</span>
                      <b>−{format(discount)}</b>
                    </div>
                  )}
                  <div>
                    <span>ENVÍO ESTÁNDAR COLOMBIA</span>
                    <b className="lime">GRATIS</b>
                  </div>
                  <div className="grand">
                    <span>TOTAL ESTIMADO</span>
                    <b>{format(total)}</b>
                  </div>
                </div>

                <div className="drawer-actions">
                  <Link
                    to={ROUTES.CART}
                    className="btn lime"
                    onClick={closeCartDrawer}
                  >
                    IR A PASARELA DE PAGO →
                  </Link>
                  <div className="drawer-sub-actions">
                    <button type="button" className="btn dark" onClick={closeCartDrawer}>
                      SEGUIR COMPRANDO
                    </button>
                    <button
                      type="button"
                      className="drawer-clear mono"
                      onClick={clearCart}
                    >
                      VACIAR BOLSA
                    </button>
                  </div>
                </div>
              </footer>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
