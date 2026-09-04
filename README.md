# SoftwareAI — Plataforma de Inscripciones a Cursos

API REST para administrar **cursos, workshops, bootcamps y diplomados** de desarrollo de software
e ingeniería de datos, e inscribir estudiantes controlando el cupo disponible.

Entregable final de **Programación Backend II** — Coderhouse, comisión 101730.

## Temática

El proyecto modela la operación de [SoftwareAI](https://softwareai.com.mx/): *"Cursos de desarrollo
de software con Inteligencia Artificial"*. El catálogo incluye programas como **Desarrollo de
Software con IA: GitHub Copilot** y **Desarrollo de Software con IA: Claude Code**, además de
workshops, bootcamps y diplomados de backend e ingeniería de datos.

La plataforma resuelve problemas reales de negocio, no solo un CRUD:

- una contraseña nunca se guarda ni se devuelve en claro;
- hay rutas públicas, rutas privadas y rutas restringidas por rol;
- un organizador administra **sus propios** cursos, no los ajenos;
- no se permite inscribirse si no hay cupo, si el curso no está publicado o si ya pasó;
- cancelar no borra: cambia el estado y conserva el historial.

## Tecnologías

| Área | Herramienta |
|------|-------------|
| Runtime | Node.js 18+ con módulos ESM |
| Framework | Express 4 |
| Base de datos | MongoDB + Mongoose 8 |
| Autenticación | Passport (`register`, `login`, `current`) + JWT en cookie httpOnly |
| Contraseñas | bcrypt |
| Correo | Nodemailer |
| Configuración | dotenv |

## Instalación

```bash
git clone https://github.com/fsanchezrodri01/entregable-final-backend-2.git
cd entregable-final-backend-2
npm install
```

## Variables de entorno

Copiá el ejemplo y completalo:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `8081` |
| `NODE_ENV` | Entorno (`secure` de la cookie se activa en `production`) | `development` |
| `MONGO_URL` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/softwareai` |
| `JWT_SECRET` | Clave para firmar los JWT | `un_secreto_largo_y_aleatorio` |
| `JWT_EXPIRES_IN` | Vigencia del token | `1h` |
| `MAIL_HOST` | Host SMTP (vacío = los correos se registran en consola) | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_USER` | Usuario SMTP | `info@softwareai.com.mx` |
| `MAIL_PASS` | Contraseña SMTP | `********` |
| `MAIL_FROM` | Remitente | `SoftwareAI <info@softwareai.com.mx>` |

> El `.env` real **no se versiona**. Si la contraseña de Mongo tiene caracteres especiales
> (`*`, `[`, `@`…), hay que percent-encodearla: `admin:mi%2Aclave@host`.

### MongoDB con Docker

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

## Cómo ejecutar

Levantar la API:

```bash
npm start
```

Modo desarrollo, con recarga automática:

```bash
npm run dev
```

Cargar el catálogo y los usuarios de prueba:

```bash
npm run seed
```

Correr la colección de Postman completa:

```bash
npm run postman
```

Regenerar la evidencia contra la API corriendo:

```bash
npm run evidencia
```

El servidor queda en `http://localhost:8081` (o el puerto que definas en `PORT`).

`npm run seed` **borra y recarga** la base con el catálogo de SoftwareAI y estos usuarios de prueba:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| `admin` | admin@softwareai.com.mx | `Admin123` |
| `organizer` | instructor@softwareai.com.mx | `Organizer123` |
| `organizer` | instructor2@softwareai.com.mx | `Organizer123` |
| `user` | estudiante@softwareai.com.mx | `Usuario123` |

También podés crear un usuario desde `POST /api/sessions/register`: siempre nace con rol `user`, y
un `admin` puede promoverlo con `PATCH /api/users/:uid/role`.

## Estructura de carpetas

```
src/
├── app.js                  # configura Express (no levanta el servidor)
├── server.js               # levanta el servidor
├── config/                 # config.js, db.js, passport.config.js, mailer.config.js
├── routes/                 # health, sessions, users, categories, events, tickets
├── controllers/            # solo coordinan request/response
├── services/               # TODAS las reglas de negocio
├── repositories/           # intermediarios entre services y dao
├── dao/                    # ÚNICA capa que importa modelos de Mongoose
├── dto/                    # respuestas controladas (nunca exponen password)
├── models/                 # User, Category, Event, Ticket
├── middlewares/            # authenticate, authorize, notFound, errorHandler
├── utils/                  # hash, jwt, validators, pagination, reservationCode, httpError
└── scripts/seed.js         # datos de prueba

postman/                    # coleccion de Postman del flujo completo
docs/                       # evidencia: transcripcion, corrida de Newman y capturas
scripts/                    # generadores de la evidencia
```

**Regla de oro de la arquitectura:** el flujo es
`ruta → controller → service → repository → dao → modelo`. Los modelos de Mongoose se importan
**solo** en los DAO; los services concentran las reglas de negocio; los controllers no validan nada
de negocio; toda respuesta de usuario, curso o inscripción pasa por un DTO.

## Roles

| Rol | Puede |
|-----|-------|
| `user` | ver cursos, inscribirse, ver y cancelar **sus** inscripciones |
| `organizer` | todo lo anterior + crear cursos y administrar **los propios** (editar, cambiar estado, ver sus inscriptos) |
| `admin` | administrar usuarios, roles, categorías y **cualquier** curso o inscripción |

El registro público **nunca** acepta `role` desde el body: lo asigna el backend.

## Estados

**Curso** (`draft` → `published` → `finished`, o `cancelled` en cualquier momento previo):

| Estado | Significado |
|--------|-------------|
| `draft` | en preparación, no admite inscripciones |
| `published` | visible y disponible |
| `cancelled` | cancelado (sus inscripciones activas se cancelan en cascada) |
| `finished` | ya ocurrió |

**Inscripción**: `confirmed`, `pending`, `cancelled`. Las dos primeras ocupan cupo; `cancelled` no.

## Rutas disponibles

### Salud
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/health` | público |

### Sesiones
| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/sessions/register` | público |
| POST | `/api/sessions/login` | público |
| GET | `/api/sessions/current` | autenticado |
| POST | `/api/sessions/logout` | autenticado |

### Cursos
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/events` | público (con sesión se amplía lo visible) |
| GET | `/api/events/:eid` | público |
| POST | `/api/events` | `organizer` / `admin` |
| PUT | `/api/events/:eid` | dueño o `admin` |
| PATCH | `/api/events/:eid/status` | dueño o `admin` |

Filtros de `GET /api/events`: `status`, `category`, `location` (parcial), `fromDate`, `toDate`,
`organizer`, `level`, `format`, `search` (título y descripción), `minPrice`, `maxPrice`, `page`,
`limit` (máximo 50), `sort` (`date`, `-date`, `price`, `-price`, `title`, `createdAt`).

Un usuario sin sesión o con rol `user` solo ve cursos `published` y `finished`; un `organizer` ve
además **los suyos** en cualquier estado; un `admin` ve todo.

### Inscripciones
| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/events/:eid/tickets` | autenticado |
| GET | `/api/events/:eid/tickets` | `organizer` dueño o `admin` |
| GET | `/api/tickets/my-tickets` | autenticado (propias) |
| PATCH | `/api/tickets/:tid/cancel` | dueño o `admin` |

### Categorías
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/categories` | público |
| POST | `/api/categories` | `admin` |
| PUT | `/api/categories/:cid` | `admin` |
| DELETE | `/api/categories/:cid` | `admin` |

### Usuarios
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/users` | `admin` |
| PATCH | `/api/users/:uid/role` | `admin` |

## Ejemplos de uso

Registro — el `role` enviado se ignora y el email se normaliza:

```bash
curl -X POST http://localhost:8081/api/sessions/register -H "Content-Type: application/json" -d "{\"first_name\":\"Ana\",\"last_name\":\"Perez\",\"email\":\"Ana@Mail.com\",\"password\":\"Secreta123\",\"role\":\"admin\"}"
```

```json
{ "status": "success", "payload": { "id": "665f…", "first_name": "Ana", "last_name": "Perez", "email": "ana@mail.com", "role": "user" } }
```

Login — guarda la cookie `currentUser` en `cookies.txt`:

```bash
curl -c cookies.txt -X POST http://localhost:8081/api/sessions/login -H "Content-Type: application/json" -d "{\"email\":\"estudiante@softwareai.com.mx\",\"password\":\"Usuario123\"}"
```

Listado paginado:

```bash
curl "http://localhost:8081/api/events?status=published&page=1&limit=3"
```

```json
{ "status": "success", "data": [ { "id": "…", "title": "Desarrollo de Software con IA: GitHub Copilot", "status": "published" } ], "page": 1, "limit": 3, "total": 5, "totalPages": 2 }
```

Inscripción:

```bash
curl -b cookies.txt -X POST http://localhost:8081/api/events/<eid>/tickets -H "Content-Type: application/json" -d "{\"quantity\":1}"
```

```json
{ "status": "success", "message": "Inscripcion realizada correctamente", "payload": { "id": "…", "quantity": 1, "status": "confirmed", "reservationCode": "SAI-VNNKEE" } }
```

Cancelación:

```bash
curl -b cookies.txt -X PATCH http://localhost:8081/api/tickets/<tid>/cancel
```

## Flujo de autenticación

1. `POST /api/sessions/register` — valida campos, formato de email y longitud mínima de contraseña; normaliza el email; rechaza duplicados con `409`; hashea con bcrypt; fuerza `role: user`.
2. `POST /api/sessions/login` — compara con `bcrypt.compare`. Usuario inexistente y contraseña incorrecta devuelven el **mismo** `401 Credenciales invalidas`, para no revelar qué emails existen.
3. El backend firma un JWT y lo guarda en la cookie **`currentUser`** (`httpOnly`, `sameSite: lax`, `secure` solo en producción, 1 hora).
4. En cada ruta privada, la estrategia `current` de Passport extrae el token de la cookie, lo verifica y **busca el usuario en la base** — así un usuario eliminado o con rol cambiado se refleja de inmediato. Lo deja en `req.user`.
5. `POST /api/sessions/logout` borra la cookie.

## Flujo de inscripción y regla de cupos

`POST /api/events/:eid/tickets` valida, **en la capa de servicios**:

1. el curso existe → si no, `404`;
2. está en `published` → si no, `400`;
3. la fecha no pasó → si no, `400`;
4. `quantity` es un entero mayor a cero → si no, `400`;
5. el usuario no tiene ya una inscripción activa → si la tiene, `409`;
6. hay cupo suficiente → si no, `409` indicando cuántos lugares quedan.

El usuario **siempre** sale de `req.user`, nunca del body.

**Cupo disponible = `capacity` − suma de `quantity` de las inscripciones no canceladas.** Al ser un
valor calculado, cancelar una inscripción libera el lugar automáticamente: no hay contador que
pueda desincronizarse. Por eso tampoco se permite reducir `capacity` por debajo de las
inscripciones activas, ni se borran documentos.

Al cancelar un curso, sus inscripciones activas pasan a `cancelled` en cascada.

## Notificaciones

Nodemailer envía un correo al confirmar y al cancelar una inscripción, con el código de reserva.
**Si el envío falla, la inscripción sigue siendo válida**: el correo es una notificación, no la
operación principal, y un SMTP caído no debe impedir inscribirse. Sin `MAIL_HOST` configurado, los
envíos se registran en consola.

## Pruebas y evidencia

La API se verifica de dos formas, y ambas se pueden reejecutar.

### Colección de Postman

[`postman/SoftwareAI.postman_collection.json`](postman/SoftwareAI.postman_collection.json) recorre
el flujo completo con sus assertions. Se importa en Postman o se corre desde la terminal:

```bash
npm run postman
```

El comando recarga la base antes de correr: la colección parte de datos limpios.
Última corrida: **50 requests, 66 assertions, 0 fallos**
([`docs/newman-run.txt`](docs/newman-run.txt)).

### Transcripción y capturas

```bash
npm run evidencia
```

Recarga la base, ejecuta los casos contra la API y reescribe
[`docs/EVIDENCIA.md`](docs/EVIDENCIA.md) con el request, el código HTTP y la respuesta de cada uno.
Las imágenes están en [`docs/capturas/`](docs/capturas) — ver el
[índice de evidencia](docs/README.md) — y se rehacen con `npm run capturas`.

### Casos cubiertos

| # | Caso | Resultado |
|---|------|-----------|
| 1 | registro → login → `/current` → logout → `/current` | `401` después del logout |
| 2 | `user` intenta crear un curso | `403` |
| 3 | `organizer` crea curso → `user` se inscribe | `201` y cupo descontado |
| 4 | inscripción repetida al mismo curso | `409` |
| 5 | inscripción sin cupo | `409` indicando cuántos lugares quedan |
| 6 | el `user` cancela | cupo liberado y nueva inscripción posible |
| 7 | `organizer` modifica curso ajeno | `403` |
| 8 | `admin` modifica curso de otro organizador | `200` |
| 9 | respuestas de usuario, curso e inscripción | ninguna contiene `password` |
| 10 | `?status=published&page=2&limit=5` | estructura paginada |

Extras verificados: el rol enviado en el registro se ignora, el email se normaliza, `limit` se topa
en 50, no se reduce la capacidad por debajo de las inscripciones activas, no se borra una categoría
con cursos asociados y cancelar un curso cancela sus inscripciones en cascada.

## Códigos de estado

| Código | Cuándo |
|--------|--------|
| `400` | datos inválidos o regla de negocio incumplida |
| `401` | falta sesión o el token es inválido/expiró |
| `403` | hay sesión pero el rol o la propiedad del recurso no alcanzan |
| `404` | el recurso no existe |
| `409` | conflicto: email duplicado, inscripción duplicada, sin cupo |
| `500` | error interno (middleware centralizado) |
