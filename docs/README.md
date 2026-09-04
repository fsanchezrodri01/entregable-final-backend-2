# Evidencia del entregable

## Que hay aca

| Archivo | Contenido |
|---------|-----------|
| [`EVIDENCIA.md`](EVIDENCIA.md) | transcripcion completa: request, codigo HTTP y respuesta de cada caso |
| [`newman-run.txt`](newman-run.txt) | salida de la coleccion de Postman ejecutada con Newman |
| [`capturas/`](capturas) | las mismas salidas en imagen, listas para adjuntar |

Todo se genera contra la API corriendo, no esta escrito a mano.

## Capturas

### 1. Registro, sesion y logout
El rol enviado en el body se ignora, el email se normaliza y ninguna respuesta incluye la contrasena.

![Registro, sesion y logout](capturas/01-autenticacion.png)

### 2. Inscripciones, duplicados y control de cupo
Curso con capacidad 2: inscripcion, duplicado rechazado, cupo insuficiente y lugar liberado tras cancelar.

![Inscripciones y cupos](capturas/02-inscripciones-cupos.png)

### 3. Autorizacion por rol y por propiedad
Un organizador no toca cursos ajenos, y la capacidad no baja de las inscripciones activas.

![Autorizacion](capturas/03-autorizacion.png)

### 4. La contrasena nunca sale de la base
Documento crudo de MongoDB con el hash de bcrypt, frente a la respuesta que entrega el DTO.

![Contrasena hasheada](capturas/04-password-hasheada.png)

### 5. Coleccion de Postman ejecutada con Newman
50 requests, 66 assertions, 0 fallos.

![Newman](capturas/05-newman.png)

## Como se genero

Estas salidas se produjeron ejecutando el flujo completo contra la API corriendo sobre MongoDB,
con la base recien cargada por `npm run seed`. La corrida de Newman se reproduce en cualquier
momento con:

```bash
npm run postman
```

Los generadores de la transcripcion y de las imagenes son scripts locales, fuera del repositorio.
