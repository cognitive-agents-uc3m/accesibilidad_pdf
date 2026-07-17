import asyncio
import json
import logging
import os
import re
import tempfile
import uuid as _uuid
from datetime import datetime, timezone

from google.cloud import storage as _gcs

from dotenv import load_dotenv
from rich.logging import RichHandler

from authlib.integrations.starlette_client import OAuth
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from google import genai
from google.genai import types
from starlette.middleware.sessions import SessionMiddleware

from asignaturas import ASIGNATURAS, BASE_PROMPT, construir_prompt_completo

load_dotenv()

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "uc3m-inf-dei-accessmllm")
LOCATION   = os.getenv("GCP_LOCATION", "global")
GCS_BUCKET = os.getenv("GCS_BUCKET", "")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")

# Correos autorizados. Si la variable está vacía, se permite cualquier cuenta.
ALLOWED_EMAILS: set[str] = {
    e.strip().lower()
    for e in os.getenv("ALLOWED_EMAILS", "").split(",")
    if e.strip()
}

logging.basicConfig(
    level=logging.WARNING,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(rich_tracebacks=True, markup=True, show_path=False)],
)
logging.getLogger("main").setLevel(logging.INFO)
log = logging.getLogger("main")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="Accesibilidad PDF — UC3M")
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile", "prompt": "select_account"},
)


# ── Autenticación ─────────────────────────────────────────────────────────────

def sesion_activa(request: Request) -> dict:
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Sesión expirada. Recarga la página.")
    return user


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request, error: str = ""):
    if request.session.get("user"):
        return RedirectResponse("/", status_code=302)
    return templates.TemplateResponse(request, "login.html", {"error": error})


@app.get("/auth/iniciar")
async def auth_iniciar(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri, prompt="select_account")


@app.get("/auth/callback")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        return RedirectResponse("/login?error=oauth", status_code=302)

    user_info = token.get("userinfo", {})
    email = user_info.get("email", "").lower()

    if ALLOWED_EMAILS and email not in ALLOWED_EMAILS:
        log.warning("Acceso denegado: %s", email)
        return RedirectResponse("/login?error=no_autorizado", status_code=302)

    request.session["user"] = {
        "email": email,
        "nombre": user_info.get("name", email),
        "foto": user_info.get("picture", ""),
    }
    log.info("Login exitoso: %s", email)
    return RedirectResponse("/", status_code=302)


@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login", status_code=302)


# ── Páginas ───────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse("/login", status_code=302)

    asignaturas_ordenadas = sorted(
        [
            {"codigo": k, "nombre": v["nombre"], "curso": v["curso"], "cuatrimestre": v["cuatrimestre"]}
            for k, v in ASIGNATURAS.items()
        ],
        key=lambda x: (x["curso"], x["cuatrimestre"], x["nombre"]),
    )
    return templates.TemplateResponse(
        request, "index.html",
        {"asignaturas": asignaturas_ordenadas, "user": user},
    )


# ── API ───────────────────────────────────────────────────────────────────────

_PROMPT_COMPAT = """\
Analiza el siguiente conjunto de instrucciones para la generación de HTML accesible \
y detecta únicamente contradicciones directas o conflictos claros entre instrucciones distintas. \
Sé muy conservador: no reportes solapamientos semánticos ni especializaciones, \
solo conflictos reales donde dos instrucciones pidan cosas opuestas o incompatibles.

IMPORTANTE: Solo reporta contradicciones ENTRE fuentes distintas (por ejemplo, entre un SKILL \
y BASE_PROMPT, o entre dos SKILLs, o entre una PERSONALIZADA y BASE_PROMPT). \
NUNCA reportes contradicciones internas dentro del propio BASE_PROMPT. \
Si ambas fuentes de una contradicción serían BASE_PROMPT, descarta esa contradicción.

<instrucciones_a_revisar>
{instrucciones}
</instrucciones_a_revisar>

Responde EXCLUSIVAMENTE con JSON válido. Sin texto adicional, sin bloques markdown.

Sin contradicciones: {{"compatible": true, "contradicciones": []}}
Con contradicciones:
{{
  "compatible": false,
  "contradicciones": [
    {{
      "fuente_a": "BASE_PROMPT | SKILL: <titulo> | PERSONALIZADA <n>",
      "fragmento_a": "<cita exacta breve>",
      "fuente_b": "BASE_PROMPT | SKILL: <titulo> | PERSONALIZADA <n>",
      "fragmento_b": "<cita exacta breve>",
      "motivo": "<explicación en español, máx. 1 frase>"
    }}
  ]
}}\
"""


def _parsear_skills(texto: str) -> list[dict]:
    """Parsea el prompt_especifico en secciones con título, ítems para mostrar y texto original."""
    secciones: list[dict] = []
    seccion_actual: dict | None = None
    lineas_actuales: list[str] = []

    for linea in texto.splitlines():
        if linea.startswith("### ") or linea.startswith("## "):
            if seccion_actual and seccion_actual["items"]:
                seccion_actual["original"] = "\n".join(lineas_actuales)
                secciones.append(seccion_actual)
            titulo = linea.lstrip("#").strip()
            seccion_actual = {"titulo": titulo, "items": []}
            lineas_actuales = [linea]
        elif seccion_actual is not None:
            lineas_actuales.append(linea)
            stripped = linea.lstrip()
            num_match = re.match(r"^(\d+)\.\s+(.*)", stripped)
            if stripped.startswith("- "):
                item = re.sub(r"`([^`]+)`", r"\1", stripped[2:].strip())
                item = re.sub(r"\*\*([^*]+)\*\*", r"\1", item)
                seccion_actual["items"].append(item)
            elif num_match:
                item = re.sub(r"`([^`]+)`", r"\1", num_match.group(2).strip())
                item = re.sub(r"\*\*([^*]+)\*\*", r"\1", item)
                seccion_actual["items"].append(item)
            elif linea.startswith("  ") and seccion_actual["items"]:
                continuation = re.sub(r"`([^`]+)`", r"\1", linea.strip())
                if continuation:
                    seccion_actual["items"][-1] += " " + continuation

    if seccion_actual and seccion_actual["items"]:
        seccion_actual["original"] = "\n".join(lineas_actuales)
        secciones.append(seccion_actual)
    return secciones


def _construir_prompt_filtrado(codigo: str, indices_activos: list[int]) -> str:
    asig = ASIGNATURAS[codigo]
    secciones = _parsear_skills(asig.get("prompt_especifico", ""))
    partes = [secciones[i]["original"] for i in indices_activos if i < len(secciones)]
    extra = "\n\n".join(partes)
    return BASE_PROMPT + ("\n\n" + extra if extra else "")


@app.post("/api/check-contradicciones")
async def check_contradicciones(
    asignatura: str = Form(...),
    skills_activos: str = Form(default=""),
    skills_custom: str = Form(default=""),
    user: dict = Depends(sesion_activa),
):
    if asignatura not in ASIGNATURAS:
        raise HTTPException(status_code=400, detail="Asignatura desconocida")

    asig = ASIGNATURAS[asignatura]
    todas = _parsear_skills(asig.get("prompt_especifico", ""))

    if skills_activos.strip():
        try:
            indices = [i for i in json.loads(skills_activos) if isinstance(i, int) and i >= 0]
            activas = [todas[i] for i in indices if i < len(todas)]
        except (json.JSONDecodeError, IndexError):
            activas = todas
    else:
        activas = todas

    partes = [f"<base_prompt>\n{BASE_PROMPT}\n</base_prompt>"]
    for sec in activas:
        partes.append(f"<skill_seccion nombre=\"{sec['titulo']}\">\n{sec['original']}\n</skill_seccion>")
    if skills_custom.strip():
        try:
            for n, texto in enumerate(
                [t.strip() for t in json.loads(skills_custom) if t.strip()], 1
            ):
                partes.append(f"<instruccion_personalizada id=\"{n}\">\n{texto}\n</instruccion_personalizada>")
        except json.JSONDecodeError:
            pass

    prompt = _PROMPT_COMPAT.format(instrucciones="\n\n".join(partes))
    try:
        client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
        response = client.models.generate_content(model="gemini-2.5-flash", contents=[prompt])
        raw = (response.text or "").strip()
        raw = re.sub(r"^```(?:json)?\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        resultado = json.loads(raw)
        contradicciones = [
            c for c in resultado.get("contradicciones", [])
            if not (c.get("fuente_a") == "BASE_PROMPT" and c.get("fuente_b") == "BASE_PROMPT")
        ]
        resultado["contradicciones"] = contradicciones
        if not contradicciones:
            resultado["compatible"] = True
        log.info("Compatibilidad %s: compatible=%s, conflictos=%d",
                 asignatura, resultado.get("compatible"),
                 len(contradicciones))
        return JSONResponse(resultado)
    except json.JSONDecodeError:
        log.warning("Respuesta de check-contradicciones no es JSON válido")
        return JSONResponse({"compatible": True, "contradicciones": [],
                             "aviso": "No se pudo analizar la respuesta."})
    except Exception as exc:
        log.exception("Error en check-contradicciones")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/skills/{codigo}")
async def get_skills(codigo: str, user: dict = Depends(sesion_activa)):
    if codigo not in ASIGNATURAS:
        raise HTTPException(status_code=404, detail="Asignatura no encontrada")
    asig = ASIGNATURAS[codigo]
    secciones = _parsear_skills(asig.get("prompt_especifico", ""))
    return JSONResponse({
        "codigo": codigo,
        "nombre": asig["nombre"],
        "secciones": [{"titulo": s["titulo"], "items": s["items"]} for s in secciones],
    })


def _limpiar_html(texto: str) -> str:
    if texto.startswith("```html"):
        texto = texto[7:]
    elif texto.startswith("```"):
        texto = texto[3:]
    if texto.endswith("```"):
        texto = texto[:-3]
    return texto.strip()


@app.post("/api/convertir")
async def convertir(
    pdf: UploadFile = File(...),
    asignatura: str = Form(...),
    modelo: str = Form(default="gemini-2.5-flash"),
    skills_activos: str = Form(default=""),
    skills_custom: str = Form(default=""),
    user: dict = Depends(sesion_activa),
):
    if asignatura not in ASIGNATURAS:
        raise HTTPException(status_code=400, detail=f"Asignatura desconocida: {asignatura}")

    nombre_archivo = pdf.filename or ""
    if not nombre_archivo.lower().endswith(".pdf") and pdf.content_type not in (
        "application/pdf", "application/octet-stream",
    ):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")

    pdf_bytes = await pdf.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="El archivo PDF está vacío.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        asig = ASIGNATURAS[asignatura]
        log.info("▶ %s | %s | %s | %d bytes | usuario: %s",
                 asignatura, asig["nombre"], modelo, len(pdf_bytes), user["email"])

        if skills_activos.strip():
            try:
                indices = [i for i in json.loads(skills_activos) if isinstance(i, int) and i >= 0]
                prompt = _construir_prompt_filtrado(asignatura, indices)
                log.info("Skills activas: %d/%d secciones", len(indices),
                         len(_parsear_skills(asig.get("prompt_especifico", ""))))
            except (json.JSONDecodeError, Exception):
                prompt = construir_prompt_completo(asignatura)
        else:
            prompt = construir_prompt_completo(asignatura)

        if skills_custom.strip():
            try:
                textos = [t.strip() for t in json.loads(skills_custom) if t.strip()]
                for texto in textos:
                    prompt += f"\n\n<instruccion_adicional>\n{texto}\n</instruccion_adicional>"
                if textos:
                    log.info("Instrucciones personalizadas: %d", len(textos))
            except (json.JSONDecodeError, Exception):
                pass
        client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)

        with open(tmp_path, "rb") as f:
            datos_pdf = f.read()

        response = client.models.generate_content(
            model=modelo,
            contents=[
                types.Part.from_bytes(data=datos_pdf, mime_type="application/pdf"),
                prompt,
            ],
            config=types.GenerateContentConfig(max_output_tokens=65536),
        )

        # --- 💰 CÁLCULO DE COSTE AÑADIDO AQUÍ ---
        try:
            tokens_in = response.usage_metadata.prompt_token_count
            tokens_out = response.usage_metadata.candidates_token_count

            # Asignar tarifas según el modelo seleccionado
            if "pro" in modelo:
                precio_in, precio_out = 1.25, 10.00
            else: 
                # Tarifas para gemini-2.5-flash
                precio_in, precio_out = 0.075, 0.30 

            coste_llamada = ((tokens_in / 1_000_000) * precio_in) + ((tokens_out / 1_000_000) * precio_out)
            
            # Registramos el coste usando el logger existente
            log.info("💰 Coste Vertex AI [%s]: $%.6f (Tokens -> In: %d | Out: %d)", 
                     modelo, coste_llamada, tokens_in, tokens_out)
        except Exception as e:
            log.warning("No se pudo extraer el uso de tokens: %s", e)
        # -----------------------------------------

        html = _limpiar_html(response.text or "")
        log.info("✓ HTML generado — %d chars", len(html))

        await asyncio.to_thread(
            _guardar_conversion_gcs,
            asignatura, asig["nombre"], nombre_archivo, modelo, user["email"], html,
        )

        return JSONResponse({"html": html, "asignatura": asignatura, "nombre": asig["nombre"]})

    except HTTPException:
        raise
    except Exception as exc:
        log.exception("Error en la conversión")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        os.unlink(tmp_path)


def _ejecutar_auditoria(html: str) -> dict:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        raise RuntimeError("Playwright no instalado. Ejecuta: pip install playwright && playwright install chromium")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html, wait_until="domcontentloaded")
        page.add_script_tag(url="https://cdn.jsdelivr.net/npm/axe-core/axe.min.js")
        results = page.evaluate("axe.run()")
        browser.close()
    return results


@app.post("/api/auditar-accesibilidad")
async def auditar_accesibilidad(
    html: str = Form(...),
    _user: dict = Depends(sesion_activa),
):
    import asyncio
    try:
        results = await asyncio.to_thread(_ejecutar_auditoria, html)
    except RuntimeError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc

    violations = [
        {
            "id": v["id"],
            "impact": v["impact"],
            "description": v["description"],
            "help": v["help"],
            "helpUrl": v["helpUrl"],
            "nodos": len(v["nodes"]),
        }
        for v in results.get("violations", [])
    ]

    return JSONResponse({
        "violations": violations,
        "passes": len(results.get("passes", [])),
    })


def _guardar_conversion_gcs(
    asignatura: str, nombre_asig: str, pdf_nombre: str,
    modelo: str, usuario: str, html: str,
) -> None:
    if not GCS_BUCKET:
        return
    try:
        item_id = _uuid.uuid4().hex[:12]
        fecha = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        meta = json.dumps({
            "id": item_id, "asignatura": asignatura, "nombre_asig": nombre_asig,
            "pdf_nombre": pdf_nombre, "modelo": modelo, "fecha": fecha, "usuario": usuario,
        }, ensure_ascii=False)
        bucket = _gcs.Client().bucket(GCS_BUCKET)
        bucket.blob(f"meta/{asignatura}/{item_id}.json").upload_from_string(
            meta, content_type="application/json"
        )
        bucket.blob(f"html/{asignatura}/{item_id}.html").upload_from_string(
            html, content_type="text/html; charset=utf-8"
        )
        log.info("Guardado en GCS: %s/%s", asignatura, item_id)
    except Exception as exc:
        log.warning("Error guardando en GCS: %s", exc)


@app.get("/api/historial")
async def listar_historial(_user: dict = Depends(sesion_activa)):
    if not GCS_BUCKET:
        return JSONResponse({"grupos": []})

    def _listar():
        cliente = _gcs.Client()
        items = []
        for blob in cliente.list_blobs(GCS_BUCKET, prefix="meta/"):
            if not blob.name.endswith(".json"):
                continue
            try:
                items.append(json.loads(blob.download_as_text()))
            except Exception:
                continue
        return items

    try:
        items = await asyncio.to_thread(_listar)
        grupos: dict = {}
        for item in sorted(items, key=lambda x: x.get("fecha", ""), reverse=True):
            asig = item.get("asignatura", "")
            if asig not in grupos:
                grupos[asig] = {
                    "asignatura": asig,
                    "nombre_asig": item.get("nombre_asig", asig),
                    "items": [],
                }
            grupos[asig]["items"].append(item)
        return JSONResponse({"grupos": list(grupos.values())})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.delete("/api/historial/{asignatura}/{item_id}")
async def eliminar_historial(
    asignatura: str, item_id: str, _user: dict = Depends(sesion_activa),
):
    if not GCS_BUCKET:
        raise HTTPException(status_code=404, detail="Historial no configurado")
    try:
        def _eliminar():
            bucket = _gcs.Client().bucket(GCS_BUCKET)
            for path in [f"meta/{asignatura}/{item_id}.json", f"html/{asignatura}/{item_id}.html"]:
                blob = bucket.blob(path)
                if blob.exists():
                    blob.delete()
        await asyncio.to_thread(_eliminar)
        log.info("Eliminado de GCS: %s/%s", asignatura, item_id)
        return JSONResponse({"ok": True})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/historial/{asignatura}/{item_id}")
async def obtener_html_historial(
    asignatura: str, item_id: str, _user: dict = Depends(sesion_activa),
):
    if not GCS_BUCKET:
        raise HTTPException(status_code=404, detail="Historial no configurado")
    try:
        def _descargar():
            return _gcs.Client().bucket(GCS_BUCKET).blob(
                f"html/{asignatura}/{item_id}.html"
            ).download_as_text()
        return JSONResponse({"html": await asyncio.to_thread(_descargar)})
    except Exception as exc:
        raise HTTPException(status_code=404, detail="No encontrado") from exc


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)