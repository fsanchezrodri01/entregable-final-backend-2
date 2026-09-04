# Coleccion de Postman

`SoftwareAI.postman_collection.json` recorre el flujo completo de la API: registro, login, roles,
cursos, inscripciones, control de cupo, cancelaciones y administracion.

## Antes de correr

1. Levantar la API: `npm start`
2. Cargar datos de prueba: `npm run seed`

La coleccion crea sus propios datos (un curso con capacidad 2) y guarda los ids en variables, asi
que **se ejecuta de arriba hacia abajo**. Las cookies de sesion las administra Postman solo.

## Desde Postman

**Import** → arrastrar el archivo → **Run collection**.

Si la API corre en otro puerto, cambiar la variable `baseUrl` de la coleccion.

## Desde la terminal

```bash
npm run postman
```

Ese comando **recarga la base antes de correr**, porque la coleccion asume datos limpios: si se
ejecuta dos veces seguidas sin recargar, el registro inicial devuelve `409` y fallan 4 assertions.
Para correrla sin recargar: `npx newman run postman/SoftwareAI.postman_collection.json`.

Ultima corrida registrada en [`../docs/newman-run.txt`](../docs/newman-run.txt):
**50 requests, 66 assertions, 0 fallos.**

## Que verifica

| Carpeta | Cubre |
|---------|-------|
| `00 - Salud` | el servidor responde |
| `01 - Autenticacion` | registro, rol ignorado desde el body, email normalizado, duplicados, login, `/current`, logout |
| `02 - Cursos y roles` | listado paginado, tope de `limit`, `403` para `user`, validaciones de fecha y capacidad |
| `03 - Inscripciones y cupos` | inscripcion, duplicado, sin cupo, cancelacion y liberacion del lugar |
| `04 - Propiedad y administracion` | curso ajeno, reduccion de capacidad, poderes de `admin`, cancelacion en cascada |

## Variables

`baseUrl` y las credenciales de los cuatro usuarios del seed vienen precargadas.
`categoryId`, `eventId` y `ticketId` se completan solas durante la corrida.
