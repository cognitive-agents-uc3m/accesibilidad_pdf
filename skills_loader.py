import logging
import re
from pathlib import Path

log = logging.getLogger("skills_loader")

_SKILLS_DIR = Path(__file__).parent / ".gemini" / "skills"


def _parse_skill(path: Path) -> tuple[str, dict] | tuple[None, None]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n(.*)", text, re.DOTALL)
    if not match:
        log.warning("Sin frontmatter válido: %s", path)
        return None, None

    metadata: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            metadata[key.strip()] = value.strip()

    codigo = metadata.get("codigo")
    nombre = metadata.get("nombre")
    if not codigo or not nombre:
        log.warning("Falta 'codigo' o 'nombre' en: %s", path)
        return None, None

    return codigo, {
        "nombre": nombre,
        "curso": int(metadata.get("curso", 0)),
        "cuatrimestre": int(metadata.get("cuatrimestre", 0)),
        "prompt_especifico": match.group(2).strip(),
    }


def cargar_skills() -> dict:
    asignaturas = {}
    for skill_md in sorted(_SKILLS_DIR.glob("*/SKILL.md")):
        codigo, datos = _parse_skill(skill_md)
        if codigo:
            asignaturas[codigo] = datos
    log.info("%d skills cargadas: %s", len(asignaturas), sorted(asignaturas.keys()))
    return asignaturas
