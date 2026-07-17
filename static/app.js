/* ── Selección de asignatura ──────────────────────────────────────────────── */
const selectAsignatura = document.getElementById('asignatura');
const asignaturaElegida = document.getElementById('asignatura-elegida');
const nombreElegido = document.getElementById('nombre-elegido');
const codigoElegido = document.getElementById('codigo-elegido');
const btnConvertir = document.getElementById('btn-convertir');
const panelSkills = document.getElementById('panel-skills');
const skillsAsigNombre = document.getElementById('skills-asig-nombre');
const skillsContenido = document.getElementById('skills-contenido');
const btnAnadirSkill = document.getElementById('btn-anadir-skill');
const formSkillCustom = document.getElementById('form-skill-custom');
const textareaSkillCustom = document.getElementById('textarea-skill-custom');
const btnVerificarCompat = document.getElementById('btn-verificar-compat');
const panelCompat = document.getElementById('panel-compat');

/* ── Skills personalizadas ────────────────────────────────────────────────── */
const customSkills = new Map(); // id → texto
let customSkillNextId = 0;
const STORAGE_KEY = 'accesibilidad-custom-skills';

function guardarCustomSkills() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...customSkills.values()]));
}

btnAnadirSkill.addEventListener('click', () => {
  formSkillCustom.hidden = false;
  btnAnadirSkill.hidden = true;
  textareaSkillCustom.focus();
});

document.getElementById('btn-cancelar-skill').addEventListener('click', () => {
  formSkillCustom.hidden = true;
  btnAnadirSkill.hidden = false;
  textareaSkillCustom.value = '';
});

document.getElementById('btn-confirmar-skill').addEventListener('click', () => {
  const texto = textareaSkillCustom.value.trim();
  if (!texto) { textareaSkillCustom.focus(); return; }
  añadirSkillPersonalizada(texto);
  textareaSkillCustom.value = '';
  formSkillCustom.hidden = true;
  btnAnadirSkill.hidden = false;
});

textareaSkillCustom.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('btn-cancelar-skill').click();
});

function _crearElementoCustomSkill(id, texto) {
  const preview = texto.length > 120 ? texto.slice(0, 120) + '…' : texto;
  const div = document.createElement('div');
  div.className = 'skill-seccion skill-custom';
  div.dataset.customId = id;
  div.innerHTML = `
    <div class="skill-seccion-cabecera skill-custom-cabecera">
      <input type="checkbox" class="skill-checkbox skill-checkbox-custom"
             id="skill-custom-${id}" checked
             aria-label="Activar instrucción personalizada ${id + 1}">
      <label class="skill-seccion-titulo" for="skill-custom-${id}">Instrucción personalizada</label>
      <button type="button" class="btn-borrar-skill" aria-label="Eliminar instrucción personalizada">×</button>
    </div>
    <p class="skill-custom-preview">${esc(preview)}</p>`;

  div.querySelector('.skill-checkbox-custom').addEventListener('change', e => {
    div.classList.toggle('skill-desactivada', !e.target.checked);
  });

  div.querySelector('.btn-borrar-skill').addEventListener('click', () => {
    customSkills.delete(id);
    guardarCustomSkills();
    div.remove();
  });

  return div;
}

function añadirSkillPersonalizada(texto) {
  const id = customSkillNextId++;
  customSkills.set(id, texto);
  guardarCustomSkills();
  const div = _crearElementoCustomSkill(id, texto);
  skillsContenido.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _restaurarCustomSkillsEnDOM() {
  for (const [id, texto] of customSkills) {
    skillsContenido.appendChild(_crearElementoCustomSkill(id, texto));
  }
}

function restaurarCustomSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const textos = JSON.parse(saved);
    if (Array.isArray(textos)) textos.forEach(t => { customSkills.set(customSkillNextId++, t); });
  } catch { }
}

function obtenerSkillsCustomActivos() {
  const activos = [];
  skillsContenido.querySelectorAll('.skill-custom').forEach(div => {
    const id = parseInt(div.dataset.customId, 10);
    const cb = div.querySelector('.skill-checkbox-custom');
    if (cb?.checked && customSkills.has(id)) activos.push(customSkills.get(id));
  });
  return activos;
}

function desactivarInstruccion(fuente) {
  if (!fuente || fuente === 'BASE_PROMPT') return false;

  if (fuente.startsWith('SKILL: ')) {
    const titulo = fuente.slice(7).trim();
    for (const label of skillsContenido.querySelectorAll('label.skill-seccion-titulo')) {
      if (label.textContent.trim() === titulo) {
        const cb = document.getElementById(label.getAttribute('for'));
        if (cb && !cb.classList.contains('skill-checkbox-custom')) {
          cb.checked = false;
          cb.dispatchEvent(new Event('change'));
          return true;
        }
      }
    }
  }

  if (fuente.startsWith('PERSONALIZADA ')) {
    const n = parseInt(fuente.replace('PERSONALIZADA ', '').trim(), 10);
    const customs = [...skillsContenido.querySelectorAll('.skill-custom')];
    if (n >= 1 && n <= customs.length) {
      customs[n - 1].querySelector('.btn-borrar-skill')?.click();
      return true;
    }
  }

  return false;
}

function resetearCustomSkills() {
  formSkillCustom.hidden = true;
  btnAnadirSkill.hidden = false;
  textareaSkillCustom.value = '';
  panelCompat.hidden = true;
  panelCompat.innerHTML = '';
}

/* ── Verificar compatibilidad ─────────────────────────────────────────────── */
btnVerificarCompat.addEventListener('click', async () => {
  panelCompat.hidden = false;
  panelCompat.innerHTML = '<p class="compat-cargando"><span class="compat-spinner" aria-hidden="true"></span>Verificando compatibilidad…</p>';
  btnVerificarCompat.disabled = true;

  try {
    const fd = new FormData();
    fd.append('asignatura', selectAsignatura.value);
    const activos = obtenerSkillsActivos();
    if (activos !== null) fd.append('skills_activos', JSON.stringify(activos));
    const custom = obtenerSkillsCustomActivos();
    if (custom.length) fd.append('skills_custom', JSON.stringify(custom));

    const resp = await fetch('/api/check-contradicciones', { method: 'POST', body: fd });
    const data = await resp.json();

    if (!resp.ok) {
      panelCompat.innerHTML = `<p class="compat-cargando">Error: ${esc(data.detail || 'Error desconocido')}</p>`;
      return;
    }

    if (data.compatible) {
      panelCompat.innerHTML = `<p class="compat-ok"><span aria-hidden="true">✓</span> Sin contradicciones detectadas</p>`;
    } else {
      const items = (data.contradicciones || []).map(c => {
        // Solo mostrar "Usar esta" si la otra parte NO es BASE_PROMPT (no se puede desactivar)
        const btnEnA = c.fuente_b !== 'BASE_PROMPT'
          ? `<button type="button" class="btn-usar-esta" data-desactivar="b">Usar esta</button>` : '';
        const btnEnB = c.fuente_a !== 'BASE_PROMPT'
          ? `<button type="button" class="btn-usar-esta" data-desactivar="a">Usar esta</button>` : '';
        return `
          <div class="compat-conflicto"
               data-fuente-a="${esc(c.fuente_a)}"
               data-fuente-b="${esc(c.fuente_b)}">
            <p class="compat-conflicto-cabecera">⚠ Posible contradicción</p>
            <div class="compat-par">
              <span class="compat-fuente">${esc(c.fuente_a)}</span>
              <span class="compat-fragmento">"${esc(c.fragmento_a)}"</span>
              ${btnEnA}
            </div>
            <div class="compat-par">
              <span class="compat-fuente">${esc(c.fuente_b)}</span>
              <span class="compat-fragmento">"${esc(c.fragmento_b)}"</span>
              ${btnEnB}
            </div>
            <p class="compat-motivo">${esc(c.motivo)}</p>
          </div>`;
      }).join('');
      panelCompat.innerHTML = `<div class="compat-lista">${items}</div>`;

      panelCompat.querySelectorAll('.compat-conflicto').forEach(div => {
        const fuenteA = div.dataset.fuenteA;
        const fuenteB = div.dataset.fuenteB;
        div.querySelectorAll('.btn-usar-esta').forEach(btn => {
          btn.addEventListener('click', () => {
            const fuenteDesactivar = btn.dataset.desactivar === 'a' ? fuenteA : fuenteB;
            if (desactivarInstruccion(fuenteDesactivar)) {
              div.classList.add('compat-resuelto');
              div.querySelectorAll('.btn-usar-esta').forEach(b => {
                b.disabled = true;
                b.textContent = b === btn ? '✓ Activa' : '✗ Desactivada';
              });
            }
          });
        });
      });
    }
  } catch (err) {
    panelCompat.innerHTML = `<p class="compat-cargando">No se pudo verificar: ${esc(err.message)}</p>`;
  } finally {
    btnVerificarCompat.disabled = false;
  }
});

selectAsignatura.addEventListener('change', () => {
  const opt = selectAsignatura.options[selectAsignatura.selectedIndex];
  if (selectAsignatura.value) {
    nombreElegido.textContent = opt.dataset.nombre;
    codigoElegido.textContent = selectAsignatura.value;
    asignaturaElegida.hidden = false;
    if (estadoPanel === 'placeholder' || estadoPanel === 'skills') {
      cargarSkills(selectAsignatura.value, opt.dataset.nombre);
    }
  } else {
    asignaturaElegida.hidden = true;
    if (estadoPanel === 'skills') mostrarPanel('placeholder');
  }
  actualizarBoton();
});

async function cargarSkills(codigo, nombre) {
  resetearCustomSkills();
  skillsAsigNombre.textContent = nombre;
  skillsContenido.innerHTML = '<p class="skills-cargando">Cargando instrucciones…</p>';
  mostrarPanel('skills');
  try {
    const resp = await fetch(`/api/skills/${encodeURIComponent(codigo)}`);
    const data = await resp.json();
    if (!resp.ok || !data.secciones?.length) {
      skillsContenido.innerHTML = '<p class="skills-vacio">Sin instrucciones específicas para esta asignatura.</p>';
      return;
    }
    skillsContenido.innerHTML = data.secciones.map((sec, i) => `
      <div class="skill-seccion" data-index="${i}">
        <div class="skill-seccion-cabecera">
          <input type="checkbox" class="skill-checkbox" id="skill-sec-${i}" data-index="${i}" checked
                 aria-label="Activar instrucción: ${esc(sec.titulo)}">
          <label class="skill-seccion-titulo" for="skill-sec-${i}">${esc(sec.titulo)}</label>
        </div>
        <ul class="skill-items">
          ${sec.items.map(item => `<li>${esc(item)}</li>`).join('')}
        </ul>
      </div>`).join('');

    skillsContenido.querySelectorAll('.skill-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.skill-seccion').classList.toggle('skill-desactivada', !cb.checked);
      });
    });
  } catch {
    skillsContenido.innerHTML = '<p class="skills-vacio">No se pudieron cargar las instrucciones.</p>';
  } finally {
    _restaurarCustomSkillsEnDOM();
  }
}

function obtenerSkillsActivos() {
  const checkboxes = skillsContenido.querySelectorAll('.skill-checkbox:not(.skill-checkbox-custom)');
  if (!checkboxes.length) return null;
  const activos = [];
  checkboxes.forEach(cb => { if (cb.checked) activos.push(parseInt(cb.dataset.index, 10)); });
  return activos;
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Carga de PDF ─────────────────────────────────────────────────────────── */
const zonaDropEl = document.getElementById('zona-drop');
const pdfInput = document.getElementById('pdf-input');
const archivoElegido = document.getElementById('archivo-elegido');
const nombreArchivo = document.getElementById('nombre-archivo');
const tamanoArchivo = document.getElementById('tamano-archivo');

function formatearTamano(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function mostrarArchivo(file) {
  nombreArchivo.textContent = file.name;
  tamanoArchivo.textContent = formatearTamano(file.size);
  archivoElegido.hidden = false;
  actualizarBoton();
}

zonaDropEl.addEventListener('click', e => { if (e.target !== pdfInput) pdfInput.click(); });
zonaDropEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pdfInput.click(); }
});
zonaDropEl.addEventListener('dragover', e => { e.preventDefault(); zonaDropEl.classList.add('arrastrando'); });
zonaDropEl.addEventListener('dragleave', () => zonaDropEl.classList.remove('arrastrando'));
zonaDropEl.addEventListener('drop', e => {
  e.preventDefault();
  zonaDropEl.classList.remove('arrastrando');
  const file = e.dataTransfer.files[0];
  if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    const dt = new DataTransfer();
    dt.items.add(file);
    pdfInput.files = dt.files;
    mostrarArchivo(file);
  }
});
pdfInput.addEventListener('change', () => { if (pdfInput.files[0]) mostrarArchivo(pdfInput.files[0]); });

function actualizarBoton() {
  btnConvertir.disabled = !(selectAsignatura.value && pdfInput.files[0]);
}

/* ── Envío del formulario ─────────────────────────────────────────────────── */
const form = document.getElementById('form-conversion');
const placeholder = document.getElementById('placeholder-inicial');
const estadoConversion = document.getElementById('estado-conversion');
const zonaError = document.getElementById('zona-error');
const mensajeError = document.getElementById('mensaje-error');
const zonaResultado = document.getElementById('zona-resultado');
const nombreResultado = document.getElementById('nombre-resultado');
const iframePreview = document.getElementById('iframe-preview');
const textareaHtml = document.getElementById('textarea-html');

let htmlActual = '';
let estadoPanel = 'placeholder'; // 'placeholder' | 'skills' | 'cargando' | 'error' | 'resultado'

const panelEstado = document.getElementById('panel-estado');

function mostrarPanel(estado) {
  estadoPanel = estado;
  placeholder.hidden       = estado !== 'placeholder';
  panelSkills.hidden        = estado !== 'skills';
  estadoConversion.hidden   = estado !== 'cargando';
  zonaError.hidden          = estado !== 'error';
  zonaResultado.hidden      = estado !== 'resultado';

  if (estado === 'skills') {
    panelEstado.setAttribute('aria-label', 'Instrucciones activas');
  } else if (estado === 'resultado') {
    panelEstado.setAttribute('aria-label', 'Resultado de la conversión');
    document.getElementById('titulo-resultado').focus();
  } else if (estado === 'cargando') {
    panelEstado.setAttribute('aria-label', 'Estado de la conversión');
    estadoConversion.focus();
  } else if (estado === 'error') {
    panelEstado.setAttribute('aria-label', 'Estado de la conversión');
    zonaError.focus();
  } else {
    panelEstado.setAttribute('aria-label', 'Estado de la conversión');
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  mostrarPanel('cargando');
  btnConvertir.disabled = true;

  try {
    const formData = new FormData(form);
    const skillsActivos = obtenerSkillsActivos();
    if (skillsActivos !== null) formData.append('skills_activos', JSON.stringify(skillsActivos));
    const skillsCustom = obtenerSkillsCustomActivos();
    if (skillsCustom.length) formData.append('skills_custom', JSON.stringify(skillsCustom));
    const resp = await fetch('/api/convertir', { method: 'POST', body: formData });
    const data = await resp.json();

    if (resp.status === 401) {
      window.location.href = '/login';
      return;
    }

    if (!resp.ok) {
      mostrarPanel('error');
      mensajeError.textContent = data.detail || 'Error desconocido.';
      return;
    }

    htmlActual = data.html;
    nombreResultado.textContent = data.nombre;

    const blob = new Blob([data.html], { type: 'text/html' });
    iframePreview.src = URL.createObjectURL(blob);
    textareaHtml.value = data.html;
    mostrarPanel('resultado');

  } catch (err) {
    mostrarPanel('error');
    mensajeError.textContent = 'No se pudo conectar con el servidor: ' + err.message;
  } finally {
    actualizarBoton();
  }
});

/* ── Acciones del resultado ───────────────────────────────────────────────── */
document.getElementById('btn-descargar').addEventListener('click', () => {
  const nombre = (selectAsignatura.value || 'documento').toLowerCase();
  const blob = new Blob([htmlActual], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre + '_accesible.html';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('btn-copiar').addEventListener('click', async () => {
  await navigator.clipboard.writeText(htmlActual);
  const aviso = document.getElementById('aviso-copiado');
  aviso.textContent = 'Copiado al portapapeles';
  setTimeout(() => { aviso.textContent = ''; }, 2000);
});

document.getElementById('btn-auditar').addEventListener('click', async () => {
  const btn = document.getElementById('btn-auditar');
  btn.disabled = true;
  btn.textContent = 'Auditando…';
  activarTab('tab-auditoria');

  const contenido = document.getElementById('auditoria-contenido');
  contenido.innerHTML = '<p class="auditoria-placeholder">Analizando el documento…</p>';

  try {
    const fd = new FormData();
    fd.append('html', htmlActual);
    const resp = await fetch('/api/auditar-accesibilidad', { method: 'POST', body: fd });
    if (resp.status === 401) { window.location.href = '/login'; return; }
    const data = await resp.json();

    if (!resp.ok) {
      contenido.innerHTML = `<p class="auditoria-error">${data.detail || 'Error al auditar.'}</p>`;
      return;
    }

    const { violations, passes } = data;
    const impactoLabel = { critical: 'Crítico', serious: 'Grave', moderate: 'Moderado', minor: 'Menor' };
    const impactoClase = { critical: 'impacto-critical', serious: 'impacto-serious', moderate: 'impacto-moderate', minor: 'impacto-minor' };

    if (violations.length === 0) {
      contenido.innerHTML = `
        <div class="auditoria-ok">
          <p>✓ Sin violaciones detectadas. ${passes} criterios superados.</p>
        </div>`;
      return;
    }

    const resumen = ['critical', 'serious', 'moderate', 'minor'].map(imp => {
      const n = violations.filter(v => v.impact === imp).length;
      return n > 0 ? `<span class="resumen-badge ${impactoClase[imp]}">${impactoLabel[imp]}: ${n}</span>` : '';
    }).join('');

    const lista = violations.map(v => `
      <li class="violacion-item">
        <div class="violacion-cabecera">
          <span class="violacion-badge ${impactoClase[v.impact]}">${impactoLabel[v.impact] || v.impact}</span>
          <code class="violacion-id">${v.id}</code>
          <span class="violacion-nodos">${v.nodos} elemento${v.nodos !== 1 ? 's' : ''}</span>
        </div>
        <p class="violacion-desc">${esc(v.help)}</p>
        <a class="violacion-link" href="${v.helpUrl}" target="_blank" rel="noopener">Ver criterio WCAG</a>
      </li>`).join('');

    contenido.innerHTML = `
      <div class="auditoria-resumen">
        <strong>${violations.length} violación${violations.length !== 1 ? 'es' : ''}</strong> · ${passes} criterios superados
        <div class="resumen-badges">${resumen}</div>
      </div>
      <ul class="violaciones-lista">${lista}</ul>`;

  } catch (err) {
    contenido.innerHTML = `<p class="auditoria-error">Error de conexión: ${err.message}</p>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Auditar WCAG';
  }
});

document.getElementById('btn-nueva-conversion').addEventListener('click', () => {
  form.reset();
  archivoElegido.hidden = true;
  asignaturaElegida.hidden = true;
  resetearCustomSkills();
  actualizarBoton();
  mostrarPanel('placeholder');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  selectAsignatura.focus();
});

/* ── Pestañas ─────────────────────────────────────────────────────────────── */
const TABS = [
  { tab: 'tab-preview',   panel: 'panel-preview' },
  { tab: 'tab-codigo',    panel: 'panel-codigo' },
  { tab: 'tab-auditoria', panel: 'panel-auditoria' },
];

function activarTab(idTab) {
  TABS.forEach(({ tab, panel }) => {
    const esActiva = tab === idTab;
    document.getElementById(tab).classList.toggle('activa', esActiva);
    document.getElementById(tab).setAttribute('aria-selected', String(esActiva));
    document.getElementById(panel).hidden = !esActiva;
  });
}

TABS.forEach(({ tab }) => {
  document.getElementById(tab).addEventListener('click', () => activarTab(tab));
});

restaurarCustomSkills();

/* ── Historial ────────────────────────────────────────────────────────────── */
let historialGrupos = [];
let historialAsigActual = null;
let historialItemActual = null;

function formatearFecha(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function cargarHistorial() {
  const lista = document.getElementById('historial-asig-lista');
  lista.innerHTML = '<p class="historial-cargando">Cargando…</p>';
  try {
    const resp = await fetch('/api/historial');
    if (resp.status === 401) { window.location.href = '/login'; return; }
    const data = await resp.json();
    historialGrupos = data.grupos || [];
    renderizarSidebar();
  } catch (err) {
    lista.innerHTML = `<p class="historial-cargando">Error al cargar: ${esc(err.message)}</p>`;
  }
}

function renderizarSidebar() {
  const lista = document.getElementById('historial-asig-lista');
  if (!historialGrupos.length) {
    lista.innerHTML = '<p class="historial-cargando">Aún no hay contenido generado.</p>';
    return;
  }
  lista.innerHTML = historialGrupos.map(g => `
    <button class="historial-asig-item${historialAsigActual === g.asignatura ? ' activa' : ''}"
            data-asig="${esc(g.asignatura)}" aria-pressed="${historialAsigActual === g.asignatura}">
      <span class="historial-asig-nombre">${esc(g.nombre_asig)}</span>
      <span class="historial-asig-badge">${g.items.length}</span>
    </button>`).join('');
  lista.querySelectorAll('.historial-asig-item').forEach(btn => {
    btn.addEventListener('click', () => seleccionarAsignatura(btn.dataset.asig));
  });
}

function seleccionarAsignatura(asig) {
  historialAsigActual = asig;
  historialItemActual = null;
  renderizarSidebar();
  mostrarVistaHistorial('lista');
  const grupo = historialGrupos.find(g => g.asignatura === asig);
  if (!grupo) return;
  document.getElementById('historial-lista-titulo').textContent = grupo.nombre_asig;
  document.getElementById('historial-lista-count').textContent =
    `${grupo.items.length} documento${grupo.items.length !== 1 ? 's' : ''}`;
  const ul = document.getElementById('historial-docs');
  ul.innerHTML = grupo.items.map(item => `
    <li class="historial-doc-card">
      <div class="historial-doc-info">
        <p class="historial-doc-nombre">${esc(item.pdf_nombre || 'Documento')}</p>
        <p class="historial-doc-meta">
          <span>${formatearFecha(item.fecha)}</span>
          <span>${esc(item.modelo || '')}</span>
          <span>${esc(item.usuario || '')}</span>
        </p>
      </div>
      <div class="historial-doc-acciones">
        <button class="btn-ver-doc" data-id="${esc(item.id)}" data-asig="${esc(item.asignatura)}"
                data-nombre="${esc(item.pdf_nombre || 'Documento')}">
          Ver
        </button>
        <button class="btn-borrar-doc" data-id="${esc(item.id)}" data-asig="${esc(item.asignatura)}"
                aria-label="Eliminar ${esc(item.pdf_nombre || 'documento')}">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
          </svg>
        </button>
      </div>
    </li>`).join('');
  ul.querySelectorAll('.btn-ver-doc').forEach(btn => {
    btn.addEventListener('click', () => verDocumento(btn.dataset.asig, btn.dataset.id, btn.dataset.nombre));
  });
  ul.querySelectorAll('.btn-borrar-doc').forEach(btn => {
    btn.addEventListener('click', () => eliminarDocumento(btn.dataset.asig, btn.dataset.id, btn.closest('li')));
  });
}

async function verDocumento(asig, id, nombre) {
  historialItemActual = { asig, id, nombre };
  mostrarVistaHistorial('visor');
  document.getElementById('historial-visor-titulo').textContent = nombre;
  const iframe = document.getElementById('historial-iframe');
  iframe.src = '';
  try {
    const resp = await fetch(`/api/historial/${encodeURIComponent(asig)}/${encodeURIComponent(id)}`);
    if (!resp.ok) throw new Error('No encontrado');
    const { html } = await resp.json();
    const blob = new Blob([html], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
    document.getElementById('historial-btn-descargar').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nombre.replace(/\.pdf$/i, '') + '_accesible.html';
      a.click();
    };
  } catch (err) {
    iframe.srcdoc = `<p style="padding:2rem;color:red">Error al cargar: ${esc(err.message)}</p>`;
  }
}

async function eliminarDocumento(asig, id, cardEl) {
  if (!confirm('¿Eliminar este documento del historial?')) return;
  try {
    const resp = await fetch(
      `/api/historial/${encodeURIComponent(asig)}/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    if (!resp.ok) throw new Error('Error al eliminar');
    cardEl.remove();
    const grupo = historialGrupos.find(g => g.asignatura === asig);
    if (grupo) {
      grupo.items = grupo.items.filter(i => i.id !== id);
      if (!grupo.items.length) {
        historialGrupos = historialGrupos.filter(g => g.asignatura !== asig);
        historialAsigActual = null;
        mostrarVistaHistorial('placeholder');
      } else {
        document.getElementById('historial-lista-count').textContent =
          `${grupo.items.length} documento${grupo.items.length !== 1 ? 's' : ''}`;
      }
      renderizarSidebar();
    }
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message);
  }
}

function mostrarVistaHistorial(sub) {
  document.getElementById('historial-placeholder').hidden = sub !== 'placeholder';
  document.getElementById('historial-lista').hidden = sub !== 'lista';
  document.getElementById('historial-visor').hidden = sub !== 'visor';
}

document.getElementById('historial-btn-volver').addEventListener('click', () => {
  if (historialAsigActual) seleccionarAsignatura(historialAsigActual);
  else mostrarVistaHistorial('placeholder');
});

/* ── Cambio de vista principal ────────────────────────────────────────────── */
const vistaConvertir  = document.getElementById('vista-convertir');
const vistaHistorial  = document.getElementById('vista-historial');
const btnConvertirTab = document.getElementById('btn-vista-convertir');
const btnHistorialTab = document.getElementById('btn-vista-historial');

btnConvertirTab.addEventListener('click', () => {
  vistaConvertir.hidden = false;
  vistaHistorial.hidden = true;
  btnConvertirTab.classList.add('activa');
  btnConvertirTab.setAttribute('aria-pressed', 'true');
  btnHistorialTab.classList.remove('activa');
  btnHistorialTab.setAttribute('aria-pressed', 'false');
});

btnHistorialTab.addEventListener('click', () => {
  vistaHistorial.hidden = false;
  vistaConvertir.hidden = true;
  btnHistorialTab.classList.add('activa');
  btnHistorialTab.setAttribute('aria-pressed', 'true');
  btnConvertirTab.classList.remove('activa');
  btnConvertirTab.setAttribute('aria-pressed', 'false');
  if (!historialGrupos.length) cargarHistorial();
});

/* ── Navegación de teclado en pestañas (ARIA tablist pattern) ─────────────── */
(function () {
  const tablist = document.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  tablist.addEventListener('keydown', e => {
    const idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next !== -1) {
      e.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    }
  });
})();
