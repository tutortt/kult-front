import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";

/** Pie de página global conectado a todo el flujo de vistas. */
export function SiteFooter() {
  return (
    <footer className="site" id="contacto">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link className="brand" to={ROUTES.HOME}>
              <b style={{ font: "800 1.2rem var(--display)" }}>KULT</b>
              <small>Studio</small>
            </Link>
            <p>
              Operando en la intersección del brutalismo subcultural, manipulación de serigrafía de alta densidad y
              cortes arquitectónicos pesados.
            </p>
            <div className="chips mono">
              <span>Certified 280-420GSM</span>
              <span>100% Organic</span>
            </div>
          </div>

          <div>
            <h4>Catálogo</h4>
            <ul>
              <li>
                <Link to={ROUTES.CATALOGO}>Todas las prendas</Link>
              </li>
              <li>
                <Link to={ROUTES.NOVEDADES}>Nuevos lanzamientos</Link>
              </li>
              <li>
                <Link to={ROUTES.GRAFICAS}>Gráficas &amp; Serigrafía</Link>
              </li>
              <li>
                <Link to={ROUTES.OVERSIZED}>Boxy &amp; Oversized</Link>
              </li>
              <li>
                <Link to={ROUTES.EDITORIAL}>Editorial Lookbook</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Atención al Cliente</h4>
            <ul>
              <li>
                <Link to={ROUTES.TIENDA}>Tiendas Físicas Colombia</Link>
              </li>
              <li>
                <Link to={ROUTES.CART}>Carrito &amp; Pasarela de Pago</Link>
              </li>
              <li>
                <Link to={ROUTES.OVERSIZED}>Guía de tallas y medidas</Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN}>Acceso Clientes</Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER}>Membresía privada</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Red Oficial</h4>
            <ul>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  INSTAGRAM <span>[EXT]</span>
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noreferrer">
                  DISCORD ARCHIVE <span>[EXT]</span>
                </a>
              </li>
              <li>
                <Link to={ROUTES.ADMIN_LOGIN}>
                  KULT ADMIN <span>[SYS]</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.MAINTENANCE}>
                  Estado del sistema <span>[503]</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="fbot mono">
          <span className="l">
            © 2026 KULT STUDIO Inc. • Todos los derechos reservados • <b>Tienda oficial Colombia</b>
          </span>
          <span className="pay">
            <span>🔒 Cifrado SSL 256-bit</span>
            <span>PSE // NEQUI // ADDI // TARJETAS</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
