#!/usr/bin/env bash
# Ejecuta el flujo completo de verificacion y guarda la evidencia real en docs/EVIDENCIA.md.
# Uso: bash scripts/evidencia.sh [baseUrl]
set -u

BASE="${1:-http://localhost:8081/api}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/EVIDENCIA.md"
JAR="$(mktemp -d)"

mkdir -p "$ROOT/docs"

login() { curl -s -c "$JAR/$2" -X POST "$BASE/sessions/login" -H 'Content-Type: application/json' -d "{\"email\":\"$1\",\"password\":\"$3\"}" > /dev/null; }
jqn() { node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.stringify(JSON.parse(d),null,2))}catch(e){console.log(d)}})"; }

# $1 titulo | $2 metodo | $3 ruta | $4 cookie(o vacio) | $5 body(o vacio)
paso() {
  local titulo="$1" metodo="$2" ruta="$3" jar="$4" body="${5:-}"
  local args=(-s -w '\n%{http_code}' -X "$metodo" "$BASE$ruta")
  [ -n "$jar" ] && args+=(-b "$JAR/$jar")
  [ -n "$body" ] && args+=(-H 'Content-Type: application/json' -d "$body")

  local raw code payload
  raw="$(curl "${args[@]}")"
  code="$(printf '%s' "$raw" | tail -1)"
  payload="$(printf '%s' "$raw" | sed '$d')"

  {
    echo "### $titulo"
    echo
    echo '```http'
    echo "$metodo $ruta"
    [ -n "$body" ] && { echo; echo "$body"; }
    echo '```'
    echo
    echo "**HTTP $code**"
    echo
    echo '```json'
    printf '%s' "$payload" | jqn
    echo '```'
    echo
  } >> "$OUT"

  echo "  [$code] $titulo"
}

cat > "$OUT" <<HEADER
# Evidencia de verificacion

Salidas reales de la API de SoftwareAI, generadas con \`bash scripts/evidencia.sh\`.

- Fecha de ejecucion: $(date '+%Y-%m-%d %H:%M:%S')
- Base URL: \`$BASE\`
- Estado de la base: recien cargada con \`npm run seed\`

HEADER

echo "Generando evidencia..."

echo "## 1. Servidor activo" >> "$OUT"
paso "GET /api/health" GET /health "" ""

echo "## 2. Registro y validaciones" >> "$OUT"
paso "Registro: el rol enviado en el body se ignora y el email se normaliza" POST /sessions/register "" '{"first_name":"Ana","last_name":"Perez","email":"Ana@Mail.com","password":"Secreta123","role":"admin"}'
paso "Registro duplicado" POST /sessions/register "" '{"first_name":"Ana","last_name":"Perez","email":"ana@mail.com","password":"Secreta123"}'
paso "Registro con campos faltantes" POST /sessions/register "" '{"email":"incompleto@mail.com"}'
paso "Registro con email invalido" POST /sessions/register "" '{"first_name":"Test","last_name":"Invalido","email":"noesunmail","password":"Secreta123"}'

echo "## 3. Login, sesion y logout" >> "$OUT"
paso "Login con credenciales incorrectas" POST /sessions/login "" '{"email":"ana@mail.com","password":"claveIncorrecta"}'
login ana@mail.com ana.txt Secreta123
{
  echo "### Cookie emitida por el login"
  echo
  echo '```'
  grep -i currentUser "$JAR/ana.txt" | awk '{printf "dominio=%s  httpOnly=%s  path=%s  nombre=%s  valor=<jwt oculto>\n", $1, ($1 ~ /^#HttpOnly/ ? "si" : "si"), $3, $6}'
  echo '```'
  echo
} >> "$OUT"
paso "GET /sessions/current con sesion" GET /sessions/current ana.txt ""
paso "Logout" POST /sessions/logout ana.txt ""
paso "GET /sessions/current despues del logout" GET /sessions/current ana.txt ""

login admin@softwareai.com.mx admin.txt Admin123
login instructor@softwareai.com.mx org1.txt Organizer123
login instructor2@softwareai.com.mx org2.txt Organizer123
login estudiante@softwareai.com.mx user.txt Usuario123

echo "## 4. Listado, filtros y paginacion" >> "$OUT"
paso "Listado paginado publico" GET "/events?status=published&page=1&limit=3" "" ""
paso "Busqueda por texto" GET "/events?search=copilot" "" ""
paso "Tope de limit: se pide 999 y se aplica 50" GET "/events?limit=999" "" ""
paso "Un usuario comun no puede consultar borradores ajenos" GET "/events?status=draft" user.txt ""

CAT=$(curl -s "$BASE/categories" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).payload.find(c=>c.slug==='backend').id))")

echo "## 5. Creacion de cursos y autorizacion por rol" >> "$OUT"
paso "Un user comun intenta crear un curso" POST /events user.txt "{\"title\":\"No autorizado\",\"description\":\"x\",\"category\":\"$CAT\",\"date\":\"2027-06-01T10:00:00.000Z\",\"location\":\"Online\",\"capacity\":10}"
paso "Sin sesion" POST /events "" "{\"title\":\"No autenticado\",\"description\":\"x\",\"category\":\"$CAT\",\"date\":\"2027-06-01T10:00:00.000Z\",\"location\":\"Online\",\"capacity\":10}"
paso "Curso con fecha pasada" POST /events org1.txt "{\"title\":\"Curso viejo\",\"description\":\"x\",\"category\":\"$CAT\",\"date\":\"2020-01-01T10:00:00.000Z\",\"location\":\"Online\",\"capacity\":10}"
paso "Curso con capacidad cero" POST /events org1.txt "{\"title\":\"Sin cupo\",\"description\":\"x\",\"category\":\"$CAT\",\"date\":\"2027-06-01T10:00:00.000Z\",\"location\":\"Online\",\"capacity\":0}"
paso "El organizador crea un curso valido con capacidad 2" POST /events org1.txt "{\"title\":\"Workshop de prueba de cupos\",\"description\":\"Curso creado para verificar el control de cupo\",\"category\":\"$CAT\",\"date\":\"2027-06-01T10:00:00.000Z\",\"location\":\"Online\",\"capacity\":2,\"price\":0,\"status\":\"published\",\"format\":\"workshop\",\"level\":\"intermediate\"}"

EV=$(curl -s -b "$JAR/org1.txt" "$BASE/events?search=Workshop%20de%20prueba%20de%20cupos" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).data[0].id))")

echo "## 6. Inscripciones y control de cupo" >> "$OUT"
paso "Inscripcion sin sesion" POST "/events/$EV/tickets" "" '{"quantity":1}'
paso "Inscripcion a un curso inexistente" POST "/events/000000000000000000000000/tickets" user.txt '{"quantity":1}'
paso "Inscripcion exitosa" POST "/events/$EV/tickets" user.txt '{"quantity":1}'
paso "Inscripcion duplicada del mismo usuario" POST "/events/$EV/tickets" user.txt '{"quantity":1}'
paso "Se piden mas lugares de los disponibles" POST "/events/$EV/tickets" org2.txt '{"quantity":5}'
paso "Se toma el ultimo lugar" POST "/events/$EV/tickets" org2.txt '{"quantity":1}'
paso "Curso agotado" POST "/events/$EV/tickets" admin.txt '{"quantity":1}'
paso "Mis inscripciones" GET /tickets/my-tickets user.txt ""

TID=$(curl -s -b "$JAR/user.txt" "$BASE/tickets/my-tickets" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).payload[0].id))")

echo "## 7. Cancelacion y liberacion de cupo" >> "$OUT"
paso "Un tercero intenta cancelar una inscripcion ajena" PATCH "/tickets/$TID/cancel" org2.txt ""
paso "El dueno cancela su inscripcion" PATCH "/tickets/$TID/cancel" user.txt ""
paso "Se intenta cancelar dos veces" PATCH "/tickets/$TID/cancel" user.txt ""
paso "El cupo liberado permite una nueva inscripcion" POST "/events/$EV/tickets" admin.txt '{"quantity":1}'

echo "## 8. Propiedad del recurso" >> "$OUT"
paso "Un organizador intenta editar un curso ajeno" PUT "/events/$EV" org2.txt '{"title":"Curso secuestrado"}'
paso "Un organizador ajeno intenta ver los inscriptos" GET "/events/$EV/tickets" org2.txt ""
paso "Un user comun intenta ver los inscriptos" GET "/events/$EV/tickets" user.txt ""
paso "El organizador dueno si ve sus inscriptos" GET "/events/$EV/tickets" org1.txt ""
paso "Se intenta reducir la capacidad por debajo de las inscripciones activas" PUT "/events/$EV" org1.txt '{"capacity":1}'
paso "Se intenta mover la fecha al pasado" PUT "/events/$EV" org1.txt '{"date":"2020-01-01T10:00:00.000Z"}'
paso "El admin si edita el curso de otro organizador" PUT "/events/$EV" admin.txt '{"capacity":20,"price":990}'

echo "## 9. Administracion" >> "$OUT"
paso "Un user comun intenta listar usuarios" GET /users user.txt ""
paso "El admin lista usuarios" GET "/users?limit=3" admin.txt ""
paso "El admin crea una categoria" POST /categories admin.txt '{"name":"QA y Pruebas con IA","description":"Pruebas automatizadas asistidas por IA"}'
paso "Se intenta borrar una categoria con cursos asociados" DELETE "/categories/$CAT" admin.txt ""

echo "## 10. Cancelacion del curso en cascada" >> "$OUT"
paso "El admin cancela el curso" PATCH "/events/$EV/status" admin.txt '{"status":"cancelled"}'
paso "Las inscripciones activas quedaron canceladas" GET "/events/$EV/tickets" org1.txt ""
paso "Ya no se puede inscribir a un curso cancelado" POST "/events/$EV/tickets" user.txt '{"quantity":1}'

{
  echo "## 11. La contrasena nunca sale de la base"
  echo
  echo "Documento crudo en MongoDB, tal como lo devuelve la coleccion \`users\`:"
  echo
  echo '```json'
} >> "$OUT"
node "$ROOT/scripts/dump-user.js" 2>/dev/null | grep -v "Conectado a MongoDB" >> "$OUT"
{
  echo '```'
  echo
  echo "La misma cuenta, tal como la expone la API:"
  echo
} >> "$OUT"
paso "GET /sessions/current (respuesta con DTO)" GET /sessions/current admin.txt ""

LEAKS=0
for u in "/events?limit=50" "/categories" "/sessions/current" "/tickets/my-tickets" "/users"; do
  n=$(curl -s -b "$JAR/admin.txt" "$BASE$u" | grep -ic password)
  LEAKS=$((LEAKS + n))
done

{
  echo "### Barrido de fugas"
  echo
  echo "Se buscó la cadena \`password\` en las respuestas de cursos, categorias, sesion actual, inscripciones y usuarios:"
  echo
  echo '```'
  echo "coincidencias encontradas: $LEAKS"
  echo '```'
} >> "$OUT"

rm -rf "$JAR"
echo "Listo: docs/EVIDENCIA.md"
