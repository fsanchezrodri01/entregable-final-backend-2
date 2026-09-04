# Evidencia de verificacion

Salidas reales de la API de SoftwareAI, generadas con `bash scripts/evidencia.sh`.

- Fecha de ejecucion: 2026-09-03 18:19:37
- Base URL: `http://localhost:8081/api`
- Estado de la base: recien cargada con `npm run seed`

## 1. Servidor activo
### GET /api/health

```http
GET /health
```

**HTTP 200**

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

## 2. Registro y validaciones
### Registro: el rol enviado en el body se ignora y el email se normaliza

```http
POST /sessions/register

{"first_name":"Ana","last_name":"Perez","email":"Ana@Mail.com","password":"Secreta123","role":"admin"}
```

**HTTP 201**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0e99a3eee089401446a3",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Registro duplicado

```http
POST /sessions/register

{"first_name":"Ana","last_name":"Perez","email":"ana@mail.com","password":"Secreta123"}
```

**HTTP 409**

```json
{
  "status": "error",
  "message": "El email ya esta registrado"
}
```

### Registro con campos faltantes

```http
POST /sessions/register

{"email":"incompleto@mail.com"}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Registro con email invalido

```http
POST /sessions/register

{"first_name":"Test","last_name":"Invalido","email":"noesunmail","password":"Secreta123"}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "El email no tiene un formato valido"
}
```

## 3. Login, sesion y logout
### Login con credenciales incorrectas

```http
POST /sessions/login

{"email":"ana@mail.com","password":"claveIncorrecta"}
```

**HTTP 401**

```json
{
  "status": "error",
  "message": "Credenciales invalidas"
}
```

### Cookie emitida por el login

```
dominio=#HttpOnly_localhost  httpOnly=si  path=/  nombre=currentUser  valor=<jwt oculto>
```

### GET /sessions/current con sesion

```http
GET /sessions/current
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0e99a3eee089401446a3",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Logout

```http
POST /sessions/logout
```

**HTTP 200**

```json
{
  "status": "success",
  "message": "Logout correcto"
}
```

### GET /sessions/current despues del logout

```http
GET /sessions/current
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0e99a3eee089401446a3",
    "first_name": "Ana",
    "last_name": "Perez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

## 4. Listado, filtros y paginacion
### Listado paginado publico

```http
GET /events?status=published&page=1&limit=3
```

**HTTP 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "6a9a0e98a9db0f0c84169db5",
      "title": "Workshop: Prompts efectivos para equipos de datos",
      "description": "Como dirigir asistentes de IA para explorar datasets, documentar modelos y generar consultas SQL confiables.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dad",
        "name": "Ingenieria de Datos",
        "slug": "ingenieria-de-datos",
        "description": "Pipelines, modelado y calidad de datos."
      },
      "format": "workshop",
      "level": "beginner",
      "date": "2026-09-11T00:19:36.750Z",
      "location": "Online",
      "capacity": 50,
      "price": 0,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db2",
      "title": "Workshop: Analisis de errores en codigo generado por IA",
      "description": "Sesion intensiva para revisar propuestas de IA antes de implementarlas: lectura critica, deteccion de errores sutiles y criterios de aceptacion.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dab",
        "name": "Desarrollo con IA",
        "slug": "desarrollo-con-ia",
        "description": "Programar acompanado de asistentes de inteligencia artificial."
      },
      "format": "workshop",
      "level": "advanced",
      "date": "2026-09-18T00:19:36.750Z",
      "location": "Online",
      "capacity": 25,
      "price": 1500,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db0",
      "title": "Desarrollo de Software con IA: GitHub Copilot",
      "description": "Curso practico para dirigir a GitHub Copilot en proyectos reales: generar y entender codigo, depurar, refactorizar, escribir pruebas y documentar. La programacion cambio, el criterio sigue siendo tuyo.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dab",
        "name": "Desarrollo con IA",
        "slug": "desarrollo-con-ia",
        "description": "Programar acompanado de asistentes de inteligencia artificial."
      },
      "format": "curso",
      "level": "intermediate",
      "date": "2026-09-25T00:19:36.750Z",
      "location": "Online",
      "capacity": 40,
      "price": 4800,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da7",
        "first_name": "Mariana",
        "last_name": "Ortega",
        "email": "instructor@softwareai.com.mx"
      }
    }
  ],
  "page": 1,
  "limit": 3,
  "total": 5,
  "totalPages": 2
}
```

### Busqueda por texto

```http
GET /events?search=copilot
```

**HTTP 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "6a9a0e98a9db0f0c84169db0",
      "title": "Desarrollo de Software con IA: GitHub Copilot",
      "description": "Curso practico para dirigir a GitHub Copilot en proyectos reales: generar y entender codigo, depurar, refactorizar, escribir pruebas y documentar. La programacion cambio, el criterio sigue siendo tuyo.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dab",
        "name": "Desarrollo con IA",
        "slug": "desarrollo-con-ia",
        "description": "Programar acompanado de asistentes de inteligencia artificial."
      },
      "format": "curso",
      "level": "intermediate",
      "date": "2026-09-25T00:19:36.750Z",
      "location": "Online",
      "capacity": 40,
      "price": 4800,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da7",
        "first_name": "Mariana",
        "last_name": "Ortega",
        "email": "instructor@softwareai.com.mx"
      }
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

### Tope de limit: se pide 999 y se aplica 50

```http
GET /events?limit=999
```

**HTTP 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "6a9a0e98a9db0f0c84169db5",
      "title": "Workshop: Prompts efectivos para equipos de datos",
      "description": "Como dirigir asistentes de IA para explorar datasets, documentar modelos y generar consultas SQL confiables.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dad",
        "name": "Ingenieria de Datos",
        "slug": "ingenieria-de-datos",
        "description": "Pipelines, modelado y calidad de datos."
      },
      "format": "workshop",
      "level": "beginner",
      "date": "2026-09-11T00:19:36.750Z",
      "location": "Online",
      "capacity": 50,
      "price": 0,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db2",
      "title": "Workshop: Analisis de errores en codigo generado por IA",
      "description": "Sesion intensiva para revisar propuestas de IA antes de implementarlas: lectura critica, deteccion de errores sutiles y criterios de aceptacion.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dab",
        "name": "Desarrollo con IA",
        "slug": "desarrollo-con-ia",
        "description": "Programar acompanado de asistentes de inteligencia artificial."
      },
      "format": "workshop",
      "level": "advanced",
      "date": "2026-09-18T00:19:36.750Z",
      "location": "Online",
      "capacity": 25,
      "price": 1500,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db0",
      "title": "Desarrollo de Software con IA: GitHub Copilot",
      "description": "Curso practico para dirigir a GitHub Copilot en proyectos reales: generar y entender codigo, depurar, refactorizar, escribir pruebas y documentar. La programacion cambio, el criterio sigue siendo tuyo.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dab",
        "name": "Desarrollo con IA",
        "slug": "desarrollo-con-ia",
        "description": "Programar acompanado de asistentes de inteligencia artificial."
      },
      "format": "curso",
      "level": "intermediate",
      "date": "2026-09-25T00:19:36.750Z",
      "location": "Online",
      "capacity": 40,
      "price": 4800,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da7",
        "first_name": "Mariana",
        "last_name": "Ortega",
        "email": "instructor@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db3",
      "title": "Bootcamp Backend con Node.js y MongoDB",
      "description": "Programa intensivo de APIs REST con Express, Mongoose, autenticacion con JWT y arquitectura por capas.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dac",
        "name": "Backend",
        "slug": "backend",
        "description": "APIs, bases de datos y arquitectura del lado del servidor."
      },
      "format": "bootcamp",
      "level": "beginner",
      "date": "2026-10-04T00:19:36.750Z",
      "location": "Ciudad de Mexico",
      "capacity": 30,
      "price": 12500,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      }
    },
    {
      "id": "6a9a0e98a9db0f0c84169db4",
      "title": "Diplomado en Ingenieria de Datos",
      "description": "Diplomado de pipelines de datos, modelado dimensional, orquestacion y calidad de datos con Python y SQL.",
      "category": {
        "id": "6a9a0e98a9db0f0c84169dad",
        "name": "Ingenieria de Datos",
        "slug": "ingenieria-de-datos",
        "description": "Pipelines, modelado y calidad de datos."
      },
      "format": "diplomado",
      "level": "advanced",
      "date": "2026-11-03T00:19:36.750Z",
      "location": "Online",
      "capacity": 20,
      "price": 24000,
      "status": "published",
      "organizer": {
        "id": "6a9a0e98a9db0f0c84169da7",
        "first_name": "Mariana",
        "last_name": "Ortega",
        "email": "instructor@softwareai.com.mx"
      }
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 5,
  "totalPages": 1
}
```

### Un usuario comun no puede consultar borradores ajenos

```http
GET /events?status=draft
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para consultar cursos en ese estado"
}
```

## 5. Creacion de cursos y autorizacion por rol
### Un user comun intenta crear un curso

```http
POST /events

{"title":"No autorizado","description":"x","category":"6a9a0e98a9db0f0c84169dac","date":"2027-06-01T10:00:00.000Z","location":"Online","capacity":10}
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para realizar esta accion"
}
```

### Sin sesion

```http
POST /events

{"title":"No autenticado","description":"x","category":"6a9a0e98a9db0f0c84169dac","date":"2027-06-01T10:00:00.000Z","location":"Online","capacity":10}
```

**HTTP 401**

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Curso con fecha pasada

```http
POST /events

{"title":"Curso viejo","description":"x","category":"6a9a0e98a9db0f0c84169dac","date":"2020-01-01T10:00:00.000Z","location":"Online","capacity":10}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "No se puede crear un curso con fecha pasada"
}
```

### Curso con capacidad cero

```http
POST /events

{"title":"Sin cupo","description":"x","category":"6a9a0e98a9db0f0c84169dac","date":"2027-06-01T10:00:00.000Z","location":"Online","capacity":0}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "La capacidad debe ser mayor a cero"
}
```

### El organizador crea un curso valido con capacidad 2

```http
POST /events

{"title":"Workshop de prueba de cupos","description":"Curso creado para verificar el control de cupo","category":"6a9a0e98a9db0f0c84169dac","date":"2027-06-01T10:00:00.000Z","location":"Online","capacity":2,"price":0,"status":"published","format":"workshop","level":"intermediate"}
```

**HTTP 201**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0ea4a3eee089401446c4",
    "title": "Workshop de prueba de cupos",
    "description": "Curso creado para verificar el control de cupo",
    "category": {
      "id": "6a9a0e98a9db0f0c84169dac",
      "name": "Backend",
      "slug": "backend",
      "description": "APIs, bases de datos y arquitectura del lado del servidor."
    },
    "format": "workshop",
    "level": "intermediate",
    "date": "2027-06-01T10:00:00.000Z",
    "location": "Online",
    "capacity": 2,
    "price": 0,
    "status": "published",
    "organizer": {
      "id": "6a9a0e98a9db0f0c84169da7",
      "first_name": "Mariana",
      "last_name": "Ortega",
      "email": "instructor@softwareai.com.mx"
    }
  }
}
```

## 6. Inscripciones y control de cupo
### Inscripcion sin sesion

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 401**

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Inscripcion a un curso inexistente

```http
POST /events/000000000000000000000000/tickets

{"quantity":1}
```

**HTTP 404**

```json
{
  "status": "error",
  "message": "Curso no encontrado"
}
```

### Inscripcion exitosa

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 201**

```json
{
  "status": "success",
  "message": "Inscripcion realizada correctamente",
  "payload": {
    "id": "6a9a0ea6a3eee089401446d4",
    "event": {
      "id": "6a9a0ea4a3eee089401446c4",
      "title": "Workshop de prueba de cupos",
      "format": "workshop",
      "level": "intermediate",
      "date": "2027-06-01T10:00:00.000Z",
      "location": "Online",
      "status": "published"
    },
    "user": "6a9a0e98a9db0f0c84169da9",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "SAI-5PC6X7",
    "createdAt": "2026-09-04T00:19:50.246Z",
    "cancelledAt": null
  }
}
```

### Inscripcion duplicada del mismo usuario

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 409**

```json
{
  "status": "error",
  "message": "Ya tienes una inscripcion activa a este curso"
}
```

### Se piden mas lugares de los disponibles

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":5}
```

**HTTP 409**

```json
{
  "status": "error",
  "message": "No hay cupos suficientes disponibles (quedan 1)"
}
```

### Se toma el ultimo lugar

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 201**

```json
{
  "status": "success",
  "message": "Inscripcion realizada correctamente",
  "payload": {
    "id": "6a9a0ea7a3eee089401446e3",
    "event": {
      "id": "6a9a0ea4a3eee089401446c4",
      "title": "Workshop de prueba de cupos",
      "format": "workshop",
      "level": "intermediate",
      "date": "2027-06-01T10:00:00.000Z",
      "location": "Online",
      "status": "published"
    },
    "user": "6a9a0e98a9db0f0c84169da8",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "SAI-TS6U4Z",
    "createdAt": "2026-09-04T00:19:51.842Z",
    "cancelledAt": null
  }
}
```

### Curso agotado

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 409**

```json
{
  "status": "error",
  "message": "No hay cupos suficientes disponibles (quedan 0)"
}
```

### Mis inscripciones

```http
GET /tickets/my-tickets
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": [
    {
      "id": "6a9a0ea6a3eee089401446d4",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "published"
      },
      "user": "6a9a0e98a9db0f0c84169da9",
      "quantity": 1,
      "status": "confirmed",
      "reservationCode": "SAI-5PC6X7",
      "createdAt": "2026-09-04T00:19:50.246Z",
      "cancelledAt": null
    }
  ]
}
```

## 7. Cancelacion y liberacion de cupo
### Un tercero intenta cancelar una inscripcion ajena

```http
PATCH /tickets/6a9a0ea6a3eee089401446d4/cancel
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para cancelar esta inscripcion"
}
```

### El dueno cancela su inscripcion

```http
PATCH /tickets/6a9a0ea6a3eee089401446d4/cancel
```

**HTTP 200**

```json
{
  "status": "success",
  "message": "Inscripcion cancelada correctamente",
  "payload": {
    "id": "6a9a0ea6a3eee089401446d4",
    "event": {
      "id": "6a9a0ea4a3eee089401446c4",
      "title": "Workshop de prueba de cupos",
      "format": "workshop",
      "level": "intermediate",
      "date": "2027-06-01T10:00:00.000Z",
      "location": "Online",
      "status": "published"
    },
    "user": "6a9a0e98a9db0f0c84169da9",
    "quantity": 1,
    "status": "cancelled",
    "reservationCode": "SAI-5PC6X7",
    "createdAt": "2026-09-04T00:19:50.246Z",
    "cancelledAt": "2026-09-04T00:19:53.582Z"
  }
}
```

### Se intenta cancelar dos veces

```http
PATCH /tickets/6a9a0ea6a3eee089401446d4/cancel
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "La inscripcion ya esta cancelada"
}
```

### El cupo liberado permite una nueva inscripcion

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 201**

```json
{
  "status": "success",
  "message": "Inscripcion realizada correctamente",
  "payload": {
    "id": "6a9a0eaaa3eee089401446ff",
    "event": {
      "id": "6a9a0ea4a3eee089401446c4",
      "title": "Workshop de prueba de cupos",
      "format": "workshop",
      "level": "intermediate",
      "date": "2027-06-01T10:00:00.000Z",
      "location": "Online",
      "status": "published"
    },
    "user": "6a9a0e98a9db0f0c84169da6",
    "quantity": 1,
    "status": "confirmed",
    "reservationCode": "SAI-NPRGEN",
    "createdAt": "2026-09-04T00:19:54.362Z",
    "cancelledAt": null
  }
}
```

## 8. Propiedad del recurso
### Un organizador intenta editar un curso ajeno

```http
PUT /events/6a9a0ea4a3eee089401446c4

{"title":"Curso secuestrado"}
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para gestionar este curso"
}
```

### Un organizador ajeno intenta ver los inscriptos

```http
GET /events/6a9a0ea4a3eee089401446c4/tickets
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para consultar las inscripciones de este curso"
}
```

### Un user comun intenta ver los inscriptos

```http
GET /events/6a9a0ea4a3eee089401446c4/tickets
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para realizar esta accion"
}
```

### El organizador dueno si ve sus inscriptos

```http
GET /events/6a9a0ea4a3eee089401446c4/tickets
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": [
    {
      "id": "6a9a0eaaa3eee089401446ff",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "published"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da6",
        "first_name": "Fernando",
        "last_name": "Sanchez",
        "email": "admin@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "confirmed",
      "reservationCode": "SAI-NPRGEN",
      "createdAt": "2026-09-04T00:19:54.362Z",
      "cancelledAt": null
    },
    {
      "id": "6a9a0ea7a3eee089401446e3",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "published"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "confirmed",
      "reservationCode": "SAI-TS6U4Z",
      "createdAt": "2026-09-04T00:19:51.842Z",
      "cancelledAt": null
    },
    {
      "id": "6a9a0ea6a3eee089401446d4",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "published"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da9",
        "first_name": "Sofia",
        "last_name": "Gutierrez",
        "email": "estudiante@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "cancelled",
      "reservationCode": "SAI-5PC6X7",
      "createdAt": "2026-09-04T00:19:50.246Z",
      "cancelledAt": "2026-09-04T00:19:53.582Z"
    }
  ]
}
```

### Se intenta reducir la capacidad por debajo de las inscripciones activas

```http
PUT /events/6a9a0ea4a3eee089401446c4

{"capacity":1}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "La capacidad no puede ser menor a las inscripciones activas (2)"
}
```

### Se intenta mover la fecha al pasado

```http
PUT /events/6a9a0ea4a3eee089401446c4

{"date":"2020-01-01T10:00:00.000Z"}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "No se puede mover un curso a una fecha pasada"
}
```

### El admin si edita el curso de otro organizador

```http
PUT /events/6a9a0ea4a3eee089401446c4

{"capacity":20,"price":990}
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0ea4a3eee089401446c4",
    "title": "Workshop de prueba de cupos",
    "description": "Curso creado para verificar el control de cupo",
    "category": {
      "id": "6a9a0e98a9db0f0c84169dac",
      "name": "Backend",
      "slug": "backend",
      "description": "APIs, bases de datos y arquitectura del lado del servidor."
    },
    "format": "workshop",
    "level": "intermediate",
    "date": "2027-06-01T10:00:00.000Z",
    "location": "Online",
    "capacity": 20,
    "price": 990,
    "status": "published",
    "organizer": {
      "id": "6a9a0e98a9db0f0c84169da7",
      "first_name": "Mariana",
      "last_name": "Ortega",
      "email": "instructor@softwareai.com.mx"
    }
  }
}
```

## 9. Administracion
### Un user comun intenta listar usuarios

```http
GET /users
```

**HTTP 403**

```json
{
  "status": "error",
  "message": "No tienes permisos para realizar esta accion"
}
```

### El admin lista usuarios

```http
GET /users?limit=3
```

**HTTP 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "6a9a0e99a3eee089401446a3",
      "first_name": "Ana",
      "last_name": "Perez",
      "email": "ana@mail.com",
      "role": "user"
    },
    {
      "id": "6a9a0e98a9db0f0c84169da9",
      "first_name": "Sofia",
      "last_name": "Gutierrez",
      "email": "estudiante@softwareai.com.mx",
      "role": "user"
    },
    {
      "id": "6a9a0e98a9db0f0c84169da8",
      "first_name": "Diego",
      "last_name": "Ramirez",
      "email": "instructor2@softwareai.com.mx",
      "role": "organizer"
    }
  ],
  "page": 1,
  "limit": 3,
  "total": 5,
  "totalPages": 2
}
```

### El admin crea una categoria

```http
POST /categories

{"name":"QA y Pruebas con IA","description":"Pruebas automatizadas asistidas por IA"}
```

**HTTP 201**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0eaea3eee08940144726",
    "name": "QA y Pruebas con IA",
    "slug": "qa-y-pruebas-con-ia",
    "description": "Pruebas automatizadas asistidas por IA"
  }
}
```

### Se intenta borrar una categoria con cursos asociados

```http
DELETE /categories/6a9a0e98a9db0f0c84169dac
```

**HTTP 409**

```json
{
  "status": "error",
  "message": "No se puede eliminar una categoria con cursos asociados"
}
```

## 10. Cancelacion del curso en cascada
### El admin cancela el curso

```http
PATCH /events/6a9a0ea4a3eee089401446c4/status

{"status":"cancelled"}
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0ea4a3eee089401446c4",
    "title": "Workshop de prueba de cupos",
    "description": "Curso creado para verificar el control de cupo",
    "category": {
      "id": "6a9a0e98a9db0f0c84169dac",
      "name": "Backend",
      "slug": "backend",
      "description": "APIs, bases de datos y arquitectura del lado del servidor."
    },
    "format": "workshop",
    "level": "intermediate",
    "date": "2027-06-01T10:00:00.000Z",
    "location": "Online",
    "capacity": 20,
    "price": 990,
    "status": "cancelled",
    "organizer": {
      "id": "6a9a0e98a9db0f0c84169da7",
      "first_name": "Mariana",
      "last_name": "Ortega",
      "email": "instructor@softwareai.com.mx"
    }
  }
}
```

### Las inscripciones activas quedaron canceladas

```http
GET /events/6a9a0ea4a3eee089401446c4/tickets
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": [
    {
      "id": "6a9a0eaaa3eee089401446ff",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "cancelled"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da6",
        "first_name": "Fernando",
        "last_name": "Sanchez",
        "email": "admin@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "cancelled",
      "reservationCode": "SAI-NPRGEN",
      "createdAt": "2026-09-04T00:19:54.362Z",
      "cancelledAt": "2026-09-04T00:19:59.242Z"
    },
    {
      "id": "6a9a0ea7a3eee089401446e3",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "cancelled"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da8",
        "first_name": "Diego",
        "last_name": "Ramirez",
        "email": "instructor2@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "cancelled",
      "reservationCode": "SAI-TS6U4Z",
      "createdAt": "2026-09-04T00:19:51.842Z",
      "cancelledAt": "2026-09-04T00:19:59.242Z"
    },
    {
      "id": "6a9a0ea6a3eee089401446d4",
      "event": {
        "id": "6a9a0ea4a3eee089401446c4",
        "title": "Workshop de prueba de cupos",
        "format": "workshop",
        "level": "intermediate",
        "date": "2027-06-01T10:00:00.000Z",
        "location": "Online",
        "status": "cancelled"
      },
      "user": {
        "id": "6a9a0e98a9db0f0c84169da9",
        "first_name": "Sofia",
        "last_name": "Gutierrez",
        "email": "estudiante@softwareai.com.mx"
      },
      "quantity": 1,
      "status": "cancelled",
      "reservationCode": "SAI-5PC6X7",
      "createdAt": "2026-09-04T00:19:50.246Z",
      "cancelledAt": "2026-09-04T00:19:53.582Z"
    }
  ]
}
```

### Ya no se puede inscribir a un curso cancelado

```http
POST /events/6a9a0ea4a3eee089401446c4/tickets

{"quantity":1}
```

**HTTP 400**

```json
{
  "status": "error",
  "message": "El curso no esta disponible para inscripciones"
}
```

## 11. La contrasena nunca sale de la base

Documento crudo en MongoDB, tal como lo devuelve la coleccion `users`:

```json
{
  "_id": "6a9a0e98a9db0f0c84169da6",
  "first_name": "Fernando",
  "last_name": "Sanchez",
  "email": "admin@softwareai.com.mx",
  "password": "$2b$10$qnxbem8R4E4FQo6dW7Tok.d.x0QcGJH5DczEzNfLjXurlnNRDQOqG",
  "role": "admin",
  "__v": 0,
  "createdAt": "2026-09-04T00:19:36.734Z",
  "updatedAt": "2026-09-04T00:19:36.734Z"
}
```

La misma cuenta, tal como la expone la API:

### GET /sessions/current (respuesta con DTO)

```http
GET /sessions/current
```

**HTTP 200**

```json
{
  "status": "success",
  "payload": {
    "id": "6a9a0e98a9db0f0c84169da6",
    "first_name": "Fernando",
    "last_name": "Sanchez",
    "email": "admin@softwareai.com.mx",
    "role": "admin"
  }
}
```

### Barrido de fugas

Se buscó la cadena `password` en las respuestas de cursos, categorias, sesion actual, inscripciones y usuarios:

```
coincidencias encontradas: 0
```
