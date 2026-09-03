# Plataforma de Eventos e Inscripciones

Entregable final - Programacion Backend II (Coderhouse, comision 101730).

## Tematica

API REST para una **plataforma de eventos e inscripciones**: permite publicar eventos
(charlas, talleres, conferencias) e inscribir usuarios controlando el cupo disponible.

Esta primera entrega es el **refactor arquitectonico inicial**: deja armado el servidor
Express separado en capas y el punto de partida para las proximas etapas (registro, login,
JWT, cookies, Passport, roles, autorizacion, gestion de eventos, inscripciones, control de
cupos y notificaciones).

## Tecnologias

- Node.js (>= 18) con modulos ESM (`import` / `export`)
- Express 4
- Mongoose 8 (modelos base, conexion opcional en esta etapa)
- dotenv

## Instalacion

```bash
git clone https://github.com/fsanchezrodri01/entregable-final-backend-2.git
cd entregable-final-backend-2
npm install
```

## Configuracion de variables de entorno

Copiar el archivo de ejemplo y completarlo:

```bash
cp .env.example .env
```

| Variable     | Descripcion                                   | Ejemplo                                |
|--------------|-----------------------------------------------|----------------------------------------|
| `PORT`       | Puerto donde escucha el servidor              | `8080`                                 |
| `NODE_ENV`   | Entorno de ejecucion                          | `development`                          |
| `MONGO_URL`  | Cadena de conexion a MongoDB                  | `mongodb://localhost:27017/eventos`    |
| `JWT_SECRET` | Secreto para firmar los JWT (proxima entrega) | `un_secreto_largo_y_aleatorio`         |

Si `MONGO_URL` esta vacia el servidor arranca igual y avisa por consola que corre sin base de datos.

## Como ejecutar

```bash
npm start
```

Modo desarrollo (recarga automatica con `node --watch`):

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:8080` (o el puerto definido en `PORT`).

## Estructura de carpetas

```
entregable-final-backend-2/
├── src/
│   ├── app.js                    # configura Express (no levanta el servidor)
│   ├── server.js                 # levanta el servidor
│   ├── config/
│   │   ├── config.js             # lectura de variables de entorno
│   │   └── db.js                 # conexion a MongoDB
│   ├── routes/
│   │   ├── index.js              # agrupa los routers bajo /api
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── models/
│   │   ├── User.js               # campos minimos
│   │   └── Event.js              # campos minimos
│   ├── middlewares/
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   └── utils/
│       └── httpError.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

El flujo de una peticion es: **router -> controller -> service -> repository -> dao -> model**.

## Rutas disponibles

| Metodo | Ruta                   | Descripcion                          | Respuesta                                        |
|--------|------------------------|--------------------------------------|--------------------------------------------------|
| GET    | `/api/health`          | Estado del servidor                  | `{ "status": "ok", "message": "Servidor activo" }` |
| GET    | `/api/events`          | Lista de eventos (vacia por ahora)   | `{ "status": "success", "payload": [] }`         |
| GET    | `/api/sessions/current` | Usuario autenticado (aun sin logica) | `{ "status": "success", "payload": null }`       |

Ejemplos:

```bash
curl http://localhost:8080/api/health
```

```bash
curl http://localhost:8080/api/events
```

Cualquier ruta inexistente devuelve `404` con el formato
`{ "status": "error", "error": "Ruta no encontrada: ..." }`.

## Proximas entregas

- Registro y login de usuarios con hash de contrasena
- JWT en cookies y estrategias de Passport
- Roles y middlewares de autorizacion
- CRUD completo de eventos
- Inscripciones con control de cupos y notificaciones
