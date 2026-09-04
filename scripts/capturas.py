"""
Genera las paginas HTML que se fotografian como capturas de evidencia.
Uso: python scripts/capturas.py   (requiere docs/EVIDENCIA.md y docs/newman-run.txt)
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
OUT = DOCS / "capturas"
OUT.mkdir(parents=True, exist_ok=True)

CSS = """
* { box-sizing: border-box; }
body { margin: 0; background: #0d1117; color: #c9d1d9;
       font-family: 'Cascadia Code', 'Consolas', 'Menlo', monospace; font-size: 13px; }
.wrap { padding: 22px 26px; }
h1 { font-size: 17px; margin: 0 0 4px; color: #58a6ff; font-family: system-ui, sans-serif; }
.sub { font-size: 12px; color: #8b949e; margin-bottom: 18px; font-family: system-ui, sans-serif; }
.card { background: #161b22; border: 1px solid #30363d; border-radius: 6px;
        margin-bottom: 12px; overflow: hidden; }
.card h2 { font-size: 12px; margin: 0; padding: 8px 12px; background: #1f2630;
           border-bottom: 1px solid #30363d; color: #e6edf3; font-family: system-ui, sans-serif;
           font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
.badge { font-size: 11px; padding: 1px 8px; border-radius: 10px; font-weight: 700; }
.b2 { background: #12341f; color: #3fb950; border: 1px solid #238636; }
.b4 { background: #3a2416; color: #f0883e; border: 1px solid #9e5622; }
pre { margin: 0; padding: 10px 12px; white-space: pre-wrap; word-break: break-word;
      line-height: 1.45; font-size: 12px; }
.req { color: #7ee787; background: #10151c; border-bottom: 1px solid #21262d; }
.key { color: #79c0ff; }
.str { color: #a5d6ff; }
.num { color: #f0883e; }
.hash { color: #ff7b72; font-weight: 700; }
.ok { color: #3fb950; }
.foot { font-size: 11px; color: #8b949e; margin-top: 14px; font-family: system-ui, sans-serif; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
"""


def color_json(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r'"(\$2b\$[^"]+)"', r'<span class="hash">"\1"</span>', text)
    text = re.sub(r'"([\w_]+)":', r'<span class="key">"\1"</span>:', text)
    return text


def parse_block(block: str):
    """Devuelve (titulo, request, codigo, cuerpo) de un bloque markdown de EVIDENCIA.md."""
    title = block.splitlines()[0].replace("### ", "").strip()
    req = re.search(r"```http\n(.*?)```", block, re.S)
    code = re.search(r"\*\*HTTP (\d+)\*\*", block)
    body = re.search(r"```json\n(.*?)```", block, re.S)
    return (
        title,
        req.group(1).strip() if req else "",
        code.group(1) if code else "",
        body.group(1).strip() if body else "",
    )


def card(block: str, max_lines: int = 22) -> str:
    title, req, code, body = parse_block(block)
    lines = body.splitlines()
    if len(lines) > max_lines:
        body = "\n".join(lines[:max_lines]) + f"\n  ... ({len(lines) - max_lines} lineas mas)"
    cls = "b2" if code.startswith("2") else "b4"
    return f"""
    <div class="card">
      <h2><span>{html.escape(title)}</span> <span class="badge {cls}">HTTP {code}</span></h2>
      <pre class="req">{html.escape(req)}</pre>
      <pre>{color_json(body)}</pre>
    </div>"""


def page(name: str, title: str, subtitle: str, content: str, foot: str = ""):
    doc = f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>{html.escape(title)}</title><style>{CSS}</style></head><body>
<div class="wrap"><h1>{html.escape(title)}</h1><div class="sub">{html.escape(subtitle)}</div>
{content}
{f'<div class="foot">{foot}</div>' if foot else ''}
</div></body></html>"""
    (OUT / name).write_text(doc, encoding="utf-8")
    print("generado:", name)


EVID = (DOCS / "EVIDENCIA.md").read_text(encoding="utf-8")


def extraer(titulo: str) -> str:
    """Devuelve el bloque de EVIDENCIA.md que arranca con ese titulo."""
    i = EVID.find("### " + titulo)
    if i < 0:
        raise SystemExit(f"No se encontro el bloque: {titulo}")
    j = EVID.find("### ", i + 4)
    return EVID[i:j if j > 0 else len(EVID)]


blocks = {
    "reg": extraer("Registro: el rol enviado en el body se ignora y el email se normaliza"),
    "dup": extraer("Registro duplicado"),
    "cur": extraer("GET /sessions/current con sesion"),
    "out": extraer("GET /sessions/current despues del logout"),
    "ins": extraer("Inscripcion exitosa"),
    "dupins": extraer("Inscripcion duplicada del mismo usuario"),
    "cupo": extraer("Se piden mas lugares de los disponibles"),
    "lib": extraer("El cupo liberado permite una nueva inscripcion"),
    "ajeno": extraer("Un organizador intenta editar un curso ajeno"),
    "cap": extraer("Se intenta reducir la capacidad por debajo de las inscripciones activas"),
    "lista": extraer("Listado paginado publico"),
    "dto": extraer("GET /sessions/current (respuesta con DTO)"),
    "fugas": EVID[EVID.find("### Barrido de fugas"):],
}
_i = EVID.find("## 11.")
blocks["hash"] = EVID[_i:EVID.find("### GET /sessions/current (respuesta con DTO)", _i)]
newman = (DOCS / "newman-run.txt").read_text(encoding="utf-8", errors="replace")

# 1. Autenticacion
page(
    "01-autenticacion.html",
    "1. Registro, sesion y logout",
    "Salidas reales de la API. El rol enviado en el body se ignora, el email se normaliza y ninguna respuesta incluye la contrasena.",
    card(blocks["reg"]) + card(blocks["dup"]) + card(blocks["cur"]) + card(blocks["out"]),
)

# 2. Inscripciones y cupos
page(
    "02-inscripciones-cupos.html",
    "2. Inscripciones, duplicados y control de cupo",
    "Curso con capacidad 2. El cupo disponible se calcula sumando las inscripciones no canceladas.",
    card(blocks["ins"], max_lines=14)
    + card(blocks["dupins"])
    + card(blocks["cupo"])
    + card(blocks["lib"], max_lines=12),
)

# 3. Autorizacion
page(
    "03-autorizacion.html",
    "3. Autorizacion por rol y por propiedad",
    "Estar autenticado no alcanza: un organizador solo gestiona sus propios cursos.",
    card(blocks["ajeno"]) + card(blocks["cap"]) + card(blocks["lista"], max_lines=16),
)

# 4. Contrasena hasheada
hash_block = blocks["hash"]
mongo_doc = re.search(r"```json\n(.*?)```", hash_block, re.S)
mongo_doc = mongo_doc.group(1).strip() if mongo_doc else ""
fugas = re.search(r"```\n(.*?)```", blocks["fugas"], re.S)
fugas = fugas.group(1).strip() if fugas else ""

page(
    "04-password-hasheada.html",
    "4. La contrasena nunca sale de la base",
    "Documento crudo de MongoDB frente a la respuesta que entrega la API a traves del DTO.",
    f"""
    <div class="card">
      <h2><span>Coleccion users en MongoDB (documento crudo)</span> <span class="badge b2">bcrypt</span></h2>
      <pre>{color_json(mongo_doc)}</pre>
    </div>
    {card(blocks['dto'])}
    <div class="card">
      <h2><span>Barrido de la cadena "password" en cursos, categorias, sesion, inscripciones y usuarios</span></h2>
      <pre class="ok">{html.escape(fugas)}</pre>
    </div>""",
)

# 5. Newman
tail = "\n".join(newman.splitlines()[-24:])
head = "\n".join(newman.splitlines()[:26])
page(
    "05-newman.html",
    "5. Coleccion de Postman ejecutada con Newman",
    "postman/SoftwareAI.postman_collection.json — 50 requests, 66 assertions, 0 fallos.",
    f"""
    <div class="grid2">
      <div class="card"><h2>Inicio de la corrida</h2><pre>{html.escape(head)}</pre></div>
      <div class="card"><h2>Resumen final</h2><pre>{html.escape(tail)}</pre></div>
    </div>""",
)


def recortar(png: pathlib.Path, fondo=(13, 17, 23), margen=24):
    """Recorta el fondo sobrante debajo del contenido de una captura."""
    from PIL import Image

    img = Image.open(png).convert("RGB")
    ancho, alto = img.size
    pixels = img.load()
    ultima = 0

    for y in range(alto - 1, -1, -1):
        fila_vacia = True
        for x in range(0, ancho, 7):
            r, g, b = pixels[x, y]
            if abs(r - fondo[0]) + abs(g - fondo[1]) + abs(b - fondo[2]) > 12:
                fila_vacia = False
                break
        if not fila_vacia:
            ultima = y
            break

    if ultima and ultima + margen < alto:
        img.crop((0, 0, ancho, min(alto, ultima + margen))).save(png)
        print(f"recortada: {png.name} -> {ancho}x{ultima + margen}")


if __name__ == "__main__" and len(__import__("sys").argv) > 1 and __import__("sys").argv[1] == "--recortar":
    for archivo in sorted(OUT.glob("*.png")):
        recortar(archivo)
