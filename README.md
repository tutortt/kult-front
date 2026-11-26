# KULT Frontend

Frontend React + Vite de **KULT STUDIO**, una tienda urbana colombiana. La aplicación expone la **pantalla de acceso de miembros** y la **pantalla de registro** (`referencia/registro.html` portado a JSX), ambas con la identidad visual de la marca y formularios validados que se comunican con el backend.

El registro envía `POST /api/auth/registro` (nombre, apellido, número de identificación, correo, móvil, ciudad, contraseña hasheada en servidor, talla y preferencias) y el acceso envía `POST /api/auth/login`. La identificación se guarda en la columna `documento` de `usuarios` (única) y se devuelve como `identificacion` en las respuestas. Ambos comparten `httpClient.jsx` y la URL base de la API.

También contiene los componentes de catálogo (cabecera, listado de camisas, tarjetas de producto, categorías y carrusel), montados en `/categoria` y `/catalogo`.

## Qué hace la pantalla de acceso

1. Captura correo, contraseña y la opción «mantener sesión activa».
2. Valida localmente el formato del correo y una longitud mínima de 8 caracteres para la contraseña.
3. Envía las credenciales normalizadas a `POST /api/auth/login`.
4. Muestra estados claros: validación, cargando, acceso autorizado, credenciales incorrectas o servicio no disponible.
5. Permite mostrar/ocultar la contraseña y marca los campos inválidos con `aria-invalid` y `role="alert"`.

## Rutas

El enrutado es mínimo y no añade dependencias: `controllers/router/navigation.jsx` usa la History API y `views/Link.jsx` navega sin recargar.

| Ruta | Vista | Contenido |
| --- | --- | --- |
| `/` | `views/login/LoginPage.jsx` | Acceso de miembros (`POST /api/auth/login`). |
| `/registro` | `views/registro/RegisterPage.jsx` | Creación de cuenta (`POST /api/auth/registro`). |
| `/categoria` | `views/catalogo/CategoriasPage.jsx` | Categorías devueltas por `GET /api/categoria/`. |
| `/catalogo` | `views/catalogo/Catalogo.jsx` | Catálogo de productos. |

Desde el acceso se navega a **[Crear cuenta nueva]** y desde el registro a **[Iniciar sesión aquí]** sin recargar. El botón atrás/adelante del navegador también funciona.

## Arquitectura MVC

El proyecto sigue **Modelo – Vista – Controlador**. Todo el código fuente usa extensión `.jsx`; solo los archivos de configuración del tooling (`vite.config.js`, `eslint.config.js`) permanecen como `.js`.

```
src/
├── models/          Modelo: estado, reglas de negocio y acceso a datos.
│   ├── auth/        Credenciales, registro, validación y repositorios HTTP.
│   ├── catalog/     Precio, stock, datos de ejemplo y repositorio de categorías.
│   └── http/        Cliente HTTP compartido.
├── controllers/     Controlador: casos de uso, servicios, hooks y router.
│   ├── auth/        Casos de uso de login y registro, mensajes y hooks.
│   ├── catalog/     Caso de uso de categorías y `useCategories`.
│   └── router/      Rutas, `useRoute` y `navigate`.
├── views/           Vista: componentes React, composición y estilos por pantalla.
│   ├── login/       LoginPage, cabecera, formulario y campos reutilizables.
│   ├── registro/    RegisterPage, cabecera, panel y formulario de registro.
│   └── catalogo/    CategoriasPage, catálogo, producto, categorías y carrusel.
├── config/          Variables de entorno centralizadas.
├── styles/          Design tokens, reset y utilidades globales.
└── main.jsx         Punto de entrada.
```

### Flujo de una petición

1. La **vista** (`views/login/LoginForm.jsx`) captura el evento del usuario.
2. El **controlador** (`controllers/auth/useLogin.jsx`) valida, decide el estado y llama al servicio.
3. El **modelo** (`models/auth/...`) contiene las reglas puras y el repositorio que habla con la API.
4. El controlador devuelve el nuevo estado y la vista vuelve a renderizarse.

La vista no contiene llamadas HTTP: `httpClient.jsx` y los repositorios viven en `models/`. Los casos de uso reciben el repositorio por inyección, por lo que se pueden sustituir en pruebas.

## Buenas prácticas aplicadas

- **Validación pura** en el modelo, independiente del formulario.
- **Máquina de estados** en `useLogin` con un único `useReducer`.
- **DRY en la vista**: `FormField` concentra etiqueta, icono, error y ayuda; los SVG viven en `views/icons.jsx`.
- **Sin dependencias accidentales**: la vista no importa axios ni URLs hardcoded; regla `no-console` activa en ESLint.
- **Un solo cliente HTTP** con `baseURL`, timeout y configuración desde `VITE_API_URL`.
- **Formateo consistente** de precios con `Intl.NumberFormat("es-CO", ...)`.
- **Accesibilidad**: etiquetas asociadas, mensajes `role="alert"`/`role="status"`, `aria-pressed`, `aria-invalid`, foco visible y respeto a `prefers-reduced-motion`.
- **Código sin efectos ocultos**: los efectos cancelan cargas pendientes al desmontar.

## Configuración

La API usa `VITE_API_URL` cuando está definida. Por defecto, `http://localhost:8080`, el mismo puerto del backend (`kult-backend/src/main/resources/application.properties`). Para levantar el backend con el registro, aplica primero `kult-backend/src/main/resources/db/registro_usuario.sql`; los detalles están en `kult-backend/docs/REGISTRO.md`.

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8080
```

## Scripts

```bash
npm install
npm run dev        # servidor de desarrollo
npm run lint       # análisis estático
npm run lint:fix   # correcciones automáticas
npm run build      # build de producción
npm run preview    # servir el build
```

## Limitaciones conocidas

- El backend valida credenciales pero **aún no emite token ni sesión persistente**; «mantener sesión activa» se envía pero no se almacena.
- El registro valida todos los campos en cliente y servidor (contraseña hasheada con BCrypt, correo e identificación únicos, móvil +57 a 10 dígitos). OAuth y recuperación siguen siendo maquetas.
- El catálogo de camisas usa datos de ejemplo; la vista `/categoria` sí consume `GET /api/categoria/`.
- Las rutas `/disenos` y `/sedes` son marcadores sin vista implementada.
- No hay tests automatizados todavía.
