# Ecommerce System

Sistema base de comercio electrónico con CRM embebido y automatización de dropshipping. Incluye API REST construida en Express, almacenamiento ligero en disco (JSON) y un panel web estático listo para subir a un VPS o CDN.

## Estructura

`
.
├── client/               # Panel administrativo (HTML + CSS + JS)
├── server/               # API Node.js/Express
├── ecommerce-system/     # Carpeta libre para extender microservicios
├── package.json          # Scripts raíz para orquestar el monorepo simple
└── README.md
`

## Requisitos

- Node.js 18+
- npm 9+

## Puesta en marcha

`ash
# Instalar dependencias del backend
npm run install

# Sembrar datos de demostración (proveedores, productos, clientes, pedidos)
npm run seed

# Iniciar el backend (modo desarrollo con nodemon)
npm run dev
`

La API queda disponible en http://localhost:4000. El archivo .env en server/.env permite ajustar host, puerto y banderas de dropshipping.

Para servir el panel web estático basta con cualquier servidor de archivos. Ejemplo rápido:

`ash
npx serve ./client
`

Luego abre http://localhost:3000 (o el puerto indicado) y el panel consumirá la API definida en el navegador (localStorage.apiBase). Por defecto apunta a http://localhost:4000/api.

## Endpoints principales

| Recurso     | Método | Ruta                | Descripción                                      |
|-------------|--------|---------------------|--------------------------------------------------|
| Productos   | GET    | /api/catalog      | Listado con filtros opcionales                   |
|             | POST   | /api/catalog      | Crear producto                                   |
|             | GET    | /api/catalog/:id  | Detalle de producto                              |
|             | PUT    | /api/catalog/:id  | Actualizar producto                              |
|             | DELETE | /api/catalog/:id  | Eliminar producto                                |
| Proveedores | GET    | /api/suppliers    | Listado de proveedores                           |
|             | POST   | /api/suppliers    | Crear proveedor                                  |
| Pedidos     | GET    | /api/orders       | Listado de pedidos                               |
|             | POST   | /api/orders       | Crear pedido y disparar flujo de dropshipping    |
| Tickets     | GET    | /api/crm          | Bandeja de tickets                               |
|             | POST   | /api/crm          | Crear ticket                                     |
|             | POST   | /api/crm/:id/notes| Agregar nota a ticket                            |
| Eventos     | GET    | /api/events       | Últimos eventos (ordenados descendentemente)     |

> El motor de dropshipping asigna automáticamente el mejor proveedor disponible considerando stock, rating, tiempo de entrega y fee configurado en el proveedor.

## Arquitectura resumida

- **Persistencia**: JSON almacenado en server/data/db.json (autogenerado). Fácil de reemplazar por PostgreSQL/Mongo.
- **Servicios**: Catálogo, clientes, proveedores, pedidos, CRM y eventos aislados en server/src/services.
- **Integraciones**: Bus de eventos in-memory (eventBus) para ampliar con webhooks o colas externas.
- **Panel**: SPA ligera para CRUD básicos y monitoreo de estado.

## Siguientes pasos sugeridos

1. Sustituir el almacenamiento en archivos por una base de datos relacional o NoSQL.
2. Añadir autenticación y control de permisos (admin, agente, proveedor) con JWT u OAuth.
3. Incorporar colas y webhooks para integrarse con proveedores reales de dropshipping.
4. Conectar una pasarela de pago (Stripe, Mercado Pago, etc.) y reglas antifraude.
5. Automatizar despliegues en el VPS con CI/CD y monitoreo (logs centralizados, APM, alertas SLA).
## Despliegue con Docker / Coolify

1. Construye y levanta localmente con `docker compose up -d` (usa el `docker-compose.yml` incluido). El backend queda en `http://localhost:4000` y el panel en `http://localhost:3000`; el volumen `backend_data` persiste `server/data/db.json`.
2. Para Coolify, crea una aplicación de tipo **Docker Compose**, apunta al repositorio y selecciona la rama deseada. Coolify usará automáticamente `docker-compose.yml` para levantar ambos servicios.
3. Ajusta variables desde la UI de Coolify (puerto, banderas de dropshipping, etc.). El proxy Nginx del frontend enruta `/api` al contenedor backend, por lo que no necesitas configurar manualmente `localStorage.apiBase`.
4. Cada nuevo `git push` redepliega la pila completa si activas auto-deploy en Coolify.
