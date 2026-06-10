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

function añadirSkillPersonalizada(texto) {
  const id = customSkillNextId++;
  customSkills.set(id, texto);

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
    div.remove();
  });

  skillsContenido.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
  customSkills.clear();
  customSkillNextId = 0;
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
  const nombre = (selectAsignatura.value || 'documento').toLowerCase() + '_accesible.html';
  const blob = new Blob([htmlActual], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
});

document.getElementById('btn-copiar').addEventListener('click', async () => {
  await navigator.clipboard.writeText(htmlActual);
  const btn = document.getElementById('btn-copiar');
  btn.textContent = '¡Copiado!';
  setTimeout(() => {
    btn.innerHTML = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/></svg> Copiar código`;
  }, 2000);
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
document.getElementById('tab-preview').addEventListener('click', () => {
  document.getElementById('tab-preview').classList.add('activa');
  document.getElementById('tab-preview').setAttribute('aria-selected', 'true');
  document.getElementById('tab-codigo').classList.remove('activa');
  document.getElementById('tab-codigo').setAttribute('aria-selected', 'false');
  document.getElementById('panel-preview').hidden = false;
  document.getElementById('panel-codigo').hidden = true;
});

document.getElementById('tab-codigo').addEventListener('click', () => {
  document.getElementById('tab-codigo').classList.add('activa');
  document.getElementById('tab-codigo').setAttribute('aria-selected', 'true');
  document.getElementById('tab-preview').classList.remove('activa');
  document.getElementById('tab-preview').setAttribute('aria-selected', 'false');
  document.getElementById('panel-codigo').hidden = false;
  document.getElementById('panel-preview').hidden = true;
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
