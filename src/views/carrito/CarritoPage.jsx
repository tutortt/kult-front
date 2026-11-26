import { useEffect, useState } from "react";
import { useCart } from "../../controllers/cart/useCart";
import { notifyCatalogUpdated } from "../../controllers/catalog/catalogEvents";
import { useCurrency } from "../../controllers/currency/useCurrency";
import { ROUTES, productPath } from "../../controllers/router/navigation";
import {
  SHIPPING_OPTIONS,
  applyPromoCode,
  clearCart,
  removeFromCart,
  removePromoCode,
  setShippingMethod,
  syncCartWithProducts,
  updateCartQuantity,
} from "../../models/cart/cart";
import { httpCheckoutRepository } from "../../models/catalog/httpCheckoutRepository";
import { httpProductRepository } from "../../models/catalog/httpProductRepository";
import { resolveImageUrl } from "../../models/catalog/product";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./carrito.css";

const PAYMENT_TABS = [
  { id: "PSE", label: "PSE DÉBITO", apiValue: "PSE Débito" },
  { id: "CARD", label: "TARJETAS CR/DB", apiValue: "Tarjeta Crédito/Débito" },
  { id: "NEQUI", label: "NEQUI / DAVIPLATA", apiValue: "Nequi / Daviplata" },
  { id: "ADDI", label: "ADDI (3 CUOTAS)", apiValue: "Addi 3 Cuotas" },
];

const INITIAL_FORM = {
  correo: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  departamento: "Cundinamarca / Bogotá",
  ciudad: "Bogotá D.C.",
  pais: "Colombia (CO)",
  celular: "",
  codigoPostal: "110221",
  cardNumber: "4532 •••• •••• 8821",
  cardExpiry: "11/28",
  cardCvc: "923",
  cardHolder: "",
  pseBank: "Bancolombia",
  walletPhone: "",
  addiDoc: "",
};

export function CarritoPage() {
  const {
    items,
    count,
    subtotal,
    discount,
    shippingId,
    shippingOption,
    shippingCost,
    total,
    ivaIncluded,
    promo,
  } = useCart();
  const { format } = useCurrency();

  const [form, setForm] = useState(INITIAL_FORM);
  const [payTab, setPayTab] = useState("CARD");
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState({ type: "", text: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    httpProductRepository.getAll().then(syncCartWithProducts).catch(() => {});
  }, []);

  const installment = Math.ceil(total / 3);
  const canSubmit = items.length > 0 && !submitting;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleExpressFill(provider) {
    setForm((prev) => ({
      ...prev,
      correo: prev.correo || "cliente@kult-archive.co",
      nombre: prev.nombre || "Alejandro",
      apellidos: prev.apellidos || "García Soler",
      direccion: prev.direccion || "Calle 85 # 11-53, Chapinero",
      departamento: prev.departamento || "Cundinamarca / Bogotá",
      ciudad: prev.ciudad || "Bogotá D.C.",
      celular: prev.celular || "+57 310 448 2090",
      cardHolder: prev.cardHolder || "ALEJANDRO GARCÍA SOLER",
    }));
    setStatus({
      type: "ok",
      message: `Datos precargados vía ${provider} Express. Verifica tu dirección y confirma el pedido.`,
    });
  }

  function handleCouponSubmit(e) {
    e.preventDefault();
    const res = applyPromoCode(couponInput);
    setCouponStatus({ type: res.ok ? "ok" : "err", text: res.message });
    if (res.ok) setCouponInput("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!items.length) {
      setStatus({ type: "err", message: "Tu carrito está vacío. Agrega al menos una prenda." });
      return;
    }

    const fullName = `${form.nombre} ${form.apellidos}`.trim();
    if (!fullName || !form.correo.trim() || !form.direccion.trim() || !form.ciudad.trim() || !form.departamento.trim()) {
      setStatus({ type: "err", message: "Completa los datos obligatorios de entrega y envío." });
      return;
    }

    const activePayment = PAYMENT_TABS.find((t) => t.id === payTab) ?? PAYMENT_TABS[1];
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    const payload = {
      nombre: fullName,
      correo: form.correo.trim(),
      direccion: form.direccion.trim(),
      ciudad: form.ciudad.trim(),
      departamento: form.departamento.trim(),
      codigoPostal: form.codigoPostal.trim() || "110221",
      medioPago: activePayment.apiValue,
      items: items.map((i) => ({ idVariante: i.idVariante, cantidad: i.cantidad })),
    };

    try {
      const res = await httpCheckoutRepository.checkout(payload, items);
      setReceipt({
        ...res,
        descuento: discount,
        promoCode: promo?.code ?? null,
        shippingName: shippingOption.name,
        costoEnvio: shippingCost,
        totalFinal: total,
        cliente: fullName,
        correo: form.correo.trim(),
        direccionEntrega: `${form.direccion.trim()}, ${form.ciudad.trim()}`,
      });
      clearCart();
      notifyCatalogUpdated();
      setStatus({ type: "ok", message: res.mensaje || "Compra confirmada. Stock actualizado en la base de datos." });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo confirmar la compra contra el servidor. Verifica que la API esté activa y con stock disponible.";
      setStatus({ type: "err", message: msg });
      httpProductRepository.getAll().then(syncCartWithProducts).catch(() => {});
      notifyCatalogUpdated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cart-page">
      <HomeHeader />

      {/* Barra de estado de la Pasarela de Pago Segura (fiel a Det. Carrito y Checkout.png) */}
      <div className="pay-bar mono">
        <div className="wrap pay-bar-inner">
          <div className="pay-bar-left">
            <span className="dot" aria-hidden="true" />
            <span>PASARELA DE PAGO SEGURA // V.4.02</span>
            <span className="session-pill">SESSION ID: #KT-89214</span>
          </div>
          <ol className="pay-steps" aria-label="Progreso de pago">
            <li className="done">✓ 01 IDENTIFICACIÓN</li>
            <li className={receipt ? "done" : "active"}>
              {receipt ? "✓" : "●"} 02 LOGÍSTICA &amp; PAGO
            </li>
            <li className={receipt ? "active" : ""}>03 CONFIRMACIÓN</li>
          </ol>
        </div>
      </div>

      <main className="wrap cart-main">
        {status.message && (
          <p className={`msg mono ${status.type === "err" ? "err" : "ok"}`} role="status">
            {status.message}
          </p>
        )}

        {receipt ? (
          <section className="cart-receipt panel">
            <p className="eyebrow mono">■ TRANSACCIÓN VERIFICADA // KULT STUDIO COLOMBIA</p>
            <h1>PEDIDO #KLT-{receipt.idPedido} CONFIRMADO</h1>
            <p className="mono receipt-meta">
              ESTADO: <b>{receipt.estadoPedido}</b> &nbsp;•&nbsp; PAGO: <b>{receipt.estadoPago}</b> ({receipt.medioPago})
            </p>
            <div className="receipt-client mono">
              <span>DESTINATARIO: <b>{receipt.cliente}</b> ({receipt.correo})</span>
              <span>ENTREGA: <b>{receipt.direccionEntrega}</b> — {receipt.shippingName}</span>
            </div>
            <ul className="receipt-items">
              {receipt.items?.map((it) => (
                <li key={`${receipt.idPedido}-${it.idVariante}`}>
                  <span>
                    {it.producto} · <em className="mono">{it.talla} / {it.color}</em> × {it.cantidad}
                  </span>
                  <b className="mono">{format(it.subtotal)}</b>
                </li>
              ))}
            </ul>
            {receipt.descuento > 0 && (
              <div className="receipt-sub mono">
                <span>DESCUENTO CUPÓN ({receipt.promoCode})</span>
                <b style={{ color: "var(--lime)" }}>−{format(receipt.descuento)}</b>
              </div>
            )}
            <div className="receipt-sub mono">
              <span>ENVÍO</span>
              <b>{receipt.costoEnvio === 0 ? "GRATIS" : format(receipt.costoEnvio)}</b>
            </div>
            <div className="receipt-total">
              <span>TOTAL PAGADO</span>
              <b>{format(receipt.totalFinal ?? receipt.total)}</b>
            </div>
            <div className="cart-actions">
              <Link className="btn lime" to={ROUTES.CATALOGO}>
                SEGUIR EXPLORANDO COLECCIÓN →
              </Link>
              <Link className="btn dark" to={ROUTES.HOME}>
                VOLVER AL INICIO
              </Link>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="cart-empty-box panel">
            <p className="eyebrow mono">[ CARRITO VACÍO // DROP 04 ]</p>
            <h1>NO TIENES PRENDAS EN TU BOLSA</h1>
            <p>
              Explora nuestras camisetas heavyweight 280–420 GSM, selecciona tu talla y regresa a la pasarela para finalizar tu orden.
            </p>
            <div className="cart-actions">
              <Link className="btn lime" to={ROUTES.CATALOGO}>
                IR A COLECCIÓN →
              </Link>
              <Link className="btn dark" to={ROUTES.NOVEDADES}>
                VER NOVEDADES
              </Link>
            </div>
          </section>
        ) : (
          <form className="checkout-grid" onSubmit={onSubmit}>
            {/* Columna izquierda: Express + 01 Entrega + 02 Logística + 03 Pago */}
            <div className="checkout-left">
              {/* Pago Rápido Express */}
              <section className="panel express-box">
                <div className="express-head mono">
                  <span>[PAGO RÁPIDO EXPRESS]</span>
                  <b className="lime">⚡ ONE-CLICK</b>
                </div>
                <div className="express-btns">
                  <button type="button" onClick={() => handleExpressFill("Apple Pay")}>
                    APPLE PAY
                  </button>
                  <button type="button" onClick={() => handleExpressFill("G-Pay")}>
                    G-PAY
                  </button>
                  <button type="button" onClick={() => handleExpressFill("PayPal")}>
                    PAYPAL
                  </button>
                </div>
                <p className="express-or mono">O CONTINUAR CON FORMULARIO</p>
              </section>

              {/* 01 Datos de entrega y envío */}
              <section className="panel step-box">
                <div className="step-head">
                  <h2>
                    <span className="step-num mono">01</span> DATOS DE ENTREGA Y ENVÍO
                  </h2>
                  <Link to={ROUTES.LOGIN} className="mono step-link">
                    ¿YA TIENES CUENTA?
                  </Link>
                </div>

                <div className="form-grid">
                  <label className="field span-2">
                    <span className="mono">CORREO ELECTRÓNICO (RECEPCIÓN DE FACTURA &amp; TRACKING) *</span>
                    <input
                      name="correo"
                      type="email"
                      placeholder="ALEX.VANGUARD@KULT-ARCHIVE.NET"
                      value={form.correo}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="mono">NOMBRE *</span>
                    <input
                      name="nombre"
                      placeholder="ALEJANDRO"
                      value={form.nombre}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="mono">APELLIDOS *</span>
                    <input
                      name="apellidos"
                      placeholder="GARCÍA SOLER"
                      value={form.apellidos}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field span-2">
                    <span className="mono">DIRECCIÓN DE ENTREGA *</span>
                    <input
                      name="direccion"
                      placeholder="CALLE 85 # 11-53, CHAPINERO"
                      value={form.direccion}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="mono">DEPARTAMENTO / REGIÓN *</span>
                    <input
                      name="departamento"
                      placeholder="CUNDINAMARCA / BOGOTÁ"
                      value={form.departamento}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="mono">CIUDAD / MUNICIPIO *</span>
                    <input
                      name="ciudad"
                      placeholder="BOGOTÁ D.C."
                      value={form.ciudad}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="mono">PAÍS / TERRITORIO</span>
                    <select name="pais" value={form.pais} onChange={onChange}>
                      <option value="Colombia (CO)">COLOMBIA (CO)</option>
                      <option value="México (MX)">MÉXICO (MX)</option>
                      <option value="Chile (CL)">CHILE (CL)</option>
                    </select>
                  </label>

                  <label className="field">
                    <span className="mono">CELULAR PARA NOTIFICACIONES (SMS / WHATSAPP)</span>
                    <input
                      name="celular"
                      type="tel"
                      placeholder="+57 310 448 2090"
                      value={form.celular}
                      onChange={onChange}
                    />
                  </label>
                </div>
              </section>

              {/* 02 Logística de envío */}
              <section className="panel step-box">
                <div className="step-head">
                  <h2>
                    <span className="step-num mono">02</span> LOGÍSTICA DE ENVÍO
                  </h2>
                </div>

                <div className="ship-options">
                  {Object.values(SHIPPING_OPTIONS).map((opt) => {
                    const active = shippingId === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`ship-card${active ? " active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={active}
                          onChange={() => setShippingMethod(opt.id)}
                        />
                        <div className="ship-info">
                          <div className="ship-title-row">
                            <strong>{opt.name}</strong>
                            <span className={`ship-tag mono${opt.id === "standard" ? " lime" : ""}`}>
                              {opt.carrier}
                            </span>
                          </div>
                          <p>{opt.description}</p>
                        </div>
                        <div className="ship-price mono">
                          {opt.price === 0 ? (
                            <>
                              <b className="lime">GRATIS</b>
                              <small>{format(opt.originalPrice)}</small>
                            </>
                          ) : (
                            <b>{format(opt.price)}</b>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* 03 Medios de pago seguros */}
              <section className="panel step-box">
                <div className="step-head">
                  <h2>
                    <span className="step-num mono">03</span> MEDIOS DE PAGO SEGUROS
                  </h2>
                  <span className="mono step-sec">🔒 TLS 1.3 / 256-BIT</span>
                </div>

                <div className="pay-tabs mono" role="tablist" aria-label="Medios de pago">
                  {PAYMENT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={payTab === tab.id}
                      className={payTab === tab.id ? "active" : undefined}
                      onClick={() => setPayTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="pay-panel">
                  <div className="pay-badges mono">
                    <span>MEDIOS ACEPTADOS:</span>
                    <i className="hi">PSE</i>
                    <i className="hi">NEQUI</i>
                    <i>VISA</i>
                    <i>MASTERCARD</i>
                    <i>AMEX</i>
                  </div>

                  {payTab === "CARD" && (
                    <div className="form-grid">
                      <label className="field span-2">
                        <span className="mono">NÚMERO DE TARJETA</span>
                        <input
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={onChange}
                          placeholder="4532 •••• •••• 8821"
                        />
                      </label>
                      <label className="field">
                        <span className="mono">CADUCIDAD (MM/AA)</span>
                        <input
                          name="cardExpiry"
                          value={form.cardExpiry}
                          onChange={onChange}
                          placeholder="11/28"
                        />
                      </label>
                      <label className="field">
                        <span className="mono">CVC / CVV</span>
                        <input
                          name="cardCvc"
                          value={form.cardCvc}
                          onChange={onChange}
                          placeholder="923"
                        />
                      </label>
                      <label className="field span-2">
                        <span className="mono">NOMBRE DEL TITULAR DE LA TARJETA</span>
                        <input
                          name="cardHolder"
                          value={form.cardHolder}
                          onChange={onChange}
                          placeholder="ALEJANDRO GARCÍA SOLER"
                        />
                      </label>
                    </div>
                  )}

                  {payTab === "PSE" && (
                    <div className="form-grid">
                      <label className="field span-2">
                        <span className="mono">SELECCIONA TU BANCO (PSE COLOMBIA)</span>
                        <select name="pseBank" value={form.pseBank} onChange={onChange}>
                          <option value="Bancolombia">Bancolombia</option>
                          <option value="Davivienda">Davivienda</option>
                          <option value="Banco de Bogotá">Banco de Bogotá</option>
                          <option value="Nequi">Nequi</option>
                          <option value="BBVA Colombia">BBVA Colombia</option>
                          <option value="Nu Colombia">Nu Colombia</option>
                        </select>
                      </label>
                    </div>
                  )}

                  {payTab === "NEQUI" && (
                    <div className="form-grid">
                      <label className="field span-2">
                        <span className="mono">NÚMERO CELULAR NEQUI / DAVIPLATA</span>
                        <input
                          name="walletPhone"
                          value={form.walletPhone}
                          onChange={onChange}
                          placeholder="310 448 2090"
                        />
                      </label>
                    </div>
                  )}

                  {payTab === "ADDI" && (
                    <div className="form-grid">
                      <label className="field span-2">
                        <span className="mono">CÉDULA DE CIUDADANÍA PARA APROBACIÓN ADDI</span>
                        <input
                          name="addiDoc"
                          value={form.addiDoc}
                          onChange={onChange}
                          placeholder="1.020.456.789"
                        />
                      </label>
                    </div>
                  )}

                  <div className="addi-strip">
                    <span className="addi-tag mono">ADDI // CUOTAS</span>
                    <p>
                      Paga en 3 cuotas mensuales de <b>{format(installment)}</b> sin interés ni papeleos.
                    </p>
                  </div>
                </div>

                <div className="trust-row">
                  <div className="trust-item">
                    <b className="mono">✓ PAGO ENCRIPTADO SSL 256-BIT</b>
                    <small>Cumplimiento estricto PCI-DSS y verificación bancaria segura.</small>
                  </div>
                  <div className="trust-item">
                    <b className="mono">↺ GARANTÍA DE DEVOLUCIÓN 30 DÍAS</b>
                    <small>Cambios de talla sin costo y garantía directa a nivel nacional.</small>
                  </div>
                </div>
              </section>
            </div>

            {/* Columna derecha sticky: Resumen del pedido */}
            <aside className="checkout-right panel" aria-label="Resumen del pedido">
              <div className="sum-head">
                <h2>RESUMEN DEL PEDIDO</h2>
                <span className="sum-count mono">{count} {count === 1 ? "ARTÍCULO" : "ARTÍCULOS"}</span>
                <Link to={ROUTES.CATALOGO} className="mono sum-edit">
                  (EDITAR)
                </Link>
              </div>

              <ul className="sum-list">
                {items.map((item) => (
                  <li key={item.idVariante} className="sum-item">
                    <Link to={productPath(item.idProducto)} className="sum-thumb">
                      {item.imagenUrl ? (
                        <img src={resolveImageUrl(item.imagenUrl)} alt={item.nombre} />
                      ) : (
                        <span className="mono">{item.gramajeGsm}G</span>
                      )}
                      <i className="mono">{item.gramajeGsm} GSM</i>
                    </Link>
                    <div className="sum-item-body">
                      <div className="sum-item-top">
                        <Link to={productPath(item.idProducto)} className="sum-item-title">
                          {item.nombre}
                        </Link>
                        <button
                          type="button"
                          className="sum-remove"
                          onClick={() => removeFromCart(item.idVariante)}
                          aria-label={`Eliminar ${item.nombre}`}
                        >
                          ×
                        </button>
                      </div>
                      <p className="mono sum-item-meta">
                        TALLA: <b>{item.talla}</b> • COLOR: <b>{item.color}</b>
                      </p>
                      <span className="sum-item-tag mono">
                        {item.badge || "DROP 04 // OFICIAL"}
                      </span>
                      <div className="sum-item-foot">
                        <div className="qty-stepper" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                          <button
                            type="button"
                            onClick={() =>
                              item.cantidad <= 1
                                ? removeFromCart(item.idVariante)
                                : updateCartQuantity(item.idVariante, item.cantidad - 1)
                            }
                            aria-label="Restar unidad"
                          >
                            −
                          </button>
                          <span className="mono">{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.idVariante, item.cantidad + 1)}
                            disabled={item.stock > 0 && item.cantidad >= item.stock}
                            aria-label="Sumar unidad"
                          >
                            +
                          </button>
                        </div>
                        <strong className="mono sum-item-price">
                          {format(item.precio * item.cantidad)}
                        </strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cupón promocional */}
              <div className="coupon-block">
                <label className="mono coupon-label" htmlFor="checkout-coupon">
                  CÓDIGO DE DESCUENTO // CUPÓN PROMOCIONAL
                </label>
                <div className="coupon-row">
                  <input
                    id="checkout-coupon"
                    type="text"
                    placeholder="STREET10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="button" className="mono" onClick={handleCouponSubmit}>
                    APLICAR
                  </button>
                </div>
                {promo && (
                  <div className="coupon-active mono">
                    <span>
                      ■ CÓDIGO ACTIVO: <b>{promo.code}</b> ({promo.label})
                    </span>
                    <button type="button" onClick={removePromoCode}>
                      QUITAR
                    </button>
                  </div>
                )}
                {couponStatus.text && (
                  <p className={`mono coupon-msg ${couponStatus.type}`}>{couponStatus.text}</p>
                )}
              </div>

              {/* Desglose financiero */}
              <div className="calc-rows mono">
                <div>
                  <span>SUBTOTAL PRODUCTOS</span>
                  <b>{format(subtotal)}</b>
                </div>
                {discount > 0 && (
                  <div className="lime">
                    <span>DESCUENTO {promo?.code} (−{promo?.percent}%)</span>
                    <b>−{format(discount)}</b>
                  </div>
                )}
                <div>
                  <span>{shippingId === "express" ? "COURIER EXPRESS 24H" : "ENVÍO ESTÁNDAR NACIONAL"}</span>
                  <b className={shippingCost === 0 ? "lime" : undefined}>
                    {shippingCost === 0 ? "GRATIS" : format(shippingCost)}
                  </b>
                </div>
                <div>
                  <span>IMPUESTOS (19% IVA INCLUIDO)</span>
                  <b>{format(ivaIncluded)}</b>
                </div>
              </div>

              {/* Caja TOTAL FINAL */}
              <div className="total-highlight">
                <div>
                  <span className="total-label">TOTAL FINAL</span>
                  <small className="mono">TODAS LAS TASAS Y ENVÍO INCLUIDOS</small>
                </div>
                <div className="total-figure">
                  <strong>{format(total)}</strong>
                  <small className="mono">O 3 CUOTAS DE {format(installment)} CON ADDI</small>
                </div>
              </div>

              <button
                type="submit"
                className="btn lime checkout-submit"
                disabled={!canSubmit}
              >
                {submitting
                  ? "PROCESANDO TRANSACCIÓN..."
                  : `FINALIZAR COMPRA / PAGAR PEDIDO (${format(total)}) →`}
              </button>

              <p className="checkout-terms mono">
                AL CONFIRMAR EL PEDIDO ACEPTAS LOS TÉRMINOS DE VENTA Y LA RESERVA DE STOCK POR 15 MIN.
              </p>

              <div className="checkout-batch-note mono">
                PRENDAS CONFECCIONADAS EN TIRADAS CERRADAS DE TALLER ARTESANAL. CADA PAQUETE INCLUYE CERTIFICADO DE AUTENTICIDAD SERIADA NUMERADA A MANO.
              </div>
            </aside>
          </form>
        )}
      </main>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
