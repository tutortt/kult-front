import { useState } from "react";
import { ROUTES } from "../../controllers/router/navigation";
import { HomeHeader } from "../home/HomeHeader";
import { SiteFooter } from "../home/SiteFooter";
import { SubscribeSection } from "../home/SubscribeSection";
import { Link } from "../Link";
import "./storefront.css";

const SEDES = [
  {
    id: "bogota",
    city: "Bogotá",
    tag: "SEDE 01 // PRINCIPAL",
    type: "[FLAGSHIP STORE]",
    name: "BOGOTÁ // CHAPINERO ALTO",
    area: "ÁREA: 280 M²",
    desc: "Nuestra sede insignia de dos niveles construida en hormigón visto, racks en acero industrial crudo y cabina de escucha sonora.",
    address: "Calle 65 # 4A - 28, Chapinero Alto, Bogotá D.C.",
    hours: "Lunes a Sábado: 11:00 AM – 8:00 PM | Domingos: 12:00 PM – 6:00 PM",
    phone: "+57 (314) 890-4122",
    services: [
      "Prueba de gramaje y hormas oversized (280 a 420 GSM)",
      "Click & Collect express web en 2 horas",
      "Personalización y parches en vivo en taller serigráfico",
      "Sonido en vinilo & Cafetería de especialidad",
    ],
  },
  {
    id: "medellin",
    city: "Medellín",
    tag: "SEDE 02 // ANTIOQUIA",
    type: "[CONCEPT LAB]",
    name: "MEDELLÍN // CONCEPT LAB PROVENZA",
    area: "ÁREA: 210 M²",
    desc: "Laboratorio experimental con patio brutalista y galería de arte streetwear. Espacio para lanzamientos de pre-drops y colaboraciones.",
    address: "Carrera 35 # 8A - 19, Provenza / El Poblado, Medellín",
    hours: "Lunes a Sábado: 12:00 PM – 9:00 PM | Domingos: 1:00 PM – 7:00 PM",
    phone: "+57 (301) 554-9018",
    services: [
      "Lanzamiento exclusivo de Drops físicos antes de la web",
      "Retiro gratuito de pedidos online (Click & Collect)",
      "Barra de café local & coctelería experimental",
      "Exhibición de piezas únicas de archivo y cápsulas limitadas",
    ],
  },
  {
    id: "cali",
    city: "Cali",
    tag: "SEDE 03 // VALLE DEL CAUCA",
    type: "[STUDIO SHOWROOM]",
    name: "CALI // STUDIO SHOWROOM GRANADA",
    area: "ÁREA: 160 M²",
    desc: "Showroom de curaduría cerrada enfocado en prendas técnicas transpirables y siluetas diseñadas para el trópico urbano colombiano.",
    address: "Av. 9N # 14N - 42, Barrio Granada, Cali, Valle del Cauca",
    hours: "Martes a Sábado: 11:30 AM – 7:30 PM | Domingos y Lunes: Cita privada",
    phone: "+57 (318) 723-6610",
    services: [
      "Asesoría de patronaje para clima cálido (220 a 320 GSM)",
      "Click & Collect inmediato sin costo de flete",
      "Cambios directos de compras online sin trámites",
      "Atención privada con estilista de marca",
    ],
  },
];

const FAQS = [
  {
    q: "¿TIENEN TODAS LAS PRENDAS DE LA WEB EN LAS TIENDAS FÍSICAS?",
    a: "Sí, el 95% del catálogo activo está sincronizado cada 30 segundos entre nuestra bóveda central y las 3 sedes. Las cápsulas Online Lab pueden solicitarse para retiro en tienda sin costo.",
  },
  {
    q: "¿PUEDO PAGAR EN EFECTIVO O TRANSFERENCIA EN LAS SEDES?",
    a: "Sí, en todas nuestras sedes aceptamos efectivo, transferencias instantáneas mediante código QR (Nequi, Daviplata, Bancolombia), datáfono (Visa, Mastercard, Amex) y cuotas con Addi.",
  },
  {
    q: "¿CÓMO FUNCIONA EL CAMBIO DE PRENDAS COMPRADAS EN LA PÁGINA WEB?",
    a: "Tienes 30 días calendario desde la entrega. Presenta tu número de orden #KLT en cualquier sede física para realizar el cambio inmediato de talla o referencia.",
  },
];

export function TiendaPage() {
  const [cityFilter, setCityFilter] = useState("all");
  const [booking, setBooking] = useState({
    sede: SEDES[0].name,
    nombre: "",
    whatsapp: "",
    fecha: "",
    hora: "11:30 AM",
    objetivo: "Asesoría de patronaje y talla (Oversized Fit)",
  });
  const [confirmed, setConfirmed] = useState(false);

  const visibleSedes = cityFilter === "all" ? SEDES : SEDES.filter((s) => s.id === cityFilter);

  function selectSedeForBooking(sedeName) {
    setBooking((prev) => ({ ...prev, sede: sedeName }));
    setConfirmed(false);
    document.getElementById("agendar-cita")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="sf-page">
      <HomeHeader />

      <div className="wrap sf-crumb mono">
        <span>
          <Link to={ROUTES.HOME}>INICIO</Link> / SEDES FÍSICAS / <b>TIENDAS EN COLOMBIA</b>
        </span>
        <span className="lime">● 3 ESPACIOS FÍSICOS OPERANDO // ATENCIÓN HOY HASTA LAS 9:00 PM</span>
      </div>

      <section className="sf-hero">
        <div className="wrap sf-hero-row">
          <div>
            <p className="eyebrow mono">[ FLAGSHIP &amp; CONCEPT LABS // COLOMBIA ]</p>
            <h1>
              TIENDAS FÍSICAS <em>//</em>
              <br />
              CONCEPT SPACES
            </h1>
            <p className="lead">
              Espacios de arquitectura brutalista donde convergen la moda callejera, el arte sonoro y el archivo físico de
              KULT STUDIO. Visítanos en Bogotá, Medellín y Cali, retira tus compras online (Click &amp; Collect) o agenda
              una asesoría personalizada.
            </p>
          </div>
          <div className="sf-kpi-row">
            <div className="sf-kpi">
              <span className="mono">SEDES COL</span>
              <strong>03 HUB</strong>
            </div>
            <div className="sf-kpi">
              <span className="mono">RETIRO PICKUP</span>
              <strong>2 HRS</strong>
            </div>
            <div className="sf-kpi">
              <span className="mono">CAMBIOS</span>
              <strong>100%</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="sf-filter-bar">
        <div className="wrap sf-filter-inner">
          <div className="sf-pills" role="tablist" aria-label="Filtrar sedes por ciudad">
            <button type="button" className={cityFilter === "all" ? "active" : undefined} onClick={() => setCityFilter("all")}>
              TODAS LAS SEDES [3]
            </button>
            <button type="button" className={cityFilter === "bogota" ? "active" : undefined} onClick={() => setCityFilter("bogota")}>
              BOGOTÁ // CHAPINERO
            </button>
            <button type="button" className={cityFilter === "medellin" ? "active" : undefined} onClick={() => setCityFilter("medellin")}>
              MEDELLÍN // PROVENZA
            </button>
            <button type="button" className={cityFilter === "cali" ? "active" : undefined} onClick={() => setCityFilter("cali")}>
              CALI // GRANADA
            </button>
          </div>
        </div>
      </div>

      {/* Directorio de Sedes */}
      <main className="wrap sf-section">
        <div className="sf-head">
          <div>
            <p className="eyebrow mono">[ ESPACIOS ARQUITECTÓNICOS OFICIALES ]</p>
            <h2>DIRECTORIO DE SEDES KULT STUDIO</h2>
          </div>
          <span className="mono" style={{ color: "var(--muted)", fontSize: ".6rem" }}>
            [ACTUALIZADO: HOY EN TIEMPO REAL]
          </span>
        </div>

        <div className="sf-grid-3">
          {visibleSedes.map((s) => (
            <article className="sede-card" key={s.id}>
              <div className="sede-visual">
                <div className="sede-visual-top mono">
                  <span className="sede-open">● ABIERTA AHORA</span>
                  <span className="sede-tag">{s.tag}</span>
                </div>
                <div style={{ textAlign: "center", paddingBlock: 16 }}>
                  <b style={{ font: "800 1.4rem var(--display)", letterSpacing: ".08em", color: "var(--text)" }}>
                    KULT // {s.city.toUpperCase()}
                  </b>
                </div>
                <div className="sede-visual-top mono" style={{ color: "var(--muted)" }}>
                  <span>{s.type}</span>
                  <span>{s.area}</span>
                </div>
              </div>

              <div className="sede-body">
                <small className="mono" style={{ color: "var(--lime)", fontSize: ".58rem" }}>{s.type}</small>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="sede-info">
                  <div>
                    <b className="mono" style={{ color: "var(--muted)", fontSize: ".58rem" }}>DIRECCIÓN:</b>
                    <div>{s.address}</div>
                  </div>
                  <div>
                    <b className="mono" style={{ color: "var(--muted)", fontSize: ".58rem" }}>HORARIOS:</b>
                    <div>{s.hours}</div>
                  </div>
                  <div>
                    <b className="mono" style={{ color: "var(--muted)", fontSize: ".58rem" }}>WHATSAPP SEDE:</b>
                    <div>{s.phone}</div>
                  </div>
                </div>
                <div className="sede-services">
                  <b className="mono">SERVICIOS EXCLUSIVOS EN SEDE:</b>
                  {s.services.map((srv) => (
                    <span key={srv}>• {srv}</span>
                  ))}
                </div>
                <div className="sede-actions">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn lime"
                  >
                    CÓMO LLEGAR (GOOGLE MAPS) ↗
                  </a>
                  <button type="button" className="btn dark" onClick={() => selectSedeForBooking(s.name)}>
                    AGENDAR CITA DE FIT
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Servicios en tienda */}
      <section className="sf-section alt">
        <div className="wrap">
          <div className="sf-head">
            <div>
              <p className="eyebrow mono">[ BENEFICIOS IN-STORE // PROTOCOLO ]</p>
              <h2>SERVICIOS EN TIENDA FÍSICA</h2>
            </div>
            <p>Diseñados para conectar la velocidad del e-commerce con la tangibilidad de nuestro algodón pesado.</p>
          </div>
          <div className="sf-grid-4">
            <article className="sf-card">
              <span className="sf-num">01</span>
              <h3>Click &amp; Collect // 2h</h3>
              <p>Compra online y recoge tu paquete sellado en menos de 2 horas en Bogotá, Medellín o Cali sin flete.</p>
              <div className="sf-card-foot mono"><span>DISPONIBLE 7 DÍAS</span><b>GRATIS →</b></div>
            </article>
            <article className="sf-card">
              <span className="sf-num">02</span>
              <h3>Asesoría de Calce</h3>
              <p>Nuestros patronistas te ayudan a elegir la caída y gramaje exacto (280 a 420 GSM).</p>
              <div className="sf-card-foot mono"><span>1 ON 1 SPEC</span><b>SIN COSTO →</b></div>
            </article>
            <article className="sf-card">
              <span className="sf-num">03</span>
              <h3>Cambios Inmediatos</h3>
              <p>Trae tu prenda comprada online y realiza el cambio de talla en el acto sin formularios.</p>
              <div className="sf-card-foot mono"><span>CERO ESPERA</span><b>30 DÍAS →</b></div>
            </article>
            <article className="sf-card">
              <span className="sf-num">04</span>
              <h3>Pagos Físicos &amp; Locales</h3>
              <p>Efectivo, QR Nequi/Daviplata, Bancolombia, tarjetas y 3 cuotas sin interés con Addi.</p>
              <div className="sf-card-foot mono"><span>MULTI-PASARELA</span><b>0% INTERÉS →</b></div>
            </article>
          </div>
        </div>
      </section>

      {/* Agendar Cita */}
      <section className="wrap sf-section" id="agendar-cita">
        <div className="booking-grid">
          <div>
            <p className="eyebrow mono">[ PRIVATE SESSION PROTOCOL ]</p>
            <h2>AGENDAR CITA O VISITA PRIVADA</h2>
            <p style={{ color: "var(--muted)", marginTop: 12 }}>
              Reserva una sesión personalizada de 30 minutos sin costo con nuestros asesores de patronaje. Prueba
              prototipos del próximo Drop 05 o retira tu orden VIP sin filas.
            </p>
            <ul className="booking-perks">
              <li>Sesión privada de fitting 1-a-1 sin compromiso de compra</li>
              <li>Acceso al rack de muestras del próximo Drop 05</li>
              <li>Café de origen o bebida fría de cortesía en el showroom</li>
            </ul>
            <p className="mono" style={{ color: "var(--lime)", fontSize: ".66rem" }}>
              WHATSAPP CONCIERGE: +57 (314) 890-4122
            </p>
          </div>

          <form
            className="panel"
            style={{ display: "grid", gap: 14 }}
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmed(true);
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }} className="mono">
              <b style={{ fontSize: ".66rem" }}>SOLICITUD DE RESERVA DE ESPACIO</b>
              <span style={{ color: "var(--lime)", fontSize: ".6rem" }}>SYS-RES // 2026</span>
            </div>

            {confirmed && (
              <p className="msg ok mono" role="status">
                ✓ CITA RESERVADA EN {booking.sede} PARA {booking.nombre || "INVITADO"} ({booking.fecha || "PRÓXIMA FECHA"} · {booking.hora}). CONFIRMACIÓN ENVIADA POR WHATSAPP.
              </p>
            )}

            <label className="field">
              <span className="mono">SELECCIONA LA SEDE FÍSICA *</span>
              <select
                value={booking.sede}
                onChange={(e) => setBooking((b) => ({ ...b, sede: e.target.value }))}
              >
                {SEDES.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.address})</option>
                ))}
              </select>
            </label>

            <div className="form-grid">
              <label className="field">
                <span className="mono">NOMBRE Y APELLIDO *</span>
                <input
                  required
                  placeholder="EJ: ANDRÉS ROJAS"
                  value={booking.nombre}
                  onChange={(e) => setBooking((b) => ({ ...b, nombre: e.target.value }))}
                />
              </label>
              <label className="field">
                <span className="mono">WHATSAPP (COLOMBIA) *</span>
                <input
                  required
                  placeholder="EJ: 310 000 0000"
                  value={booking.whatsapp}
                  onChange={(e) => setBooking((b) => ({ ...b, whatsapp: e.target.value }))}
                />
              </label>
              <label className="field">
                <span className="mono">FECHA PREFERIDA *</span>
                <input
                  type="date"
                  required
                  value={booking.fecha}
                  onChange={(e) => setBooking((b) => ({ ...b, fecha: e.target.value }))}
                />
              </label>
              <label className="field">
                <span className="mono">HORA APROXIMADA *</span>
                <select value={booking.hora} onChange={(e) => setBooking((b) => ({ ...b, hora: e.target.value }))}>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>04:30 PM</option>
                  <option>06:30 PM</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span className="mono">OBJETIVO DE LA VISITA</span>
              <input
                value={booking.objetivo}
                onChange={(e) => setBooking((b) => ({ ...b, objetivo: e.target.value }))}
              />
            </label>

            <button type="submit" className="btn lime" style={{ width: "100%" }}>
              CONFIRMAR AGENDAMIENTO // SIN COSTO
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="sf-section alt">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="sf-head" style={{ justifyContent: "center", textAlign: "center" }}>
            <div>
              <p className="eyebrow mono">[ FAQ // PROTOCOLO DE TIENDAS ]</p>
              <h2>PREGUNTAS FRECUENTES SOBRE NUESTRAS SEDES</h2>
            </div>
          </div>
          <div className="det-tabs" style={{ paddingBlock: 0 }}>
            {FAQS.map((item, idx) => (
              <details key={item.q} open={idx === 1}>
                <summary className="mono">
                  <span>{item.q}</span>
                  <b aria-hidden="true" />
                </summary>
                <p style={{ padding: "14px 0 18px", color: "var(--muted)", fontSize: ".86rem" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SubscribeSection />
      <SiteFooter />
    </div>
  );
}
